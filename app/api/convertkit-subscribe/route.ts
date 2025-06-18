import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, ref } = await req.json();
    const tagId = "8314373";
    const apiKey = process.env.CONVERTKIT_API_KEY;

    console.log("ConvertKit API Key:", apiKey ? "Set" : "Not set");
    console.log("Email:", email);
    console.log("Tag ID:", tagId);

    if (!apiKey) {
      console.error("ConvertKit API key is not set");
      return NextResponse.json({ 
        success: false, 
        error: { message: "API key not configured" } 
      }, { status: 500 });
    }

    if (!email) {
      console.error("Email is required");
      return NextResponse.json({ 
        success: false, 
        error: { message: "Email is required" } 
      }, { status: 400 });
    }

    // x-www-form-urlencoded形式で送信
    const params = new URLSearchParams();
    params.append("api_key", apiKey);
    params.append("email", email);
    if (ref) {
      params.append("fields[ref]", ref);
    }

    console.log("Request body:", params.toString());

    const res = await fetch(`https://api.convertkit.com/v3/tags/${tagId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    console.log("ConvertKit response status:", res.status);
    console.log("ConvertKit response headers:", Object.fromEntries(res.headers.entries()));

    const data = await res.json();
    console.log("ConvertKit response data:", JSON.stringify(data, null, 2));

    if (res.ok) {
      console.log("ConvertKit subscription successful");
      return NextResponse.json({ success: true });
    } else {
      console.error("ConvertKit API error:", data);
      return NextResponse.json({ 
        success: false, 
        error: data 
      }, { status: res.status });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      success: false, 
      error: { message: "Internal server error" } 
    }, { status: 500 });
  }
} 