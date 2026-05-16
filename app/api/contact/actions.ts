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

const generateReplyLink = (email: string, firstName: string, lastName: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://liternix-studio.vercel.app";
  const params = new URLSearchParams({ email, fn: firstName, ln: lastName });
  return `${baseUrl}/contact?${params.toString()}`;
};

const generateEmailHtml = (subject: string, content: string, replyLink: string) => `
  <!DOCTYPE html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      body { margin: 0; padding: 0; width: 100%; background-color: #ffffff; font-family: -apple-system, sans-serif; color: #1a1a1a; }
      
      .wrapper { width: 100%; background-color: #ffffff; padding: 40px 20px; box-sizing: border-box; }
      .container { max-width: 560px; margin: 0 auto; }
      
      .logo { font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 40px; color: #000000; border-left: 3px solid #afff00; padding-left: 15px; }
      .content-area { font-size: 16px; line-height: 1.7; color: #1a1a1a; margin-bottom: 40px; white-space: pre-wrap; }
      
      /* REPLY SECTION */
      .reply-box { background-color: #f8f8f8; border: 1px solid #f0f0f0; border-radius: 16px; padding: 40px 20px; text-align: center; }
      .reply-icon-container { margin-bottom: 15px; text-align: center; display: block; }
      .reply-icon-svg { fill: #000000; width: 32px; height: 32px; display: inline-block; }
      
      .reply-label { display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #888888; margin-bottom: 20px; }
      .reply-button { 
        display: inline-block; background-color: #000000; color: #ffffff !important; 
        text-decoration: none !important; padding: 16px 35px; border-radius: 10px; font-weight: 700; font-size: 14px;
      }
      
      .notice { font-size: 11px; color: #999999; margin-top: 25px; line-height: 1.5; }
      .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #f0f0f0; font-size: 10px; color: #cccccc; text-transform: uppercase; letter-spacing: 1px; }

      /* DARK MODE OVERRIDES */
      @media (prefers-color-scheme: dark) {
        body, .wrapper { background-color: #0a0a0a !important; color: #eeeeee !important; }
        .logo { color: #ffffff !important; }
        .content-area { color: #dddddd !important; }
        .reply-box { background-color: #111111 !important; border-color: #222222 !important; }
        .reply-icon-svg { fill: #afff00 !important; }
        .reply-label { color: #666666 !important; }
        .reply-button { background-color: #afff00 !important; color: #000000 !important; }
        .footer { border-color: #222222 !important; color: #444444 !important; }
        .notice { color: #555555 !important; }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="logo">Luka Jokic<span>.</span></div>
        
        <div class="content-area">${content.replace(/\n/g, '<br/>')}</div>
        
        <div class="reply-box">
          <div class="reply-icon-container">
            <!-- Centrirana FaReply Ikonica (Inline SVG) -->
            <svg class="reply-icon-svg" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.309 189.836L184.313 31.308C199.719 17.435 224 28.375 224 49.072v88.92c182.302 5.039 288 114.354 288 288 0 22.146-18.006 40.153-40.153 40.153-15.08 0-28.784-8.351-35.485-21.716-43.041-85.842-111.455-127.354-212.362-127.354v88.92c0 20.697-24.281 31.637-39.687 17.764L8.309 230.164c-11.079-9.971-11.079-27.357 0-37.328z"/>
            </svg>
          </div>
          
          <span class="reply-label">Secure Signal Reply</span>
          
          <a href="${replyLink}" class="reply-button">
            REPLY VIA TERMINAL
          </a>
          
          <p class="notice">
            Replies to this email address are not monitored.<br/>
            Click above to respond securely.
          </p>
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
    const replyLink = generateReplyLink(customerEmail, firstName, lastName);
    await transporter.sendMail({
      from: `"Luka Jokic" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: "RE: Inquiry Update - Luka Jokic (NO-REPLY)",
      html: generateEmailHtml("Formal Response", replyText, replyLink),
    });
    return { success: true };
  } catch (e) { 
    console.error(e);
    return { success: false }; 
  }
}

export async function sendNewMessageAction(to: string, subject: string, content: string) {
    try {
      const existing = await db.select().from(messages).where(eq(messages.email, to)).limit(1);
      
      // OVO JE IZMENJENO: Promenjeno u const (prefer-const rešenje)
      const conversationId = existing.length > 0 
        ? existing[0].id 
        : (await db.insert(messages).values({ firstName: "Client", lastName: "", email: to, status: "replied" }).returning())[0].id;
      
      await db.insert(messageItems).values({ messageId: conversationId, sender: "admin", content });
      const replyLink = generateReplyLink(to, "Client", "");
      await transporter.sendMail({ from: `"Luka Jokic" <${process.env.SMTP_USER}>`, to, subject: `${subject} (NO-REPLY)`, html: generateEmailHtml(subject, content, replyLink) });
      return { success: true };
    } catch (e) { 
      console.error(e);
      return { success: false }; }
}

export async function getMessages() {
  const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return await Promise.all(allMessages.map(async (msg) => {
    const items = await db.select().from(messageItems)
      .where(eq(messageItems.messageId, msg.id))
      .orderBy(desc(messageItems.createdAt));
    return { ...msg, items };
  }));
}

export async function markAsRead(id: string) {
  await db.update(messages).set({ status: "read" }).where(eq(messages.id, id));
}

export async function deleteMessageAction(id: string) {
  try { await db.delete(messages).where(eq(messages.id, id)); return { success: true }; } catch (e) { 
    console.error(e);
    return { success: false }; }
}

export async function deleteMessagesBulkAction(ids: string[]) {
  try { await db.delete(messages).where(inArray(messages.id, ids)); return { success: true }; } catch (e) { 
    console.error(e);
    return { success: false }; }
}