"use client";

import React, { useState, useEffect } from "react";
import { addWorkAction, deleteWorkAction, updateOrderAction } from "@/actions/work";
import { PortfolioWork } from "@/db/schema";
import { Reorder } from "framer-motion";
import { Trash2, GripVertical, Plus, ChevronDown, Save, RefreshCw, Star } from "lucide-react";
import Button3D from "@/components/ui/Button3D";

export default function AdminPage() {
  const [works, setWorks] = useState<PortfolioWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false); 
  const [showOptions, setShowOptions] = useState(false);

  const fetchWorks = async () => {
    const res = await fetch(`/api/work?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Pragma': 'no-cache' }
    });
    const data = await res.json();
    setWorks(data);
    setHasChanges(false);
  };

  useEffect(() => { 
    const fetchData = async () => {
      await fetchWorks();
    }
    fetchData();
   }, []);

  const handleReorder = (newOrder: PortfolioWork[]) => {
    setWorks(newOrder);
    setHasChanges(true);
  };

  const handleLocalToggleFeatured = (id: number) => {
    const updatedWorks = works.map(w => ({
      ...w,
      type: w.id === id ? (w.type === 1 ? 0 : 1) : 0
    }));
    setWorks(updatedWorks);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    const ids = works.map(w => w.id as number);
    const types = works.map(w => (w.type ?? 0) as number);
    
    const result = await updateOrderAction(ids, types);
    if (result.success) {
      setHasChanges(false);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete project?")) return;
    const result = await deleteWorkAction(id);
    if (result.success) fetchWorks();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    const formData = new FormData(form);
    
    const result = await addWorkAction({
      url: formData.get("url") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") ? Number(formData.get("type")) : 0,
    });

    if (result.success) {
      form.reset();
      setShowOptions(false);
      fetchWorks();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 pb-32">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-wrap gap-4 justify-between items-center mb-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Control_Panel<span className="text-[#afff00]">.</span>
          </h1>
      
          {hasChanges && (
            <div className="flex items-center gap-4 animate-in fade-in zoom-in duration-300">
              <span className="text-[10px] font-black text-[#afff00] uppercase tracking-widest bg-[#afff00]/10 px-3 py-1 rounded-full border border-[#afff00]/20">
                Changes Detected
              </span>
              <Button3D primary
                onClick={handleSaveOrder}
                disabled={false}
                className="flex items-center gap-2 bg-[#afff00] text-black px-6 py-2 rounded-xl font-black uppercase text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(175,255,0,0.3)]"
              >
                {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                {isSaving ? "Syncing..." : "Save"}
              </Button3D>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 relative group">
              <input name="title" required placeholder=" " className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-medium" />
              <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] uppercase font-black tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">Project_Title</label>
            </div>

            <div className="md:col-span-5 relative group">
              <input name="url" required placeholder=" " className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] transition-all text-sm font-medium" />
              <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] uppercase font-black tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">YouTube_Source_URL</label>
            </div>

            <div className="md:col-span-2">
              <Button3D primary type='submit' className="w-full h-13.5 text-black font-black uppercase flex items-center justify-center">
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Plus size={24} strokeWidth={3} />}
              </Button3D>
            </div>
          </div>

          <div className="mt-8">
            <button type="button" onClick={() => setShowOptions(!showOptions)} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors">
              <ChevronDown size={14} className={showOptions ? 'rotate-180 text-[#afff00]' : ''} />
              {showOptions ? 'Collapse_Metadata' : 'Expand_Metadata'}
            </button>

            {showOptions && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="md:col-span-9 relative">
                  <textarea name="description" placeholder=" " className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-2xl outline-none focus:border-[#afff00] h-28 resize-none text-sm" />
                  <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] uppercase font-black tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">Detailed_Description</label>
                </div>
                <div className="md:col-span-3 relative">
                  <input name="type" type="number" placeholder=" " className="peer w-full bg-transparent border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#afff00] text-sm" />
                  <label className="absolute left-3 -top-2.5 px-2 bg-[#121214] text-[10px] uppercase font-black tracking-widest text-zinc-500 transition-all peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-[#afff00] pointer-events-none">Sort_Index</label>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* List */}
        <div className="space-y-4">
          <h2 className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.3em] ml-2">Live_Archive</h2>
          <Reorder.Group axis="y" values={works} onReorder={handleReorder} className="space-y-3">
            {works.map((work, index) => (
              <Reorder.Item 
                key={work.id} 
                value={work}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors cursor-grab active:cursor-grabbing
                  ${work.type === 1 ? 'bg-[#afff00]/5 border-[#afff00]/30' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}
                `}
              >
                <div className="text-zinc-700 hover:text-[#afff00] transition-colors">
                  <GripVertical size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-600">0{index}</span>
                    <h3 className="font-bold uppercase italic text-sm tracking-tight truncate">{work.title}</h3>
                    {work.type === 1 && <span className="text-[8px] font-black bg-[#afff00] text-black px-2 py-0.5 rounded-full uppercase">Featured</span>}
                  </div>
                  <p className="text-[9px] text-zinc-600 font-mono truncate max-w-xs">{work.url}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* STAR BUTTON: Toggles locally and triggers Save prompt */}
                  <button 
                    onClick={() => handleLocalToggleFeatured(work.id)} 
                    className={`p-2 rounded-lg transition-colors ${work.type === 1 ? 'text-[#afff00]' : 'text-zinc-600 hover:text-[#afff00]'}`}
                  >
                    <Star size={18} fill={work.type === 1 ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={() => handleDelete(work.id)} 
                    className="p-2 text-zinc-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

      </div>
    </div>
  );
}