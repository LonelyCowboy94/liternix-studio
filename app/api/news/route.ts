import { NextResponse } from "next/server";
import { createNews, updateNews, deleteNews, getAllNews, getNews } from "./actions";

// GET -> fetch list || single news
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (id) {
    const entry = await getNews(id);
    return NextResponse.json(entry);
  }

  const allNews = await getAllNews();
  return NextResponse.json(allNews);
}

// POST -> create news
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.title || !body.content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const newEntry = await createNews(body);
  return NextResponse.json(newEntry);
}

// PUT -> update news
export async function PUT(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const updated = await updateNews(body.id, body);
  return NextResponse.json(updated);
}

// DELETE -> delete news
export async function DELETE(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const result = await deleteNews(body.id);
  return NextResponse.json(result);
}