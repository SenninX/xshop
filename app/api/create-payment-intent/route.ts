import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    // 診断ログ：環境変数が読み込まれているか確認
    console.log("--- create-payment-intent API started ---");
    console.log("Is STRIPE_SECRET_KEY set:", !!process.env.STRIPE_SECRET_KEY);

    // Stripeの初期化をtry...catchブロック内に移動
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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