import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

// Handle GET requests
export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const url = `https://api-prod.aio.events/${params.path.join('/')}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any additional headers if required (e.g., Authorization)
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
