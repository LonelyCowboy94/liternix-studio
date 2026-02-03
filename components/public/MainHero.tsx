import { Play, ArrowRight, Terminal, Activity } from "lucide-react";
import Button3D from "../ui/Button3D";
import StudioPlayer from "./StudioPlayer";
import { getWorksAction } from "@/actions/work";
import Link from "next/link";

export default async function MainHero() {
  const works = await getWorksAction();
  return (
    <section
      className="relative flex flex-col min-h-screen pt-24 pb-12 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-8 lg:gap-12">
          {/* Main Title Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-3 animate-reveal opacity-0">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#afff00]/20 bg-[#afff00]/5">
                <Terminal size={12} className="text-[#afff00]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#afff00]">
                  Protocol_v1.0 // Philosophy
                </span>
              </div>
            </div>

            <div className="relative">
              <h1
                id="hero-heading"
                className="text-[14vw] lg:text-[clamp(5rem,10vw,11rem)] font-black leading-[0.85] tracking-tighter uppercase italic select-none"
              >
                Visual <br />
                <span className="animate-video-text text-transparent -ml-4 bg-clip-text bg-linear-to-r from-[#afff00] to-[#7acc00]">
                  &nbsp;Alchemist&nbsp;
                </span>
              </h1>
            </div>

            {/* Integrity Bar - Skaliran za mobilne */}
            <div className="flex flex-col gap-3 my-6 lg:my-8 w-full lg:w-[70%]">
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

         <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-20 items-start">
  {/* Description and Actions */}
  <div className="md:col-span-5 order-2 md:order-1">
    <p className="text-base lg:text-xl text-zinc-400 leading-tight font-medium mb-8 lg:mb-10 max-w-lg">
      &ldquo;Raw clips, polished visuals, and stories that hit hard. I craft
      every frame to grab eyes and hold attention. Video editing that&apos;s
      <span className="text-zinc-100 italic">
        {" "}
        fast, sharp, and unforgettable.
      </span>
      &rdquo;
      <span className="text-[#afff00] font-bold italic tracking-wider mt-4 block drop-shadow-[0_0_10px_rgba(175,255,0,0.3)]">
        I don&apos;t just edit —&gt; I distort reality.
      </span>
    </p>

    <div className="flex flex-wrap gap-4">
      <Link href="/contact" aria-label="Get in touch with me">
        <Button3D
          primary
          className="px-6 py-4 lg:px-10 lg:py-5 flex items-center gap-2 group text-sm lg:text-base"
        >
          Get In Touch
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Button3D>
      </Link>

      <Link href="/showreel" aria-label="Watch my showreel">
        <Button3D className="px-6 py-4 lg:px-10 lg:py-5 flex items-center gap-2 group text-sm lg:text-base">
          <Play
            size={18}
            fill="currentColor"
            className="group-hover:scale-110 transition-transform"
          />
          Showreel
        </Button3D>
      </Link>
    </div>
  </div>

  {/* Video Player Section */}
  <div className="md:col-span-7 order-1 md:order-2">
    <div className="relative group transition-transform duration-500 hover:scale-[1.02] w-full lg:max-w-2xl lg:ml-auto">
      <div className="w-full">
        {works.map(
          (work, index) =>
            work.type === 1 && (
              <div
                key={work.id}
                className="relative animate-reveal opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#afff00]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 aspect-video w-full overflow-hidden border border-zinc-900 rounded-2xl bg-zinc-950 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01] group-hover:border-[#afff00]/30">
                    <StudioPlayer videoUrl={work.url} />
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
}
