import { ReactNode } from "react";
import Header from "@/components/public/Header";
import AmbientBackground from "@/components/public/AmbientBackground";
import { 
  Activity, Cpu, Globe, MousePointer2, 
  Terminal, Code2, Bot, Target, Scan, 
  Dna, Radio, Eye
} from "lucide-react";
import Footer from "@/components/public/Footer";
import Button3D from "@/components/ui/Button3D";
import Link from "next/link";

interface Principle {
  id: string;
  icon: ReactNode;
  title: string;
  text: string;
  tag: string;
}

export default function Manifesto() {
  const principles: Principle[] = [
    {
      id: "01",
      icon: <Scan size={24} />,
      title: "The Surgical Cut",
      text: "In the 2027 landscape, frames are no longer just time; they are data points. We perform precision surgery on the timeline to extract pure neural engagement. If it doesn't serve the pulse, it's deleted.",
      tag: "FRAME_ACCURACY_99.9%"
    },
    {
      id: "02",
      icon: <Dna size={24} />,
      title: "Digital Alchemy",
      text: "Raw footage is biological lead. Through algorithmic grading and spatial sound architecture, we transmute it into digital gold. Distortion isn't an error; it's our primary weapon.",
      tag: "TRANSFORM_V4.0"
    },
    {
      id: "03",
      icon: <Eye size={24} />,
      title: "Attention Warfare",
      text: "Information density has peaked. Attention is the only currency left. We engineer visuals to capture the optic nerve and hold it captive. Retain or Perish.",
      tag: "RETENTION_ENGINE"
    }
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white selection:bg-[#afff00] selection:text-black font-sans">
      <Header />
      
      <main className="relative pt-32 pb-40 px-6 md:px-12 overflow-x-hidden">
        {/* Futistička mreža u pozadini */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <AmbientBackground />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* --- HERO SECTION --- */}
          <div className="mb-40 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-[#afff00]" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#afff00] animate-pulse">
                  System_Initialization_Active
                </span>
              </div>

              <h1 className="text-[14vw] lg:text-[11rem] font-black uppercase italic leading-[0.75] tracking-tighter mb-12">
                THE <br /> 
                <span className="animate-video-text text-transparent bg-clip-text bg-[linear-gradient(180deg,#afff00_0%,#4a6600_100%)]">
                  MANIFESTO&nbsp;
                </span>
              </h1>
               <div className="flex flex-col gap-3 my-6 lg:my-8 w-full">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-[#afff00] animate-pulse" />
                          <span className="text-[10px] font-black text-white uppercase italic tracking-widest">
                            Verify Integrity
                          </span>
                        </div>
                        <div className="w-full h-0.75 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#afff00]/60 animate-fill-bar delay-3" />
                        </div>
                      </div>
              <div className="max-w-2xl relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-[#afff00]" />
                <p className="text-2xl md:text-4xl text-zinc-300 leading-tight font-medium italic pl-6 uppercase tracking-tighter">
                  &quot;The future belongs to those who <span className="text-white underline decoration-[#afff00] decoration-4 underline-offset-8">distort reality</span> to reveal the truth.&quot;
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-end gap-8 pl-8">
               
               <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-widest">
                 LUKA JOKIĆ STUDIO OPERATES AT THE INTERSECTION OF RAW CINEMATICS AND NEURAL ENGAGEMENT.
               </p>
            </div>
          </div>

          

          {/* --- BENTO METRICS GRID --- */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-3xl backdrop-blur-3xl group hover:border-[#afff00]/30 transition-all shadow-2xl">
                 <Radio size={20} className="text-[#afff00] mb-6" />
                 <span className="block text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Archive_Volume</span>
                 <div className="text-5xl font-black italic text-white group-hover:scale-110 transition-transform origin-left">1000+</div>
              </div>
              <div className="p-8 bg-zinc-950/50 border border-zinc-900 rounded-3xl backdrop-blur-3xl group hover:border-[#afff00]/30 transition-all shadow-2xl">
                 <Target size={20} className="text-[#afff00] mb-6" />
                 <span className="block text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-2">Attention_Retention</span>
                 <div className="text-5xl font-black italic text-white group-hover:scale-110 transition-transform origin-left">+42%</div>
              </div>
              <div className="md:col-span-2 p-8 bg-[#afff00] border border-[#afff00] rounded-3xl group transition-all shadow-[0_0_50px_-12px_rgba(175,255,0,0.4)]">
                 <Activity size={20} className="text-black mb-6" />
                 <span className="block text-[10px] text-black/60 font-black uppercase tracking-widest mb-2">Global_Impact_Rating</span>
                 <div className="text-5xl font-black italic text-black">ELITE_TIER</div>
              </div>
          </div>

          {/* --- PRINCIPLES: THE CORE --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-40">
            {principles.map((p) => (
              <article 
                key={p.id}
                className="group relative p-12 rounded-[2.5rem] border border-zinc-900 bg-[#0a0a0a] hover:bg-zinc-900/10 transition-all duration-700 overflow-hidden flex flex-col justify-between min-h-[450px]"
              >
                <div className="absolute top-0 right-0 p-8">
                  <span className="text-[12rem] font-black leading-none text-white/[0.02] group-hover:text-[#afff00]/5 transition-all duration-1000">
                    {p.id}
                  </span>
                </div>

                <div className="relative z-10 w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-[#afff00] group-hover:bg-[#afff00] group-hover:text-black transition-all duration-500 shadow-2xl group-hover:shadow-[#afff00]/20">
                  {p.icon}
                </div>

                <div className="relative z-10 space-y-6">
                  <span className="text-[10px] font-mono text-[#afff00] bg-[#afff00]/10 px-3 py-1 rounded-full border border-[#afff00]/20 uppercase">
                    {p.tag}
                  </span>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{p.title}</h2>
                  <p className="text-zinc-500 text-base leading-relaxed font-medium group-hover:text-zinc-200 transition-colors">{p.text}</p>
                </div>
              </article>
            ))}
          </div>

          {/* --- WORKFLOW PIPELINE (2027 EDIT) --- */}
          <div className="mb-40 space-y-16">
             <div className="flex justify-between items-end border-b border-zinc-900 pb-10">
                <h2 className="text-6xl md:text-[6rem] font-black uppercase italic tracking-tighter">TECHNICAL_<span className="text-[#afff00]">PIPELINE</span></h2>
                <div className="hidden md:block text-right text-zinc-600 font-mono text-[10px] tracking-widest uppercase">
                  Version_Control: v7.02 <br /> Last_Update: Tomorrow
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                  { step: "01", title: "Ingestion", desc: "Deep-scanning assets for emotional resonance and frame-integrity.", icon: <MousePointer2 /> },
                  { step: "02", title: "Synthesis", desc: "Constructing the narrative spine using rhythmic psychology.", icon: <Terminal /> },
                  { step: "03", title: "Augmentation", desc: "Bespoke soundscapes and color-warping to trigger dopamine.", icon: <Code2 /> },
                  { step: "04", title: "Mastering", desc: "Final output optimized for viral algorithmic dominance.", icon: <Bot /> },
                ].map((item, i) => (
                  <div key={i} className="group flex flex-col gap-6">
                    <div className="text-zinc-800 group-hover:text-[#afff00] transition-colors">{item.icon}</div>
                    <div className="space-y-2">
                       <span className="text-[10px] font-mono text-zinc-700 block tracking-[0.3em]">STAGE_{item.step}</span>
                       <h4 className="text-2xl font-black uppercase italic tracking-tighter">{item.title}</h4>
                       <p className="text-zinc-500 text-[11px] leading-relaxed uppercase font-bold tracking-widest">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* --- FINAL CALL --- */}
          <div className="relative py-32 bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden flex flex-col items-center text-center px-6">
    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
    <div className="relative z-10 space-y-10">
      <h3 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter max-w-4xl mx-auto leading-none text-white">
        Build the <span className="text-[#afff00] animate-pulse text-glow">Visual Weapon</span> your brand deserves.
      </h3>
      <p className="text-zinc-500 text-xs md:text-[13px] max-w-lg mx-auto uppercase font-black tracking-[0.4em] leading-loose">
        Our system is primed for high-stakes projects. Decrypt your potential. Initiate the protocol.
      </p>
      
      {/* NOVI POZIV TVOG BUTTONA */}
      <div className="pt-8">
        <Link href="/contact">
          <Button3D primary className="px-10 py-5 group">
            <span className="flex items-center gap-3">
              INITIATE_CONTACT
              <Scan size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </span>
          </Button3D>
        </Link>
      </div>
    </div>
</div>

          {/* --- DATA FOOTER --- */}
          <footer className="mt-40 pt-10 border-t border-zinc-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex items-center gap-6">
                <Cpu size={18} className="text-zinc-700" />
                <div className="flex flex-col">
                  <span className="text-zinc-700 text-[10px] uppercase font-black tracking-widest">Engine</span>
                  <span className="text-[#afff00] font-mono text-[10px]">NEURAL_RENDER_v9.0</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-6">
                <Globe size={18} className="text-zinc-700" />
                <div className="flex flex-col">
                  <span className="text-zinc-700 text-[10px] uppercase font-black tracking-widest">Operations</span>
                  <span className="text-white font-mono text-[10px]">GLOBAL_SYNC_STABLE</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-[0.5em]">
                  {"//"} DISTORTING_REALITY_SINCE_2020
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.5em]">
                  ALL_RIGHTS_RESERVED
                </span>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* Global Aesthetics */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] grain-overlay z-[60]" />
      <div className="fixed inset-0 pointer-events-none z-[70] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,1)_50%)] bg-[size:100%_4px]" />
      <Footer />
    </div>
  );
}