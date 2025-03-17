import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await fetch("https://sandbox.konnect.network/payments/init-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.KONNECT_API_KEY || "YOUR_KONNECT_API_KEY", // Use environment variable
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Konnect API Error:", response.status, errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    console.log("Konnect API Response:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}