import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type SupportRequest = {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
};

const requiredSmtpConfig = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SUPPORT_TO_EMAIL",
] as const;

function getMissingSmtpConfig() {
  return requiredSmtpConfig.filter((key) => !process.env[key]);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SupportRequest;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const topic = body.topic?.trim() ?? "Support request";
    const message = body.message?.trim() ?? "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const missingConfig = getMissingSmtpConfig();
    if (missingConfig.length > 0) {
      return NextResponse.json(
        {
          error:
            "Support email is not configured. Add SMTP settings to your environment.",
          missingConfig,
        },
        { status: 503 },
      );
    }

    const smtpPort = Number(process.env.SMTP_PORT);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure:
        process.env.SMTP_SECURE === "true" ||
        smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeTopic = escapeHtml(topic);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM_EMAIL ??
        process.env.SMTP_USER,
      to: process.env.SUPPORT_TO_EMAIL,
      replyTo: email,
      subject: `LunaTech support: ${topic}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Topic: ${topic}`,
        "",
        message,
      ].join("\n"),
      html: `
        <h2>New LunaTech support message</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Topic:</strong> ${safeTopic}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Support message sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Support email error:", error);
    return NextResponse.json(
      { error: "Failed to send support message." },
      { status: 500 },
    );
  }
}
