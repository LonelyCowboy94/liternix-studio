// components/public/FeaturedWorksFeed.tsx
import { Film, Monitor, ArrowDown } from "lucide-react";
import StudioPlayer from "./StudioPlayer";

// Definišemo interfejs da se poklapa sa tvojom bazom
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
  excludeId?: number; // Promenjeno u number
}) {
  
  // Filtriramo video koji je već u Hero sekciji i sortiramo ostale
  const filteredWorks = works.filter(work => work.id !== excludeId);

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <div className="relative mb-20 flex flex-col items-center">
 

  {/* 2. MAIN TITLE - Masivan i centriran */}
  <div className="text-center relative z-10">
    <h2 className="text-7xl md:text-[8rem] font-black uppercase italic leading-[0.75] tracking-tighter text-white select-none">
      THE <br /> <span className="text-[#afff00]">VAULT</span>
    </h2>
    
    {/* Lebdeći tech podaci sa strane naslova */}
    <div className="absolute -right-16 top-2/5 -translate-y-1/2 hidden lg:block text-left border-l border-zinc-800 pl-4 py-2">
      <p className="text-[10px] font-mono text-zinc-500 leading-tight">
        STATUS: ONLINE <br />
        PROJECT_COUNT: {works.length} <br />
        ENCODING: H.264_MASTER
      </p>
    </div>
  </div>

  {/* 3. SCROLL INDICATOR - Vizuelna asocijacija na dole */}
  <div className="mt-16 flex flex-col items-center gap-4 group">
    <div className="flex flex-col items-center gap-2">
      {/* Stilizoovani miš/scroll ikonica */}
      <div className="w-[22px] h-[36px] border-2 border-zinc-800 rounded-full flex justify-center p-1.5 transition-colors group-hover:border-[#afff00]/50">
        <div className="w-1 h-1.5 bg-[#afff00] rounded-full animate-scroll-dot" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 group-hover:text-[#afff00] transition-colors">
        Scroll_Down
      </p>
    </div>
    
    {/* Strelica koja pulsira */}
    <ArrowDown size={20} className="text-[#afff00] animate-bounce" />
  </div>

  {/* 4. BACKGROUND WATERMARK - Veliki ghost tekst u pozadini */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] whitespace-nowrap">
    <span className="text-[20rem] font-black italic uppercase tracking-tighter">
      &nbsp;EXPLORE&nbsp;
    </span>
  </div>
</div>

      <div className="space-y-32">
        {filteredWorks.map((work, index) => {
          // Poboljšana provera za vertikalni video (dodaj i 'reels' za svaki slučaj)
          const isVertical = work.url.includes("shorts/") || work.url.includes("reels/");

          return (
            <div 
              key={work.id} 
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              {/* INFO BLOK */}
              <div className={`space-y-6 ${isVertical ? "lg:col-span-5 lg:order-1" : "lg:col-span-4 lg:order-2"}`}>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-black text-zinc-800 italic">0{index + 1}</span>
                  <div className="h-px flex-1 bg-zinc-800 group-hover:bg-[#afff00]/30 transition-colors" />
                </div>
                
                <h3 className="text-3xl md:text-5xl font-black uppercase italic leading-none text-white group-hover:text-[#afff00] transition-colors">
                  {work.title}
                </h3>
                
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
                  {work.description}
                </p>

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

              {/* PLAYER BLOK */}
              <div className={`${isVertical ? "lg:col-span-7 lg:order-2 flex justify-center" : "lg:col-span-8 lg:order-1"}`}>
                <div className={`relative z-10 overflow-hidden rounded-2xl border border-zinc-900 group-hover:border-[#afff00]/40 transition-all duration-700 shadow-2xl ${isVertical ? "max-w-[340px] w-full" : "w-full"}`}>
                  <StudioPlayer videoUrl={work.url} />
                </div>
                
                {/* Background Glow */}
                <div className="absolute inset-0 bg-[#afff00]/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}