import {
  getAllServiceSlugs,
  getServiceBySlug,
} from "@/app/api/services/action";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";

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
  const rawService = await getServiceBySlug(slug);

  if (!rawService) return { title: "Service Not Found" };

  // Ensure status is "draft" | "published" | null
  const service: Service = {
    ...rawService,
    status:
      rawService.status === "draft" || rawService.status === "published"
        ? rawService.status
        : null,
  };

  const title = service.title;
  const description = service.description?.map((b) => b.text).join(" ") || "";
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/services/${slug}`;
  const images = service.images ?? [];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Your Portal",
      images: images.map((img) => ({ url: img.url, alt: img.alt || title })),
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
    },
  };
}

export async function generateStaticParams() {
  const allSlugs: string[] = await getAllServiceSlugs();

  if (!allSlugs || !Array.isArray(allSlugs)) return [];

  return allSlugs.map((slug) => ({
    slug: slug,
  }));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const rawService = await getServiceBySlug(slug);

  if (!rawService) return notFound();

  const service: Service = {
    ...rawService,
    status:
      rawService.status === "draft" || rawService.status === "published"
        ? rawService.status
        : null,
  };

  if (!service || service.status === "draft") return notFound();

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-5xl font-black mb-16 text-slate-900 tracking-tight text-center">
        {service.title}
      </h1>

      <div className="space-y-24">
        {service.content?.map((contentBlock, i) => {
          const sub = service.subtitle?.[i];
          const desc = service.description?.[i];
          const img = service.images?.[i];

          return (
            <section key={i} className="group">
              {/* 1. Podnaslov */}
              {sub?.text && (
                <h2
                  className={`text-3xl font-extrabold mb-4 ${sub.highlight ? "text-blue-600" : "text-slate-800"}`}
                >
                  {sub.text}
                </h2>
              )}

              {/* 2. Opis */}
              {desc?.text && (
                <p
                  className={`text-xl mb-8 text-slate-500 leading-relaxed ${desc.highlight ? "font-bold text-slate-900" : ""}`}
                >
                  {desc.text}
                </p>
              )}

              {/* 3. Slika sekcije */}
              {img?.url && (
                <div className="relative aspect-video mb-8 overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src={img.url}
                    alt={img.alt || service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 896px"
                  />
                </div>
              )}

              {/* 4. Glavni Sadržaj */}
              <div
                className={`text-slate-700 text-lg leading-loose p-1 ${contentBlock.highlight ? "bg-blue-50/50 p-6 rounded-2xl border border-blue-100" : ""}`}
              >
                {contentBlock.text}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
