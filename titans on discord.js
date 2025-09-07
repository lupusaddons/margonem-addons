(function() {
    'use strict';
if (window.titanNotifierRunning) {
    console.log('Titans on Discord już działa - pomijam duplikat');
    return;
}
window.titanNotifierRunning = true;
window.addEventListener('error', function(e) {
    if (e.filename && e.filename.includes('titans')) {
        e.preventDefault();
        return false;
    }
});
let config = {
    enabled: localStorage.getItem('titanNotifierEnabled') !== 'false',
    webhookUrl: localStorage.getItem('titanNotifierWebhook') || '',
    roleIds: JSON.parse(localStorage.getItem('titanNotifierRoleIds') || '{}')
};

function saveConfig() {
    localStorage.setItem('titanNotifierEnabled', config.enabled.toString());
    localStorage.setItem('titanNotifierWebhook', config.webhookUrl);
    localStorage.setItem('titanNotifierRoleIds', JSON.stringify(config.roleIds));
    updateButtonAppearance();
}
const predefinedWorldRoles = {
    "Lupus": {
        "Dziewicza Orlica": "1302727499830263891",
        "Zabójczy Królik": "1302727521929789451",
        "Renegat Baulus": "1302727536031301632",
        "Piekielny Arcymag": "1302727613135065218",
        "Versus Zoons": "1302727635536711740",
        "Łowczyni Wspomnień": "1302727657326252175",
        "Przyzywacz Demonów": "1302727672845045800",
        "Maddok Magua": "1302727693632143471",
        "Tezcatlipoca": "1302727709188685904",
        "Barbatos Smoczy Strażnik": "1302727725764706405",
        "Tanroth": "1302727746992214096"
    }
};

    // Śledzenie wykrytych tytanów
    let lastDetectedTitans = new Set();
const COOLDOWN_TIME = 5 * 60 * 1000;
let titanCheckInterval = null;

    const styles = `
        #titan-notifier-button {
            position: fixed;
            top: 20px;
            right: 70px;
            background: linear-gradient(135deg, #7b2cbf, #9d4edd);
            border: 2px solid #7b2cbf;
            color: white;
            padding: 8px;
            border-radius: 50%;
            cursor: move;
            font-size: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            z-index: 9999;
            transition: all 0.2s;
            user-select: none;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #titan-notifier-button:hover {
            transform: scale(1.05) rotate(15deg);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        #titan-notifier-button.disabled {
            background: linear-gradient(135deg, #666, #888);
            border-color: #666;
            opacity: 0.7;
        }

        .titan-notifier-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .titan-notifier-dialog {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #7b2cbf;
            border-radius: 12px;
            padding: 25px;
            width: 600px;
            max-width: 90vw;
            max-height: 85vh;
            color: #e8f4fd;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .titan-notifier-dialog h3 {
            margin-top: 0;
            color: #9d4edd;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            flex-shrink: 0;
        }

        .titan-dialog-content {
            overflow-y: auto;
            flex: 1;
            padding-right: 15px;
            margin-right: -15px;
        }

        /* Niestandardowe stylowanie scrollbara */
        .titan-dialog-content {
            scrollbar-width: thin;
            scrollbar-color: #7b2cbf rgba(0,0,0,0.2);
        }

        .titan-dialog-content::-webkit-scrollbar {
            width: 12px;
        }

        .titan-dialog-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
            border-radius: 6px;
        }

        .titan-dialog-content::-webkit-scrollbar-thumb {
            background: #7b2cbf;
            border-radius: 6px;
            border: 2px solid rgba(0,0,0,0.2);
        }

        .titan-dialog-content::-webkit-scrollbar-thumb:hover {
            background: #9d4edd;
        }

        .titan-setting-group {
            margin-bottom: 20px;
        }

        .titan-setting-label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #a8dadc;
            font-size: 14px;
        }

        .titan-setting-input {
            width: 100%;
            padding: 10px;
            background: rgba(157,78,221,0.2);
            border: 1px solid #7b2cbf;
            border-radius: 6px;
            color: #e8f4fd;
            font-size: 14px;
            box-sizing: border-box;
        }

        .titan-setting-input:focus {
            outline: none;
            border-color: #9d4edd;
            box-shadow: 0 0 10px rgba(157,78,221,0.3);
        }

        .titan-setting-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .titan-setting-description {
            font-size: 12px;
            color: #a8dadc;
            margin-top: 5px;
            line-height: 1.4;
        }

        .titan-toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .titan-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .titan-toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #666;
            transition: .4s;
            border-radius: 34px;
        }

        .titan-toggle-slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .titan-toggle-slider {
            background-color: #9d4edd;
        }

        input:checked + .titan-toggle-slider:before {
            transform: translateX(26px);
        }

        .titan-toggle-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .titan-status-info {
            background: rgba(40, 167, 69, 0.1);
            border: 1px solid #28a745;
            border-radius: 6px;
            padding: 12px;
            margin: 15px 0;
            flex-shrink: 0;
        }

        .titan-status-info.error {
            background: rgba(220, 53, 69, 0.1);
            border-color: #dc3545;
        }

        .titan-status-info.warning {
            background: rgba(255, 193, 7, 0.1);
            border-color: #ffc107;
            color: #ffc107;
        }

        .titan-settings-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 25px;
            flex-shrink: 0;
        }

        .titan-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .titan-btn-primary {
            background: #9d4edd;
            color: white;
        }

        .titan-btn-primary:hover {
            background: #7b2cbf;
        }

        .titan-btn-secondary {
            background: #666;
            color: white;
        }

        .titan-btn-secondary:hover {
            background: #555;
        }

        .titan-role-settings {
            background: rgba(157,78,221,0.1);
            border: 1px solid #7b2cbf;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }

        .titan-role-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 10px;
            padding: 8px;
            background: rgba(0,0,0,0.2);
            border-radius: 6px;
        }

        .titan-role-item:last-child {
            margin-bottom: 0;
        }

        .titan-name {
            min-width: 180px;
            font-weight: bold;
            color: #9d4edd;
            font-size: 13px;
        }

        .titan-role-input {
            flex: 1;
            max-width: 200px;
        }

        .titan-notification-log {
            max-height: 150px;
            overflow-y: auto;
            background: rgba(0,0,0,0.3);
            border: 1px solid #7b2cbf;
            border-radius: 6px;
            padding: 10px;
            scrollbar-width: thin;
            scrollbar-color: #7b2cbf rgba(0,0,0,0.2);
        }

        .titan-notification-log::-webkit-scrollbar {
            width: 8px;
        }

        .titan-notification-log::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
            border-radius: 4px;
        }

        .titan-notification-log::-webkit-scrollbar-thumb {
            background: #7b2cbf;
            border-radius: 4px;
        }

        .titan-notification-log::-webkit-scrollbar-thumb:hover {
            background: #9d4edd;
        }

        .titan-log-item {
            font-size: 11px;
            margin-bottom: 5px;
            padding: 5px;
            background: rgba(157,78,221,0.1);
            border-radius: 4px;
        }

        .titan-log-time {
            color: #a8dadc;
            font-style: italic;
        }

        .titan-log-titan {
            font-weight: bold;
            color: #9d4edd;
        }
		.titan-setting-select {
    width: 100%;
    padding: 10px;
    background: rgba(157,78,221,0.2);
    border: 1px solid #7b2cbf;
    border-radius: 6px;
    color: #e8f4fd;
    font-size: 14px;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg fill="%23e8f4fd" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.516 7.548a.75.75 0 0 1 1.06 0L10 10.97l3.424-3.422a.75.75 0 0 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06z"/></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px 16px;
}

.titan-setting-select:focus {
    outline: none;
    border-color: #9d4edd;
    box-shadow: 0 0 10px rgba(157,78,221,0.3);
}

.titan-setting-select option {
    background: #1a1a2e;
    color: #e8f4fd;
}

    `;

function getWebhookUrl() {
    return config.webhookUrl;
}

function setWebhookUrl(url) {
    config.webhookUrl = url;
    saveConfig();
}

function isNotifierEnabled() {
    return config.enabled;
}

function setNotifierEnabled(enabled) {
    config.enabled = enabled;
    saveConfig();
}

function getTitanRoleIds() {
    return config.roleIds;
}

function setTitanRoleIds(roleIds) {
    config.roleIds = roleIds;
    saveConfig();
}
    function getNotificationLog() {
        return JSON.parse(localStorage.getItem('titanNotifierLog') || '[]');
    }

    function addToNotificationLog(titanName, titanLevel) {
        const log = getNotificationLog();
        const newEntry = {
            time: new Date().toLocaleString('pl-PL'),
            titan: titanName,
            level: titanLevel
        };

        log.unshift(newEntry);
        if (log.length > 15) log.splice(15);

        localStorage.setItem('titanNotifierLog', JSON.stringify(log));
    }
function updateButtonAppearance() {
        const button = document.getElementById('titan-notifier-button');
        if (button) {
            if (isNotifierEnabled()) {
                button.classList.remove('disabled');
                button.title = 'Dodatek włączony - kliknij aby otworzyć ustawienia';
            } else {
                button.classList.add('disabled');
                button.title = 'Dodatek wyłączony - kliknij aby otworzyć ustawienia';
            }
        }
    }

async function sendTitanRespawnNotification(titanName, titanLevel, titanData = {}) {
    const webhookUrl = getWebhookUrl();
    if (!webhookUrl || !isNotifierEnabled()) return false;

    const timestamp = new Date().toLocaleString('pl-PL');
    const roleIds = getTitanRoleIds();
    const roleId = roleIds[titanName];

    // NOWA LOGIKA: Obsługa wielu ról i @everyone
    let rolePing = '';
    if (roleId) {
        if (roleId.toLowerCase() === 'everyone') {
            rolePing = '@everyone';
        } else {
            // Obsługa wielu ID ról oddzielonych przecinkami
            const roleIdsList = roleId.split(',').map(id => id.trim()).filter(id => id);
            rolePing = roleIdsList.map(id => `<@&${id}>`).join(' ');
        }
    }

    // Pobierz dodatkowe informacje
    const worldName = window.location.hostname.split('.')[0] || 'Nieznany';
    const mapName = titanData.mapName || getCurrentMapName() || 'Nieznana mapa';
    const finderName = titanData.finderName || getCurrentPlayerName() || 'Nieznany gracz';

    const embed = {
        title: `!#TYTAN#!`,
        description: `**${titanName} (Lvl ${titanLevel})**\n\n` +
                    `**Mapa:** ${mapName}\n` +
                    `**Znalazł:** ${finderName}\n` +
                    `**Świat:** ${worldName}`,
        color: 0x9d4edd,
        footer: {
            text: `Kaczor Addons - Titans on Discord • ${timestamp}`
        },
        timestamp: new Date().toISOString()
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: rolePing, // ZMIANA: Ping roli jest teraz w content (poza embedem)
                embeds: [embed]    // Embed bez pingu
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Błąd wysyłania powiadomienia na Discord:', error);
        return false;
    }
}
function getCurrentMapName() {
    try {
        // Próbuj różne sposoby pobrania nazwy mapy
        if (typeof Engine !== 'undefined') {
            if (Engine.map && Engine.map.d && Engine.map.d.name) {
                return Engine.map.d.name;
            }
            if (Engine.map && Engine.map.name) {
                return Engine.map.name;
            }
            if (Engine.gameMap && Engine.gameMap.name) {
                return Engine.gameMap.name;
            }
        }

        // Sprawdź czy istnieje globalna zmienna z mapą
        if (typeof map !== 'undefined' && map.name) {
            return map.name;
        }

        // Sprawdź w HTML - niektóre gry wyświetlają nazwę mapy w interfejsie
        const mapElement = document.querySelector('.map-name, #map-name, [class*="map"]');
        if (mapElement && mapElement.textContent) {
            return mapElement.textContent.trim();
        }

        return 'Nieznana mapa';
    } catch (error) {
        console.error('Błąd pobierania nazwy mapy:', error);
        return 'Nieznana mapa';
    }
}

function getCurrentPlayerName() {
    try {
        // Próbuj różne sposoby pobrania nazwy gracza
        if (typeof Engine !== 'undefined') {
            if (Engine.hero && Engine.hero.d && Engine.hero.d.nick) {
                return Engine.hero.d.nick;
            }
            if (Engine.hero && Engine.hero.nick) {
                return Engine.hero.nick;
            }
            if (Engine.player && Engine.player.nick) {
                return Engine.player.nick;
            }
        }

        // Sprawdź czy istnieje globalna zmienna z graczem
        if (typeof hero !== 'undefined' && hero.nick) {
            return hero.nick;
        }

        // Sprawdź w HTML - nazwa gracza często jest wyświetlana w interfejsie
        const playerElement = document.querySelector('.player-name, #player-name, [class*="nick"], [class*="player"]');
        if (playerElement && playerElement.textContent) {
            return playerElement.textContent.trim();
        }

        return 'Nieznany gracz';
    } catch (error) {
        console.error('Błąd pobierania nazwy gracza:', error);
        return 'Nieznany gracz';
    }
}

    // Funkcja sprawdzająca respawn tytanów
// Funkcja sprawdzająca respawn tytanów - KOMPLETNA WERSJA
async function checkTitanRespawns() {
    if (!isNotifierEnabled()) return;

    try {
        if (typeof Engine === 'undefined' || !Engine.npcs) return;
        let npcs = [];

        // Próbuj różne metody dostępu do NPC-ów
        if (Engine.npcs.check && typeof Engine.npcs.check === 'function') {
            try {
                const npcCheck = Engine.npcs.check();
                if (npcCheck && typeof npcCheck === 'object') {
                    npcs = Object.entries(npcCheck);
                }
            } catch (e) {}
        }

        if (npcs.length === 0 && Engine.npcs.list) {
            try {
                npcs = Object.entries(Engine.npcs.list);
            } catch (e) {}
        }

        if (npcs.length === 0 && Engine.map && Engine.map.npcs) {
            try {
                npcs = Object.entries(Engine.map.npcs);
            } catch (e) {}
        }

        const currentTitans = new Set();

        // Przejrzyj wszystkich NPC-ów
        for (const [npcId, npcData] of npcs) {
            try {
                let titanName = null;
                let titanLevel = null;
                let titanWt = null;

                // Różne struktury danych w zależności od metody
                if (npcData && npcData.d) {
                    const titanData = npcData.d;
                    titanName = titanData.nick || titanData.name;
                    titanLevel = titanData.lvl || titanData.elasticLevel;
                    titanWt = titanData.wt;
                } else if (npcData && npcData[1] && npcData[1].d) {
                    const titanData = npcData[1].d;
                    titanName = titanData.nick || titanData.name;
                    titanLevel = titanData.lvl || titanData.wt;
                    titanWt = titanData.wt;
                } else if (npcData && typeof npcData === 'object') {
                    titanName = npcData.nick || npcData.name;
                    titanLevel = npcData.lvl || npcData.elasticLevel || npcData.wt;
                    titanWt = npcData.wt;
                }

                // Sprawdź czy to tytan (wt > 99)
                if (titanWt && titanWt > 99) {
                    const finalTitanName = titanName || 'Nieznany Tytan';
                    const finalTitanLevel = titanLevel || titanWt;
                    const titanKey = `${npcId}_${finalTitanName}_${finalTitanLevel}`;

                    currentTitans.add(titanKey);

                    // TUTAJ JEST CAŁY KOD KTÓRY BYŁ POZA FUNKCJĄ:
                    if (!lastDetectedTitans.has(titanKey)) {
                        const notificationKey = `${finalTitanName}_${finalTitanLevel}`;
                        const sentTitans = JSON.parse(localStorage.getItem('titanNotifierSentTitans') || '{}');
                        const lastSent = sentTitans[notificationKey] || 0;
                        const now = Date.now();

                        if (now - lastSent > COOLDOWN_TIME) {
                            const additionalData = {
                                mapName: getCurrentMapName(),
                                finderName: getCurrentPlayerName(),
                                npcData: npcData
                            };

                            // TERAZ await JEST WEWNĄTRZ FUNKCJI async - TO JEST OK!
                            const success = await sendTitanRespawnNotification(finalTitanName, finalTitanLevel, additionalData);
                            if (success) {
                                addToNotificationLog(finalTitanName, finalTitanLevel);
                                sentTitans[notificationKey] = now;
                                localStorage.setItem('titanNotifierSentTitans', JSON.stringify(sentTitans));
                            }
                        }
                    }
                }

            } catch (error) {
                console.error(`Błąd przy przetwarzaniu NPC ${npcId}:`, error);
            }
        }

        // Zaktualizuj listę wykrytych tytanów
        lastDetectedTitans = currentTitans;

    } catch (error) {
        console.error('Błąd w głównym bloku try:', error);
    }
} // <- TUTAJ KOŃCZY SIĘ FUNKCJA async

    // Funkcja przeciągania przycisku
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        let hasMoved = false;

        element.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isDragging = true;
            hasMoved = false;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            hasMoved = true;
            const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - element.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - element.offsetHeight);
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.right = 'auto';

            localStorage.setItem('titanNotifierButtonPosition', JSON.stringify({x, y}));
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        element.addEventListener('click', (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            return;
        });
    }

    // Funkcja pokazywania ustawień
 function addManagerSettingsButton(container) {
    const helpIcon = container.querySelector('.kwak-addon-help-icon');
    if (!helpIcon) return;

    const settingsBtn = document.createElement('span');
    settingsBtn.id = 'titans-on-discord-settings-btn';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.style.cssText = `
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        margin-left: 2px;
        opacity: 0.7;
        transition: opacity 0.2s;
        display: inline-block;
    `;

    settingsBtn.onmouseover = () => settingsBtn.style.opacity = '1';
    settingsBtn.onmouseout = () => settingsBtn.style.opacity = '0.7';

    // Wstaw dokładnie po znaku zapytania
    helpIcon.insertAdjacentElement('afterend', settingsBtn);

    // Stwórz panel od razu
    createSettingsPanel();

    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSettingsPanel();
    });
}
function loadPredefinedSettings() {
    const worldName = window.location.hostname.split('.')[0] || 'Unknown';
    
    if (predefinedWorldRoles[worldName]) {
        const worldRoles = predefinedWorldRoles[worldName];
        const lupusWebhook = "https://discord.com/api/webhooks/1400588536910057492/4NyMnlFi3Nifrc3pmhywQ_UTNVVzh9qNXj0FdzFPTBcjiRnOWrIXNpbCiqoZjjunIBnY";
        
        config.webhookUrl = lupusWebhook;
        config.roleIds = { ...worldRoles };
        config.enabled = true;
        
        saveConfig();
        
        // Odśwież panel ustawień jeśli jest otwarty
        const panel = document.getElementById('titans-on-discord-settings-panel');
        if (panel && panel.style.display === 'block') {
            toggleSettingsPanel();
            setTimeout(() => toggleSettingsPanel(), 100);
        }
        
        return true;
    }
    
    return false;
}

