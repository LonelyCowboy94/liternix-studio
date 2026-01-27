"use client";
import AmbientBackground from "@/components/public/AmbientBackground";
import Header from "@/components/public/Header";
import { motion } from "framer-motion";
import { Zap, ShieldAlert, Fingerprint, Activity } from "lucide-react";

export default function Manifesto() {
  const principles = [
    {
      id: "01",
      icon: <Zap size={24} />,
      title: "The Surgical Cut",
      text: "Every frame is a decision. If it doesn't serve the story, it's dead weight. We don't just trim; we perform surgery on time itself."
    },
    {
      id: "02",
      icon: <Fingerprint size={24} />,
      title: "Digital Alchemy",
      text: "Raw footage is lead. Through color grading, sound design, and pacing, we transmute it into gold. Distortion is our primary tool."
    },
    {
      id: "03",
      icon: <ShieldAlert size={24} />,
      title: "Attention Warfare",
      text: "In a world of infinite scrolls, attention is the only currency. We edit to capture, hold, and never let go until the final frame."
    }
  ];

  return (
    <>
    <Header />
    
    <section id="manifesto" className="min-h-screen bg-black text-white py-20 px-6 md:px-12 relative overflow-hidden">
      <AmbientBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <header className="mb-32">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 italic">Protocol_v1.0 // Philosophy</span>
          </div>
          <h2 className="text-7xl md:text-[10rem] font-black uppercase italic leading-[0.8] tracking-tighter mb-10">
            THE <br /> <span className="text-[#afff00]">MANIFESTO</span>
          </h2>
          
          {/* THE BIG TRADE WINDS QUOTE */}
          <div className="max-w-4xl mt-20">
            <p className="font-trade text-3xl md:text-5xl text-zinc-200 leading-tight tracking-wide italic border-l-4 border-[#afff00] pl-8">
              &quot;Everyone has the right to <span className="text-[#afff00]">distort reality</span>. We choose to do it frame by frame, creating truths that never existed until we hit Export.&quot;
            </p>
          </div>
        </header>

        {/* PRINCIPLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {principles.map((p) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6 group"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <span className="text-5xl font-black text-zinc-900 group-hover:text-[#afff00]/20 transition-colors duration-500">
                  {p.id}
                </span>
                <div className="text-[#afff00] p-3 bg-zinc-900 rounded-xl group-hover:scale-110 transition-transform duration-500">
                  {p.icon}
                </div>
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                {p.title}
              </h3>
              <p className="text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* HUD FOOTER */}
        <div className="mt-40 pt-10 border-t border-zinc-900 flex flex-wrap justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Encryption</span>
              <span className="text-[11px] font-black text-[#afff00] uppercase italic">AES_256_LITERNIX</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Integrity</span>
              <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">100.00% Verified</span>
            </div>
          </div>
          <Activity className="text-zinc-800 animate-pulse" size={40} />
          <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em] italic">
            {"//"} End_Of_Transmission
          </div>
        </div>

      </div>

      {/* GLOBAL SCANLINE */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-50" />
    </section>
    </>
  );
}