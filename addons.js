(function() {
    'use strict';
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
let refreshRequired = false;
const addonConfig = {
      addon1: {
        name: 'Players Online',
        description: 'Wyświetla liczbę graczy online na serwerze, z podziałem na tytanów.',
        enabled: false,
        url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/players%20online.js'
    },
        addon2: {
        name: 'Players Online - Alarm',
        description: 'Wysyła wiadmość na discorda gdy liczba graczy online przekroczy określony próg.',
        enabled: false,
        url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/players%20online%20alarm.js'
    },
    addon3: {
        name: 'Titans on Discord',
        description: 'Wysyła powiadomienie na discorda gdy tytan zrespi.',
        enabled: false,
        url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/titans%20on%20discord.js'
    },
    addon4: {
        name: 'Heroes on Discord',
        description: 'Wysyła powiadomienie na discorda gdy znajdziesz herosa.',
        enabled: false,
        url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/heroes%20on%20discord.js'
    },
        addon5: {
            id: 'inventory_search',
            name: 'Inventory Search',
            description: 'Dodaje funkcję wyszukiwania przedmiotów w ekwipunku.',
            enabled: false,
            url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/inventory%20search.js'
        },
        addon6: {
            id: 'shop_hotkey',
            name: 'Shop Hotkey',
            description: 'Dodaje skróty klawiszowe do szybkiego sprzedawania przedmiotów.',
            enabled: false,
            url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/better%20sellings.js'
        },
        addon7: {
            id: 'better_ui',
            name: 'Better UI',
            description: 'Zmienia nazwy statystyk, bonusów legendarnych oraz dodaje kalkulator ulepszania do tipów.',
            enabled: false,
            url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/betterui.js'
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
                config: config,
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

           setRefreshRequired();

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

    const styles = `
.addon-manager {
    position: fixed;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 12px;
}

.addon-toggle-btn {
    width: 44px !important;
    height: 44px !important;
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%) !important;
    border: 2px solid #333 !important;
    border-radius: 4px !important;
    box-shadow: 
        inset 0 1px 0 rgba(255,255,255,0.1),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        0 2px 4px rgba(0,0,0,0.5) !important;
    position: relative !important;
    cursor: move !important;
    transition: all 0.2s ease !important;
    padding: 0 !important;
    overflow: hidden !important;
}

.addon-toggle-btn:hover {
    background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%) !important;
    border-color: #444 !important;
    box-shadow: 
        inset 0 1px 0 rgba(255,255,255,0.15),
        inset 0 -1px 0 rgba(0,0,0,0.4),
        0 3px 6px rgba(0,0,0,0.6) !important;
}

.addon-toggle-btn:active {
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%) !important;
    box-shadow: 
        inset 0 2px 4px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.05) !important;
    transform: translateY(1px) !important;
}

.addon-toggle-btn::before {
    content: '' !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 28px !important;
    height: 28px !important;
    background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png') !important;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    opacity: 0.9 !important;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5)) !important;
}

.addon-toggle-btn:hover::before {
    opacity: 1 !important;
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.7)) !important;
}

.addon-menu.active ~ .addon-toggle-btn {
    border-color: #4CAF50 !important;
    box-shadow: 
        inset 0 1px 0 rgba(255,255,255,0.2),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        0 0 8px rgba(76, 175, 80, 0.3) !important;
}

.addon-menu {
    position: absolute;
    top: 50px;
    left: 0;
    background: linear-gradient(to bottom, #3a3a3a 0%, #2a2a2a 100%);
    border: 1px solid #1a1a1a;
    border-radius: 4px;
    padding: 0;
    width: 600px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
    display: none;
    overflow: hidden;
}

.addon-menu.active {
    display: block;
}

.addon-menu-header {
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    margin: 0;
    padding: 12px 16px;
    background: linear-gradient(to bottom, #4a4a4a 0%, #3a3a3a 100%);
    border-bottom: 1px solid #1a1a1a;
    cursor: move;
    user-select: none;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

.addon-menu-header::before {
    content: '';
    width: 16px;
    height: 16px;
    background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    flex-shrink: 0;
}

.addon-close-btn {
    position: absolute;
    top: 8px;
    right: 12px;
    background: linear-gradient(to bottom, #666 0%, #444 100%);
    border: 1px solid #222;
    color: #ffffff;
    width: 20px;
    height: 20px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    line-height: 1;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
}

.addon-close-btn:hover {
    background: linear-gradient(to bottom, #cc4444 0%, #aa2222 100%);
    border-color: #992222;
}

.addon-content {
    padding: 8px;
    max-height: 400px;
    overflow-y: auto;
    background: #2a2a2a;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    align-items: start;
}

.addon-content::-webkit-scrollbar {
    width: 12px;
}

.addon-content::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 6px;
}

.addon-content::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #555 0%, #333 100%);
    border-radius: 6px;
    border: 1px solid #222;
}

.addon-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    background: linear-gradient(to bottom, #444 0%, #333 100%);
    border: 1px solid #222;
    border-radius: 3px;
    transition: all 0.2s ease;
    min-height: 32px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    margin-bottom: 4px;
}

.addon-item:hover {
    background: linear-gradient(to bottom, #555 0%, #444 100%);
    border-color: #333;
}

.addon-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.addon-name-container {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
}

.addon-name {
    color: #ffffff;
    font-size: 12px;
    font-weight: normal;
    text-shadow: 0 1px 1px rgba(0,0,0,0.8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.addon-help-icon {
    width: 14px;
    height: 14px;
    background: linear-gradient(to bottom, #666 0%, #444 100%);
    border: 1px solid #333;
    border-radius: 50%;
    color: #fff;
    font-size: 9px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: help;
    position: relative;
    flex-shrink: 0;
    transition: all 0.2s ease;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
}

.addon-help-icon:hover {
    background: linear-gradient(to bottom, #777 0%, #555 100%);
    border-color: #444;
    transform: scale(1.1);
}

.addon-tooltip {
    position: fixed;
    bottom: auto;
    top: auto;
    left: auto;
    right: auto;
    background: linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%);
    border: 1px solid #444;
    border-radius: 4px;
    padding: 10px 12px;
    color: #fff;
    font-size: 12px;
    line-height: 1.4;
    white-space: normal;
    width: 280px;
    z-index: 20001;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    box-shadow: 0 6px 20px rgba(0,0,0,0.9);
    pointer-events: none;
    word-wrap: break-word;
}

.addon-help-icon:hover .addon-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-2px);
}

.addon-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1a1a1a;
}

.addon-tooltip.tooltip-above::after {
    top: auto;
    bottom: 100%;
    border-top-color: transparent;
    border-bottom-color: #1a1a1a;
}

.addon-status {
    font-size: 9px;
    font-weight: normal;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.addon-status.enabled {
    color: #4CAF50;
}

.addon-status.disabled {
    color: #888;
}

.addon-switch {
    position: relative;
    width: 36px;
    height: 18px;
    background: linear-gradient(to bottom, #333 0%, #1a1a1a 100%);
    border: 1px solid #111;
    border-radius: 9px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
    flex-shrink: 0;
    margin-left: 8px;
}

.addon-switch.active {
    background: linear-gradient(to bottom, #4CAF50 0%, #388E3C 100%);
    border-color: #2E7D32;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 0 4px rgba(76, 175, 80, 0.3);
}

.addon-switch::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    width: 14px;
    height: 14px;
    background: linear-gradient(to bottom, #f0f0f0 0%, #d0d0d0 100%);
    border: 1px solid #999;
    border-radius: 50%;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.addon-switch.active::after {
    left: 19px;
    background: linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%);
    border-color: #ccc;
}

.addon-controls {
    margin: 0;
    padding: 8px;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    gap: 4px;
    background: #252525;
    grid-column: 1 / -1;
}

.control-btn {
    flex: 1;
    padding: 6px 12px;
    border: 1px solid #333;
    border-radius: 3px;
    cursor: pointer;
    font-size: 10px;
    font-weight: normal;
    transition: all 0.2s ease;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.3);
    text-shadow: 0 1px 1px rgba(0,0,0,0.8);
}

.enable-all-btn {
    background: linear-gradient(to bottom, #4CAF50 0%, #388E3C 100%);
    border-color: #2E7D32;
}

.disable-all-btn {
    background: linear-gradient(to bottom, #f44336 0%, #d32f2f 100%);
    border-color: #c62828;
}

.enable-all-btn:hover {
    background: linear-gradient(to bottom, #5CBF60 0%, #48A148 100%);
}

.disable-all-btn:hover {
    background: linear-gradient(to bottom, #f55346 0%, #e33f3f 100%);
}

.control-btn:active {
    background: linear-gradient(to bottom, #333 0%, #1a1a1a 100%);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
}

.addon-column {
    display: flex;
    flex-direction: column;
}

.refresh-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, #444 0%, #333 100%);
    border: 2px solid #ff6b35;
    border-radius: 8px;
    padding: 20px;
    max-width: 400px;
    z-index: 20000;
    box-shadow: 0 8px 24px rgba(0,0,0,0.8);
    color: #ffffff;
    font-family: Arial, sans-serif;
    text-align: center;
    animation: slideInFromTop 0.3s ease-out;
}

@keyframes slideInFromTop {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

.refresh-notification h3 {
    margin: 0 0 10px 0;
    color: #ff6b35;
    font-size: 16px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

.refresh-notification p {
    margin: 0 0 20px 0;
    font-size: 13px;
    line-height: 1.4;
    color: #ddd;
}

.refresh-notification-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.refresh-btn, .dismiss-btn {
    padding: 8px 16px;
    border: 1px solid #555;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.refresh-btn {
    background: linear-gradient(to bottom, #ff6b35 0%, #e55a2b 100%);
    color: #ffffff;
    border-color: #d44820;
}

.refresh-btn:hover {
    background: linear-gradient(to bottom, #ff7b45 0%, #f56a3b 100%);
}

.dismiss-btn {
    background: linear-gradient(to bottom, #666 0%, #444 100%);
    color: #ffffff;
    border-color: #333;
}

.dismiss-btn:hover {
    background: linear-gradient(to bottom, #777 0%, #555 100%);
}

@media (max-width: 680px) {
    .addon-menu {
        width: 95vw;
        max-width: 500px;
    }
    
    .addon-content {
        grid-template-columns: 1fr;
    }
    
    .addon-controls {
        flex-direction: column;
        gap: 4px;
    }
    
    .refresh-notification {
        max-width: 90vw;
        padding: 15px;
    }
    
    .refresh-notification-buttons {
        flex-direction: column;
    }
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

// Funkcja do zapisywania pozycji
    function savePosition(x, y) {
        setCookie('addon_manager_x', x.toString());
        setCookie('addon_manager_y', y.toString());
    }

// Funkcja do wczytywania pozycji
    function loadPosition() {
        const x = getAddonCookie('addon_manager_x');
        const y = getAddonCookie('addon_manager_y');
        return {
            x: x ? parseInt(x) : null,
            y: y ? parseInt(y) : null
        };
    }

function setRefreshRequired() {
    refreshRequired = true;
    updateHeaderRefreshInfo();
}

function updateHeaderRefreshInfo() {
    const header = document.querySelector('.addon-menu-header');
    if (!header) return;
    
    let refreshInfo = header.querySelector('.refresh-info');
    
    if (!refreshRequired) {
        refreshInfo?.remove();
        return;
    }
    
    if (refreshInfo) return;
    
    refreshInfo = document.createElement('span');
    refreshInfo.className = 'refresh-info';
    refreshInfo.innerHTML = ' <span style="color: #ff4444; font-weight: bold; font-size: 12px;">!Wymagane odświeżenie gry!</span>';
    header.appendChild(refreshInfo);
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

            // Zapisz pozycję po zakończeniu przeciągnięcia
            const rect = element.getBoundingClientRect();
            savePosition(rect.left, rect.top);

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
    function positionTooltip(helpIcon, tooltip) {
        const iconRect = helpIcon.getBoundingClientRect();
        const tooltipWidth = 280;
        const tooltipHeight = tooltip.offsetHeight || 60; // przybliżona wysokość

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Oblicz pozycję
        let left = iconRect.left + iconRect.width / 2 - tooltipWidth / 2;
        let top = iconRect.bottom + 8; // 8px poniżej ikony

        // Sprawdź czy tooltip nie wychodzi poza prawą krawędź
        if (left + tooltipWidth > viewportWidth - 10) {
            left = viewportWidth - tooltipWidth - 10;
        }

        // Sprawdź czy tooltip nie wychodzi poza lewą krawędź
        if (left < 10) {
            left = 10;
        }

        // Sprawdź czy tooltip nie wychodzi poza dolną krawędź
        if (top + tooltipHeight > viewportHeight - 10) {
            top = iconRect.top - tooltipHeight - 8; // Pokaż nad ikoną
            tooltip.classList.add('tooltip-above');
        } else {
            tooltip.classList.remove('tooltip-above');
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

// Create GUI - ZMIENIONA FUNKCJA
    function createGUI() {
        const container = document.createElement('div');
        container.className = 'addon-manager';

        // Wczytaj zapisaną pozycję
        const savedPosition = loadPosition();
        if (savedPosition.x !== null && savedPosition.y !== null) {
            container.style.left = savedPosition.x + 'px';
            container.style.top = savedPosition.y + 'px';
        } else {
            // Domyślna pozycja
            container.style.top = '10px';
            container.style.right = '10px';
        }

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'addon-toggle-btn';

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
updateHeaderRefreshInfo(); 
makeDraggable(menu, header);
menu.appendChild(header);

        // Kontener dla dodatków z dwiema kolumnami
        const content = document.createElement('div');
        content.className = 'addon-content';

        // Tworzenie dwóch kolumn
        const leftColumn = document.createElement('div');
        leftColumn.className = 'addon-column';


        const rightColumn = document.createElement('div');
        rightColumn.className = 'addon-column';

        // Podziel dodatki na dwie kolumny
        const addonEntries = Object.entries(loadedAddons);

        addonEntries.forEach(([addonId, addon], index) => {
            const item = document.createElement('div');
            item.className = 'addon-item';

            const info = document.createElement('div');
            info.id = `addon-${addon.config.id}`;
            info.className = 'addon-info';

            // Kontener dla nazwy i ikony pomocy
            const nameContainer = document.createElement('div');
            nameContainer.className = 'addon-name-container';

            const name = document.createElement('div');
            name.className = 'addon-name';
            name.textContent = addon.name;

            const helpIcon = document.createElement('div');
            helpIcon.className = 'addon-help-icon';
            helpIcon.textContent = '?';

// Tooltip z opisem
            const tooltip = document.createElement('div');
            tooltip.className = 'addon-tooltip';
            tooltip.textContent = addonConfig[addonId].description || 'Brak opisu dla tego dodatku.';

// Event listenery dla pokazywania/ukrywania tooltipa
            helpIcon.addEventListener('mouseenter', () => {
                document.body.appendChild(tooltip); // Dodaj tooltip do body
                positionTooltip(helpIcon, tooltip);
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });

            helpIcon.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 200);
            });

            nameContainer.appendChild(name);
            nameContainer.appendChild(helpIcon);

            const status = document.createElement('div');
            status.className = `addon-status ${addon.enabled ? 'enabled' : 'disabled'}`;
            status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';

            info.appendChild(nameContainer); // Zmienione z name na nameContainer
            info.appendChild(status);

            const switchElement = document.createElement('div');
            switchElement.className = `addon-switch ${addon.enabled ? 'active' : ''}`;

            switchElement.addEventListener('click', async () => {
                const success = await toggleAddon(addonId);
                if (success) {
                    switchElement.classList.toggle('active', addon.enabled);
                    status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';
                    status.className = `addon-status ${addon.enabled ? 'enabled' : 'disabled'}`;
                }
            });

            item.appendChild(info);
            item.appendChild(switchElement);

            // Dodaj do odpowiedniej kolumny (naprzemiennie)
            if (index % 2 === 0) {
                leftColumn.appendChild(item);
            } else {
                rightColumn.appendChild(item);
            }
        });

        content.appendChild(leftColumn);
        content.appendChild(rightColumn);

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

        menu.appendChild(content);
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

// Update GUI - ZMIENIONA FUNKCJA
    function updateGUI() {
        // Usuń istniejące menu i stwórz nowe z aktualnym stanem
        const existingManager = document.querySelector('.addon-manager');
        if (existingManager) {
            const position = {
                left: existingManager.style.left,
                top: existingManager.style.top
            };
            existingManager.remove();

            // Ponownie stwórz GUI z zachowaniem pozycji
            setTimeout(() => {
                createGUI();
                const newManager = document.querySelector('.addon-manager');
                if (newManager && position.left && position.top) {
                    newManager.style.left = position.left;
                    newManager.style.top = position.top;
                }
            }, 50);
        }
    }

// Inicjalizacja - załaduj wszystkie dodatki przy starcie
    loadAllAddons().then(() => {
        console.log('🚀 Manager dodatków gotowy!');
        console.log('Dostępne dodatki:', getAddonsList());

        // Stwórz GUI
        createGUI();

        // Globalne API do zarządzania dodatkami
        window.AddonManager = {
            enable: enableAddon,
            disable: disableAddon,
            toggle: toggleAddon,
            list: getAddonsList,
            isEnabled: (addonId) => {
                const addon = loadedAddons[addonId];
                return addon ? addon.enabled : false;
            },
            getAddon: (addonId) => loadedAddons[addonId],
            refresh: updateGUI,
        };

        console.log('🎮 Dostępne komendy w konsoli:');
        console.log('• AddonManager.enable("addon1") - włącz dodatek');
        console.log('• AddonManager.disable("addon1") - wyłącz dodatek');
        console.log('• AddonManager.toggle("addon1") - przełącz dodatek');
        console.log('• AddonManager.list() - lista wszystkich dodatków');
    }).catch(error => {
        console.error('❌ Błąd podczas inicjalizacji managera dodatków:', error);
    });

    // Obsługa błędów
    window.addEventListener('error', (e) => {
        if (e.filename && e.filename.includes('addon')) {
            console.error('Błąd w dodatku:', e.error);
        }
    });

    // Cleanup przy odświeżeniu strony
    window.addEventListener('beforeunload', () => {
        Object.keys(loadedAddons).forEach(addonId => {
            if (loadedAddons[addonId].enabled) {
                cleanupAddon(addonId);
            }
        });
    });

})();
