import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-05-28.basil" });

export async function GET() {
  try {
    // 商品と価格を取得
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price']
    });

    // 価格情報も取得
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    });

    return NextResponse.json({
      products: products.data,
      prices: prices.data
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 