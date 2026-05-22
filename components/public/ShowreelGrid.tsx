"use client";

import { useState, useMemo } from "react";
import { Search, Calendar, ArrowUpDown } from "lucide-react";
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

type LayoutUnit = 
  | { type: 'vertical'; data: Work }
  | { type: 'horizontal-stack'; data: Work[] };

export default function ShowreelGrid({ initialWorks = [] }: { initialWorks: Work[] }) {
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(true);

  const processedWorks = useMemo(() => {
    return initialWorks
      .filter((w) => w.title?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortNewest ? dateA - dateB : dateB - dateA;
      });
  }, [search, sortNewest, initialWorks]);

  // LOGIKA ZA SCRAMBLED RASPORED
  const layoutGroups = useMemo(() => {
    const verticals = processedWorks.filter(w => w.url.includes("shorts/") || w.url.includes("reels/"));
    const horizontals = processedWorks.filter(w => !w.url.includes("shorts/") && !w.url.includes("reels/"));
    
    const units: LayoutUnit[] = [];
    let vIdx = 0;
    let hIdx = 0;

    let rowIndex = 0;

    // Dok god imamo materijala, pravimo "redove" od 3 jedinice
    while (vIdx < verticals.length || hIdx < horizontals.length) {
      const currentRowUnits: LayoutUnit[] = [];

      // 1. Uzimamo 1 stack (2 horizontale) i 2 vertikale za jedan vizuelni "red"
      const stack: Work[] = [];
      if (hIdx < horizontals.length) stack.push(horizontals[hIdx++]);
      if (hIdx < horizontals.length) stack.push(horizontals[hIdx++]);
      
      const v1 = verticals[vIdx++];
      const v2 = verticals[vIdx++];

      // 2. Pakujemo ih u niz za trenutni red
      if (stack.length > 0) currentRowUnits.push({ type: 'horizontal-stack', data: stack });
      if (v1) currentRowUnits.push({ type: 'vertical', data: v1 });
      if (v2) currentRowUnits.push({ type: 'vertical', data: v2 });

      // 3. SCRAMBLE: Menjamo redosled u zavisnosti od indexa reda
      // Red 0: Stack, Reel, Reel
      // Red 1: Reel, Stack, Reel
      // Red 2: Reel, Reel, Stack
      if (rowIndex % 3 === 1) {
        currentRowUnits.push(currentRowUnits.shift()!); // Pomeri stack na drugo mesto
      } else if (rowIndex % 3 === 2) {
        currentRowUnits.push(currentRowUnits.shift()!); // Pomeri stack na treće mesto
        currentRowUnits.push(currentRowUnits.shift()!);
      }

      units.push(...currentRowUnits);
      rowIndex++;
    }
    return units;
  }, [processedWorks]);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      

      {/* GRID KOJI JE SADA SCRAMBLED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {layoutGroups.map((group, idx) => {
          if (group.type === 'vertical') {
            return <WorkCard key={`v-${group.data.id}`} work={group.data} isShort={true} />;
          }

          return (
            <div key={`stack-${idx}`} className="flex flex-col gap-8 h-full">
              {group.data.map((hWork) => (
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

// POMOĆNA KOMPONENTA ZA KARTICU
function WorkCard({ work, isShort }: { work: Work, isShort: boolean }) {
  return (
    <div className="group relative flex flex-col h-full">
      <div className={`relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 transition-all duration-500 group-hover:border-[#afff00]/40 
        ${isShort ? "aspect-[9/16]" : "aspect-video"}`}>
        <StudioPlayer videoUrl={work.url} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-px w-6 bg-[#afff00]/30" />
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
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
              <span className="text-[9px] font-black">
                {new Date(work.createdAt).toLocaleDateString('en-GB')}
              </span>
           </div>
           <div className="w-1.5 h-1.5 bg-[#afff00] rounded-full" />
        </div>
      </div>
    </div>
  );
}