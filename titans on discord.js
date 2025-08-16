(function() {
    'use strict';

    // Śledzenie wykrytych tytanów
    let lastDetectedTitans = new Set();
const COOLDOWN_TIME = 5 * 60 * 1000;

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

    // Funkcje pomocnicze do localStorage
    function getWebhookUrl() {
        return localStorage.getItem('titanNotifierWebhook') || '';
    }

    function setWebhookUrl(url) {
        localStorage.setItem('titanNotifierWebhook', url);
    }

    function isNotifierEnabled() {
        return localStorage.getItem('titanNotifierEnabled') !== 'false';
    }

    function setNotifierEnabled(enabled) {
        localStorage.setItem('titanNotifierEnabled', enabled.toString());
        updateButtonAppearance();
    }

    function getTitanRoleIds() {
        return JSON.parse(localStorage.getItem('titanNotifierRoleIds') || '{}');
    }

    function setTitanRoleIds(roleIds) {
        localStorage.setItem('titanNotifierRoleIds', JSON.stringify(roleIds));
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
            showSettings();
        });
    }

    // Funkcja pokazywania ustawień
    function showSettings() {
        const modal = document.createElement('div');
        modal.className = 'titan-notifier-modal';

        const log = getNotificationLog();

        const logHtml = log.length > 0 ?
            log.map(entry => `
                <div class="titan-log-item">
                    <span class="titan-log-time">${entry.time}</span> -
                    <span class="titan-log-titan">${entry.titan}</span> (poziom ${entry.level})
                </div>
            `).join('') :
            '<div style="text-align: center; color: #a8dadc; font-style: italic; padding: 20px;">Brak powiadomień</div>';

        const enabled = isNotifierEnabled();
        const webhookUrl = getWebhookUrl();
        const roleIds = getTitanRoleIds();

        let statusClass = 'error';
        let statusText = 'Dodatek wyłączony';

        if (enabled && webhookUrl) {
            statusClass = '';
            statusText = 'Dodatek włączony i skonfigurowany';
        } else if (enabled && !webhookUrl) {
            statusClass = 'warning';
            statusText = 'Dodatek włączony, ale brak webhook URL';
        }

        // Lista najpopularniejszych tytanów do ustawienia ról
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
            {name: "Tanroth", level: 300},
            {name: "Kolga", level: 50},
            {name: "Duva", level: 90},
            {name: "Blodughadda", level: 130},
            {name: "Bara", level: 170},
            {name: "Unn", level: 210},
            {name: "Himinglava", level: 250},
            {name: "Hronn", level: 290}
        ];

        // Generuj ustawienia ról dla popularnych tytanów
        const roleSettingsHtml = popularTitans.map(titan => `
            <div class="titan-role-item">
                <span class="titan-name">${titan.name} (${titan.level} lvl)</span>
<input type="text" class="titan-setting-input titan-role-input"
       placeholder="ID roli, wiele ról przez przecinek, lub 'everyone'"
       value="${roleIds[titan.name] || ''}"
       data-titan="${titan.name}"
       ${!enabled ? 'disabled' : ''}>
            </div>
        `).join('');
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
        "Tanroth": "1302727746992214096",
        "Kolga": "1399319673014849597",
        "Duva": "1399319984391458847",
        "Blodughadda": "1399320060396441661",
        "Bara": "1399320131967914126",
        "Unn": "1399320273077010453",
        "Himinglava": "1399320341775519826",
        "Hronn": "1399321228044537968"
    }
};


        modal.innerHTML = `
            <div class="titan-notifier-dialog">
                <h3>Ustawienia</h3>

                <div class="titan-dialog-content">
                    <div class="titan-setting-group">
                        <label class="titan-setting-label">Status Dodatku:</label>
                        <div class="titan-toggle-container">
                            <label class="titan-toggle-switch">
                                <input type="checkbox" id="titan-notifier-enabled" ${enabled ? 'checked' : ''}>
                                <span class="titan-toggle-slider"></span>
                            </label>
                            <span>${enabled ? 'Włączony' : 'Wyłączony'}</span>
                        </div>
                        <div class="titan-setting-description">
                            Włącz lub wyłącz wysyłanie powiadomień o respawnach tytanów
                        </div>
                    </div>

                    <div class="titan-setting-group">
                        <label class="titan-setting-label">Discord Webhook URL:</label>
                        <input type="text" class="titan-setting-input" id="titan-webhook-url"
                               placeholder="https://discord.com/api/webhooks/..."
                               value="${webhookUrl}" ${!enabled ? 'disabled' : ''}>
                        <div class="titan-setting-description">
                            Aby utworzyć webhook: Serwer Discord → Edytuj kanał → Integracje → Webhooks → Nowy Webhook<br>
                            Dodatek może wykrywać tytanów z 5 sekundowym opóźnieniem
                        </div>
                    </div>
					<div class="titan-setting-group">
    <label class="titan-setting-label">Załaduj predefiniowane role dla świata:</label>
    <div style="display: flex; gap: 10px;">
        <select id="titan-world-select" class="titan-setting-select" ${!enabled ? 'disabled' : ''}>
            <option value="">-- Wybierz świat --</option>
            <option value="Lupus">Lupus</option>
        </select>
        <button class="titan-btn titan-btn-secondary" id="titan-load-world-roles" ${!enabled ? 'disabled' : ''}>Załaduj</button>
    </div>
    <div class="titan-setting-description">
        Automatycznie uzupełnij ID ról dla wybranego świata.
    </div>
</div>


                    <div class="titan-setting-group">
                        <label class="titan-setting-label">ID ról Discord dla pingów:</label>
<div class="titan-setting-description">
    Ustaw ID roli Discord dla popularnych tytanów. Zostanie ona wypingowana gdy tytan zrespi.<br>
    Aby otrzymać ID roli: Ustawienia serwera → Role → Kliknij prawym na rolę → Kopiuj ID<br>
    <strong>Wskazówki:</strong><br>
    • Wpisz "everyone" (bez cudzysłowów) aby pingować @everyone<br>
    • Aby pingować wiele ról, wpisz ID oddzielone przecinkami: 123456789,987654321<br>
    <strong>Uwaga:</strong> Dodatek wykrywa tytanów automatycznie, ale pingi działają tylko dla ustawionych ról.
</div>
                        <div class="titan-role-settings">
                            ${roleSettingsHtml}
                        </div>
                    </div>

                    <div class="titan-setting-group">
                        <label class="titan-setting-label">Ostatnie powiadomienia:</label>
                        <div class="titan-notification-log">
                            ${logHtml}
                        </div>
                    </div>
                </div>

                <div class="titan-status-info ${statusClass}">
                    <strong>Status:</strong> ${statusText}
                </div>

                <div class="titan-settings-buttons">
                    <button class="titan-btn titan-btn-secondary" id="titan-close-settings">Anuluj</button>
                    <button class="titan-btn titan-btn-primary" id="titan-save-settings">Zapisz ustawienia</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        const enabledCheckbox = modal.querySelector('#titan-notifier-enabled');
        const webhookInput = modal.querySelector('#titan-webhook-url');
        const roleInputs = modal.querySelectorAll('.titan-role-input');

        enabledCheckbox.onchange = () => {
            const isEnabled = enabledCheckbox.checked;
            webhookInput.disabled = !isEnabled;
            roleInputs.forEach(input => input.disabled = !isEnabled);
        };

        modal.querySelector('#titan-save-settings').onclick = () => {
            const enabled = enabledCheckbox.checked;
            const webhookUrl = webhookInput.value.trim();

            // Zbierz ID ról
            const newRoleIds = {};
            roleInputs.forEach(input => {
                const titanName = input.getAttribute('data-titan');
                const roleId = input.value.trim();
                if (roleId) {
                    newRoleIds[titanName] = roleId;
                }
            });

            setNotifierEnabled(enabled);
            setWebhookUrl(webhookUrl);
            setTitanRoleIds(newRoleIds);

            document.body.removeChild(modal);

            // Pokaż komunikat sukcesu
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                z-index: 10002; background: linear-gradient(135deg, #28a745, #20c997);
                color: white; padding: 12px 20px; border-radius: 8px;
                font-weight: bold; box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            `;
            successMsg.innerHTML = 'Ustawienia zapisane pomyślnie!';
            document.body.appendChild(successMsg);

            setTimeout(() => successMsg.remove(), 3000);
        };

        modal.querySelector('#titan-close-settings').onclick = () => {
            document.body.removeChild(modal);
        };
