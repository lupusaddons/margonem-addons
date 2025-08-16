(function() {
    'use strict';

    const worldName = "lupus";
    const MIN_PLAYERS_THRESHOLD = 8;
    let currentPlayersData = null;
    let checkPlayersTimeout = null; // Użyjemy setTimeout zamiast setInterval

    const titanList = [
        {level: 64, name: "Orla/Kic"}, {level: 65, name: "Kic"}, {level: 83, name: "Kic"}, {level: 88, name: "Rene"},
        {level: 114, name: "Rene"}, {level: 120, name: "Arcy"}, {level: 144, name: "Arcy"}, {level: 164, name: "Zoons/Łowka"}, {level: 167, name: "Zoons/Łowka"},
        {level: 180, name: "Łowka"}, {level: 190, name: "Łowka"}, {level: 191, name: "Przyzy"}, {level: 210, name: "Przyzy"},
        {level: 217, name: "Przyzy"}, {level: 218, name: "Magua"}, {level: 244, name: "Magua"}, {level: 245, name: "Teza"},
        {level: 271, name: "Teza"}, {level: 272, name: "Barba/Tan"}, {level: 300, name: "Barba/Tan"}
    ];

    const emojiMap = {
        'Orla/Kic': '🦅/🐰', 'Kic': '🐰', 'Rene': '⛓️', 'Arcy': '🔥', 'Zoons/Łowka': '🗡️/🏹',
        'Łowka': '🏹', 'Przyzy': '👹', 'Magua': '🐟', 'Teza': '⚡', 'Barba/Tan': '👑'
    };

    const styles = `
        #pod-settings-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #0f4c75, #3282b8);
            border: 2px solid #0f4c75;
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

        #pod-settings-button:hover {
            transform: scale(1.05) rotate(45deg);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        #pod-settings-button.disabled {
            background: linear-gradient(135deg, #666, #888);
            border-color: #666;
            opacity: 0.7;
        }

        .pod-settings-modal {
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

        .pod-settings-dialog {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #0f4c75;
            border-radius: 12px;
            padding: 25px;
            width: 500px;
            color: #e8f4fd;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }

        .pod-settings-dialog h3 {
            margin-top: 0;
            color: #3282b8;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
        }

        .pod-setting-group {
            margin-bottom: 20px;
        }

        .pod-setting-label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #a8dadc;
            font-size: 14px;
        }

        .pod-setting-input {
            width: 100%;
            padding: 10px;
            background: rgba(50,130,184,0.2);
            border: 1px solid #0f4c75;
            border-radius: 6px;
            color: #e8f4fd;
            font-size: 14px;
            box-sizing: border-box;
        }

        .pod-setting-input:focus {
            outline: none;
            border-color: #3282b8;
            box-shadow: 0 0 10px rgba(50,130,184,0.3);
        }

        .pod-setting-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .pod-setting-description {
            font-size: 12px;
            color: #a8dadc;
            margin-top: 5px;
            line-height: 1.4;
        }

        .pod-threshold-setting {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .pod-threshold-input {
            width: 80px;
            text-align: center;
        }

        .pod-toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .pod-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .pod-toggle-slider {
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

        .pod-toggle-slider:before {
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

        input:checked + .pod-toggle-slider {
            background-color: #3282b8;
        }

        input:checked + .pod-toggle-slider:before {
            transform: translateX(26px);
        }

        .pod-toggle-container {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .pod-status-info {
            background: rgba(40, 167, 69, 0.1);
            border: 1px solid #28a745;
            border-radius: 6px;
            padding: 12px;
            margin: 15px 0;
        }

        .pod-status-info.error {
            background: rgba(220, 53, 69, 0.1);
            border-color: #dc3545;
        }

        .pod-status-info.warning {
            background: rgba(255, 193, 7, 0.1);
            border-color: #ffc107;
            color: #ffc107;
        }

        .pod-settings-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 25px;
        }

        .pod-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
        }

        .pod-btn-primary {
            background: #3282b8;
            color: white;
        }

        .pod-btn-primary:hover {
            background: #2868a3;
        }

        .pod-btn-secondary {
            background: #666;
            color: white;
        }

        .pod-btn-secondary:hover {
            background: #555;
        }

        .pod-notification-log {
            max-height: 150px;
            overflow-y: auto;
            background: rgba(0,0,0,0.3);
            border: 1px solid #0f4c75;
            border-radius: 6px;
            padding: 10px;
        }

        .pod-log-item {
            font-size: 11px;
            margin-bottom: 5px;
            padding: 5px;
            background: rgba(50,130,184,0.1);
            border-radius: 4px;
        }

        .pod-log-time {
            color: #a8dadc;
            font-style: italic;
        }

        .pod-log-titan {
            font-weight: bold;
            color: #3282b8;
        }
    `;

    // Funkcje pomocnicze
    function getTitanName(level) {
        for (let i = titanList.length - 1; i >= 0; i--) {
            if (level >= titanList[i].level) return titanList[i].name;
        }
        return '-';
    }

    function getTitanEmoji(name) {
        return emojiMap[name] || '';
    }

    function getDiscordWebhookUrl() {
        return localStorage.getItem('podAutoNotifierWebhook') || '';
    }

    function setDiscordWebhookUrl(url) {
        localStorage.setItem('podAutoNotifierWebhook', url);
    }

    function getPlayerThreshold() {
        return parseInt(localStorage.getItem('podAutoNotifierThreshold') || MIN_PLAYERS_THRESHOLD);
    }

    function setPlayerThreshold(threshold) {
        localStorage.setItem('podAutoNotifierThreshold', threshold.toString());
    }

    function isNotifierEnabled() {
        return localStorage.getItem('podAutoNotifierEnabled') !== 'false';
    }

    function setNotifierEnabled(enabled) {
        localStorage.setItem('podAutoNotifierEnabled', enabled.toString());
        updateButtonAppearance();
    }

    function getLastNotificationData() {
        return JSON.parse(localStorage.getItem('podAutoNotifierLastNotifications') || '{}');
    }

    function setLastNotificationData(data) {
        localStorage.setItem('podAutoNotifierLastNotifications', JSON.stringify(data));
    }

    function getNotificationLog() {
        return JSON.parse(localStorage.getItem('podAutoNotifierLog') || '[]');
    }

    function addToNotificationLog(titanName, playerCount) {
        const log = getNotificationLog();
        const newEntry = {
            time: new Date().toLocaleString('pl-PL'),
            titan: titanName,
            count: playerCount
        };

        log.unshift(newEntry);
        if (log.length > 10) log.splice(10); // Zachowaj tylko 10 ostatnich

        localStorage.setItem('podAutoNotifierLog', JSON.stringify(log));
    }

    function updateButtonAppearance() {
        const button = document.getElementById('pod-settings-button');
        if (button) {
            if (isNotifierEnabled()) {
                button.classList.remove('disabled');
                button.title = 'Notifier włączony - kliknij aby otworzyć ustawienia';
            } else {
                button.classList.add('disabled');
                button.title = 'Dodatek - kliknij aby otworzyć ustawienia';
            }
        }
    }

    // Funkcja wysyłania na Discord
    async function sendDiscordNotification(titanName, players) {
        const webhookUrl = getDiscordWebhookUrl();
        if (!webhookUrl || !isNotifierEnabled()) return false;

        const titanEmoji = getTitanEmoji(titanName);
        const timestamp = new Date().toLocaleString('pl-PL');
        const threshold = getPlayerThreshold();

        // Sortuj graczy według poziomu malejąco
        const sortedPlayers = players.sort((a, b) => b.l - a.l);

        const playersList = sortedPlayers.map(p => {
            return `🗡️ **${p.n}** - LvL ${p.l}`;
        }).join('\n');

        const embed = {
            title: `🚨 ALARM! ${titanEmoji} ${titanName} - ${players.length} graczy online!`,
            description: `Na przedziale **${titanName}** jest aktualnie **${players.length} graczy** (próg: ${threshold})\n\n${playersList}`,
            color: 0xff6b35,
            footer: {
                text: `Kaczor Addons - Players Online Alarm - Lupus • ${timestamp}`
            }
        };

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Błąd wysyłania na Discord:', error);
            return false;
        }
    }

    // Funkcja do przeciągania przycisku
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

            // Zapisz pozycję
            localStorage.setItem('podSettingsButtonPosition', JSON.stringify({x, y}));
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Zapobiegaj kliknięciu gdy przeciągamy
        element.addEventListener('click', (e) => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            showSettings();
        });
    }

    function showSettings() {
        const modal = document.createElement('div');
        modal.className = 'pod-settings-modal';

        const log = getNotificationLog();
        const logHtml = log.length > 0 ?
            log.map(entry => `
                <div class="pod-log-item">
                    <span class="pod-log-time">${entry.time}</span> -
                    <span class="pod-log-titan">${entry.titan}</span>: ${entry.count} graczy
                </div>
            `).join('') :
            '<div style="text-align: center; color: #a8dadc; font-style: italic; padding: 20px;">Brak powiadomień</div>';

        const enabled = isNotifierEnabled();
        const webhookUrl = getDiscordWebhookUrl();

        let statusClass = 'error';
        let statusText = '❌ Dodatek wyłączony';

        if (enabled && webhookUrl) {
            statusClass = '';
            statusText = '✅ Dodatek włączony i skonfigurowany';
        } else if (enabled && !webhookUrl) {
            statusClass = 'warning';
            statusText = '⚠️ Dodatek włączony, ale brak webhook URL';
        }

        modal.innerHTML = `
            <div class="pod-settings-dialog">
                <h3>⚙️ Ustawienia</h3>

                <div class="pod-setting-group">
                    <label class="pod-setting-label">🔌 Status notifierа:</label>
                    <div class="pod-toggle-container">
                        <label class="pod-toggle-switch">
                            <input type="checkbox" id="pod-notifier-enabled" ${enabled ? 'checked' : ''}>
                            <span class="pod-toggle-slider"></span>
                        </label>
                        <span>${enabled ? 'Włączony' : 'Wyłączony'}</span>
                    </div>
                    <div class="pod-setting-description">
                        Włącz lub wyłącz wysyłanie powiadomień na Discord
                    </div>
                </div>

                <div class="pod-setting-group">
                    <label class="pod-setting-label">🔗 Discord Webhook URL:</label>
                    <input type="text" class="pod-setting-input" id="pod-webhook-url"
                           placeholder="https://discord.com/api/webhooks/..."
                           value="${webhookUrl}" ${!enabled ? 'disabled' : ''}>
                    <div class="pod-setting-description">
                        💡 Aby utworzyć webhook: Serwer Discord → Edytuj kanał → Integracje → Webhooks → Nowy Webhook
                    </div>
                </div>

                <div class="pod-setting-group">
                    <label class="pod-setting-label">📊 Próg powiadomień:</label>
                    <div class="pod-threshold-setting">
                        <input type="number" class="pod-setting-input pod-threshold-input" id="pod-threshold-input"
                               min="1" max="50" value="${getPlayerThreshold()}" ${!enabled ? 'disabled' : ''}>
                        <span>graczy na przedziale</span>
                    </div>
                    <div class="pod-setting-description">
                        Powiadomienie zostanie wysłane gdy na dowolnym przedziale będzie co najmniej tyle osób
                    </div>
                </div>

                <div class="pod-setting-group">
                    <label class="pod-setting-label">📋 Ostatnie powiadomienia:</label>
                    <div class="pod-notification-log">
                        ${logHtml}
                    </div>
                </div>

                <div class="pod-status-info ${statusClass}">
                    <strong>Status:</strong> ${statusText}
                </div>

                <div class="pod-settings-buttons">
                    <button class="pod-btn pod-btn-secondary" id="pod-close-settings">Anuluj</button>
                    <button class="pod-btn pod-btn-primary" id="pod-save-settings">Zapisz ustawienia</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        const enabledCheckbox = modal.querySelector('#pod-notifier-enabled');
        const webhookInput = modal.querySelector('#pod-webhook-url');
        const thresholdInput = modal.querySelector('#pod-threshold-input');

        enabledCheckbox.onchange = () => {
            const isEnabled = enabledCheckbox.checked;
            webhookInput.disabled = !isEnabled;
            thresholdInput.disabled = !isEnabled;
        };

        modal.querySelector('#pod-save-settings').onclick = () => {
            const enabled = enabledCheckbox.checked;
            const webhookUrl = webhookInput.value.trim();
            const threshold = parseInt(thresholdInput.value);

            setNotifierEnabled(enabled);
            setDiscordWebhookUrl(webhookUrl);
            setPlayerThreshold(threshold);

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
            successMsg.innerHTML = '✅ Ustawienia zapisane pomyślnie!';
            document.body.appendChild(successMsg);

            setTimeout(() => successMsg.remove(), 3000);
        };

        modal.querySelector('#pod-close-settings').onclick = () => {
            document.body.removeChild(modal);
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    function getPreviousPlayerCounts() {
        return JSON.parse(localStorage.getItem('podAutoNotifierPreviousCounts') || '{}');
    }

    function setPreviousPlayerCounts(counts) {
        localStorage.setItem('podAutoNotifierPreviousCounts', JSON.stringify(counts));
    }

    // Funkcja rekursywna sprawdzania graczy (zamiast setInterval)
    async function scheduleNextCheck() {
        if (checkPlayersTimeout) {
            clearTimeout(checkPlayersTimeout);
        }

        checkPlayersTimeout = setTimeout(async () => {
            await checkPlayers();
            scheduleNextCheck(); // Zaplanuj kolejne sprawdzenie
        }, 60000); // 60 sekund
    }

    // Główna funkcja sprawdzania graczy
    async function checkPlayers() {
        if (!isNotifierEnabled()) return;

        try {
            const res = await fetch(`https://public-api.margonem.pl/info/online/${worldName}.json`);
            if (!res.ok) return;

            const players = await res.json();
            if (!players || !Array.isArray(players)) return;

            currentPlayersData = players;

            // Grupuj graczy według tytanów
            const titanGroups = {};
            players.forEach(player => {
                const titanName = getTitanName(player.l);
                if (!titanGroups[titanName]) {
                    titanGroups[titanName] = [];
                }
                titanGroups[titanName].push(player);
            });

            const threshold = getPlayerThreshold();
            const lastNotificationData = getLastNotificationData();
            const previousCounts = getPreviousPlayerCounts();

            // Sprawdź każdy tytan
            for (const [titanName, titanPlayers] of Object.entries(titanGroups)) {
                if (titanName === '-') continue; // Pomiń graczy bez tytana

                const currentCount = titanPlayers.length;
                const previousCount = previousCounts[titanName] || 0;

                // Wyślij powiadomienie tylko jeśli:
                // 1. Aktualna liczba >= próg
                // 2. Poprzednia liczba < próg (czyli nastąpił wzrost DO progu)
                // 3. Nie wysłaliśmy powiadomienia w ciągu ostatnich 10 minut
                if (currentCount >= threshold) {
                    const now = Date.now();
                    const lastNotification = lastNotificationData[titanName];

                    if (!lastNotification || (now - lastNotification.time) > 5 * 60 * 1000) {
                        // Wyślij powiadomienie
                        const success = await sendDiscordNotification(titanName, titanPlayers);

                        if (success) {
                            lastNotificationData[titanName] = {
                                time: now,
                                count: currentCount
                            };

                            setLastNotificationData(lastNotificationData);
                            addToNotificationLog(titanName, currentCount);

                            console.log(`✅ Wysłano powiadomienie: ${titanName} - wzrost z ${previousCount} do ${currentCount} graczy`);
                        }
                    }
                }

                // Zaktualizuj poprzednią liczbę graczy
                previousCounts[titanName] = currentCount;
            }

            // Zapisz aktualne liczby jako poprzednie na następny raz
            setPreviousPlayerCounts(previousCounts);

        } catch (error) {
            console.error('Błąd sprawdzania graczy:', error);
        }
    }

    // Funkcja zatrzymująca timer
    function stopTimer() {
        if (checkPlayersTimeout) {
            clearTimeout(checkPlayersTimeout);
            checkPlayersTimeout = null;
        }
    }

    // Inicjalizacja
    function init() {
    const existingButton = document.getElementById('pod-settings-button');
    if (existingButton) {
        existingButton.remove();
        console.log('Usunięto duplikat przycisku POD Settings');
    }
        // Dodaj style
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Utwórz przycisk ustawień
        const settingsButton = document.createElement('div');
        settingsButton.id = 'pod-settings-button';
        settingsButton.innerHTML = '⚙️';

        // Przywróć zapisaną pozycję
        const savedPos = JSON.parse(localStorage.getItem('podSettingsButtonPosition') || '{}');
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

        // Rozpocznij sprawdzanie po minucie (używając setTimeout zamiast setInterval)
        setTimeout(() => {
            checkPlayers(); // Pierwsze sprawdzenie po minucie
            scheduleNextCheck(); // Zaplanuj kolejne sprawdzenia
        }, 60000);

        // Zatrzymaj timer gdy strona się wyładowuje
        window.addEventListener('beforeunload', stopTimer);

        console.log('🚀 Dodatek uruchomiony!');
    }

    // Uruchom gdy strona się załaduje
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
