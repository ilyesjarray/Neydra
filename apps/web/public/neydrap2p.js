
        // ==========================================
        // BACKGROUND ANIMATION
        // ==========================================
        const bgContainer = document.getElementById('aero-bg');
        function createOrb() { if (!bgContainer) return; const orb = document.createElement('div'); orb.className = 'orb'; const size = Math.random() * 300 + 50; orb.style.width = size + 'px'; orb.style.height = size + 'px'; orb.style.left = Math.random() * 100 + '%'; orb.style.animationDuration = (Math.random() * 20 + 10) + 's'; orb.style.animationDelay = (Math.random() * 5) + 's'; bgContainer.appendChild(orb); setTimeout(() => { orb.remove(); }, 30000); }
        setInterval(createOrb, 2000); for (let i = 0; i < 5; i++) createOrb();

        // ==========================================
        // NEYDRA P2P SYSTEM - MAJOR LOGIC UPDATE
        // ==========================================
        const SUPABASE_URL = 'https://ybrtpasetldpxanrhsle.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicnRwYXNldGxkcHhhbnJoc2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTgyMjksImV4cCI6MjA4NTg5NDIyOX0.Rdj0S0oGV4HmQDERePPbxjQifJ8euDjOTMfgWtdz7gQ';

        let supabaseClient; let user = null;
        try { supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); } catch (e) { console.error("Supabase Init Error", e); }

        function sfx(t) { const a = document.getElementById('snd-' + t); if (a) { a.currentTime = 0; a.play().catch(() => { }); } }

        function showView(id) {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            document.querySelectorAll('.bottom-nav a').forEach(a => a.classList.remove('active'));
            const map = { 'market-view': 'nav-market', 'create-view': 'nav-create', 'dash-view': 'nav-dash' };
            if (map[id]) document.getElementById(map[id]).classList.add('active');
            sfx('tick'); window.scrollTo(0, 0);
            if (id === 'market-view') loadMarket();
            if (id === 'dash-view') { loadDash(); loadTradeManagement(); }
        }

        // Auth Handlers (Standard)
        document.querySelectorAll('.auth-tab').forEach(t => t.addEventListener('click', function () {
            document.querySelectorAll('.auth-tab').forEach(x => x.classList.remove('active')); this.classList.add('active');
            document.getElementById('login-form').style.display = this.dataset.tab === 'login' ? 'block' : 'none';
            document.getElementById('register-form').style.display = this.dataset.tab === 'register' ? 'block' : 'none';
        }));

        async function handleLogin() {
            const email = document.getElementById('login-email').value; const pass = document.getElementById('login-password').value; const msg = document.getElementById('login-msg');
            if (!email || !pass) { msg.textContent = "Fill all fields"; msg.style.color = "var(--danger)"; return; }
            const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
            if (error) { msg.textContent = error.message; msg.style.color = "var(--danger)"; sfx('alert'); }
            else { msg.textContent = "Success"; msg.style.color = "var(--success)"; sfx('engage'); }
        }

        async function handleRegister() {
            const username = document.getElementById('reg-username').value; const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-password').value; const conf = document.getElementById('reg-confirm').value; const msg = document.getElementById('register-msg');
            if (!username || !email || !pass) { msg.textContent = "Fill all fields"; msg.style.color = "var(--danger)"; return; }
            if (pass !== conf) { msg.textContent = "Passwords mismatch"; msg.style.color = "var(--danger)"; return; }
            const { data, error } = await supabaseClient.auth.signUp({ email, password: pass, options: { data: { full_name: username } } });
            if (error) { msg.textContent = error.message; msg.style.color = "var(--danger)"; sfx('alert'); }
            else { msg.textContent = "Account created! Check email."; msg.style.color = "var(--success)"; sfx('engage'); }
        }

        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') { user = session.user; updatePresence(); showView('market-view'); document.querySelector('.bottom-nav').style.display = 'flex'; }
            if (event === 'SIGNED_OUT') { user = null; showView('auth-view'); }
        });

        async function updatePresence() { if (!user) return; await supabaseClient.from('profiles').update({ last_seen: new Date() }).eq('id', user.id); }
        setInterval(updatePresence, 60000);

        // ==========================================
        // MARKET LOGIC (USDT ONLY)
        // ==========================================
        async function loadMarket() {
            const container = document.getElementById('offers-container');
            container.innerHTML = '<div style={{ "textAlign": "center", "padding": "40px", "color": "var(--text-dim)" }}>Loading...</div>';

            const fiveMinAgo = new Date(new Date().getTime() - 5 * 60000).toISOString();
            const { count: onlineCount } = await supabaseClient.from('profiles').select('*', { count: 'exact', head: true }).gt('last_seen', fiveMinAgo);
            document.getElementById('stat-online').textContent = onlineCount || 0;

            if (user) {
                const { data: p } = await supabaseClient.from('profiles').select('trades_count, rating').eq('id', user.id).single();
                document.getElementById('stat-trades').textContent = p?.trades_count || 0;
                document.getElementById('stat-rating').textContent = p?.rating || '-';
            }

            // Fixed: Crypto is always USDT, just filter by level
            let query = supabaseClient.from('offers').select('*, profiles(username, rating, level, last_seen)').eq('is_active', true);
            const level = document.getElementById('filter-level').value;
            // Note: Client side filter for level simplicity in this demo

            const { data: offers, error } = await query.order('created_at', { ascending: false });
            if (error) { container.innerHTML = 'Error'; return; }

            let filtered = level ? offers.filter(o => o.profiles?.level === level) : offers;
            if (filtered.length === 0) { container.innerHTML = '<div style={{ "textAlign": "center", "padding": "40px", "color": "var(--text-dim)" }}>No offers found.</div>'; return; }

            container.innerHTML = filtered.map(o => {
                const isOnline = o.profiles?.last_seen ? (new Date() - new Date(o.profiles.last_seen) < 300000) : false;
                return `
                <div className="offer-card" onClick="startTrade('${o.id}')">
                    <div className="offer-header">
                        <div className="seller-avatar">${o.profiles?.username ? o.profiles.username[0].toUpperCase() : '?'}</div>
                        <div>
                            <div className="seller-name">${o.profiles?.username || 'Unknown'}</div>
                            <span className="level-badge level-${o.profiles?.level || 'new'}">${(o.profiles?.level || 'new').toUpperCase()}</span>
                        </div>
                        <div className="seller-rating"><i className="ri-star-fill" style={{ "color": "var(--warning)" }}></i> ${o.profiles?.rating || 'NEW'}</div>
                    </div>
                    <div className="offer-body">
                        <div style={{ "fontSize": "22px", "color": "rgba(255,255,255,0.8)" }}>USDT (TRC20)</div>
                        <div className="offer-price">${o.price} <span>TND</span></div>
                        <div style={{ "color": "var(--text-dim)", "fontSize": "13px", "marginBottom": "10px" }}>Available: ${o.quantity} USDT</div>
                        <div className="offer-meta">
                            <div style={{ "fontFamily": "var(--font-code)", "fontSize": "11px", "color": "rgba(255,255,255,0.5)" }}>1 USDT = ${o.price} TND</div>
                            <div className="status-dot ${isOnline ? 'online' : ''}"></div>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }

        document.getElementById('filter-level').addEventListener('change', loadMarket);

        // ==========================================
        // CREATE OFFER (Updated)
        // ==========================================
        async function createOffer() {
            const qty = parseFloat(document.getElementById('offer-quantity').value);
            const price = parseFloat(document.getElementById('offer-price').value);
            const wallet = document.getElementById('offer-wallet').value.trim();
            const notes = document.getElementById('offer-notes').value;
            const msg = document.getElementById('offer-msg');

            if (!qty || !price || !wallet) { msg.textContent = "Fill required fields"; msg.style.color = "var(--danger)"; return; }
            if (qty <= 0 || price <= 0) { msg.textContent = "Numbers must be positive"; msg.style.color = "var(--danger)"; return; }
            if (wallet.length < 20) { msg.textContent = "Invalid TRC20 address"; msg.style.color = "var(--danger)"; return; }

            const { error } = await supabaseClient.from('offers').insert({
                seller_id: user.id,
                crypto_type: 'USDT',
                quantity: qty,
                price,
                wallet_address: wallet,
                notes,
                is_active: true
            });

            if (error) { msg.textContent = error.message; msg.style.color = "var(--danger)"; }
            else { msg.textContent = "Offer Published!"; msg.style.color = "var(--success)"; sfx('engage'); setTimeout(() => showView('market-view'), 1000); }
        }

        // ==========================================
        // TRADE SYSTEM (Secure Flow)
        // ==========================================
        async function startTrade(offerId) {
            const { data: offer } = await supabaseClient.from('offers').select('*, profiles(username)').eq('id', offerId).single();
            if (!offer) return;

            document.getElementById('trade-title').textContent = `BUY USDT`;
            document.getElementById('trade-body').innerHTML = `
                <p style={{ "color": "var(--text-main)" }}>Seller: <span style={{ "color": "#fff" }}>${offer.profiles.username}</span></p>
                <p style={{ "color": "var(--text-main)" }}>Rate: <span style={{ "color": "var(--success)" }}>1 USDT = ${offer.price} TND</span></p>
                <hr style={{ "borderColor": "rgba(255,0,0,0.2)", "margin": "15px 0" }} />
                
                <label>YOUR TRC20 WALLET ADDRESS</label>
                <input type="text" id="buyer-wallet" placeholder="Enter your USDT TRC20 address" />
                
                <label>AMOUNT (TND)</label>
                <input type="number" id="trade-amount" placeholder="Enter TND amount (Multiple of 5)" step="5" min="5" onChange="calculateCards(this.value, ${offer.price})" />
                
                <div style={{ "background": "rgba(255,0,0,0.1)", "padding": "10px", "borderRadius": "8px", "marginTop": "10px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "color": "#fff" }}>
                        <span>USDT to receive:</span>
                        <span id="calc-usdt">0.00</span>
                    </div>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "color": "var(--danger)" }}>
                        <span>Cards Required (5 TND each):</span>
                        <span id="calc-cards">0</span>
                    </div>
                </div>

                <div id="card-inputs-container" style={{ "marginTop": "15px" }}></div>

                <button className="btn" onClick="submitTrade('${offer.id}')" id="submit-trade-btn" disabled>ENTER CARD CODES FIRST</button>
            `;
            openModal('trade-modal');
        }

        function calculateCards(tnd, rate) {
            const amount = parseFloat(tnd);
            if (amount <= 0 || amount % 5 !== 0) {
                document.getElementById('calc-cards').textContent = "0";
                document.getElementById('calc-usdt').textContent = "0.00";
                document.getElementById('card-inputs-container').innerHTML = '<p style={{ "color": "var(--danger)", "fontSize": "12px" }}>Amount must be a multiple of 5</p>';
                document.getElementById('submit-trade-btn').disabled = true;
                return;
            }

            const cardsNeeded = amount / 5;
            const usdt = (amount / rate).toFixed(2);

            document.getElementById('calc-cards').textContent = cardsNeeded;
            document.getElementById('calc-usdt').textContent = usdt;
            document.getElementById('submit-trade-btn').disabled = false;

            // Generate Card Inputs
            let html = '';
            for (let i = 0; i < cardsNeeded; i++) {
                html += `
                <div className="card-input-group">
                    <input type="text" className="card-code" id="card-${i}" maxlength="14" placeholder="Card ${i + 1} (14 digits)" onChange="validateCard(${i})" />
                    <span className="card-status" id="card-status-${i}"></span>
                </div>`;
            }
            document.getElementById('card-inputs-container').innerHTML = html;
        }

        function validateCard(index) {
            const input = document.getElementById(`card-${index}`);
            const status = document.getElementById(`card-status-${index}`);
            if (input.value.length === 14 && /^\d+$/.test(input.value)) {
                status.innerHTML = '<i className="ri-check-line" style={{ "color": "var(--success)" }}></i>';
            } else {
                status.innerHTML = '<i className="ri-close-line" style={{ "color": "var(--danger)" }}></i>';
            }
        }

        async function submitTrade(offerId) {
            const buyerWallet = document.getElementById('buyer-wallet').value.trim();
            const amount = parseFloat(document.getElementById('trade-amount').value);

            if (!buyerWallet || buyerWallet.length < 20) { toast('error', 'Invalid Wallet Address'); return; }

            // Gather Cards
            const cardInputs = document.querySelectorAll('.card-code');
            const cards = [];
            let valid = true;
            cardInputs.forEach(input => { if (input.value.length === 14) cards.push(input.value); else valid = false; });

            if (!valid) { toast('error', 'Invalid Card Codes'); return; }

            // Fraud Check: Duplicate Cards in DB
            const { data: existing } = await supabaseClient.from('trades').select('id').contains('card_codes', [cards[0]]);
            if (existing && existing.length > 0) { toast('error', 'Duplicate Card Detected'); sfx('alert'); return; }

            // Submit
            const { data: offer } = await supabaseClient.from('offers').select('seller_id, price').eq('id', offerId).single();

            const { error } = await supabaseClient.from('trades').insert({
                buyer_id: user.id,
                seller_id: offer.seller_id,
                offer_id: offerId,
                amount_tnd: amount,
                card_codes: cards,
                buyer_wallet: buyerWallet,
                status: 'pending',
                rate_at_time: offer.price
            });

            if (error) { toast('error', error.message); }
            else {
                toast('success', 'Trade Submitted', 'Cards sent securely.');
                sfx('engage');
                closeModal('trade-modal');
                // Notify Seller (simple alert)
                addNotification(offer.seller_id, 'NEW TRADE', `${user.email} wants to buy USDT. Check dashboard.`);
            }
        }

        // ==========================================
        // SECURITY: SELLER MANAGEMENT
        // ==========================================
        async function loadTradeManagement() {
            const container = document.getElementById('trade-management-list');
            // Get pending trades where I am the seller
            const { data: trades } = await supabaseClient.from('trades').select('*, profiles(username), offers(crypto_type)').eq('seller_id', user.id).eq('status', 'pending');

            if (!trades || trades.length === 0) {
                container.innerHTML = '<p style={{ "color": "var(--text-dim)", "textAlign": "center" }}>No pending trades.</p>';
                return;
            }

            container.innerHTML = trades.map(t => `
                <div style={{ "background": "rgba(0,0,0,0.3)", "padding": "15px", "borderRadius": "8px", "marginBottom": "10px", "border": "1px solid rgba(255,0,0,0.2)" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "marginBottom": "10px" }}>
                        <span style={{ "color": "#fff" }}>Buyer: ${t.profiles?.username || 'Unknown'}</span>
                        <span style={{ "color": "var(--success)" }}>${t.amount_tnd} TND</span>
                    </div>
                    <p style={{ "fontSize": "11px", "color": "var(--text-dim)", "marginBottom": "5px" }}>Cards: ${t.card_codes ? t.card_codes.join(', ') : 'N/A'}</p>
                    <p style={{ "fontSize": "11px", "color": "var(--warning)", "marginBottom": "10px" }}>To Wallet: ${t.buyer_wallet}</p>
                    <div style={{ "display": "flex", "gap": "10px" }}>
                        <button className="btn btn-sm btn-success" onClick="releaseUSDT('${t.id}')">RELEASE USDT</button>
                        <button className="btn btn-sm btn-danger" onClick="disputeTrade('${t.id}')">DISPUTE</button>
                    </div>
                </div>
            `).join('');
        }

        async function releaseUSDT(tradeId) {
            // Seller confirms they sent crypto
            openReleaseModal(tradeId);
        }

        function openReleaseModal(tradeId) {
            document.getElementById('release-body').innerHTML = `
                <p style={{ "color": "var(--text-main)" }}>Confirm that you have sent the USDT to the buyer's wallet.</p>
                <label>TRANSACTION HASH (TXID)</label>
                <input type="text" id="release-txid" placeholder="Paste TX Hash here" />
                <button className="btn btn-success" onClick="confirmRelease('${tradeId}')">CONFIRM RELEASE</button>
            `;
            openModal('release-modal');
        }

        async function confirmRelease(tradeId) {
            const txid = document.getElementById('release-txid').value.trim();
            if (!txid) { toast('error', 'TX Hash required'); return; }

            const { error } = await supabaseClient.from('trades').update({
                status: 'completed',
                seller_tx_hash: txid
            }).eq('id', tradeId);

            if (error) { toast('error', error.message); }
            else {
                toast('success', 'Trade Completed', 'USDT Released.');
                closeModal('release-modal');
                loadTradeManagement();
            }
        }

        async function disputeTrade(tradeId) {
            if (confirm("Are you sure? This will flag the trade for admin review.")) {
                await supabaseClient.from('trades').update({ status: 'disputed' }).eq('id', tradeId);
                toast('warning', 'Dispute Filed', 'Admin will review.');
                loadTradeManagement();
            }
        }

        // ==========================================
        // STORE SYSTEM (Redirect Logic)
        // ==========================================
        function openStoreModal() {
            if (!user) return;
            openModal('store-modal');
        }

        async function initiateStorePayment() {
            const name = document.getElementById('store-name').value;
            const desc = document.getElementById('store-desc').value;
            if (!name || !desc) { toast('error', 'Fill all fields'); return; }

            // Save pending store request to local storage to retrieve after payment (simplified)
            // In a real system, you would create a 'store_requests' row with status 'pending'
            localStorage.setItem('pending_store', JSON.stringify({ name, desc }));

            // Redirect to payment
            window.location.href = "https://nowpayments.io/payment/?iid=5348461549";
        }

        // ==========================================
        // DASHBOARD & UTILS
        // ==========================================
        async function loadDash() {
            const { data: p } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single();
            document.getElementById('profile-info').innerHTML = `
                <div className="seller-avatar" style={{ "width": "70px", "height": "70px", "margin": "0 auto", "fontSize": "24px" }}>${p?.username ? p.username[0].toUpperCase() : '?'}</div>
                <h2 style={{ "color": "#fff", "margin": "15px 0 5px" }}>${p?.username}</h2>
                <span className="level-badge level-${p?.level}">${p?.level?.toUpperCase()}</span>
            `;

            // Offers
            const { data: offers } = await supabaseClient.from('offers').select('*').eq('seller_id', user.id);
            document.getElementById('my-offers-list').innerHTML = offers?.length ? offers.map(o => `
                <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "12px 0", "borderBottom": "1px solid rgba(255,0,0,0.1)" }}>
                    <span style={{ "color": "#fff" }}>USDT</span>
                    <span style={{ "color": "var(--success)" }}>${o.quantity}</span>
                </div>
            `).join('') : '<p style={{ "color": "var(--text-dim)" }}>No offers</p>';

            // History
            const { data: trades } = await supabaseClient.from('trades').select('*').or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`).order('created_at', { ascending: false }).limit(5);
            document.getElementById('trade-history-list').innerHTML = trades?.length ? trades.map(t => `
                <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "12px 0", "borderBottom": "1px solid rgba(255,0,0,0.1)" }}>
                    <span style={{ "color": "var(--text-dim)" }}>#${t.id.substring(0, 8)}</span>
                    <span style={{ "color": "var(--success)" }}>${t.amount_tnd} TND</span>
                </div>
            `).join('') : '<p style={{ "color": "var(--text-dim)" }}>No trades</p>';

            // Store check
            if (p?.store_name) {
                document.getElementById('store-info').innerHTML = `<p style={{ "color": "#fff" }}>${p.store_name}</p><p style={{ "color": "var(--text-dim)", "fontSize": "12px" }}>${p.store_desc}</p>`;
                document.getElementById('store-btn').style.display = 'none';
            } else {
                document.getElementById('store-info').innerHTML = '<p style={{ "color": "var(--text-dim)" }}>No store created</p>';
                document.getElementById('store-btn').style.display = 'block';
            }
        }

        async function openNotifPanel() {
            document.getElementById('notif-panel').classList.add('open'); document.getElementById('overlay').classList.add('active');
            const { data: n } = await supabaseClient.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            document.getElementById('notif-list').innerHTML = n?.length ? n.map(x => `
                <div className="notification-item ${x.is_read ? '' : 'unread'}" onClick="readNotif('${x.id}')">
                    <div className="notif-title">${x.message.split(':')[0]}</div>
                    <div className="notif-desc">${x.message.split(':')[1] || ''}</div>
                </div>
            `).join('') : '<p style={{ "padding": "20px", "textAlign": "center", "color": "var(--text-dim)" }}>None</p>';
        }

        async function readNotif(id) { await supabaseClient.from('notifications').update({ is_read: true }).eq('id', id); updateNotifBadge(); }

        async function updateNotifBadge() {
            const { count } = await supabaseClient.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false);
            const b = document.getElementById('notif-badge');
            if (count && count > 0) { b.textContent = count; b.style.display = 'flex'; } else b.style.display = 'none';
        }

        function openModal(id) { document.getElementById(id).classList.add('open'); document.getElementById('overlay').classList.add('active'); sfx('tick'); }
        function closeModal(id) { document.getElementById(id).classList.remove('open'); document.getElementById('overlay').classList.remove('active'); }
        function closeAllModals() { closeModal('store-modal'); closeModal('trade-modal'); closeModal('release-modal'); closeNotifPanel(); }
        function closeNotifPanel() { document.getElementById('notif-panel').classList.remove('open'); document.getElementById('overlay').classList.remove('active'); }

        function toast(type, title, desc) {
            const c = document.getElementById('toast-cont');
            const t = document.createElement('div');
            t.className = `toast ${type}`;
            t.innerHTML = `<div className="toast-icon"><i className="ri-checkbox-circle-line"></i></div><div className="toast-content"><div className="toast-title">${title}</div><div className="toast-desc">${desc || ''}</div></div>`;
            c.appendChild(t); sfx('alert');
            setTimeout(() => t.remove(), 4000);
        }

        async function checkSession() {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) { user = session.user; updatePresence(); showView('market-view'); document.querySelector('.bottom-nav').style.display = 'flex'; }
            else { showView('auth-view'); }
        }
        checkSession();

    