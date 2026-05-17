
    // ========================================
    // DATA CONFIGURATION
    // ========================================

    // ========================================
    // PAYMENT & DOWNLOAD LINKS - EDIT THESE FOR EACH ITEM
    // ========================================

    // Mystery Shop Items - Add your payment links and download .rar files
    const mysteryItems = [
      { id: 1, name: "ITEM 1", oldPrice: 0, newPrice: 0, discount: 90, paymentLink: "/welcome/nexhub", downloadFile: "downloads/item1.rar" },
      { id: 2, name: "ITEM 2", oldPrice: 0, newPrice: 0, discount: 90, paymentLink: "/welcome/nexhub", downloadFile: "downloads/item2.rar" },
      { id: 3, name: "ITEM 3", oldPrice: 0, newPrice: 0, discount: 90, paymentLink: "/welcome/nexhub", downloadFile: "downloads/item3.rar" },
      { id: 4, name: "ITEM 4", oldPrice: 0, newPrice: 0, discount: 90, paymentLink: "/welcome/nexhub", downloadFile: "downloads/item4.rar" },
      { id: 5, name: "ITEM 5", oldPrice: 0, newPrice: 0, discount: 90, paymentLink: "/welcome/nexhub", downloadFile: "downloads/item5.rar" },
      { id: 6, name: "ITEM 6", oldPrice: 0, newPrice: 0, discount: 90, paymentLink: "/welcome/nexhub", downloadFile: "downloads/item6.rar" }
    ];

    // Main Products - Add your payment links and download .rar files
    const products = [
      { id: 1, name: "AI-Driven Predictive Analytics Engine", price: 180, category: "Category1", paymentLink: "https://nowpayments.io/payment/?iid=5243638577", downloadFile: "downloads/product1.rar" },
      { id: 2, name: "Institutional Liquidity Decoder", price: 480, category: "Category1", paymentLink: "https://nowpayments.io/payment/?iid=5721330888", downloadFile: "downloads/product2.rar" },
      { id: 3, name: "Real-Time NLP Sentiment Analyzer", price: 1080, category: "Category1", paymentLink: "https://nowpayments.io/payment/?iid=4844348279", downloadFile: "downloads/product3.rar" },
      { id: 4, name: "PRODUCT 4", price: 0, category: "Category2", paymentLink: "/welcome/nexhub", downloadFile: "downloads/product4.rar" },
      { id: 5, name: "PRODUCT 5", price: 0, category: "Category2", paymentLink: "/welcome/nexhub", downloadFile: "downloads/product5.rar" },
      { id: 6, name: "PRODUCT 6", price: 0, category: "Category2", paymentLink: "/welcome/nexhub", downloadFile: "downloads/product6.rar" },
      { id: 7, name: "PRODUCT 7", price: 0, category: "Category3", paymentLink: "/welcome/nexhub", downloadFile: "downloads/product7.rar" },
      { id: 8, name: "PRODUCT 8", price: 0, category: "Category3", paymentLink: "/welcome/nexhub", downloadFile: "downloads/product8.rar" },
      { id: 9, name: "PRODUCT 9", price: 0, category: "Category3", paymentLink: "/welcome/nexhub", downloadFile: "downloads/product9.rar" },
      { id: 10, name: "PRODUCT 10", price: 0, category: "Category4", paymentLink: "/welcome/nexhub", downloadFile: "downloads/product10.rar" }
    ];

    // ========================================
    // STATE
    // ========================================
    let currentCategory = "all";
    let introCompleted = false;
    let pendingPurchase = null;
    let notificationInterval = null;

    // ========================================
    // DOM REFERENCES
    // ========================================
    const mysteryGrid = document.getElementById('mystery-items-grid');
    const productGrid = document.getElementById('main-product-grid');
    const bgMusic = document.getElementById('bg-music');
    const introOverlay = document.getElementById('intro-overlay');
    const introContainer = document.getElementById('intro-guide-container');
    const introText = document.getElementById('intro-text');
    const introCursor = document.getElementById('intro-cursor');
    const introSound = document.getElementById('intro-sound');
    const mainContent = document.getElementById('main-content');
    const fashionFeaturedEl = document.getElementById('fashion-featured');
    const warningPopup = document.getElementById('warning-popup');
    const downloadPopup = document.getElementById('download-popup');
    const downloadItemName = document.getElementById('download-item-name');
    const notificationPopup = document.getElementById('notification-popup');
    const notificationTitle = document.getElementById('notification-title');
    const notificationText = document.getElementById('notification-text');
    const alertSound = document.getElementById('alert-sound');

    // ========================================
    // PAYMENT VERIFICATION SYSTEM
    // ========================================

    // Check URL parameters on page load for payment return
    function checkPaymentReturn() {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const itemId = urlParams.get('item_id');
      const itemType = urlParams.get('item_type');

      if (paymentStatus === 'success' && itemId) {
        // Payment successful - trigger download
        let item = null;
        if (itemType === 'mystery') {
          item = mysteryItems.find(i => i.id === parseInt(itemId));
        } else if (itemType === 'product') {
          item = products.find(i => i.id === parseInt(itemId));
        } else if (itemType === 'fashion') {
          item = fashionFeatured;
        }

        if (item) {
          triggerDownload(item);
        }

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentStatus === 'cancel' || paymentStatus === 'failed') {
        // Payment failed/cancelled - show warning
        showWarningPopup();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // Check localStorage for pending purchase
    function checkPendingPurchase() {
      const pending = localStorage.getItem('pendingPurchase');
      if (pending) {
        const purchaseData = JSON.parse(pending);
        const timeElapsed = Date.now() - purchaseData.timestamp;

        // If more than 10 minutes passed, consider it abandoned
        if (timeElapsed > 600000) {
          localStorage.removeItem('pendingPurchase');
          showWarningPopup();
        }
      }
    }

    // Start purchase process
    function startPurchase(item, type, id) {
      // Store pending purchase
      const purchaseData = {
        item: item,
        type: type,
        id: id,
        timestamp: Date.now()
      };
      localStorage.setItem('pendingPurchase', JSON.stringify(purchaseData));

      // Build return URL
      const returnUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}?payment=success&item_id=${id}&item_type=${type}`);
      const cancelUrl = encodeURIComponent(`${window.location.origin}${window.location.pathname}?payment=cancel`);

      // Redirect to payment
      window.location.href = item.paymentLink;
    }

    // Trigger file download
    function triggerDownload(item) {
      localStorage.removeItem('pendingPurchase');

      // Show download popup
      downloadItemName.textContent = `Downloading: ${item.name}`;
      downloadPopup.classList.add('active');

      // Trigger actual download
      const link = document.createElement('a');
      link.href = item.downloadFile;
      link.download = item.downloadFile.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Hide popup after 3 seconds
      setTimeout(() => {
        downloadPopup.classList.remove('active');
      }, 5000);
    }

    // Show warning popup
    function showWarningPopup() {
      localStorage.removeItem('pendingPurchase');
      warningPopup.classList.add('active');
    }

    // Close warning popup
    function closeWarningPopup() {
      warningPopup.classList.remove('active');
    }

    // ========================================
    // RANDOM NOTIFICATION SYSTEM
    // ========================================

    const notificationTemplates = [
      { title: "🍒 NEW PURCHASE!", template: (num, item) => `User #${num} has already bought the <span>${item}</span>!` },
      { title: "🍒 HOT ITEM!", template: (num, item) => `<span>${item}</span> is trending! ${num} sold today!` },
      { title: "🍒 LIMITED STOCK!", template: (num, item) => `Only ${num} left of <span>${item}</span>! Hurry!` },
      { title: "🍒 EXCLUSIVE DEAL!", template: (num, item) => `Try <span>${item}</span> now at special price!` },
      { title: "🍒 BESTSELLER!", template: (num, item) => `<span>${item}</span> - ${num} people bought this!` },
      { title: "🍒 TOP RATED!", template: (num, item) => `<span>${item}</span> has ${num}% satisfaction rate!` },
      { title: "🎁 SPECIAL OFFER!", template: (num, item) => `Get <span>${item}</span> with instant delivery!` },
      { title: "🍒 SELLING FAST!", template: (num, item) => `${num} users viewing <span>${item}</span> right now!` }
    ];

    const notificationPositions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];

    function getRandomItem() {
      const allItems = [
        ...mysteryItems.map(i => i.name),
        ...products.map(i => i.name),
        fashionFeatured.name
      ];
      return allItems[Math.floor(Math.random() * allItems.length)];
    }

    function showRandomNotification() {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      const randomItem = getRandomItem();
      const position = notificationPositions[Math.floor(Math.random() * notificationPositions.length)];

      // Set position
      notificationPopup.className = `notification-popup ${position}`;

      // Set content
      notificationTitle.textContent = template.title;
      notificationText.innerHTML = template.template(randomNum, randomItem);

      // Play sound
      alertSound.currentTime = 0;
      alertSound.play().catch(() => { });

      // Show notification
      notificationPopup.classList.add('show');

      // Auto hide after 5 seconds
      setTimeout(() => {
        closeNotification();
      }, 5000);
    }

    function closeNotification() {
      notificationPopup.classList.remove('show');
      notificationPopup.classList.add('hide');
      setTimeout(() => {
        notificationPopup.classList.remove('hide');
      }, 500);
    }

    function startNotificationSystem() {
      // Show first notification after 15 seconds
      setTimeout(() => {
        showRandomNotification();
      }, 15000);

      // Then show random notifications every 20-40 seconds
      notificationInterval = setInterval(() => {
        const delay = Math.random() * 20000 + 20000; // 20-40 seconds
        setTimeout(showRandomNotification, delay);
      }, 25000);
    }

    // ========================================
    // INTRO SCENE
    // ========================================
    const introMessage = "Welcome to our Neydra shop... We hope you find what you are looking for...";
    let charIndex = 0;
    const typingSpeed = 100;

    function startIntro() {
      // Start with blur
      introOverlay.classList.add('blur-active');

      // Play sound
      const playSound = () => {
        introSound.play().catch(() => { });
      };

      document.body.addEventListener('click', playSound, { once: true });

      setTimeout(() => {
        introContainer.classList.add('visible');
        playSound();

        setTimeout(() => {
          typeWriter();
        }, 500);
      }, 1000);
    }

    function typeWriter() {
      if (charIndex < introMessage.length) {
        introText.textContent += introMessage.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        introCursor.classList.add('hidden');

        setTimeout(() => {
          fadeOutIntro();
        }, 8000);
      }
    }

    function fadeOutIntro() {
      introOverlay.classList.add('fade-out');

      setTimeout(() => {
        introOverlay.classList.add('hidden');
        introOverlay.classList.remove('blur-active', 'fade-out');
        mainContent.classList.add('visible');
        introCompleted = true;

        // Start background music
        bgMusic.play().catch(() => { });

        // Start notification system
        startNotificationSystem();

        // Check for pending purchases
        checkPendingPurchase();
      }, 1000);
    }

    // ========================================
    // RENDER FUNCTIONS
    // ========================================

    function renderMysteryItems() {
      mysteryGrid.innerHTML = mysteryItems.map(item => `
        <div className="mystery-item" onClick="startPurchase(mysteryItems[${item.id - 1}], 'mystery', ${item.id})">
          <div className="discount-tag">${item.discount}%</div>
          <img src="/assets/mystery_item_${item.id}.png" alt="${item.name}" className="mystery-item-img" 
               onerror="this.src='https://placehold.co/60x60/1a0000/ff0000?text=${item.id}'" />
          <div className="mystery-item-name">${item.name}</div>
          <div className="mystery-item-price">
            <span className="price-old">${item.oldPrice}</span>
            <span className="price-diamond">${item.newPrice}</span>
          </div>
        </div>
      `).join('');
    }

    function renderProducts() {
      const filtered = currentCategory === "all"
        ? products
        : products.filter(p => p.category.toLowerCase() === currentCategory);

      productGrid.innerHTML = filtered.map((item, index) => `
        <div className="product-card" onClick="startPurchase(products[${item.id - 1}], 'product', ${item.id})">
          <div className="timer-badge">
            <div className="timer-dot"></div>
            <span>NEW</span>
          </div>
          <div className="product-img-box">
            <img src="/assets/product${item.id}.png" alt="${item.name}"
                 onerror="this.src='https://placehold.co/120x120/1a0000/ff0000?text=${item.name}'" />
          </div>
          <div className="product-info">
            <div className="product-category">${item.category}</div>
            <h3 className="product-name">${item.name}</h3>
            <div className="product-price-row">
              <span className="product-price">$${item.price}</span>
              <button className="product-buy-btn" onClick="event.stopPropagation(); startPurchase(products[${item.id - 1}], 'product', ${item.id})">BUY</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Setup fashion featured click
    function setupFashionFeatured() {
      fashionFeaturedEl.onclick = () => {
        startPurchase(fashionFeatured, 'fashion', 'featured');
      };
    }

    // ========================================
    // CATEGORY FILTERING
    // ========================================
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.dataset.category;
        renderProducts();
      });
    });

    // ========================================
    // BACKGROUND ANIMATION (GALAXY)
    // ========================================
    const canvas = document.getElementById('galaxy-bg');
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    const stars = [];
    const nebulaClouds = [];

    function initCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      stars.length = 0;
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random()
        });
      }

      nebulaClouds.length = 0;
      for (let i = 0; i < 5; i++) {
        nebulaClouds.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.max(100, Math.random() * 300 + 100),
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3
        });
      }
    }

    function animateCanvas() {
      ctx.fillStyle = '#050000';
      ctx.fillRect(0, 0, width, height);

      nebulaClouds.forEach(cloud => {
        cloud.x += cloud.speedX;
        cloud.y += cloud.speedY;

        if (cloud.x < -cloud.radius) cloud.x = width + cloud.radius;
        if (cloud.x > width + cloud.radius) cloud.x = -cloud.radius;
        if (cloud.y < -cloud.radius) cloud.y = height + cloud.radius;
        if (cloud.y > height + cloud.radius) cloud.y = -cloud.radius;

        const gradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.radius
        );
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.08)');
        gradient.addColorStop(0.5, 'rgba(139, 0, 0, 0.04)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        star.opacity += (Math.random() - 0.5) * 0.05;
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 0, ${star.opacity})`;
        ctx.fill();

        if (Math.random() > 0.95) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff0000';
        }
      });

      ctx.shadowBlur = 0;
      requestAnimationFrame(animateCanvas);
    }

    // ========================================
    // INITIALIZE
    // ========================================
    window.addEventListener('resize', initCanvas);

    // Initial render
    initCanvas();
    animateCanvas();
    renderMysteryItems();
    renderProducts();
    setupFashionFeatured();

    // Check for payment return on page load
    checkPaymentReturn();

    // Start intro scene
    window.addEventListener('load', () => {
      startIntro();
    });
  