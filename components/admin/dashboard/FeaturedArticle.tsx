"use client";
import { Newspaper, ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

interface ArticleProps {
  title: string;
  createdAt: Date | string | null;
  link: string;
}

export default function FeaturedArticle({ title, createdAt, link }: ArticleProps) {
  return (
    <div className="bg-zinc-900/40 p-8 rounded-xl border border-zinc-800 shadow-2xl relative group overflow-hidden transition-all duration-500 hover:border-[#afff00]/30 backdrop-blur-sm">
      
      {/* HEADER: ICON & STATUS */}
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl group-hover:bg-[#afff00] group-hover:border-[#afff00] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(175,255,0,0.3)]">
          <Newspaper size={24} className="text-[#afff00] group-hover:text-black transition-colors duration-500" />
        </div>
        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-zinc-800">
           <div className="w-1 h-1 bg-zinc-500 group-hover:bg-[#afff00] transition-colors" />
           Verified_Log
        </div>
      </div>
      
      {/* CONTENT: TIMESTAMP & TITLE */}
      <div className="space-y-4 mb-10 relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-black text-[#afff00]/60 uppercase tracking-[0.3em] italic">
          <Terminal size={12} /> 
          TIMESTAMP: {createdAt ? new Date(createdAt).toLocaleDateString('en-GB') : "00/00/0000"}
        </div>
        <h3 className="font-black text-white uppercase italic line-clamp-2 text-2xl tracking-tighter leading-[0.9] group-hover:text-[#afff00] transition-colors duration-500">
          {title}
        </h3>
      </div>

      {/* ACTION: CTA */}
      <Link 
        href={link} 
        className="inline-flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:text-white transition-all group/link"
      >
        <span className="group-hover/link:mr-2 transition-all">Modify_Entry_Data</span>
        <ArrowRight size={14} className="text-[#afff00]" />
      </Link>

      {/* DECORATIVE ELEMENTS */}
      {/* Bottom Glow */}
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#afff00]/5 rounded-full blur-3xl group-hover:bg-[#afff00]/10 transition-all duration-1000" />
      
     

    </div>
  );
}