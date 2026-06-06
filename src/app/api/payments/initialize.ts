import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_API_URL = "https://api.paystack.co";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, customerInfo, items, cartData } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { success: false, message: "Email and amount are required" },
        { status: 400 },
      );
    }

    // Amount in Paystack is in pesewas (100 pesewas = 1 Ghana Cedi), so multiply by 100
    const amountInPesewas = Math.round(amount * 100);

    // Initialize transaction with Paystack API
    const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInPesewas,
        currency: "GHS",
        metadata: {
          customerInfo,
          items,
          cartData,
        },
      }),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({
        success: true,
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
      });
    } else {
      return NextResponse.json(
        { success: false, message: data.message },
        { status: 400 },
      );
    }
  } catch (error: unknown) {
    console.error("Payment initialization error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to initialize payment";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
