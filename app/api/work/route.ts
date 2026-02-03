import { db } from "@/db";
import { portfolioWork } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; 
export const revalidate = 0;

export async function GET() {
  try {
    const data = await db
      .select()
      .from(portfolioWork)
      .orderBy(asc(portfolioWork.sortOrder));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}