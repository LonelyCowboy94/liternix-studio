import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/db";
import { messages } from "@/db/schema";

interface ContactInquiry {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body: ContactInquiry = await req.json();
    const { firstName, lastName, company, email, message } = body;

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      return NextResponse.json(
        { error: "Server configuration error: Missing credentials." },
        { status: 500 }
      );
    }

    try {
      await db.insert(messages).values({
        firstName,
        lastName,
        email,
        company: company || null,
        message,
      });
    } catch (dbError) {
      const msg = dbError instanceof Error ? dbError.message : "Database error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: { user, pass },
      });

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px; }
            .card { background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 24px; }
            .title { color: #1e293b; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.025em; }
            .label { color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
            .value { color: #0f172a; font-size: 16px; margin-bottom: 20px; font-weight: 500; }
            .message-box { background-color: #f1f5f9; border-radius: 12px; padding: 20px; color: #334155; line-height: 1.6; border-left: 4px solid #6366f1; }
            .footer { margin-top: 32px; text-align: center; color: #94a3b8; font-size: 12px; }
          </style>
        </head>
        <body>
          <div className="container">
            <div className="card">
              <div className="header">
                <p className="label">System Notification</p>
                <h1 className="title">New Professional Inquiry</h1>
              </div>
              
              <div style="display: flex; gap: 40px;">
                <div style="flex: 1;">
                  <p className="label">Sender Name</p>
                  <p className="value">${firstName} ${lastName}</p>
                </div>
                <div style="flex: 1;">
                  <p className="label">Company</p>
                  <p className="value">${company || "N/A"}</p>
                </div>
              </div>

              <p className="label">Email Address</p>
              <p className="value">${email}</p>

              <p className="label" style="margin-top: 24px;">Message Content</p>
              <div className="message-box">
                ${message.replace(/\n/g, '<br/>')}
              </div>

              <div className="footer">
                <p>This message was sent via the Portfolio Contact Form.<br/>Log in to the Admin Panel to reply directly.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"CMS Notification" <${user}>`,
        to: process.env.CONTACT_RECEIVER,
        replyTo: email,
        subject: `[INQUIRY] ${firstName} ${lastName}`,
        html: emailHtml,
      });

    } catch (mailError) {
      const msg = mailError instanceof Error ? mailError.message : "SMTP error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}