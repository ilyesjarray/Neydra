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
      const res = await fetch('/api/validate_subscription.php');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data.plan !== 'free' && (data.plan === requiredPlan || data.plan === 'ultra')) {
        console.log('Access Granted: Plan Level ' + data.plan);
      } else {
        window.location.href = '/welcome/home';
      }
    } catch (e) {
      console.error('Auth Failed:', e);
      window.location.href = '/welcome/home';
    }
  }
});
