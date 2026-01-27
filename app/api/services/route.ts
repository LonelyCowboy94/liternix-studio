import { NextResponse } from "next/server";
import { createService, updateService, deleteService, getServiceList, getServiceBySlug } from "./action";

// GET -> fetch list || single service
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
    if (id) {
    const entry = await getServiceBySlug(id);
    return NextResponse.json(entry);
  }

const allServices = await getServiceList();
  return NextResponse.json(allServices);
}

// POST -> create service
export async function POST(req: Request) {
  const body = await req.json();
    if (!body.title || !body.content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const newEntry = await createService(body);
  return NextResponse.json(newEntry);
}

// PUT -> update service
export async function PUT(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const updatedEntry = await updateService(body);
  return NextResponse.json(updatedEntry);
}

// DELETE -> delete service
export async function DELETE(req: Request) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const deletedEntry = await deleteService(body.id);
  return NextResponse.json(deletedEntry);
}