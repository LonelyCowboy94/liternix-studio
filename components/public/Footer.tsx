export default function Footer() {
  return (
    <footer className="p-12 text-center relative z-10">
      <div className="text-zinc-800 font-black text-8xl md:text-[14rem] select-none pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20 tracking-tighter uppercase">
        LITERNIX
      </div>
      <div className="relative z-20 flex flex-col items-center gap-4">
        <div className="h-px w-20 bg-[#afff00]" />
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em]">
          Est. 2025 // All Rights Reserved
        </p>
      </div>
    </footer>
  );
}