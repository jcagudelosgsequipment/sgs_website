import { useRef } from "react";

import { motion, useInView, type Variants } from "framer-motion";

import {

  Headphones,

  MapPin,

  Plane,

  Smile,

  Truck,

  Wrench,

  type LucideIcon,

} from "lucide-react";

import { useI18n, type DictKey } from "@/lib/i18n";



const EASE = [0.32, 0.72, 0, 1] as const;



const fadeUp: Variants = {

  hidden: { opacity: 0, y: 24 },

  show: (i: number = 0) => ({

    opacity: 1,

    y: 0,

    transition: { delay: i * 0.08, duration: 0.6, ease: EASE },

  }),

};



type Feature = {

  icon: LucideIcon;

  titleKey: DictKey;

  descKey: DictKey;

};



const features: Feature[] = [

  { icon: MapPin, titleKey: "why.f1.title", descKey: "why.f1.desc" },

  { icon: Headphones, titleKey: "why.f2.title", descKey: "why.f2.desc" },

  { icon: Wrench, titleKey: "why.f3.title", descKey: "why.f3.desc" },

  { icon: Truck, titleKey: "why.f4.title", descKey: "why.f4.desc" },

  { icon: Plane, titleKey: "why.f5.title", descKey: "why.f5.desc" },

  { icon: Smile, titleKey: "why.f6.title", descKey: "why.f6.desc" },

];



export const WhyChooseSGS = () => {

  const { t } = useI18n();

  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, { once: true, margin: "-15%" });



  return (

    <section ref={ref} className="relative bg-muted py-20 lg:py-28">

      <div className="container mx-auto px-4">

        <motion.div

          variants={fadeUp}

          initial="hidden"

          animate={inView ? "show" : "hidden"}

          custom={0}

          className="mx-auto max-w-2xl text-center"

        >

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">

            {t("why.eyebrow")}

          </span>

          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[44px]">

            {t("why.title")}

          </h2>

          <p className="mt-4 text-base text-muted-foreground lg:text-lg">

            {t("why.subtitle")}

          </p>

        </motion.div>



        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature, index) => (

            <motion.article

              key={feature.titleKey}

              variants={fadeUp}

              initial="hidden"

              animate={inView ? "show" : "hidden"}

              custom={index + 1}

              className="group rounded-2xl border border-border bg-card p-7 shadow-nav transition-all duration-500 hover:-translate-y-1 hover:shadow-card"

            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-accent group-hover:text-accent-foreground">

                <feature.icon className="h-6 w-6" strokeWidth={2} />

              </div>

              <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-foreground">

                {t(feature.titleKey)}

              </h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">

                {t(feature.descKey)}

              </p>

            </motion.article>

          ))}

        </div>

      </div>

    </section>

  );

};


