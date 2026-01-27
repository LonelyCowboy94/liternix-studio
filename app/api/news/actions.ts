import { db } from "@/db";
import { news } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type NewsInput = {
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content: string;
  featured?: boolean;
  author?: string | null;
  image_url?: string | null;
  slug?: string;
  status?: string;
  publishedAt?: Date | null;
  metaTitle?: string;
  metaDescription?: string;
};

// CREATE
export async function createNews(data: NewsInput) { 
  const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, "-");
  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;

  if (data.featured && data.status === "published") {
    await db.update(news).set({ featured: false}).where(eq(news.featured, true));
  }

  const newEntry = await db.insert(news).values({
    title: data.title,
    subtitle: data.subtitle || null,
    excerpt: data.excerpt || null,
    content: data.content,
    author: data.author || null,
    featured: data.featured === true,
    image_url: data.image_url || null,
    slug,
    status: data.status || "draft",
    publishedAt: publishedAt, 
    metaTitle: data.metaTitle || data.title,
    metaDescription: data.metaDescription || data.excerpt || data.title,
  }).returning();
  
  return newEntry;
}

// UPDATE
export async function updateNews(id: string, data: NewsInput) {
  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
  
if (data.featured && data.status === "published") {
    await db.update(news).set({ featured: false}).where(eq(news.featured, true));
  }

  const updated = await db.update(news)
    .set({
      title: data.title,
      subtitle: data.subtitle,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      featured: data.featured === true,
      image_url: data.image_url,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
      status: data.status,
      publishedAt: publishedAt,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt || data.title,
    })
    .where(eq(news.id, id))
    .returning();
  return updated;
}

// DELETE
export async function deleteNews(id: string) {
  try {
    // 1. Pronađi vest pre brisanja da bi uzeo image_url
    const entry = await db.select().from(news).where(eq(news.id, id));
    const newsItem = entry[0];

    // 2. Ako vest postoji i ima sliku, obriši je sa Cloudinary-ja
    if (newsItem?.image_url) {
      // Izvlačimo public_id iz URL-a (npr. iz ".../v123/ipl4v4ly.jpg" uzimamo "ipl4v4ly")
      const publicId = newsItem.image_url.split("/").pop()?.split(".")[0];
      
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from Cloudinary:", publicId);
      }
    }

    // 3. Obriši vest iz baze podataka
    await db.delete(news).where(eq(news.id, id));

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Failed to delete news and image");
  }
}

// FETCH SINGLE
export async function getNews(id: string) {
  const entry = await db.select().from(news).where(eq(news.id, id));
  return entry[0] || null;
}

// FETCH LIST
export async function getAllNews() {
  return db.select().from(news).orderBy(desc(news.publishedAt));
}

// FETCH ALL SLUGS
export async function getAllNewsSlugs(): Promise<{ slug: string }[]> {
  const allNews = await db
    .select({ slug: news.slug })
    .from(news)
    .orderBy(desc(news.publishedAt));
  return allNews;
}

export async function getNewsBySlug(slug: string) {
  const entry = await db
    .select()
    .from(news)
    .where(eq(news.slug, slug)); 
  
  return entry[0] || null;
}
