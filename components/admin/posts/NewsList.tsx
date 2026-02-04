import Image from "next/image";
import { Edit3, Trash2, Image as ImageIcon } from "lucide-react";
import { NewsItem } from "@/types/news";

interface NewsListProps {
  newsList: NewsItem[];
  loading: boolean;
  handleEdit: (news: NewsItem) => void;
  handleDelete: (id: string) => void;
}

export const NewsList = ({ newsList, loading, handleEdit, handleDelete }: NewsListProps) => {
  if (loading) {
    return <div className="p-20 text-center text-zinc-600 font-black uppercase tracking-[0.5em] animate-pulse italic">Fetching_Data_Stream...</div>;
  }

  if (newsList.length === 0) {
    return <div className="p-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-500 font-black uppercase tracking-widest italic">Archive_Empty.</div>;
  }

  return (
    <section className="space-y-8">
      <h2 className="text-xl font-black uppercase italic tracking-[0.3em] text-zinc-500 px-4">{"//"} RECENT_SIGNALS_LOG</h2>
      <div className="grid gap-4">
        {newsList.map((n) => (
          <div key={n.id} className="bg-zinc-900/60 p-5 rounded-3xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between group hover:border-[#afff00]/40 transition-all duration-500 backdrop-blur-sm">
            <div className="flex items-center gap-6 w-full">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 group-hover:border-[#afff00]/30 transition-all">
                {n.image_url ? (
                  <Image src={n.image_url} alt="" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700"><ImageIcon size={24} /></div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-white uppercase italic text-lg leading-tight tracking-tight group-hover:text-[#afff00] transition-colors">{n.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest mt-2">
                  <span className={n.status === "published" ? "text-[#afff00] px-2 py-0.5 border border-[#afff00]/20 rounded" : "text-amber-500 px-2 py-0.5 border border-amber-500/20 rounded"}>{n.status}</span>
                  <span className="text-zinc-600 font-mono italic uppercase">By_Operator: {n.author || "UNKNOWN"}</span>
                  {n.featured && <span className="bg-[#afff00] text-black px-2 py-0.5 rounded italic">FEATURED_SLOT</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0 w-full md:w-auto justify-end">
              <button onClick={() => handleEdit(n)} className="p-3 bg-zinc-800 hover:bg-[#afff00] text-zinc-500 hover:text-black rounded-xl transition-all duration-300" title="Edit_Entry"><Edit3 size={18} /></button>
              <button onClick={() => handleDelete(n.id)} className="p-3 bg-zinc-800 hover:bg-red-600 text-zinc-500 hover:text-white rounded-xl transition-all duration-300" title="Purge_Entry"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};