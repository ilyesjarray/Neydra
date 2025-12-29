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
    accessiblePages: ['index. html', 'home.html', 'about.html', 'exchange.html']
  },
  standard: {
    name: 'Standard',
    price: 15,
    features: ['exchange', 'pae'],
    accessiblePages:  ['index.html', 'home.html', 'about.html', 'exchange.html', 'PAE.html']
  },
  premium: {
    name:  'Premium',
    price:  40,
    features: ['exchange', 'pae', 'ail'],
    accessiblePages:  ['index.html', 'home.html', 'about.html', 'exchange.html', 'PAE.html', 'AIL.html']
  },
  ultra: {
    name: 'Ultra',
    price: 90,
    features:  ['exchange', 'pae', 'ail', 'nlp'],
    accessiblePages:  ['index.html', 'home.html', 'about.html', 'exchange.html', 'PAE.html', 'AIL.html', 'RT-NLP-SA.html']
  }
};

// Feature-to-Page Mapping
const FEATURE_PAGES = {
  'exchange':  'exchange.html',
  'pae': 'PAE. html',
  'ail':  'AIL.html',
  'nlp': 'RT-NLP-SA.html'
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

// Get page name from URL
function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'home.html';
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
      window.location.href = 'home.html';
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
      <img src="assets/warning.png" alt="Unauthorized Access" class="warning-image" />
      <p class="warning-text">⚠️ Access Denied</p>
      <p style="color: var(--text-light); font-size: 0.95rem; margin-bottom: 2rem;">
        This feature requires a subscription plan.  Upgrade now to unlock all advanced tools!
      </p>
      <button class="warning-btn" onclick="window.location.href='home.html'">
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
  const userPlan = getUserPlan();
  const features = NEYDRA_PLANS[userPlan].features;

  // Show/Hide service cards based on plan
  if (! features.includes('pae')) {
    const paeCard = document.getElementById('pae-service');
    if (paeCard) paeCard.style.opacity = '0.6';
  }

  if (! features.includes('ail')) {
    const ailCard = document. getElementById('ail-service');
    if (ailCard) ailCard.style.opacity = '0.6';
  }

  if (!features.includes('nlp')) {
    const nlpCard = document.getElementById('nlp-service');
    if (nlpCard) nlpCard.style.opacity = '0.6';
  }

  // Add visual indicators
  console.log(`[NEYDRA] User Plan: ${userPlan} | Features: ${features.join(', ')}`);
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
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
    window.location.href = 'home.html';
  }
});