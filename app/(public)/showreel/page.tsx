import { getWorksAction } from "@/actions/work";
import StudioPlayer from "@/components/public/StudioPlayer";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Film, Monitor, Hash, ArrowDown, Activity } from "lucide-react";
import Link from "next/link";
import AmbientBackground from "@/components/public/AmbientBackground";
import Button3D from "@/components/ui/Button3D";

export default async function WorkPage() {
  const works = await getWorksAction();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#afff00] selection:text-black">
      <AmbientBackground />
      <Header />

      <main className="relative z-10 pt-20 pb-40 px-6 md:px-12">
        {/* PAGE INTRO */}
        <section className="max-w-7xl mx-auto mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Portfolio_v2.0</span>
              </div>
              
              <h1 className="text-7xl md:text-[9rem] font-black uppercase italic leading-[0.8] tracking-tighter">
                Selected <br /> <span className="text-[#afff00]">Works</span>
              </h1>
              {/* Integrity Bar restored with CSS animation */}
              <div className="flex flex-col gap-3 my-8">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#afff00] animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Verify Integrity</span>
                </div>
                <div className="w-full h-0.75 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#afff00]/60 animate-fill-bar delay-3" />
                </div>
              </div>
            </div>
            
            <div className="max-w-xs space-y-4">
              <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-widest leading-relaxed">
                A curated selection of high-impact visual stories, technical edits, and reality-distorting motion.
              </p>
              <div className="flex items-center gap-4 text-[#afff00] font-black italic text-sm animate-bounce">
                <ArrowDown size={20} /> Scroll_To_Explore
              </div>
            </div>
          </div>
          
        </section>

        {/* WORKS FEED */}
        <section className="max-w-7xl mx-auto -mt-15 md:mt-0">
          {works.map((work, index) => (
            <div key={work.id} className="group mb-10 md:mb-35 relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* LEFT SIDE: Project Info */}
              <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-zinc-800 italic">
                    0{index + 1}
                  </span>
                  <div className="h-px flex-1 bg-zinc-800 group-hover:bg-[#afff00]/30 transition-colors" />
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black uppercase italic leading-none tracking-tighter group-hover:text-[#afff00] transition-colors duration-500">
                    {work.title}
                  </h2>
                  
                  {work.description && (
                    <p className="text-lg text-zinc-400 font-medium leading-tight max-w-sm">
                      {work.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Film size={12} className="text-[#afff00]" /> 4K_Render
                  </div>
                  <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Monitor size={12} className="text-[#afff00]" /> 24_FPS
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Video Player */}
              <div className="lg:col-span-8 relative">
                <div className="absolute -inset-4 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
                   <StudioPlayer videoUrl={work.url} />
                </div>
                
                {/* Visual HUD Decoration */}
                <div className="absolute -right-6 -bottom-10 hidden md:block">
                  <div className="bg-black border border-zinc-800 p-4 rounded-2xl flex items-center gap-4 shadow-2xl transition-all group-hover:border-[#afff00]/40">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-zinc-600 uppercase">Encoding</span>
                       <span className="text-[10px] font-black text-[#afff00] italic uppercase">H.264_MASTER</span>
                    </div>
                    <Hash size={16} className="text-zinc-800" />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </section>
        

        {/* CTA SECTION */}
        
        <section className="max-w-7xl mx-auto mt-30 text-center space-y-10">
           <div className="h-px w-full bg-linear-to-r from-transparent via-[#afff00]/50 to-transparent mb-20" />
           <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
             Ready to <span className="text-[#afff00]">distort</span> reality?
           </h3>
           <Button3D primary>
           <Link 
            href="contact" 
            className=" px-10 py-5"
           >
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