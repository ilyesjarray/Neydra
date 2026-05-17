
    // --- 1. MAPPING PLANS TO NOWPAYMENTS LINKS ---
    // PASTE THE LINKS YOU GOT FROM NOWPAYMENTS HERE:
    const PAYMENT_LINKS = {
      'standard': 'https://nowpayments.io/payment/?iid=4458788659',
      'premium': 'https://nowpayments.io/payment/?iid=5180468463',
      'ultra': 'https://nowpayments.io/payment/?iid=6375314481'
    };

    // --- 2. GET PLAN DATA FROM URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const planType = urlParams.get('plan');
    const priceUsd = urlParams.get('price');

    const planTitleEl = document.getElementById('displayPlanName');
    const priceEl = document.getElementById('displayPrice');
    const payBtn = document.getElementById('payWithHelio'); // We keep the ID or rename it

    // Renaming button ID for clarity (Optional, change HTML ID if you do this)
    const payBtnNow = document.getElementById('payWithHelio');

    if (planType && priceUsd) {
      planTitleEl.innerText = planType.toUpperCase() + " PLAN";
      priceEl.innerText = `$${priceUsd} / mo`;
    } else {
      planTitleEl.innerText = "ACCESS ERROR";
      payBtnNow.disabled = true;
      payBtnNow.innerText = "Invalid Plan";
    }

    // --- 3. PAYMENT LOGIC ---
    payBtnNow.addEventListener('click', function () {
      const targetLink = PAYMENT_LINKS[planType];

      if (!targetLink || targetLink.includes("PASTE_YOUR")) {
        alert("Configuration Error: Payment link not found for this plan. Please check the code.");
        return;
      }

      // Redirect to NOWPayments
      window.location.href = targetLink;
    });
  