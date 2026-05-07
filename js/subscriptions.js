// ============================================================================
// NEYDRA SUBSCRIPTION MANAGEMENT SYSTEM
// Handles:  Access control, plan validation, locked page protection
// ============================================================================

// Global Config
const NEYDRA_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['exchange'],
    accessiblePages: ['/welcome', '/welcome/home', '/welcome/about', '/welcome/exchange', '/welcome/account', '/welcome/nexhub', '/welcome/shop', '/welcome/news', '/welcome/p2p']
  },
  standard: {
    name: 'Standard',
    price: 15,
    features: ['exchange', 'pae'],
    accessiblePages: ['/welcome', '/welcome/home', '/welcome/about', '/welcome/exchange', '/welcome/account', '/welcome/nexhub', '/welcome/shop', '/welcome/news', '/welcome/p2p', '/welcome/pae']
  },
  premium: {
    name: 'Premium',
    price: 40,
    features: ['exchange', 'pae', 'ail'],
    accessiblePages: ['/welcome', '/welcome/home', '/welcome/about', '/welcome/exchange', '/welcome/account', '/welcome/nexhub', '/welcome/shop', '/welcome/news', '/welcome/p2p', '/welcome/pae', '/welcome/ail']
  },
  ultra: {
    name: 'Ultra',
    price: 90,
    features: ['exchange', 'pae', 'ail', 'nlp'],
    accessiblePages: ['/welcome', '/welcome/home', '/welcome/about', '/welcome/exchange', '/welcome/account', '/welcome/nexhub', '/welcome/shop', '/welcome/news', '/welcome/p2p', '/welcome/pae', '/welcome/ail', '/welcome/nlp']
  }
};

// Feature-to-Page Mapping
const FEATURE_PAGES = {
  'exchange': '/welcome/exchange',
  'pae': '/welcome/pae',
  'ail': '/welcome/ail',
  'nlp': '/welcome/nlp'
};

// Get current user's plan from localStorage or API
function getUserPlan() {
  const storedPlan = localStorage.getItem('neydra_plan');
  if (storedPlan && NEYDRA_PLANS[storedPlan]) {
    return storedPlan;
  }
  // Default to free if not found
  localStorage.setItem('neydra_plan', 'free');
  return 'free';
}

// Check if user has access to a feature
function hasAccessToFeature(feature) {
  const userPlan = getUserPlan();
  return NEYDRA_PLANS[userPlan].features.includes(feature);
}

// Get current page path from URL
function getCurrentPage() {
  // Remove trailing slash for consistent matching
  return window.location.pathname.replace(/\/$/, '') || '/welcome/home';
}

// Main Access Control Check (Run on page load)
function checkPageAccess() {
  const currentPage = getCurrentPage();
  const userPlan = getUserPlan();
  const allowedPages = NEYDRA_PLANS[userPlan].accessiblePages;

  if (! allowedPages.includes(currentPage)) {
    // Unauthorized access attempt
    showWarning();
    setTimeout(() => {
      window.location.href = '/welcome/home';
    }, 3000);
  }
}

// Navigate to a service page with access check
function navigateService(page, requiredPlan) {
  const userPlan = getUserPlan();
  
  // Convert plan parameter to plan key if needed
  if (requiredPlan === 'free') {
    window.location.href = page;
    return;
  }

  // For paid plans, check if user has access
  const requiredPlanKey = Object.keys(NEYDRA_PLANS).find(
    key => NEYDRA_PLANS[key].name. toLowerCase() === requiredPlan.toLowerCase()
  );

  if (NEYDRA_PLANS[userPlan].features.some(f => FEATURE_PAGES[f] === page)) {
    window.location.href = page;
  } else {
    showWarning();
  }
}

// Simplified access check function for button clicks
function checkAccess(page, requiredPlan) {
  const userPlan = getUserPlan();
  const planHierarchy = ['free', 'standard', 'premium', 'ultra'];
  const userPlanIndex = planHierarchy.indexOf(userPlan);
  const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);

  if (userPlanIndex >= requiredPlanIndex) {
    window.location.href = page;
  } else {
    showWarning();
  }
}

