export const NewsHeader = () => (
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
);