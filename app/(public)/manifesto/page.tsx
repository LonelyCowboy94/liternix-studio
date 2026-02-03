import { ReactNode } from "react";
import Header from "@/components/public/Header";
import AmbientBackground from "@/components/public/AmbientBackground";
import { Zap, ShieldAlert, Fingerprint, Activity, Cpu, Globe } from "lucide-react";
import Footer from "@/components/public/Footer";

interface Principle {
  id: string;
  icon: ReactNode;
  title: string;
  text: string;
}

export default function Manifesto() {
  const principles: Principle[] = [
    {
      id: "01",
      icon: <Zap size={20} />,
      title: "The Surgical Cut",
      text: "Every frame is a decision. If it doesn't serve the story, it's dead weight. We perform surgery on time itself to extract pure emotion."
    },
    {
      id: "02",
      icon: <Fingerprint size={20} />,
      title: "Digital Alchemy",
      text: "Raw footage is lead. Through grading and sound design, we transmute it into gold. Distortion is our primary tool."
    },
    {
      id: "03",
      icon: <ShieldAlert size={20} />,
      title: "Attention Warfare",
      text: "In a world of infinite scrolls, attention is the only currency. We edit to capture, hold, and never let go."
    }
  ];

  return (
    <div className="bg-black min-h-screen text-white selection:bg-[#afff00] selection:text-black">
      <Header />
      
      <main className="relative pt-32 pb-20 px-6 md:px-12 overflow-x-hidden">
        <AmbientBackground />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="mb-20 md:mb-32">
           

            {/* Title Fix: Adjusted leading and padding to prevent clipping */}
            <h1 className="text-[13vw] md:text-[10rem] font-black uppercase italic leading-[0.9] md:leading-[0.8] tracking-tighter mb-12 animate-reveal opacity-0 delay-1 py-4">
              THE <br /> 
              <span className="text-transparent bg-clip-text bg-linear-to-b from-[#afff00] to-[#7acc00] pb-2">
                MANIFESTO&nbsp;
              </span>
            </h1>
            
            <div className="max-w-4xl animate-reveal opacity-0 delay-2">
              <blockquote className="border-l-4 border-[#afff00] pl-6 md:pl-10">
                <p className="text-2xl md:text-5xl text-zinc-100 leading-tight font-medium italic">
                  &quot;Everyone has the right to <span className="text-[#afff00]">distort reality</span>. We choose to do it frame by frame.&quot;
                </p>
              </blockquote>
            </div>
            {/* Integrity Bar restored with CSS animation */}
              <div className="flex flex-col gap-3 mt-6">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#afff00] animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Verify Integrity</span>
                </div>
                <div className="w-full h-0.75 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#afff00] animate-fill-bar delay-3" />
                </div>
              </div>
          </div>
          

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {principles.map((p, idx) => (
              <article 
                key={p.id}
                className="group relative p-8 rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm hover:border-[#afff00]/30 transition-all duration-500 animate-reveal opacity-0"
                style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
              >
                <span className="absolute top-4 right-8 text-7xl font-black text-white/2 group-hover:text-[#afff00]/5 transition-colors pointer-events-none">
                  {p.id}
                </span>

                <div className="flex flex-col gap-6 relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-zinc-900 text-[#afff00] group-hover:bg-[#afff00] group-hover:text-black transition-all duration-500">
                    {p.icon}
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                      {p.title}
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base leading-relaxed group-hover:text-zinc-300 transition-colors">
                      {p.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <footer className="mt-32 pt-12 animate-reveal opacity-0 delay-3">
            <hr className="h-px w-full border-0 bg-linear-to-r from-transparent via-[#afff00]/50 to-transparent mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 items-end">
              
              <div className="flex items-center gap-4">
                <Cpu size={14} className="text-zinc-600" />
                <div className="flex flex-col text-[10px]">
                  <span className="text-zinc-600 uppercase">System</span>
                  <span className="text-[#afff00] font-bold italic">Quantum_Render</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Globe size={14} className="text-zinc-600" />
                <div className="flex flex-col text-[10px]">
                  <span className="text-zinc-600 uppercase">CDN Status</span>
                  <span className="text-white font-bold italic">Active_Nodes</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-[0.4em] block">
                  {"//"} End_Of_Transmission
                </span>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Global Grainy overlay moved here for Z-index consistency */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] grain-overlay z-50" aria-hidden="true" />

       {/* SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-100 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,1)_50%)] bg-size-[100%_4px]" />
      <Footer />
    </div>
  );
}