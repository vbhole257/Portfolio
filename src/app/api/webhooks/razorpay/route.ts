import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';

export const runtime = 'nodejs';

// V1 Database-free implementation: fast acknowledgment with transient in-memory deduplication for immediate retries.
// No persistent database idempotency is claimed for V1.
const processedEvents = new Map<string, number>();

function isDuplicateEvent(eventId: string): boolean {
  const now = Date.now();
  // Clean up stale entries older than 1 hour
  for (const [id, time] of processedEvents.entries()) {
    if (now - time > 3600 * 1000) {
      processedEvents.delete(id);
    }
  }

  if (processedEvents.has(eventId)) {
    return true;
  }
  processedEvents.set(eventId, now);
  return false;
}

export async function POST(request: Request) {
  const signature = request.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json(
      { success: false, error: 'Missing x-razorpay-signature header.' },
      { status: 400 }
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to read raw request body.' },
      { status: 400 }
    );
  }

  try {
    const isValid = verifyWebhookSignature({ rawBody, signature });
    if (!isValid) {
      console.warn('Webhook signature mismatch. Rejecting webhook request.');
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature.' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload?.event_id || payload?.id;
    const eventType = payload?.event;

    if (eventId && isDuplicateEvent(eventId)) {
      console.log(`Duplicate webhook event ignored: ${eventId}`);
      return NextResponse.json({ success: true, message: 'Event already processed.' }, { status: 200 });
    }

    console.log(`Razorpay Webhook Event Received: [${eventType}]`);

    switch (eventType) {
      case 'payment.captured': {
        const payment = payload?.payload?.payment?.entity;
        console.log('Payment Captured Successfully:', {
          id: payment?.id,
          order_id: payment?.order_id,
          amount_in_inr: payment?.amount ? payment.amount / 100 : undefined,
          email: payment?.email,
          contact: payment?.contact,
          notes: payment?.notes,
        });
        break;
      }

      case 'payment.failed': {
        const payment = payload?.payload?.payment?.entity;
        console.warn('Payment Failed:', {
          id: payment?.id,
          order_id: payment?.order_id,
          error_code: payment?.error_code,
          error_description: payment?.error_description,
        });
        break;
      }

      case 'order.paid': {
        const order = payload?.payload?.order?.entity;
        console.log('Order Fully Paid:', {
          id: order?.id,
          amount_paid: order?.amount_paid ? order.amount_paid / 100 : undefined,
          notes: order?.notes,
        });
        break;
      }

      default:
        console.log(`Unhandled Razorpay event type: ${eventType}`);
        break;
    }

    // Acknowledge quickly to Razorpay
    return NextResponse.json({ success: true, received: true }, { status: 200 });
  } catch (err: any) {
    console.error('Error handling Razorpay webhook:', err);
    const safeError = err?.message?.includes('RAZORPAY_WEBHOOK_SECRET')
      ? 'Webhook service configuration error. Please check server environment.'
      : 'Server error processing webhook.';

    return NextResponse.json(
      { success: false, error: safeError },
      { status: 500 }
    );
  }
}
