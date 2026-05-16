import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '', 
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
    );
    const data = await req.json();
    
    // NOWPayments sends 'payment_status' = 'finished'
    if (data.payment_status === 'finished' || data.payment_status === 'confirming') {
      
      // We match by EMAIL (User enters this in NOWPayments form)
      const email = data.buyer_email; 
      const amount = parseFloat(data.amount);

      if (!email) return NextResponse.json({ error: "No email" }, { status: 400 });

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
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('email', email);

      if (error) console.error("DB Error:", error);
      else console.log(`Payment Received: ${email} -> ${plan}`);
    }
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
