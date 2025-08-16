(function() {
    'use strict';
    const worldName = "lupus", boxId = 'online-box', summaryBoxId = 'summary-box';
    let currentFilter = "all", lastRefreshTime = null;
    let isMainBoxHidden = false, isSummaryDetached = false;
    let currentPlayersData = null;
    let showOnlySelectedGuilds = localStorage.getItem('showOnlySelectedGuilds') === 'true';
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
.last-refresh{color:#a8dadc;font-size:9px;font-style:italic}.collapsed #online-content,.collapsed #online-box-controls{display:none}.collapsed #online-box{height:auto!important;width:auto!important;min-width:250px}#table-body::-webkit-scrollbar{width:8px}#table-body::-webkit-scrollbar-track{background:rgba(0,0,0,0.3);border-radius:4px}#table-body::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#0f4c75,#3282b8);border-radius:4px}#table-body::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#3282b8,#0f4c75)}.resizer{width:14px;height:14px;position:absolute;right:2px;bottom:2px;cursor:se-resize;background:linear-gradient(135deg,#0f4c75,#3282b8);border-radius:3px;z-index:10;opacity:0.7;transition:opacity 0.2s}.resizer:hover{opacity:1}@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}#online-box{animation:fadeIn 0.3s ease-out}.vip-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;justify-content:center;align-items:center}.vip-dialog{background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #0f4c75;border-radius:12px;padding:20px;width:400px;max-height:500px;color:#e8f4fd;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.vip-modal h3{margin-top:0;color:#3282b8}.vip-input-row{margin-bottom:15px}.vip-input-row input{width:70%;padding:8px;background:rgba(50,130,184,0.2);border:1px solid #0f4c75;border-radius:4px;color:#e8f4fd;margin-right:10px}.vip-input-row button{padding:8px 12px;background:#3282b8;border:none;border-radius:4px;color:white;cursor:pointer}.vip-list-container{max-height:300px;overflow-y:auto;margin-bottom:15px;border:1px solid #0f4c75;border-radius:4px;padding:10px;background:rgba(0,0,0,0.3)}.vip-item{display:flex;justify-content:space-between;align-items:center;padding:5px;margin:2px 0;background:rgba(50,130,184,0.1);border-radius:4px}.vip-remove-btn{background:#ff4444;border:none;border-radius:3px;color:white;padding:2px 6px;cursor:pointer;font-size:12px}.vip-close-btn{background:#666;border:none;border-radius:4px;color:white;cursor:pointer;padding:8px 16px}#summary-box{position:fixed;background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #0f4c75;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:9998;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;backdrop-filter:blur(10px);min-width:280px;min-height:120px}#summary-box-header{background:linear-gradient(135deg,#0f4c75,#3282b8);color:white;padding:8px 12px;font-weight:bold;font-size:12px;cursor:move;user-select:none;display:flex;justify-content:space-between;align-items:center}#summary-box-title{color:white;font-weight:bold;display:flex;align-items:center;gap:6px}#summary-box-buttons{display:flex;gap:4px}#summary-box-buttons button{background:rgba(255,255,255,0.2);border:none;color:white;font-size:12px;cursor:pointer;padding:3px 6px;border-radius:3px;transition:all 0.2s;font-weight:bold}#summary-box-buttons button:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}#summary-content{padding:8px;color:#e8f4fd;font-size:10px;line-height:1.4}.show-main-btn{position:fixed;top:10px;right:10px;z-index:10001;background:linear-gradient(135deg,#0f4c75,#3282b8);border:2px solid #0f4c75;color:white;padding:8px;border-radius:50%;cursor:move;font-size:12px;box-shadow:0 4px 16px rgba(0,0,0,0.3);transition:all 0.2s;opacity:0.8;user-select:none;width:55px;height:55px;display:flex;align-items:center;justify-content:center}.show-main-btn:hover{transform:scale(1.05) rotate(15deg);box-shadow:0 6px 20px rgba(0,0,0,0.4);opacity:1}#level-summary.detached{display:none}#send-all-btn{position:relative}#send-all-btn:hover::after{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:4px 8px;border-radius:4px;font-size:10px;white-space:nowrap;z-index:1000}#summary-box .detached-controls{padding:8px;text-align:center;border-top:1px solid rgba(15,76,117,0.5);background:rgba(0,0,0,0.2)}#summary-box .detached-controls button{background:#3282b8;border:none;color:white;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;margin:0 2px}#summary-box .detached-controls button:hover{background:#4a9fd1}#guild-toggle-detached-btn.selected-guilds-mode {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52) !important;
    border: 1px solid #ff4444 !important;
}

#guild-toggle-detached-btn.all-guilds-mode {
    background: linear-gradient(135deg, #28a745, #20c997) !important;
    border: 1px solid #17a2b8 !important;
}
.guild-select{background:linear-gradient(135deg,rgba(15,76,117,0.3),rgba(50,130,184,0.2));color:#e8f4fd;border:1px solid rgba(15,76,117,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}.guild-select:focus{border-color:#3282b8;box-shadow:0 0 10px rgba(50,130,184,0.3)}.guild-select option{background:#16213e;color:#e8f4fd}.guild-management-dialog .vip-input-row select{width:100%;background:linear-gradient(135deg,rgba(15,76,117,0.3),rgba(50,130,184,0.2));color:#e8f4fd;border:1px solid rgba(15,76,117,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}.guild-management-dialog .vip-input-row select:focus{border-color:#3282b8;box-shadow:0 0 10px rgba(50,130,184,0.3)}.guild-management-dialog .vip-input-row select option{background:#16213e;color:#e8f4fd}
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
.last-refresh{color:#a8dadc;font-size:9px;font-style:italic}.collapsed #online-content,.collapsed #online-box-controls{display:none}.collapsed #online-box{height:auto!important;width:auto!important;min-width:250px}#table-body::-webkit-scrollbar{width:8px}#table-body::-webkit-scrollbar-track{background:rgba(0,0,0,0.3);border-radius:4px}#table-body::-webkit-scrollbar-thumb{background:linear-gradient(135deg,#000000,#333333);border-radius:4px}#table-body::-webkit-scrollbar-thumb:hover{background:linear-gradient(135deg,#333333,#555555)}.resizer{width:14px;height:14px;position:absolute;right:2px;bottom:2px;cursor:se-resize;background:linear-gradient(135deg,#000000,#333333);border-radius:3px;z-index:10;opacity:0.7;transition:opacity 0.2s}.resizer:hover{opacity:1}@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}#online-box{animation:fadeIn 0.3s ease-out}.vip-modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;justify-content:center;align-items:center}.vip-dialog{background:linear-gradient(135deg,#000000,#1a1a1a);border:2px solid #333333;border-radius:12px;padding:20px;width:400px;max-height:500px;color:#e8f4fd;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.vip-modal h3{margin-top:0;color:#cccccc}.vip-input-row{margin-bottom:15px}.vip-input-row input{width:70%;padding:8px;background:rgba(51,51,51,0.2);border:1px solid #333333;border-radius:4px;color:#e8f4fd;margin-right:10px}.vip-input-row button{padding:8px 12px;background:#333333;border:none;border-radius:4px;color:white;cursor:pointer}.vip-list-container{max-height:300px;overflow-y:auto;margin-bottom:15px;border:1px solid #333333;border-radius:4px;padding:10px;background:rgba(0,0,0,0.3)}.vip-item{display:flex;justify-content:space-between;align-items:center;padding:5px;margin:2px 0;background:rgba(51,51,51,0.1);border-radius:4px}.vip-remove-btn{background:#ff4444;border:none;border-radius:3px;color:white;padding:2px 6px;cursor:pointer;font-size:12px}.vip-close-btn{background:#666;border:none;border-radius:4px;color:white;cursor:pointer;padding:8px 16px}#summary-box{position:fixed;background:linear-gradient(135deg,#000000,#1a1a1a);border:2px solid #333333;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:9998;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;backdrop-filter:blur(10px);min-width:280px;min-height:120px}#summary-box-header{background:linear-gradient(135deg,#000000,#333333);color:white;padding:8px 12px;font-weight:bold;font-size:12px;cursor:move;user-select:none;display:flex;justify-content:space-between;align-items:center}#summary-box-title{color:white;font-weight:bold;display:flex;align-items:center;gap:6px}#summary-box-buttons{display:flex;gap:4px}#summary-box-buttons button{background:rgba(255,255,255,0.2);border:none;color:white;font-size:12px;cursor:pointer;padding:3px 6px;border-radius:3px;transition:all 0.2s;font-weight:bold}#summary-box-buttons button:hover{background:rgba(255,255,255,0.3);transform:translateY(-1px)}#summary-content{padding:8px;color:#e8f4fd;font-size:10px;line-height:1.4}.show-main-btn{position:fixed;top:10px;right:10px;z-index:10001;background:linear-gradient(135deg,#000000,#333333);border:2px solid #333333;color:white;padding:8px;border-radius:50%;cursor:move;font-size:12px;box-shadow:0 4px 16px rgba(0,0,0,0.3);transition:all 0.2s;opacity:0.8;user-select:none;width:55px;height:55px;display:flex;align-items:center;justify-content:center}.show-main-btn:hover{transform:scale(1.05) rotate(15deg);box-shadow:0 6px 20px rgba(0,0,0,0.4);opacity:1}#level-summary.detached{display:none}#send-all-btn{position:relative}#send-all-btn:hover::after{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:4px 8px;border-radius:4px;font-size:10px;white-space:nowrap;z-index:1000}#summary-box .detached-controls{padding:8px;text-align:center;border-top:1px solid rgba(51,51,51,0.5);background:rgba(0,0,0,0.2)}#summary-box .detached-controls button{background:#333333;border:none;color:white;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;margin:0 2px}#summary-box .detached-controls button:hover{background:#555555}#guild-toggle-detached-btn.selected-guilds-mode {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52) !important;
    border: 1px solid #ff4444 !important;
}

#guild-toggle-detached-btn.all-guilds-mode {
    background: linear-gradient(135deg, #28a745, #20c997) !important;
    border: 1px solid #17a2b8 !important;
}.guild-select{background:linear-gradient(135deg,rgba(0,0,0,0.3),rgba(51,51,51,0.2));color:#e8f4fd;border:1px solid rgba(51,51,51,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}.guild-select:focus{border-color:#666666;box-shadow:0 0 10px rgba(102,102,102,0.3)}.guild-select option{background:#1a1a1a;color:#e8f4fd}.guild-management-dialog .vip-input-row select{width:100%;background:linear-gradient(135deg,rgba(0,0,0,0.3),rgba(51,51,51,0.2));color:#e8f4fd;border:1px solid rgba(51,51,51,0.5);border-radius:6px;padding:8px;font-size:12px;outline:none;transition:all 0.2s}.guild-management-dialog .vip-input-row select:focus{border-color:#666666;box-shadow:0 0 10px rgba(102,102,102,0.3)}.guild-management-dialog .vip-input-row select option{background:#1a1a1a;color:#e8f4fd}#guild-button{
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
    // Funkcja do pobierania danych klanów z GitHub
async function loadGuildsFromGitHub(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Wyczyść stare dane
        Object.keys(playerGuilds).forEach(key => delete playerGuilds[key]);
        
        // Załaduj nowe dane
        Object.assign(playerGuilds, data);
        
        updateObservedGuilds();
        localStorage.setItem('playerGuilds', JSON.stringify(playerGuilds));
        
        return {
            success: true,
            guildsCount: observedGuilds.length,
            playersCount: Object.keys(playerGuilds).length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
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
function updateGuildToggleButton(button) {
    if (!button) return;

    if (showOnlySelectedGuilds) {
        button.className = 'selected-guilds-mode';
        button.innerHTML = '🎯 Wybrane klany';
        button.title = 'Tryb: Tylko wybrane klany - Kliknij aby przełączyć';
    } else {
        button.className = 'all-guilds-mode';
        button.innerHTML = '🏰 Wszystkie klany';
        button.title = 'Tryb: Wszystkie klany - Kliknij aby przełączyć';
    }
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
        <button id="guild-toggle-detached-btn">🏰 Wszystkie klany</button>
        <button id="send-all-detached-btn">📤 Wyślij wszystkie</button>
    </div>
    <div class="resizer"></div>
`;


            document.body.appendChild(summaryBox);

            summaryBox.querySelector('#attach-summary-btn').onclick = () => {
                attachSummary();
            };
summaryBox.querySelector('#guild-toggle-detached-btn').onclick = () => {
    toggleGuildFilterMode();
    updateGuildToggleButton(summaryBox.querySelector('#guild-toggle-detached-btn'));
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
            <h4 style="color: #3282b8; margin: 0 0 10px 0;">🔗 Załaduj z GitHub:</h4>
            <input type="text" id="github-url-input" 
                placeholder="https://raw.githubusercontent.com/.../guilds.json"
                value="https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/guilds/guilds.json"
                style="width: 80%; background: rgba(50,130,184,0.2); border: 1px solid #0f4c75;
                border-radius: 4px; color: #e8f4fd; padding: 8px; margin-right: 5px;">
            <button id="load-github-btn" style="background: #28a745; border: none; color: white; padding: 8px 16px;
                border-radius: 4px; cursor: pointer; font-weight: bold;">
                🔗 Załaduj z GitHub
            </button>
        </div>

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
dialog.querySelector('#load-github-btn').onclick = async () => {
        const url = dialog.querySelector('#github-url-input').value.trim();
        if (!url) {
            alert('❌ Podaj URL do pliku JSON z GitHub!');
            return;
        }

        const loadBtn = dialog.querySelector('#load-github-btn');
        loadBtn.disabled = true;
        loadBtn.innerHTML = '⏳ Ładowanie...';

        const result = await loadGuildsFromGitHub(url);

        loadBtn.disabled = false;
        loadBtn.innerHTML = '🔗 Załaduj z GitHub';

        if (result.success) {
            updateGuildCheckboxes();
            updateGuildStats();
            updateFilterOptions();
            
            alert(`✅ Załadowano dane z GitHub!\nKlanów: ${result.guildsCount}\nGraczy: ${result.playersCount}`);
            
            if (typeof fetchPlayers === 'function') {
                fetchPlayers();
            }
        } else {
            alert(`❌ Błąd ładowania z GitHub:\n${result.error}`);
        }
    };
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
            url: "https://cdn.discordapp.com/emojis/123456789.png"
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
async function sendAllTitansToDiscord() {
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
function toggleGuildFilterMode() {
    showOnlySelectedGuilds = !showOnlySelectedGuilds;
    localStorage.setItem('showOnlySelectedGuilds', showOnlySelectedGuilds.toString());

    const guildButton = document.querySelector('#guild-button');
    if (guildButton) {
        // Zmień wygląd przycisku w zależności od trybu
        if (showOnlySelectedGuilds) {
            guildButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
            guildButton.innerHTML = '🎯';
            guildButton.title = 'Tryb: Tylko wybrane klany - Kliknij aby przełączyć';
        } else {
            guildButton.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            guildButton.innerHTML = '🏰';
            guildButton.title = 'Tryb: Wszystkie klany - Kliknij aby przełączyć';
        }
    }

    // Natychmiast odśwież widok
    if (typeof fetchPlayers === 'function') {
        fetchPlayers();
    }

    // Pokaż komunikat o zmianie trybu
    const modeMsg = document.createElement('div');
    modeMsg.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 10002;
        background: linear-gradient(135deg, ${showOnlySelectedGuilds ? '#ff6b6b, #ee5a52' : '#28a745, #20c997'});
        color: white; padding: 8px 16px; border-radius: 6px;
        font-weight: bold; font-size: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        animation: fadeIn 0.3s ease-out;
    `;
    modeMsg.innerHTML = showOnlySelectedGuilds ?
        '🎯 Tryb: Tylko wybrane klany' :
        '🏰 Tryb: Wszystkie klany';
    document.body.appendChild(modeMsg);

    setTimeout(() => {
        if (modeMsg.parentNode) {
            modeMsg.remove();
        }
    }, 2000);
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

    // NOWY KOD - FILTRUJ GRACZY WEDŁUG TRYBU KLANÓW
    let filteredPlayers = players;
    const selectedGuilds = getSelectedGuilds();

    if (showOnlySelectedGuilds && selectedGuilds.length > 0) {
        filteredPlayers = players.filter(p => {
            const playerGuild = getPlayerGuild(p.n);
            return playerGuild && selectedGuilds.includes(playerGuild);
        });
    }
    // KONIEC NOWEGO KODU

    // Użyj przefiltrowanych graczy do liczenia
    const titanCounts = {}, titanSummary = {};
    filteredPlayers.forEach(p => {
        const titan = getTitanName(p.l);
        getTitanGroup(titan).forEach(g => titanCounts[g] = (titanCounts[g] || 0) + 1);
        titanSummary[titan] = (titanSummary[titan] || 0) + 1;
    });

    const summaryCountsHtml = [...new Set(titanList.map(t => t.name))]
        .filter(name => titanSummary[name])
        .map(name => {
            const count = titanSummary[name];
            const emoji = getTitanEmoji(name);

            // ZAWSZE pokaż licznik wybranych klanów jeśli są wybrane klany
            let selectedGuildCount = 0;
            if (selectedGuilds.length > 0) {
                selectedGuildCount = players.filter(p => {
                    const playerGuild = getPlayerGuild(p.n);
                    return getTitanName(p.l) === name && playerGuild && selectedGuilds.includes(playerGuild);
                }).length;
            }

            // Pokaż informację o wybranych klanach TYLKO w trybie "Wszystkie klany"
            const guildInfo = (!showOnlySelectedGuilds && selectedGuilds.length > 0 && selectedGuildCount > 0) ?
                ` (🎯${selectedGuildCount})` : '';

            return `<span class="titan-count ${count >= 3 ? 'highlight' : ''}">${emoji} ${name}: ${count}${guildInfo}</span>`;
        });

    if (titanSummary['-']) {
        // Także dla "-" pokaż licznik wybranych klanów
        let selectedGuildCount = 0;
        if (selectedGuilds.length > 0) {
            selectedGuildCount = players.filter(p => {
                const playerGuild = getPlayerGuild(p.n);
                return getTitanName(p.l) === '-' && playerGuild && selectedGuilds.includes(playerGuild);
            }).length;
        }

        const guildInfo = (!showOnlySelectedGuilds && selectedGuilds.length > 0 && selectedGuildCount > 0) ?
            ` (🎯${selectedGuildCount})` : '';

        summaryCountsHtml.push(`<span class="titan-count">❌ -: ${titanSummary['-']}${guildInfo}</span>`);
    }

    // Pokaż informację o filtrach klanów - ZMODYFIKOWANE
    const guildFilterInfo = showOnlySelectedGuilds && selectedGuilds.length > 0 ?
        `<div style="font-size: 9px; color: #FFA500; margin-top: 2px;">🎯 Tryb: Tylko wybrane klany (${selectedGuilds.length})</div>` : '';

    // ZMODYFIKOWANA LINIA - pokaż liczbę przefiltrowanych graczy
    const playerCountText = showOnlySelectedGuilds && selectedGuilds.length > 0 ?
        `👥 Gracze z wybranych klanów: ${filteredPlayers.length}/${players.length}` :
        `👥 Gracze online: ${players.length}`;

    return `
        <div class="summary-row">
            <div style="font-weight: bold; color: #3282b8;">${playerCountText}</div>
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
const guildToggleBtn = summaryBox.querySelector('#guild-toggle-detached-btn');
if (guildToggleBtn) {
    updateGuildToggleButton(guildToggleBtn);
}
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
			box.querySelector('#guild-button').onclick = (e) => {
    if (e.shiftKey || e.ctrlKey) {
        // Shift+klik lub Ctrl+klik otwiera zarządzanie klanami
        showGuildManagement();
    } else {
        // Zwykły klik przełącza tryb filtrowania
        toggleGuildFilterMode();
    }
};
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
    // Najpierw sprawdź tryb filtrowania klanów
    if (showOnlySelectedGuilds) {
        const selectedGuilds = getSelectedGuilds();
        if (selectedGuilds.length > 0) {
            const playerGuild = getPlayerGuild(p.n);
            const isInSelectedGuild = playerGuild && selectedGuilds.includes(playerGuild);

            // Jeśli gracz nie jest w wybranym klanie, odfiltruj go
            if (!isInSelectedGuild) {
                return false;
            }
        }
    }

    // Następnie zastosuj standardowe filtry
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
const guildButton = box.querySelector('#guild-button');
if (guildButton) {
    if (showOnlySelectedGuilds) {
        guildButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
        guildButton.innerHTML = '🎯';
        guildButton.title = 'Tryb: Tylko wybrane klany - Kliknij aby przełączyć, Shift+klik aby zarządzać';
    } else {
        guildButton.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        guildButton.innerHTML = '🏰';
        guildButton.title = 'Tryb: Wszystkie klany - Kliknij aby przełączyć, Shift+klik aby zarządzać';
    }
}
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
