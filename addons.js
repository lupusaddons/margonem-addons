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

    console.log('✅ Użytkownik autoryzowany:', userId);
    // System do śledzenia elementów i eventów każdego dodatku
    const addonTrackers = {
        addon1: {
            elements: [],
            intervals: [],
            eventListeners: [],
            observers: []
        },
        addon2: {
            elements: [],
            intervals: [],
            eventListeners: [],
            observers: []
        },
        addon3: {
            elements: [],
            intervals: [],
            eventListeners: [],
            observers: []
        }
    };

    // Funkcje pomocnicze do śledzenia
    function trackElement(addonId, element) {
        addonTrackers[addonId].elements.push(element);
        return element;
    }

    function trackInterval(addonId, intervalId) {
        addonTrackers[addonId].intervals.push(intervalId);
        return intervalId;
    }

    function trackEventListener(addonId, element, event, handler) {
        addonTrackers[addonId].eventListeners.push({element, event, handler});
        element.addEventListener(event, handler);
    }

    function trackObserver(addonId, observer) {
        addonTrackers[addonId].observers.push(observer);
        return observer;
    }

    // Funkcja do czyszczenia wszystkich śladów dodatku
    function cleanupAddon(addonId) {
        const tracker = addonTrackers[addonId];

        // Remove DOM elements
        tracker.elements.forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        tracker.elements = [];

        // Clear intervals
        tracker.intervals.forEach(intervalId => {
            clearInterval(intervalId);
        });
        tracker.intervals = [];

        // Remove event listeners
        tracker.eventListeners.forEach(({element, event, handler}) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });
        tracker.eventListeners = [];

        // Disconnect observers
        tracker.observers.forEach(observer => {
            if (observer && observer.disconnect) {
                observer.disconnect();
            }
        });
        tracker.observers = [];

        // Remove any CSS styles added by the addon
        const styleElements = document.querySelectorAll(`style[data-addon="${addonId}"]`);
        styleElements.forEach(style => style.remove());

        console.log(`Addon ${addonId} został całkowicie wyczyszczony`);
    }

    // Configuration for addons
    const addons = {
        addon1: {
            name: 'Players Online',
            enabled: false,
            init: function() {
                console.log('Players Online');

(function() {
    'use strict';
    const worldName = "lupus", boxId = 'online-box', summaryBoxId = 'summary-box';
    let currentFilter = "all", lastRefreshTime = null;
    let isMainBoxHidden = false, isSummaryDetached = false;
    let currentPlayersData = null;
    const titanList = [
        {level: 64, name: "Orla/Kic"}, {level: 65, name: "Kic"}, {level: 83, name: "Kic"}, {level: 88, name: "Rene"},
        {level: 114, name: "Rene"}, {level: 120, name: "Arcy"}, {level: 144, name: "Arcy"}, {level: 164, name: "Zoons/Łowka"}, {level: 167, name: "Zoons/Łowka"},
        {level: 180, name: "Łowka"}, {level: 190, name: "Łowka"}, {level: 191, name: "Przyzy"}, {level: 210, name: "Przyzy"},
        {level: 217, name: "Przyzy"}, {level: 218, name: "Magua"}, {level: 244, name: "Magua"}, {level: 245, name: "Teza"},
        {level: 271, name: "Teza"}, {level: 272, name: "Barba/Tan"}, {level: 300, name: "Barba/Tan"}
    ];

    const creatorList = ["dreaming kwaczuszka" , "pogromca karpia"];
    const guildColors = JSON.parse(localStorage.getItem('guildColors') || '{}');
	const playerGuilds = {};
	let observedGuilds = [];
	function updateObservedGuilds() {
    const guilds = [...new Set(Object.values(playerGuilds))];
    observedGuilds = guilds.sort();
    console.log('Zaktualizowano listę klanów:', observedGuilds);
}
function getPlayerGuild(playerName) {
    return playerGuilds[playerName.toLowerCase()] || null;
}
function getGuildColor(guildName) {
    return guildColors[guildName] || '#28a745'; // domyślny zielony
}

function setGuildColor(guildName, color) {
    guildColors[guildName] = color;
    localStorage.setItem('guildColors', JSON.stringify(guildColors));
}
updateObservedGuilds();
const themes = {
    blue: `#online-box{position:fixed;background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #0f4c75;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:9999;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;backdrop-filter:blur(10px);min-width:260px;min-height:100px}#online-box.hidden{display:none}#online-box-header{background:linear-gradient(135deg,#0f4c75,#3282b8);color:white;padding:12px 15px;font-weight:bold;font-size:14px;cursor:move;user-select:none;position:relative;display:flex;justify-content:space-between;align-items:center}#online-box-title{color:white;font-weight:bold;display:flex;align-items:center;gap:8px}#online-box-title .emoji{font-size:16px;animation:pulse 2s infinite}#vip-button{background:linear-gradient(135deg,#ffd700,#ffb300);border:2px solid #ffa000;color:#1a1a2e;font-size:14px;cursor:pointer;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-weight:bold;box-shadow:0 2px 8px rgba(255,215,0,0.3);margin-left:8px}#vip-button:hover{transform:scale(1.1) rotate(10deg);box-shadow:0 4px 12px rgba(255,215,0,0.5)}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}#online-box-buttons{display:flex;gap:5px}#online-box-buttons button{background:rgba(255,255,255,0.2);border:none;color:white;font-size:14px;cursor:pointer;padding:4px 8px;border-radius:4px;transition:all 0.2s;font-weight:bold}#online-box-buttons button:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}#online-box-buttons button#theme-btn{background:linear-gradient(135deg,#ff6b6b,#ee5a52);border:2px solid #ff4444;color:white}#online-box-buttons button#theme-btn:hover{background:linear-gradient(135deg,#ee5a52,#ff6b6b);transform:translateY(-1px) scale(1.05)}#online-box-controls{padding:10px;background:rgba(0,0,0,0.3);border-bottom:1px solid rgba(15,76,117,0.5)}#filter-select{width:100%;background:linear-gradient(135deg,rgba(15,76,117,0.3),rgba(50,130,184,0.2));color:#e8f4fd;border:1px solid rgba(15,76,117,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}#filter-select:focus{border-color:#3282b8;box-shadow:0 0 10px rgba(50,130,184,0.3)}#filter-select option{background:#16213e;color:#e8f4fd}#online-content{display:flex;flex-direction:column;height:calc(100% - 180px);background:rgba(0,0,0,0.2)}#table-header{background:linear-gradient(135deg,rgba(15,76,117,0.4),rgba(50,130,184,0.3));color:#3282b8;padding:8px;font-size:12px;font-weight:bold;border-bottom:1px solid rgba(15,76,117,0.5);display:flex;position:sticky;top:0;z-index:10}#table-header>div{padding:0 8px}#table-header .col-nick{flex:1;text-align:left}#table-header .col-level{width:60px;text-align:right}#table-header .col-titan{width:80px;text-align:right}#table-body{flex:1;overflow-y:auto;position:relative}.player-row{display:flex;padding:6px 8px;color:#e8f4fd;font-size:12px;border-bottom:1px solid rgba(15,76,117,0.2);transition:all 0.2s}.player-row:hover{background:linear-gradient(135deg,rgba(15,76,117,0.2),rgba(50,130,184,0.1))}.player-row>div{padding:0 8px}.player-row .col-nick{flex:1;text-align:left;display:flex;align-items:center;gap:4px}.player-row .col-level{width:60px;text-align:right}.player-row .col-titan{width:80px;text-align:right;display:flex;align-items:center;justify-content:flex-end;gap:4px}.titan-highlight{color:#ff6b6b!important;font-weight:bold!important;text-shadow:0 0 5px rgba(255,107,107,0.3)}.player-emoji{font-size:10px;opacity:0.8}.titan-emoji{font-size:10px;opacity:0.9}.vip-player{background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,165,0,0.1));border-left:3px solid #ffd700}.no-data{text-align:center;color:#a8dadc;padding:20px;font-style:italic;font-size:12px}.creator-player{background:linear-gradient(135deg,rgba(255,0,0,0.15),rgba(139,0,0,0.15))!important;border-left:4px solid #ff0000!important;color:#ff4444!important}.creator-label{color:#ff0000!important;font-weight:bold!important;font-size:10px!important;margin-left:6px!important;padding:2px 4px!important;background:rgba(255,0,0,0.2)!important;border-radius:3px!important;display:inline-block!important;text-shadow:none!important}
.guild-player {
    background: linear-gradient(135deg, rgba(40,167,69,0.15), rgba(32,201,151,0.15)) !important;
    border-left: 3px solid var(--guild-color, #28a745) !important;
}

.guild-player .col-nick {
    color: var(--guild-text-color, #90EE90) !important;
}
}.creator-player .col-nick{color:#ff6666!important;font-weight:bold!important}.creator-player .player-emoji{color:#ff0000!important;font-size:12px!important;text-shadow:0 0 3px rgba(255,0,0,0.5)!important}#level-summary{padding:12px;background:linear-gradient(135deg,rgba(15,76,117,0.6),rgba(50,130,184,0.4));border-top:1px solid rgba(15,76,117,0.5);color:#e8f4fd;font-size:11px;line-height:1.6;border-radius:0 0 8px 8px;position:relative}.summary-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;flex-wrap:wrap;gap:4px}.summary-row:last-child{margin-bottom:0}.summary-row.counts-row{justify-content:flex-start}.summary-counts{display:flex;flex-wrap:wrap;gap:4px;font-weight:bold}.titan-count{background:rgba(0,0,0,0.3);padding:2px 4px;border-radius:4px;font-size:9px;white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:2px;transition:all 0.2s ease;user-select:none}.titan-count:hover{background:rgba(51,51,51,0.6);transform:scale(1.05);border:1px solid rgba(102,102,102,0.6);box-shadow:0 2px 8px rgba(102,102,102,0.3);cursor:pointer}.titan-count.highlight{background:rgba(255,107,107,0.3);color:#ff6b6b;border:1px solid rgba(255,107,107,0.5)}.titan-count.highlight:hover{background:rgba(255,107,107,0.5);border:1px solid rgba(255,107,107,0.8);box-shadow:0 2px 8px rgba(255,107,107,0.4)}
.last-refresh{color:#a8dadc;font-size:9px;font-style:italic}.collapsed #online-content,.collapsed #online-box-controls{display:none}.collapsed #online-box{height:auto!important;width:auto!important;min-width:250px}#table-body::-webkit-scrollbar{width:8px}#table-body::-webkit-scrollbar-track{background:rgba(0,0,0,0.3);border-radius:4px}#table-body::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#0f4c75,#3282b8);border-radius:4px}#table-body::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#3282b8,#0f4c75)}.resizer{width:14px;height:14px;position:absolute;right:2px;bottom:2px;cursor:se-resize;background:linear-gradient(135deg,#0f4c75,#3282b8);border-radius:3px;z-index:10;opacity:0.7;transition:opacity 0.2s}.resizer:hover{opacity:1}@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}#online-box{animation:fadeIn 0.3s ease-out}.vip-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;justify-content:center;align-items:center}.vip-dialog{background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #0f4c75;border-radius:12px;padding:20px;width:400px;max-height:500px;color:#e8f4fd;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.vip-modal h3{margin-top:0;color:#3282b8}.vip-input-row{margin-bottom:15px}.vip-input-row input{width:70%;padding:8px;background:rgba(50,130,184,0.2);border:1px solid #0f4c75;border-radius:4px;color:#e8f4fd;margin-right:10px}.vip-input-row button{padding:8px 12px;background:#3282b8;border:none;border-radius:4px;color:white;cursor:pointer}.vip-list-container{max-height:300px;overflow-y:auto;margin-bottom:15px;border:1px solid #0f4c75;border-radius:4px;padding:10px;background:rgba(0,0,0,0.3)}.vip-item{display:flex;justify-content:space-between;align-items:center;padding:5px;margin:2px 0;background:rgba(50,130,184,0.1);border-radius:4px}.vip-remove-btn{background:#ff4444;border:none;border-radius:3px;color:white;padding:2px 6px;cursor:pointer;font-size:12px}.vip-close-btn{background:#666;border:none;border-radius:4px;color:white;cursor:pointer;padding:8px 16px}#summary-box{position:fixed;background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #0f4c75;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:9998;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;backdrop-filter:blur(10px);min-width:280px;min-height:120px}#summary-box-header{background:linear-gradient(135deg,#0f4c75,#3282b8);color:white;padding:8px 12px;font-weight:bold;font-size:12px;cursor:move;user-select:none;display:flex;justify-content:space-between;align-items:center}#summary-box-title{color:white;font-weight:bold;display:flex;align-items:center;gap:6px}#summary-box-buttons{display:flex;gap:4px}#summary-box-buttons button{background:rgba(255,255,255,0.2);border:none;color:white;font-size:12px;cursor:pointer;padding:3px 6px;border-radius:3px;transition:all 0.2s;font-weight:bold}#summary-box-buttons button:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}#summary-content{padding:8px;color:#e8f4fd;font-size:10px;line-height:1.4}.show-main-btn{position:fixed;top:10px;right:10px;z-index:10001;background:linear-gradient(135deg,#0f4c75,#3282b8);border:2px solid #0f4c75;color:white;padding:8px;border-radius:50%;cursor:move;font-size:12px;box-shadow:0 4px 16px rgba(0,0,0,0.3);transition:all 0.2s;opacity:0.8;user-select:none;width:55px;height:55px;display:flex;align-items:center;justify-content:center}.show-main-btn:hover{transform:scale(1.05) rotate(15deg);box-shadow:0 6px 20px rgba(0,0,0,0.4);opacity:1}#level-summary.detached{display:none}#send-all-btn{position:relative}#send-all-btn:hover::after{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:4px 8px;border-radius:4px;font-size:10px;white-space:nowrap;z-index:1000}#summary-box .detached-controls{padding:8px;text-align:center;border-top:1px solid rgba(15,76,117,0.5);background:rgba(0,0,0,0.2)}#summary-box .detached-controls button{background:#3282b8;border:none;color:white;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;margin:0 2px}#summary-box .detached-controls button:hover{background:#4a9fd1}.guild-select{background:linear-gradient(135deg,rgba(15,76,117,0.3),rgba(50,130,184,0.2));color:#e8f4fd;border:1px solid rgba(15,76,117,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}.guild-select:focus{border-color:#3282b8;box-shadow:0 0 10px rgba(50,130,184,0.3)}.guild-select option{background:#16213e;color:#e8f4fd}.guild-management-dialog .vip-input-row select{width:100%;background:linear-gradient(135deg,rgba(15,76,117,0.3),rgba(50,130,184,0.2));color:#e8f4fd;border:1px solid rgba(15,76,117,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}.guild-management-dialog .vip-input-row select:focus{border-color:#3282b8;box-shadow:0 0 10px rgba(50,130,184,0.3)}.guild-management-dialog .vip-input-row select option{background:#16213e;color:#e8f4fd}
#guild-button{
    background:linear-gradient(135deg,#28a745,#20c997);
    border:2px solid #17a2b8;
    color:white;
    font-size:14px;
    cursor:pointer;
    width:24px;
    height:24px;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    transition:all 0.2s;
    font-weight:bold;
    box-shadow:0 2px 8px rgba(40,167,69,0.3);
    margin-left:8px
}

#guild-button:hover{
    transform:scale(1.1) rotate(10deg);
    box-shadow:0 4px 12px rgba(40,167,69,0.5)
}

.guild-player {
    background: linear-gradient(135deg, rgba(40,167,69,0.15), rgba(32,201,151,0.15));
    border-left: 3px solid #28a745;
}

.guild-player .col-nick {
    color: #90EE90 !important;
}
.guild-checkbox-container {
    margin: 5px 0;
    padding: 8px;
    background: rgba(50,130,184,0.1);
    border-radius: 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
}

.guild-checkbox-container:hover {
    background: rgba(50,130,184,0.2);
    border-color: rgba(50,130,184,0.3);
}

.guild-checkbox-container.selected {
    background: rgba(40,167,69,0.2);
    border-color: #28a745;
}

.guild-checkbox {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    cursor: pointer;
    appearance: none;
    background: rgba(0,0,0,0.3);
    border: 2px solid #666;
    border-radius: 4px;
    position: relative;
    transition: all 0.2s;
}

.guild-checkbox:checked {
    background: #28a745;
    border-color: #28a745;
}

.guild-checkbox:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 12px;
}

.guild-checkbox-label {
    flex: 1;
    cursor: pointer;
    color: #e8f4fd;
    font-weight: 500;
}

.guild-checkbox-container.selected .guild-checkbox-label {
    color: #90EE90;
    font-weight: bold;
}
.non-selected-guild-player {
    background: linear-gradient(135deg, rgba(108,117,125,0.1), rgba(73,80,87,0.1)) !important;
    border-left: 2px solid #6c757d !important;
    opacity: 0.7;
}

.non-selected-guild-player .col-nick {
    color: #adb5bd !important;
}

.guild-info-badge {
    font-size: 9px;
    padding: 1px 4px;
    border-radius: 3px;
    margin-left: 4px;
    font-weight: bold;
}
.guild-color-picker {
    width: 25px !important;
    height: 18px !important;
    border: 1px solid rgba(255,255,255,0.3) !important;
    border-radius: 3px !important;
    cursor: pointer !important;
    margin-left: 8px !important;
    padding: 0 !important;
    background: none !important;
}

.guild-color-picker:hover {
    border-color: rgba(255,255,255,0.6) !important;
    transform: scale(1.1) !important;
}

.selected-guild-badge {
    background: rgba(40,167,69,0.3);
    color: #90EE90;
    border: 1px solid #28a745;
}

.non-selected-guild-badge {
    background: rgba(108,117,125,0.3);
    color: #adb5bd;
    border: 1px solid #6c757d;
}
.guild-management-scroll::-webkit-scrollbar{width:8px}
.guild-management-scroll::-webkit-scrollbar-track{background:rgba(0,0,0,0.3);border-radius:4px}
.guild-management-scroll::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#0f4c75,#3282b8);border-radius:4px}
.guild-management-scroll::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#3282b8,#0f4c75)}
`,

black: `#online-box{position:fixed;background:linear-gradient(135deg,#000000,#1a1a1a);border:2px solid #333333;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:9999;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;backdrop-filter:blur(10px);min-width:260px;min-height:100px}#online-box.hidden{display:none}#online-box-header{background:linear-gradient(135deg,#000000,#333333);color:white;padding:12px 15px;font-weight:bold;font-size:14px;cursor:move;user-select:none;position:relative;display:flex;justify-content:space-between;align-items:center}#online-box-title{color:white;font-weight:bold;display:flex;align-items:center;gap:8px}#online-box-title .emoji{font-size:16px;animation:pulse 2s infinite}#vip-button{background:linear-gradient(135deg,#333333,#555555);border:2px solid #666666;color:white;font-size:14px;cursor:pointer;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-weight:bold;box-shadow:0 2px 8px rgba(255,255,255,0.1);margin-left:8px}#vip-button:hover{transform:scale(1.1) rotate(10deg);box-shadow:0 4px 12px rgba(255,255,255,0.2)}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}#online-box-buttons{display:flex;gap:5px}#online-box-buttons button{background:rgba(255,255,255,0.2);border:none;color:white;font-size:14px;cursor:pointer;padding:4px 8px;border-radius:4px;transition:all 0.2s;font-weight:bold}#online-box-buttons button:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}#online-box-buttons button#theme-btn{background:linear-gradient(135deg,#ff6b6b,#ee5a52);border:2px solid #ff4444;color:white}#online-box-buttons button#theme-btn:hover{background:linear-gradient(135deg,#ee5a52,#ff6b6b);transform:translateY(-1px) scale(1.05)}#online-box-controls{padding:10px;background:rgba(0,0,0,0.3);border-bottom:1px solid rgba(51,51,51,0.5)}#filter-select{width:100%;background:linear-gradient(135deg,rgba(0,0,0,0.3),rgba(51,51,51,0.2));color:#e8f4fd;border:1px solid rgba(51,51,51,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}#filter-select:focus{border-color:#666666;box-shadow:0 0 10px rgba(102,102,102,0.3)}#filter-select option{background:#1a1a1a;color:#e8f4fd}#online-content{display:flex;flex-direction:column;height:calc(100% - 180px);background:rgba(0,0,0,0.2)}#table-header{background:linear-gradient(135deg,rgba(0,0,0,0.4),rgba(51,51,51,0.3));color:#cccccc;padding:8px;font-size:12px;font-weight:bold;border-bottom:1px solid rgba(51,51,51,0.5);display:flex;position:sticky;top:0;z-index:10}#table-header>div{padding:0 8px}#table-header .col-nick{flex:1;text-align:left}#table-header .col-level{width:60px;text-align:right}#table-header .col-titan{width:80px;text-align:right}#table-body{flex:1;overflow-y:auto;position:relative}.player-row{display:flex;padding:6px 8px;color:#e8f4fd;font-size:12px;border-bottom:1px solid rgba(51,51,51,0.2);transition:all 0.2s}.player-row:hover{background:linear-gradient(135deg,rgba(0,0,0,0.2),rgba(51,51,51,0.1))}.player-row>div{padding:0 8px}.player-row .col-nick{flex:1;text-align:left;display:flex;align-items:center;gap:4px}.player-row .col-level{width:60px;text-align:right}.player-row .col-titan{width:80px;text-align:right;display:flex;align-items:center;justify-content:flex-end;gap:4px}.titan-highlight{color:#ff6b6b!important;font-weight:bold!important;text-shadow:0 0 5px rgba(255,107,107,0.3)}.player-emoji{font-size:10px;opacity:0.8}.titan-emoji{font-size:10px;opacity:0.9}.vip-player{background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,165,0,0.1));border-left:3px solid #ffd700}.no-data{text-align:center;color:#a8dadc;padding:20px;font-style:italic;font-size:12px}.creator-player{background:linear-gradient(135deg,rgba(255,0,0,0.15),rgba(139,0,0,0.15))!important;border-left:4px solid #ff0000!important;color:#ff4444!important}.creator-label{color:#ff0000!important;font-weight:bold!important;font-size:10px!important;margin-left:6px!important;padding:2px 4px!important;background:rgba(255,0,0,0.2)!important;border-radius:3px!important;display:inline-block!important;text-shadow:none!important}.creator-player .col-nick{color:#ff6666!important;font-weight:bold!important}.creator-player .player-emoji{color:#ff0000!important;font-size:12px!important;text-shadow:0 0 3px rgba(255,0,0,0.5)!important}#level-summary{padding:12px;background:linear-gradient(135deg,rgba(0,0,0,0.6),rgba(51,51,51,0.4));border-top:1px solid rgba(51,51,51,0.5);color:#e8f4fd;font-size:11px;line-height:1.6;border-radius:0 0 8px 8px;position:relative}.summary-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;flex-wrap:wrap;gap:4px}.summary-row:last-child{margin-bottom:0}.summary-row.counts-row{justify-content:flex-start}.summary-counts{display:flex;flex-wrap:wrap;gap:4px;font-weight:bold}.titan-count{background:rgba(0,0,0,0.3);padding:2px 4px;border-radius:4px;font-size:9px;white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:2px;transition:all 0.2s ease;user-select:none}.titan-count:hover{background:rgba(50,130,184,0.4);transform:scale(1.05);border:1px solid rgba(50,130,184,0.6);box-shadow:0 2px 8px rgba(50,130,184,0.3);cursor:pointer}.titan-count.highlight{background:rgba(255,107,107,0.3);color:#ff6b6b;border:1px solid rgba(255,107,107,0.5)}.titan-count.highlight:hover{background:rgba(255,107,107,0.5);border:1px solid rgba(255,107,107,0.8);box-shadow:0 2px 8px rgba(255,107,107,0.4)}
.last-refresh{color:#a8dadc;font-size:9px;font-style:italic}.collapsed #online-content,.collapsed #online-box-controls{display:none}.collapsed #online-box{height:auto!important;width:auto!important;min-width:250px}#table-body::-webkit-scrollbar{width:8px}#table-body::-webkit-scrollbar-track{background:rgba(0,0,0,0.3);border-radius:4px}#table-body::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#000000,#333333);border-radius:4px}#table-body::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#333333,#555555)}.resizer{width:14px;height:14px;position:absolute;right:2px;bottom:2px;cursor:se-resize;background:linear-gradient(135deg,#000000,#333333);border-radius:3px;z-index:10;opacity:0.7;transition:opacity 0.2s}.resizer:hover{opacity:1}@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}#online-box{animation:fadeIn 0.3s ease-out}.vip-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;justify-content:center;align-items:center}.vip-dialog{background:linear-gradient(135deg,#000000,#1a1a1a);border:2px solid #333333;border-radius:12px;padding:20px;width:400px;max-height:500px;color:#e8f4fd;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.vip-modal h3{margin-top:0;color:#cccccc}.vip-input-row{margin-bottom:15px}.vip-input-row input{width:70%;padding:8px;background:rgba(51,51,51,0.2);border:1px solid #333333;border-radius:4px;color:#e8f4fd;margin-right:10px}.vip-input-row button{padding:8px 12px;background:#333333;border:none;border-radius:4px;color:white;cursor:pointer}.vip-list-container{max-height:300px;overflow-y:auto;margin-bottom:15px;border:1px solid #333333;border-radius:4px;padding:10px;background:rgba(0,0,0,0.3)}.vip-item{display:flex;justify-content:space-between;align-items:center;padding:5px;margin:2px 0;background:rgba(51,51,51,0.1);border-radius:4px}.vip-remove-btn{background:#ff4444;border:none;border-radius:3px;color:white;padding:2px 6px;cursor:pointer;font-size:12px}.vip-close-btn{background:#666;border:none;border-radius:4px;color:white;cursor:pointer;padding:8px 16px}#summary-box{position:fixed;background:linear-gradient(135deg,#000000,#1a1a1a);border:2px solid #333333;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:9998;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;backdrop-filter:blur(10px);min-width:280px;min-height:120px}#summary-box-header{background:linear-gradient(135deg,#000000,#333333);color:white;padding:8px 12px;font-weight:bold;font-size:12px;cursor:move;user-select:none;display:flex;justify-content:space-between;align-items:center}#summary-box-title{color:white;font-weight:bold;display:flex;align-items:center;gap:6px}#summary-box-buttons{display:flex;gap:4px}#summary-box-buttons button{background:rgba(255,255,255,0.2);border:none;color:white;font-size:12px;cursor:pointer;padding:3px 6px;border-radius:3px;transition:all 0.2s;font-weight:bold}#summary-box-buttons button:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}#summary-content{padding:8px;color:#e8f4fd;font-size:10px;line-height:1.4}.show-main-btn{position:fixed;top:10px;right:10px;z-index:10001;background:linear-gradient(135deg,#000000,#333333);border:2px solid #333333;color:white;padding:8px;border-radius:50%;cursor:move;font-size:12px;box-shadow:0 4px 16px rgba(0,0,0,0.3);transition:all 0.2s;opacity:0.8;user-select:none;width:55px;height:55px;display:flex;align-items:center;justify-content:center}.show-main-btn:hover{transform:scale(1.05) rotate(15deg);box-shadow:0 6px 20px rgba(0,0,0,0.4);opacity:1}#level-summary.detached{display:none}#send-all-btn{position:relative}#send-all-btn:hover::after{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:4px 8px;border-radius:4px;font-size:10px;white-space:nowrap;z-index:1000}#summary-box .detached-controls{padding:8px;text-align:center;border-top:1px solid rgba(51,51,51,0.5);background:rgba(0,0,0,0.2)}#summary-box .detached-controls button{background:#333333;border:none;color:white;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;margin:0 2px}#summary-box .detached-controls button:hover{background:#555555}.guild-select{background:linear-gradient(135deg,rgba(0,0,0,0.3),rgba(51,51,51,0.2));color:#e8f4fd;border:1px solid rgba(51,51,51,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}.guild-select:focus{border-color:#666666;box-shadow:0 0 10px rgba(102,102,102,0.3)}.guild-select option{background:#1a1a1a;color:#e8f4fd}.guild-management-dialog .vip-input-row select{width:100%;background:linear-gradient(135deg,rgba(0,0,0,0.3),rgba(51,51,51,0.2));color:#e8f4fd;border:1px solid rgba(51,51,51,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}.guild-management-dialog .vip-input-row select:focus{border-color:#666666;box-shadow:0 0 10px rgba(102,102,102,0.3)}.guild-management-dialog .vip-input-row select option{background:#1a1a1a;color:#e8f4fd}#guild-button{
    background:linear-gradient(135deg,#28a745,#20c997);
    border:2px solid #17a2b8;
    color:white;
    font-size:14px;
    cursor:pointer;
    width:24px;
    height:24px;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    transition:all 0.2s;
    font-weight:bold;
    box-shadow:0 2px 8px rgba(40,167,69,0.3);
    margin-left:8px
}

#guild-button:hover{
    transform:scale(1.1) rotate(10deg);
    box-shadow:0 4px 12px rgba(40,167,69,0.5)
}

.guild-player {
    background: linear-gradient(135deg, rgba(40,167,69,0.15), rgba(32,201,151,0.15));
    border-left: 3px solid var(--guild-color, #28a745);
}

.guild-player .col-nick {
    color: var(--guild-text-color, #90EE90) !important;
}
.guild-checkbox-container {
    margin: 5px 0;
    padding: 8px;
    background: rgba(50,130,184,0.1);
    border-radius: 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
}

.guild-checkbox-container:hover {
    background: rgba(50,130,184,0.2);
    border-color: rgba(50,130,184,0.3);
}

.guild-checkbox-container.selected {
    background: rgba(40,167,69,0.2);
    border-color: #28a745;
}

.guild-checkbox {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    cursor: pointer;
    appearance: none;
    background: rgba(0,0,0,0.3);
    border: 2px solid #666;
    border-radius: 4px;
    position: relative;
    transition: all 0.2s;
}

.guild-checkbox:checked {
    background: #28a745;
    border-color: #28a745;
}

.guild-checkbox:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 12px;
}

.guild-checkbox-label {
    flex: 1;
    cursor: pointer;
    color: #e8f4fd;
    font-weight: 500;
}

.guild-checkbox-container.selected .guild-checkbox-label {
    color: #90EE90;
    font-weight: bold;
}
.non-selected-guild-player {
    background: linear-gradient(135deg, rgba(108,117,125,0.1), rgba(73,80,87,0.1)) !important;
    border-left: 2px solid #6c757d !important;
    opacity: 0.7;
}

.non-selected-guild-player .col-nick {
    color: #adb5bd !important;
}

.guild-info-badge {
    font-size: 9px;
    padding: 1px 4px;
    border-radius: 3px;
    margin-left: 4px;
    font-weight: bold;
}

.selected-guild-badge {
    background: rgba(40,167,69,0.3);
    color: #90EE90;
    border: 1px solid #28a745;
}

.non-selected-guild-badge {
    background: rgba(108,117,125,0.3);
    color: #adb5bd;
    border: 1px solid #6c757d;
}
.guild-color-picker {
    width: 25px !important;
    height: 18px !important;
    border: 1px solid rgba(255,255,255,0.3) !important;
    border-radius: 3px !important;
    cursor: pointer !important;
    margin-left: 8px !important;
    padding: 0 !important;
    background: none !important;
}

.guild-color-picker:hover {
    border-color: rgba(255,255,255,0.6) !important;
    transform: scale(1.1) !important;
}
.guild-management-scroll::-webkit-scrollbar{width:8px}
.guild-management-scroll::-webkit-scrollbar-track{background:rgba(0,0,0,0.3);border-radius:4px}
.guild-management-scroll::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#000000,#333333);border-radius:4px}
.guild-management-scroll::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#333333,#555555)}
`
};

let currentTheme = localStorage.getItem('onlineTheme') || 'blue';

    const styles = `#online-box{position:fixed;background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #0f4c75;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:9999;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;backdrop-filter:blur(10px);min-width:260px;min-height:100px}#online-box.hidden{display:none}#online-box-header{background:linear-gradient(135deg,#0f4c75,#3282b8);color:white;padding:12px 15px;font-weight:bold;font-size:14px;cursor:move;user-select:none;position:relative;display:flex;justify-content:space-between;align-items:center}#online-box-title{color:white;font-weight:bold;display:flex;align-items:center;gap:8px}#online-box-title .emoji{font-size:16px;animation:pulse 2s infinite}#vip-button{background:linear-gradient(135deg,#ffd700,#ffb300);border:2px solid #ffa000;color:#1a1a2e;font-size:14px;cursor:pointer;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-weight:bold;box-shadow:0 2px 8px rgba(255,215,0,0.3);margin-left:8px}#vip-button:hover{transform:scale(1.1) rotate(10deg);box-shadow:0 4px 12px rgba(255,215,0,0.5)}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}#online-box-buttons{display:flex;gap:5px}#online-box-buttons button{background:rgba(255,255,255,0.2);border:none;color:white;font-size:14px;cursor:pointer;padding:4px 8px;border-radius:4px;transition:all 0.2s;font-weight:bold}#online-box-buttons button:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}#online-box-controls{padding:10px;background:rgba(0,0,0,0.3);border-bottom:1px solid rgba(15,76,117,0.5)}#filter-select{width:100%;background:linear-gradient(135deg,rgba(15,76,117,0.3),rgba(50,130,184,0.2));color:#e8f4fd;border:1px solid rgba(15,76,117,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}#filter-select:focus{border-color:#3282b8;box-shadow:0 0 10px rgba(50,130,184,0.3)}#filter-select option{background:#16213e;color:#e8f4fd}#online-content{display:flex;flex-direction:column;height:calc(100% - 180px);background:rgba(0,0,0,0.2)}#table-header{background:linear-gradient(135deg,rgba(15,76,117,0.4),rgba(50,130,184,0.3));color:#3282b8;padding:8px;font-size:12px;font-weight:bold;border-bottom:1px solid rgba(15,76,117,0.5);display:flex;position:sticky;top:0;z-index:10}#table-header>div{padding:0 8px}#table-header .col-nick{flex:1;text-align:left}#table-header .col-level{width:60px;text-align:right}#table-header .col-titan{width:80px;text-align:right}#table-body{flex:1;overflow-y:auto;position:relative}.player-row{display:flex;padding:6px 8px;color:#e8f4fd;font-size:12px;border-bottom:1px solid rgba(15,76,117,0.2);transition:all 0.2s}.player-row:hover{background:linear-gradient(135deg,rgba(15,76,117,0.2),rgba(50,130,184,0.1))}.player-row>div{padding:0 8px}.player-row .col-nick{flex:1;text-align:left;display:flex;align-items:center;gap:4px}.player-row .col-level{width:60px;text-align:right}.player-row .col-titan{width:80px;text-align:right;display:flex;align-items:center;justify-content:flex-end;gap:4px}.titan-highlight{color:#ff6b6b!important;font-weight:bold!important;text-shadow:0 0 5px rgba(255,107,107,0.3)}.player-emoji{font-size:10px;opacity:0.8}.titan-emoji{font-size:10px;opacity:0.9}.vip-player{background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,165,0,0.1));border-left:3px solid #ffd700}.no-data{text-align:center;color:#a8dadc;padding:20px;font-style:italic;font-size:12px}.creator-player{background:linear-gradient(135deg,rgba(255,0,0,0.15),rgba(139,0,0,0.15))!important;border-left:4px solid #ff0000!important;color:#ff4444!important}.creator-label{color:#ff0000!important;font-weight:bold!important;font-size:10px!important;margin-left:6px!important;padding:2px 4px!important;background:rgba(255,0,0,0.2)!important;border-radius:3px!important;display:inline-block!important;text-shadow:none!important}.creator-player .col-nick{color:#ff6666!important;font-weight:bold!important}.creator-player .player-emoji{color:#ff0000!important;font-size:12px!important;text-shadow:0 0 3px rgba(255,0,0,0.5)!important}#level-summary{padding:12px;background:linear-gradient(135deg,rgba(15,76,117,0.6),rgba(50,130,184,0.4));border-top:1px solid rgba(15,76,117,0.5);color:#e8f4fd;font-size:11px;line-height:1.6;border-radius:0 0 8px 8px;position:relative}.summary-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;flex-wrap:wrap;gap:4px}.summary-row:last-child{margin-bottom:0}.summary-row.counts-row{justify-content:flex-start}.summary-counts{display:flex;flex-wrap:wrap;gap:4px;font-weight:bold}.titan-count{background:rgba(0,0,0,0.3);padding:2px 4px;border-radius:4px;font-size:9px;white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:2px}.titan-count.highlight{background:rgba(255,107,107,0.3);color:#ff6b6b;border:1px solid rgba(255,107,107,0.5)}.last-refresh{color:#a8dadc;font-size:9px;font-style:italic}.collapsed #online-content,.collapsed #online-box-controls{display:none}.collapsed #online-box{height:auto!important;width:auto!important;min-width:250px}#table-body::-webkit-scrollbar{width:8px}#table-body::-webkit-scrollbar-track{background:rgba(0,0,0,0.3);border-radius:4px}#table-body::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#0f4c75,#3282b8);border-radius:4px}#table-body::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#3282b8,#0f4c75)}.resizer{width:14px;height:14px;position:absolute;right:2px;bottom:2px;cursor:se-resize;background:linear-gradient(135deg,#0f4c75,#3282b8);border-radius:3px;z-index:10;opacity:0.7;transition:opacity 0.2s}.resizer:hover{opacity:1}@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}#online-box{animation:fadeIn 0.3s ease-out}.vip-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;justify-content:center;align-items:center}.vip-dialog{background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #0f4c75;border-radius:12px;padding:20px;width:400px;max-height:500px;color:#e8f4fd;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.vip-modal h3{margin-top:0;color:#3282b8}.vip-input-row{margin-bottom:15px}.vip-input-row input{width:70%;padding:8px;background:rgba(50,130,184,0.2);border:1px solid #0f4c75;border-radius:4px;color:#e8f4fd;margin-right:10px}.vip-input-row button{padding:8px 12px;background:#3282b8;border:none;border-radius:4px;color:white;cursor:pointer}.vip-list-container{max-height:300px;overflow-y:auto;margin-bottom:15px;border:1px solid #0f4c75;border-radius:4px;padding:10px;background:rgba(0,0,0,0.3)}.vip-item{display:flex;justify-content:space-between;align-items:center;padding:5px;margin:2px 0;background:rgba(50,130,184,0.1);border-radius:4px}.vip-remove-btn{background:#ff4444;border:none;border-radius:3px;color:white;padding:2px 6px;cursor:pointer;font-size:12px}.vip-close-btn{background:#666;border:none;border-radius:4px;color:white;cursor:pointer;padding:8px 16px}
#summary-box{position:fixed;background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #0f4c75;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:9998;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;backdrop-filter:blur(10px);min-width:280px;min-height:120px}#summary-box-header{background:linear-gradient(135deg,#0f4c75,#3282b8);color:white;padding:8px 12px;font-weight:bold;font-size:12px;cursor:move;user-select:none;display:flex;justify-content:space-between;align-items:center}#summary-box-title{color:white;font-weight:bold;display:flex;align-items:center;gap:6px}#summary-box-buttons{display:flex;gap:4px}#summary-box-buttons button{background:rgba(255,255,255,0.2);border:none;color:white;font-size:12px;cursor:pointer;padding:3px 6px;border-radius:3px;transition:all 0.2s;font-weight:bold}#summary-box-buttons button:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}#summary-content{padding:8px;color:#e8f4fd;font-size:10px;line-height:1.4}
.show-main-btn{
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10001;
    background: linear-gradient(135deg, #0f4c75, #3282b8);
    border: 2px solid #0f4c75;
    color: white;
    padding: 8px;
    border-radius: 50%;
    cursor: move;
    font-size: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    transition: all 0.2s;
    opacity: 0.8;
    user-select: none;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.show-main-btn:hover {
    transform: scale(1.05) rotate(15deg);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    opacity: 1;
}
#level-summary.detached{display:none}
#send-all-btn {
    position: relative;
}

#send-all-btn:hover::after {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    white-space: nowrap;
    z-index: 1000;
}
#summary-box .detached-controls{padding:8px;text-align:center;border-top:1px solid rgba(15,76,117,0.5);background:rgba(0,0,0,0.2)}
#summary-box .detached-controls button{background:#3282b8;border:none;color:white;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;margin:0 2px}
#summary-box .detached-controls button:hover{background:#4a9fd1}`;

    const emojiMap = {
        'Orla/Kic': '🦅/🐰', 'Kic': '🐰', 'Rene': '⛓️', 'Arcy': '🔥', 'Zoons/Łowka': '🗡️/🏹',
        'Łowka': '🏹', 'Przyzy': '👹', 'Magua': '🐟', 'Teza': '⚡', 'Barba/Tan': '👑'
    };

    const titanGroups = {
        'Orla/Kic': ['Orla/Kic', 'Kic'], 'Kic': ['Orla/Kic', 'Kic'], 'Zoons/Łowka': ['Zoons/Łowka', 'Łowka'],
        'Łowka': ['Zoons/Łowka', 'Łowka'], 'Barba/Tan': ['Barba/Tan'], 'Rene': ['Rene'], 'Arcy': ['Arcy'],
        'Przyzy': ['Przyzy'], 'Magua': ['Magua'], 'Teza': ['Teza']
    };
// Funkcja do zmiany motywu
function switchTheme() {
    currentTheme = currentTheme === 'blue' ? 'black' : 'blue';
    localStorage.setItem('onlineTheme', currentTheme);
    applyTheme();

    const themeMsg = document.createElement('div');
    themeMsg.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10002;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white; padding: 8px 16px; border-radius: 6px;
        font-weight: bold; font-size: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        animation: fadeIn 0.3s ease-out;
    `;
    themeMsg.innerHTML = `🎨 Zmieniono motyw na: ${currentTheme === 'blue' ? 'Niebieski' : 'Czarny'}`;
    document.body.appendChild(themeMsg);

    setTimeout(() => {
        if (themeMsg.parentNode) {
            themeMsg.remove();
        }
    }, 2000);
}

// Funkcja do aplikowania motywu
function applyTheme() {
    let styleSheet = document.querySelector('#online-styles');
    if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'online-styles';
        document.head.appendChild(styleSheet);
    }

    styleSheet.textContent = themes[currentTheme];
}

function constrainToViewport(x, y, width, height) {
    const maxX = Math.max(0, window.innerWidth - width);
    const maxY = Math.max(0, window.innerHeight - height);
    return {
        x: Math.min(Math.max(0, x), maxX),
        y: Math.min(Math.max(0, y), maxY)
    };
}

    function getTitanName(level) {
        for (let i = titanList.length - 1; i >= 0; i--) {
            if (level >= titanList[i].level) return titanList[i].name;
        }
        return '-';
    }

    function getTitanEmoji(name) { return emojiMap[name] || ''; }
    function getTitanGroup(name) { return titanGroups[name] || [name]; }
    function getVipPlayers() { return JSON.parse(localStorage.getItem('vipPlayers') || '[]'); }
    function getCreatorPlayers() { return creatorList; }
    function saveVipPlayers(players) { localStorage.setItem('vipPlayers', JSON.stringify(players)); }

function getPlayerEmoji(name, level) {
    if (getCreatorPlayers().includes(name)) return '👹';
    if (getVipPlayers().includes(name)) return '⭐';
    if (level >= 300) return '👑';
    if (level >= 244) return '💎';
    if (level >= 190) return '🔥';
    if (level >= 167) return '⚔️';
    if (level >= 114) return '🛡️';
    if (level >= 64) return '🗡️';
    return '🪓';
}
function getSelectedGuilds() {
    const saved = localStorage.getItem('selectedGuilds');
    return saved ? JSON.parse(saved) : [];
}

function setSelectedGuilds(guilds) {
    localStorage.setItem('selectedGuilds', JSON.stringify(guilds));
}
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function toggleGuildSelection(guild) {
    const selected = getSelectedGuilds();
    const index = selected.indexOf(guild);
    if (index > -1) {
        selected.splice(index, 1);
    } else {
        selected.push(guild);
    }
    setSelectedGuilds(selected);
}

function setSelectedGuild(guild) {
    localStorage.setItem('selectedGuild', guild);
}

    function showMainBox() {
        const mainBox = document.getElementById(boxId);
        const showBtn = document.querySelector('.show-main-btn');
        if (mainBox) {
            mainBox.classList.remove('hidden');
            isMainBoxHidden = false;
            localStorage.setItem('mainBoxHidden', 'false');
        }
        if (showBtn) {
            showBtn.remove();
        }
    }

function hideMainBox() {
    const mainBox = document.getElementById(boxId);
    if (mainBox) {
        mainBox.classList.add('hidden');
        isMainBoxHidden = true;
        localStorage.setItem('mainBoxHidden', 'true');

        // Create show button - POPRAWIONA WERSJA
        const showBtn = document.createElement('button');
        showBtn.className = 'show-main-btn';
        showBtn.innerHTML = '👁️';


        // Restore saved position BEFORE adding to DOM
        const savedPos = JSON.parse(localStorage.getItem('showButtonPosition') || '{}');
        if (savedPos.x !== undefined && savedPos.y !== undefined) {
            const constrained = constrainToViewport(savedPos.x, savedPos.y, 55, 55);
            showBtn.style.left = `${constrained.x}px`;
            showBtn.style.top = `${constrained.y}px`;
            showBtn.style.right = 'auto';
        }

        // Add click handler that checks if button wasn't dragged
        showBtn.addEventListener('click', (e) => {
            showMainBox();
        });

        document.body.appendChild(showBtn);
        makeDraggableButton(showBtn);
    }
}


function makeDraggableButton(element) {
    let isDragging = false, offsetX = 0, offsetY = 0, hasMoved = false;
    let startX = 0, startY = 0;

    // Blokuj kliknięcie jeśli było przeciąganie
    element.addEventListener('click', e => {
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true); // Użyj capture phase

    element.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;

        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);

        if (deltaX > 3 || deltaY > 3) {
            hasMoved = true;
        }

        const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - element.offsetWidth);
        const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - element.offsetHeight);
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.right = 'auto';

        localStorage.setItem('showButtonPosition', JSON.stringify({x, y}));
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            // Reset flagi po krótkiej chwili
            setTimeout(() => {
                hasMoved = false;
            }, 150);
        }
    });
}
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.right = "auto";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

    function createSummaryBox() {
        let summaryBox = document.getElementById(summaryBoxId);
        if (!summaryBox) {
            summaryBox = document.createElement('div');
            summaryBox.id = summaryBoxId;

            const savedPos = JSON.parse(localStorage.getItem('summaryBoxPosition') || '{}');
            const width = savedPos.w || 320;
            const height = savedPos.h || 160;
            const constrained = constrainToViewport(savedPos.x || 370, savedPos.y || 50, width, height);

            summaryBox.style.left = `${constrained.x}px`;
            summaryBox.style.top = `${constrained.y}px`;
            summaryBox.style.width = `${width}px`;
            summaryBox.style.height = `${height}px`;

summaryBox.innerHTML = `
    <div id="summary-box-header">
        <div id="summary-box-title">
            📌 Podsumowanie
        </div>
        <div id="summary-box-buttons">
            <button id="attach-summary-btn">📎</button>
            <button id="close-summary-btn">✕</button>
        </div>
    </div>
    <div id="summary-content"></div>
    <div class="detached-controls">
        <button id="send-all-detached-btn">📤 Wyślij wszystkie</button>
    </div>
    <div class="resizer"></div>
`;


            document.body.appendChild(summaryBox);

            summaryBox.querySelector('#attach-summary-btn').onclick = () => {
                attachSummary();
            };
summaryBox.querySelector('#send-all-detached-btn').onclick = () => {
    sendAllTitansToDiscord();
};

            summaryBox.querySelector('#close-summary-btn').onclick = () => {
                summaryBox.remove();
                isSummaryDetached = false;
                localStorage.setItem('summaryDetached', 'false');
                const mainSummary = document.querySelector('#level-summary');
                if (mainSummary) {
                    mainSummary.classList.remove('detached');
                }
            };

            makeDraggable(summaryBox.querySelector('#summary-box-header') ? summaryBox : null, '#summary-box-header');

            makeResizable(summaryBox, 'summaryBoxPosition');
        }
        return summaryBox;
    }

function detachSummary() {
    isSummaryDetached = true;
    localStorage.setItem('summaryDetached', 'true');

    const mainSummary = document.querySelector('#level-summary');
    if (mainSummary) {
        mainSummary.classList.add('detached');
    }

    const summaryBox = createSummaryBox();

    // Sprawdź i popraw pozycję po utworzeniu
    const savedPos = JSON.parse(localStorage.getItem('summaryBoxPosition') || '{}');
    if (savedPos.x !== undefined && savedPos.y !== undefined) {
        const width = summaryBox.offsetWidth || savedPos.w || 320;
        const height = summaryBox.offsetHeight || savedPos.h || 160;
        const constrained = constrainToViewport(savedPos.x, savedPos.y, width, height);

        summaryBox.style.left = `${constrained.x}px`;
        summaryBox.style.top = `${constrained.y}px`;
    }

    // Natychmiast aktualizuj odpięte okno z aktualnymi danymi
    updateSummaryContent();
}

    function attachSummary() {
        const summaryBox = document.getElementById(summaryBoxId);
        if (summaryBox) {
            summaryBox.remove();
        }

        isSummaryDetached = false;
        localStorage.setItem('summaryDetached', 'false');

        const mainSummary = document.querySelector('#level-summary');
        if (mainSummary) {
            mainSummary.classList.remove('detached');
        }
    }
    function removeGuildData(guildName) {
    // Usuń wszystkich graczy z tego klanu
    Object.keys(playerGuilds).forEach(playerName => {
        if (playerGuilds[playerName] === guildName) {
            delete playerGuilds[playerName];
        }
    });

    // Usuń klan z wybranych
    const selectedGuilds = getSelectedGuilds();
    const index = selectedGuilds.indexOf(guildName);
    if (index > -1) {
        selectedGuilds.splice(index, 1);
        setSelectedGuilds(selectedGuilds);
    }

    // Zaktualizuj obserwowane klany
    updateObservedGuilds();

    // Zapisz zmiany
    localStorage.setItem('playerGuilds', JSON.stringify(playerGuilds));

    console.log(`Usunięto klan: ${guildName}`);
}

function showGuildManagement() {
    const modal = document.createElement('div');
    modal.className = 'vip-modal';
    modal.innerHTML = `<div class="vip-dialog guild-management-dialog" style="width: 600px; max-height: 700px;">
        <h3>🏰 Zarządzanie Klanami</h3>

        <div style="margin-bottom: 15px;">
            <h4 style="color: #3282b8; margin: 0 0 10px 0;">📝 Dodaj kod ze scrapera:</h4>
            <textarea id="guild-code-input" placeholder="Wklej tutaj kod JavaScript ze scrapera klanów..."
                style="width: 100%; height: 120px; background: rgba(50,130,184,0.2); border: 1px solid #0f4c75;
                border-radius: 4px; color: #e8f4fd; padding: 8px; font-family: monospace; font-size: 11px;"></textarea>
            <button id="import-guild-code" style="background: #3282b8; border: none; color: white; padding: 8px 16px;
                border-radius: 4px; cursor: pointer; margin-top: 5px; font-weight: bold;">
                📥 Importuj dane klanów
            </button>
        </div>

        <div style="margin-bottom: 15px;">
            <h4 style="color: #3282b8; margin: 0 0 10px 0;">🎯 Wybierz klany do filtrowania:</h4>
            <div id="guild-checkboxes" class="guild-management-scroll" style="max-height: 150px; overflow-y: auto; background: rgba(0,0,0,0.3);
    padding: 10px; border-radius: 4px; border: 1px solid rgba(15,76,117,0.5);"></div>

        <div style="margin-bottom: 15px;">
            <h4 style="color: #3282b8; margin: 0 0 10px 0;">📊 Statystyki klanów online:</h4>
            <div id="guild-stats" class="guild-management-scroll" style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px;
    max-height: 200px; overflow-y: auto; font-size: 11px;"></div>

        <div style="text-align: right;">
            <button id="clear-guilds" style="background: #ff4444; border: none; color: white; padding: 8px 16px;
                border-radius: 4px; cursor: pointer; margin-right: 10px;">🗑️ Wyczyść</button>
            <button class="vip-close-btn" id="close-guild">Zamknij</button>
        </div>
    </div>`;

    document.body.appendChild(modal);

    const dialog = modal.querySelector('.vip-dialog');

function updateGuildCheckboxes() {
    const checkboxContainer = document.querySelector('#guild-checkboxes');
    const selectedGuilds = getSelectedGuilds();

    if (observedGuilds.length === 0) {
        checkboxContainer.innerHTML = '<div style="color: #a8dadc; text-align: center; padding: 20px;">Brak klanów do wyboru</div>';
        return;
    }

    checkboxContainer.innerHTML = observedGuilds.map(guild => {
        const isSelected = selectedGuilds.includes(guild);
        const guildColor = getGuildColor(guild);
        return `
            <div class="guild-checkbox-container ${isSelected ? 'selected' : ''}" data-guild="${guild}">
                <input type="checkbox" class="guild-checkbox" id="guild-${guild}" ${isSelected ? 'checked' : ''}>
                <label class="guild-checkbox-label" for="guild-${guild}">🏰 ${guild}</label>
                <input type="color" class="guild-color-picker" value="${guildColor}" data-guild="${guild}"
                       style="width: 30px; height: 20px; border: none; border-radius: 3px; cursor: pointer; margin-left: 8px;">
                <button class="guild-remove-btn" data-guild="${guild}" style="background: #ff4444; border: none; border-radius: 3px; color: white; padding: 2px 6px; cursor: pointer; font-size: 10px; margin-left: 8px;">🗑️</button>
            </div>
        `;
    }).join('');

    // Dodaj event listenery
    checkboxContainer.querySelectorAll('.guild-checkbox-container').forEach(container => {
        const guild = container.getAttribute('data-guild');
        const checkbox = container.querySelector('.guild-checkbox');

        checkboxContainer.querySelectorAll('.guild-color-picker').forEach(colorPicker => {
            colorPicker.addEventListener('click', (e) => {
                e.stopPropagation(); // Zapobiega kliknięciu checkboxa
            });

            colorPicker.addEventListener('change', (e) => {
                const guildName = e.target.getAttribute('data-guild');
                const newColor = e.target.value;
                setGuildColor(guildName, newColor);

                // Natychmiast odśwież wygląd graczy
                if (typeof fetchPlayers === 'function') {
                    fetchPlayers();
                }

                console.log(`Zmieniono kolor klanu ${guildName} na ${newColor}`);
            });
        });

        container.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                checkbox.checked = !checkbox.checked;
            }

            // Aktualizuj wygląd kontenera
            if (checkbox.checked) {
                container.classList.add('selected');
            } else {
                container.classList.remove('selected');
            }

            toggleGuildSelection(guild);
            updateFilterOptions();

            // Natychmiast odśwież listę graczy
            if (typeof fetchPlayers === 'function') {
                fetchPlayers();
            }
        });
    });

    checkboxContainer.querySelectorAll('.guild-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Zapobiega kliknięciu checkboxa
            const guildName = btn.getAttribute('data-guild');

            if (confirm(`🗑️ Czy na pewno chcesz usunąć klan "${guildName}"?\nTo usunie wszystkich graczy z tego klanu.`)) {
                removeGuildData(guildName);
                updateGuildCheckboxes();
                updateGuildStats();
                updateFilterOptions();

                // Odśwież listę graczy jeśli funkcja istnieje
                if (typeof fetchPlayers === 'function') {
                    fetchPlayers();
                }
            }
        });
    });

    checkboxContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.currentTarget.scrollTop += e.deltaY;
    });
}

    function updateGuildStats() {
        if (!currentPlayersData || !Array.isArray(currentPlayersData)) {
            document.getElementById('guild-stats').innerHTML = '<div style="color: #a8dadc;">Brak danych graczy</div>';
            return;
        }

        const guildStats = {};
        let playersWithGuild = 0;

        currentPlayersData.forEach(player => {
            const guild = getPlayerGuild(player.n);
            if (guild) {
                if (!guildStats[guild]) {
                    guildStats[guild] = [];
                }
                guildStats[guild].push(player);
                playersWithGuild++;
            }
        });

        const statsHtml = Object.entries(guildStats)
            .sort(([,a], [,b]) => b.length - a.length)
            .map(([guild, players]) => {
                return `<div style="margin: 5px 0; padding: 5px; background: rgba(50,130,184,0.1); border-radius: 3px;">
                    <strong>🏰 ${guild}</strong> - ${players.length} graczy online
                </div>`;
            }).join('');

        const summary = `<div style="margin-bottom: 10px; color: #3282b8; font-weight: bold;">
            📈 Graczy z klanem: ${playersWithGuild}/${currentPlayersData.length}
        </div>`;

        document.getElementById('guild-stats').innerHTML = summary + (statsHtml || '<div style="color: #a8dadc;">Brak graczy z klanów online</div>');
    }

    dialog.querySelector('#import-guild-code').onclick = () => {
        const code = dialog.querySelector('#guild-code-input').value.trim();
        if (!code) {
            alert('❌ Wklej kod ze scrapera klanów!');
            return;
        }

        try {
            eval(code);
            updateObservedGuilds();
            updateGuildCheckboxes();
            updateGuildStats();
            updateFilterOptions();

            localStorage.setItem('playerGuilds', JSON.stringify(playerGuilds));
            alert(`✅ Zaimportowano dane klanów!\nWszystkich klanów: ${observedGuilds.length}\nGraczy z klanem: ${Object.keys(playerGuilds).length}`);

            if (typeof fetchPlayers === 'function') {
                fetchPlayers();
            }
        } catch (error) {
            alert(`❌ Błąd importu:\n${error.message}`);
        }
    };

    dialog.querySelector('#clear-guilds').onclick = () => {
        if (confirm('🗑️ Czy na pewno chcesz wyczyścić wszystkie dane klanów?')) {
            Object.keys(playerGuilds).forEach(key => delete playerGuilds[key]);
            observedGuilds = [];
            setSelectedGuilds([]);
            localStorage.removeItem('playerGuilds');
            updateGuildCheckboxes();
            updateGuildStats();
            updateFilterOptions();
            alert('✅ Wyczyszczono dane klanów');

            if (typeof fetchPlayers === 'function') {
                fetchPlayers();
            }
        }
    };

    dialog.querySelector('#close-guild').onclick = () => document.body.removeChild(modal);
    modal.onclick = e => e.target === modal && document.body.removeChild(modal);

    updateGuildCheckboxes();
    updateGuildStats();
    const guildStatsEl = dialog.querySelector('#guild-stats');
    if (guildStatsEl) {
        guildStatsEl.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.currentTarget.scrollTop += e.deltaY;
        });
    }
  }


function updateFilterOptions() {
    const filterSelect = document.querySelector('#filter-select');
    if (!filterSelect) {
        console.log('Filter select nie istnieje jeszcze');
        return;
    }

    const selectedGuilds = getSelectedGuilds();
    const currentValue = filterSelect.value;

    let options = '<option value="all">🗿 Wszystkie klany</option>';

    if (selectedGuilds.length > 0) {
        options += `<option value="selected-guilds">🎯 Wybrane klany (${selectedGuilds.length})</option>`;
        selectedGuilds.forEach(guild => {
            options += `<option value="guild:${guild}">🏰 ${guild}</option>`;
        });
    }

    const otherGuilds = observedGuilds.filter(guild => !selectedGuilds.includes(guild));
    if (otherGuilds.length > 0) {
        otherGuilds.forEach(guild => {
            options += `<option value="guild:${guild}">🏰 ${guild}</option>`;
        });
    }

    options += '<option disabled>────────────</option>';
    options += [...new Set(titanList.map(t => t.name))].map(t =>
        `<option value="${t}">${getTitanEmoji(t)} ${t}</option>`
    ).join('');

    filterSelect.innerHTML = options;

    const optionExists = filterSelect.querySelector(`option[value="${currentValue}"]`);
    if (optionExists) {
        filterSelect.value = currentValue;
    } else {
        filterSelect.value = 'all';
    }
}

    function showVipManagement() {
        const modal = document.createElement('div');
        modal.className = 'vip-modal';
        modal.innerHTML = `<div class="vip-dialog">
            <h3>⭐ Zarządzanie VIP</h3>
            <div class="vip-input-row">
                <input type="text" id="vip-input" placeholder="Wpisz nick gracza...">
                <button id="add-vip">Dodaj</button>
            </div>
            <div class="vip-list-container"><div id="vip-list"></div></div>
            <div style="text-align: right;"><button class="vip-close-btn" id="close-vip">Zamknij</button></div>
        </div>`;
        document.body.appendChild(modal);

        const dialog = modal.querySelector('.vip-dialog');
        const updateVipList = () => {
            const listEl = dialog.querySelector('#vip-list');
            const vips = getVipPlayers();
            listEl.innerHTML = vips.length === 0 ?
                '<div style="text-align: center; color: #a8dadc; font-style: italic;">Brak graczy VIP</div>' :
                vips.map(nick => `<div class="vip-item"><span>⭐ ${nick}</span><button class="vip-remove-btn" data-nick="${nick}">✕</button></div>`).join('');

            listEl.querySelectorAll('.vip-remove-btn').forEach(btn => {
                btn.onclick = () => {
                    saveVipPlayers(getVipPlayers().filter(v => v !== btn.getAttribute('data-nick')));
                    updateVipList();
                    fetchPlayers();
                };
            });
        };

        dialog.querySelector('#add-vip').onclick = () => {
            const input = dialog.querySelector('#vip-input');
            const nick = input.value.trim();
            if (nick && !getVipPlayers().includes(nick)) {
                saveVipPlayers([...getVipPlayers(), nick]);
                updateVipList();
                input.value = '';
                fetchPlayers();
            }
        };

dialog.querySelector('#vip-input').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        dialog.querySelector('#add-vip').click();
    }
});
        dialog.querySelector('#close-vip').onclick = () => document.body.removeChild(modal);
        modal.onclick = e => e.target === modal && document.body.removeChild(modal);
        updateVipList();
    }
function getDiscordWebhookUrl() {
    return localStorage.getItem('discordWebhookUrl') || '';
}

function setDiscordWebhookUrl(url) {
    localStorage.setItem('discordWebhookUrl', url);
}

function showWebhookSettings() {
    const modal = document.createElement('div');
    modal.className = 'vip-modal';
    modal.innerHTML = `<div class="vip-dialog">
        <h3>🔗 Ustawienia Discord Webhook</h3>
        <div class="vip-input-row">
            <input type="text" id="webhook-input" placeholder="Wklej URL webhook Discord..."
                   value="${getDiscordWebhookUrl()}" style="width: 85%;">
        </div>
        <div style="margin: 10px 0; font-size: 12px; color: #a8dadc;">
            💡 Aby utworzyć webhook: Serwer → Edytuj kanał → Integracje → Webhooks → Nowy Webhook
        </div>
        <div style="text-align: right;">
            <button id="save-webhook" style="background: #3282b8; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">Zapisz</button>
            <button class="vip-close-btn" id="close-webhook">Zamknij</button>
        </div>
    </div>`;

    document.body.appendChild(modal);

    modal.querySelector('#save-webhook').onclick = () => {
        const url = modal.querySelector('#webhook-input').value.trim();
        setDiscordWebhookUrl(url);
        document.body.removeChild(modal);
    };

    modal.querySelector('#close-webhook').onclick = () => document.body.removeChild(modal);
    modal.onclick = e => e.target === modal && document.body.removeChild(modal);
}

async function sendToDiscord(titanName, players) { 
    const webhookUrl = getDiscordWebhookUrl();
    if (!webhookUrl) {
        alert('❌ Nie ustawiono URL webhook Discord!\nUstaw go klikając na przedział w podsumowaniu, następnie klikając zębatkę.');
        return;
    }

    if (players.length === 0) {
        alert('❌ Brak graczy w tym przedziale!');
        return;
    }

    const titanEmoji = getTitanEmoji(titanName);
    const timestamp = new Date().toLocaleString('pl-PL');

    // Sortuj graczy według poziomu malejąco
    const sortedPlayers = players.sort((a, b) => b.l - a.l);

    // Buduj listę graczy z emoji
    const playersList = sortedPlayers.map(p => {
        const playerEmoji = getPlayerEmoji(p.n, p.l);
        const isVip = getVipPlayers().includes(p.n);
        const isCreator = getCreatorPlayers().includes(p.n);

        let prefix = '';
        if (isCreator) prefix = '👹 ';
        else if (isVip) prefix = '⭐ ';

        return `${prefix}${playerEmoji} **${p.n}** - LvL ${p.l}`;
    }).join('\n');

    const embed = {
        title: `${titanEmoji} Gracze online - ${titanName}`,
        description: playersList,
        color: 0x3282b8,
        footer: {
            text: `Kaczor Addons - Players Online - Lupus • ${timestamp} • Łącznie: ${players.length} graczy`
        },
        thumbnail: {
            url: "https://cdn.discordapp.com/emojis/123456789.png" // Opcjonalnie - dodaj link do ikony
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

        if (response.ok) {
            // Pokaż komunikat sukcesu
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10002;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white; padding: 12px 20px; border-radius: 8px;
                font-weight: bold; box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                animation: fadeIn 0.3s ease-out;
            `;
            successMsg.innerHTML = `✅ Wysłano listę ${titanName} na Discord!`;
            document.body.appendChild(successMsg);

            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        alert(`❌ Błąd wysyłania na Discord:\n${error.message}`);
    }
}
AllTitansToDiscord() {
    const webhookUrl = getDiscordWebhookUrl();
    if (!webhookUrl) {
        alert('❌ Nie ustawiono URL webhook Discord!\nUstaw go klikając na przedział w podsumowaniu, następnie klikając zębatkę.');
        return;
    }

    if (!currentPlayersData || !Array.isArray(currentPlayersData)) {
        alert('❌ Brak danych graczy!');
        return;
    }

    const timestamp = new Date().toLocaleString('pl-PL');
    const titanSummary = {};

    // Grupuj graczy według tytanów
    currentPlayersData.forEach(p => {
        const titan = getTitanName(p.l);
        if (!titanSummary[titan]) {
            titanSummary[titan] = [];
        }
        titanSummary[titan].push(p);
    });

    // Sortuj tytany według kolejności w titanList
    const sortedTitans = [...new Set(titanList.map(t => t.name))].filter(name => titanSummary[name]);
    if (titanSummary['-']) sortedTitans.push('-');

    const fields = [];

    for (const titanName of sortedTitans) {
        const players = titanSummary[titanName];
        if (players.length === 0) continue;

        const sortedPlayers = players.sort((a, b) => b.l - a.l);
        const titanEmoji = getTitanEmoji(titanName);

        const playersList = sortedPlayers.map(p => {
            const playerEmoji = getPlayerEmoji(p.n, p.l);
            const isVip = getVipPlayers().includes(p.n);
            const isCreator = getCreatorPlayers().includes(p.n);

            let prefix = '';
            if (isCreator) prefix = '👹 ';
            else if (isVip) prefix = '⭐ ';

            return `${prefix}${playerEmoji} **${p.n}** - LvL ${p.l}`;
        }).join('\n');

        fields.push({
            name: `${titanEmoji} ${titanName} (${players.length})`,
            value: playersList.length > 1024 ? playersList.substring(0, 1020) + '...' : playersList,
            inline: false
        });
    }

    const embed = {
        title: `🏰 Wszyscy gracze online - Lupus`,
        description: `Pełna lista graczy online pogrupowanych według tytanów`,
        color: 0x3282b8,
        fields: fields,
        footer: {
            text: `Kaczor Addons - Players Online - Lupus • ${timestamp} • Łącznie: ${currentPlayersData.length} graczy`
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

        if (response.ok) {
            // Pokaż komunikat sukcesu
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 10002;
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white; padding: 12px 20px; border-radius: 8px;
                font-weight: bold; box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                animation: fadeIn 0.3s ease-out;
            `;
            successMsg.innerHTML = `✅ Wysłano wszystkie przedziały na Discord!`;
            document.body.appendChild(successMsg);

            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        alert(`❌ Błąd wysyłania na Discord:\n${error.message}`);
    }
}

function showTitanPlayers(titanName) {
    if (!currentPlayersData || !Array.isArray(currentPlayersData)) {
        return;
    }

    const selectedGuilds = getSelectedGuilds();
    let playersInTitan = currentPlayersData.filter(p => getTitanName(p.l) === titanName);
    let allPlayersInTitan = [...playersInTitan]; // Zachowaj kopię wszystkich graczy

    // Filtruj po wybranych klanach jeśli są ustawione
    let playersFromSelectedGuilds = [];
    if (selectedGuilds.length > 0) {
        playersFromSelectedGuilds = playersInTitan.filter(p => {
            const playerGuild = getPlayerGuild(p.n);
            return playerGuild && selectedGuilds.includes(playerGuild);
        });
    }

    const titleText = selectedGuilds.length > 0 ?
        `${getTitanEmoji(titanName)} ${titanName} - Wybrane klany` :
        `${getTitanEmoji(titanName)} Gracze na tytanie: ${titanName}`;

    const modal = document.createElement('div');
    modal.className = 'vip-modal';

    // Jeśli są wybrane klany, pokaż graczy z wybranych klanów
    const playersToShow = selectedGuilds.length > 0 ? playersFromSelectedGuilds : playersInTitan;

    // Informacja o filtrach
    let filterInfo = '';
    if (selectedGuilds.length > 0) {
        filterInfo = `<div style="background: rgba(40,167,69,0.2); padding: 8px; border-radius: 4px; margin-bottom: 10px; font-size: 11px;">
            <strong>🎯 Filtr aktywny:</strong> Pokazuję tylko graczy z wybranych klanów<br>
            <strong>📊 Statystyki:</strong> ${playersFromSelectedGuilds.length} z wybranych klanów / ${allPlayersInTitan.length} łącznie na ${titanName}
        </div>`;
    }

    const playersListHtml = playersToShow.length === 0 ?
        `<div style="text-align: center; color: #a8dadc; font-style: italic; padding: 20px;">
            ${selectedGuilds.length > 0 ?
                `Brak graczy z wybranych klanów na tytanie ${titanName}<br><small>Łącznie graczy na tym tytanie: ${allPlayersInTitan.length}</small>` :
                `Brak graczy na tytanie ${titanName}`}
        </div>` :
        playersToShow.map(p => {
            const playerEmoji = getPlayerEmoji(p.n, p.l);
            const isVip = getVipPlayers().includes(p.n);
            const isCreator = getCreatorPlayers().includes(p.n);
            const playerClass = isCreator ? 'creator-player' : (isVip ? 'vip-player' : '');
            const playerGuild = getPlayerGuild(p.n);

            return `<div class="vip-item ${playerClass}" style="justify-content: flex-start; gap: 10px;">
                <span style="min-width: 20px;">${playerEmoji}</span>
                <span style="flex: 1; font-weight: bold;">${p.n}</span>
                ${playerGuild ? `<span style="color: #FFA500; font-size: 10px;">[${playerGuild}]</span>` : ''}
                <span style="color: #3282b8; font-weight: bold;">LvL ${p.l}</span>
            </div>`;
        }).join('');

    modal.innerHTML = `<div class="vip-dialog">
        <h3>${titleText}</h3>
        ${filterInfo}
        <div class="vip-list-container" style="max-height: 400px;">
            <div id="titan-players-list">
                ${playersListHtml}
            </div>
        </div>
        <div style="text-align: center; margin: 10px 0;">
            <button id="send-discord-btn" style="background: #7289da; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; font-weight: bold;" ${playersToShow.length === 0 ? 'disabled style="opacity: 0.5;"' : ''}>
                📤 Wyślij na Discord ${selectedGuilds.length > 0 ? '(wybrane klany)' : ''}
            </button>
            <button id="webhook-settings-btn" style="background: #666; border: none; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                ⚙️ Ustawienia
            </button>
        </div>
        <div style="text-align: right; margin-top: 10px;">
            <button class="vip-close-btn" id="close-titan-modal">Zamknij</button>
        </div>
    </div>`;

    document.body.appendChild(modal);

    modal.querySelector('#send-discord-btn').onclick = () => {
        if (playersToShow.length > 0) {
            sendToDiscord(titanName, playersToShow);
        }
    };

    modal.querySelector('#webhook-settings-btn').onclick = () => {
        showWebhookSettings();
    };

    modal.querySelector('#close-titan-modal').onclick = () => document.body.removeChild(modal);
    modal.onclick = e => e.target === modal && document.body.removeChild(modal);
}

    async function fetchPlayers() {
        try {
            const res = await fetch(`https://public-api.margonem.pl/info/online/${worldName}.json`);
            lastRefreshTime = new Date();
            const data = res.ok ? await res.json() : null;
            currentPlayersData = data; // Zachowaj dane globalnie
            renderBox(data);
        } catch (err) {
            lastRefreshTime = new Date();
            currentPlayersData = null;
            renderBox(null);
        }
    }

function generateSummaryHTML(players) {
    if (!players || !Array.isArray(players)) {
        return `
            <div class="summary-row">
                <div class="summary-counts">❌ Brak danych</div>
                <div class="last-refresh">${lastRefreshTime ? `🕐 Ostatnie odświeżenie: ${lastRefreshTime.toLocaleTimeString('pl-PL')}` : ''}</div>
            </div>
        `;
    }

    // ZAWSZE używaj wszystkich graczy do podsumowania, niezależnie od filtrów klanów
    const titanCounts = {}, titanSummary = {};
    players.forEach(p => {
        const titan = getTitanName(p.l);
        getTitanGroup(titan).forEach(g => titanCounts[g] = (titanCounts[g] || 0) + 1);
        titanSummary[titan] = (titanSummary[titan] || 0) + 1;
    });

    const summaryCountsHtml = [...new Set(titanList.map(t => t.name))]
        .filter(name => titanSummary[name])
        .map(name => {
            const count = titanSummary[name];
            const emoji = getTitanEmoji(name);

            // Sprawdź ilu graczy z wybranych klanów jest na tym tytanie
            const selectedGuilds = getSelectedGuilds();
            let selectedGuildCount = 0;
            if (selectedGuilds.length > 0) {
                selectedGuildCount = players.filter(p => {
                    const playerGuild = getPlayerGuild(p.n);
                    return getTitanName(p.l) === name && playerGuild && selectedGuilds.includes(playerGuild);
                }).length;
            }

            // Pokaż informację o wybranych klanach jeśli są ustawione
            const guildInfo = selectedGuilds.length > 0 && selectedGuildCount > 0 ?
                ` (🎯${selectedGuildCount})` : '';

            return `<span class="titan-count ${count >= 3 ? 'highlight' : ''}">${emoji} ${name}: ${count}${guildInfo}</span>`;
        });

    if (titanSummary['-']) {
        const selectedGuilds = getSelectedGuilds();
        let selectedGuildCount = 0;
        if (selectedGuilds.length > 0) {
            selectedGuildCount = players.filter(p => {
                const playerGuild = getPlayerGuild(p.n);
                return getTitanName(p.l) === '-' && playerGuild && selectedGuilds.includes(playerGuild);
            }).length;
        }

        const guildInfo = selectedGuilds.length > 0 && selectedGuildCount > 0 ?
            ` (🎯${selectedGuildCount})` : '';

        summaryCountsHtml.push(`<span class="titan-count">❌ -: ${titanSummary['-']}${guildInfo}</span>`);
    }

    // Pokaż informację o filtrach klanów
    const selectedGuilds = getSelectedGuilds();
    const guildFilterInfo = selectedGuilds.length > 0 ?
        `<div style="font-size: 9px; color: #FFA500; margin-top: 2px;">🎯 Wybrane klany: ${selectedGuilds.join(', ')}</div>` : '';

    return `
        <div class="summary-row">
            <div style="font-weight: bold; color: #3282b8;">👥 Gracze online: ${players.length}</div>
            <div class="last-refresh">${lastRefreshTime ? `🕐 Ostatnie odświeżenie: ${lastRefreshTime.toLocaleTimeString('pl-PL')}` : ''}</div>
        </div>
        <div class="summary-row counts-row">
            <div class="summary-counts">${summaryCountsHtml.join('')}</div>
        </div>
        ${guildFilterInfo}
    `;
}

function addTitanClickListeners(container) {
    const titanCounts = container.querySelectorAll('.titan-count');

    titanCounts.forEach(titanCount => {
        const text = titanCount.textContent.trim();

        // Pomiń elementy bez nazwy tytana lub z "-"
        if (text.includes('❌ -:')) return;

        // POPRAWIONY REGEX - obsługuje też (🎯liczba)
        const match = text.match(/^[^\s]+\s+(.+?):\s*\d+(?:\s*\(🎯\d+\))?$/);
        if (match) {
            const titanName = match[1].trim();

            titanCount.style.cursor = 'pointer';
            titanCount.style.transition = 'all 0.2s';
            titanCount.setAttribute('data-titan', titanName);

            titanCount.addEventListener('mouseenter', () => {
                titanCount.style.transform = 'scale(1.05)';
                titanCount.style.boxShadow = '0 2px 8px rgba(50, 130, 184, 0.4)';
            });

            titanCount.addEventListener('mouseleave', () => {
                titanCount.style.transform = 'scale(1)';
                titanCount.style.boxShadow = '';
            });

            titanCount.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showTitanPlayers(titanName);
            });
        }
    });
}

    function updateSummaryContent() {
        if (!isSummaryDetached) return;

        const summaryBox = document.getElementById(summaryBoxId);
        if (!summaryBox) return;

        const summaryContent = summaryBox.querySelector('#summary-content');
        if (!summaryContent) return;

        // Użyj aktualnych danych z globalnej zmiennej
        summaryContent.innerHTML = generateSummaryHTML(currentPlayersData);
        addTitanClickListeners(summaryContent); // Dla odpięte podsumowanie
    }

function renderBox(players) {

    applyTheme();

    if (!document.querySelector('#online-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'online-styles';
        document.head.appendChild(styleSheet);
    }

        let box = document.getElementById(boxId);
        if (!box) {
            box = document.createElement('div');
            box.id = boxId;
            const savedPos = JSON.parse(localStorage.getItem('onlineBoxPosition') || '{}');
            const width = savedPos.w || 300;
            const height = savedPos.h || 400;
            const constrained = constrainToViewport(savedPos.x || 50, savedPos.y || 50, width, height);

            box.style.left = `${constrained.x}px`;
            box.style.top = `${constrained.y}px`;
            box.style.width = `${width}px`;
            box.style.height = `${height}px`;

            // Check if box should be hidden
            const shouldHide = localStorage.getItem('mainBoxHidden') === 'true';
            if (shouldHide) {
                box.classList.add('hidden');
                isMainBoxHidden = true;
                const showBtn = document.createElement('button');
                showBtn.className = 'show-main-btn';
                showBtn.innerHTML = '👁️';
                showBtn.style.fontSize = '12px';

const savedPos = JSON.parse(localStorage.getItem('showButtonPosition') || '{}');
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

            box.innerHTML = `
                <div id="online-box-header">
                    <div id="online-box-title">
                        <span class="emoji">☀️</span>Online: Lupus
<button id="vip-button">⭐</button>
<button id="guild-button">🏰</button>
                    </div>
<div id="online-box-buttons">
    <button id="toggle-btn">▼</button>
    <button id="refresh-btn">↻</button>
    <button id="theme-btn">🎨</button>
    <button id="detach-summary-btn">📌</button>
    <button id="send-all-btn">📤</button>
    <button id="hide-btn">👁️</button>
</div>
                </div>
                <div id="online-box-controls">
                    <select id="filter-select"></select>
                </div>
                </div>
                <div id="online-content">
                    <div id="table-header">
                        <div class="col-nick">👤 Nick</div>
                        <div class="col-level">📊 LvL</div>
                        <div class="col-titan">⚔️ Tytan</div>
                    </div>
                    <div id="table-body"></div>
                </div>
                <div id="level-summary"></div>
                <div class="resizer"></div>
            `;

            document.body.appendChild(box);


            // Event listeners
            box.querySelector('#vip-button').onclick = showVipManagement;
			box.querySelector('#guild-button').onclick = showGuildManagement;
            box.querySelector('#refresh-btn').onclick = fetchPlayers;
            box.querySelector('#hide-btn').onclick = hideMainBox;
box.querySelector('#theme-btn').onclick = switchTheme;
            box.querySelector('#detach-summary-btn').onclick = detachSummary;
            box.querySelector('#send-all-btn').onclick = sendAllTitansToDiscord;
            box.querySelector('#filter-select').onchange = e => {
                currentFilter = e.target.value;
                renderBox(players);
            };
            box.querySelector('#toggle-btn').onclick = () => {
                const isCollapsed = box.getAttribute('data-collapsed') === 'true';
                box.classList.toggle('collapsed', !isCollapsed);
                box.style.height = isCollapsed ? '400px' : 'auto';
                box.style.width = isCollapsed ? '300px' : 'auto';
                box.querySelector('#toggle-btn').textContent = isCollapsed ? '▼' : '▲';
                box.setAttribute('data-collapsed', !isCollapsed);
            };
box.querySelector('#table-body').addEventListener('wheel', (e) => {
    e.preventDefault();
    e.currentTarget.scrollTop += e.deltaY;

});

            makeDraggable(box, '#online-box-header');
            makeResizable(box, 'onlineBoxPosition');
        }

        // Check if summary should be detached
        if (localStorage.getItem('summaryDetached') === 'true' && !isSummaryDetached) {
            detachSummary();
        }

        const tableBody = box.querySelector('#table-body');
        const summary = box.querySelector('#level-summary');
        tableBody.innerHTML = '';

        if (!players || !Array.isArray(players)) {
            const errorContent = '<div class="no-data">❌ Brak danych / błąd API</div>';
            tableBody.innerHTML = errorContent;
            const summaryContent = `<div class="summary-row"><div class="summary-counts">❌ Brak danych</div>
                <div class="last-refresh">${lastRefreshTime ? `🕐 Ostatnie odświeżenie: ${lastRefreshTime.toLocaleTimeString('pl-PL')}` : ''}</div></div>`;
            summary.innerHTML = summaryContent;
            updateSummaryContent(summaryContent);
            return;
        }

        const titanCounts = {}, titanSummary = {}, vipPlayers = getVipPlayers();
        players.forEach(p => {
            const titan = getTitanName(p.l);
            getTitanGroup(titan).forEach(g => titanCounts[g] = (titanCounts[g] || 0) + 1);
            titanSummary[titan] = (titanSummary[titan] || 0) + 1;
        });

players.filter(p => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'selected-guilds') {
        const selectedGuilds = getSelectedGuilds();
        if (selectedGuilds.length === 0) return true;
        const playerGuild = getPlayerGuild(p.n);
        return (playerGuild && selectedGuilds.includes(playerGuild)) || !playerGuild;
    }
    if (currentFilter.startsWith('guild:')) {
        const guildName = currentFilter.replace('guild:', '');
        const playerGuild = getPlayerGuild(p.n);
        return playerGuild === guildName;
    }
    return currentFilter === getTitanName(p.l);
})
.forEach(p => {
    const titan = getTitanName(p.l);
    const count = titanCounts[titan];
    const highlight = count >= 3 && titan !== '-';
    const playerEmoji = getPlayerEmoji(p.n, p.l);
    const titanEmoji = getTitanEmoji(titan);
    const isVip = vipPlayers.includes(p.n);
    const isCreator = getCreatorPlayers().includes(p.n);
    const playerGuild = getPlayerGuild(p.n);
    const selectedGuilds = getSelectedGuilds();

    // Określ typ gracza względem klanów
    let guildClass = '';
    let guildBadge = '';
    let guildStyle = ''; // DODANA LINIA

    if (playerGuild) {
        const guildColor = getGuildColor(playerGuild); // DODANA LINIA
        if (selectedGuilds.length > 0 && selectedGuilds.includes(playerGuild)) {
            guildClass = 'guild-player';
            guildBadge = `<span class="guild-info-badge selected-guild-badge">${playerGuild}</span>`;
            guildStyle = `--guild-color: ${guildColor}; --guild-text-color: ${guildColor};`; // DODANA LINIA
        } else if (selectedGuilds.length > 0) {
            guildClass = 'non-selected-guild-player';
            guildBadge = `<span class="guild-info-badge non-selected-guild-badge">${playerGuild}</span>`;
        } else {
            guildClass = 'guild-player';
            guildBadge = `<span class="guild-info-badge selected-guild-badge">${playerGuild}</span>`;
            guildStyle = `--guild-color: ${guildColor}; --guild-text-color: ${guildColor};`; // DODANA LINIA
        }
    }

const row = document.createElement('div');
const finalClass = isCreator ? 'creator-player' :
                  (isVip ? 'vip-player' : guildClass);

row.className = `player-row ${finalClass}`;

if (playerGuild && !isCreator && !isVip) {
    const guildColor = getGuildColor(playerGuild);
    row.style.setProperty('--guild-color', guildColor);

    // Ustaw tło z przezroczystością
    const rgbColor = hexToRgb(guildColor);
    if (rgbColor) {
        row.style.background = `linear-gradient(135deg, rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.15), rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},0.1))`;
    }

    if (selectedGuilds.length > 0 && selectedGuilds.includes(playerGuild)) {
        row.style.borderLeft = `3px solid ${guildColor}`;
    } else if (selectedGuilds.length === 0) {
        row.style.borderLeft = `3px solid ${guildColor}`;
    }
}

    row.innerHTML = `
        <div class="col-nick">
            ${playerEmoji ? `<span class="player-emoji">${playerEmoji}</span>` : ''}${p.n}${guildBadge}
        </div>
        <div class="col-level ${highlight ? 'titan-highlight' : ''}">${p.l}</div>
        <div class="col-titan ${highlight ? 'titan-highlight' : ''}">
            ${titan}${titanEmoji ? `<span class="titan-emoji">${titanEmoji}</span>` : ''}
        </div>
    `;
    tableBody.appendChild(row);
});

        const summaryCountsHtml = [...new Set(titanList.map(t => t.name))]
            .filter(name => titanSummary[name])
            .map(name => {
                const count = titanSummary[name];
                const emoji = getTitanEmoji(name);
                return `<span class="titan-count ${count >= 3 ? 'highlight' : ''}">${emoji} ${name}: ${count}</span>`;
            });

        if (titanSummary['-']) summaryCountsHtml.push(`<span class="titan-count">❌ -: ${titanSummary['-']}</span>`);

        const summaryContent = `
            <div class="summary-row">
                <div style="font-weight: bold; color: #3282b8;">👥 Gracze online: ${players.length}</div>
                <div class="last-refresh">${lastRefreshTime ? `🕐 Ostatnie odświeżenie: ${lastRefreshTime.toLocaleTimeString('pl-PL')}` : ''}</div>
            </div>
            <div class="summary-row counts-row">
                <div class="summary-counts">${summaryCountsHtml.join('')}</div>
            </div>
        `;

        summary.innerHTML = summaryContent;
        updateSummaryContent(summaryContent)

    addTitanClickListeners(summary); // Dla głównego podsumowania

    updateSummaryContent();
updateFilterOptions();
}

function makeDraggable(el, headerSelector) {
    if (!headerSelector) headerSelector = '#online-box-header';
    let isDragging = false, offsetX = 0, offsetY = 0;
    const header = el.querySelector(headerSelector);
    if (!header) return; // Dodana ochrona

    header.addEventListener('mousedown', e => {
        if (e.button !== 0 || e.target.tagName === 'BUTTON') return;
        isDragging = true;
        offsetX = e.clientX - el.getBoundingClientRect().left;
        offsetY = e.clientY - el.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const x = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - el.offsetWidth);
        const y = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - el.offsetHeight);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.right = "auto";

        const storageKey = el.id === boxId ? 'onlineBoxPosition' : 'summaryBoxPosition';
        localStorage.setItem(storageKey, JSON.stringify({x, y, w: el.offsetWidth, h: el.offsetHeight}));
    });

    document.addEventListener('mouseup', () => isDragging = false);
}

    function makeResizable(el, storageKey = 'onlineBoxPosition') {
        const resizer = el.querySelector('.resizer');
        let isResizing = false, startX, startY, startWidth, startHeight;
        resizer.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = el.offsetWidth;
            startHeight = el.offsetHeight;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', e => {
            if (!isResizing) return;
            const minWidth = el.id === boxId ? 260 : 280;
            const minHeight = el.id === boxId ? 100 : 120;
            const newWidth = Math.max(minWidth, startWidth + e.clientX - startX);
            const newHeight = Math.max(minHeight, startHeight + e.clientY - startY);
            el.style.width = `${newWidth}px`;
            el.style.height = `${newHeight}px`;
        });
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.userSelect = '';
                localStorage.setItem(storageKey, JSON.stringify({
                    x: parseInt(el.style.left), y: parseInt(el.style.top), w: el.offsetWidth, h: el.offsetHeight
                }));
            }
        });
    }
