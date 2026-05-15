const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const data = req.body;
  // NOWPayments sends 'payment_status' = 'finished'
  if (data.payment_status === 'finished' || data.payment_status === 'confirming') {
    
    // We match by EMAIL (User enters this in NOWPayments form)
    const email = data.buyer_email; 
    const amount = parseFloat(data.amount);

    if (!email) return res.status(400).json({ error: "No email" });

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
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })
      .eq('email', email);

    if (error) console.error("DB Error:", error);
    else console.log(`Payment Received: ${email} -> ${plan}`);
  }
  res.status(200).json({ received: true });
}
