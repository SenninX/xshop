import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Stripeの初期化をシンプルに
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: "有効な金額が必要です" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "jpy",
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (e: any) {
    // エラーログをより詳細に出力
    console.error("create-payment-intent Error:", e);
    return NextResponse.json({ error: e.message || "予期せぬエラーが発生しました。" }, { status: 500 });
  }
} 