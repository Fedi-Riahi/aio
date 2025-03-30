import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = "https://8rgspuz56m.eu-central-1.awsapprunner.com/api/user/mailconfopensession";
  console.log(`Mailconf proxy to:`, url);

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return new NextResponse(
      JSON.stringify({ error: "Invalid JSON body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.text();
    const responseContentType =
      response.headers.get("content-type") || "application/json";

    return new NextResponse(data, {
      status: response.status,
      headers: { "Content-Type": responseContentType },
    });
  } catch (error) {
    console.error("Mailconf proxy error:", error.message, error.stack);
    return new NextResponse(
      JSON.stringify({ error: "Mailconf proxy failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
