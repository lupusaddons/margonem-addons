(function () {
    'use strict';

    if (window.mushroomsAbusersRunning) return;
    window.mushroomsAbusersRunning = true;


    const TRACKED_MOBS = [
        'Ogromna płomiennica tląca',
        'Ogromna dzwonkówka tarczowata',
        'Ogromny szpicak ponury',
        'Ogromny bulwiak pospolity',
        'Ogromny mroźlarz'
    ];

    const NPC_IMG_BASE = 'https://micc.garmory-cdn.cloud/obrazki/npc/';
    const WEBHOOK_RE = /^https:\/\/(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/i;
    const DRAG_THRESHOLD = 5;

    const LS = {
        enabled:  'specialMobsEnabled',
        webhook:  'specialMobsWebhook',
        role:     'specialMobsRoleId',
        miniPos:  'mab_mini_pos',
        panelPos: 'mab_panel_pos'
    };

    const config = {
        enabled: localStorage.getItem(LS.enabled) !== 'false',
        webhookUrl: localStorage.getItem(LS.webhook) || '',
        roleId: localStorage.getItem(LS.role) || ''
    };

    function saveConfig() {
        localStorage.setItem(LS.enabled, String(config.enabled));
        localStorage.setItem(LS.webhook, config.webhookUrl);
        localStorage.setItem(LS.role, config.roleId);
    }

    function lsGet(key, fallback) {
        try {
            const v = localStorage.getItem(key);
            return v !== null ? JSON.parse(v) : fallback;
        } catch (e) { return fallback; }
    }
    function lsSet(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    }


    function esc(str) {
        return String(str ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function notify(text) {
        if (typeof message === 'function') message(text);
    }

    function formatTime(seconds) {
        const s = Math.max(0, Math.floor(seconds));
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    }

    function expireClock(seconds) {
        return new Date(Date.now() + seconds * 1000)
            .toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    }

    function timeLeftText(remaining) {
        if (remaining === null) return 'Jeszcze nie otwarty';
        if (remaining <= 0) return 'Wygasł';
        return `${formatTime(remaining)} (zniknie o ${expireClock(remaining)})`;
    }

    function getMapName() {
        try {
            return Engine.map?.d?.name || Engine.map?.name || 'Nieznana mapa';
        } catch (e) { return 'Nieznana mapa'; }
    }

    function getPlayerName() {
        try {
            return Engine.hero?.d?.nick || Engine.hero?.nick || 'Nieznany gracz';
        } catch (e) { return 'Nieznany gracz'; }
    }

    function getNpcImageUrl(icon) {
        if (!icon) return '';
        return /^https?:\/\//i.test(icon) ? icon : NPC_IMG_BASE + icon;
    }

    function buildChatMessage(mob, remaining) {
        const lvl = mob.level ? ` (${mob.level})` : '';
        return `GRZYB! ${mob.name}${lvl} na mapie ${mob.mapName}, Pozostały czas: ${timeLeftText(remaining)}`;
    }

    function sendClanMessage(text) {
        try {
            if (typeof _g !== 'function') return false;
            _g('chat&channel=clan', false, { c: text });
            return true;
        } catch (e) {
            console.error('[Grzyby] Błąd wysyłania na klan:', e);
            return false;
        }
    }

    function buildRolePing() {
        const raw = config.roleId.trim();
        if (!raw) return '';
        if (raw.toLowerCase() === 'everyone') return '@everyone';
        return raw.split(',').map(s => s.trim()).filter(Boolean).map(id => `<@&${id}>`).join(' ');
    }

    function clampPos(x, y, w, h) {
        return {
            x: Math.max(0, Math.min(x, window.innerWidth - w)),
            y: Math.max(0, Math.min(y, window.innerHeight - h))
        };
    }

    function makeDraggable(el, handle, opts = {}) {
        const { threshold = 0, onEnd } = opts;
        let down = false, moved = false, sx = 0, sy = 0, il = 0, it = 0;

        const onDown = e => {
            if (e.button !== 0 || e.target.closest('button, input, textarea')) return;
            e.preventDefault();
            const r = el.getBoundingClientRect();
            el.style.transform = 'none';
            el.style.left = `${r.left}px`;
            el.style.top = `${r.top}px`;
            sx = e.clientX; sy = e.clientY; il = r.left; it = r.top;
            down = true; moved = false;
            el.dataset.dragged = 'false';
        };
        const onMove = e => {
            if (!down) return;
            const dx = e.clientX - sx, dy = e.clientY - sy;
            if (!moved && Math.abs(dx) <= threshold && Math.abs(dy) <= threshold) return;
            moved = true;
            el.dataset.dragged = 'true';
            const { x, y } = clampPos(il + dx, it + dy, el.offsetWidth, el.offsetHeight);
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        };
        const onUp = () => {
            if (!down) return;
            down = false;
            if (moved && onEnd) {
                const r = el.getBoundingClientRect();
                onEnd({ x: r.left, y: r.top });
            }
            setTimeout(() => { el.dataset.dragged = 'false'; }, 50);
        };

        handle.addEventListener('mousedown', onDown);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);

        return () => {
            handle.removeEventListener('mousedown', onDown);
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }


    async function fetchNpcImageFile(icon) {
        const url = getNpcImageUrl(icon);
        if (!url) return null;
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            const blob = await res.blob();
            return new File([blob], 'npc.gif', { type: blob.type || 'image/gif' });
        } catch (e) {
            return null;
        }
    }

    async function postToWebhook(payload, imageFile) {
        let res;
        if (imageFile) {
            const fd = new FormData();
            fd.append('files[0]', imageFile);
            fd.append('payload_json', JSON.stringify(payload));
            res = await fetch(config.webhookUrl, { method: 'POST', body: fd });
        } else {
            res = await fetch(config.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
        if (!res.ok) {
            console.error('[Grzyby] Webhook:', res.status, res.statusText, await res.text().catch(() => ''));
        }
        return res.ok;
    }

    async function sendDiscordNotification(mob, remaining) {
        if (!config.webhookUrl) return false;

        const worldName = location.hostname.split('.')[0] || 'Nieznany';
        const lvl = mob.level ? ` (${mob.level})` : '';
        const imageFile = await fetchNpcImageFile(mob.icon);

        const embed = {
            title: mob.isTest ? 'GRZYB! (TEST)' : 'GRZYB!',
            description:
                `**${mob.name}**${lvl}\n\n` +
                `**Mapa:** ${mob.mapName}\n` +
                `**Znalazł:** ${mob.finderName}\n` +
                `**Świat:** ${worldName}\n` +
                `**Pozostały czas:** ${timeLeftText(remaining)}`,
            color: 0xe67e22,
            footer: { text: 'Kaczor Addons - Mushrooms Abusers' },
            timestamp: new Date().toISOString()
        };
        if (imageFile) embed.thumbnail = { url: 'attachment://npc.gif' };

        try {
            return await postToWebhook({
                content: buildRolePing(),
                embeds: [embed],
                allowed_mentions: { parse: ['roles', 'everyone'] }
            }, imageFile);
        } catch (e) {
            console.error('[Grzyby] Błąd wysyłania powiadomienia:', e);
            return false;
        }
    }

    const CSS = `
.mab-mini { position:fixed; width:40px; height:40px; background:rgba(10,10,10,0.25); backdrop-filter:blur(4px); border:1px solid #e2b70d; border-radius:2.5px; cursor:pointer; z-index:14; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.5); font-size:22px; line-height:1; user-select:none; }
.mab-mini:hover { box-shadow:0 2px 12px rgba(255,204,0,0.5); }
.mab-mini.mab-off { filter:grayscale(1); opacity:0.6; }

.mab-sm { position:fixed; width:380px; background:rgba(10,10,10,0.25); backdrop-filter:blur(4px); border:2px solid #333; border-radius:8px; z-index:14; font-family:Arial,sans-serif; color:#fff; box-shadow:0 4px 20px rgba(0,0,0,0.7); display:none; flex-direction:column; }
.mab-sm.visible { display:flex; }
.mab-sm-header { background:rgba(10,10,10,0.25); backdrop-filter:blur(4px); padding:8px 10px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center; cursor:move; user-select:none; border-radius:6px 6px 0 0; }
.mab-sm-header h3 { margin:0; color:#ffcc00; font-size:13px; font-weight:bold; pointer-events:none; }
.mab-close { width:26px; height:26px; padding:0; display:flex; align-items:center; justify-content:center; background:#830707; color:#fff; border:none; cursor:pointer; border-radius:3px; font-size:13px; line-height:1; box-sizing:border-box; transition:background 0.2s; }
.mab-close:hover { background:#550303; }
.mab-sm-body { padding:14px; background:rgba(10,10,10,0.2); backdrop-filter:blur(8px); border-radius:0 0 6px 6px; }
.mab-section { background:rgba(42,42,42,0.4); border:1px solid #585858; border-radius:4px; padding:12px; margin-bottom:10px; }
.mab-section:last-child { margin-bottom:0; }
.mab-section-title { font-size:11px; color:#aaa; font-weight:bold; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:10px; padding-bottom:6px; border-bottom:1px solid #444; }
.mab-row { display:flex; align-items:center; justify-content:space-between; }
.mab-label { font-size:12px; color:#ccc; flex:1; line-height:1.3; }
.mab-label small { display:block; font-size:10px; color:#666; margin-top:1px; }
.mab-field-label { font-size:11px; color:#aaa; display:block; margin-bottom:4px; }
.mab-hint { font-size:10px; color:#666; margin-top:5px; line-height:1.4; }
.mab-field + .mab-field { margin-top:10px; }

.mab-toggle { position:relative; width:36px; height:20px; flex-shrink:0; }
.mab-toggle input { opacity:0; width:0; height:0; }
.mab-toggle-slider { position:absolute; cursor:pointer; inset:0; background:#3a3a3a; border-radius:20px; transition:.25s; border:1px solid #555; }
.mab-toggle-slider::before { content:''; position:absolute; height:14px; width:14px; left:2px; bottom:2px; background:#888; border-radius:50%; transition:.25s; }
.mab-toggle input:checked + .mab-toggle-slider { background:rgba(76,175,80,0.25); border-color:#4CAF50; }
.mab-toggle input:checked + .mab-toggle-slider::before { transform:translateX(16px); background:#4CAF50; }

.mab-input { width:100%; box-sizing:border-box; background:rgba(42,42,42,0.7); border:1px solid #555; border-radius:4px; color:#fff; padding:5px 8px; font-size:11px; outline:none; font-family:Arial,sans-serif; }
.mab-input:focus { border-color:#ffcc00; }

.mab-btn { padding:7px 12px; border:none; border-radius:4px; cursor:pointer; font-size:12px; font-weight:bold; font-family:Arial,sans-serif; transition:background 0.2s, opacity 0.2s; }
.mab-btn:disabled { opacity:0.5; cursor:default; }
.mab-btn-save { background:#2e7d32; color:#fff; }
.mab-btn-save:hover:not(:disabled) { background:#1b5e20; }
.mab-btn-test { background:rgba(255,204,0,0.15); border:1px solid rgba(255,204,0,0.4); color:#ffcc00; font-size:11px; padding:5px 12px; border-radius:3px; }
.mab-btn-test:hover:not(:disabled) { background:rgba(255,204,0,0.3); }
.mab-btns { display:flex; gap:8px; margin-top:12px; }
.mab-btns .mab-btn { flex:1; }

.mab-status { font-size:11px; font-weight:bold; text-align:center; padding:7px; border-radius:4px; border:1px solid #ffcc00; color:#ffcc00; background:rgba(255,204,0,0.08); }
.mab-status.ok  { border-color:#4CAF50; color:#4CAF50; background:rgba(76,175,80,0.1); }
.mab-status.err { border-color:#dc3545; color:#ff6666; background:rgba(220,53,69,0.1); }
.mab-settings-msg { font-size:11px; min-height:14px; margin-top:8px; color:#ff6666; }
.mab-settings-msg.ok { color:#4CAF50; }

.mab-det { position:fixed; width:230px; background:rgba(10,10,10,0.25); backdrop-filter:blur(4px); border:2px solid #333; border-radius:8px; z-index:15; font-family:Arial,sans-serif; color:#fff; box-shadow:0 4px 20px rgba(0,0,0,0.7); display:flex; flex-direction:column; }
.mab-det-header { background:rgba(10,10,10,0.25); backdrop-filter:blur(4px); padding:8px 10px; border-bottom:1px solid #333; display:flex; justify-content:space-between; align-items:center; cursor:move; user-select:none; border-radius:6px 6px 0 0; }
.mab-det-title { flex:1; text-align:center; color:#ffcc00; font-size:13px; font-weight:bold; pointer-events:none; }
.mab-det-header .mab-close { flex-shrink:0; }
.mab-det-header::before { content:''; width:26px; flex-shrink:0; }
.mab-det-body { padding:12px; background:rgba(10,10,10,0.2); backdrop-filter:blur(8px); display:flex; flex-direction:column; gap:10px; }
.mab-det-name { text-align:center; font-size:14px; font-weight:bold; color:#ffcc00; }
.mab-det-lvl { text-align:center; font-size:11px; color:#aaa; margin-top:3px; font-weight:normal; }
.mab-det-img { text-align:center; }
.mab-det-img img { max-width:64px; max-height:64px; image-rendering:pixelated; }
.mab-det-timer { font-family:'Courier New',monospace; font-size:13px; font-weight:bold; text-align:center; padding:7px; border-radius:4px; border:1px solid #ffc107; color:#ffc107; background:rgba(255,193,7,0.1); line-height:1.4; }
.mab-det-timer.idle { border-color:#17a2b8; color:#17a2b8; background:rgba(23,162,184,0.1); }
.mab-det-timer.expired { border-color:#dc3545; color:#ff6666; background:rgba(220,53,69,0.1); }
.mab-det-actions { display:flex; border-top:1px solid #333; border-radius:0 0 6px 6px; overflow:hidden; background:rgba(10,10,10,0.2); }
.mab-det-actions button { flex:1; padding:9px 6px; border:none; color:#fff; font-size:11px; font-weight:bold; cursor:pointer; transition:background 0.2s; font-family:Arial,sans-serif; }
.mab-det-actions button + button { border-left:1px solid #333; }
.mab-det-actions button:disabled { opacity:0.5; cursor:default; }
.mab-act-discord { background:#2e7d32; } .mab-act-discord:hover:not(:disabled) { background:#1b5e20; }
.mab-act-clan { background:#17a2b8; }    .mab-act-clan:hover:not(:disabled) { background:#138496; }
.mab-act-copy { background:#6c757d; flex:0.5 !important; } .mab-act-copy:hover:not(:disabled) { background:#5a6268; }
`;


    const openWindows = new Map();
    let windowCounter = 0;

    function showDetectionWindow(mob) {
        const hasTimer = typeof mob.killSeconds === 'number' && mob.killSeconds > 0;
        const expireAt = hasTimer ? Date.now() + mob.killSeconds * 1000 : null;
        const getRemaining = () => expireAt === null ? null : Math.max(0, Math.ceil((expireAt - Date.now()) / 1000));

        const win = document.createElement('div');
        win.className = 'mab-det';
        const offset = (windowCounter++ % 8) * 24;
        win.style.left = `${240 + offset}px`;
        win.style.top = `${200 + offset}px`;

        const imgUrl = getNpcImageUrl(mob.icon);
        win.innerHTML = `
            <div class="mab-det-header">
                <span class="mab-det-title">GRZYB!${mob.isTest ? ' (TEST)' : ''}</span>
                <button class="mab-close" data-act="close">&#x2715;</button>
            </div>
            <div class="mab-det-body">
                <div class="mab-det-name">${esc(mob.name)}${mob.level ? `<div class="mab-det-lvl">(${esc(mob.level)} lvl)</div>` : ''}</div>
                ${imgUrl ? `<div class="mab-det-img"><img src="${esc(imgUrl)}" alt=""></div>` : ''}
                <div class="mab-det-timer${hasTimer ? '' : ' idle'}" data-el="timer"></div>
                <div class="mab-status" data-el="status">Wyślij powiadomienie!</div>
            </div>
            <div class="mab-det-actions">
                <button class="mab-act-discord" data-act="discord">Discord</button>
                <button class="mab-act-clan" data-act="clan">Klan</button>
                <button class="mab-act-copy" data-act="copy" title="Kopiuj wiadomość">📋</button>
            </div>`;
        document.body.appendChild(win);

        const timerEl = win.querySelector('[data-el="timer"]');
        const statusEl = win.querySelector('[data-el="status"]');
        const img = win.querySelector('.mab-det-img img');
        if (img) img.onerror = () => { img.parentElement.style.display = 'none'; };

        function renderTimer() {
            const rem = getRemaining();
            if (rem === null) {
                timerEl.textContent = 'Jeszcze nie otwarty!';
            } else if (rem <= 0) {
                timerEl.textContent = 'Wygasł!';
                timerEl.className = 'mab-det-timer expired';
            } else {
                timerEl.textContent = `${formatTime(rem)} (do ${expireClock(rem)})`;
            }
            return rem;
        }
        renderTimer();

        let interval = null;
        if (hasTimer) {
            interval = setInterval(() => {
                if (renderTimer() <= 0) { clearInterval(interval); interval = null; }
            }, 1000);
        }

        function setStatus(type, text) {
            statusEl.className = 'mab-status' + (type ? ' ' + type : '');
            statusEl.textContent = text;
        }

        const destroyDrag = makeDraggable(win, win.querySelector('.mab-det-header'));

        function closeWindow() {
            if (interval) clearInterval(interval);
            destroyDrag();
            win.remove();
            if (mob.npcId !== undefined) openWindows.delete(mob.npcId);
        }

        win.querySelector('[data-act="close"]').addEventListener('click', closeWindow);

        const discordBtn = win.querySelector('[data-act="discord"]');
        discordBtn.addEventListener('click', async () => {
            if (!config.webhookUrl) {
                setStatus('err', 'Ustaw webhook w ustawieniach');
                return;
            }
            discordBtn.disabled = true;
            discordBtn.textContent = 'Wysyłanie...';
            const ok = await sendDiscordNotification(mob, getRemaining());
            if (ok) {
                setStatus('ok', 'Powiadomienie wysłane!');
                discordBtn.textContent = 'Wysłano';
            } else {
                setStatus('err', 'Błąd wysyłania');
                discordBtn.disabled = false;
                discordBtn.textContent = 'Spróbuj ponownie';
            }
        });

        const clanBtn = win.querySelector('[data-act="clan"]');
        clanBtn.addEventListener('click', () => {
            if (sendClanMessage(buildChatMessage(mob, getRemaining()))) {
                setStatus('ok', 'Wiadomość wysłana na klan!');
                clanBtn.disabled = true;
                clanBtn.textContent = 'Wysłano';
            } else {
                setStatus('err', 'Nie można wysłać na klan');
            }
        });

        const copyBtn = win.querySelector('[data-act="copy"]');
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(buildChatMessage(mob, getRemaining()));
                setStatus('ok', 'Skopiowano do schowka!');
                copyBtn.textContent = '✓';
                setTimeout(() => { copyBtn.textContent = '📋'; }, 2000);
            } catch (e) {
                setStatus('err', 'Błąd kopiowania');
            }
        });

        if (mob.npcId !== undefined) openWindows.set(mob.npcId, closeWindow);
    }


    function createUI() {
        const style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        document.body.insertAdjacentHTML('beforeend', `
            <div class="mab-mini" id="mab-mini" title="Mushrooms Abusers - ustawienia">🍄</div>
            <div class="mab-sm" id="mab-sm">
                <div class="mab-sm-header" id="mab-sm-header">
                    <h3>🍄 Mushrooms Abusers</h3>
                    <button class="mab-close" id="mab-sm-close">&#x2715;</button>
                </div>
                <div class="mab-sm-body">
                    <div class="mab-section">
                        <div class="mab-section-title">Ogólne</div>
                        <div class="mab-row">
                            <div class="mab-label">Wykrywanie grzybów<small>okno z powiadomieniem po zobaczeniu grzyba</small></div>
                            <label class="mab-toggle"><input type="checkbox" id="mab-enabled"><span class="mab-toggle-slider"></span></label>
                        </div>
                    </div>
                    <div class="mab-section">
                        <div class="mab-section-title">Discord</div>
                        <div class="mab-field">
                            <span class="mab-field-label">Webhook URL:</span>
                            <input type="text" class="mab-input" id="mab-webhook" placeholder="https://discord.com/api/webhooks/..." autocomplete="off">
                        </div>
                        <div class="mab-field">
                            <span class="mab-field-label">ID roli (lub 'everyone'):</span>
                            <input type="text" class="mab-input" id="mab-role" placeholder="123456789012345678 lub everyone" autocomplete="off">
                            <div class="mab-hint">Kilka ról rozdziel przecinkami. Zostaw puste, aby nikogo nie pingować.</div>
                        </div>
                        <div style="margin-top:10px;"><button class="mab-btn mab-btn-test" id="mab-test">Testowy grzyb</button></div>
                    </div>
                    <div class="mab-settings-msg" id="mab-msg"></div>
                    <div class="mab-btns">
                        <button class="mab-btn mab-btn-save" id="mab-save">Zapisz</button>
                    </div>
                </div>
            </div>
        `);

        const mini = document.getElementById('mab-mini');
        const panel = document.getElementById('mab-sm');
        const header = document.getElementById('mab-sm-header');
        const enabledEl = document.getElementById('mab-enabled');
        const webhookEl = document.getElementById('mab-webhook');
        const roleEl = document.getElementById('mab-role');
        const msgEl = document.getElementById('mab-msg');
        const testBtn = document.getElementById('mab-test');

        const mp = lsGet(LS.miniPos, { x: 20, y: 70 });
        const miniPos = clampPos(mp.x, mp.y, 40, 40);
        mini.style.left = `${miniPos.x}px`;
        mini.style.top = `${miniPos.y}px`;

        function updateMiniState() {
            mini.classList.toggle('mab-off', !config.enabled);
        }
        updateMiniState();

        function setMsg(text, ok) {
            msgEl.textContent = text;
            msgEl.className = 'mab-settings-msg' + (ok ? ' ok' : '');
        }

        function fillForm() {
            enabledEl.checked = config.enabled;
            webhookEl.value = config.webhookUrl;
            roleEl.value = config.roleId;
            setMsg('', false);
        }

        function positionPanel() {
            const saved = lsGet(LS.panelPos, null);
            if (saved) {
                const p = clampPos(saved.x, saved.y, 380, panel.offsetHeight || 300);
                panel.style.left = `${p.x}px`;
                panel.style.top = `${p.y}px`;
                return;
            }
            const r = mini.getBoundingClientRect();
            let x = r.right + 10;
            if (x + 380 > window.innerWidth) x = r.left - 390;
            const p = clampPos(x, r.top, 380, panel.offsetHeight || 300);
            panel.style.left = `${p.x}px`;
            panel.style.top = `${p.y}px`;
        }

        function openPanel() {
            fillForm();
            panel.classList.add('visible');
            positionPanel();
        }
        function closePanel() { panel.classList.remove('visible'); }

        makeDraggable(mini, mini, {
            threshold: DRAG_THRESHOLD,
            onEnd: pos => lsSet(LS.miniPos, pos)
        });
        mini.addEventListener('click', () => {
            if (mini.dataset.dragged === 'true') return;
            if (panel.classList.contains('visible')) closePanel(); else openPanel();
        });

        makeDraggable(panel, header, { onEnd: pos => lsSet(LS.panelPos, pos) });
        panel.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
        document.getElementById('mab-sm-close').addEventListener('click', closePanel);

        function readAndValidate() {
            const webhook = webhookEl.value.trim();
            if (webhook && !WEBHOOK_RE.test(webhook)) {
                setMsg('Nieprawidłowy URL webhooka Discorda.', false);
                return null;
            }
            return { webhook, role: roleEl.value.trim() };
        }

        document.getElementById('mab-save').addEventListener('click', () => {
            const v = readAndValidate();
            if (!v) return;
            config.enabled = enabledEl.checked;
            config.webhookUrl = v.webhook;
            config.roleId = v.role;
            saveConfig();
            updateMiniState();
            notify('Zapisano ustawienia Mushrooms Abusers');
            closePanel();
        });

        enabledEl.addEventListener('change', () => {
            config.enabled = enabledEl.checked;
            localStorage.setItem(LS.enabled, String(config.enabled));
            updateMiniState();
        });

        testBtn.addEventListener('click', () => {
            const v = readAndValidate();
            if (!v) return;
            config.webhookUrl = v.webhook;
            config.roleId = v.role;
            saveConfig();
            showDetectionWindow({
                name: TRACKED_MOBS[0],
                level: 100,
                icon: '',
                killSeconds: 300,
                mapName: getMapName(),
                finderName: getPlayerName(),
                isTest: true
            });
            setMsg('Otwarto testowe okno - kliknij Discord, aby sprawdzić webhook.', true);
        });
    }


    function onNewNpc(npc) {
        if (!config.enabled || !npc || !npc.d) return;

        const name = npc.d.nick || npc.d.name;
        if (!TRACKED_MOBS.includes(name)) return;

        const npcId = npc.d.id;
        if (npcId !== undefined && openWindows.has(npcId)) return;

        showDetectionWindow({
            npcId,
            name,
            level: npc.d.lvl || npc.d.elasticLevel || null,
            icon: npc.d.icon || '',
            killSeconds: npc.d.killSeconds,
            mapName: getMapName(),
            finderName: getPlayerName()
        });
    }

    function startMobDetection() {
        if (!window.API?.addCallbackToEvent || !window.Engine?.npcs) {
            setTimeout(startMobDetection, 100);
            return;
        }
        window.API.addCallbackToEvent('newNpc', onNewNpc);
    }


    function init() {
        createUI();
        startMobDetection();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
