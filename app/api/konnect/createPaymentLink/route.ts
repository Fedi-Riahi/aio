import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const konnectUrl = "https://api.sandbox.konnect.network/api/v2/payments/init-payment";

    const apiKey = process.env.KONNECT_API_KEY;

    if (!apiKey) {
      console.error("KONNECT_API_KEY is missing in environment variables.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Request payload for Konnect using user data from the request body
    const payload = {
      receiverWalletId: process.env.KONNECT_WALLET_ID,
      token: "TND",
      amount: body.amount,
      type: "immediate",
      description: "Event Ticket Purchase",
      acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
      lifespan: 10,
      checkoutForm: true,
      addPaymentFeesToAmount: true,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
      email: body.email,
      orderId: body.event_id,
      webhook: "https://api-prod.aio.events/api/normalaccount/getpaymenetrestates",
      silentWebhook: true,
      successUrl: "http://localhost:3000/success",
      failUrl: "http://localhost:3000/failure",
      theme: "dark",
    };

    console.log("Sending payload to Konnect:", payload);

    const response = await fetch(konnectUrl, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("Konnect API returned non-JSON response:", errorText);
      return NextResponse.json(
        { error: "Failed to create payment link", details: "Non-JSON response received", response: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Konnect API Response:", data);
    return NextResponse.json({ payment_link: data.payUrl });
  } catch (error) {
    console.error("Error in createPaymentLink:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message, cause: error.cause },
      { status: 500 }
    );
  }
}
