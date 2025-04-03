import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const prodApiUrl = 'https://8rgspuz56m.eu-central-1.awsapprunner.com/api/normalaccount/order';

    const response = await fetch(prodApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorData.respond?.error?.details || 'Failed to create order' },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: 'Failed to create order', details: errorText },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    return NextResponse.json({
      payment_link: data.payment_link,
      order_id: data.order_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
