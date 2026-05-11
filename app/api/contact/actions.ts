"use server";

import { db } from "@/db";
import { messages, messageItems } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateEmailHtml = (subject: string, content: string, replyLink: string) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      body { margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, sans-serif; color: #1a1a1a; }
      .wrapper { width: 100%; padding: 60px 20px; background-color: #ffffff; }
      .container { max-width: 560px; margin: 0 auto; }
      .logo { font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 50px; color: #000000; border-left: 3px solid #afff00; padding-left: 15px; }
      .content-area { font-size: 16px; line-height: 1.7; color: #1a1a1a; margin-bottom: 40px; white-space: pre-wrap; }
      .reply-box { background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 12px; padding: 32px; text-align: center; }
      .reply-label { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #999999; margin-bottom: 16px; }
      .reply-button { 
        display: inline-flex; align-items: center; background-color: #000000; color: #ffffff !important; 
        text-decoration: none !important; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 14px;
      }
      .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #f0f0f0; font-size: 11px; color: #cccccc; text-transform: uppercase; letter-spacing: 1px; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="logo">Luka Jokic<span>.</span></div>
        <div class="content-area">${content.replace(/\n/g, '<br/>')}</div>
        <div class="reply-box">
          <span class="reply-label">Secure Signal Reply</span>
          <a href="${replyLink}" class="reply-button">↩ Secure Reply Terminal</a>
          <p style="font-size: 11px; color: #aaa; margin-top: 20px;">Direct replies are not monitored. Use the terminal above.</p>
        </div>
        <div class="footer">&copy; ${new Date().getFullYear()} Luka Jokic &mdash; All Rights Reserved.</div>
      </div>
    </div>
  </body>
  </html>
`;

export async function sendReplyAction(id: string, customerEmail: string, replyText: string) {
  try {
    const msg = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
    const firstName = msg[0]?.firstName || "";
    const lastName = msg[0]?.lastName || "";

    await db.insert(messageItems).values({ messageId: id, sender: "admin", content: replyText });
    await db.update(messages).set({ status: "replied" }).where(eq(messages.id, id));

    // DINAMIČKI URL: Ako si na lokalu, promeni ovo u http://localhost:3000 za testiranje
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://liternix-studio.vercel.app";
    const replyLink = `${baseUrl}/contact?email=${encodeURIComponent(customerEmail)}&fn=${encodeURIComponent(firstName)}&ln=${encodeURIComponent(lastName)}`;

    await transporter.sendMail({
      from: `"Luka Jokic" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: "RE: Message Update - Luka Jokic (NO-REPLY)",
      html: generateEmailHtml("Secure Transmission", replyText, replyLink),
    });
    return { success: true };
  } catch (error) { console.error(error); return { success: false }; }
}

// Vrati i ostale funkcije da build ne bi pukao
export async function getMessages() {
  const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return await Promise.all(allMessages.map(async (msg) => {
    const items = await db.select().from(messageItems).where(eq(messageItems.messageId, msg.id)).orderBy(desc(messageItems.createdAt));
    return { ...msg, items };
  }));
}
export async function markAsRead(id: string) { await db.update(messages).set({ status: "read" }).where(eq(messages.id, id)); }
export async function deleteMessageAction(id: string) { try { await db.delete(messages).where(eq(messages.id, id)); return { success: true }; } catch(e) { return { success: false }; } }
export async function deleteMessagesBulkAction(ids: string[]) { try { await db.delete(messages).where(inArray(messages.id, ids)); return { success: true }; } catch(e) { return { success: false }; } }
export async function sendNewMessageAction(to: string, subject: string, content: string) {
    try {
      const existing = await db.select().from(messages).where(eq(messages.email, to)).limit(1);
      let convId = "";
      if (existing.length > 0) convId = existing[0].id;
      else { const [n] = await db.insert(messages).values({ firstName: "Client", lastName: "", email: to, status: "replied" }).returning(); convId = n.id; }
      await db.insert(messageItems).values({ messageId: convId, sender: "admin", content });
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://liternix-studio.vercel.app";
      const replyLink = `${baseUrl}/contact?email=${encodeURIComponent(to)}&fn=Client`;
      await transporter.sendMail({ from: `"Luka Jokic" <${process.env.SMTP_USER}>`, to, subject: `${subject} (NO-REPLY)`, html: generateEmailHtml(subject, content, replyLink) });
      return { success: true };
    } catch (e) { return { success: false }; }
}