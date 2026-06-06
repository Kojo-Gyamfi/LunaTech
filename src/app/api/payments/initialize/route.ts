import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_API_URL = "https://api.paystack.co";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, reference, customerInfo } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { success: false, message: "Email and amount are required" },
        { status: 400 },
      );
    }

    // Amount in Paystack is in pesewas (100 pesewas = 1 Ghana Cedi)
    const amountInPesewas = Math.round(amount * 100);

    const requestBody = {
      email,
      amount: amountInPesewas,
      currency: "GHS",
      reference: reference || undefined,
      metadata: {
        customerName: `${customerInfo?.firstName} ${customerInfo?.lastName}`,
        customerEmail: email,
      },
    };

    // Initialize transaction with Paystack API
    const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({
        success: true,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        reference: data.data.reference,
        amount: amountInPesewas,
      });
    } else {
      console.error("Paystack error:", data);
      return NextResponse.json(
        { success: false, message: data.message || "Payment initialization failed" },
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
