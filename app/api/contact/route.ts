import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages, messageItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, message } = body;

    // 1. Provera da li već postoji konverzacija sa ovim emailom
    const existingConversation = await db.select()
      .from(messages)
      .where(eq(messages.email, email))
      .limit(1);

    let conversationId: string;

    if (existingConversation.length > 0) {
      // Postoji klijent, koristimo isti ID i vraćamo status na 'unread'
      conversationId = existingConversation[0].id;
      await db.update(messages)
        .set({ 
          status: "unread",
          // Možemo opciono ažurirati ime ako se promenilo
          firstName: firstName,
          lastName: lastName 
        })
        .where(eq(messages.id, conversationId));
    } else {
      // Novi klijent, pravimo novi thread
      const [newConv] = await db.insert(messages).values({
        firstName,
        lastName,
        email,
        status: "unread",
      }).returning();
      conversationId = newConv.id;
    }

    // 2. Ubacujemo samu poruku u message_items (povezano sa conversationId)
    await db.insert(messageItems).values({
      messageId: conversationId,
      sender: "user",
      content: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inbound Message Error:", error);
    return NextResponse.json({ error: "Transmission failed" }, { status: 500 });
  }
}