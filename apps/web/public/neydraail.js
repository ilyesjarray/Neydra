
        (function () {
            const SUPABASE_URL = 'https://ybrtpasetldpxanrhsle.supabase.co';
            const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicnRwYXNldGxkcHhhbnJoc2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTgyMjksImV4cCI6MjA4NTg5NDIyOX0.Rdj0S0oGV4HmQDERePPbxjQifJ8euDjOTMfgWtdz7gQ';
            let serviceGuard = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

            // Page Requirements
            const pageName = window.location.pathname;
            let requiredPlan = 'STANDARD';
            if (pageName.includes('/welcome/ail')) requiredPlan = 'PREMIUM';
            if (pageName.includes('/welcome/nlp')) requiredPlan = 'ULTRA';

            async function verifyAccess() {
                // 1. Check Session
                const { data: { session } } = await serviceGuard.auth.getSession();
                if (!session) return window.location.href = '/welcome/account';

                // 2. Check Subscription
                const { data, error } = await serviceGuard
                    .from('subscribers')
                    .select('plan_type, expires_at, status')
                    .eq('email', session.user.email)
                    .single();

                if (error || !data || data.status !== 'active' || (data.expires_at && new Date(data.expires_at) < new Date())) {
                    return window.location.href = '/welcome/home'; // Send back to buy plan
                }

                // 3. Check Plan Tier
                const userPlan = data.plan_type.toUpperCase();
                if (userPlan === 'ULTRA') return; // Ultra accesses everything
                if (userPlan !== requiredPlan) {
                    alert(`Your current plan (${data.plan_type}) does not support this feature. Upgrade to ${requiredPlan}.`);
                    return window.location.href = '/welcome/home';
                }
            }
            verifyAccess();
        })();
    