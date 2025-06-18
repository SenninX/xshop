import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mrxsennin@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const fullAddress = data.address2 ? `${data.address}${data.address2}` : data.address;

  // お客様向けメール文面
  const mailOptions = {
    from: "mrxsennin@gmail.com",
    to: data.email,
    subject: "【SenninX STORE】ご注文ありがとうございます",
    text: `この度はSenninX STOREでご注文いただき、\n誠にありがとうございます。\n\nご注文内容は以下の通りです。\n\n---\n姓: ${data.lastName}\n名: ${data.firstName}\nEmail: ${data.email}\nサイズ: ${data.size}\n枚数: ${data.quantity}\n郵便番号: ${data.zip}\n住所: ${fullAddress}\n電話番号: ${data.phone}\n---\n\nご不明点等ございましたら、このメールにご返信いただくか、サイトのお問い合わせフォームよりご連絡ください。\n\nSenninX STORE 運営チーム`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ result: "ok" });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
} 