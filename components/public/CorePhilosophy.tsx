import { Video, Scissors, Zap } from 'lucide-react';

export default function CorePhilosophy() {
  const cards = [
    { title: "Neuro-Grading", icon: <Video />, text: "Color correction that triggers emotional response." },
    { title: "Sonic Cut", icon: <Scissors />, text: "Audio-driven montage. Every beat is a visual hit." },
    { title: "2027 Motion", icon: <Zap />, text: "Visual effects that shouldn't exist yet." }
  ];

  return (
    <>
    <hr className="h-px w-full border-0 bg-linear-to-r from-transparent via-[#afff00]/50 to-transparent mt-6" />
    <section className="py-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div key={i} className="group p-10 bg-zinc-900/30 border border-zinc-800 rounded-2xl hover:border-[#afff00]/50 transition-all duration-500">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-[#afff00] mb-8 border border-zinc-800 shadow-inner group-hover:bg-[#afff00] group-hover:text-black transition-all">
              {card.icon}
            </div>
            <h3 className="text-3xl font-black uppercase italic mb-4">{card.title}</h3>
            <p className="text-zinc-500 leading-snug uppercase text-xs font-bold tracking-wider">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </section>
    <hr className="h-px w-full border-0 bg-linear-to-r from-transparent via-[#afff00]/50 to-transparent mb-3" />
    </>
  );
}