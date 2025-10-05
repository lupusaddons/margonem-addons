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

    const allowedUsers = ['6901372', '5676978', '9449685', '1406394', '9839862', '1193100', '9181569', '6680459', '829797', '6581687', '251614', '7949481', '9682982', '6591109', '2221811', '4116980', '5942859', '9434153', '6145947', '9550217', '6580761', '9376321', '6283400', '583750', '9695617', '4672322', '9085663', '7736753', '7712777', '6505636', '6555412', '3155337', '7466726', '4938276', '6770292', '6464617', '5090092', '9923077', '7246870', '8170184', '8631058', '6110079', '3449240', '7443491', '7617868', '9794893', '9803001', '8228619', '9668158', '5630085', '9442821', '5906841', '5801771', '5043069', '9545357', '9285345', '6558282', '5202780', '9452380', '8320962', '8889608', '8776354', '5641911', '6719921', '8986880', '5365202', '1763767', '8797715', '6036183', '9710930', '8187398', '7164363', '7844833', '3623690', '9153488', '5128087', '4540634', '5158011'];

    const userId = getCookie('user_id');
    if (!allowedUsers.includes(userId)) {
        console.log('🚫 Brak uprawnień dla użytkownika:', userId);
        return;
    }
    function waitForEngine() {
    return new Promise((resolve) => {
        if (typeof Engine !== 'undefined' && Engine.allInit && Engine.widgetManager && Engine.widgetManager.getDefaultWidgetSet) {
            resolve();
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkEngine);
        } else {
            checkEngine();
        }

        function checkEngine() {
            if (typeof Engine !== 'undefined' && Engine.allInit && Engine.widgetManager && Engine.widgetManager.getDefaultWidgetSet) {
                resolve();
                return;
            }

            if (document.readyState !== 'complete') {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        if (typeof Engine !== 'undefined' && Engine.allInit && Engine.widgetManager && Engine.widgetManager.getDefaultWidgetSet) {
                            resolve();
                        } else {
                            setTimeout(resolve, 2000);
                        }
                    }, 1000);
                });
            } else {
                setTimeout(resolve, 2000);
            }
        }
    });
}
let refreshRequired = false;

