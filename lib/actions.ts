"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

type UpdateUserData = {
  name?: string;
  email?: string;
  role?: "USER" | "ADMIN";
  password?: string;
};

export async function getAllUsers() {
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as "USER" | "ADMIN";

  if (password !== confirmPassword) return { error: "Passwords do not match!" };
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({ name, email, password: hashedPassword, role });
    revalidatePath("/admin/users");
    return { success: "User created!" };
  } catch {
    return { error: "Email already in use!" };
  }
}

export async function updateUser(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "USER" | "ADMIN";
  const newPassword = formData.get("password") as string;

  try {
    const updateData: UpdateUserData = { name, email, role };
    if (newPassword && newPassword.length >= 6) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }
    await db.update(users).set(updateData).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: "Updated!" };
  } catch {
    return { error: "Failed to update!" };
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
    return { success: "Deleted!" };
  } catch {
    return { error: "Failed to delete!" };
  }
}