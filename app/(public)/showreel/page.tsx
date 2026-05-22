import { getWorksAction } from "@/actions/work";
import StudioPlayer from "@/components/public/StudioPlayer";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Film, Monitor, ArrowDown, Activity } from "lucide-react";
import Link from "next/link";
import AmbientBackground from "@/components/public/AmbientBackground";
import Button3D from "@/components/ui/Button3D";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
   metadataBase: new URL("https://jokicvisuals.com/showreel"),
  title: "Showreel & Selected Works | High-Impact Visual Content",
  description:
    "Take a look behind the lens of professional video crafting. From high-energy commercials to cinematic narratives—explore my portfolio of projects that capture attention and drive results.",
  keywords: [
    "Video Editing Showreel",
    "Commercial Video Portfolio",
    "Cinematic Post-Production",
    "Professional Video Editor Projects",
    "Motion Graphics Examples",
    "Viral Social Media Edits",
    "Brand Storytelling Video",
  ],
  openGraph: {
    title: "Cinematic Portfolio | Luka Jokić - Video Editor",
    description:
      "Watch my latest showreel and explore professional video editing projects that push creative boundaries.",
    type: "website",
    images: [
      {
        url: "/portfolio-og.jpg",
        width: 1200,
        height: 630,
        alt: "Professional Video Editing Portfolio Showreel",
      },
    ],
  },
};

export default async function WorkPage() {
  const works = await getWorksAction();

  return (
   <div className="min-h-screen bg-black text-white selection:bg-[#afff00] selection:text-black overflow-x-hidden">
      <AmbientBackground />
      <Header />

      <main className="relative z-10 pt-20 pb-40 px-6 md:px-12">
        {/* PAGE INTRO */}
        <section className="max-w-7xl mx-auto mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
                  Portfolio_v2.0
                </span>
              </div>
              <h1 className="text-6xl sm:text-7xl md:text-[9rem] font-black uppercase italic leading-[0.8] tracking-tighter">
                Selected <br /> <span className="text-[#afff00]">Works</span>
              </h1>
              <div className="flex flex-col gap-3 my-8 max-w-md">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#afff00] animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Verify Integrity</span>
                </div>
                <div className="w-full h-0.75 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#afff00]/60 animate-fill-bar" />
                </div>
              </div>
            </div>
            <div className="max-w-xs space-y-4">
              <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-widest leading-relaxed">
                A curated selection of high-impact visual stories and technical edits.
              </p>
              <div className="flex items-center gap-4 text-[#afff00] font-black italic text-sm animate-bounce">
                <ArrowDown size={20} /> Scroll_To_Explore
              </div>
            </div>
          </div>
        </section>

        {/* WORKS FEED */}
        <section className="max-w-7xl mx-auto">
         {works.map((work, index) => {
  const isShort = work.url.includes("shorts/");

  return (
     <div
      key={work.id}
      className="group mb-24 md:mb-30 relative grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center lg:items-start"
    >
      {/* INFO BLOK */}
      <div 
        className={`space-y-8 lg:pt-2 relative
          ${isShort 
            ? "lg:col-span-5 lg:order-1 order-2" 
            : "lg:col-span-4 lg:order-2 order-2"
          }`}
      >
        {/* 1. Broj i Linija (Top Alignment Anchor) */}
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-black text-zinc-800 italic leading-none">
            0{index + 1}
          </span>
          <div className="h-px flex-1 bg-zinc-800 group-hover:bg-[#afff00]/30 transition-colors mt-2" />
        </div>

        {/* 2. Naslov i Opis (Justified Article Style) */}
        <div className="space-y-6 relative min-h-62.5">
          <h2 className="text-4xl relative z-100 md:text-6xl font-black uppercase italic leading-[0.85] tracking-tighter group-hover:text-[#afff00] transition-colors duration-500">
            {work.title}
          </h2>
          
          {work.description && (
            <p className="text-base md:text-lg text-zinc-400 font-medium leading-relaxed max-w-md [text-justify:inter-word]">
              {work.description}
            </p>
          )}

          {/* 3. GHOST WATERMARK - Popunjava prazan prostor */}
          <div className="absolute -bottom-12 left-0 pointer-events-none select-none opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 transform group-hover:translate-x-2">
            <span 
              className="text-[80px] md:text-[130px] font-black uppercase italic leading-none tracking-tighter block text-transparent"
              style={{ WebkitTextStroke: '1.5px white' }}
            >
              {isShort ? "REELS" : "LONGFORM"}
            </span>
            <span className="text-[9px] font-mono tracking-[0.6em] text-[#afff00] uppercase ml-2 -mt-4 block opacity-50">
              {isShort ? "Social_Media_Content" : "High_End_Production_Edit"}
            </span>
          </div>
        </div>

        {/* 4. Tagovi i Meta Info */}
        <div className="space-y-10 relative z-10">
          <div className="flex flex-wrap gap-3">
            <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <Monitor size={12} className="text-[#afff00]" /> {isShort ? "9:16_VERT" : "16:9_WIDE"}
            </div>
            <div className="px-3 py-1 bg-[#afff00]/10 border border-[#afff00]/20 rounded-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#afff00]">
              <Film size={12} /> {isShort ? "REEL_FORMAT" : "MASTER_CUT"}
            </div>
          </div>

          {/* Dodatni dashboard detalji za popunjavanje donjeg dela */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-900">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Workflow</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase italic">Adobe_After_Effects</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Project_Status</span>
              <span className="text-[10px] font-bold text-[#afff00] uppercase italic">Final_Master_V2</span>
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER BLOK */}
      <div 
        className={`relative w-full max-[480px]:-mx-6 max-[480px]:w-[calc(100%+3rem)]
          ${isShort 
            ? "lg:col-span-7 lg:order-2 order-1 flex justify-center" 
            : "lg:col-span-8 lg:order-1 order-1" 
          }`}
      >
        <div className="absolute -inset-4 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 bg-[#afff00]/20 pointer-events-none" />
        
        <div className={`relative z-10 overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.01] w-full
          ${isShort ? "max-w-120" : "w-full"}`}
        >
          <StudioPlayer videoUrl={work.url} />
        </div>

        {/* HUD Decoration */}
        <div className={`absolute hidden xl:block z-20 
          ${isShort ? "-left-16 bottom-24" : "-right-8 -bottom-8"}`}
        >
          <div className="bg-black/90 backdrop-blur-xl border border-zinc-800 p-5 rounded-2xl flex items-center gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all group-hover:border-[#afff00]/40">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Encoding_Status</span>
              <span className="text-[11px] font-black text-[#afff00] italic uppercase">
                {isShort ? "Vertical_Render_Active" : "H.264_Master_Certified"}
              </span>
            </div>
            <div className="w-2.5 h-2.5 bg-[#afff00] rounded-full animate-pulse shadow-[0_0_15px_#afff00]" />
          </div>
        </div>
      </div>
    </div>
  );
})}
        </section>

        {/* CTA SECTION */}

        <section className="max-w-7xl mx-auto mt-30 text-center space-y-10">
          <div className="h-px w-full bg-linear-to-r from-transparent via-[#afff00]/50 to-transparent mb-20" />
          <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            Ready to <span className="text-[#afff00]">distort</span> reality?
          </h3>
          <Button3D primary>
            <Link href="contact" className=" px-10 py-5">
              Start_Project
            </Link>
          </Button3D>
        </section>
      </main>

      <Footer />
      {/* GLOBAL SCANLINE */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-50" />
    </div>
  );
}