const addonConfig = {
      addon1: {
        id: 'players_online',
        name: 'Players Online',
        description: 'Wyświetla liczbę graczy online na serwerze, z podziałem na tytanów.',
        enabled: false,
        url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/players%20online.js'
    },
        addon2: {
        id: 'players_online_alarm',
        name: 'Players Online - Alarm',
        description: 'Wysyła wiadmość na discorda gdy liczba graczy online przekroczy określony próg.',
        enabled: false,
        url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/players%20online%20alarm.js'
    },
    addon3: {
        id: 'titans_on_discord',
        name: 'Titans on Discord',
        description: 'Wysyła powiadomienie na discorda gdy tytan zrespi.',
        enabled: false,
        url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/titans%20on%20discord.js'
    },
    addon4: {
        id: 'heroes_on_discord',
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
        },
        addon8: {
            id: 'quack',
            name: 'QUACK',
            description: 'QUAAAAAAAAAAAAAAAAAAAAAAAAAAAACK!',
            enabled: false,
            url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/quack.js'
        },
        addon9: {
            id: 'notif_styler',
            name: 'Chat&Notifs Styler',
            description: 'Zmienia czcionki i ich rozmiar. Dotyczy czatu w grze oraz powiadomień',
            enabled: false,
            url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/white%20notifs.js'
        },
        addon10: {
            id: 'resizable_timer',
            name: 'Resizable Timer',
            description: 'Dodaje możliwość zmiany wielkości okna minutnika',
            enabled: false,
            url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/minutnik.js'
        },
        addon11: {
            id: 'mushrooms_abusers',
            name: 'Mushrooms Abusers',
            description: 'Wykrywacz grzybków który wysyła na discorda ',
            enabled: false,
            url: 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/refs/heads/main/grzybki.js'
        },
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

                // Sprawdź zapisany stan i włącz dodatek jeśli był włączony
                const wasEnabled = loadAddonState(addonId);
                if (wasEnabled) {
                    try {
                        await addon.init();
                        addon.enabled = true;
                    } catch (error) {
                        console.error(`Błąd podczas przywracania ${config.name}:`, error);
                        addon.enabled = false;
                        saveAddonState(addonId, false);
                    }
                }
            } else {
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
            return true;
        }

        try {
            await addon.init();
            addon.enabled = true;
            saveAddonState(addonId, true); // Zapisz stan
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
            return true;
        }

        try {
            addon.destroy();
            addon.enabled = false;
            saveAddonState(addonId, false); // Zapisz stan

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


    function cleanupAddon(addonId) {
    }

const styles = `
.kwak-addon-manager {
    position: fixed;
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 12px;
}

.kwak-addon-toggle-btn {
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

.kwak-addon-toggle-btn:hover {
    background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%) !important;
    border-color: #444 !important;
    box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.15),
        inset 0 -1px 0 rgba(0,0,0,0.4),
        0 3px 6px rgba(0,0,0,0.6) !important;
}

.kwak-addon-toggle-btn:active {
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%) !important;
    box-shadow:
        inset 0 2px 4px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.05) !important;
    transform: translateY(1px) !important;
}

.kwak-addon-toggle-btn::before {
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

.kwak-addon-toggle-btn:hover::before {
    opacity: 1 !important;
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.7)) !important;
}

.kwak-addon-menu.active ~ .kwak-addon-toggle-btn {
    border-color: #4CAF50 !important;
    box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.2),
        inset 0 -1px 0 rgba(0,0,0,0.3),
        0 0 8px rgba(76, 175, 80, 0.3) !important;
}

.kwak-addon-menu {
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

.kwak-addon-menu.active {
    display: block;
   z-index: 999;
}

.kwak-addon-menu-header {
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

.kwak-addon-menu-header::before {
    content: '';
    width: 16px;
    height: 16px;
    background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    flex-shrink: 0;
}

.kwak-addon-close-btn {
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

.kwak-addon-close-btn:hover {
    background: linear-gradient(to bottom, #cc4444 0%, #aa2222 100%);
    border-color: #992222;
}

.kwak-addon-tabs {
    display: flex !important;
    background: linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%) !important;
    border-bottom: 1px solid #333 !important;
    margin: 0 !important;
    padding: 0 !important;
}

.kwak-addon-tab {
    flex: 1 !important;
    padding: 12px 16px !important;
    background: linear-gradient(to bottom, #333 0%, #222 100%) !important;
    border: none !important;
    border-right: 1px solid #111 !important;
    color: #ccc !important;
    font-size: 12px !important;
    font-weight: bold !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    position: relative !important;
    outline: none !important;
}

.kwak-addon-tab:last-child {
    border-right: none !important;
}

.kwak-addon-tab:hover {
    background: linear-gradient(to bottom, #444 0%, #333 100%) !important;
    color: #fff !important;
}

.kwak-addon-tab.active {
    background: linear-gradient(to bottom, #4CAF50 0%, #388E3C 100%) !important;
    color: #ffffff !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.2) !important;
}

.kwak-addon-tab.active::after {
    content: '' !important;
    position: absolute !important;
    bottom: -1px !important;
    left: 0 !important;
    right: 0 !important;
    height: 2px !important;
    background: #4CAF50 !important;
}

.kwak-tab-content {
    display: none !important;
}

.kwak-tab-content.active {
    display: block !important;
}

.kwak-custom-content {
    padding: 16px !important;
    color: #fff !important;
    text-align: center !important;
    font-size: 14px !important;
}

.kwak-addon-content {
    padding: 8px;
    max-height: 400px;
    overflow-y: auto;
    background: #2a2a2a;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    align-items: start;
}

.kwak-addon-content::-webkit-scrollbar {
    width: 12px;
}

.kwak-addon-content::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 6px;
}

.kwak-addon-content::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #555 0%, #333 100%);
    border-radius: 6px;
    border: 1px solid #222;
}

.kwak-addon-item {
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

.kwak-addon-item:hover {
    background: linear-gradient(to bottom, #555 0%, #444 100%);
    border-color: #333;
}

.kwak-addon-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
}

.kwak-addon-name-container {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
}

.kwak-addon-name {
    color: #ffffff;
    font-size: 12px;
    font-weight: normal;
    text-shadow: 0 1px 1px rgba(0,0,0,0.8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.kwak-addon-help-icon {
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

.kwak-addon-help-icon:hover {
    background: linear-gradient(to bottom, #777 0%, #555 100%);
    border-color: #444;
    transform: scale(1.1);
}

.kwak-addon-tooltip {
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

.kwak-addon-help-icon:hover .kwak-addon-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-2px);
}

.kwak-addon-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1a1a1a;
}

.kwak-addon-tooltip.tooltip-above::after {
    top: auto;
    bottom: 100%;
    border-top-color: transparent;
    border-bottom-color: #1a1a1a;
}

.kwak-addon-status {
    font-size: 9px;
    font-weight: normal;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.kwak-addon-status.enabled {
    color: #4CAF50;
}

.kwak-addon-status.disabled {
    color: #888;
}

.kwak-addon-switch {
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

.kwak-addon-switch.active {
    background: linear-gradient(to bottom, #4CAF50 0%, #388E3C 100%);
    border-color: #2E7D32;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.2), 0 0 4px rgba(76, 175, 80, 0.3);
}

.kwak-addon-switch::after {
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

.kwak-addon-switch.active::after {
    left: 19px;
    background: linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%);
    border-color: #ccc;
}

.kwak-addon-controls {
    margin: 0;
    padding: 8px;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    gap: 4px;
    background: #252525;
    grid-column: 1 / -1;
}

.kwak-control-btn {
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

.kwak-enable-all-btn {
    background: linear-gradient(to bottom, #4CAF50 0%, #388E3C 100%);
    border-color: #2E7D32;
}

.kwak-disable-all-btn {
    background: linear-gradient(to bottom, #f44336 0%, #d32f2f 100%);
    border-color: #c62828;
}

.kwak-enable-all-btn:hover {
    background: linear-gradient(to bottom, #5CBF60 0%, #48A148 100%);
}

.kwak-disable-all-btn:hover {
    background: linear-gradient(to bottom, #f55346 0%, #e33f3f 100%);
}

.kwak-control-btn:active {
    background: linear-gradient(to bottom, #333 0%, #1a1a1a 100%);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
}

.kwak-addon-column {
    display: flex;
    flex-direction: column;
}

.kwak-refresh-notification {
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

.kwak-refresh-notification h3 {
    margin: 0 0 10px 0;
    color: #ff6b35;
    font-size: 16px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

.kwak-refresh-notification p {
    margin: 0 0 20px 0;
    font-size: 13px;
    line-height: 1.4;
    color: #ddd;
}

.kwak-refresh-notification-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.kwak-refresh-btn, .dismiss-btn {
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

.kwak-refresh-btn {
    background: linear-gradient(to bottom, #ff6b35 0%, #e55a2b 100%);
    color: #ffffff;
    border-color: #d44820;
}

.kwak-refresh-btn:hover {
    background: linear-gradient(to bottom, #ff7b45 0%, #f56a3b 100%);
}

.kwak-dismiss-btn {
    background: linear-gradient(to bottom, #666 0%, #444 100%);
    color: #ffffff;
    border-color: #333;
}

.kwak-dismiss-btn:hover {
    background: linear-gradient(to bottom, #777 0%, #555 100%);
}

@media (max-width: 680px) {
    .kwak-addon-menu {
        width: 95vw;
        max-width: 500px;
    }

    .kwak-addon-content {
        grid-template-columns: 1fr;
    }

    .kwak-addon-controls {
        flex-direction: column;
        gap: 4px;
    }

    .kwak-refresh-notification {
        max-width: 90vw;
        padding: 15px;
    }

    .kwak-refresh-notification-buttons {
        flex-direction: column;
    }
.kwak-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: black;
    z-index: 99999999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.kwak-video {
    width: 100vw;
    height: 100vh;
    object-fit: contain;
}

.kwak-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(0,0,0,0.7);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 999999999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.kwak-close:hover {
    background: rgba(255,0,0,0.8);
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
    const header = document.querySelector('.kwak-addon-menu-header');
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


function createGUI() {
    // Stwórz menu
    const menu = document.createElement('div');
    menu.className = 'kwak-addon-menu';
    menu.style.display = 'none';

    // NOWE: Ustaw pozycję od razu podczas tworzenia
    const savedPosition = loadPosition();
    if (savedPosition.x !== null && savedPosition.y !== null) {
        menu.style.position = 'fixed';
        menu.style.left = savedPosition.x + 'px';
        menu.style.top = savedPosition.y + 'px';
    } else {
        // Jeśli nie ma zapisanej pozycji, ustaw domyślną pozycję poza ekranem
        // (zostanie wyśrodkowana w showAddonManager)
        menu.style.position = 'fixed';
        menu.style.left = '50%';
        menu.style.top = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
    }

    const header = document.createElement('div');
    header.className = 'kwak-addon-menu-header';
    header.textContent = `${userId} (${Engine.hero.d.nick}) - Pełny dostęp`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'kwak-addon-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.remove('active');
        menu.style.display = 'none';
    });

    header.appendChild(closeBtn);
    updateHeaderRefreshInfo();
    makeDraggable(menu, header);
    menu.appendChild(header);

    // NOWE: Dodaj zakładki
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'kwak-addon-tabs';

    const addonsTab = document.createElement('button');
    addonsTab.className = 'kwak-addon-tab active';
    addonsTab.textContent = 'Dodatki';
    addonsTab.addEventListener('click', () => switchTab('addons'));

    const customTab = document.createElement('button');
    customTab.className = 'kwak-addon-tab';
    customTab.textContent = 'Informacje';
    customTab.addEventListener('click', () => switchTab('custom'));

    tabsContainer.appendChild(addonsTab);
    tabsContainer.appendChild(customTab);
    menu.appendChild(tabsContainer);

    // NOWE: Kontener dla zawartości zakładek
    const tabContent = document.createElement('div');
    tabContent.className = 'kwak-tab-content';

    // Zakładka dodatków (istniejący kod)
    const addonsContent = document.createElement('div');
    addonsContent.id = 'addons-tab';
    addonsContent.className = 'kwak-tab-content active';

    // Kontener dla dodatków z dwiema kolumnami
    const content = document.createElement('div');
    content.className = 'kwak-addon-content';

    const leftColumn = document.createElement('div');
    leftColumn.className = 'kwak-addon-column';

    const rightColumn = document.createElement('div');
    rightColumn.className = 'kwak-addon-column';

    // Podziel dodatki na dwie kolumny
    const addonEntries = Object.entries(loadedAddons);

    addonEntries.forEach(([addonId, addon], index) => {
        const item = document.createElement('div');
        item.className = 'kwak-addon-item';

        const info = document.createElement('div');
        info.id = `addon-${addon.config.id}`;
        info.className = 'kwak-addon-info';

        const nameContainer = document.createElement('div');
        nameContainer.className = 'kwak-addon-name-container';

        const name = document.createElement('div');
        name.className = 'kwak-addon-name';
        name.textContent = addon.name;

        const helpIcon = document.createElement('div');
        helpIcon.className = 'kwak-addon-help-icon';
        helpIcon.textContent = '?';

        const tooltip = document.createElement('div');
        tooltip.className = 'kwak-addon-tooltip';
        tooltip.textContent = addonConfig[addonId].description || 'Brak opisu dla tego dodatku.';

        helpIcon.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
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
        status.className = `kwak-addon-status ${addon.enabled ? 'enabled' : 'disabled'}`;
        status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';

        info.appendChild(nameContainer);
        info.appendChild(status);

        const switchElement = document.createElement('div');
        switchElement.className = `kwak-addon-switch ${addon.enabled ? 'active' : ''}`;

        switchElement.addEventListener('click', async () => {
            const success = await toggleAddon(addonId);
            if (success) {
                switchElement.classList.toggle('active', addon.enabled);
                status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';
                status.className = `kwak-addon-status ${addon.enabled ? 'enabled' : 'disabled'}`;
            }
        });

        item.appendChild(info);
        item.appendChild(switchElement);

        if (index % 2 === 0) {
            leftColumn.appendChild(item);
        } else {
            rightColumn.appendChild(item);
        }
    });

    content.appendChild(leftColumn);
    content.appendChild(rightColumn);

    const controls = document.createElement('div');
    controls.className = 'kwak-addon-controls';

    const enableAllBtn = document.createElement('button');
    enableAllBtn.className = 'kwak-control-btn kwak-enable-all-btn';
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
    disableAllBtn.className = 'kwak-control-btn kwak-disable-all-btn';
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

    addonsContent.appendChild(content);
    addonsContent.appendChild(controls);

const customContent = document.createElement('div');
customContent.id = 'custom-tab';
customContent.className = 'kwak-tab-content';

const customContentText = document.createElement('div');
customContentText.className = 'kwak-custom-content';
customContentText.innerHTML = `
    <h3 style="color: #4CAF50; margin-bottom: 16px;">Kontakt</h3>
    <p>Discord: zabujczakwaczuszka</p>
    <p><a href="https://discord.gg/GXgmeRtkSt" target="_blank" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Serwer Discord</a></p>
    <p><a href="#" id="fake-pornhub-link" style="color: #FF0000; text-decoration: none; font-weight: bold;">Profil na Pornhubie</a></p>
    <p style="color: #888; font-size: 12px; margin-top: 16px;">kiedyś coś tu będzie.....</p>
`;

// Dodaj event listener do fake linku
customContentText.addEventListener('click', (e) => {
    if (e.target.id === 'fake-pornhub-link') {
        e.preventDefault(); // Zapobiega domyślnej akcji linku
        playCustomVideo(); // Odtwórz video
    }
});

customContent.appendChild(customContentText);

    menu.appendChild(addonsContent);
    menu.appendChild(customContent);

       function switchTab(tabName) {
        // Usuń aktywne klasy z zakładek
        const tabs = menu.querySelectorAll('.kwak-addon-tab');
        tabs.forEach(tab => tab.classList.remove('active'));

        // Usuń aktywne klasy z zawartości
        const contents = menu.querySelectorAll('.kwak-tab-content');
        contents.forEach(content => content.classList.remove('active'));

        // Dodaj aktywne klasy do wybranej zakładki i zawartości
        if (tabName === 'addons') {
            addonsTab.classList.add('active');
            addonsContent.classList.add('active');
        } else if (tabName === 'custom') {
            customTab.classList.add('active');
            customContent.classList.add('active');
        }
    }

    document.body.appendChild(menu);

    return menu;
}
function playCustomVideo() {
    // Sprawdź czy video już jest otwarte
    if (document.querySelector('.kwak-fullscreen')) return;

    // Stwórz fullscreen container
    const fullscreen = document.createElement('div');
    fullscreen.className = 'kwak-fullscreen';

    // Przycisk zamknięcia
    const closeBtn = document.createElement('button');
    closeBtn.className = 'kwak-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = closeVideo;

    // Video element
    const video = document.createElement('video');
    video.className = 'kwak-video';
    video.src = 'https://github.com/krystianasaaa/margonem-addons/raw/refs/heads/main/videos/heheheh.mp4';
    video.autoplay = true;
    video.volume = 0.7;

    // Auto-zamknięcie po skończeniu
    video.onended = closeVideo;

    // ESC = zamknij
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeVideo();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Dodaj elementy
    fullscreen.appendChild(closeBtn);
    fullscreen.appendChild(video);
    document.body.appendChild(fullscreen);

    function closeVideo() {
        const fs = document.querySelector('.kwak-fullscreen');
        if (fs) {
            fs.remove();
        }
        document.removeEventListener('keydown', escHandler);
    }
}
function createAddonWidget() {
    const logoImage = 'https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png';

    waitForEngine().then(() => {
        if (!Engine || !Engine.widgetManager || !Engine.widgetManager.getDefaultWidgetSet) {
            return;
        }

        try {
            const serverStoragePos = Engine.serverStorage.get(
                Engine.widgetManager.getPathToHotWidgetVersion()
            );
            let emptyWidgetSlot = Engine.widgetManager.getFirstEmptyWidgetSlot();
            emptyWidgetSlot = [emptyWidgetSlot.slot, emptyWidgetSlot.container];
            let WidgetPosition = serverStoragePos?.ADDON_MANAGER ? serverStoragePos.ADDON_MANAGER : emptyWidgetSlot;

            Engine.widgetManager.getDefaultWidgetSet().ADDON_MANAGER = {
                keyName: 'ADDON_MANAGER',
                index: WidgetPosition[0],
                pos: WidgetPosition[1],
                txt: 'Kaczor Addons',
                type: 'normal',
                alwaysExist: true,
                default: true,
                clb: () => {
                    // Wywołaj globalną funkcję do pokazania menu
                    if (window.showAddonManager) {
                        window.showAddonManager();
                    }
                }
            };

            Engine.widgetManager.createOneWidget('ADDON_MANAGER', { ADDON_MANAGER: WidgetPosition }, true, []);
            Engine.widgetManager.setEnableDraggingButtonsWidget(false);

            let iconStyle = document.createElement('style');
            iconStyle.innerHTML = `
            .main-buttons-container .widget-button .icon.ADDON_MANAGER {
                background-image: none !important;
                background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%) !important;
                border: 2px solid #333 !important;
                border-radius: 4px !important;
                box-shadow:
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    inset 0 -1px 0 rgba(0,0,0,0.3),
                    0 2px 4px rgba(0,0,0,0.5) !important;
                width: 44px !important;
                height: 44px !important;
                max-width: 44px !important;
                max-height: 44px !important;
                min-width: 44px !important;
                min-height: 44px !important;
                box-sizing: border-box !important;
                margin: 0 !important;
                padding: 0 !important;
                top: 0 !important;
                left: 0 !important;
                position: relative !important;
                transition: all 0.2s ease !important;
                overflow: hidden !important;
            }

                .main-buttons-container .widget-button .icon.ADDON_MANAGER::before {
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
                    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.5)) !important;
                }

                .main-buttons-container .widget-button .icon.ADDON_MANAGER:hover {
                    background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%) !important;
                    border-color: #444 !important;
                    box-shadow:
                        inset 0 1px 0 rgba(255,255,255,0.15),
                        inset 0 -1px 0 rgba(0,0,0,0.4),
                        0 3px 6px rgba(0,0,0,0.6) !important;
                }

                .main-buttons-container .widget-button .icon.ADDON_MANAGER:hover::before {
                    opacity: 1 !important;
                    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.7)) !important;
                }

                .main-buttons-container .widget-button .icon.ADDON_MANAGER:active {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%) !important;
                    box-shadow:
                        inset 0 2px 4px rgba(0,0,0,0.5),
                        inset 0 1px 0 rgba(255,255,255,0.05) !important;
                    transform: translateY(1px) !important;
                }

                .main-buttons-container .widget-button.ADDON_MANAGER {
                    border: none !important;
                    background: transparent !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }

                .main-buttons-container .widget-button.ADDON_MANAGER .widget-button-background {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    display: none !important;
                }

                .main-buttons-container .widget-button.ADDON_MANAGER::before,
                .main-buttons-container .widget-button.ADDON_MANAGER::after {
                    display: none !important;
                }
            `;
            document.head.appendChild(iconStyle);
        } catch (error) {
            console.error('Błąd podczas tworzenia widgetu addon managera:', error);
        }
    });
}

// Update GUI - ZMIENIONA FUNKCJA
    function updateGUI() {
        // Usuń istniejące menu i stwórz nowe z aktualnym stanem
        const existingManager = document.querySelector('.kwak-addon-manager');
        if (existingManager) {
            const position = {
                left: existingManager.style.left,
                top: existingManager.style.top
            };
            existingManager.remove();

            // Ponownie stwórz GUI z zachowaniem pozycji
            setTimeout(() => {
                createGUI();
                const newManager = document.querySelector('.kwak-addon-manager');
                if (newManager && position.left && position.top) {
                    newManager.style.left = position.left;
                    newManager.style.top = position.top;
                }
            }, 50);
        }
    }


loadAllAddons().then(() => {
    // 1. Najpierw stwórz menu
    const menu = createGUI();

window.showAddonManager = function() {
    menu.style.display = 'block';
    menu.classList.add('active');

    // Jeśli menu nie ma zapisanej pozycji (transform: translate), wyśrodkuj je
    if (menu.style.transform && menu.style.transform.includes('translate')) {
        setTimeout(() => {
            const rect = menu.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const left = Math.max(0, (viewportWidth - rect.width) / 2);
            const top = Math.max(0, (viewportHeight - rect.height) / 2);

            menu.style.left = left + 'px';
            menu.style.top = top + 'px';
            menu.style.transform = 'none'; // Usuń transform po ustawieniu pozycji

            // Zapisz wyśrodkowaną pozycję
            savePosition(left, top);
        }, 10);
    }
};

    // 3. Na końcu stwórz widget (który już może używać showAddonManager)
    if (typeof Engine !== 'undefined') {
        createAddonWidget();
    }

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
        show: () => window.showAddonManager?.()
    };
}).catch(error => {
    console.error('Błąd podczas inicjalizacji managera dodatków:', error);
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
