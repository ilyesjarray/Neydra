document.addEventListener('DOMContentLoaded', async () => {
  const path = window.location.pathname;
  const lockedPages = {
    '/welcome/pae': 'standard',
    '/welcome/ail': 'premium',
    '/welcome/nlp': 'ultra'
  };

  const requiredPlan = lockedPages[path];
  if (requiredPlan) {
    try {
      const SUPABASE_URL = 'https://ybrtpasetldpxanrhsle.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicnRwYXNldGxkcHhhbnJoc2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTgyMjksImV4cCI6MjA4NTg5NDIyOX0.Rdj0S0oGV4HmQDERePPbxjQifJ8euDjOTMfgWtdz7gQ';
      let authGuard;
      
      if (window.supabase) {
        authGuard = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      } else {
        throw new Error('Supabase SDK not loaded');
      }

      const { data: { session } } = await authGuard.auth.getSession();
      if (!session) {
        window.location.href = '/welcome/home';
        return;
      }

      const { data, error } = await authGuard
          .from('subscribers')
          .select('plan_type, status, expires_at')
          .eq('email', session.user.email)
          .single();

      if (error || !data || data.status !== 'active' || new Date(data.expires_at) < new Date()) {
          console.error('Subscription expired or not found');
          window.location.href = '/welcome/home';
          return;
      }
      
      const userPlan = data.plan_type.toLowerCase();
      // Store in localStorage for synchronous checks
      localStorage.setItem('neydra_plan', userPlan);

      const planHierarchy = ['free', 'standard', 'premium', 'ultra'];
      const userPlanIndex = planHierarchy.indexOf(userPlan);
      const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);

      if (userPlanIndex >= requiredPlanIndex) {
        console.log('Access Granted: Plan Level ' + userPlan);
      } else {
        window.location.href = '/welcome/home';
      }
    } catch (e) {
      console.error('Auth Failed:', e);
      window.location.href = '/welcome/home';
    }
  }
});
