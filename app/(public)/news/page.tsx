import Image from "next/image";
import Link from "next/link";
import { getAllNews } from "@/app/api/news/actions";

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  image_url?: string;
  author?: string;
  featured: boolean;
  publishedAt?: string | Date;
  slug: string;
  status: string;
};

export const revalidate = 60;

export default async function NewsPage() {
  const allNews = await getAllNews();

  const publishedNews = allNews.filter((n) => n.status === "published");
  const featuredNews = publishedNews.find((n) => n.featured);
  const otherNews = publishedNews.filter((n) => !n.featured);

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 border-b border-slate-200 pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            News & Updates
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Follow the latest events and stories from our community.
          </p>
        </header>

        {/* HERO SECTION */}
        {featuredNews && (
          <section aria-label="Featured News" className="mb-20">
            <Link
              href={`/news/${featuredNews.slug}`}
              className="group block relative overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200 transition-all hover:shadow-xl"
            >
              <div className="grid lg:grid-cols-2 items-center">
                <div className="relative aspect-16/10 lg:aspect-square w-full overflow-hidden">
                  {featuredNews.image_url ? (
                    <Image
                      src={featuredNews.image_url}
                      alt={featuredNews.title}
                      width={1200}
                      height={630}
                      priority
                      className="object-cover transition duration-500 h-full w-full group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center" />
                  )}
                </div>

                <div className="p-8 md:p-12 lg:p-16">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                      New & Featured
                    </span>
                    {/* Featured Author Display */}
                    {featuredNews.author && (
                      <span className="text-sm font-medium text-slate-400">
                        By <span className="text-slate-900 font-semibold">{featuredNews.author}</span>
                      </span>
                    )}
                  </div>
                  
                  <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    {featuredNews.title}
                  </h2>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600 line-clamp-3">
                    {featuredNews.excerpt}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                    Read more <span aria-hidden="true">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* GRID SECTION */}
        <section aria-label="Other News">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Latest Posts</h2>
          </div>

          {otherNews.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {otherNews.map((item) => (
                <article key={item.id} className="flex">
                  <Link
                    href={`/news/${item.slug}`}
                    className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-110"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {item.excerpt}
                      </p>
                      
                      {/* Meta Footer with Author on the Right */}
                      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                        
                        {item.author && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            {item.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
              <p className="text-lg text-slate-500">No news available at the moment.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}