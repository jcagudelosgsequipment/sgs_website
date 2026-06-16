import { AboutCorporateCore } from "@/components/sgs/about/AboutCorporateCore";
import { AboutHero } from "@/components/sgs/about/AboutHero";
import { AboutImpactMetrics } from "@/components/sgs/about/AboutImpactMetrics";
import { AboutPillars } from "@/components/sgs/about/AboutPillars";

const AboutUs = () => (
  <div className="min-h-screen bg-slate-50/70">
    <AboutHero />
    <AboutCorporateCore />
    <AboutPillars />
    <AboutImpactMetrics />
  </div>
);

export default AboutUs;
