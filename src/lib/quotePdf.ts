import { jsPDF } from "jspdf";
import type { EquipmentItem } from "@/types/equipment";

export type QuoteCustomer = {
  fullName: string;
  email: string;
  phone: string;
  interestType: "rent" | "buy";
  requestedDate: string;
};

export type QuotePdfLabels = {
  title: string;
  customerSection: string;
  equipmentSection: string;
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  rent: string;
  buy: string;
  requestedDate: string;
  manufacturer: string;
  model: string;
  category: string;
  capacity: string;
  year: string;
  fuel: string;
  workOrder: string;
  generatedAt: string;
  footer: string;
  noImage: string;
};

type ImageAsset = {
  dataUrl: string;
  format: "PNG" | "JPEG";
  width: number;
  height: number;
};

const LOGO_URL = "/SGS_LOGO.webp";
const WATERMARK_URL = "/SGS%20watermark.png";

function fitImageSize(
  naturalW: number,
  naturalH: number,
  maxW: number,
  maxH: number
): { w: number; h: number } {
  const ratio = naturalW / Math.max(naturalH, 1);
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  return { w, h };
}

/** Convierte a JPEG vía canvas para compatibilidad con jsPDF (incl. WEBP). */
async function urlToDataUrl(url: string): Promise<ImageAsset | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("image load failed"));
        el.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      const maxSide = 800;
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return {
        dataUrl: canvas.toDataURL("image/jpeg", 0.85),
        format: "JPEG",
        width: img.naturalWidth,
        height: img.naturalHeight,
      };
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

function drawWatermark(doc: jsPDF, watermark: ImageAsset | null) {
  if (!watermark) return;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const max = Math.min(pageW, pageH) * 0.55;
  const { w, h } = fitImageSize(watermark.width, watermark.height, max, max);
  const x = (pageW - w) / 2;
  const y = (pageH - h) / 2;
  doc.saveGraphicsState();
  // jsPDF tipings mark GState as non-constructible; runtime accepts both forms.
  const GStateCtor = doc.GState as unknown as new (opts: { opacity: number }) => object;
  doc.setGState(new GStateCtor({ opacity: 0.08 }));
  try {
    doc.addImage(watermark.dataUrl, watermark.format, x, y, w, h, undefined, "FAST");
  } catch {
    // skip if format unsupported
  }
  doc.restoreGraphicsState();
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight = 5
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export async function downloadQuotePdf(opts: {
  customer: QuoteCustomer;
  equipment: EquipmentItem[];
  labels: QuotePdfLabels;
  categoryLabel: (type: string) => string;
  lang: "es" | "en";
}): Promise<void> {
  const { customer, equipment, labels, categoryLabel, lang } = opts;

  const [logo, watermark, ...photos] = await Promise.all([
    urlToDataUrl(LOGO_URL),
    urlToDataUrl(WATERMARK_URL),
    ...equipment.map((item) =>
      item.photoUrl ? urlToDataUrl(item.photoUrl) : Promise.resolve(null)
    ),
  ]);

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      drawWatermark(doc, watermark);
      y = margin;
    }
  };

  drawWatermark(doc, watermark);

  // Header — logo con proporción real (evita aplastarlo)
  const logoBox = logo
    ? fitImageSize(logo.width, logo.height, 28, 18)
    : { w: 0, h: 16 };

  if (logo) {
    try {
      doc.addImage(logo.dataUrl, logo.format, margin, y, logoBox.w, logoBox.h, undefined, "FAST");
    } catch {
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SGS Equipment", margin, y + 8);
    }
  } else {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("SGS Equipment", margin, y + 8);
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(labels.title, pageW - margin, y + logoBox.h * 0.35, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleString(lang === "es" ? "es-CO" : "en-US");
  doc.text(`${labels.generatedAt}: ${dateStr}`, pageW - margin, y + logoBox.h * 0.7, {
    align: "right",
  });

  y += logoBox.h + 6;
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  // Customer section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(labels.customerSection, margin, y);
  y += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  const interestLabel =
    customer.interestType === "rent" ? labels.rent : labels.buy;

  const customerRows: [string, string][] = [
    [labels.fullName, customer.fullName],
    [labels.email, customer.email],
    [labels.phone, customer.phone],
    [labels.interest, interestLabel],
    [labels.requestedDate, customer.requestedDate],
  ];

  for (const [label, value] of customerRows) {
    ensureSpace(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "—", margin + 42, y);
    y += 6;
  }

  y += 6;
  ensureSpace(12);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(labels.equipmentSection, margin, y);
  y += 8;

  equipment.forEach((item, index) => {
    const photo = photos[index];
    const cardH = photo ? 42 : 28;
    ensureSpace(cardH + 8);

    // Card background
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentW, cardH, 2, 2, "FD");

    const textX = margin + (photo ? 48 : 4);
    const textMaxW = contentW - (photo ? 52 : 8);
    let ty = y + 7;

    if (photo) {
      try {
        const thumb = fitImageSize(photo.width, photo.height, 40, 36);
        const tx = margin + 3 + (40 - thumb.w) / 2;
        const tyImg = y + 3 + (36 - thumb.h) / 2;
        doc.addImage(photo.dataUrl, photo.format, tx, tyImg, thumb.w, thumb.h, undefined, "FAST");
      } catch {
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(labels.noImage, margin + 10, y + 22);
      }
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    ty = addWrappedText(
      doc,
      `${item.manufacturer} ${item.model}`.trim() || item.displayName,
      textX,
      ty,
      textMaxW,
      5
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);

    const details: string[] = [
      `${labels.category}: ${categoryLabel(item.equipmentType)}`,
    ];
    if (item.capacity) details.push(`${labels.capacity}: ${item.capacity}`);
    if (item.mfgYear) details.push(`${labels.year}: ${item.mfgYear}`);
    if (item.fuelType) details.push(`${labels.fuel}: ${item.fuelType}`);
    if (item.title) details.push(`${labels.workOrder}: ${item.title}`);

    for (const line of details) {
      ty = addWrappedText(doc, line, textX, ty + 1, textMaxW, 4.2);
    }

    y += cardH + 5;
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(labels.footer, pageW / 2, doc.internal.pageSize.getHeight() - 8, {
      align: "center",
    });
    doc.text(`${i} / ${pageCount}`, pageW - margin, doc.internal.pageSize.getHeight() - 8, {
      align: "right",
    });
  }

  const safeName = customer.fullName
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 40);
  const filename = `SGS_Cotizacion_${safeName || "cliente"}_${customer.requestedDate || "sin_fecha"}.pdf`;
  doc.save(filename);
}
