import { Terminal, CheckCircle2, RefreshCw } from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import { NewsInput } from "@/types/news";

interface NewsFormProps {
  formData: Partial<NewsInput>;
  editingId: string | null;
  isSubmitting: boolean;
  imageFile: File | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

export const NewsForm = ({
  formData,
  editingId,
  isSubmitting,
  imageFile,
  handleChange,
  handleImageChange,
  handleSubmit,
  resetForm,
}: NewsFormProps) => {
  return (
    <section className="bg-zinc-900/40 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden mb-20 backdrop-blur-md">
      <div className="p-1 bg-[#afff00] shadow-[0_0_20px_rgba(175,255,0,0.3)]" />
      <div className="p-8 md:p-12">
        <h2 className=" text-xl md:text-3xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-3">
          <Terminal className="text-[#afff00]" size={28} />
          {editingId ? "Modify_Existing_Log" : "Initialize_New_Entry"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="relative group">
                <input type="text" name="title" value={formData.title || ""} onChange={handleChange} placeholder=" " required className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic" />
                <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">Article_Headline *</label>
              </div>
              <div className="relative group">
                <input type="text" name="subtitle" value={formData.subtitle || ""} onChange={handleChange} placeholder=" " className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic" />
                <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">Secondary_Line</label>
              </div>
              <div className="relative group">
                <input type="text" name="author" value={formData.author || ""} onChange={handleChange} placeholder=" " className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic" />
                <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">Assigned_Operator</label>
              </div>
            </div>
            <div className="space-y-8">
              <div className="relative group">
                <textarea name="excerpt" rows={2} value={formData.excerpt || ""} onChange={handleChange} placeholder=" " className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold resize-none h-28.75" />
                <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">Brief_Summary</label>
              </div>
              <div className="relative group p-4 border border-zinc-800 rounded-xl hover:border-[#afff00]/40 transition-all">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3 block">Media_Attachment</label>
                <Button3D primary>
                  <input type="file" onChange={handleImageChange} className="text-[11px] text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:text-black cursor-pointer w-full" />
                </Button3D>
                {formData.image_url && !imageFile && (
                  <p className="text-[9px] font-black text-[#afff00] mt-2 italic flex items-center gap-1">
                    <CheckCircle2 size={10} /> IMAGE_LINK_SECURED
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="relative group">
            <textarea name="content" rows={6} value={formData.content || ""} onChange={handleChange} placeholder=" " required className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-2xl outline-none focus:border-[#afff00] transition-all text-sm font-medium leading-relaxed" />
            <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">Main_Intelligence_Body *</label>
          </div>

          <div className="flex flex-wrap items-center gap-8 p-6 bg-black/40 rounded-2xl border border-zinc-800/50">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" name="featured" checked={formData.featured || false} onChange={handleChange} className="w-5 h-5 rounded border border-zinc-700 bg-black checked:bg-[#afff00] accent-[#afff00] transition-all cursor-pointer" />
              <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#afff00] transition-colors">Flag_As_Featured</span>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visibility:</span>
              <select name="status" value={formData.status || "draft"} onChange={handleChange} className="bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-[#afff00] rounded-lg px-3 py-2 outline-none focus:border-[#afff00]">
                <option value="draft">Draft_Mode</option>
                <option value="published">Live_Broadcast</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Schedule:</span>
              <input type="datetime-local" name="publishedAt" value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""} onChange={handleChange} className="bg-zinc-900 border border-zinc-800 text-[10px] font-black text-white uppercase rounded-lg px-3 py-2 outline-none focus:border-[#afff00]" />
            </div>
          </div>

          <div className="flex justify-end items-center gap-6 pt-4">
            {editingId && (
              <button type="button" onClick={resetForm} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Abort_Changes</button>
            )}
            <Button3D primary type="submit" disabled={isSubmitting} className="group relative bg-[#afff00] text-black px-10 py-4 rounded-xl font-black uppercase italic tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(175,255,0,0.2)]">
              <div className="flex items-center gap-2">
                {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : (editingId ? "Update_Protocol" : "Deploy_Intelligence")}
              </div>
            </Button3D>
          </div>
        </form>
      </div>
    </section>
  );
};