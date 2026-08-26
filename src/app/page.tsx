import Nav from "@/components/v2/Nav";
import Hero from "@/components/v2/Hero";
import RescueTicker from "@/components/v2/RescueTicker";
import { ProblemBand, WatchBand, ForNgos, Community, Footer, StickyMobileAction } from "@/components/v2/Sections";
import CoverageBand from "@/components/v2/CoverageBand";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <RescueTicker />
      <ProblemBand />
      <WatchBand />
      <CoverageBand />
      <ForNgos />
      <Community />
      <Footer />
      <StickyMobileAction />
    </>
  );
}