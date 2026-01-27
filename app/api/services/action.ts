"use server";

import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, desc, not } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface JsonTextBlock {
  text: string;
  highlight?: boolean;
}

interface ServiceImage {
  url: string;
  alt?: string;
}

interface NewService {
  title: string;
  subtitle: JsonTextBlock[] | null;
  description: JsonTextBlock[] | null;
  content: JsonTextBlock[] | null;
  slug?: string;
  images: ServiceImage[] | null;
  status: "draft" | "published";
}

interface UpdateService extends NewService {
  id: string;
}

const getPublicId = (url: string): string | null => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const publicIdWithExtension = parts.slice(uploadIndex + 2).join("/");
    return publicIdWithExtension.split(".")[0];
  } catch {
    return null;
  }
};

const handlePublishedStatus = async (status: string, id?: string) => {
  if (status === "published") {
    if (id) {
      await db.update(services).set({ status: "draft" }).where(not(eq(services.id, id)));
    } else {
      await db.update(services).set({ status: "draft" }).where(eq(services.status, "published"));
    }
  }
};

export async function createService(data: NewService) {
  await handlePublishedStatus(data.status);

  const newEntry = await db.insert(services).values({
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    content: data.content,
    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
    status: data.status,
    images: data.images,
  }).returning();

  return newEntry;
}

export async function updateService(data: UpdateService) {
  await handlePublishedStatus(data.status, data.id);

  const updated = await db
    .update(services)
    .set({
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      content: data.content,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
      status: data.status,
      images: data.images,
    })
    .where(eq(services.id, data.id))
    .returning();

  return updated;
}

export async function deleteService(id: string) {
  try {
    const entry = await db.select().from(services).where(eq(services.id, id));
    const serviceItem = entry[0];

    if (serviceItem?.images && Array.isArray(serviceItem.images)) {
      const publicIds = serviceItem.images
        .map((img) => getPublicId(img.url))
        .filter((pid): pid is string => pid !== null);

      if (publicIds.length > 0) {
        await Promise.all(publicIds.map((pid) => cloudinary.uploader.destroy(pid)));
      }
    }

    await db.delete(services).where(eq(services.id, id));
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete service");
  }
}

export async function getServiceBySlug(slug: string) {
  const result = await db.select().from(services).where(eq(services.slug, slug));
  return result[0] || null;
}

export async function getServiceList() {
  const result = await db.select().from(services).orderBy(desc(services.createdAt));
  return result;
}

export async function getAllServiceSlugs() {
  const result = await db.select({ slug: services.slug }).from(services);
  return result.map((item) => item.slug);
}

export async function deleteCloudinaryImagesAction(publicIds: string[]) {
  try {
    const deletePromises = publicIds.map((id) => cloudinary.uploader.destroy(id));
    await Promise.all(deletePromises);
    return { success: true };
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return { success: false, error: "Cloudinary error" };
  }
}