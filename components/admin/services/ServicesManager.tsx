"use client";

import { deleteCloudinaryImagesAction } from "@/app/api/services/action";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getPublicIdFromUrl } from "@/utils/cloudinary";
import { Edit3, Trash2, Plus, RefreshCw, FileText, Layers } from "lucide-react";
import Button3D from "@/components/ui/Button3D";

interface JsonTextBlock {
  text: string;
  highlight?: boolean;
}
interface ServiceImage {
  url: string;
  alt?: string;
}
interface ServiceItem {
  id: string;
  title: string;
  subtitle: JsonTextBlock[] | null;
  description: JsonTextBlock[] | null;
  content: JsonTextBlock[] | null;
  slug: string;
  images: ServiceImage[] | null;
  status: "draft" | "published";
}
interface UISection {
  subtitle: JsonTextBlock;
  description: JsonTextBlock;
  content: JsonTextBlock;
  image: ServiceImage | null;
  newFile?: File | null;
}

export default function ServicesManager() {
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [sections, setSections] = useState<UISection[]>([
    {
      subtitle: { text: "", highlight: false },
      description: { text: "", highlight: false },
      content: { text: "", highlight: false },
      image: null,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    if (res.ok) setServicesList(await res.json());
    setLoading(false);
  };

  const deleteCloudinaryImages = async (urls: string[]) => {
    const publicIds = urls
      .map((url) => getPublicIdFromUrl(url))
      .filter((id): id is string => id !== null);

    if (publicIds.length === 0) return;

    try {
      const res = await deleteCloudinaryImagesAction(publicIds);

      if (!res.success) {
        console.error("Cloudinary delete failed:", res.error);
        alert("Deleteion failed on Cloudinary.");
      } else {
        console.log("Images deleted from Cloudinary successfully.");
      }
    } catch (err) {
      console.error("Error deleting images:", err);
    }
  };

  // --- DELETE PAGE ---
  const handleDeletePage = async (service: ServiceItem) => {
    if (
      !confirm(
        `Are you sure you want to delete the entire page "${service.title}" and all images from Cloudinary?`,
      )
    )
      return;

    try {
      const allUrls =
        service.images?.map((img) => img.url).filter(Boolean) || [];

      if (allUrls.length > 0) await deleteCloudinaryImages(allUrls);

      const res = await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service.id }),
      });

      if (!res.ok) throw new Error("Database deletion failed");

      fetchServices();
      alert("Page and associated images deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Error deleting page.");
    }
  };

  // --- DELETE SECTION ---
  const removeSection = async (index: number) => {
    const section = sections[index];

    if (section.image?.url) {
      if (
        confirm(
          "This section has an image. Do you want to delete it from Cloudinary?",
        )
      ) {
        await deleteCloudinaryImages([section.image.url]);
      } else {
        return;
      }
    }

    setSections(sections.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const processedSections = await Promise.all(
        sections.map(async (sec) => {
          let imageUrl = sec.image?.url || "";
          if (sec.newFile) imageUrl = await uploadToCloudinary(sec.newFile);
          return { ...sec, image: { url: imageUrl, alt: title } };
        }),
      );

      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        status,
        subtitle: processedSections.map((s) => s.subtitle),
        description: processedSections.map((s) => s.description),
        content: processedSections.map((s) => s.content),
        images: processedSections.map((s) => s.image),
        ...(editingId && { id: editingId }),
      };

      await fetch("/api/services", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      resetForm();
      fetchServices();
    } catch (error) {
      console.error(error);
      alert("Greška pri čuvanju.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingId(service.id);
    setTitle(service.title);
    setSlug(service.slug);
    setStatus(service.status);

    const maxLen = Math.max(
      service.content?.length || 0,
      service.subtitle?.length || 0,
      service.description?.length || 0,
    );
    const loadedSections: UISection[] = [];
    for (let i = 0; i < maxLen; i++) {
      loadedSections.push({
        subtitle: service.subtitle?.[i] || { text: "", highlight: false },
        description: service.description?.[i] || { text: "", highlight: false },
        content: service.content?.[i] || { text: "", highlight: false },
        image: service.images?.[i] || null,
      });
    }
    setSections(
      loadedSections.length > 0
        ? loadedSections
        : [
            {
              subtitle: { text: "", highlight: false },
              description: { text: "", highlight: false },
              content: { text: "", highlight: false },
              image: null,
            },
          ],
    );
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setSections([
      {
        subtitle: { text: "", highlight: false },
        description: { text: "", highlight: false },
        content: { text: "", highlight: false },
        image: null,
      },
    ]);
  };

  if (loading) return <div className="p-10 text-center">Učitavanje...</div>;

 return (
  <div className="min-h-screen bg-black text-white p-4 md:p-10 relative overflow-hidden" ref={formRef}>
    {/* GLOBAL SCANLINE */}
    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-0" />

    <div className="max-w-5xl mx-auto relative z-10">
      
      {/* HEADER */}
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse shadow-[0_0_10px_#afff00]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Service_Matrix: Online</span>
        </div>
        <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
          Service_Engine<span className="text-[#afff00]">.</span>
        </h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 italic">
          Construct, edit and deploy high-end service architectures.
        </p>
      </header>

      {/* MAIN FORM CARD */}
      <section className="bg-zinc-900/40 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden mb-20 backdrop-blur-md">
        <div className="p-1 bg-[#afff00] shadow-[0_0_20px_rgba(175,255,0,0.3)]" />
        
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-3">
            <Layers className="text-[#afff00]" size={28} />
            {editingId ? "Modify_Service_Matrix" : "Initialize_New_Service"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* CORE INFO (Title & Slug) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <input
                  placeholder=" "
                  className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">
                  Service_Title *
                </label>
              </div>

              <div className="relative group">
                <input
                  placeholder=" "
                  className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-bold uppercase italic"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
                <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:text-[#afff00] pointer-events-none">
                  URL_Slug (Autogen)
                </label>
              </div>
            </div>

            {/* SECTIONS MANAGER */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">
                  Content_Modules // [{sections.length}]
                </h3>
                <Button3D
                  type="button"
                  onClick={() =>
                    setSections([
                      ...sections,
                      {
                        subtitle: { text: "", highlight: false },
                        description: { text: "", highlight: false },
                        content: { text: "", highlight: false },
                        image: null,
                      },
                    ])
                  }
                  className="px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <Plus size={14} strokeWidth={3} /> Add_Module
                </Button3D>
              </div>

              <div className="space-y-10">
                {sections.map((sec, i) => (
                  <div
                    key={i}
                    className="p-8 bg-black/40 rounded-2xl border border-zinc-800 space-y-6 relative group/section animate-in fade-in slide-in-from-top-4 duration-500"
                  >
                    {/* Module Counter & Delete */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
                        Module_0{i + 1}
                      </span>
                      <button
                        onClick={() => removeSection(i)}
                        className="p-2 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Purge_Module"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Subtitle Input */}
                    <div className="relative group">
                      <input
                        placeholder=" "
                        className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-xs font-bold uppercase italic"
                        value={sec.subtitle.text}
                        onChange={(e) => {
                          const s = [...sections];
                          s[i].subtitle.text = e.target.value;
                          setSections(s);
                        }}
                      />
                      <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[9px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                        Module_Subtitle
                      </label>
                    </div>

                    {/* Description Input */}
                    <div className="relative group">
                      <textarea
                        placeholder=" "
                        className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-xs font-medium resize-none h-20"
                        value={sec.description.text}
                        onChange={(e) => {
                          const s = [...sections];
                          s[i].description.text = e.target.value;
                          setSections(s);
                        }}
                      />
                      <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[9px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                        Module_Summary
                      </label>
                    </div>

                    {/* Media Upload Box */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800 group-hover/section:border-zinc-700 transition-all">
                      {(sec.image?.url || sec.newFile) && (
                        <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
                          <Image
                            src={sec.newFile ? URL.createObjectURL(sec.newFile) : sec.image!.url}
                            alt="Preview"
                            fill
                            className="object-cover grayscale"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] block">Module_Visual_Asset</label>
                        <Button3D primary>
                        <input
                          type="file"
                          className="text-[10px] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[9px] file:uppercase cursor-pointer w-full"
                          onChange={(e) => {
                            const s = [...sections];
                            if (e.target.files) s[i].newFile = e.target.files[0];
                            setSections(s);
                          }}
                        />
                        </Button3D>
                      </div>
                    </div>

                    {/* Main Content Body */}
                    <div className="relative group">
                      <textarea
                        placeholder=" "
                        className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-medium leading-relaxed"
                        rows={4}
                        value={sec.content.text}
                        onChange={(e) => {
                          const s = [...sections];
                          s[i].content.text = e.target.value;
                          setSections(s);
                        }}
                        required
                      />
                      <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[9px] font-black uppercase tracking-widest text-zinc-600 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">
                        Intelligence_Data *
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SETTINGS & ACTION BAR */}
            <div className="flex flex-wrap gap-8 items-center pt-10 border-t border-zinc-800">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Visibility:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  className="bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-[#afff00] rounded-lg px-4 py-2 outline-none focus:border-[#afff00]"
                >
                  <option value="draft">Draft_Mode</option>
                  <option value="published">Public_Release</option>
                </select>
              </div>

              <div className="flex gap-4 ml-auto items-center">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
                  >
                    Abort_Matrix
                  </button>
                )}
                <Button3D primary
                  type="submit"
                  disabled={false}
                  className="bg-[#afff00] text-black px-10 py-4 rounded-xl font-black uppercase italic tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(175,255,0,0.2)]"
                >
                  {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : (editingId ? "Update_Service_Protocol" : "Deploy_Service_Matrix")}
                </Button3D>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* SERVICE LIST ARCHIVE */}
      <section className="space-y-6 max-w-5xl mt-20">
        <h2 className="text-xl font-black uppercase italic tracking-[0.3em] text-zinc-600 px-4">
          {"//"} SERVICE_ARCHIVE_REGISTRY
        </h2>

        {servicesList.length === 0 ? (
          <div className="p-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] text-zinc-600 font-black uppercase tracking-widest italic">
            No_Active_Signals_Found.
          </div>
        ) : (
          <div className="grid gap-4">
            {servicesList.map((s) => (
              <div
                key={s.id}
                className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between group hover:border-[#afff00]/40 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center text-[#afff00] group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                   </div>
                   <div>
                    <h3 className="font-black text-white uppercase italic text-lg tracking-tight group-hover:text-[#afff00] transition-colors">{s.title}</h3>
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] mt-1">
                      <span className={s.status === "published" ? "text-[#afff00]" : "text-amber-600"}>
                        {s.status === "published" ? "Live_Status" : "Draft_Standby"}
                      </span>
                      <span className="text-zinc-700">|</span>
                      <span className="text-zinc-500">UID: {s.id.toString().padStart(4, '0')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(s)}
                    className="p-3 bg-zinc-800 hover:bg-[#afff00] text-zinc-500 hover:text-black rounded-xl transition-all duration-300 shadow-lg"
                    title="Modify_Protocol"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePage(s)}
                    className="p-3 bg-zinc-800 hover:bg-red-600 text-zinc-500 hover:text-white rounded-xl transition-all duration-300 shadow-lg"
                    title="Purge_Protocol"
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