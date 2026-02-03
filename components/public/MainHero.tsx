import { Play, ArrowRight } from 'lucide-react';
import Button3D from '../ui/Button3D';
import StudioPlayer from './StudioPlayer';
import Link from 'next/link';

export default function MainHero() {
  return (
    <main className="relative z-10 px-8 pt-20 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          

          {/* BRUTALNI TEKST - OVDE JE ANIMACIJA */}
          <h1 className="text-[12vw] md:text-[11rem] font-black leading-[0.8] tracking-[calc(-0.06em)] uppercase italic">
            Visual <br />
            <span className="animate-video-text">Alchemist</span>
          </h1>

          <div className="grid md:grid-cols-12 gap-16 mt-10 items-end">
            <div className="md:col-span-5">
              <p className="text-xl md:text-2xl text-zinc-400 leading-tight font-medium mb-10 tracking-tight">
                &ldquo;Raw clips, polished visuals, and stories that hit hard. I craft every frame to grab eyes and hold attention. Video editing that&apos;s fast, sharp, and unforgettable.
                 <span className="text-[#afff00] font-trade italic tracking-wider mt-4 block shadow-[#afff00]/20 drop-shadow-lg"> 
    I don&apos;t just edit —&gt; I distort reality.&rdquo;
  </span>
              </p>
              <div className="flex flex-wrap gap-6">
                <Link href="/contact"><Button3D primary className='px-10 py-5'>Get In Touch <ArrowRight size={20} /></Button3D></Link>
                <Link href="/showreel"><Button3D className='px-10 py-5'><Play size={18} fill="currentColor" /> Showreel</Button3D></Link>
              </div>
            </div>

            <div className="md:col-span-7">
  {/* VIDEO CONTAINER */}
 <div className="md:col-span-7">
  <StudioPlayer videoUrl="https://www.youtube.com/watch?v=YWX8183GLmI" /> 
</div>
</div>
          </div>
        </div>
      </div>
    </main>
  );
}