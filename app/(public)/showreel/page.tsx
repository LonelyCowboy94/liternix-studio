import { getWorksAction } from "@/actions/work";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import AmbientBackground from "@/components/public/AmbientBackground";
import { Metadata } from "next";
import ShowreelGrid from "@/components/public/ShowreelGrid";
import { Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Showreel & Selected Works | High-Impact Visual Content",
  description: "Take a look behind the lens of professional video crafting.",
  // ... tvoji ostali metadata tagovi
};

export default async function WorkPage() {
  const works = await getWorksAction();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#afff00] selection:text-black overflow-x-hidden">
      <AmbientBackground />
      <Header />

      <main className="relative z-10 pt-20 pb-40 px-6 md:px-12">
        {/* PAGE INTRO */}
        <section className="max-w-7xl mx-auto mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-6 w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#afff00] rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
                  Portfolio_v2.0 // Archive
                </span>
              </div>
              <h1 className="text-6xl sm:text-7xl md:text-[8rem] font-black uppercase italic leading-[0.8] tracking-tighter">
                PROJECT <br /> <span className="animate-video-text text-[#afff00]">ROOM&nbsp;</span>
              </h1>
              <div className="flex flex-col gap-3 my-6 lg:my-8 w-full lg:w-[90%]">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-[#afff00] animate-pulse" />
                          <span className="text-[10px] font-black text-white uppercase italic tracking-widest">
                            Verify Integrity
                          </span>
                        </div>
                        <div className="w-full h-0.75 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#afff00]/60 animate-fill-bar delay-3" />
                        </div>
                      </div>
            </div>
            <div className="max-w-xs space-y-4">
              <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-widest leading-relaxed">
                Accessing the visual archive. A sequential stream of high-impact stories and technical mastery.
              </p>
            </div>
          </div>
        </section>

        {/* GLAVNI GRID SA PRETRAGOM */}
        <ShowreelGrid initialWorks={works || []} />

      </main>

      <Footer />
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-50 opacity-10" />
    </div>
  );
}