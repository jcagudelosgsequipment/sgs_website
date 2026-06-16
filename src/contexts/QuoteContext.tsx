import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EquipmentItem } from "@/types/equipment";

const STORAGE_KEY = "sgs-quote-items";

function loadQuoteItems(): EquipmentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as EquipmentItem[]) : [];
  } catch {
    return [];
  }
}

type QuoteContextValue = {
  quoteItems: EquipmentItem[];
  addToQuote: (equipment: EquipmentItem) => void;
  removeFromQuote: (equipmentId: string | number) => void;
  clearQuote: () => void;
  isInQuote: (equipmentId: string | number) => boolean;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quoteItems, setQuoteItems] = useState<EquipmentItem[]>(loadQuoteItems);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quoteItems));
  }, [quoteItems]);

  const addToQuote = useCallback((equipment: EquipmentItem) => {
    setQuoteItems((prev) => {
      if (prev.some((item) => String(item.id) === String(equipment.id))) {
        return prev;
      }
      return [...prev, equipment];
    });
  }, []);

  const removeFromQuote = useCallback((equipmentId: string | number) => {
    setQuoteItems((prev) => prev.filter((item) => String(item.id) !== String(equipmentId)));
  }, []);

  const clearQuote = useCallback(() => {
    setQuoteItems([]);
  }, []);

  const isInQuote = useCallback(
    (equipmentId: string | number) =>
      quoteItems.some((item) => String(item.id) === String(equipmentId)),
    [quoteItems]
  );

  const value = useMemo(
    () => ({
      quoteItems,
      addToQuote,
      removeFromQuote,
      clearQuote,
      isInQuote,
    }),
    [quoteItems, addToQuote, removeFromQuote, clearQuote, isInQuote]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return ctx;
}
