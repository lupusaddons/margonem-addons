(function() {
    'use strict';
    
    // === ZMIENIONE IDENTYFIKATORY (żeby nie było konfliktów) ===
    const worldName = "lupus";
    const boxId = 'lupus-summary-box'; // ZMIENIONE
    const summaryBoxId = 'lupus-summary-detached'; // ZMIENIONE
    
    // === UPROSZCZONE ZMIENNE ===
    let lastRefreshTime = null;
    let isMainBoxHidden = localStorage.getItem('lupusSummaryHidden') === 'true'; // ZMIENIONY KLUCZ
    let isSummaryDetached = localStorage.getItem('lupusSummaryDetached') === 'true'; // ZMIENIONY KLUCZ
    let currentPlayersData = null;
    
    // Lista tytanów - ZOSTAJE BEZ ZMIAN
    const titanList = [
        {level: 64, name: "Orla/Kic"}, {level: 65, name: "Kic"}, {level: 83, name: "Kic"}, {level: 88, name: "Rene"},
        {level: 114, name: "Rene"}, {level: 120, name: "Arcy"}, {level: 144, name: "Arcy"}, {level: 164, name: "Zoons/Łowka"}, {level: 167, name: "Zoons/Łowka"},
        {level: 180, name: "Łowka"}, {level: 190, name: "Łowka"}, {level: 191, name: "Przyzy"}, {level: 210, name: "Przyzy"},
        {level: 217, name: "Przyzy"}, {level: 218, name: "Magua"}, {level: 244, name: "Magua"}, {level: 245, name: "Teza"},
        {level: 271, name: "Teza"}, {level: 272, name: "Barba/Tan"}, {level: 300, name: "Barba/Tan"}
    ];

    // === PODSTAWOWE STYLE ===
    if (!document.querySelector('#lupus-summary-styles')) {
        const styles = document.createElement('style');
        styles.id = 'lupus-summary-styles';
        styles.textContent = `
            #lupus-summary-box {
                position: fixed;
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.6);
                z-index: 10000;
                min-width: 250px;
            }
            
            #lupus-summary-box.hidden { display: none !important; }
            
            .lupus-summary-header {
                background: #2d2d2d;
                padding: 8px 12px;
                border-radius: 7px 7px 0 0;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
                border-bottom: 1px solid #444;
            }
            
            .lupus-summary-content {
                padding: 10px;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                font-size: 11px;
            }
            
            .summary-counts {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .titan-count {
                background: #333;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 10px;
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid #555;
            }
            
            .titan-count:hover {
                background: #444;
                transform: scale(1.05);
                border-color: #666;
            }
            
            .titan-count.highlight {
                background: #4a4a00;
                font-weight: bold;
                border: 1px solid #ffff00;
                color: #ffff00;
            }
            
            .last-refresh {
                color: #888;
                font-size: 9px;
            }
            
            .lupus-summary-button {
                background: #444;
                border: 1px solid #666;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                margin-left: 5px;
            }
            
            .lupus-summary-button:hover {
                background: #555;
            }
            
            .show-lupus-btn {
                position: fixed;
                background: #2d2d2d;
                border: 1px solid #666;
                color: white;
                width: 45px;
                height: 35px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(0,0,0,0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                top: 100px;
                right: 20px;
            }
            
            .show-lupus-btn:hover {
                background: #444;
                transform: scale(1.05);
            }
            
            .resizer {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 15px;
                height: 15px;
                cursor: nw-resize;
                background: linear-gradient(-45deg, transparent 40%, #666 40%, #666 60%, transparent 60%);
            }
            
            /* Modal dla listy graczy */
            .titan-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 20000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .titan-modal-content {
                background: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                color: white;
                max-width: 400px;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .titan-modal-header {
                background: #2d2d2d;
                padding: 12px;
                border-bottom: 1px solid #444;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .titan-modal-body {
                padding: 10px;
                max-height: 300px;
                overflow-y: auto;
            }
            
            .player-item {
                padding: 5px 10px;
                margin: 2px 0;
                background: #2a2a2a;
                border-radius: 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-close-btn {
                background: #666;
                border: none;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .modal-close-btn:hover {
                background: #777;
            }
        `;
        document.head.appendChild(styles);
    }

    // === FUNKCJE POMOCNICZE ===
    function constrainToViewport(x, y, width, height) {
        return {
            x: Math.max(0, Math.min(x, window.innerWidth - width)),
            y: Math.max(0, Math.min(y, window.innerHeight - height))
        };
    }

    function getTitanName(level) {
        // Znajdź największy level nie większy od podanego
        let result = '-';
        for (let titan of titanList) {
            if (level >= titan.level) {
                result = titan.name;
            } else {
                break;
            }
        }
        return result;
    }

    function getTitanEmoji(titanName) {
const emojiMap = {
        'Orla/Kic': '🦅/🐰', 'Kic': '🐰', 'Rene': '⛓️', 'Arcy': '🔥', 'Zoons/Łowka': '🗡️/🏹',
        'Łowka': '🏹', 'Przyzy': '👹', 'Magua': '🐟', 'Teza': '⚡', 'Barba/Tan': '👑'
    };
        return emojiMap[titanName] || '❓';
    }

    // === FUNKCJA POKAZYWANIA GŁÓWNEGO OKNA ===
    function showMainBox() {
        const mainBox = document.getElementById(boxId);
        const showBtn = document.querySelector('.show-lupus-btn');
        if (mainBox) {
            mainBox.classList.remove('hidden');
            isMainBoxHidden = false;
            localStorage.setItem('lupusSummaryHidden', 'false');
        }
        if (showBtn) {
            showBtn.remove();
        }
    }

    // === FUNKCJA UKRYWANIA GŁÓWNEGO OKNA ===
    function hideMainBox() {
        const mainBox = document.getElementById(boxId);
        if (mainBox) {
            mainBox.classList.add('hidden');
            isMainBoxHidden = true;
            localStorage.setItem('lupusSummaryHidden', 'true');

            // Stwórz przycisk pokazywania
            const showBtn = document.createElement('button');
            showBtn.className = 'show-lupus-btn';
            showBtn.innerHTML = '🐺';
            showBtn.title = 'Pokaż Lupus Summary';

            // Przywróć pozycję z localStorage
            const savedPos = JSON.parse(localStorage.getItem('lupusSummaryShowButtonPosition') || '{}');
            if (savedPos.x !== undefined && savedPos.y !== undefined) {
                const constrained = constrainToViewport(savedPos.x, savedPos.y, 45, 35);
                showBtn.style.left = `${constrained.x}px`;
                showBtn.style.top = `${constrained.y}px`;
                showBtn.style.right = 'auto';
            }

            showBtn.onclick = showMainBox;
            document.body.appendChild(showBtn);
            makeDraggableButton(showBtn);
        }
    }

    // === FUNKCJA PRZECIĄGANIA PRZYCISKU ===
    function makeDraggableButton(element) {
        let isDragging = false, offsetX = 0, offsetY = 0, hasMoved = false;

        element.addEventListener('click', e => {
            if (hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        element.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            isDragging = true;
            hasMoved = false;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            hasMoved = true;
            const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - element.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - element.offsetHeight);
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.right = 'auto';
            localStorage.setItem('lupusSummaryShowButtonPosition', JSON.stringify({x, y}));
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => { hasMoved = false; }, 150);
            }
        });
    }

    // === FUNKCJA PRZECIĄGANIA OKNA ===
    function makeDraggable(element) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        const header = element.querySelector('.lupus-summary-header');

        header.addEventListener('mousedown', e => {
            if (e.button !== 0 || e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - element.offsetWidth);
            const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - element.offsetHeight);
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            localStorage.setItem('lupusSummaryPosition', JSON.stringify({x, y, w: element.offsetWidth, h: element.offsetHeight}));
        });

        document.addEventListener('mouseup', () => isDragging = false);
    }

    // === FUNKCJA POKAZYWANIA GRACZY Z TYTANA ===
    function showTitanPlayers(titanName) {
        if (!currentPlayersData || !Array.isArray(currentPlayersData)) {
            return;
        }

        const playersInTitan = currentPlayersData.filter(p => getTitanName(p.l) === titanName);
        
        if (playersInTitan.length === 0) {
            return;
        }

        // Sortuj graczy według poziomu (malejąco)
        playersInTitan.sort((a, b) => b.l - a.l);

        const modal = document.createElement('div');
        modal.className = 'titan-modal';
        modal.innerHTML = `
            <div class="titan-modal-content">
                <div class="titan-modal-header">
                    <div>${getTitanEmoji(titanName)} ${titanName} (${playersInTitan.length} graczy)</div>
                    <button class="modal-close-btn">✕</button>
                </div>
                <div class="titan-modal-body">
                    ${playersInTitan.map(p => `
                        <div class="player-item">
                            <span><strong>${p.n}</strong></span>
                            <span>LvL ${p.l}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listenery do zamknięcia
        modal.querySelector('.modal-close-btn').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        // Zamknij na ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    // === FUNKCJA DODAWANIA KLIKANIA DO TYTANÓW ===
    function addTitanClickListeners(container) {
        const titanCounts = container.querySelectorAll('.titan-count');

        titanCounts.forEach(titanCount => {
            const text = titanCount.textContent.trim();
            
            // Pomiń elementy z "-"
            if (text.includes('❌ -:')) return;

            // Wyciągnij nazwę tytana z tekstu
            const match = text.match(/^[^\s]+\s+(.+?):\s*\d+$/);
            if (match) {
                const titanName = match[1].trim();
                titanCount.setAttribute('data-titan', titanName);
                
                titanCount.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showTitanPlayers(titanName);
                });
            }
        });
    }
    function makeResizable(element) {
        const resizer = element.querySelector('.resizer');
        let isResizing = false, startX, startY, startWidth, startHeight;

        resizer.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = element.offsetWidth;
            startHeight = element.offsetHeight;
        });

        document.addEventListener('mousemove', e => {
            if (!isResizing) return;
            const newWidth = Math.max(250, startWidth + e.clientX - startX);
            const newHeight = Math.max(120, startHeight + e.clientY - startY);
            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                localStorage.setItem('lupusSummaryPosition', JSON.stringify({
                    x: parseInt(element.style.left), 
                    y: parseInt(element.style.top), 
                    w: element.offsetWidth, 
                    h: element.offsetHeight
                }));
            }
        });
    }

    // === FUNKCJA POBIERANIA DANYCH ===
    async function fetchPlayers() {
        try {
            const res = await fetch(`https://public-api.margonem.pl/info/online/${worldName}.json`);
            lastRefreshTime = new Date();
            const data = res.ok ? await res.json() : null;
            currentPlayersData = data;
            renderBox(data);
        } catch (err) {
            lastRefreshTime = new Date();
            currentPlayersData = null;
            renderBox(null);
        }
    }

    // === FUNKCJA GENEROWANIA PODSUMOWANIA ===
    function generateSummaryHTML(players) {
        if (!players || !Array.isArray(players)) {
            return `
                <div class="summary-row">
                    <div class="summary-counts">❌ Brak danych</div>
                    <div class="last-refresh">${lastRefreshTime ? `🕐 ${lastRefreshTime.toLocaleTimeString('pl-PL')}` : ''}</div>
                </div>
            `;
        }

        // Policz graczy na każdym tytanie
        const titanSummary = {};
        players.forEach(p => {
            const titan = getTitanName(p.l);
            titanSummary[titan] = (titanSummary[titan] || 0) + 1;
        });

        // Stwórz HTML dla liczników
        const summaryCountsHtml = [...new Set(titanList.map(t => t.name))]
            .filter(name => titanSummary[name])
            .map(name => {
                const count = titanSummary[name];
                const emoji = getTitanEmoji(name);
                return `<span class="titan-count ${count >= 3 ? 'highlight' : ''}">${emoji} ${name}: ${count}</span>`;
            });

        if (titanSummary['-']) {
            summaryCountsHtml.push(`<span class="titan-count">❌ -: ${titanSummary['-']}</span>`);
        }

        return `
            <div class="summary-row">
                <div style="font-weight: bold; color: #fff;">👥 Gracze online: ${players.length}</div>
                <div class="last-refresh">${lastRefreshTime ? `🕐 ${lastRefreshTime.toLocaleTimeString('pl-PL')}` : ''}</div>
            </div>
            <div class="summary-row">
                <div class="summary-counts">${summaryCountsHtml.join('')}</div>
            </div>
        `;
    }

    // === GŁÓWNA FUNKCJA RENDEROWANIA ===
    function renderBox(players) {
        let box = document.getElementById(boxId);
        
        if (!box) {
            box = document.createElement('div');
            box.id = boxId;
            
            // Przywróć pozycję z localStorage
            const savedPos = JSON.parse(localStorage.getItem('lupusSummaryPosition') || '{}');
            const width = savedPos.w || 300;
            const height = savedPos.h || 150;
            const constrained = constrainToViewport(savedPos.x || 50, savedPos.y || 50, width, height);

            box.style.left = `${constrained.x}px`;
            box.style.top = `${constrained.y}px`;
            box.style.width = `${width}px`;
            box.style.height = `${height}px`;

            // Sprawdź czy okno ma być ukryte
            if (isMainBoxHidden) {
                box.classList.add('hidden');
                const showBtn = document.createElement('button');
                showBtn.className = 'show-lupus-btn';
                showBtn.innerHTML = '🐺';
                showBtn.title = 'Pokaż Lupus Summary';

                const savedBtnPos = JSON.parse(localStorage.getItem('lupusSummaryShowButtonPosition') || '{}');
                if (savedBtnPos.x !== undefined && savedBtnPos.y !== undefined) {
                    const constrained = constrainToViewport(savedBtnPos.x, savedBtnPos.y, 45, 35);
                    showBtn.style.left = `${constrained.x}px`;
                    showBtn.style.top = `${constrained.y}px`;
                    showBtn.style.right = 'auto';
                }

                showBtn.onclick = showMainBox;
                document.body.appendChild(showBtn);
                makeDraggableButton(showBtn);
            }

            // HTML struktury okna
            box.innerHTML = `
                <div class="lupus-summary-header">
                    <div>🐺 Lupus Summary</div>
                    <div>
                        <button class="lupus-summary-button" id="refresh-btn">↻</button>
                        <button class="lupus-summary-button" id="hide-btn">👁️</button>
                    </div>
                </div>
                <div class="lupus-summary-content" id="summary-content"></div>
                <div class="resizer"></div>
            `;

            document.body.appendChild(box);

            // Event listenery
            box.querySelector('#refresh-btn').onclick = fetchPlayers;
            box.querySelector('#hide-btn').onclick = hideMainBox;

            makeDraggable(box);
            makeResizable(box);
        }

        // Aktualizuj zawartość podsumowania
        const summaryContent = box.querySelector('#summary-content');
        if (summaryContent) {
            summaryContent.innerHTML = generateSummaryHTML(players);
            // Dodaj możliwość klikania w tytany
            addTitanClickListeners(summaryContent);
        }
    }

    // === INICJALIZACJA ===
    console.log('🐺 Lupus Summary - Inicjalizacja...');
    fetchPlayers();
    setInterval(fetchPlayers, 60000); // Odświeżaj co minutę

})();
