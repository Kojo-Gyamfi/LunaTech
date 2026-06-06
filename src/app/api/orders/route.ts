import { NextResponse } from 'next/server';
import { Order } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simulate order processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate order ID
    const orderId = `LUNA-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Create order object
    const order: Order = {
      id: orderId,
      items: body.items,
      customerInfo: body.customerInfo,
      shippingAddress: body.shippingAddress,
      total: body.total,
      subtotal: body.subtotal,
      shipping: body.shipping,
      tax: body.tax,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        id: order.id,
        message: 'Order placed successfully',
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 400 }
    );
  }
}
