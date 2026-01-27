import { getAllNewsSlugs, getNewsBySlug } from "@/app/api/news/actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. SEO & METADATA OPTIMIZATION
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) return { title: "News Not Found" };

  const title = (news.metaTitle || news.title) ?? undefined;
  const description = (news.metaDescription || news.excerpt) ?? undefined;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/news/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // Adding author to technical metadata
    authors: news.author ? [{ name: news.author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: "Your Portal",
      images: news.image_url ? [{ url: news.image_url, width: 1200, height: 630, alt: title }] : [],
      locale: "en_US",
      type: "article",
      publishedTime: news.publishedAt ? new Date(news.publishedAt).toISOString() : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: news.image_url ? [news.image_url] : [],
    },
  };
}

// 2. SSG (Static Site Generation)
export async function generateStaticParams() {
  const allNews = await getAllNewsSlugs();
  if (!allNews) return [];
  return allNews.map((n) => ({ slug: n.slug }));
}

// 3. PAGE COMPONENT
export default async function SingleNews({ params }: Props) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) return notFound();

  // Structured data for Google (JSON-LD) - Updated to include Dynamic Author
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "image": [news.image_url],
    "datePublished": news.publishedAt ? new Date(news.publishedAt).toISOString() : new Date().toISOString(),
    "description": news.excerpt || news.title,
    "author": [{ 
        "@type": news.author ? "Person" : "Organization", 
        "name": news.author || "Your Portal", 
        "url": process.env.NEXT_PUBLIC_SITE_URL 
    }]
  };

  return (
    <main className="min-h-screen bg-white">
      {/* JSON-LD for SEO 100% */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-20 lg:py-24">
        {/* HEADER SECTION */}
        <header className="space-y-6 mb-10 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium">
            {news.featured && (
              <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full tracking-tight">
                Featured
              </span>
            )}
            
            <div className="flex items-center text-slate-500">
              <time 
                dateTime={news.publishedAt ? new Date(news.publishedAt).toISOString() : ""}
                className={news.featured ? "border-l border-slate-300 pl-3" : ""}
              >
                {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }) : ""}
              </time>

              {/* Author display next to date */}
              {news.author && (
                <span className="flex items-center before:content-['•'] before:mx-3 before:text-slate-300">
                  By <span className="ml-1 text-slate-900 font-semibold">{news.author}</span>
                </span>
              )}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            {news.title}
          </h1>

          {news.subtitle && (
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
              {news.subtitle}
            </p>
          )}
        </header>

        {/* MAIN IMAGE */}
        {news.image_url && (
          <figure className="relative mb-12 overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-200">
            <div className="aspect-video relative">
              <Image
                src={news.image_url}
                alt={news.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover"
              />
            </div>
          </figure>
        )}

        {/* CONTENT */}
        <section className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight 
          prose-a:text-blue-600 hover:prose-a:text-blue-500 
          prose-img:rounded-xl prose-slate:text-slate-800
          selection:bg-blue-100 selection:text-blue-900">
          <div dangerouslySetInnerHTML={{ __html: news.content }} />
        </section>

        {/* ARTICLE FOOTER */}
        <footer className="mt-16 pt-8 border-t border-slate-100">
          <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Published by</p>
               <p className="text-slate-900 font-bold">{news.author || "Your Portal Editorial"}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed md:max-w-62.5 md:text-right">
              Source: Your Portal. Copying content without editorial permission is prohibited.
            </p>
          </div>
        </footer>
      </article>
    </main>
  );
}