(function() {
    'use strict';

    // Śledzenie wykrytych tytanów
    let lastDetectedHeroes = new Set();
const COOLDOWN_TIME = 5 * 60 * 1000;

    const styles = `
        #hero-notifier-button {
            position: fixed;
            top: 20px;
            right: 110px;
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

        #hero-notifier-button:hover {
            transform: scale(1.05) rotate(15deg);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        #hero-notifier-button.disabled {
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
    return localStorage.getItem('heroNotifierWebhook') || '';
}

function setWebhookUrl(url) {
    localStorage.setItem('heroNotifierWebhook', url);
}

function isNotifierEnabled() {
    return localStorage.getItem('heroNotifierEnabled') !== 'false';
}

function setNotifierEnabled(enabled) {
    localStorage.setItem('heroNotifierEnabled', enabled.toString());
    updateButtonAppearance();
}

function getHeroRoleIds() {
    return JSON.parse(localStorage.getItem('heroNotifierRoleIds') || '{}');
}

function setHeroRoleIds(roleIds) {
    localStorage.setItem('heroNotifierRoleIds', JSON.stringify(roleIds));
}

function getNotificationLog() {
    return JSON.parse(localStorage.getItem('heroNotifierLog') || '[]');
}

function addToNotificationLog(heroName, heroLevel) {
    const log = getNotificationLog();
    const newEntry = {
        time: new Date().toLocaleString('pl-PL'),
        hero: heroName,
        level: heroLevel
    };

    log.unshift(newEntry);
    if (log.length > 15) log.splice(15);

    localStorage.setItem('heroNotifierLog', JSON.stringify(log));
}

function updateButtonAppearance() {
    const button = document.getElementById('hero-notifier-button'); // ZMIANA: było titan
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

async function sendHeroRespawnNotification(heroName, heroLevel, heroData = {}) {
    const webhookUrl = getWebhookUrl();
    if (!webhookUrl || !isNotifierEnabled()) return false;

    const timestamp = new Date().toLocaleString('pl-PL');
    const roleIds = getHeroRoleIds(); // ZMIANA: było getTitanRoleIds()
    const roleId = roleIds[heroName];   // ZMIANA: było titanName

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
    const mapName = heroData.mapName || getCurrentMapName() || 'Nieznana mapa';  // ZMIANA: było titanData
    const finderName = heroData.finderName || getCurrentPlayerName() || 'Nieznany gracz';  // ZMIANA: było titanData

    const embed = {
        title: `!#HEROS#!`,
        description: `**${heroName} (Lvl ${heroLevel})**\n\n` +
                    `**Mapa:** ${mapName}\n` +
                    `**Znalazł:** ${finderName}\n` +
                    `**Świat:** ${worldName}`,
        color: 0xdc3545,
        footer: {
            text: `Kaczor Addons - Heroes on Discord • ${timestamp}`
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
                content: rolePing,
                embeds: [embed]
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

async function checkHeroRespawns() {
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

        const currentHeroes = new Set();

        // Lista prawdziwych herosów
        const heroNames = [
            "Domina Ecclesiae", "Mietek Żul", "Mroczny Patryk", "Karmazynowy Mściciel",
            "Złodziej", "Zły Przewodnik", "Opętany Paladyn", "Piekielny Kościej",
            "Koziec Mąciciel Ścieżek", "Kochanka Nocy", "Książę Kasim", "Święty Braciszek",
            "Złoty Roger", "Baca bez Łowiec", "Czarująca Atalia", "Obłąkany Łowca Orków",
            "Lichwiarz Grauhaz", "Viviana Nandin", "Mulher Ma", "Demonis Pan Nicości",
            "Vapor Veneno", "Dęborożec", "Tepeyollotl", "Negthotep Czarny Kapłan", "Młody Smok"
        ];

        // Przejrzyj wszystkich NPC-ów
        for (const [npcId, npcData] of npcs) {
            try {
                let heroName = null;
                let heroLevel = null;
                let heroWt = null;

                // Różne struktury danych w zależności od metody
                if (npcData && npcData.d) {
                    const heroData = npcData.d;
                    heroName = heroData.nick || heroData.name;
                    heroLevel = heroData.lvl || heroData.elasticLevel;
                    heroWt = heroData.wt;
                } else if (npcData && npcData[1] && npcData[1].d) {
                    const heroData = npcData[1].d;
                    heroName = heroData.nick || heroData.name;
                    heroLevel = heroData.lvl || heroData.wt;
                    heroWt = heroData.wt;
                } else if (npcData && typeof npcData === 'object') {
                    heroName = npcData.nick || npcData.name;
                    heroLevel = npcData.lvl || npcData.elasticLevel || npcData.wt;
                    heroWt = npcData.wt;
                }

                // Sprawdź czy to hero po nazwie (nie po wt!)
                if (heroName && heroNames.includes(heroName)) {
                    const heroKey = `${npcId}_${heroName}_${heroLevel}`;
                    currentHeroes.add(heroKey);

                    // TYLKO POKAŻ OKNO - NIE WYSYŁAJ AUTOMATYCZNIE!
                    if (!lastDetectedHeroes.has(heroKey)) {
                        const notificationKey = `${heroName}_${heroLevel}`;
                        const shownHeroes = JSON.parse(localStorage.getItem('heroNotifierShownHeroes') || '{}');
                        const lastShown = shownHeroes[notificationKey] || 0;
                        const now = Date.now();

                        // Pokaż okno tylko raz na 5 minut dla tego samego herosa
                        if (now - lastShown > COOLDOWN_TIME) {
                            const additionalData = {
                                mapName: getCurrentMapName(),
                                finderName: getCurrentPlayerName(),
                                npcData: npcData
                            };

                            // TYLKO POKAŻ OKNO - bez automatycznego wysyłania
                            showHeroDetectionWindow(heroName, heroLevel, additionalData);

                            // Zapamiętaj że okno zostało pokazane
                            shownHeroes[notificationKey] = now;
                            localStorage.setItem('heroNotifierShownHeroes', JSON.stringify(shownHeroes));
                        }
                    }
                }

            } catch (error) {
                console.error(`Błąd przy przetwarzaniu NPC ${npcId}:`, error);
            }
        }

        // Zaktualizuj listę wykrytych herosów
        lastDetectedHeroes = currentHeroes;

    } catch (error) {
        console.error('Błąd w głównym bloku try:', error);
    }
}

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

            localStorage.setItem('heroNotifierButtonPosition', JSON.stringify({x, y}));
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
function showHeroDetectionWindow(heroName, heroLevel, heroData = {}) {
    // Sprawdź czy okno już istnieje
    if (document.getElementById('hero-detection-window')) return;

    const mapName = heroData.mapName || getCurrentMapName() || 'Nieznana mapa';
    const finderName = heroData.finderName || getCurrentPlayerName() || 'Nieznany gracz';
    const worldName = window.location.hostname.split('.')[0] || 'Nieznany';

    const gameWindow = document.createElement('div');
    gameWindow.id = 'hero-detection-window';
    gameWindow.style.cssText = `
        position: fixed;
        top: 50%;
        left: 20%;
        transform: translate(-50%, -50%);
        width: 320px;
        background: linear-gradient(135deg, #2e1a1a, #3e1616);
        border: 3px solid #dc3545;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.7);
        z-index: 9998;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #e8f4fd;
        user-select: none;
    `;

    gameWindow.innerHTML = `
        <div style="background: linear-gradient(135deg, #dc3545, #fd7e14); padding: 10px; border-radius: 8px 8px 0 0; cursor: move;" id="hero-window-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 14px;">🛡️ Wykryto Herosa!</span>
                <button style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;" id="hero-window-close">×</button>
            </div>
        </div>

        <div style="padding: 15px;">
            <div style="text-align: center; margin-bottom: 12px;">
                <div style="font-size: 16px; color: #fd7e14; font-weight: bold; margin-bottom: 3px;">
                    ${heroName}
                </div>
                <div style="font-size: 14px; color: #dc3545;">
                    Poziom: ${heroLevel}
                </div>
            </div>

            <div style="background: rgba(220,53,69,0.1); border: 1px solid #dc3545; border-radius: 6px; padding: 8px; margin: 10px 0; font-size: 11px;">
                <div><strong>Mapa:</strong> ${mapName}</div>
                <div><strong>Znalazł:</strong> ${finderName}</div>
                <div><strong>Świat:</strong> ${worldName}</div>
                <div><strong>Czas:</strong> ${new Date().toLocaleString('pl-PL')}</div>
            </div>

            <div style="margin: 10px 0;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #fd7e14; font-size: 12px;">Dodatkowa wiadomość:</label>
                <textarea id="hero-custom-message" placeholder="Wpisz dodatkową wiadomość (opcjonalne)..."
                          style="width: 100%; height: 45px; padding: 6px; background: rgba(157,78,221,0.2); border: 1px solid #dc3545; border-radius: 4px; color: #e8f4fd; font-size: 11px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 15px;">
                <button id="hero-cancel-btn" style="flex: 1; padding: 8px; background: #666; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; font-size: 12px;">Anuluj</button>
                <button id="hero-send-btn" style="flex: 1; padding: 8px; background: #dc3545; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; font-size: 12px;">Wyślij</button>
            </div>
        </div>
    `;

    document.body.appendChild(gameWindow);

    // Funkcjonalność przeciągania
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const header = gameWindow.querySelector('#hero-window-header');
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - gameWindow.getBoundingClientRect().left;
        dragOffsetY = e.clientY - gameWindow.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - gameWindow.offsetWidth);
        const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - gameWindow.offsetHeight);
        gameWindow.style.left = `${x}px`;
        gameWindow.style.top = `${y}px`;
        gameWindow.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Event listeners dla przycisków
    gameWindow.querySelector('#hero-window-close').onclick = () => {
        document.body.removeChild(gameWindow);
    };

    gameWindow.querySelector('#hero-cancel-btn').onclick = () => {
        document.body.removeChild(gameWindow);
    };

    gameWindow.querySelector('#hero-send-btn').onclick = async () => {
        const customMessage = gameWindow.querySelector('#hero-custom-message').value.trim();

        // TUTAJ DOPIERO WYSYŁAJ webhook z custom message
        const success = await sendHeroRespawnNotificationWithMessage(heroName, heroLevel, {
            ...heroData,
            customMessage: customMessage
        });

        if (success) {
            addToNotificationLog(heroName, heroLevel);

            // Mini komunikat sukcesu w oknie gry
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px;
                background: #28a745; color: white; padding: 8px 12px;
                border-radius: 6px; font-weight: bold; z-index: 9999;
                font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            successMsg.textContent = 'Powiadomienie wysłane!';
            document.body.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 2000);
        } else {
            // Mini komunikat błędu
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px;
                background: #dc3545; color: white; padding: 8px 12px;
                border-radius: 6px; font-weight: bold; z-index: 9999;
                font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            errorMsg.textContent = 'Błąd wysyłania!';
            document.body.appendChild(errorMsg);
            setTimeout(() => errorMsg.remove(), 2000);
        }

        document.body.removeChild(gameWindow);
    };
}function showHeroDetectionWindow(heroName, heroLevel, heroData = {}) {
    // Sprawdź czy okno już istnieje
    if (document.getElementById('hero-detection-window')) return;

    const mapName = heroData.mapName || getCurrentMapName() || 'Nieznana mapa';
    const finderName = heroData.finderName || getCurrentPlayerName() || 'Nieznany gracz';
    const worldName = window.location.hostname.split('.')[0] || 'Nieznany';

    const gameWindow = document.createElement('div');
    gameWindow.id = 'hero-detection-window';
    gameWindow.style.cssText = `
        position: fixed;
        top: 50%;
        left: 20%;
        transform: translate(-50%, -50%);
        width: 320px;
        background: linear-gradient(135deg, #2e1a1a, #3e1616);
        border: 3px solid #dc3545;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.7);
        z-index: 9998;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #e8f4fd;
        user-select: none;
    `;

    gameWindow.innerHTML = `
        <div style="background: linear-gradient(135deg, #dc3545, #fd7e14); padding: 10px; border-radius: 8px 8px 0 0; cursor: move;" id="hero-window-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: bold; font-size: 14px;">🛡️ Wykryto Herosa!</span>
                <button style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;" id="hero-window-close">×</button>
            </div>
        </div>

        <div style="padding: 15px;">
            <div style="text-align: center; margin-bottom: 12px;">
                <div style="font-size: 16px; color: #fd7e14; font-weight: bold; margin-bottom: 3px;">
                    ${heroName}
                </div>
                <div style="font-size: 14px; color: #dc3545;">
                    Poziom: ${heroLevel}
                </div>
            </div>

            <div style="background: rgba(220,53,69,0.1); border: 1px solid #dc3545; border-radius: 6px; padding: 8px; margin: 10px 0; font-size: 11px;">
                <div><strong>Mapa:</strong> ${mapName}</div>
                <div><strong>Znalazł:</strong> ${finderName}</div>
                <div><strong>Świat:</strong> ${worldName}</div>
                <div><strong>Czas:</strong> ${new Date().toLocaleString('pl-PL')}</div>
            </div>

            <div style="margin: 10px 0;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #fd7e14; font-size: 12px;">Dodatkowa wiadomość:</label>
                <textarea id="hero-custom-message" placeholder="Wpisz dodatkową wiadomość (opcjonalne)..."
                          style="width: 100%; height: 45px; padding: 6px; background: rgba(157,78,221,0.2); border: 1px solid #dc3545; border-radius: 4px; color: #e8f4fd; font-size: 11px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 15px;">
                <button id="hero-cancel-btn" style="flex: 1; padding: 8px; background: #666; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; font-size: 12px;">Anuluj</button>
                <button id="hero-send-btn" style="flex: 1; padding: 8px; background: #dc3545; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; font-size: 12px;">Wyślij</button>
            </div>
        </div>
    `;

    document.body.appendChild(gameWindow);

    // Funkcjonalność przeciągania
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const header = gameWindow.querySelector('#hero-window-header');
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - gameWindow.getBoundingClientRect().left;
        dragOffsetY = e.clientY - gameWindow.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const x = Math.min(Math.max(0, e.clientX - dragOffsetX), window.innerWidth - gameWindow.offsetWidth);
        const y = Math.min(Math.max(0, e.clientY - dragOffsetY), window.innerHeight - gameWindow.offsetHeight);
        gameWindow.style.left = `${x}px`;
        gameWindow.style.top = `${y}px`;
        gameWindow.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Event listeners dla przycisków
    gameWindow.querySelector('#hero-window-close').onclick = () => {
        document.body.removeChild(gameWindow);
    };

    gameWindow.querySelector('#hero-cancel-btn').onclick = () => {
        document.body.removeChild(gameWindow);
    };

    gameWindow.querySelector('#hero-send-btn').onclick = async () => {
        const customMessage = gameWindow.querySelector('#hero-custom-message').value.trim();

        // TUTAJ DOPIERO WYSYŁAJ webhook z custom message
        const success = await sendHeroRespawnNotificationWithMessage(heroName, heroLevel, {
            ...heroData,
            customMessage: customMessage
        });

        if (success) {
            addToNotificationLog(heroName, heroLevel);

            // Mini komunikat sukcesu w oknie gry
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px;
                background: #28a745; color: white; padding: 8px 12px;
                border-radius: 6px; font-weight: bold; z-index: 9999;
                font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            successMsg.textContent = 'Powiadomienie wysłane!';
            document.body.appendChild(successMsg);
            setTimeout(() => successMsg.remove(), 2000);
        } else {
            // Mini komunikat błędu
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px;
                background: #dc3545; color: white; padding: 8px 12px;
                border-radius: 6px; font-weight: bold; z-index: 9999;
                font-size: 11px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            errorMsg.textContent = 'Błąd wysyłania!';
            document.body.appendChild(errorMsg);
            setTimeout(() => errorMsg.remove(), 2000);
        }

        document.body.removeChild(gameWindow);
    };
}
async function sendHeroRespawnNotificationWithMessage(heroName, heroLevel, heroData = {}) {
    const webhookUrl = getWebhookUrl();
    if (!webhookUrl || !isNotifierEnabled()) return false;

    const timestamp = new Date().toLocaleString('pl-PL');
    const roleIds = getHeroRoleIds();
    const roleId = roleIds[heroName];

    // Obsługa wielu ról i @everyone
    let rolePing = '';
    if (roleId) {
        if (roleId.toLowerCase() === 'everyone') {
            rolePing = '@everyone';
        } else {
            const roleIdsList = roleId.split(',').map(id => id.trim()).filter(id => id);
            rolePing = roleIdsList.map(id => `<@&${id}>`).join(' ');
        }
    }

    // Pobierz dodatkowe informacje
    const worldName = window.location.hostname.split('.')[0] || 'Nieznany';
    const mapName = heroData.mapName || getCurrentMapName() || 'Nieznana mapa';
    const finderName = heroData.finderName || getCurrentPlayerName() || 'Nieznany gracz';
    const customMessage = heroData.customMessage || '';

    // Dodaj custom message do opisu jeśli istnieje
    let description = `**${heroName} (Lvl ${heroLevel})**\n\n` +
                     `**Mapa:** ${mapName}\n` +
                     `**Znalazł:** ${finderName}\n` +
                     `**Świat:** ${worldName}`;

    if (customMessage) {
        description += `\n\n**Wiadomość:** ${customMessage}`;
    }

    const embed = {
        title: `!#HEROS#!`,
        description: description,
        color: 0xdc3545,
        footer: {
            text: `Kaczor Addons - Heroes on Discord • ${timestamp}`
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
                content: rolePing,
                embeds: [embed]
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Błąd wysyłania powiadomienia na Discord:', error);
        return false;
    }
}

function showSettings() {
    const modal = document.createElement('div');
    modal.className = 'titan-notifier-modal'; // można zostawić nazwy klas CSS

    const log = getNotificationLog();

    const logHtml = log.length > 0 ?
        log.map(entry => `
            <div class="titan-log-item">
                <span class="titan-log-time">${entry.time}</span> -
                <span class="titan-log-titan">${entry.hero}</span> (poziom ${entry.level})
            </div>
        `).join('') :
        '<div style="text-align: center; color: #a8dadc; font-style: italic; padding: 20px;">Brak powiadomień</div>';

    const enabled = isNotifierEnabled();
    const webhookUrl = getWebhookUrl();
    const roleIds = getHeroRoleIds(); // ZMIANA: było getTitanRoleIds()

    let statusClass = 'error';
    let statusText = 'Dodatek wyłączony';

    if (enabled && webhookUrl) {
        statusClass = '';
        statusText = 'Dodatek włączony i skonfigurowany';
    } else if (enabled && !webhookUrl) {
        statusClass = 'warning';
        statusText = 'Dodatek włączony, ale brak webhook URL';
    }

    // Lista najpopularniejszych herosów (ZMIANA: były tutaj tytany)
const popularHeroes = [
    {name: "Domina Ecclesiae", level: 21},
    {name: "Mietek Żul", level: 25},
    {name: "Mroczny Patryk", level: 35},
    {name: "Karmazynowy Mściciel", level: 45},
    {name: "Złodziej", level: 51},
    {name: "Zły Przewodnik", level: 63},
    {name: "Opętany Paladyn", level: 74},
    {name: "Piekielny Kościej", level: 85},
    {name: "Koziec Mąciciel Ścieżek", level: 94},
    {name: "Kochanka Nocy", level: 102},
    {name: "Książę Kasim", level: 116},
    {name: "Święty Braciszek", level: 123},
    {name: "Złoty Roger", level: 135},
    {name: "Baca bez Łowiec", level: 144},
    {name: "Czarująca Atalia", level: 157},
    {name: "Obłąkany Łowca Orków", level: 165},
    {name: "Lichwiarz Grauhaz", level: 177},
    {name: "Viviana Nandin", level: 184},
    {name: "Mulher Ma", level: 197},
    {name: "Demonis Pan Nicości", level: 210},
    {name: "Vapor Veneno", level: 227},
    {name: "Dęborożec", level: 242},
    {name: "Tepeyollotl", level: 260},
    {name: "Negthotep Czarny Kapłan", level: 271},
    {name: "Młody Smok", level: 282}
];

    // ZMIANA: było popularTitans
    const roleSettingsHtml = popularHeroes.map(hero => `
        <div class="titan-role-item">
            <span class="titan-name">${hero.name} (${hero.level} lvl)</span>
            <input type="text" class="titan-setting-input titan-role-input"
                   placeholder="ID roli, wiele ról przez przecinek, lub 'everyone'"
                   value="${roleIds[hero.name] || ''}"
                   data-titan="${hero.name}"
                   ${!enabled ? 'disabled' : ''}>
        </div>
    `).join('');

const predefinedWorldRoles = {
    "Lupus": {
        "Domina Ecclesiae": "",  
        "Mietek Żul": "",
        "Mroczny Patryk": "1302725605611147315,1302725718165159978",
        "Karmazynowy Mściciel": "1302725605611147315,1302725718165159978",
        "Złodziej": "1302725605611147315,1302725718165159978",
        "Zły Przewodnik": "1302725718165159978,1302725761152843826",
        "Opętany Paladyn": "1302725761152843826",
        "Piekielny Kościej": "1302725761152843826,1302726330613502055",
        "Koziec Mąciciel Ścieżek": "1302725761152843826,1302726330613502055",
        "Kochanka Nocy": "1302725761152843826,1302726330613502055",
        "Książę Kasim": "1302726330613502055,1302726521219448973",
        "Święty Braciszek": "1302726330613502055,1302726521219448973",
        "Złoty Roger": "1302726521219448973",
        "Baca bez Łowiec": "1302726521219448973,1302726541385404426",
        "Czarująca Atalia": "1302726541385404426",
        "Obłąkany Łowca Orków": "1302726541385404426,1302726620716601425",
        "Lichwiarz Grauhaz": "1302726541385404426,1302726620716601425",
        "Viviana Nandin": "1302726620716601425,1302726646645653575",
        "Mulher Ma": "1302726620716601425,1302726646645653575",
        "Demonis Pan Nicości": "1302726646645653575,1302726731941023784",
        "Vapor Veneno": "1302726646645653575,1302726731941023784,1302726761381101675",
        "Dęborożec": "1302726761381101675,1302726786559246407",
        "Tepeyollotl": "1302726786559246407,1302726826384425171",
        "Negthotep Czarny Kapłan": "1302726786559246407,1302726826384425171",
        "Młody Smok": "1302726826384425171"
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
                            <input type="checkbox" id="hero-notifier-enabled" ${enabled ? 'checked' : ''}>
                            <span class="titan-toggle-slider"></span>
                        </label>
                        <span>${enabled ? 'Włączony' : 'Wyłączony'}</span>
                    </div>
                    <div class="titan-setting-description">
                        Włącz lub wyłącz wysyłanie powiadomień o respawnach herosów
                    </div>
                </div>

                <div class="titan-setting-group">
                    <label class="titan-setting-label">Discord Webhook URL:</label>
                    <input type="text" class="titan-setting-input" id="hero-webhook-url"
                           placeholder="https://discord.com/api/webhooks/..."
                           value="${webhookUrl}" ${!enabled ? 'disabled' : ''}>
                    <div class="titan-setting-description">
                        Aby utworzyć webhook: Serwer Discord → Edytuj kanał → Integracje → Webhooks → Nowy Webhook<br>
                        Dodatek może wykrywać herosów z 5 sekundowym opóźnieniem
                    </div>
                </div>

                <div class="titan-setting-group">
                    <label class="titan-setting-label">Załaduj predefiniowane role dla świata:</label>
                    <div style="display: flex; gap: 10px;">
                        <select id="hero-world-select" class="titan-setting-select" ${!enabled ? 'disabled' : ''}>
                            <option value="">-- Wybierz świat --</option>
                            <option value="Lupus">Lupus</option>
                        </select>
                        <button class="titan-btn titan-btn-secondary" id="hero-load-world-roles" ${!enabled ? 'disabled' : ''}>Załaduj</button>
                    </div>
                    <div class="titan-setting-description">
                        Automatycznie uzupełnij ID ról dla wybranego świata.
                    </div>
                </div>

                <div class="titan-setting-group">
                    <label class="titan-setting-label">ID ról Discord dla pingów:</label>
                    <div class="titan-setting-description">
                        Ustaw ID roli Discord dla popularnych herosów. Zostanie ona wypingowana gdy heros zrespi.<br>
                        Aby otrzymać ID roli: Ustawienia serwera → Role → Kliknij prawym na rolę → Kopiuj ID<br>
                        <strong>Wskazówki:</strong><br>
                        • Wpisz "everyone" (bez cudzysłowów) aby pingować @everyone<br>
                        • Aby pingować wiele ról, wpisz ID oddzielone przecinkami: 123456789,987654321<br>
                        <strong>Uwaga:</strong> Dodatek wykrywa herosów automatycznie, ale pingi działają tylko dla ustawionych ról.
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
                <button class="titan-btn titan-btn-secondary" id="hero-close-settings">Anuluj</button>
                <button class="titan-btn titan-btn-primary" id="hero-save-settings">Zapisz ustawienia</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners - TUTAJ BYŁY BŁĘDY W ID
    const enabledCheckbox = modal.querySelector('#hero-notifier-enabled'); // ZMIANA: było titan
    const webhookInput = modal.querySelector('#hero-webhook-url'); // ZMIANA: było titan
    const roleInputs = modal.querySelectorAll('.titan-role-input');

    enabledCheckbox.onchange = () => {
        const isEnabled = enabledCheckbox.checked;
        webhookInput.disabled = !isEnabled;
        roleInputs.forEach(input => input.disabled = !isEnabled);
    };

    modal.querySelector('#hero-save-settings').onclick = () => { // ZMIANA: było titan
        const enabled = enabledCheckbox.checked;
        const webhookUrl = webhookInput.value.trim();

        // Zbierz ID ról
        const newRoleIds = {};
        roleInputs.forEach(input => {
            const heroName = input.getAttribute('data-titan'); // można zostawić data-titan
            const roleId = input.value.trim();
            if (roleId) {
                newRoleIds[heroName] = roleId;
            }
        });

        setNotifierEnabled(enabled);
        setWebhookUrl(webhookUrl);
        setHeroRoleIds(newRoleIds); // ZMIANA: było setTitanRoleIds

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

    modal.querySelector('#hero-close-settings').onclick = () => { // ZMIANA: było titan
        document.body.removeChild(modal);
    };

    modal.querySelector('#hero-load-world-roles').onclick = () => { // ZMIANA: było titan
        const selectedWorld = modal.querySelector('#hero-world-select').value; // ZMIANA: było titan
        if (!selectedWorld || !predefinedWorldRoles[selectedWorld]) return;

        const rolesForWorld = predefinedWorldRoles[selectedWorld];
        roleInputs.forEach(input => {
            const hero = input.getAttribute('data-titan');
            if (rolesForWorld[hero]) {
                input.value = rolesForWorld[hero];
            }
        });

        // Ustaw także webhook dla Lupus
        if (selectedWorld === 'Lupus') {
            const webhookField = modal.querySelector('#hero-webhook-url'); // ZMIANA: było titan
            if (webhookField) {
                webhookField.value = 'https://discord.com/api/webhooks/1406241018117881927/FU_SFc7Jauu2R5gSbSw48TgtbaLwt6g2qL8wVBmhyp94zVjwTEJRbVuShCA2u6i0nshy';
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

function init() {
    // Dodaj style
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Utwórz przycisk ustawień
    const settingsButton = document.createElement('div');
    settingsButton.id = 'hero-notifier-button'; // ZMIANA: było titan-notifier-button
    settingsButton.innerHTML = '🛡️';

    // Przywróć zapisaną pozycję
    const savedPos = JSON.parse(localStorage.getItem('heroNotifierButtonPosition') || '{}'); // ZMIANA
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
    setInterval(checkHeroRespawns, 10000);

    console.log('Hero Notifier uruchomiony!');
}
// Uruchom gdy strona się załaduje
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
 })();
