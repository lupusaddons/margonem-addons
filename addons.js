(function() {
    'use strict';
    
    // System autoryzacji
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    const allowedUsers = ['6283400', '5676978', '6901372', '9449685', '1406394', '9839862', '1763767', '1909323', '9181569', '6680459', '829797', '6581687', '251614', '7949481', '1193100', '9682982', '6591109', '5261188', '2221811', '4116980', '5942859', '9434153', '6145947', '9848909', '9550217', '9376321','583750', '4672322', '9085663', '7736753', '7712777', '6505636', '6555412', '3155337', '7466726', '4938276', '6464617', '5090092', '9923077', '7246870', '8170184', '6873278', '8631058', '6110079', '3449240', '7443491', '9794893', '9803001', '7617868', '8228619', '9668158', '5630085', '9442821', '5906841', '6580761', '5801771', '9604384', '9975302', '9285345', '6558282', '8320962', '8889608', '8776354', '5641911', '6719921', '6770292', '8986880', '4217774', '5365202', '8797715', '6036183', '9710930', '8187398', '7844833', '9153488', '4540634', '5158011'];

    const userId = getCookie('user_id');
    if (!allowedUsers.includes(userId)) {
        console.log('🚫 Brak uprawnień dla użytkownika:', userId);
        console.log('✅ Dozwoleni użytkownicy:', allowedUsers);
        return;
    }

    console.log('✅ Użytkownik autoryzowany:', userId);

    // Konfiguracja dodatków
    const addonConfig = {
        addon1: {
            name: 'Players Online',
            enabled: false,
            url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/players%20online.js'
        },
        addon2: {
            name: 'Players Online - Alarm',
            enabled: false,
            url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/players%20online%20alarm.js'
        },
        addon3: {
            name: 'Titans on Discord',
            enabled: false,
            url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/titans%20on%20discord.js'
        },
        addon4: {
            name: 'Heroes on Discord',
            enabled: false,
            url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/heroes%20on%20discord.js'
        },
    
        addon5: {
        name: 'Inventory Search',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/inventory%20search.js'
    },
        addon6: {
        name: 'Shop Hotkey',
        enabled: false,
        url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/better%20sellings.js'
    }
};


    // Obiekt do przechowywania załadowanych dodatków
    const loadedAddons = {};

    // Funkcja do ładowania kodu dodatku z GitHub
    async function loadAddonCode(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const code = await response.text();
            return code;
        } catch (error) {
            console.error('Błąd podczas ładowania dodatku:', error);
            throw error;
        }
    }

    // Funkcja do tworzenia dodatku
    async function createAddon(addonId, config) {
        try {
            console.log(`Ładowanie dodatku: ${config.name}...`);
            
            // Załaduj kod z GitHub
            const addonCode = await loadAddonCode(config.url);
            
            // Stwórz obiekt dodatku
            const addon = {
                name: config.name,
                enabled: false,
                code: addonCode,
                addonFunction: null,
init: function() {
    console.log(`${config.name} włączony`);
    try {
        // Dodaj polyfill dla funkcji GM_
        window.GM_getValue = window.GM_getValue || function(key, defaultValue) {
            const stored = localStorage.getItem('gm_' + key);
            return stored !== null ? JSON.parse(stored) : defaultValue;
        };

        window.GM_setValue = window.GM_setValue || function(key, value) {
            localStorage.setItem('gm_' + key, JSON.stringify(value));
        };

        window.GM_deleteValue = window.GM_deleteValue || function(key) {
            localStorage.removeItem('gm_' + key);
        };

        // Wykonaj kod dodatku w bezpiecznym kontekście
        this.addonFunction = new Function(
            'addonId', 
            'console', 
            'document', 
            'window',
            'cleanupAddon',
            this.code
        );
                        
                        // Uruchom dodatek
                        this.addonFunction(addonId, console, document, window, cleanupAddon);
                    } catch (error) {
                        console.error(`Błąd podczas inicjalizacji ${config.name}:`, error);
                        throw error;
                    }
                },
                destroy: function() {
                    cleanupAddon(addonId);
                }
            };
            
            return addon;
        } catch (error) {
            console.error(`Błąd podczas tworzenia dodatku ${config.name}:`, error);
            return null;
        }
    }

    // Funkcja do ładowania wszystkich dodatków
    async function loadAllAddons() {
        for (const [addonId, config] of Object.entries(addonConfig)) {
            const addon = await createAddon(addonId, config);
            if (addon) {
                loadedAddons[addonId] = addon;
                console.log(`✅ Załadowano: ${config.name}`);
                
                // Sprawdź zapisany stan i włącz dodatek jeśli był włączony
                const wasEnabled = loadAddonState(addonId);
                if (wasEnabled) {
                    try {
                        await addon.init();
                        addon.enabled = true;
                        console.log(`🔄 Przywrócono stan: ${config.name} - włączony`);
                    } catch (error) {
                        console.error(`Błąd podczas przywracania ${config.name}:`, error);
                        addon.enabled = false;
                        saveAddonState(addonId, false);
                    }
                }
            } else {
                console.log(`❌ Nie udało się załadować: ${config.name}`);
            }
        }
    }

    // Funkcja do włączania dodatku
    async function enableAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (addon.enabled) {
            console.log(`Dodatek ${addon.name} jest już włączony`);
            return true;
        }
        
        try {
            await addon.init();
            addon.enabled = true;
            saveAddonState(addonId, true); // Zapisz stan
            console.log(`✅ Włączono: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`Błąd podczas włączania ${addon.name}:`, error);
            return false;
        }
    }

    // Funkcja do wyłączania dodatku
    function disableAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (!addon.enabled) {
            console.log(`Dodatek ${addon.name} jest już wyłączony`);
            return true;
        }
        
        try {
            addon.destroy();
            addon.enabled = false;
            saveAddonState(addonId, false); // Zapisz stan
            console.log(`✅ Wyłączono: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`Błąd podczas wyłączania ${addon.name}:`, error);
            return false;
        }
    }

    // Funkcja do przełączania stanu dodatku
    async function toggleAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (addon.enabled) {
            return disableAddon(addonId);
        } else {
            return await enableAddon(addonId);
        }
    }

    // Funkcja do pobierania listy dodatków
    function getAddonsList() {
        return Object.entries(loadedAddons).map(([id, addon]) => ({
            id,
            name: addon.name,
            enabled: addon.enabled
        }));
    }

    // Funkcja cleanup (musisz ją dostosować do swoich potrzeb)
    function cleanupAddon(addonId) {
        console.log(`Czyszczenie dodatku: ${addonId}`);
        // Tutaj umieść kod do czyszczenia zasobów dodatku
        // np. usuwanie event listenerów, elementów DOM, itp.
    }


    // CSS Styles dla GUI
    const styles = `
        .addon-manager {
            position: fixed;
            z-index: 10000;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .addon-toggle-btn {
            background: #2f3136;
            border: 1px solid #40444b;
            color: #dcddde;
            padding: 8px;
            border-radius: 4px;
            cursor: move;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            user-select: none;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-width: 32px;
            width: 32px;
            height: 32px;
        }

        .addon-toggle-btn::before {
            content: '';
            width: 20px;
            height: 20px;
            background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            flex-shrink: 0;
        }

        .addon-toggle-btn:hover {
            background: #36393f;
            border-color: #4f545c;
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        }

        .addon-toggle-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .addon-toggle-btn.dragging {
            transform: none !important;
            transition: none !important;
        }

        .addon-menu {
            position: absolute;
            top: 50px;
            left: 0;
            background: #2f3136;
            border: 1px solid #40444b;
            border-radius: 6px;
            padding: 16px;
            min-width: 300px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            display: none;
        }

        .addon-menu.active {
            display: block;
            animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .addon-menu-header {
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: left;
            border-bottom: 1px solid #40444b;
            padding-bottom: 8px;
            cursor: move;
            user-select: none;
            position: relative;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .addon-menu-header::before {
            content: '';
            width: 18px;
            height: 18px;
            background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            flex-shrink: 0;
        }

        .addon-menu.dragging {
            transition: none !important;
        }

        .addon-close-btn {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #36393f;
            border: 1px solid #40444b;
            color: #dcddde;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            line-height: 1;
        }

        .addon-close-btn:hover {
            background: #ed4245;
            border-color: #ed4245;
            color: white;
        }

        .addon-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #40444b;
            transition: all 0.2s ease;
        }

        .addon-item:last-child {
            border-bottom: none;
        }

        .addon-item:hover {
            background: rgba(255,255,255,0.04);
            margin: 0 -8px;
            padding: 10px 8px;
            border-radius: 4px;
        }

        .addon-name {
            color: #dcddde;
            font-size: 14px;
            font-weight: 500;
        }

        .addon-switch {
            position: relative;
            width: 44px;
            height: 22px;
            background: #4f545c;
            border-radius: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }

        .addon-switch.active {
            background: #3ba55d;
        }

        .addon-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            background: white;
            border-radius: 50%;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .addon-switch.active::after {
            left: 24px;
        }

        .addon-status {
            font-size: 11px;
            color: #72767d;
            margin-top: 2px;
        }

        .addon-controls {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #40444b;
            display: flex;
            gap: 8px;
        }

        .control-btn {
            flex: 1;
            padding: 6px 10px;
            border: 1px solid #40444b;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            color: #dcddde;
        }

        .enable-all-btn {
            background: #3ba55d;
            border-color: #3ba55d;
            color: white;
        }

        .disable-all-btn {
            background: #ed4245;
            border-color: #ed4245;
            color: white;
        }

        .enable-all-btn:hover {
            background: #2d7d32;
            border-color: #2d7d32;
        }

        .disable-all-btn:hover {
            background: #c62828;
            border-color: #c62828;
        }

        .control-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
    `;

    // Dodaj style do strony
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // System zapisywania stanu w cookies (alternatywa dla localStorage)
    function setCookie(name, value, days = 30) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getAddonCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    // Funkcja do zapisywania stanu dodatku
    function saveAddonState(addonId, enabled) {
        setCookie(`addon_${addonId}_enabled`, enabled.toString());
    }

    // Funkcja do wczytywania stanu dodatku
    function loadAddonState(addonId) {
        const saved = getAddonCookie(`addon_${addonId}_enabled`);
        return saved === 'true';
    }

    // Make element draggable
    function makeDraggable(element, handle) {
        let isDragging = false;
        let hasDragged = false;
        let startX, startY, initialX, initialY;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasDragged = false;

            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            element.style.position = 'fixed';
            element.style.left = initialX + 'px';
            element.style.top = initialY + 'px';
            element.style.right = 'auto';

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            e.preventDefault();
        });

        function handleMouseMove(e) {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasDragged = true;
                element.classList.add('dragging');
                handle.classList.add('dragging');
            }

            let newX = initialX + deltaX;
            let newY = initialY + deltaY;

            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            newX = Math.max(0, Math.min(newX, viewportWidth - rect.width));
            newY = Math.max(0, Math.min(newY, viewportHeight - rect.height));

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
        }

        function handleMouseUp() {
            if (!isDragging) return;

            isDragging = false;

            setTimeout(() => {
                element.classList.remove('dragging');
                handle.classList.remove('dragging');
                hasDragged = false;
            }, 100);

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => hasDragged;
    }

    // Create GUI
    function createGUI() {
        const container = document.createElement('div');
        container.className = 'addon-manager';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'addon-toggle-btn';
        toggleBtn.textContent = ' Kaczor Manager';

        const wasDragged = makeDraggable(container, toggleBtn);

        const menu = document.createElement('div');
        menu.className = 'addon-menu';

        const header = document.createElement('div');
        header.className = 'addon-menu-header';
        header.textContent = 'Manager Dodatków';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'addon-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.remove('active');
        });

        header.appendChild(closeBtn);
        makeDraggable(menu, header);
        menu.appendChild(header);

        // Create addon items
        Object.entries(loadedAddons).forEach(([addonId, addon]) => {
            const item = document.createElement('div');
            item.className = 'addon-item';

            const info = document.createElement('div');
            const name = document.createElement('div');
            name.className = 'addon-name';
            name.textContent = addon.name;

            const status = document.createElement('div');
            status.className = 'addon-status';
            status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';

            info.appendChild(name);
            info.appendChild(status);

            const switchElement = document.createElement('div');
            switchElement.className = `addon-switch ${addon.enabled ? 'active' : ''}`;

            switchElement.addEventListener('click', async () => {
                const success = await toggleAddon(addonId);
                if (success) {
                    switchElement.classList.toggle('active', addon.enabled);
                    status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';
                }
            });

            item.appendChild(info);
            item.appendChild(switchElement);
            menu.appendChild(item);
        });

        // Control buttons
        const controls = document.createElement('div');
        controls.className = 'addon-controls';

        const enableAllBtn = document.createElement('button');
        enableAllBtn.className = 'control-btn enable-all-btn';
        enableAllBtn.textContent = 'Włącz wszystkie';
        enableAllBtn.addEventListener('click', async () => {
            for (const addonId of Object.keys(loadedAddons)) {
                if (!loadedAddons[addonId].enabled) {
                    await enableAddon(addonId);
                }
            }
            updateGUI();
        });

        const disableAllBtn = document.createElement('button');
        disableAllBtn.className = 'control-btn disable-all-btn';
        disableAllBtn.textContent = 'Wyłącz wszystkie';
        disableAllBtn.addEventListener('click', () => {
            Object.keys(loadedAddons).forEach(addonId => {
                if (loadedAddons[addonId].enabled) {
                    disableAddon(addonId);
                }
            });
            updateGUI();
        });

        controls.appendChild(enableAllBtn);
        controls.appendChild(disableAllBtn);
        menu.appendChild(controls);

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setTimeout(() => {
                if (!toggleBtn.classList.contains('dragging') && !wasDragged()) {
                    menu.classList.toggle('active');
                }
            }, 10);
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        container.appendChild(toggleBtn);
        container.appendChild(menu);
        document.body.appendChild(container);
    }

    // Update GUI
    function updateGUI() {
        const switches = document.querySelectorAll('.addon-switch');
        const statuses = document.querySelectorAll('.addon-status');

        Object.entries(loadedAddons).forEach(([addonId, addon], index) => {
            if (switches[index]) {
                switches[index].classList.toggle('active', addon.enabled);
            }
            if (statuses[index]) {
                statuses[index].textContent = addon.enabled ? 'Włączony' : 'Wyłączony';
            }
        });
    }

    // Inicjalizacja - załaduj wszystkie dodatki przy starcie
    loadAllAddons().then(() => {
        console.log('🚀 Manager dodatków gotowy!');
        console.log('Dostępne dodatki:', getAddonsList());
        console.log(`👤 Zalogowany jako użytkownik: ${userId}`);
        
        // Utwórz GUI po załadowaniu dodatków
        setTimeout(() => {
            createGUI();
        }, 500);
    });

    // Eksportuj funkcje do użycia
    window.AddonManager = {
        enable: enableAddon,
        disable: disableAddon,
        toggle: toggleAddon,
        getList: getAddonsList,
        reload: loadAllAddons,
        getCurrentUser: () => userId,
        updateGUI: updateGUI
    };

})();
