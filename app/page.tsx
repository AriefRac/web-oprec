import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DepartemenSection from "@/components/DepartemenSection";
import ContactSection from "@/components/ContactSection";
import CekStatusSection from "@/components/CekStatusSection";
import TimelineSection from "@/components/TimelineSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <DepartemenSection />
      <TimelineSection />
      <CekStatusSection />
      <ContactSection />
    </main>
  );
}
