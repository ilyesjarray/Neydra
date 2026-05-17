
        /**
         * =========================================
         * GLOBAL NEYDRA NEWS v2.0
         * Three.js Earth + Free Multi-Source News
         * Live TV + Urgent Bar + Big Image Cards
         * =========================================
         * /

        // =====================================================
        // CONFIGURATION
        // =====================================================

        const TV_CHANNELS = [
            { name: 'AJ EN', label: 'Al Jazeera English', src: 'https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg&autoplay=1&mute=1&playsinline=1' },
            { name: 'FR24 EN', label: 'France 24 English', src: 'https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg&autoplay=1&mute=1&playsinline=1' },
            { name: 'DW', label: 'DW News', src: 'https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1a-MRaM-28NA&autoplay=1&mute=1&playsinline=1' },
            { name: 'AJ AR', label: 'Al Jazeera Arabic', src: 'https://www.youtube.com/embed/live_stream?channel=UCBvqHMn1Gj1aA_fXleH-MBw&autoplay=1&mute=1&playsinline=1' }
        ];

        const RSS_FEEDS = {
            en: [
                { name: 'BBC', url: 'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/rss.xml' },
                { name: 'Al Jazeera', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.com/xml/rss/all.xml' },
                { name: 'CNN', url: 'https://api.rss2json.com/v1/api.json?rss_url=http://rss.cnn.com/rss/edition.rss' },
                { name: 'Reuters', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.reutersagency.com/feed/' },
                { name: 'DW', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.dw.com/rdf/rss-en-all' },
            ],
            fr: [
                { name: 'France 24', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.france24.com/fr/rss' },
                { name: 'RFI', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.rfi.fr/fr/rss' },
            ],
            ar: [
                { name: 'Al Jazeera AR', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.aljazeera.net/aljazeerarss/a7c186be-1baa-4bd4-9d80-a84db769f779/73d0e1b4-532f-45ef-b135-bfdff8b8cab9' },
            ],
            es: [
                { name: 'BBC Mundo', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/mundo/rss.xml' },
            ],
            de: [
                { name: 'DW DE', url: 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.dw.com/rdf/rss-de-all' },
            ]
        };

        const URGENT_KEYWORDS = ['breaking', 'urgent', 'just in', 'developing', 'live updates', 'flash', 'alert', 'emergency', 'killed', 'attack', 'explosion', 'earthquake', 'war', 'crisis'];

        // =====================================================
        // STATE
        // =====================================================
        let API_URL = null; // Legacy backend URL
        let watchedCountries = [];
        let categories = ['world'];
        let breakingOnly = false;
        let currentArticles = [];
        let alertTimeout = null;
        let lastBreakingId = null;
        let currentLang = 'en';
        let currentTVChannel = 0;
        let soundEnabled = true;
        let earthMode = 'textured'; // 'textured' or 'wireframe'
        let lastUrgentTitle = '';
        let newsRefreshInterval = null;
        let allFetchedArticles = [];
        let activeSources = 0;

        // Three.js variables
        let scene, camera, renderer, earth, atmosphere;
        let texturedEarth = null; // textured sphere mesh
        let wireframeGroup = null; // wireframe grid lines group
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let autoRotate = true;
        let earthMarkers = [];
        let threeInitialized = false;

        // Country coordinates
        window.countryCoords = {
            "united states": { "lat": 38.0, "lon": -97.0, "code": "US" },
            "usa": { "lat": 38.0, "lon": -97.0, "code": "US" },
            "america": { "lat": 38.0, "lon": -97.0, "code": "US" },
            "china": { "lat": 35.0, "lon": 105.0, "code": "CN" },
            "russia": { "lat": 60.0, "lon": 100.0, "code": "RU" },
            "japan": { "lat": 36.0, "lon": 138.0, "code": "JP" },
            "germany": { "lat": 51.0, "lon": 9.0, "code": "DE" },
            "france": { "lat": 46.0, "lon": 2.0, "code": "FR" },
            "united kingdom": { "lat": 54.0, "lon": -2.0, "code": "GB" },
            "uk": { "lat": 54.0, "lon": -2.0, "code": "GB" },
            "britain": { "lat": 54.0, "lon": -2.0, "code": "GB" },
            "india": { "lat": 20.0, "lon": 77.0, "code": "IN" },
            "brazil": { "lat": -10.0, "lon": -55.0, "code": "BR" },
            "australia": { "lat": -25.0, "lon": 135.0, "code": "AU" },
            "canada": { "lat": 56.0, "lon": -106.0, "code": "CA" },
            "south korea": { "lat": 37.0, "lon": 127.0, "code": "KR" },
            "korea": { "lat": 37.0, "lon": 127.0, "code": "KR" },
            "italy": { "lat": 42.0, "lon": 12.0, "code": "IT" },
            "spain": { "lat": 40.0, "lon": -4.0, "code": "ES" },
            "mexico": { "lat": 23.0, "lon": -102.0, "code": "MX" },
            "indonesia": { "lat": -5.0, "lon": 120.0, "code": "ID" },
            "turkey": { "lat": 39.0, "lon": 35.0, "code": "TR" },
            "saudi arabia": { "lat": 25.0, "lon": 45.0, "code": "SA" },
            "iran": { "lat": 32.0, "lon": 53.0, "code": "IR" },
            "israel": { "lat": 31.0, "lon": 35.0, "code": "IL" },
            "egypt": { "lat": 26.0, "lon": 30.0, "code": "EG" },
            "south africa": { "lat": -29.0, "lon": 24.0, "code": "ZA" },
            "nigeria": { "lat": 10.0, "lon": 8.0, "code": "NG" },
            "ukraine": { "lat": 49.0, "lon": 32.0, "code": "UA" },
            "poland": { "lat": 52.0, "lon": 20.0, "code": "PL" },
            "argentina": { "lat": -34.0, "lon": -64.0, "code": "AR" },
            "pakistan": { "lat": 30.0, "lon": 70.0, "code": "PK" },
            "iraq": { "lat": 33.0, "lon": 44.0, "code": "IQ" },
            "syria": { "lat": 35.0, "lon": 39.0, "code": "SY" },
            "tunisia": { "lat": 34.0, "lon": 9.0, "code": "TN" },
            "morocco": { "lat": 32.0, "lon": -6.0, "code": "MA" },
            "algeria": { "lat": 28.0, "lon": 2.0, "code": "DZ" },
            "uae": { "lat": 24.0, "lon": 54.0, "code": "AE" },
            "dubai": { "lat": 25.0, "lon": 55.0, "code": "AE" },
            "qatar": { "lat": 25.0, "lon": 51.0, "code": "QA" },
            "greece": { "lat": 39.0, "lon": 22.0, "code": "GR" },
            "thailand": { "lat": 15.0, "lon": 100.0, "code": "TH" },
            "vietnam": { "lat": 14.0, "lon": 108.0, "code": "VN" },
            "philippines": { "lat": 13.0, "lon": 122.0, "code": "PH" },
            "new zealand": { "lat": -41.0, "lon": 174.0, "code": "NZ" },
            "kenya": { "lat": -1.0, "lon": 38.0, "code": "KE" },
            "afghanistan": { "lat": 34.0, "lon": 66.0, "code": "AF" },
            "gaza": { "lat": 31.0, "lon": 34.0, "code": "PS" },
            "palestine": { "lat": 31.0, "lon": 35.0, "code": "PS" },
            "lebanon": { "lat": 33.8, "lon": 35.8, "code": "LB" },
            "jordan": { "lat": 31.0, "lon": 36.0, "code": "JO" },
            "libya": { "lat": 27.0, "lon": 17.0, "code": "LY" },
            "sudan": { "lat": 15.0, "lon": 30.0, "code": "SD" },
            "yemen": { "lat": 15.5, "lon": 48.0, "code": "YE" },
            "colombia": { "lat": 4.0, "lon": -72.0, "code": "CO" },
            "venezuela": { "lat": 7.0, "lon": -66.0, "code": "VE" },
            "chile": { "lat": -33.0, "lon": -70.0, "code": "CL" },
            "peru": { "lat": -10.0, "lon": -76.0, "code": "PE" },
            "ethiopia": { "lat": 9.0, "lon": 38.7, "code": "ET" },
            "somalia": { "lat": 6.0, "lon": 46.0, "code": "SO" },
            "myanmar": { "lat": 21.0, "lon": 96.0, "code": "MM" },
            "taiwan": { "lat": 23.5, "lon": 121.0, "code": "TW" },
            "netherlands": { "lat": 52.0, "lon": 5.0, "code": "NL" },
            "belgium": { "lat": 50.8, "lon": 4.3, "code": "BE" },
            "sweden": { "lat": 62.0, "lon": 15.0, "code": "SE" },
            "norway": { "lat": 62.0, "lon": 10.0, "code": "NO" },
            "finland": { "lat": 64.0, "lon": 26.0, "code": "FI" },
            "switzerland": { "lat": 47.0, "lon": 8.0, "code": "CH" },
            "austria": { "lat": 47.3, "lon": 13.3, "code": "AT" },
            "portugal": { "lat": 39.4, "lon": -8.2, "code": "PT" },
            "cuba": { "lat": 22.0, "lon": -80.0, "code": "CU" },
            "north korea": { "lat": 40.0, "lon": 127.0, "code": "KP" }
        };

        // =====================================================
        // SOUND SYSTEM
        // =====================================================
        function sfx(type) {
            if (!soundEnabled) return;
            const el = document.getElementById('snd-' + type);
            if (el) { el.currentTime = 0; el.play().catch(function () { }); }
        }

        function playUrgentSound() {
            if (!soundEnabled) return;
            const el = document.getElementById('snd-urgent');
            if (el) { el.currentTime = 0; el.play().catch(function () { }); }
        }

        function copyCommand(text) {
            navigator.clipboard.writeText(text).then(function () {
                console.log("Command copied: " + text);
            }).catch(function (err) {
                console.error('Failed to copy: ', err);
            });
        }

        // =====================================================
        // TEXTURED THREE.JS EARTH (Primary Mode)
        // =====================================================
        function initTexturedEarth() {
            if (threeInitialized) return;
            threeInitialized = true;

            var container = document.getElementById('earth-canvas');
            var width = container.clientWidth || 800;
            var height = container.clientHeight || 600;

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);

            camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            camera.position.z = 3;

            renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: false });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Create the earth group (shared between textured and wireframe)
            earth = new THREE.Group();
            scene.add(earth);

            // --- TEXTURED EARTH ---
            var texturedGeometry = new THREE.SphereGeometry(1, 64, 64);
            var textureLoader = new THREE.TextureLoader();
            var earthTexture = textureLoader.load(
                '../../assets/earth.png',
                function (texture) { console.log('[NEYDRA] Earth texture loaded successfully'); },
                undefined,
                function (err) { console.error('[NEYDRA] Failed to load earth texture (likely CORS on file://). Falling back to base color.', err); }
            );
            var texturedMaterial = new THREE.MeshPhongMaterial({
                map: earthTexture,
                color: 0xaa0000, // Fallback base color if texture fails
                bumpScale: 0.05,
                specular: new THREE.Color(0x330000),
                shininess: 5
            });
            texturedEarth = new THREE.Mesh(texturedGeometry, texturedMaterial);
            earth.add(texturedEarth);

            // --- WIREFRAME GRID LINES (hidden by default) ---
            wireframeGroup = new THREE.Group();
            wireframeGroup.visible = false;

            // Dark sphere base for wireframe mode
            var wfBaseGeometry = new THREE.SphereGeometry(1, 64, 64);
            var wfBaseMaterial = new THREE.MeshBasicMaterial({
                color: 0x050000,
                transparent: true,
                opacity: 0.9
            });
            var wfBase = new THREE.Mesh(wfBaseGeometry, wfBaseMaterial);
            wireframeGroup.add(wfBase);

            // Latitude lines
            for (var lat = -80; lat <= 80; lat += 10) {
                var latRad = lat * Math.PI / 180;
                var radius = Math.cos(latRad) * 1.001;
                var y = Math.sin(latRad) * 1.001;
                var points = [];
                for (var lon = 0; lon <= 360; lon += 5) {
                    var lonRad = lon * Math.PI / 180;
                    points.push(new THREE.Vector3(-radius * Math.cos(lonRad), y, radius * Math.sin(lonRad)));
                }
                var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                var lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: lat === 0 ? 0.5 : 0.15 });
                wireframeGroup.add(new THREE.Line(lineGeometry, lineMaterial));
            }

            // Longitude lines
            for (var lon2 = -180; lon2 < 180; lon2 += 15) {
                var points2 = [];
                var lonRad2 = lon2 * Math.PI / 180;
                for (var lat2 = -90; lat2 <= 90; lat2 += 5) {
                    var latRad2 = lat2 * Math.PI / 180;
                    var radius2 = Math.cos(latRad2) * 1.001;
                    var y2 = Math.sin(latRad2) * 1.001;
                    points2.push(new THREE.Vector3(-radius2 * Math.cos(lonRad2), y2, radius2 * Math.sin(lonRad2)));
                }
                var lineGeometry2 = new THREE.BufferGeometry().setFromPoints(points2);
                var lineMaterial2 = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: lon2 === 0 ? 0.5 : 0.15 });
                wireframeGroup.add(new THREE.Line(lineGeometry2, lineMaterial2));
            }

            // Equator ring
            var equatorGeometry = new THREE.RingGeometry(0.98, 1.02, 64);
            var equatorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
            var equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
            equator.rotation.x = Math.PI / 2;
            wireframeGroup.add(equator);

            // Meridian ring
            var meridianGeometry = new THREE.RingGeometry(0.98, 1.02, 64);
            var meridianMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
            var meridian = new THREE.Mesh(meridianGeometry, meridianMaterial);
            meridian.rotation.y = Math.PI / 2;
            wireframeGroup.add(meridian);

            // Wireframe overlay
            var wireGeometry = new THREE.SphereGeometry(1.005, 32, 32);
            var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true, transparent: true, opacity: 0.08 });
            wireframeGroup.add(new THREE.Mesh(wireGeometry, wireMaterial));

            earth.add(wireframeGroup);

            // --- ATMOSPHERE ---
            createAtmosphere();

            // --- STARS ---
            createStars();

            // --- LIGHTING ---
            var ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
            scene.add(ambientLight);

            var pointLight = new THREE.PointLight(0xff4444, 0.8, 100);
            pointLight.position.set(5, 3, 5);
            scene.add(pointLight);

            var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(-3, 2, 4);
            scene.add(dirLight);

            // --- INTERACTION ---
            container.addEventListener('mousedown', onMouseDown);
            container.addEventListener('mousemove', onMouseMove);
            container.addEventListener('mouseup', onMouseUp);
            container.addEventListener('mouseleave', onMouseUp);
            container.addEventListener('touchstart', onTouchStart, { passive: false });
            container.addEventListener('touchmove', onTouchMove, { passive: false });
            container.addEventListener('touchend', onTouchEnd);
            container.addEventListener('wheel', onWheel, { passive: false });

            // Double-click for fullscreen
            container.addEventListener('dblclick', function () {
                var earthContainer = document.querySelector('.earth-container');
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    earthContainer.requestFullscreen().catch(function () { });
                }
            });

            // Start animation
            animateThreeJS();
            console.log('[NEYDRA] Three.js Textured Earth initialized');
        }




        function createAtmosphere() {
            var glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
            var glowMaterial = new THREE.ShaderMaterial({
                vertexShader: 'varying vec3 vNormal;\nvoid main() {\n    vNormal = normalize(normalMatrix * normal);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}',
                fragmentShader: 'varying vec3 vNormal;\nvoid main() {\n    float intensity = pow(0.4 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);\n    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * intensity;\n}',
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
                transparent: true
            });
            var glow = new THREE.Mesh(glowGeometry, glowMaterial);
            scene.add(glow);
        }

        function createStars() {
            var geometry = new THREE.BufferGeometry();
            var positions = [];
            for (var i = 0; i < 5000; i++) {
                positions.push((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            var material = new THREE.PointsMaterial({ size: 0.15, color: 0xff3333, transparent: true, opacity: 0.4 });
            var stars = new THREE.Points(geometry, material);
            scene.add(stars);
        }

        function onMouseDown(event) { isDragging = true; autoRotate = false; previousMousePosition = { x: event.clientX, y: event.clientY }; }
        function onMouseMove(event) {
            if (!isDragging || !earth) return;
            var deltaX = event.clientX - previousMousePosition.x;
            var deltaY = event.clientY - previousMousePosition.y;
            earth.rotation.y += deltaX * 0.005;
            earth.rotation.x += deltaY * 0.005;
            earth.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, earth.rotation.x));
            previousMousePosition = { x: event.clientX, y: event.clientY };
            updateCoordinates();
        }
        function onMouseUp() { isDragging = false; setTimeout(function () { autoRotate = true; }, 3000); }
        function onTouchStart(event) { if (event.touches.length === 1) { isDragging = true; autoRotate = false; previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY }; } }
        function onTouchMove(event) {
            if (!isDragging || !earth) return; event.preventDefault();
            var touch = event.touches[0]; var deltaX = touch.clientX - previousMousePosition.x; var deltaY = touch.clientY - previousMousePosition.y;
            earth.rotation.y += deltaX * 0.005; earth.rotation.x += deltaY * 0.005;
            earth.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, earth.rotation.x));
            previousMousePosition = { x: touch.clientX, y: touch.clientY }; updateCoordinates();
        }
        function onTouchEnd() { isDragging = false; setTimeout(function () { autoRotate = true; }, 3000); }
        function onWheel(event) {
            event.preventDefault(); camera.position.z += event.deltaY * 0.003;
            camera.position.z = Math.max(1.5, Math.min(8, camera.position.z));
            var zoomLevel = Math.round((8 - camera.position.z) / 6.5 * 10);
            document.getElementById('rotation-speed').textContent = zoomLevel + 'x';
            document.getElementById('speed-fill').style.width = (zoomLevel * 10) + '%';
        }

        function updateCoordinates() {
            if (!earth) return;
            var lat = -earth.rotation.x * (180 / Math.PI);
            var lon = earth.rotation.y * (180 / Math.PI);
            document.getElementById('coord-lat').textContent = lat.toFixed(2);
            document.getElementById('coord-lon').textContent = lon.toFixed(2);
        }

        function animateThreeJS() {
            requestAnimationFrame(animateThreeJS);
            if (earth && autoRotate) { earth.rotation.y += 0.001; }
            if (renderer && scene && camera) renderer.render(scene, camera);
        }

        function latLonToVector3(lat, lon, radius) {
            radius = radius || 1.02;
            var phi = (90 - lat) * (Math.PI / 180);
            var theta = (lon + 180) * (Math.PI / 180);
            return new THREE.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
        }

        function addNewsMarker(lat, lon, isBreaking) {
            if (!earth) return;
            var position = latLonToVector3(lat, lon);
            var markerGeometry = new THREE.SphereGeometry(0.015, 16, 16);
            var markerMaterial = new THREE.MeshBasicMaterial({ color: isBreaking ? 0xff0000 : 0xff6600 });
            var marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.copy(position);
            earth.add(marker);
            earthMarkers.push(marker);
        }

        function clearMarkers() { if (!earth) return; earthMarkers.forEach(function (m) { earth.remove(m); }); earthMarkers = []; }

        // =====================================================
        // EARTH MODE TOGGLE (Textured <-> Wireframe)
        // =====================================================
        function toggleEarthMode() {
            var btn = document.getElementById('earth-mode-btn');

            if (earthMode === 'textured') {
                earthMode = 'wireframe';
                if (texturedEarth) texturedEarth.visible = false;
                if (wireframeGroup) wireframeGroup.visible = true;
                btn.textContent = '⬡ TEXTURED MODE';
            } else {
                earthMode = 'textured';
                if (texturedEarth) texturedEarth.visible = true;
                if (wireframeGroup) wireframeGroup.visible = false;
                btn.textContent = '⬡ WIREFRAME MODE';
            }
        }

        function onWindowResize() {
            if (camera && renderer) {
                var container = document.getElementById('earth-canvas');
                var width = container.clientWidth;
                var height = container.clientHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        }

        // =====================================================
        // TARGET INDICATOR SYSTEM
        // =====================================================
        function showTargetIndicator(lat, lon, country, title) {
            var indicator = document.getElementById('target-indicator');
            var coordsEl = document.getElementById('target-coords');
            var labelEl = document.getElementById('target-label');
            coordsEl.textContent = 'LAT: ' + lat.toFixed(2) + ' | LON: ' + lon.toFixed(2);
            labelEl.textContent = country ? country.toUpperCase() : 'TARGET';
            indicator.classList.add('active');
            sfx('target');
            setTimeout(function () { hideTargetIndicator(); }, 5000);
        }

        function hideTargetIndicator() {
            document.getElementById('target-indicator').classList.remove('active');
        }

        // =====================================================
        // COUNTRY POPUP SYSTEM
        // =====================================================
        function showCountryPopup(country, imageUrl) {
            var coords = window.countryCoords[country.toLowerCase()];
            if (!coords) return;
            var popup = document.getElementById('country-popup');
            var countryCode = coords.code ? coords.code.toLowerCase() : 'xx';
            var imgElement = document.getElementById('popup-country-image');

            document.getElementById('popup-country-name').textContent = country.toUpperCase();
            if (imageUrl && imageUrl.length > 0) {
                imgElement.src = imageUrl;
                imgElement.onerror = function () {
                    this.src = 'https://flagcdn.com/w640/' + countryCode + '.png';
                    this.onerror = function () { this.src = 'https://flagsapi.com/' + countryCode.toUpperCase() + '/flat/64.png'; this.onerror = null; };
                };
            } else {
                imgElement.src = 'https://flagcdn.com/w640/' + countryCode + '.png';
                imgElement.onerror = function () { this.src = 'https://flagsapi.com/' + countryCode.toUpperCase() + '/flat/64.png'; this.onerror = null; };
            }
            document.getElementById('popup-lat').textContent = coords.lat.toFixed(4);
            document.getElementById('popup-lon').textContent = coords.lon.toFixed(2);
            document.getElementById('popup-status').textContent = 'REGION IDENTIFIED | MONITORING ACTIVE | NEWS FEED ENABLED';
            popup.classList.add('active');
            sfx('alert');
        }

        function closeCountryPopup() { document.getElementById('country-popup').classList.remove('active'); }

        function flyToCountry(country, imageUrl) {
            var coords = window.countryCoords[country.toLowerCase()];
            if (!coords) return;

            hideTargetIndicator();
            showTargetIndicator(coords.lat, coords.lon, country, null);

            if (earth) {
                sfx('engage');
                autoRotate = false;
                var targetY = -coords.lon * (Math.PI / 180) - Math.PI / 2;
                var targetX = coords.lat * (Math.PI / 180) * 0.5;
                var startY = earth.rotation.y; var startX = earth.rotation.x;
                var duration = 2500; var startTime = Date.now();
                function animateRotation() {
                    var elapsed = Date.now() - startTime; var progress = Math.min(elapsed / duration, 1);
                    var easeProgress = 1 - Math.pow(1 - progress, 4);
                    earth.rotation.y = startY + (targetY - startY) * easeProgress;
                    earth.rotation.x = startX + (targetX - startX) * easeProgress;
                    camera.position.z = 3 + (1.8 - 3) * easeProgress;
                    if (progress < 1) { requestAnimationFrame(animateRotation); }
                    else {
                        document.getElementById('current-country').textContent = country.toUpperCase();
                        showCountryPopup(country, imageUrl);
                        setTimeout(function () { autoRotate = true; camera.position.z = 3; }, 5000);
                    }
                }
                animateRotation();
                document.getElementById('rotation-speed').textContent = '10x';
                document.getElementById('speed-fill').style.width = '100%';
                document.getElementById('hud-data').innerHTML = 'TARGET: ' + country.toUpperCase() + '<br />LOCK: ACQUIRED<br />MODE: SURVEILLANCE<br />SEC: PRIORITY';
                setTimeout(function () {
                    document.getElementById('rotation-speed').textContent = '1x';
                    document.getElementById('speed-fill').style.width = '20%';
                    document.getElementById('hud-data').innerHTML = 'SAT: NEYDRA-1<br />RES: 15m<br />MODE: THERMAL-IR<br />SEC: CLASSIFIED';
                }, 3000);
            }
        }

        // =====================================================
        // FREE NEWS FETCHING (GDELT + RSS)
        // =====================================================
        function detectCountry(title, domain) {
            var text = (title + ' ' + (domain || '')).toLowerCase();
            for (var key in window.countryCoords) {
                if (text.indexOf(key) !== -1) return key;
            }
            // Domain-based detection
            if (domain) {
                var domainLower = domain.toLowerCase();
                if (domainLower.indexOf('.uk') !== -1 || domainLower.indexOf('bbc') !== -1) return 'united kingdom';
                if (domainLower.indexOf('.fr') !== -1 || domainLower.indexOf('france') !== -1) return 'france';
                if (domainLower.indexOf('.de') !== -1) return 'germany';
                if (domainLower.indexOf('.ru') !== -1) return 'russia';
                if (domainLower.indexOf('.cn') !== -1) return 'china';
                if (domainLower.indexOf('aljazeera') !== -1) return 'qatar';
                if (domainLower.indexOf('cnn') !== -1 || domainLower.indexOf('.com') !== -1) return 'united states';
            }
            return 'Global';
        }

        function detectPriority(title) {
            var lower = title.toLowerCase();
            for (var i = 0; i < URGENT_KEYWORDS.length; i++) {
                if (lower.indexOf(URGENT_KEYWORDS[i]) !== -1) return 'BREAKING';
            }
            return 'NORMAL';
        }

        async function fetchFromGDELT() {
            var query = categories.length > 0 ? categories[0] : '';
            var langFilter = currentLang === 'ar' ? ' sourcelang:arabic' : currentLang === 'fr' ? ' sourcelang:french' : currentLang === 'es' ? ' sourcelang:spanish' : currentLang === 'de' ? ' sourcelang:german' : '';
            var url = 'https://api.gdeltproject.org/api/v2/doc/doc?query=' + encodeURIComponent(query + langFilter) + '&mode=artlist&maxrecords=75&format=json&sort=DateDesc&timespan=24h';

            try {
                var response = await fetch(url);
                var data = await response.json();
                if (data && data.articles) {
                    return data.articles.map(function (a, i) {
                        var country = detectCountry(a.title, a.domain);
                        var coords = window.countryCoords[country.toLowerCase()] || { lat: 0, lon: 0 };
                        return {
                            id: 'gdelt-' + i + '-' + Date.now(),
                            title: a.title || 'Untitled',
                            url: a.url || '#',
                            image_url: a.socialimage || '',
                            source: (a.domain || 'GDELT').replace('www.', '').split('.')[0].toUpperCase(),
                            country: country,
                            priority: detectPriority(a.title || ''),
                            published: a.seendate || new Date().toISOString(),
                            latitude: coords.lat,
                            longitude: coords.lon,
                            summary: '',
                            lang: a.language || 'English'
                        };
                    });
                }
            } catch (e) {
                console.warn('[NEYDRA] GDELT fetch failed:', e);
            }
            return [];
        }

        async function fetchFromRSS(feedConfig) {
            try {
                var response = await fetch(feedConfig.url);
                var data = await response.json();
                if (data && data.status === 'ok' && data.items) {
                    return data.items.map(function (item, i) {
                        var country = detectCountry(item.title || '', feedConfig.name);
                        var coords = window.countryCoords[country.toLowerCase()] || { lat: 0, lon: 0 };
                        var image = item.thumbnail || (item.enclosure ? item.enclosure.link : '') || '';
                        return {
                            id: 'rss-' + feedConfig.name + '-' + i + '-' + Date.now(),
                            title: item.title || 'Untitled',
                            url: item.link || '#',
                            image_url: image,
                            source: feedConfig.name,
                            country: country,
                            priority: detectPriority(item.title || ''),
                            published: item.pubDate || new Date().toISOString(),
                            latitude: coords.lat,
                            longitude: coords.lon,
                            summary: (item.description || '').replace(/<[^>]*>/g, '').substring(0, 200),
                            lang: currentLang
                        };
                    });
                }
            } catch (e) {
                console.warn('[NEYDRA] RSS fetch failed for ' + feedConfig.name + ':', e);
            }
            return [];
        }

        async function fetchAllNews() {
            document.getElementById('source-status').innerHTML = '<span className="source-dot online"></span> FETCHING...';

            var allArticles = [];
            var sourcesOnline = 0;
            var promises = [];

            // GDELT
            promises.push(fetchFromGDELT().then(function (articles) {
                if (articles.length > 0) sourcesOnline++;
                allArticles = allArticles.concat(articles);
            }));

            // RSS feeds for current language
            var feeds = RSS_FEEDS[currentLang] || RSS_FEEDS.en;
            feeds.forEach(function (feed) {
                promises.push(fetchFromRSS(feed).then(function (articles) {
                    if (articles.length > 0) sourcesOnline++;
                    allArticles = allArticles.concat(articles);
                }));
            });

            // Also always include English feeds if not already English
            if (currentLang !== 'en') {
                RSS_FEEDS.en.forEach(function (feed) {
                    promises.push(fetchFromRSS(feed).then(function (articles) {
                        if (articles.length > 0) sourcesOnline++;
                        allArticles = allArticles.concat(articles);
                    }));
                });
            }

            await Promise.all(promises);

            // Deduplicate by title similarity
            var seen = {};
            allArticles = allArticles.filter(function (a) {
                var key = a.title.toLowerCase().substring(0, 50);
                if (seen[key]) return false;
                seen[key] = true;
                return true;
            });

            // Sort by date
            allArticles.sort(function (a, b) { return new Date(b.published) - new Date(a.published); });

            activeSources = sourcesOnline;
            allFetchedArticles = allArticles;

            // Filter
            if (breakingOnly) {
                allArticles = allArticles.filter(function (a) { return a.priority === 'BREAKING'; });
            }

            currentArticles = allArticles;

            if (allArticles.length > 0) {
                updateNewsFeed(allArticles);
                updateStats(allArticles);
                updateTicker(allArticles);
                updateUrgentBar(allArticles);
                updateMapMarkers(allArticles);

                // Show breaking alert for the latest breaking news
                var breakingNews = allArticles.filter(function (a) { return a.priority === 'BREAKING'; });
                if (breakingNews.length > 0 && breakingNews[0].id !== lastBreakingId) {
                    showBreakingAlert(breakingNews[0]);
                    lastBreakingId = breakingNews[0].id;
                }
            } else {
                showNoNews();
            }

            document.getElementById('source-status').innerHTML =
                '<span className="source-dot ' + (sourcesOnline > 0 ? 'online' : 'offline') + '"></span> SOURCES: ' + sourcesOnline +
                ' <span className="source-dot online"></span> ARTICLES: ' + allArticles.length +
                ' <span className="source-dot online"></span> AUTO: 60s';
            document.getElementById('stat-sources').textContent = sourcesOnline;
        }

        // Legacy backend fetch (kept for optional legacy mode)
        async function fetchNews() {
            if (!API_URL) {
                await fetchAllNews();
                return;
            }
            try {
                var response = await fetch(API_URL + '/api/news?limit=50');
                var data = await response.json();
                if (data.success && data.articles.length > 0) {
                    currentArticles = data.articles;
                    updateNewsFeed(data.articles);
                    updateStats(data.articles);
                    updateTicker(data.articles);
                    var breakingNews = data.articles.filter(function (a) { return a.priority === 'BREAKING'; });
                    if (breakingNews.length > 0 && breakingNews[0].id !== lastBreakingId) {
                        showBreakingAlert(breakingNews[0]);
                        lastBreakingId = breakingNews[0].id;
                    }
                    clearMarkers();
                    data.articles.slice(0, 20).forEach(function (article) {
                        if (article.latitude !== 0 || article.longitude !== 0) {
                            addNewsMarker(article.latitude, article.longitude, article.priority === 'BREAKING');
                        }
                    });
                } else { showNoNews(); }
            } catch (error) {
                // Fallback to free sources
                await fetchAllNews();
            }
        }

        function showNoNews() {
            document.getElementById('news-feed').innerHTML = '<div style={{ "color": "var(--text-dim)", "textAlign": "center", "padding": "20px", "fontSize": "11px" }}>[ FETCHING FROM FREE SOURCES... ]<br /><br />Please wait or click REFRESH.</div>';
            document.getElementById('ticker-scroll').innerHTML = '<span className="ticker-item">[ LOADING NEWS FEED... ]</span>';
        }

        // =====================================================
        // NEWS DISPLAY — BIG IMAGE CARDS
        // =====================================================
        function updateNewsFeed(articles) {
            var container = document.getElementById('news-feed');
            container.innerHTML = articles.slice(0, 50).map(function (article, idx) {
                var hasImage = article.image_url && article.image_url.length > 5;
                var priorityClass = article.priority === 'BREAKING' ? 'breaking' : (article.priority === 'HIGH' ? 'high' : 'normal');

                return '<div className="news-card ' + (article.priority === 'BREAKING' ? 'breaking-card' : '') + '" onClick="selectNews(\'' + article.id + '\')" data-url="' + (article.url || '#') + '">' +
                    (hasImage ? '<img className="news-card-image" src="' + article.image_url + '" alt="" loading="lazy" onerror="this.classList.add(\'no-image\');this.outerHTML=\'<div className=\\\'news-card-image no-image\\\' />📰</div>\';">' : '<div className="news-card-image no-image">📰</div>') +
                    '<div className="news-card-body">' +
                    '<div className="news-card-priority ' + priorityClass + '">' + (article.priority === 'BREAKING' ? 'BREAKING' : article.priority) + '</div>' +
                    '<div className="news-card-title">' + article.title + '</div>' +
                    '<div className="news-card-meta">' +
                    '<span className="news-card-source">[' + article.source + ']</span>' +
                    '<span className="news-card-country">[' + article.country + ']</span>' +
                    '<span>' + formatTime(article.published) + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }).join('');
            document.getElementById('news-count').textContent = articles.length;
        }

        function updateTicker(articles) {
            var items = articles.slice(0, 20).map(function (a) {
                return '<span className="ticker-item ' + (a.priority === 'BREAKING' ? 'breaking' : '') + '"><span className="separator">|</span>' + a.title + '</span>';
            }).join('');
            document.getElementById('ticker-scroll').innerHTML = items + items;
        }

        function updateStats(articles) {
            document.getElementById('stat-breaking').textContent = articles.filter(function (a) { return a.priority === 'BREAKING'; }).length;
            document.getElementById('stat-total').textContent = articles.length;
            var countries = new Set();
            articles.forEach(function (a) { if (a.country !== 'Global') countries.add(a.country); });
            document.getElementById('stat-countries').textContent = countries.size;
        }

        function updateMapMarkers(articles) {
            clearMarkers();
            articles.slice(0, 30).forEach(function (a) {
                if (a.latitude !== 0 || a.longitude !== 0) {
                    addNewsMarker(a.latitude, a.longitude, a.priority === 'BREAKING');
                }
            });
        }

        // =====================================================
        // URGENT BAR SYSTEM
        // =====================================================
        function updateUrgentBar(articles) {
            var urgentArticles = articles.filter(function (a) { return a.priority === 'BREAKING'; });
            var urgentBar = document.getElementById('urgent-bar');

            if (urgentArticles.length > 0) {
                urgentBar.classList.add('active');
                var scrollContent = urgentArticles.map(function (a) {
                    return '<span className="urgent-text">⚠ ' + a.title + ' <span className="urgent-separator">★</span> [' + a.source + '] <span className="urgent-separator">★</span></span>';
                }).join('');
                document.getElementById('urgent-scroll').innerHTML = scrollContent + scrollContent;

                // Play urgent sound for new urgent news
                if (urgentArticles[0].title !== lastUrgentTitle) {
                    lastUrgentTitle = urgentArticles[0].title;
                    playUrgentSound();
                }
            } else {
                urgentBar.classList.remove('active');
            }
        }

        // =====================================================
        // NEWS INTERACTION
        // =====================================================
        function selectNews(id) {
            var article = currentArticles.find(function (a) { return a.id === id; });
            if (article) {
                var coords = window.countryCoords[article.country.toLowerCase()] || { lat: 0, lon: 0 };
                closeMobileSidebar();

                if (article.priority === 'BREAKING') {
                    showBreakingAlert(article);
                } else {
                    showTargetIndicator(coords.lat, coords.lon, article.country, article.title);
                    flyToCountry(article.country, article.image_url);
                }

                // Open article in new tab
                if (article.url && article.url !== '#') {
                    window.open(article.url, '_blank');
                }
            }
        }

        function showBreakingAlert(article) {
            var alertEl = document.getElementById('breaking-alert');
            var imgEl = document.getElementById('alert-image');
            imgEl.src = article.image_url || '';
            imgEl.style.display = article.image_url ? 'block' : 'none';
            document.getElementById('alert-title').textContent = article.title;
            document.getElementById('alert-summary').textContent = article.summary || '';
            document.getElementById('alert-country').textContent = '[' + article.country + ']';
            document.getElementById('alert-source').textContent = '[' + article.source + ']';
            document.getElementById('alert-time').textContent = formatTime(article.published);

            var timer = document.getElementById('alert-timer');
            timer.style.animation = 'none';
            timer.offsetHeight;
            timer.style.animation = 'timer-countdown 20s linear';

            alertEl.classList.add('visible');
            var coords = window.countryCoords[article.country.toLowerCase()] || { lat: 0, lon: 0 };
            showTargetIndicator(coords.lat, coords.lon, article.country, article.title);
            flyToCountry(article.country, article.image_url);
            sfx('alert');

            if (alertTimeout) clearTimeout(alertTimeout);
            alertTimeout = setTimeout(closeAlert, 20000);
        }

        function closeAlert() {
            document.getElementById('breaking-alert').classList.remove('visible');
            if (alertTimeout) clearTimeout(alertTimeout);
        }

        function formatTime(dateStr) {
            if (!dateStr) return 'NOW';
            var date;
            // Handle GDELT date format: 20250413T120000Z
            if (typeof dateStr === 'string' && dateStr.length >= 15 && dateStr.indexOf('T') === 8) {
                var y = dateStr.substring(0, 4), m = dateStr.substring(4, 6), d = dateStr.substring(6, 8);
                var h = dateStr.substring(9, 11), mi = dateStr.substring(11, 13), s = dateStr.substring(13, 15);
                date = new Date(y + '-' + m + '-' + d + 'T' + h + ':' + mi + ':' + s + 'Z');
            } else {
                date = new Date(dateStr);
            }
            if (isNaN(date.getTime())) return 'NOW';
            var now = new Date();
            var diff = (now - date) / 1000;
            if (diff < 60) return 'NOW';
            if (diff < 3600) return Math.floor(diff / 60) + 'm';
            if (diff < 86400) return Math.floor(diff / 3600) + 'h';
            return date.toLocaleDateString();
        }

        // =====================================================
        // LIVE TV SYSTEM
        // =====================================================
        function switchTV(index) {
            currentTVChannel = index;
            var tabs = document.querySelectorAll('.tv-tab');
            tabs.forEach(function (t, i) {
                t.classList.toggle('active', i === index);
            });
            var frame = document.getElementById('tv-frame');
            frame.src = TV_CHANNELS[index].src;
            document.getElementById('tv-status').textContent = TV_CHANNELS[index].label.toUpperCase();
        }

        // =====================================================
        // LANGUAGE SWITCHER
        // =====================================================
        function switchLang(lang) {
            currentLang = lang;
            var btns = document.querySelectorAll('.lang-btn');
            btns.forEach(function (b) {
                b.classList.toggle('active', b.textContent.toLowerCase() === lang);
            });
            fetchAllNews();
        }

        // =====================================================
        // UI FUNCTIONS
        // =====================================================
        function toggleCategory(cat) {
            var btn = document.getElementById('cat-' + cat);
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                categories = categories.filter(function (c) { return c !== cat; });
            } else {
                btn.classList.add('active');
                categories.push(cat);
            }
            fetchAllNews();
        }

        function toggleBreakingOnly() {
            breakingOnly = !breakingOnly;
            document.getElementById('btn-breaking').classList.toggle('active', breakingOnly);
            fetchAllNews();
        }

        async function refreshNews() {
            sfx('tick');
            if (API_URL) {
                try { await fetch(API_URL + '/api/refresh', { method: 'POST' }); } catch (e) { }
                fetchNews();
            } else {
                fetchAllNews();
            }
        }

        function showSettings() {
            document.getElementById('settings-overlay').classList.add('visible');
            var select = document.getElementById('add-country-select');
            select.innerHTML = '<option value="">-- Select Country --</option>' +
                Object.keys(window.countryCoords).map(function (c) {
                    return '<option value="' + c + '">' + c.charAt(0).toUpperCase() + c.slice(1) + '</option>';
                }).join('');
            select.onchange = function () {
                if (this.value && watchedCountries.indexOf(this.value) === -1) {
                    watchedCountries.push(this.value);
                    updateWatchedCountries();
                }
                this.value = '';
            };
        }

        function hideSettings() { document.getElementById('settings-overlay').classList.remove('visible'); }
        function showHowToUse() { document.getElementById('how-to-use-overlay').classList.add('visible'); sfx('tick'); }
        function hideHowToUse() { document.getElementById('how-to-use-overlay').classList.remove('visible'); }

        function showLegacyConnect() { document.getElementById('connection-overlay').classList.add('visible'); }
        function hideLegacyConnect() { document.getElementById('connection-overlay').classList.remove('visible'); }

        function initializeConnection() {
            var urlInput = document.getElementById('url-input');
            var url = urlInput.value.trim();
            if (!url) { alert("Please enter a valid URL."); return; }
            if (url.endsWith("/")) url = url.slice(0, -1);
            if (!url.startsWith("http")) { alert("URL must start with http:// or https://"); return; }

            API_URL = url;
            console.log('Connecting to ' + API_URL + '...');
            fetch(API_URL + '/')
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data.status === "ONLINE") {
                        console.log("CONNECTION ESTABLISHED");
                        document.getElementById('connection-overlay').classList.remove('visible');
                        sfx('engage');
                        fetchNews();
                        if (newsRefreshInterval) clearInterval(newsRefreshInterval);
                        newsRefreshInterval = setInterval(fetchNews, 30000);
                    } else {
                        alert("Connected but server status unknown.");
                    }
                })
                .catch(function (err) {
                    console.error(err);
                    alert("Could not connect. Using free sources instead.");
                    document.getElementById('connection-overlay').classList.remove('visible');
                    API_URL = null;
                    fetchAllNews();
                });
        }

        function updateWatchedCountries() {
            var list = document.getElementById('watched-countries');
            var tags = document.getElementById('country-tags');
            tags.innerHTML = watchedCountries.map(function (c) {
                return '<div className="country-tag">' + c + '<span className="remove" onClick="removeCountry(\'' + c + '\')">X</span></div>';
            }).join('');
            list.innerHTML = watchedCountries.length === 0 ?
                '<div style={{ "color": "var(--text-dim)", "textAlign": "center", "padding": "15px", "fontSize": "11px" }}>[ NO REGIONS SELECTED ]</div>' :
                watchedCountries.map(function (c) {
                    return '<div className="country-item" onClick="flyToCountry(\'' + c + '\')">' +
                        '<span className="country-name">' + c.charAt(0).toUpperCase() + c.slice(1) + '</span>' +
                        '</div>';
                }).join('');
            document.getElementById('watched-count').textContent = watchedCountries.length;
        }

        function removeCountry(country) {
            watchedCountries = watchedCountries.filter(function (c) { return c !== country; });
            updateWatchedCountries();
        }

        function saveSettings() { hideSettings(); sfx('tick'); }

        function downloadPackage() {
            var link = document.createElement('a');
            link.href = API_URL ? (API_URL + '/download/package') : '/downloads/neydra-news-package.rar';
            link.download = 'neydra-news-package.zip';
            link.click();
            sfx('tick');
        }

        // Mobile Sidebar Toggle
        function toggleMobileSidebar() {
            var sidebar = document.getElementById('sidebar-right');
            sidebar.classList.toggle('mobile-open');
            var closeBtn = sidebar.querySelector('.close-btn');
            if (window.innerWidth <= 900) {
                closeBtn.style.display = 'flex';
            }
        }

        function closeMobileSidebar() {
            var sidebar = document.getElementById('sidebar-right');
            if (sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
            }
        }

        // =====================================================
        // KEYBOARD SHORTCUTS
        // =====================================================
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeAlert();
                hideSettings();
                hideHowToUse();
                hideTargetIndicator();
                closeCountryPopup();
                closeMobileSidebar();
                hideLegacyConnect();
            }
            if (e.key === 'r' || e.key === 'R') { if (!e.ctrlKey && !e.metaKey) refreshNews(); }
            if (e.key === 'f' || e.key === 'F') {
                if (!e.ctrlKey && !e.metaKey) {
                    var container = document.querySelector('.earth-container');
                    if (document.fullscreenElement) { document.exitFullscreen(); }
                    else { container.requestFullscreen().catch(function () { }); }
                }
            }
            if (e.key === 'm' || e.key === 'M') {
                if (!e.ctrlKey && !e.metaKey) {
                    soundEnabled = !soundEnabled;
                    console.log('[NEYDRA] Sound ' + (soundEnabled ? 'enabled' : 'muted'));
                }
            }
            if (e.key === 'w' || e.key === 'W') {
                if (!e.ctrlKey && !e.metaKey) toggleEarthMode();
            }
            // 1-4 for TV channels
            if (['1', '2', '3', '4'].indexOf(e.key) !== -1 && !e.ctrlKey && !e.metaKey) {
                switchTV(parseInt(e.key) - 1);
            }
        });

        // =====================================================
        // INITIALIZATION
        // =====================================================
        window.addEventListener('load', function () {
            // Initialize Three.js Textured Earth
            initTexturedEarth();
            onWindowResize();

            // Hide loading after a short delay
            setTimeout(function () {
                document.getElementById('loading-overlay').classList.add('hidden');
            }, 2000);

            // Start free news fetching immediately
            fetchAllNews();

            // Auto-refresh every 60 seconds
            newsRefreshInterval = setInterval(function () {
                fetchAllNews();
            }, 60000);

            // Attempt to play background theme
            var theme = document.getElementById('snd-theme');
            if (theme) {
                theme.volume = 0.4; // Set reasonable background volume
                var playPromise = theme.play();
                if (playPromise !== undefined) {
                    playPromise.catch(function (error) {
                        // Auto-play was prevented. Play on first interaction.
                        console.log('[NEYDRA] Autoplay blocked. Waiting for user interaction to play theme.');
                        var playOnInteract = function () {
                            if (soundEnabled) theme.play().catch(function () { });
                            document.removeEventListener('click', playOnInteract);
                            document.removeEventListener('keydown', playOnInteract);
                        };
                        document.addEventListener('click', playOnInteract);
                        document.addEventListener('keydown', playOnInteract);
                    });
                }
            }
        });

        window.addEventListener('resize', onWindowResize);
    