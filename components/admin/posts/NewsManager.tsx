"use client";

import { useState, useEffect, useRef } from "react";
import { Edit3, Trash2, Image as ImageIcon, CheckCircle2, Terminal, RefreshCw } from "lucide-react";
import Image from "next/image";
import Button3D from "@/components/ui/Button3D";

type NewsItem = {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  author?: string;
  featured: boolean;
  status: string;
  publishedAt?: string;
  image_url?: string;
  metaTitle?: string;
  metaDescription?: string;
};

type NewsInput = Omit<NewsItem, "id">;

export default function NewsManager() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<NewsInput>>({
    status: "draft",
    featured: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNewsList(data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !preset) throw new Error("Cloudinary config missing");

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", preset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: form,
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. IMAGE HANDLING
      let finalImageUrl = formData.image_url || "";
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      // 2. TEXT FORMATTING LOGIC
      const formatHtml = (text: string) => {
        if (!text) return "";
        return text.replace(/\n/g, "<br />"); 
      };

      const payload: NewsInput = {
        title: formData.title || "",
        subtitle: formData.subtitle || "",
        excerpt: formData.excerpt || "",
  
        content:
          formData.content?.includes("<br />") ||
          formData.content?.includes("<p>")
            ? formData.content
            : formatHtml(formData.content || ""),
        author: formData.author || "",
        featured: formData.featured || false,
        status: formData.status || "draft",
        publishedAt: formData.publishedAt,
        image_url: finalImageUrl,
        metaTitle: formData.metaTitle || formData.title || "",
        metaDescription:
          formData.metaDescription || formData.excerpt || formData.title || "",
      };

      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...payload, id: editingId } : payload;

      const res = await fetch("/api/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save news");

      const data = await res.json();

      if (editingId) {
        setNewsList(newsList.map((n) => (n.id === editingId ? data[0] : n)));
      } else {
        setNewsList([data[0], ...newsList]);
      }

      resetForm();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ status: "draft", featured: false });
    setEditingId(null);
    setImageFile(null);
  };

  const handleEdit = (news: NewsItem) => {
    setFormData(news);
    setEditingId(news.id);
    // Scroll to form for better UX
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNewsList(newsList.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed");
    }
  };

  return (
  <div className="min-h-screen bg-black text-white p-4 md:p-10 relative overflow-hidden">
    {/* GLOBAL SCANLINE */}
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-0" />

    <div className="max-w-5xl mx-auto relative z-10" ref={formRef}>
      
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse shadow-[0_0_10px_#afff00]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Signal_Module: Active</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
            News_Archive<span className="text-[#afff00]">.</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
            Deploy, edit and manage portal intelligence.
          </p>
        </div>
      </header>

      {/* FORM SECTION */}
      <section className="bg-zinc-900/40 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden mb-20 backdrop-blur-md">
        <div className="p-1 bg-[#afff00] shadow-[0_0_20px_rgba(175,255,0,0.3)]" />
        
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-3">
            <Terminal className="text-[#afff00]" size={28} />
            {editingId ? "Modify_Existing_Log" : "Initialize_New_Entry"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN */}
              <div className="space-y-8">
                {/* TITLE */}
                <div className="relative group">
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    placeholder=" "
                    required
                    className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic"
                  />
                  <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">
                    Article_Headline *
                  </label>
                </div>

                {/* SUBTITLE */}
                <div className="relative group">
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle || ""}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic"
                  />
                  <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">
                    Secondary_Line
                  </label>
                </div>

                {/* AUTHOR */}
                <div className="relative group">
                  <input
                    type="text"
                    name="author"
                    value={formData.author || ""}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic"
                  />
                  <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">
                    Assigned_Operator
                  </label>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-8">
                {/* EXCERPT */}
                <div className="relative group">
                  <textarea
                    name="excerpt"
                    rows={2}
                    value={formData.excerpt || ""}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold resize-none h-28.75"
                  />
                  <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">
                    Brief_Summary
                  </label>
                </div>

                {/* IMAGE UPLOAD */}
                <div className="relative group p-4 border border-zinc-800 rounded-xl hover:border-[#afff00]/40 transition-all">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3 block">Media_Attachment</label>
                  <Button3D primary>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="text-[11px] text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:text-black cursor-pointer w-full"
                  />
                  </Button3D>
                  {formData.image_url && !imageFile && (
                    <p className="text-[9px] font-black text-[#afff00] mt-2 italic flex items-center gap-1">
                      <CheckCircle2 size={10} /> IMAGE_LINK_SECURED
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CONTENT TEXTAREA */}
            <div className="relative group">
              <textarea
                name="content"
                rows={6}
                value={formData.content || ""}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-2xl outline-none focus:border-[#afff00] transition-all text-sm font-medium leading-relaxed"
              />
              <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">
                Main_Intelligence_Body *
              </label>
            </div>

            {/* SETTINGS BAR */}
            <div className="flex flex-wrap items-center gap-8 p-6 bg-black/40 rounded-2xl border border-zinc-800/50">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured || false}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border border-zinc-700 bg-black checked:bg-[#afff00] accent-[#afff00] transition-all cursor-pointer"
                />
                <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-[#afff00] transition-colors">
                  Flag_As_Featured
                </span>
              </label>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visibility:</span>
                <select
                  name="status"
                  value={formData.status || "draft"}
                  onChange={handleChange}
                  className="bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-[#afff00] rounded-lg px-3 py-2 outline-none focus:border-[#afff00]"
                >
                  <option value="draft">Draft_Mode</option>
                  <option value="published">Live_Broadcast</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Schedule:</span>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ""}
                  onChange={handleChange}
                  className="bg-zinc-900 border border-zinc-800 text-[10px] font-black text-white uppercase rounded-lg px-3 py-2 outline-none focus:border-[#afff00]"
                />
              </div>
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="flex justify-end items-center gap-6 pt-4">
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Abort_Changes
                </button>
              )}
              <Button3D primary
                type="submit"
                disabled={false}
                className="group relative bg-[#afff00] text-black px-10 py-4 rounded-xl font-black uppercase italic tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(175,255,0,0.2)]"
              >
                <div className="flex items-center gap-2">
                  {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : (editingId ? "Update_Protocol" : "Deploy_Intelligence")}
                </div>
              </Button3D>
            </div>
          </form>
        </div>
      </section>

      {/* LIST SECTION */}
      <section className="space-y-8">
        <h2 className="text-xl font-black uppercase italic tracking-[0.3em] text-zinc-500 px-4">
          {"//"} RECENT_SIGNALS_LOG
        </h2>

        {loading ? (
          <div className="p-20 text-center text-zinc-600 font-black uppercase tracking-[0.5em] animate-pulse italic">
            Fetching_Data_Stream...
          </div>
        ) : newsList.length === 0 ? (
          <div className="p-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-500 font-black uppercase tracking-widest italic">
            Archive_Empty.
          </div>
        ) : (
          <div className="grid gap-4">
            {newsList.map((n) => (
              <div
                key={n.id}
                className="bg-zinc-900/60 p-5 rounded-3xl border border-zinc-800 flex flex-col md:flex-row items-center justify-between group hover:border-[#afff00]/40 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center gap-6 w-full">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 group-hover:border-[#afff00]/30 transition-all">
                    {n.image_url ? (
                      <Image
                        src={n.image_url}
                        alt=""
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-white uppercase italic text-lg leading-tight tracking-tight group-hover:text-[#afff00] transition-colors">
                      {n.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-[9px] font-black uppercase tracking-widest mt-2">
                      <span className={n.status === "published" ? "text-[#afff00] px-2 py-0.5 border border-[#afff00]/20 rounded" : "text-amber-500 px-2 py-0.5 border border-amber-500/20 rounded"}>
                        {n.status}
                      </span>
                      <span className="text-zinc-600 font-mono italic uppercase">
                        By_Operator: {n.author || "UNKNOWN"}
                      </span>
                      {n.featured && (
                        <span className="bg-[#afff00] text-black px-2 py-0.5 rounded italic">
                          FEATURED_SLOT
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6 md:mt-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleEdit(n)}
                    className="p-3 bg-zinc-800 hover:bg-[#afff00] text-zinc-500 hover:text-black rounded-xl transition-all duration-300"
                    title="Edit_Entry"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-3 bg-zinc-800 hover:bg-red-600 text-zinc-500 hover:text-white rounded-xl transition-all duration-300"
                    title="Purge_Entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  </div>
);
}

