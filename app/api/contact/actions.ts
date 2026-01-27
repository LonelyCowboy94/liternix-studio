"use server";

import { db } from "@/db";
import { messages } from "@/db/schema";
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

// FUNCTION TO GENERATE HTML EMAIL CONTENT
const generateEmailHtml = (subject: string, content: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      .wrapper { width: 100%; table-layout: fixed; background-color: #000000; padding: 40px 0; }
      .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 4px; overflow: hidden; }
      
      /* Header with Neon Accents */
      .header { padding: 30px; border-bottom: 2px solid #afff00; text-align: left; }
      .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; font-style: italic; }
      .header .status { color: #afff00; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 8px; display: block; }
      
      /* Body Content */
      .body { padding: 40px; }
      .signal-info { color: #333333; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; font-family: 'Courier New', Courier, monospace; }
      .subject { color: #ffffff; font-size: 20px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; font-style: italic; letter-spacing: -0.5px; }
      .content { color: #a1a1aa; line-height: 1.6; font-size: 16px; font-weight: 400; border-left: 2px solid #1a1a1a; padding-left: 20px; }
      
      /* Call to Action Style */
      .highlight { color: #afff00; font-weight: bold; }
      
      /* Footer */
      .footer { padding: 30px; border-top: 1px solid #1a1a1a; text-align: left; background-color: #050505; }
      .footer p { color: #444444; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 5px 0; }
      .footer .encryption { color: #1a1a1a; font-size: 8px; }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <span class="status">● Incoming_Transmission</span>
          <h1>LITERNIX<span style="color: #afff00;">.</span>CTRL</h1>
        </div>
        <div class="body">
          <div class="signal-info">
            Ref: SIG-ARCHIVE-${Math.floor(Math.random() * 10000)}<br/>
            Priority: Alpha_High<br/>
            Source: Visual_Alchemist_Portal
          </div>
          <div class="subject">${subject}</div>
          <div class="content">
            ${content.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <div class="footer">
          <p>LITERNIX STUDIO // DIGITAL ALCHEMY UNIT</p>
          <p>© ${new Date().getFullYear()} ALL RIGHTS RESERVED.</p>
          <div class="encryption">ENCRYPTION: AES_256_LITERNIX_VERIFIED</div>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

export async function getMessages() {
  return await db.select().from(messages).orderBy(desc(messages.createdAt));
}

export async function markAsRead(id: string) {
  await db.update(messages).set({ status: "read" }).where(eq(messages.id, id));
}

export async function sendReplyAction(id: string, customerEmail: string, replyText: string) {
  try {
    const subject = "Re: Your Inquiry - Jokic Web Solutions";
    
    await transporter.sendMail({
      from: `"Jokic Web Solutions" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: subject,
      html: generateEmailHtml(subject, replyText),
    });

    await db.update(messages)
      .set({
        status: "replied",
        replyContent: replyText,
        repliedAt: new Date(),
      })
      .where(eq(messages.id, id));

    return { success: true };
  } catch (error) {
    console.error("Reply Error:", error);
    return { success: false };
  }
}

export async function deleteMessageAction(id: string) {
  try {
    await db.delete(messages).where(eq(messages.id, id));
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false };
  }
}

export async function sendNewMessageAction(to: string, subject: string, content: string) {
  try {
 
    await transporter.sendMail({
      from: `"Jokic Web Solutions" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: generateEmailHtml(subject, content),
    });

    await db.insert(messages).values({
      firstName: "Admin",
      lastName: "Message",
      email: to,
      message: `[OUTGOING] ${subject}`, 
      replyContent: content,           
      status: "replied",
      repliedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Compose Error:", error);
    return { success: false };
  }
}

export async function deleteMessagesBulkAction(ids: string[]) {
  try {
    if (!ids.length) return { success: true };
    await db.delete(messages).where(inArray(messages.id, ids));
    return { success: true };
  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return { success: false };
  }
}