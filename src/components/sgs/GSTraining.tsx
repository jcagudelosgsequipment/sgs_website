import { useState } from "react";

import { Check, Construction } from "lucide-react";

import { useI18n, type DictKey } from "@/lib/i18n";

import { cn } from "@/lib/utils";



type TabId = 1 | 2 | 3;



type Tab = {

  id: TabId;

  titleKey: DictKey;

  subKey: DictKey;

  altKey: DictKey;

  imageSrc: string;

};



const tabs: Tab[] = [

  {

    id: 1,

    titleKey: "training.tab1.title",

    subKey: "training.tab1.sub",

    altKey: "training.tab1.alt",

    imageSrc: "/ELearning1.png",

  },

  {

    id: 2,

    titleKey: "training.tab2.title",

    subKey: "training.tab2.sub",

    altKey: "training.tab2.alt",

    imageSrc: "/ELearning2.png",

  },

  {

    id: 3,

    titleKey: "training.tab3.title",

    subKey: "training.tab3.sub",

    altKey: "training.tab3.alt",

    imageSrc: "/ELearning3.png",

  },

];



const benefitKeys: DictKey[] = [

  "training.benefit1",

  "training.benefit2",

  "training.benefit3",

];



export const GSTraining = () => {

  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<TabId>(3);



  return (

    <section className="bg-slate-50/70 py-20 lg:py-28">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-600 shadow-sm">

            {t("training.badge")}

          </span>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[44px] lg:leading-[1.1]">

            {t("training.title")}

          </h2>



          <div className="mx-auto mt-6 flex w-fit animate-pulse items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 shadow-sm">

            <Construction className="h-4 w-4 shrink-0" aria-hidden />

            {t("training.notice")}

          </div>

        </div>



        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12">

          <nav

            className="flex flex-col gap-3 lg:col-span-4"

            aria-label={t("training.navAria")}

          >

            {tabs.map((tab) => {

              const isActive = activeTab === tab.id;

              return (

                <button

                  key={tab.id}

                  type="button"

                  onClick={() => setActiveTab(tab.id)}

                  aria-pressed={isActive}

                  className={cn(

                    "rounded-r-xl border border-transparent px-5 py-4 text-left transition-all duration-300",

                    isActive

                      ? "border-l-4 border-orange-500 bg-white shadow-sm"

                      : "border-l-4 border-transparent bg-white/60 hover:bg-white hover:shadow-sm",

                  )}

                >

                  <span

                    className={cn(

                      "block font-display text-base font-bold tracking-tight",

                      isActive ? "text-slate-900" : "text-slate-700",

                    )}

                  >

                    {t(tab.titleKey)}

                  </span>

                  <span className="mt-1 block text-sm text-slate-500">{t(tab.subKey)}</span>

                </button>

              );

            })}

          </nav>



          <div className="lg:col-span-8">

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#060b19] shadow-2xl">

              <div className="flex items-center justify-between border-b border-slate-800 bg-[#0c1324] px-4 py-3">

                <div className="flex items-center gap-2">

                  <span className="h-3 w-3 rounded-full bg-red-500/40" aria-hidden />

                  <span className="h-3 w-3 rounded-full bg-yellow-500/40" aria-hidden />

                  <span className="h-3 w-3 rounded-full bg-green-500/40" aria-hidden />

                </div>

                <div className="mx-4 flex-1 rounded-md bg-slate-800/60 px-4 py-1.5 text-center text-xs text-slate-400">

                  academy.sgsequipment.com

                </div>

                <div className="w-[52px]" aria-hidden />

              </div>



              <div className="relative overflow-hidden">

                {tabs.map((tab) => (

                  <img

                    key={tab.id}

                    src={tab.imageSrc}

                    alt={t(tab.altKey)}

                    className={cn(

                      "h-auto w-full object-cover transition-all duration-300",

                      activeTab === tab.id

                        ? "relative opacity-100"

                        : "pointer-events-none absolute inset-0 opacity-0",

                    )}

                  />

                ))}

              </div>

            </div>

          </div>

        </div>



        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">

          {benefitKeys.map((key) => (

            <div

              key={key}

              className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-sm"

            >

              <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" aria-hidden />

              <span>{t(key)}</span>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

};



export default GSTraining;

