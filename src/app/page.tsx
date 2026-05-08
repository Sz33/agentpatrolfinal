import SolaisLoadingScreen from "@/components/SolaisLoadingScreen";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import CustomCursor from "@/components/CustomCursor";
import AboutFlythrough from "@/components/AboutFlythrough";
import SecuringHeadingZone from "@/components/SecuringHeadingZone";
import SolaisMarqueeSection from "@/components/SolaisMarqueeSection";
import StackingSteps from "@/components/StackingSteps";
import FeaturesSection from "@/components/FeaturesSection";
import WhyKernelSection from "@/components/WhyKernelSection";
import LiveDemoSection from "@/components/LiveDemoSection";
import SolaisStatsSection from "@/components/SolaisStatsSection";
import { CinematicFooter } from "@/components/ui/motion-footer";

import { Navbar } from "@/components/hero-3d/Navbar";
import TeamHero from "@/components/team-hero/TeamHero";
import TeamProblem from "@/components/team-hero/TeamProblem";

export default function Home() {
  return (
    <>
      <SolaisLoadingScreen />
      <ScrollRevealInit />

      <Navbar />
      <TeamHero />
      <TeamProblem />

      {/* Sentinel — CustomCursor activates once the user scrolls past
          the team hero+problem zone. */}
      <div id="hero-zone-end" aria-hidden="true" />
      <CustomCursor />

      <main>
        <AboutFlythrough />
        <SecuringHeadingZone />
        <StackingSteps />
        <FeaturesSection />
        <SolaisMarqueeSection />
        <WhyKernelSection />
        <LiveDemoSection />
        <SolaisStatsSection />
      </main>
      <CinematicFooter />
    </>
  );
}