function createSettingsPanel() {
    const panel = document.createElement('div');
    panel.id = 'titans-on-discord-settings-panel';
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 15px;
        z-index: 10000;
        display: none;
        min-width: 350px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    `;

    const popularTitans = [
        {name: "Dziewicza Orlica", level: 51},
        {name: "Zabójczy Królik", level: 70},
        {name: "Renegat Baulus", level: 101},
        {name: "Piekielny Arcymag", level: 131},
        {name: "Versus Zoons", level: 154},
        {name: "Łowczyni Wspomnień", level: 177},
        {name: "Przyzywacz Demonów", level: 204},
        {name: "Maddok Magua", level: 231},
        {name: "Tezcatlipoca", level: 258},
        {name: "Barbatos Smoczy Strażnik", level: 285},
        {name: "Tanroth", level: 300}
    ];

    const worldName = window.location.hostname.split('.')[0] || 'Unknown';
    const hasPredefSettings = predefinedWorldRoles[worldName];

    panel.innerHTML = `
        <div style="color: #fff; font-size: 14px; margin-bottom: 12px; text-align: center; font-weight: bold; padding-bottom: 8px; border-bottom: 1px solid #444;">
            Titans on Discord - Settings
        </div>

        <div style="margin-bottom: 15px;">
<div style="margin-bottom: 15px; padding: 12px; background: rgba(157,78,221,0.1); border: 1px solid #7b2cbf; border-radius: 6px;">
    <div style="color: #a8dadc; font-size: 12px; margin-bottom: 8px; font-weight: bold;">Załaduj predefiniowane role dla świata:</div>
    <div style="display: flex; gap: 8px; align-items: center;">
        <select id="world-selector" style="flex: 1; padding: 6px; background: #555; color: #fff; border: 1px solid #666; border-radius: 3px; font-size: 11px;">
            <option value="">— Wybierz Świat —</option>
            <option value="Lupus">Lupus</option>
        </select>
        <button id="load-predefined-settings" style="padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
            Załaduj
        </button>
    </div>
    <div style="color: #888; font-size: 10px; margin-top: 5px;">Automatycznie uzupełni ID ról dla wybranego świata.</div>
</div>

            <div style="margin-bottom: 10px;">
                <span style="color: #ccc; font-size: 12px; display: block; margin-bottom: 5px;">Discord Webhook URL:</span>
                <input type="text" id="titan-webhook" style="width: 100%; padding: 5px; background: #555; color: #fff; border: 1px solid #666; border-radius: 3px; font-size: 11px;" value="${config.webhookUrl}" placeholder="https://discord.com/api/webhooks/...">
            </div>

            <div style="color: #ccc; font-size: 11px; margin-bottom: 10px;">
                Role Discord (ID roli lub 'everyone'):
            </div>
            ${popularTitans.map(titan => `
                <div style="margin: 5px 0; display: flex; align-items: center;">
                    <span style="color: #aaa; font-size: 10px; min-width: 120px;">${titan.name} (${titan.level})</span>
                    <input type="text" data-titan="${titan.name}" style="flex: 1; margin-left: 8px; padding: 3px; background: #555; color: #fff; border: 1px solid #666; border-radius: 2px; font-size: 10px;" value="${config.roleIds[titan.name] || ''}" placeholder="ID roli">
                </div>
            `).join('')}
        </div>

        <div style="display: flex; gap: 8px; margin-top: 12px; border-top: 1px solid #444; padding-top: 12px;">
            <button id="close-titans-settings" style="flex: 1; padding: 8px 12px; background: #555; color: #ccc; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                Zamknij
            </button>
            <button id="save-titans-settings" style="flex: 1; padding: 8px 12px; background: #9d4edd; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold;">
                Zapisz
            </button>
        </div>
    `;

    // Usuń stare style jeśli istnieją
    const oldStyles = document.getElementById('titans-toggle-styles');
    if (oldStyles) oldStyles.remove();

    document.body.appendChild(panel);

// Event listener dla przycisku ładowania predefiniowanych ustawień
const loadBtn = panel.querySelector('#load-predefined-settings');
const worldSelector = panel.querySelector('#world-selector');
if (loadBtn && worldSelector) {
    loadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedWorld = worldSelector.value;
        
        if (!selectedWorld) {
            loadBtn.style.background = '#dc3545';
            loadBtn.textContent = '⚠️ Wybierz świat!';
            setTimeout(() => {
                loadBtn.style.background = '#4CAF50';
                loadBtn.textContent = 'Załaduj';
            }, 2000);
            return;
        }
        
        if (predefinedWorldRoles[selectedWorld]) {
            const worldRoles = predefinedWorldRoles[selectedWorld];
            const lupusWebhook = "https://discord.com/api/webhooks/1400588536910057492/4NyMnlFi3Nifrc3pmhywQ_UTNVVzh9qNXj0FdzFPTBcjiRnOWrIXNpbCiqoZjjunIBnY";
            
            config.webhookUrl = lupusWebhook
            config.roleIds = { ...worldRoles };
            config.enabled = true;
            saveConfig();
            
            // Odśwież wartości w panelu
            panel.querySelector('#titan-webhook').value = config.webhookUrl;
            panel.querySelectorAll('input[data-titan]').forEach(input => {
                const titanName = input.getAttribute('data-titan');
                input.value = config.roleIds[titanName] || '';
            });
            
            // Pokaż komunikat sukcesu
            loadBtn.style.background = '#28a745';
            loadBtn.textContent = '✅ Załadowano!';
            setTimeout(() => {
                loadBtn.style.background = '#4CAF50';
                loadBtn.textContent = 'Załaduj';
            }, 2000);
        }
    });
}

    panel.querySelector('#save-titans-settings').addEventListener('click', (e) => {
        e.preventDefault();
        config.enabled = true; // Automatycznie włącz po zapisaniu
        config.webhookUrl = panel.querySelector('#titan-webhook').value.trim();
        
        const newRoleIds = {};
        panel.querySelectorAll('input[data-titan]').forEach(input => {
            const titanName = input.getAttribute('data-titan');
            const roleId = input.value.trim();
            if (roleId) newRoleIds[titanName] = roleId;
        });
        config.roleIds = newRoleIds;
        
        saveConfig();
        toggleSettingsPanel();
    });

    panel.querySelector('#close-titans-settings').addEventListener('click', (e) => {
        e.preventDefault();
        toggleSettingsPanel();
    });
}

function toggleSettingsPanel() {
    const panel = document.getElementById('titans-on-discord-settings-panel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}
function integrateWithAddonManager() {
    const checkForManager = setInterval(() => {
        const addonContainer = document.getElementById('addon-titans_on_discord');
        if (!addonContainer) return;

        // Sprawdź czy przycisk już istnieje
        if (addonContainer.querySelector('#titans-on-discord-settings-btn')) {
            clearInterval(checkForManager);
            return;
        }

        let addonNameContainer = addonContainer.querySelector('.kwak-addon-name-container');
        if (addonNameContainer) {
            addManagerSettingsButton(addonNameContainer);
            clearInterval(checkForManager);
        }
    }, 500);

    // Zatrzymaj po 20 sekundach jeśli nie znajdzie managera
    setTimeout(() => clearInterval(checkForManager), 20000);
}

function init() {
    const existingButton = document.getElementById('titan-notifier-button');
    if (existingButton) {
        existingButton.remove();
        console.log('Usunięto duplikat przycisku Titans on Discord');
    }
    
    if (titanCheckInterval) {
        clearInterval(titanCheckInterval);
    }
    
    // Dodaj style
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // Rozpocznij sprawdzanie respawnów co 10 sekund
    titanCheckInterval = setInterval(checkTitanRespawns, 10000);
    
    // ZMIEŃ TĘ LINIĘ - dodaj try/catch:
    try {
        integrateWithAddonManager();
    } catch (error) {
        console.warn('Addon manager integration failed:', error);
    }
    
    console.log('Dodatek uruchomiony!');
}


// Uruchom gdy strona się załaduje
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
