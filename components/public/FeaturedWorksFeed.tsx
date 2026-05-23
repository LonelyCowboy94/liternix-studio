// components/public/FeaturedWorksFeed.tsx
import { Film, Monitor, ArrowDown } from "lucide-react";
import StudioPlayer from "./StudioPlayer";

interface Work {
  id: number;
  url: string;
  title: string;
  description: string | null;
  type: number | null;
  sortOrder: number | null;
  createdAt: Date;
}

export default function FeaturedWorksFeed({ 
  works, 
  excludeId 
}: { 
  works: Work[]; 
  excludeId?: number; 
}) {
  
  const filteredWorks = works.filter(work => work.id !== excludeId);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-8">
      {/* HEADER SEKCIJA - THE VAULT */}
      <div className="relative lg:-mb-20 lg:mr-60 flex flex-col items-center">
        <div className="text-center relative z-10">
         
          
          
        </div>

            <div className="w-5.5 h-9 border-2 border-zinc-800 rounded-full flex justify-center p-1.5 transition-colors group-hover:border-[#afff00]/50">
              <div className="w-1 h-1.5 bg-[#afff00] rounded-full animate-scroll-dot" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-[#afff00] transition-colors">
              Scroll_Down
            </p>
        
          <ArrowDown size={20} className="text-[#afff00] animate-bounce" />
        
      </div>

      {/* LISTA VIDEA */}
      <div className="space-y-14 md:space-y-28 lg:mt-10">
        {filteredWorks.map((work, index) => {
          const isVertical = work.url.includes("shorts/") || work.url.includes("reels/");

          return (
            <div 
              key={work.id} 
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
            >
              {/* INFO BLOK - Smanjen na 4 kolone za vertikalne da bi player bio veći */}
              <div className={`space-y-8 ${isVertical ? "lg:col-span-4 lg:order-1" : "lg:col-span-4 lg:order-2"}`}>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-zinc-900 italic leading-none group-hover:text-[#afff00]/20 transition-colors">
                    0{index + 1}
                  </span>
                  <div className="h-px flex-1 bg-zinc-900 group-hover:bg-[#afff00]/30 transition-colors" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl md:text-6xl font-black uppercase italic leading-[0.85] tracking-tighter text-white group-hover:text-[#afff00] transition-colors duration-500">
                    {work.title}
                  </h3>
                  <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-medium uppercase italic">
                    {work.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Monitor size={12} className="text-[#afff00]" /> 
                    {isVertical ? "9:16_VERT" : "16:9_WIDE"}
                  </div>
                  <div className="px-3 py-1 bg-[#afff00]/5 border border-[#afff00]/20 text-[10px] font-black uppercase tracking-widest text-[#afff00] flex items-center gap-2">
                    <Film size={12} /> 
                    {isVertical ? "REEL_FORMAT" : "MASTER_CUT"}
                  </div>
                </div>
              </div>

              {/* PLAYER BLOK - Povećan na 8 kolona za vertikalne */}
              <div className={`${isVertical ? "lg:col-span-8 lg:order-2 flex justify-center lg:justify-end" : "lg:col-span-8 lg:order-1"}`}>
                <div className={`relative z-10 overflow-hidden rounded-4xl border border-zinc-900 group-hover:border-[#afff00]/40 transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:shadow-[#afff00]/10
                  ${isVertical ? "max-w-105 w-full" : "w-full"}`}>
                  
                  {/* StudioPlayer sa tvojim linkom */}
                  <StudioPlayer videoUrl={work.url} />

                  {/* Scanline overlay samo za player */}
                </div>
                
                {/* Background Glow - Jači intenzitet */}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}