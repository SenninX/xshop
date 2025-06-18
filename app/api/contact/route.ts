export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
// ...（以下、メール送信処理）


export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  // nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: "mrxsennin@gmail.com",
    subject: "【SenninX STORE】お問い合わせ",
    text: `お名前: ${name}\nメール: ${email}\nメッセージ:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
} 