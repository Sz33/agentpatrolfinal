import SolaisLoadingScreen from "@/components/SolaisLoadingScreen";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import CustomCursor from "@/components/CustomCursor";
import AboutFlythrough from "@/components/AboutFlythrough";
import SecuringHeadingZone from "@/components/SecuringHeadingZone";
import ProblemSection from "@/components/ProblemSection";
import SolaisMarqueeSection from "@/components/SolaisMarqueeSection";
import StackingSteps from "@/components/StackingSteps";
import FeaturesSection from "@/components/FeaturesSection";
import WhyKernelSection from "@/components/WhyKernelSection";
import LiveDemoSection from "@/components/LiveDemoSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import { CinematicFooter } from "@/components/ui/motion-footer";

import { Navbar } from "@/components/hero-3d/Navbar";
import { Hero } from "@/components/hero-3d/Hero";
import { EvilCursor } from "@/components/hero-3d/EvilCursor";
import { AgentDetectionRing } from "@/components/hero-3d/AgentDetectionRing";

export default function Home() {
  return (
    <>
      <SolaisLoadingScreen />
      <ScrollRevealInit />

      {/* Hero zone — AgentPatrol theme, evil cursor scoped here only */}
      <div id="hero-zone">
        <div className="bg-fx" />
        <div className="bg-scan" />
        <div className="bg-vignette" />
        <Navbar />
        <Hero />
        <EvilCursor />
        <AgentDetectionRing />
      </div>
      <div id="hero-zone-end" aria-hidden="true" />

      {/* Native OS cursor handler for everything below the hero zone */}
      <CustomCursor />

      <main>
        <AboutFlythrough />
        <ProblemSection />
        <SecuringHeadingZone />
        <StackingSteps />
        <FeaturesSection />
        <WhyKernelSection />
        <LiveDemoSection />
        <SolaisMarqueeSection />
        <FinalCtaSection />
      </main>
      <CinematicFooter />
    </>
  );
}
