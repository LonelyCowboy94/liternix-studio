"use client";

import { useState, useEffect, useRef } from "react";
import { NewsItem, NewsInput } from "@/types/news";
import { NewsHeader } from "./NewsHeader";
import { NewsForm } from "./NewsForm";
import { NewsList } from "./NewsList";

export default function NewsManager() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<NewsInput>>({ status: "draft", featured: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchNews(); }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNewsList(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
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
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.image_url || "";
      if (imageFile) finalImageUrl = await uploadImage(imageFile);
      const formatHtml = (text: string) => text ? text.replace(/\n/g, "<br />") : "";
      
      const payload: NewsInput = {
        ...formData,
        title: formData.title || "",
        content: formData.content?.includes("<br />") || formData.content?.includes("<p>") ? formData.content : formatHtml(formData.content || ""),
        image_url: finalImageUrl,
        metaTitle: formData.metaTitle || formData.title || "",
        metaDescription: formData.metaDescription || formData.excerpt || formData.title || "",
      } as NewsInput;

      const res = await fetch("/api/news", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload),
      });

      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (editingId) setNewsList(newsList.map((n) => (n.id === editingId ? data[0] : n)));
      else setNewsList([data[0], ...newsList]);
      resetForm();
    } catch (error) { alert(error instanceof Error ? error.message : "Error"); } finally { setIsSubmitting(false); }
  };

  const resetForm = () => {
    setFormData({ status: "draft", featured: false });
    setEditingId(null);
    setImageFile(null);
  };

  const handleEdit = (news: NewsItem) => {
    setFormData(news);
    setEditingId(news.id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await fetch("/api/news", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      setNewsList(newsList.filter((n) => n.id !== id));
    } catch (error) { console.error(error); }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-0" />
      <div className="max-w-5xl mx-auto relative z-10" ref={formRef}>
        <NewsHeader />
        <NewsForm 
          formData={formData} 
          editingId={editingId} 
          isSubmitting={isSubmitting} 
          imageFile={imageFile} 
          handleChange={handleChange} 
          handleImageChange={handleImageChange} 
          handleSubmit={handleSubmit} 
          resetForm={resetForm} 
        />
        <NewsList 
          newsList={newsList} 
          loading={loading} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
        />
      </div>
    </div>
  );
}