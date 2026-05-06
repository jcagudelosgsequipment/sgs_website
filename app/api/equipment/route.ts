import type { EquipmentCategory, EquipmentItem } from "../../../src/types/equipment";

type GraphListItem = {
  fields?: Record<string, unknown>;
};

const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toBooleanValue(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

function pickFirstField(fields: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (key in fields) return fields[key];
  }
  return undefined;
}

function parsePhotoUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "";

  const trimmed = value.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as
        | Record<string, unknown>
        | Array<Record<string, unknown>>;
      const obj = Array.isArray(parsed) ? parsed[0] : parsed;
      if (!obj) return "";
      return (
        toStringValue(obj.serverRelativeUrl) ||
        toStringValue(obj.fileName) ||
        toStringValue(obj.url)
      );
    } catch {
      return "";
    }
  }

  return trimmed;
}

function toEquipmentCategory(rawValue: string): EquipmentCategory {
  const categories: EquipmentCategory[] = [
    "Belt Loader",
    "AC GPU",
    "DC GPU",
    "AC/DC GPU",
    "Baggage Tractor",
    "Passenger Stair",
    "Cargo Loader",
    "Air Conditioner (ACU)",
    "Air Start (ASU)",
    "Push Back Tractor",
    "Towbar",
    "Aerial Equipment",
    "Lavatory",
    "Water Service",
    "Dollies",
    "Baggage Carts",
    "Lektro",
    "Scissor Lift",
  ];

  return categories.includes(rawValue as EquipmentCategory)
    ? (rawValue as EquipmentCategory)
    : "Belt Loader";
}

async function getAccessToken(): Promise<string> {
  const tenantId = getEnv("SP_TENANT_ID");
  const clientId = getEnv("SP_CLIENT_ID");
  const clientSecret = getEnv("SP_CLIENT_SECRET");

  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to obtain Graph token: ${errorText}`);
  }

  const payload = (await response.json()) as { access_token?: string };
  if (!payload.access_token) {
    throw new Error("Graph token response did not include access_token.");
  }

  return payload.access_token;
}

async function getSiteId(accessToken: string): Promise<string> {
  const siteUrl = new URL(getEnv("SP_SITE_URL"));
  const path = siteUrl.pathname === "/" ? "" : siteUrl.pathname;
  const endpoint = `${GRAPH_BASE_URL}/sites/${siteUrl.hostname}:${path}?$select=id`;

  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to resolve site id: ${errorText}`);
  }

  const payload = (await response.json()) as { id?: string };
  if (!payload.id) {
    throw new Error("Site response did not include id.");
  }

  return payload.id;
}

async function getListItems(accessToken: string, siteId: string): Promise<GraphListItem[]> {
  const listName = getEnv("SP_LIST_NAME");
  const endpoint = `${GRAPH_BASE_URL}/sites/${siteId}/lists/${encodeURIComponent(
    listName,
  )}/items?$expand=fields`;

  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to fetch list items: ${errorText}`);
  }

  const payload = (await response.json()) as { value?: GraphListItem[] };
  return Array.isArray(payload.value) ? payload.value : [];
}

function mapItem(item: GraphListItem): EquipmentItem {
  const fields = item.fields ?? {};
  const manufacturer = toStringValue(
    pickFirstField(fields, ["Manufacturer", "manufacturer"]),
  );
  const model = toStringValue(pickFirstField(fields, ["Model", "model"]));
  const mfgYear = toStringValue(
    pickFirstField(fields, ["MfgYear", "MFGYear", "mfgYear", "Year"]),
  );
  const equipmentTypeRaw = toStringValue(
    pickFirstField(fields, ["EquipmentType", "Category", "equipmentType"]),
  );
  const capacity = toStringValue(pickFirstField(fields, ["Capacity", "capacity"]));
  const title = toStringValue(pickFirstField(fields, ["Title", "title"]));
  const fuelType = toStringValue(
    pickFirstField(fields, ["FuelType", "Fuel_x0020_Type", "Fuel Type"]),
  );
  const photoUrl = parsePhotoUrl(pickFirstField(fields, ["DevicePhoto", "devicePhoto"]));
  const isFeatured = toBooleanValue(
    pickFirstField(fields, ["IsFeatured", "isFeatured"]),
  );
  const addToWebsite = toBooleanValue(
    pickFirstField(fields, ["AddToWebsite", "addToWebsite"]),
  );

  return {
    manufacturer,
    model,
    mfgYear,
    equipmentType: toEquipmentCategory(equipmentTypeRaw),
    capacity,
    photoUrl,
    displayName: `${manufacturer}-${model} ${fuelType} ${equipmentTypeRaw} - ${title}`.trim(),
    isFeatured,
    addToWebsite,
  };
}

export async function GET(): Promise<Response> {
  try {
    const accessToken = await getAccessToken();
    const siteId = await getSiteId(accessToken);
    const listItems = await getListItems(accessToken, siteId);
    const equipment = listItems.map(mapItem).filter((item) => item.addToWebsite);

    return Response.json(equipment, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error fetching equipment.";
    return Response.json({ error: message }, { status: 500 });
  }
}