// Display Warning Modal (Fade-in with warning. png)
function showWarning() {
  // Remove any existing warning modal
  const existingWarning = document.getElementById('warning-modal');
  if (existingWarning) {
    existingWarning.remove();
  }

  // Create modal
  const modal = document.createElement('div');
  modal.id = 'warning-modal';
  modal.className = 'warning-modal';
  modal.innerHTML = `
    <div class="warning-content">
      <img src="/assets/warning.png" alt="Unauthorized Access" class="warning-image" />
      <p class="warning-text">⚠️ Access Denied</p>
      <p style="color: var(--text-light); font-size: 0.95rem; margin-bottom: 2rem;">
        This feature requires a subscription plan.  Upgrade now to unlock all advanced tools!
      </p>
      <button class="warning-btn" onclick="window.location.href='/welcome/home'">
        Upgrade or Go Home
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  // Auto-close after 4 seconds
  setTimeout(() => {
    if (modal.parentElement) {
      modal.remove();
    }
  }, 4000);
}

// Update UI based on user plan
function updateServiceUI() {
  const userPlan = localStorage.getItem('neydra_plan') || 'free';
  if (!NEYDRA_PLANS[userPlan]) return;
  const features = NEYDRA_PLANS[userPlan].features;

  // PAE Update
  const paeCard = document.getElementById('pae-service');
  const btnPae = document.getElementById('btn-pae');
  if (features.includes('pae')) {
    if (paeCard) paeCard.style.opacity = '1';
    if (btnPae) {
      btnPae.innerHTML = `<img src="/assets/Predictive_Analytics.png" alt="Access Predictive Analytics" class="btn-icon" /><span class="btn-label">Access Now</span>`;
      btnPae.onclick = () => window.location.href = '/welcome/pae';
      btnPae.classList.remove('locked-btn');
      btnPae.classList.add('unlock-btn');
    }
  } else {
    if (paeCard) paeCard.style.opacity = '0.6';
  }

  // AIL Update
  const ailCard = document.getElementById('ail-service');
  const btnAil = document.getElementById('btn-ail');
  if (features.includes('ail')) {
    if (ailCard) ailCard.style.opacity = '1';
    if (btnAil) {
      btnAil.innerHTML = `<img src="/assets/Liquidity_Decoder.png" alt="Access Liquidity Decoder" class="btn-icon" /><span class="btn-label">Access Now</span>`;
      btnAil.onclick = () => window.location.href = '/welcome/ail';
      btnAil.classList.remove('locked-btn');
      btnAil.classList.add('unlock-btn');
    }
  } else {
    if (ailCard) ailCard.style.opacity = '0.6';
  }

  // NLP Update
  const nlpCard = document.getElementById('nlp-service');
  const btnNlp = document.getElementById('btn-nlp');
  if (features.includes('nlp')) {
    if (nlpCard) nlpCard.style.opacity = '1';
    if (btnNlp) {
      btnNlp.innerHTML = `<img src="/assets/NLP_Analysis.png" alt="Access Sentiment Analyzer" class="btn-icon" /><span class="btn-label">Access Now</span>`;
      btnNlp.onclick = () => window.location.href = '/welcome/nlp';
      btnNlp.classList.remove('locked-btn');
      btnNlp.classList.add('unlock-btn');
    }
  } else {
    if (nlpCard) nlpCard.style.opacity = '0.6';
  }

  console.log(`[NEYDRA] UI Updated for Plan: ${userPlan}`);
}

// Simulate subscription plan change (for testing)
function setUserPlan(plan) {
  if (NEYDRA_PLANS[plan]) {
    localStorage.setItem('neydra_plan', plan);
    console.log(`[NEYDRA] Plan changed to: ${plan}`);
    location.reload();
  } else {
    console.error('[NEYDRA] Invalid plan:', plan);
  }
}

// Fetch real plan from Supabase DB to keep localStorage in sync
async function syncUserPlanWithSupabase() {
  try {
    if (!window.supabase) return;
    const SUPABASE_URL = 'https://ybrtpasetldpxanrhsle.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicnRwYXNldGxkcHhhbnJoc2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTgyMjksImV4cCI6MjA4NTg5NDIyOX0.Rdj0S0oGV4HmQDERePPbxjQifJ8euDjOTMfgWtdz7gQ';
    const subGuard = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    const { data: { session } } = await subGuard.auth.getSession();
    if (session) {
      const { data, error } = await subGuard
        .from('subscribers')
        .select('plan_type, status, expires_at')
        .eq('email', session.user.email)
        .single();
        
      if (!error && data && data.status === 'active' && (!data.expires_at || new Date(data.expires_at) > new Date())) {
        localStorage.setItem('neydra_plan', data.plan_type.toLowerCase());
      } else {
        localStorage.setItem('neydra_plan', 'free');
      }
    } else {
      localStorage.setItem('neydra_plan', 'free');
    }
  } catch(e) {
    console.error("Subscription Sync Error:", e);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  await syncUserPlanWithSupabase();
  checkPageAccess();
  updateServiceUI();
});

// Prevent direct URL access to locked pages via Service Worker communication
window.addEventListener('beforeunload', function() {
  const currentPage = getCurrentPage();
  const userPlan = getUserPlan();
  const allowedPages = NEYDRA_PLANS[userPlan]. accessiblePages;
  
  if (!allowedPages.includes(currentPage)) {
    // Redirect immediately if trying to leave to unauthorized page
    window.location.href = '/welcome/home';
  }
});