modal.querySelector('#titan-load-world-roles').onclick = () => {
    const selectedWorld = modal.querySelector('#titan-world-select').value;
    if (!selectedWorld || !predefinedWorldRoles[selectedWorld]) return;

    const rolesForWorld = predefinedWorldRoles[selectedWorld];
    roleInputs.forEach(input => {
        const titan = input.getAttribute('data-titan');
        if (rolesForWorld[titan]) {
            input.value = rolesForWorld[titan];
        }
    });

    // Ustaw także webhook dla Lupus
    if (selectedWorld === 'Lupus') {
        const webhookField = modal.querySelector('#titan-webhook-url');
        if (webhookField) {
            webhookField.value = 'https://discord.com/api/webhooks/1400588536910057492/4NyMnlFi3Nifrc3pmhywQ_UTNVVzh9qNXj0FdzFPTBcjiRnOWrIXNpbCiqoZjjunIBnY';
        }
    }

    // Komunikat potwierdzający
    const notice = document.createElement('div');
    notice.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: #ffc107; color: black; padding: 10px 20px;
        font-weight: bold; border-radius: 6px; z-index: 10003;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notice.textContent = `Wczytano ID ról i webhook dla świata: ${selectedWorld}`;
    document.body.appendChild(notice);
    setTimeout(() => notice.remove(), 3000);
};



        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    // Inicjalizacja
    function init() {
        // Dodaj style
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Utwórz przycisk ustawień
        const settingsButton = document.createElement('div');
        settingsButton.id = 'titan-notifier-button';
        settingsButton.innerHTML = '⚔️';

        // Przywróć zapisaną pozycję
        const savedPos = JSON.parse(localStorage.getItem('titanNotifierButtonPosition') || '{}');
        if (savedPos.x !== undefined && savedPos.y !== undefined) {
            settingsButton.style.left = `${savedPos.x}px`;
            settingsButton.style.top = `${savedPos.y}px`;
            settingsButton.style.right = 'auto';
        }

        document.body.appendChild(settingsButton);

        // Dodaj funkcję przeciągania
        makeDraggable(settingsButton);

        // Ustaw wygląd przycisku
        updateButtonAppearance();

        // Rozpocznij sprawdzanie respawnów co 10 sekund
        setInterval(checkTitanRespawns, 10000);

        console.log('Dodatek uruchomiony!');
    }

// Uruchom gdy strona się załaduje
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
