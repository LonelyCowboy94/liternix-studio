"use server";

import { db } from "@/db"; 
import { portfolioWork } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";

export async function getWorksAction() {
  return await db.select().from(portfolioWork).orderBy(asc(portfolioWork.type));
}

export async function addWorkAction(formData: {
  url: string;
  title: string;
  description?: string;
  type?: number;
}) {
  try {
    await db.insert(portfolioWork).values({
      url: formData.url,
      title: formData.title,
      description: formData.description,
      type: formData.type || 0,
    });
    
    revalidatePath("/work");
    return { success: true };
  } catch (error) {
    console.error("Failed to add work:", error);
    return { success: false };
  }
}

export async function deleteWorkAction(id: number) {
  try {
    await db.delete(portfolioWork).where(eq(portfolioWork.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete work:", error);
    return { success: false };
  }
}

export async function updateOrderAction(orderedIds: number[]) {
  try {
    const updates = orderedIds.map((id, index) => 
      db.update(portfolioWork)
        .set({ type: index })
        .where(eq(portfolioWork.id, id))
    );
    
    await Promise.all(updates);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order:", error);
    return { success: false };
  }
}