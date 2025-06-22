import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  console.log("--- send-order-mail API Fired ---");
  try {
    const data = await req.json();
    
    const gmailPass = process.env.GMAIL_APP_PASSWORD;
    console.log(`Is GMAIL_APP_PASSWORD set: ${!!gmailPass}`);

    if (!gmailPass) {
      throw new Error("GMAIL_APP_PASSWORD environment variable is not set.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mrxsennin@gmail.com",
        pass: gmailPass,
      },
    });

    const fullAddress = data.address2 ? `${data.address}${data.address2}` : data.address;

    // ★START: 商品情報の設定
    let productDetails = "";
    if (data.selectedOption === "vip") {
      productDetails = `
商品名: VIPファミリー
価格: 4,700円/月
内容:
- 毎月最新バージョンのTシャツを配送
- デイリー仙人マインド（仙人さんソロ・トーク10分間-毎朝6時メール配信）
- 緊急・X-極秘ミーティング（完全ソロトーク60分間-毎月の月末メール配信）
`;
    } else if (data.selectedOption === "normal") {
      productDetails = `
商品名: Normalメンバー
価格: 1,700円/月
内容:
- 今回のみTシャツを配送
- デイリー仙人マインド（仙人さんソロ・トーク10分間-毎朝6時メール配信）
`;
    } else if (data.selectedOption === "tshirt") {
      productDetails = `
商品名: Tシャツのみ希望
価格: 1,470円
内容:
- 今回のみTシャツを配送
`;
    }
    // ★END: 商品情報の設定

    // ★決済日時を生成 (JST)
    const paymentDateTime = new Date().toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    // お客様向けメールと管理者向けメールの共通本文
    const emailText = `この度はSenninX STOREでご注文いただき、
誠にありがとうございます。

ご注文内容は以下の通りです。

---
決済日時: ${paymentDateTime}
${productDetails.trim()}

Tシャツサイズ: ${data.size ? data.size.toUpperCase() : ''}

ご請求額: ${data.totalAmount.toLocaleString()}円（内、送料・手数料500円）
---

【お届け先情報】
お名前: ${data.lastName} ${data.firstName} 様
郵便番号: ${data.zip}
住所: ${fullAddress}
電話番号: ${data.phone}
メールアドレス: ${data.email}
---

ご不明点等ございましたら、このメールにご返信いただくか、サイトのお問い合わせフォームよりご連絡ください。

SenninX STORE 運営チーム

連絡先：mrxsennin@gmail.com`;

    // お客様向けメールオプション
    const customerMailOptions = {
      from: "mrxsennin@gmail.com",
      to: data.email,
      subject: "【SenninX STORE】ご注文ありがとうございます",
      text: emailText,
    };

    // 管理者向けメールオプション
    const adminMailOptions = {
      from: "mrxsennin@gmail.com",
      to: "mrxsennin@gmail.com",
      subject: "NewAdvanceMind Tシャツ購入者情報",
      text: emailText,
    };
    
    console.log("Attempting to send emails...");
    // お客様向けと管理者向けのメールを同時に送信
    await Promise.all([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);
    
    console.log("Emails sent successfully.");
    return NextResponse.json({ result: "ok" });
  } catch (e: any) {
    console.error("send-order-mail API Error:", e.message);
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
} 