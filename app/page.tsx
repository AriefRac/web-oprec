import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import DepartemenSection from "@/components/DepartemenSection";
import CekStatusSection from "@/components/CekStatusSection";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <DepartemenSection />
      <TimelineSection />
      <CekStatusSection />
      <Footer />
    </main>
  );
}
