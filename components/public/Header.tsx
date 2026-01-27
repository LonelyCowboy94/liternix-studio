import Link from 'next/link';

export default function Header() {
  return (
    <nav className="flex items-center p-8 relative z-30 max-w-7xl mx-auto w-full">
  
  {/* LEVI DEO: Logo */}
  <div className="flex-1 flex justify-start">
    <Link href="/" className="text-2xl font-black tracking-tighter italic">
      LUKA_JOKIC<span className="text-[#afff00]">.</span>
    </Link>
  </div>

  {/* SREDNJI DEO: Navigacija (Uvek u centru) */}
  <div className="hidden md:flex flex-1 justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
    <Link href="/showreel" className="hover:text-[#afff00] transition-colors uppercase">Work</Link>
    <Link href="#services" className="hover:text-[#afff00] transition-colors uppercase">Services</Link>
    <Link href="/manifesto" className="hover:text-[#afff00] transition-colors uppercase">Manifesto</Link>
  </div>

  {/* DESNI DEO: Rec Status */}
  <div className="flex-1 flex justify-end">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[#afff00] text-[10px] font-bold uppercase tracking-[0.2em] w-fit">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full scale-120 rounded-full bg-red-600 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
      Rec
    </div>
  </div>

</nav>
  );
}