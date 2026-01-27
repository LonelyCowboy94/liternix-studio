import Header from '@/components/public/Header';
import MainHero from '@/components/public/MainHero';
import CorePhilosophy from '@/components/public/CorePhilosophy';
import Footer from '@/components/public/Footer';
import AmbientBackground from '@/components/public/AmbientBackground';

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