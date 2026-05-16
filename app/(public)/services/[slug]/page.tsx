import {
  getAllServiceSlugs,
  getServiceBySlug,
} from "@/app/api/services/action";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import AmbientBackground from '@/components/public/AmbientBackground';
import { Terminal, Activity, ArrowRight } from "lucide-react";
import Button3D from "@/components/ui/Button3D";
import Link from "next/link";

interface ContentBlock {
  text: string;
  highlight?: boolean;
}

interface ServiceImage {
  url: string;
  alt?: string;
}

interface Service {
  id: string | number;
  title: string;
  subtitle: ContentBlock[] | null;
  description: ContentBlock[] | null;
  content: ContentBlock[] | null;
  slug: string;
  images: ServiceImage[] | null;
  status: "draft" | "published" | null;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return { title: "Service Not Found" };

  const title = `${service.title} | Luka Jokić`;
  const description = service.description?.[0]?.text || "Premium Video Crafting Service";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: service.images?.[0] ? [{ url: service.images[0].url }] : [],
    },
  };
}

export async function generateStaticParams() {
  const allSlugs: string[] = await getAllServiceSlugs();
  if (!allSlugs || !Array.isArray(allSlugs)) return [];
  return allSlugs.map((slug) => ({ slug }));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const rawService = await getServiceBySlug(slug);

  if (!rawService || rawService.status === "draft") return notFound();

  const service = rawService as unknown as Service;

  return (
    <div className="relative min-h-screen grain-overlay bg-black text-white selection:bg-[#afff00] selection:text-black">
      <AmbientBackground />
      
      <div className="relative z-10">
        <Header />
        
        <main className="pt-32 pb-24 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* --- HERO SECTION ZA USLUGU --- */}
            <header className="mb-20 lg:mb-32">
              <div className="flex items-center gap-4 mb-6 animate-reveal opacity-0">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#afff00]/20 bg-[#afff00]/5">
                  <Terminal size={12} className="text-[#afff00]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#afff00]">
                    Service_Deployment // {service.slug}
                  </span>
                </div>
              </div>

              <h1 className="text-[12vw] lg:text-9xl font-black leading-[0.85] tracking-tighter uppercase italic mb-8 animate-reveal opacity-0">
                {service.title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-linear-to-r from-[#afff00] to-[#7acc00]" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <div className="flex flex-col gap-3 w-full lg:w-[40%] animate-reveal opacity-0 delay-2">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-[#afff00] animate-pulse" />
                  <span className="text-[10px] font-black uppercase italic tracking-widest text-zinc-500">
                    Loading Module Content
                  </span>
                </div>
                <div className="w-full h-px bg-zinc-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#afff00]/40 animate-fill-bar" />
                </div>
              </div>
            </header>

            {/* --- DYNAMIC CONTENT BLOCKS --- */}
            <div className="space-y-32 lg:space-y-48">
              {service.content?.map((block, i) => {
                const sub = service.subtitle?.[i];
                const desc = service.description?.[i];
                const img = service.images?.[i];

                return (
                  <section key={i} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center group">
                    
                    {/* Tekstualni deo */}
                    <div className={`lg:col-span-6 ${i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                      {sub?.text && (
                        <h2 className="text-3xl lg:text-5xl font-black uppercase italic mb-6 tracking-tighter transition-colors group-hover:text-[#afff00]">
                          {sub.text}
                        </h2>
                      )}
                      
                      {desc?.text && (
                        <p className="text-zinc-400 text-lg lg:text-xl leading-relaxed mb-8 font-medium">
                          {desc.text}
                        </p>
                      )}

                      <div className={`p-6 rounded-2xl border transition-all duration-500 ${
                        block.highlight 
                        ? 'bg-[#afff00]/5 border-[#afff00]/30 text-white shadow-[0_0_30px_rgba(175,255,0,0.05)]' 
                        : 'bg-zinc-900/30 border-zinc-800 text-zinc-400 group-hover:border-zinc-700'
                      }`}>
                        <p className="text-base leading-loose italic">
                          {block.text}
                        </p>
                      </div>
                    </div>

                    {/* Image deo */}
                    <div className={`lg:col-span-6 ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      {img?.url && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-950 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] group-hover:border-[#afff00]/20">
                          <Image
                            src={img.url}
                            alt={img.alt || service.title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                            sizes="(max-width: 1024px) 100vw, 700px"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* --- CALL TO ACTION --- */}
            <footer className="mt-40 text-center border-t border-zinc-900 pt-20">
              <h3 className="text-4xl font-black uppercase italic mb-10 tracking-tighter">
                Ready to distort <span className="text-[#afff00]">reality?</span>
              </h3>
              <div className="flex justify-center gap-6">
                <Link href="/contact">
                  <Button3D primary className="px-12 py-5 flex items-center gap-3 group">
                    Start Project
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Button3D>
                </Link>
              </div>
            </footer>

          </div>
        </main>

        <Footer />
      </div>

      {/* GLOBAL SCANLINE */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] z-100 opacity-20" />
    </div>
  );
}