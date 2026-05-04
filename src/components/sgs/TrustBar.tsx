import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Stat = { value: number; suffix?: string; prefix?: string; label: string };

const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Equipos en catálogo" },
  { value: 15, prefix: "+", suffix: " años", label: "En el mercado" },
  { value: 98, suffix: "%", label: "Clientes satisfechos" },
  { value: 24, suffix: "h", label: "Tiempo de cotización" },
];

const Counter = ({ stat, start }: { stat: Stat; start: boolean }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 1600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(stat.value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, stat.value]);
  return (
    <span className="text-3xl lg:text-4xl font-extrabold text-primary tracking-tight tabular-nums">
      {stat.prefix}
      {n}
      {stat.suffix}
    </span>
  );
};

export const TrustBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section
      id="trust"
      ref={ref}
      className="relative bg-background border-y border-border"
    >
      <div className="container mx-auto py-8 lg:py-0 lg:h-[120px] grid grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] as const }}
            className="flex flex-col items-center text-center lg:border-l lg:border-border lg:first:border-l-0 lg:px-6"
          >
            <Counter stat={s} start={inView} />
            <span className="mt-1 text-xs lg:text-sm font-medium text-muted-foreground tracking-wide">
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
