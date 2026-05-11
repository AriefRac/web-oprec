import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DepartemenSection from "@/components/DepartemenSection";
import ContactSection from "@/components/ContactSection";
import CekStatusSection from "@/components/CekStatusSection";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection />
      <DepartemenSection />
      <TimelineSection />
      <CekStatusSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
