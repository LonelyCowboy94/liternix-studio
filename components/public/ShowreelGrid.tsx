"use client";

import { useState, useMemo } from "react";
import { Search, Monitor, Film, Calendar, ArrowUpDown } from "lucide-react";
import StudioPlayer from "./StudioPlayer";

// 1. DEFINIŠEMO TIP ZA RAD (Work)
interface Work {
  id: number;
  url: string;
  title: string;
  description: string | null;
  type: number | null;
  sortOrder: number | null;
  createdAt: Date;
}

// 2. DEFINIŠEMO TIP ZA LAYOUT GRUPE
type LayoutGroup = 
  | { type: 'vertical'; data: Work }
  | { type: 'horizontal-stack'; data: Work[] };

interface ShowreelGridProps {
  initialWorks: Work[];
}

export default function ShowreelGrid({ initialWorks = [] }: ShowreelGridProps) {
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

const processedWorks = useMemo(() => {
    return initialWorks
      .filter((w) => w.title?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        
        // Zamenjeno: dateA - dateB sortira od najstarijeg (prvog) ka najnovijem
        return sortNewest ? dateA - dateB : dateB - dateA;
      });
  }, [search, sortNewest, initialWorks]);

const layoutGroups = useMemo(() => {
    // Razdvajamo radove na osnovu URL-a
    const verticals = processedWorks.filter(w => w.url.includes("shorts/") || w.url.includes("reels/"));
    const horizontals = processedWorks.filter(w => !w.url.includes("shorts/") && !w.url.includes("reels/"));
    
    const groups: LayoutGroup[] = [];
    let vIdx = 0;
    let hIdx = 0;

    // Pakujemo dok god imamo bilo šta u listama
    while (vIdx < verticals.length || hIdx < horizontals.length) {
      
      // 1. PRVO DODAJEMO HORIZONTALNI STACK (Zauzima 1. kolonu)
      if (hIdx < horizontals.length) {
        const pair: Work[] = [];
        pair.push(horizontals[hIdx++]); // Prvi horizontalni
        if (hIdx < horizontals.length) pair.push(horizontals[hIdx++]); // Drugi horizontalni (ako postoji)
        groups.push({ type: 'horizontal-stack', data: pair });
      }

      // 2. ZATIM DODAJEMO 2 VERTIKALNA (Zauzimaju 2. i 3. kolonu)
      if (vIdx < verticals.length) {
        groups.push({ type: 'vertical', data: verticals[vIdx++] });
      }
      if (vIdx < verticals.length) {
        groups.push({ type: 'vertical', data: verticals[vIdx++] });
      }
    }
    return groups;
  }, [processedWorks]);
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800 backdrop-blur-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="ACCESS_DATABASE_SEARCH..."
            className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-xs font-black tracking-widest uppercase focus:border-[#afff00] outline-none transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setSortNewest(!sortNewest)}
          className="flex items-center gap-2 px-6 py-3 bg-black border border-zinc-800 rounded-xl text-[#afff00] text-[10px] font-black uppercase hover:border-[#afff00]/50 transition-all"
        >
          <ArrowUpDown size={14} /> {sortNewest ? "NEWEST" : "OLDEST"}
        </button>
      </div>

      {/* GRID MREŽA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {layoutGroups.map((group, idx) => {
          if (group.type === 'vertical') {
            return <WorkCard key={`v-${group.data.id}`} work={group.data} isShort={true} />;
          }

          return (
            <div key={`stack-${idx}`} className="flex flex-col gap-8 h-full">
              {group.data.map((hWork: Work) => (
                <div key={`h-${hWork.id}`} className="flex-1">
                   <WorkCard work={hWork} isShort={false} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// POMOĆNA KOMPONENTA SA TIPOVANIM PROPSIMA
interface WorkCardProps {
  work: Work;
  isShort: boolean;
}

function WorkCard({ work, isShort }: WorkCardProps) {
  return (
    <div className="group relative flex flex-col h-full">
      <div className={`relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 transition-all duration-500 group-hover:border-[#afff00]/40 
        ${isShort ? "aspect-[9/16]" : "aspect-video"}`}>
        <StudioPlayer videoUrl={work.url} />
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
            {isShort ? <Film size={14} className="text-[#afff00]" /> : <Monitor size={14} className="text-[#afff00]" />}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-[#afff00]/30 group-hover:w-12 transition-all" />
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            {isShort ? "Reel_Edit" : "Master_Cut"}
          </span>
        </div>
        <h3 className="text-lg font-black uppercase italic tracking-tighter group-hover:text-[#afff00] transition-colors line-clamp-1">
          {work.title}
        </h3>
        <p className="text-zinc-500 text-[10px] font-bold leading-tight uppercase italic line-clamp-2">
          {work.description}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-zinc-900/50">
           <div className="flex items-center gap-1.5 text-zinc-600">
              <Calendar size={10} />
              <span className="text-[9px] font-black uppercase">
                {new Date(work.createdAt).toLocaleDateString('en-GB')}
              </span>
           </div>
           <div className="w-1.5 h-1.5 bg-[#afff00] rounded-full group-hover:animate-ping" />
        </div>
      </div>
    </div>
  );
}