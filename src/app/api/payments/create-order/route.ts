import { NextResponse } from 'next/server';
import { getRazorpayClient, MIN_AMOUNT_INR, MAX_AMOUNT_INR } from '@/lib/razorpay';

export const runtime = 'nodejs';

// In-memory IP rate limiter (10 orders per 10 minutes per IP)
const ipOrderCache = new Map<string, { count: number; expires: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipOrderCache.get(ip);
  if (!record || now > record.expires) {
    ipOrderCache.set(ip, { count: 1, expires: now + 10 * 60 * 1000 });
    return false;
  }
  if (record.count >= 10) {
    return true;
  }
  record.count += 1;
  return false;
}

interface CreateOrderRequestBody {
  amount?: number;
  name?: string;
  message?: string;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many order requests. Please wait a few moments before trying again.',
      },
      { status: 429 }
    );
  }

  let body: CreateOrderRequestBody;
  try {
    body = (await request.json()) as CreateOrderRequestBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON request body.',
      },
      { status: 400 }
    );
  }

  const { amount, name, message } = body;

  // Validate amount
  if (typeof amount !== 'number' || isNaN(amount) || !Number.isFinite(amount)) {
    return NextResponse.json(
      {
        success: false,
        error: 'A valid numeric amount is required.',
      },
      { status: 400 }
    );
  }

  const roundedAmount = Math.round(amount);

  if (roundedAmount < MIN_AMOUNT_INR || roundedAmount > MAX_AMOUNT_INR) {
    return NextResponse.json(
      {
        success: false,
        error: `Amount must be between ₹${MIN_AMOUNT_INR} and ₹${MAX_AMOUNT_INR.toLocaleString('en-IN')}.`,
      },
      { status: 400 }
    );
  }

  // Convert to paise (1 INR = 100 paise) - strictly computed on server
  const amountInPaise = roundedAmount * 100;

  // Sanitize notes
  const safeName = (name || '').trim().slice(0, 50) || 'Kind Supporter';
  const safeMessage = (message || '').trim().slice(0, 200) || 'Bought a coffee ☕';

  try {
    const razorpay = getRazorpayClient();
    const receiptId = `cfee_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        supporter_name: safeName,
        supporter_message: safeMessage,
      },
    });

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err: any) {
    console.error('Razorpay order creation error:', err);

    const safeErrorMessage =
      err?.message?.includes('environment variables') || !process.env.RAZORPAY_KEY_SECRET
        ? 'Payment service configuration error. Please try again later.'
        : 'Failed to initialize payment order with Razorpay.';

    return NextResponse.json(
      {
        success: false,
        error: safeErrorMessage,
      },
      { status: 500 }
    );
  }
}
