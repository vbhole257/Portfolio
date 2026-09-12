import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';

export const runtime = 'nodejs';

interface VerifyRequestBody {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  expected_order_id?: string;
}

export async function POST(request: Request) {
  let body: VerifyRequestBody;
  try {
    body = (await request.json()) as VerifyRequestBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON request body.',
      },
      { status: 400 }
    );
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, expected_order_id } = body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification parameters missing (payment ID, order ID, or signature).',
      },
      { status: 400 }
    );
  }

  // Ensure returned Razorpay order ID matches the expected order session
  if (expected_order_id && razorpay_order_id !== expected_order_id) {
    console.warn(`Order mismatch: expected ${expected_order_id} but received ${razorpay_order_id}`);
    return NextResponse.json(
      {
        success: false,
        error: 'Order ID mismatch. The payment does not correspond to the initialized order.',
      },
      { status: 400 }
    );
  }

  try {
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      console.warn(
        `Payment signature verification failed for order: ${razorpay_order_id}, payment: ${razorpay_payment_id}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Cryptographic signature mismatch. Payment verification failed.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (err: any) {
    console.error('Payment verification server error:', err);
    const safeError = err?.message?.includes('RAZORPAY_KEY_SECRET')
      ? 'Payment service configuration error. Please try again later.'
      : 'Server error while verifying payment signature.';

    return NextResponse.json(
      {
        success: false,
        error: safeError,
      },
      { status: 500 }
    );
  }
}
