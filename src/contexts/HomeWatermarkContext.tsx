import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type HomeWatermarkContextValue = {
  watermarkVisible: boolean;
  registerWatermark: (node: HTMLElement | null) => void;
};

const HomeWatermarkContext = createContext<HomeWatermarkContextValue | null>(null);

export const HomeWatermarkProvider = ({ children }: { children: ReactNode }) => {
  const [watermarkVisible, setWatermarkVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const registerWatermark = useCallback((node: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!node) {
      setWatermarkVisible(false);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => setWatermarkVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "-88px 0px 0px 0px" }
    );
    observerRef.current.observe(node);
  }, []);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return (
    <HomeWatermarkContext.Provider value={{ watermarkVisible, registerWatermark }}>
      {children}
    </HomeWatermarkContext.Provider>
  );
};

export const useHomeWatermark = () => {
  const ctx = useContext(HomeWatermarkContext);
  if (!ctx) {
    throw new Error("useHomeWatermark must be used within HomeWatermarkProvider");
  }
  return ctx;
};
