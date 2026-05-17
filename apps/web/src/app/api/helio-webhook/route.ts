// /api/helio-webhook — Next.js App Router: Payment webhook handler
// Handles NOWPayments/Helio payment confirmations and updates Supabase subscriber status

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (data.payment_status === 'finished' || data.payment_status === 'confirming') {
      const email = data.buyer_email;
      const amount = parseFloat(data.amount);

      if (!email) {
        return NextResponse.json({ error: 'No email' }, { status: 400 });
      }

      // Determine Plan
      let plan = 'STANDARD';
      if (amount >= 40 && amount < 90) plan = 'PREMIUM';
      if (amount >= 90) plan = 'ULTRA';

      // Update User in Database
      const { error } = await supabase
        .from('subscribers')
        .update({
          status: 'active',
          plan_type: plan,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('email', email);

      if (error) {
        console.error('DB Error:', error);
      } else {
        console.log(`Payment Received: ${email} -> ${plan}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
