import { db } from "@/db";
import { portfolioWork } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(portfolioWork).orderBy(asc(portfolioWork.type));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching works:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}