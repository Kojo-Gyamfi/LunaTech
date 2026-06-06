import { NextRequest, NextResponse } from "next/server";

const PAYSTACK_API_URL = "https://api.paystack.co";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "Reference is required" },
        { status: 400 },
      );
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { success: false, message: "Paystack secret key is not configured" },
        { status: 503 },
      );
    }

    // Verify transaction with Paystack API
    const response = await fetch(
      `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    if (data.status) {
      const transactionData = data.data;
      return NextResponse.json({
        success: true,
        status: transactionData.status, // 'success' or 'failed'
        reference: transactionData.reference,
        amount: transactionData.amount / 100, // Convert from pesewas to Ghana Cedis
        currency: "GHS",
        email: transactionData.customer?.email,
        metadata: transactionData.metadata,
      });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || "Payment verification failed" },
        { status: 400 },
      );
    }
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to verify payment";

    return NextResponse.json(
      { success: false, message },
      { status: 500 },
    );
  }
}
