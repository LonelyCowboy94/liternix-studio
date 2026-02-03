"use server";

import { db } from "@/db";
import { portfolioWork } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { asc, eq, and, ne } from "drizzle-orm";

export async function getWorksAction() {
  // Sort by the persistent sortOrder column
  return await db.select().from(portfolioWork).orderBy(asc(portfolioWork.sortOrder));
}

export async function addWorkAction(formData: {
  url: string;
  title: string;
  description?: string;
  type?: number;
}) {
  try {
    const isFeatured = formData.type === 1;
    if (isFeatured) {
      await db.update(portfolioWork).set({ type: 0 }).where(eq(portfolioWork.type, 1));
    }
    const all = await db.select().from(portfolioWork);
    await db.insert(portfolioWork).values({
      url: formData.url,
      title: formData.title,
      description: formData.description,
      type: formData.type || 0,
      sortOrder: all.length
    });
    revalidatePath("/work");
    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function editWorkAction(id: number, formData: {
  url: string;
  title: string;
  description?: string;
  type?: number;
}) {
  try {
    if (formData.type === 1) {
      await db.update(portfolioWork).set({ type: 0 })
        .where(and(eq(portfolioWork.type, 1), ne(portfolioWork.id, id)));
    }
    await db.update(portfolioWork).set({
      url: formData.url,
      title: formData.title,
      description: formData.description,
      type: formData.type ?? 0,
    }).where(eq(portfolioWork.id, id));

    revalidatePath("/work");
    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function deleteWorkAction(id: number) {
  try {
    await db.delete(portfolioWork).where(eq(portfolioWork.id, id));
    revalidatePath("/work");
    revalidatePath("/");
    revalidatePath("/admin/portfolio");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

// Fixed: Only updates sortOrder, does NOT touch types
export async function updateOrderAction(orderedIds: number[]) {
  try {
    const updates = orderedIds.map((id, index) => 
      db.update(portfolioWork)
        .set({ sortOrder: index }) 
        .where(eq(portfolioWork.id, id))
    );
    await Promise.all(updates);
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/admin/portfolio");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}