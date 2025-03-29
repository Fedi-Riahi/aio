import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return handleRequest(req, "GET");
}

export async function POST(req: NextRequest) {
  return handleRequest(req, "POST");
}

async function handleRequest(req: NextRequest, method: string) {
  const { pathname, searchParams } = new URL(req.url);
  const path = pathname.replace("/api/proxy", "");
  const url = `https://api-prod.aio.events${path}?${searchParams.toString()}`;
  console.log(`General proxy: ${method} to:`, url);

  let body;
  let contentType = req.headers.get("content-type") || "application/json";

  if (method === "POST") {
    if (contentType.includes("application/json")) {
      try {
        const jsonBody = await req.json();
        body = JSON.stringify(jsonBody);
      } catch (error) {
        return new NextResponse(
          JSON.stringify({ error: "Invalid JSON body" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else if (contentType.includes("multipart/form-data")) {
      console.log("Handling multipart/form-data request");
      body = await req.body;
    } else {

      console.log("General proxy: Handling fallback content type:", contentType);
      body = await req.text();
    }
  }

  try {
    const response = await fetch(url, {
      method,
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
    console.error("General proxy error:", error.message, error.stack);
    return new NextResponse(
      JSON.stringify({ error: "General proxy failed", details: error.message }),
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