const savedGuilds = localStorage.getItem('playerGuilds');
if (savedGuilds) {
    try {
        const parsed = JSON.parse(savedGuilds);
        Object.assign(playerGuilds, parsed);
        updateObservedGuilds();
        console.log('Załadowano dane klanów:', observedGuilds.length, 'klanów');
    } catch (error) {
        console.error('Błąd ładowania danych klanów:', error);
    }
}
    // Initialize
    fetchPlayers();
    setInterval(fetchPlayers, 60000);
})();
            },
            destroy: function() {
                cleanupAddon('addon1');
            }
        },
        addon2: {
            name: 'Players Online - Alarm',
            enabled: false,
            init: function() {
                console.log('Players Online - Alarm włączony');

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
    DiscordNotification(titanName, players) {
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

            },
            destroy: function() {
                cleanupAddon('addon2');
            }
        },
        addon3: {
            name: 'Titans On Discord',
            enabled: false,
            init: function() {
                console.log('Titans On Discordwłączony');

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
            },
            destroy: function() {
                cleanupAddon('addon3');
            }
        }
    };

const styles = `
        .addon-manager {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        .addon-toggle-btn {
            background: #2f3136;
            border: 1px solid #40444b;
            color: #dcddde;
            padding: 8px 12px;
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
            gap: 6px;
            min-width: 120px;
        }

    .addon-toggle-btn::before {
    content: '';
    width: 16px;
    height: 16px;
    background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/main/images/ikonka.png');
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
            right: 0;
            background: #2f3136;
            border: 1px solid #40444b;
            border-radius: 6px;
            padding: 16px;
            min-width: 280px;
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
    background-image: url('https://raw.githubusercontent.com/krystianasaaa/margonem-addons/main/images/ikonka.png');
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

        .addon-refresh-notice {
            font-size: 10px;
            color: #ed4245;
            margin-top: 2px;
            font-style: italic;
            display: none;
        }

        .addon-refresh-notice.show {
            display: block;
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

    // Add styles to page
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Make element draggable
    function makeDraggable(element, handle) {
        let isDragging = false;
        let hasDragged = false; // Dodana flaga do śledzenia czy faktycznie przeciągnięto
        let startX, startY, initialX, initialY;

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasDragged = false; // Reset flagi

            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            // Change positioning to absolute for dragging
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

            // Jeśli przesunięcie jest większe niż 5px, to uznajemy że użytkownik przeciąga
            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasDragged = true;
                element.classList.add('dragging');
                handle.classList.add('dragging');
            }

            let newX = initialX + deltaX;
            let newY = initialY + deltaY;

            // Keep element within viewport bounds
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

            // Usuwamy klasy dragging dopiero po krótkim opóźnieniu
            setTimeout(() => {
                element.classList.remove('dragging');
                handle.classList.remove('dragging');
                hasDragged = false;
            }, 100);

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            // Save position to localStorage tylko jeśli faktycznie przeciągnięto
            if (hasDragged) {
                const rect = element.getBoundingClientRect();
                const elementId = element.classList.contains('addon-manager') ? 'addon-container' : 'addon-menu';
                localStorage.setItem(`${elementId}-position`, JSON.stringify({
                    x: rect.left,
                    y: rect.top
                }));
            }
        }

        // Zwracamy informację czy element był przeciągany
        return () => hasDragged;
    }

    // Restore element position
    function restorePosition(element, storageKey) {
        const savedPosition = localStorage.getItem(storageKey);
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            element.style.position = 'fixed';
            element.style.left = position.x + 'px';
            element.style.top = position.y + 'px';
            element.style.right = 'auto';
        }
    }

    // Create UI
    function createUI() {
        const container = document.createElement('div');
        container.className = 'addon-manager';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'addon-toggle-btn';
        toggleBtn.textContent = ' Kaczor Manager';

        // Make button draggable and get function to check if was dragged
        const wasDragged = makeDraggable(container, toggleBtn);

        const menu = document.createElement('div');
        menu.className = 'addon-menu';

        const header = document.createElement('div');
        header.className = 'addon-menu-header';
        header.textContent = 'Manager Dodatków';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'addon-close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.remove('active');
        });

        header.appendChild(closeBtn);

        // Make menu draggable
        makeDraggable(menu, header);

        menu.appendChild(header);

        // Create addon items
        Object.keys(addons).forEach(addonKey => {
            const addon = addons[addonKey];
            const item = document.createElement('div');
            item.className = 'addon-item';

            const info = document.createElement('div');
            const name = document.createElement('div');
            name.className = 'addon-name';
            name.textContent = addon.name;

            const status = document.createElement('div');
            status.className = 'addon-status';
            status.textContent = addon.enabled ? 'Włączony' : 'Wyłączony';

            const refreshNotice = document.createElement('div');
            refreshNotice.className = 'addon-refresh-notice';
            refreshNotice.textContent = 'Wymagane odświeżenie gry';

            info.appendChild(name);
            info.appendChild(status);
            info.appendChild(refreshNotice);

            const switchElement = document.createElement('div');
            switchElement.className = `addon-switch ${addon.enabled ? 'active' : ''}`;

            switchElement.addEventListener('click', () => {
                toggleAddon(addonKey, switchElement, status, refreshNotice);
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
        enableAllBtn.addEventListener('click', () => enableAllAddons());

        const disableAllBtn = document.createElement('button');
        disableAllBtn.className = 'control-btn disable-all-btn';
        disableAllBtn.textContent = 'Wyłącz wszystkie';
        disableAllBtn.addEventListener('click', () => disableAllAddons());

        controls.appendChild(enableAllBtn);
        controls.appendChild(disableAllBtn);
        menu.appendChild(controls);

        // Toggle menu visibility - sprawdzamy czy element był przeciągany
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Sprawdzamy czy przycisk był przeciągany
            setTimeout(() => {
                if (!toggleBtn.classList.contains('dragging') && !wasDragged()) {
                    menu.classList.toggle('active');

                    // Restore position when menu is opened
                    if (menu.classList.contains('active')) {
                        restorePosition(menu, 'addon-menu-position');
                    }
                }
            }, 10);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        container.appendChild(toggleBtn);
        container.appendChild(menu);
        document.body.appendChild(container);

        // Restore container position on load
        setTimeout(() => {
            restorePosition(container, 'addon-container-position');
        }, 100);
    }

    // Toggle addon function
    function toggleAddon(addonKey, switchElement, statusElement, refreshNoticeElement) {
        const addon = addons[addonKey];

        if (addon.enabled) {
            try {
                addon.destroy();
                console.log(`Dodatek ${addonKey} wyłączony`);
            } catch (error) {
                console.error(`Błąd podczas wyłączania dodatku ${addonKey}:`, error);
            }
            addon.enabled = false;
            switchElement.classList.remove('active');
            statusElement.textContent = 'Wyłączony';
            refreshNoticeElement.classList.add('show');
        } else {
            try {
                addon.init();
                console.log(`Dodatek ${addonKey} włączony`);
            } catch (error) {
                console.error(`Błąd podczas włączania dodatku ${addonKey}:`, error);
            }
            addon.enabled = true;
            switchElement.classList.add('active');
            statusElement.textContent = 'Włączony';
            refreshNoticeElement.classList.remove('show');
        }

        // Save state to localStorage
        localStorage.setItem(`addon_${addonKey}_enabled`, addon.enabled);
    }

    // Enable all addons
    function enableAllAddons() {
        Object.keys(addons).forEach(addonKey => {
            const addon = addons[addonKey];
            if (!addon.enabled) {
                try {
                    addon.init();
                    console.log(`Dodatek ${addonKey} włączony`);
                } catch (error) {
                    console.error(`Błąd podczas włączania dodatku ${addonKey}:`, error);
                }
                addon.enabled = true;
                localStorage.setItem(`addon_${addonKey}_enabled`, true);
            }
        });
        updateUI();
    }

    // Disable all addons
    function disableAllAddons() {
        Object.keys(addons).forEach(addonKey => {
            const addon = addons[addonKey];
            if (addon.enabled) {
                try {
                    addon.destroy();
                    console.log(`Dodatek ${addonKey} wyłączony`);
                } catch (error) {
                    console.error(`Błąd podczas wyłączania dodatku ${addonKey}:`, error);
                }
                addon.enabled = false;
                localStorage.setItem(`addon_${addonKey}_enabled`, false);
            }
        });
        updateUI();
    }

    // Update UI elements
    function updateUI() {
        const switches = document.querySelectorAll('.addon-switch');
        const statuses = document.querySelectorAll('.addon-status');
        const refreshNotices = document.querySelectorAll('.addon-refresh-notice');

        Object.keys(addons).forEach((addonKey, index) => {
            const addon = addons[addonKey];
            if (switches[index]) {
                switches[index].classList.toggle('active', addon.enabled);
            }
            if (statuses[index]) {
                statuses[index].textContent = addon.enabled ? 'Włączony' : 'Wyłączony';
            }
            if (refreshNotices[index]) {
                refreshNotices[index].classList.toggle('show', !addon.enabled);
            }
        });
    }

    // Load saved states
    function loadSavedStates() {
        Object.keys(addons).forEach(addonKey => {
            const saved = localStorage.getItem(`addon_${addonKey}_enabled`);
            if (saved !== null) {
                addons[addonKey].enabled = saved === 'true';
                if (addons[addonKey].enabled) {
                    try {
                        addons[addonKey].init();
                        console.log(`Dodatek ${addonKey} załadowany z zapisanego stanu`);
                    } catch (error) {
                        console.error(`Błąd podczas ładowania dodatku ${addonKey}:`, error);
                        addons[addonKey].enabled = false;
                        localStorage.setItem(`addon_${addonKey}_enabled`, false);
                    }
                }
            }
        });
    }

    // Initialize when page loads
    function init() {
        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    loadSavedStates();
                    createUI();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                loadSavedStates();
                createUI();
            }, 1000);
        }
    }

    init();
})();
