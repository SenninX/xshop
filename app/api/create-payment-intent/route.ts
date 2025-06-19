import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

export async function POST(req: NextRequest) {
  const { amount } = await req.json();
  if (!amount) return NextResponse.json({ error: "金額が必要です" }, { status: 400 });
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "jpy",
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
} 