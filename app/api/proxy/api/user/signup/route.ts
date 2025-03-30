import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const url = "https://8rgspuz56m.eu-central-1.awsapprunner.com/api/user/signup";
  console.log(`Signup proxy: POST to:`, url);


  const body = await req.body;


  const contentType = req.headers.get("content-type") || "multipart/form-data";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        Authorization: req.headers.get("authorization") || "",
      },
      body,
      duplex: "half",
    });


    const data = await response.text();

    const responseContentType =
      response.headers.get("content-type") || "application/json";

    return new NextResponse(data, {
      status: response.status,
      headers: { "Content-Type": responseContentType },
    });
  } catch (error) {
    console.error("Signup proxy error:", error.message, error.stack);
    return new NextResponse(
      JSON.stringify({ error: "Signup proxy failed", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


export const config = {
  api: {
    bodyParser: false,
  },
};
