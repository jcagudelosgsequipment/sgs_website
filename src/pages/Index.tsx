import { HeroSection } from "@/components/sgs/HeroSection";
import { TrustBar } from "@/components/sgs/TrustBar";
import { BusinessDivisions } from "@/components/sgs/home/BusinessDivisions";
import { VideoShowcase } from "@/components/sgs/home/VideoShowcase";
import { WhyChooseSGS } from "@/components/sgs/home/WhyChooseSGS";

const Index = () => (
  <main className="min-h-screen bg-background">
    <HeroSection />
    <TrustBar />
    <WhyChooseSGS />
    <BusinessDivisions />
    <VideoShowcase />
  </main>
);

export default Index;
