import SolaisLoadingScreen from "@/components/SolaisLoadingScreen";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import CustomCursor from "@/components/CustomCursor";
import SolaisNavbar from "@/components/SolaisNavbar";
import SolaisHeroSection from "@/components/SolaisHeroSection";
import AboutFlythrough from "@/components/AboutFlythrough";
import SolaisMarqueeSection from "@/components/SolaisMarqueeSection";
import StackingSteps from "@/components/StackingSteps";
import SolaisDashboardSection from "@/components/SolaisDashboardSection";
import SolaisIndustriesSection from "@/components/SolaisIndustriesSection";
import SolaisStatsSection from "@/components/SolaisStatsSection";
import SolaisFooter from "@/components/SolaisFooter";

export default function Home() {
  return (
    <>
      <SolaisLoadingScreen />
      <CustomCursor />
      <ScrollRevealInit />
      <SolaisNavbar />
      <main>
        <SolaisHeroSection />
        <div className="section-placeholder" style={{ backgroundColor: "rgb(5,4,8)" }}>
          ANIMATED VISUAL PLACEHOLDER — Replace with your custom element
        </div>
        <AboutFlythrough />
        <SolaisMarqueeSection />
        <StackingSteps />
        <SolaisDashboardSection />
        <SolaisIndustriesSection />
        <SolaisStatsSection />
      </main>
      <SolaisFooter />
    </>
  );
}
