import Header from '@/components/public/Header';
import MainHero from '@/components/public/MainHero';
import CorePhilosophy from '@/components/public/CorePhilosophy';
import Footer from '@/components/public/Footer';
import AmbientBackground from '@/components/public/AmbientBackground';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luka Jokić | Premium Video Crafting & Cinematic Post-Production",
  description:
    "Bringing your vision to life through high-end video editing. Specializing in commercial content, dynamic social media edits, and cinematic storytelling. Let's build your brand's visual identity.",
  alternates: {
    canonical: "/", 
  },
  openGraph: {
    title: "Video Editor & Content Creator | Ime Prezime",
    description: "Transforming ideas into high-impact visual stories. View my portfolio.",
     type: "website",
    images: [
      {
        url: "/og-image.webp", 
        width: 1200,
        height: 630,
        alt: "Professional Video Editing Portfolio Showreel",
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen grain-overlay">
      <AmbientBackground />
      
      <div className="relative z-10">
        <Header />
        <MainHero />
        <CorePhilosophy />
        <Footer />
      </div>
                  {/* GLOBAL SCANLINE */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-100" />

    </div>
  );
}