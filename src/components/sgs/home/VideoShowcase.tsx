import { useRef } from "react";

import { motion, useInView, type Variants } from "framer-motion";

import { Youtube } from "lucide-react";

import { useI18n, type DictKey } from "@/lib/i18n";



const EASE = [0.32, 0.72, 0, 1] as const;



const fadeUp: Variants = {

  hidden: { opacity: 0, y: 24 },

  show: (i: number = 0) => ({

    opacity: 1,

    y: 0,

    transition: { delay: i * 0.1, duration: 0.7, ease: EASE },

  }),

};



type VideoItem = {

  id: string;

  titleKey: DictKey;

  captionKey: DictKey;

};



const videos: VideoItem[] = [

  { id: "3qji5w77alE", titleKey: "video.v1.title", captionKey: "video.v1.caption" },

  { id: "M3CpZJtCsQk", titleKey: "video.v2.title", captionKey: "video.v2.caption" },

  { id: "dCSvhOnuzNw", titleKey: "video.v3.title", captionKey: "video.v3.caption" },

];



export const VideoShowcase = () => {

  const { t } = useI18n();

  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, { once: true, margin: "-15%" });



  return (

    <section

      id="video"

      ref={ref}

      className="relative overflow-hidden bg-gradient-hero py-20 text-white lg:py-28"

    >

      <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden />

      <div

        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,hsl(var(--accent)/0.12),transparent_50%)]"

        aria-hidden

      />



      <div className="container relative mx-auto px-4">

        <motion.div

          variants={fadeUp}

          initial="hidden"

          animate={inView ? "show" : "hidden"}

          custom={0}

          className="mx-auto max-w-2xl text-center"

        >

          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">

            <Youtube className="h-4 w-4" />

            {t("video.eyebrow")}

          </span>

          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[44px]">

            {t("video.title")}

          </h2>

          <p className="mt-4 text-base text-industrial-slate lg:text-lg">

            {t("video.subtitle")}

          </p>

        </motion.div>



        <div className="-mx-4 mt-14 overflow-x-auto px-4 pb-4 lg:mx-0 lg:overflow-visible lg:px-0">

          <div className="flex w-max gap-6 lg:grid lg:w-auto lg:grid-cols-3 lg:gap-8">

            {videos.map((video, index) => (

              <motion.article

                key={video.id}

                variants={fadeUp}

                initial="hidden"

                animate={inView ? "show" : "hidden"}

                custom={index + 1}

                className="group w-[85vw] max-w-sm shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-card backdrop-blur-xl transition-colors hover:border-white/20 lg:w-auto lg:max-w-none"

              >

                <div className="relative aspect-video w-full overflow-hidden bg-industrial-navy-deep">

                  <iframe

                    width="100%"

                    height="250"

                    src={`https://www.youtube.com/embed/${video.id}`}

                    title={t(video.titleKey)}

                    frameBorder="0"

                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

                    allowFullScreen

                    className="absolute inset-0 h-full w-full"

                  />

                </div>

                <div className="p-5">

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">

                    {t(video.captionKey)}

                  </span>

                  <h3 className="mt-2 font-display text-base font-bold tracking-tight text-white">

                    {t(video.titleKey)}

                  </h3>

                </div>

              </motion.article>

            ))}

          </div>

        </div>

      </div>

    </section>

  );

};


