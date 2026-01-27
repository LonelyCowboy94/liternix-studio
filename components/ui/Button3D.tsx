"use client";

export default function Button3D({ children, primary = false }: { children: React.ReactNode, primary?: boolean }) {
  return (
    <button className={`
      relative px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-100
      ${primary 
        ? 'bg-[#afff00] text-black shadow-[0_8px_0_0_#76ad00] active:shadow-none active:translate-y-2' 
        : 'bg-zinc-900 text-white border border-zinc-800 shadow-[0_8px_0_0_#111111] active:shadow-none active:translate-y-2'}
    `}>
      {/* PROFESSIONAL INNER SHADOW */}
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] pointer-events-none opacity-40" />
      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_-2px_4px_rgba(0,0,0,0.5)] pointer-events-none opacity-40" />
      
      <span className="flex items-center gap-3 relative z-10">
        {children}
      </span>
    </button>
  );
}