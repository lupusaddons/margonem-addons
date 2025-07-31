// ==UserScript==
// @name         Kaczor Addons Manager - Lupus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  loader
// @author       kaczka
// @match        https://lupus.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @updateURL    https://lupusaddons.github.io/margonem-addons/loader.user.js
// @downloadURL  https://lupusaddons.github.io/margonem-addons/loader.user.js
// ==/UserScript==
(function() {
    'use strict';
    
    const CONFIG = {
        SERVER_URL: 'https://lupusaddons.github.io/margonem-addons',
        CHECK_INTERVAL: 30000,
        VERSION_KEY: 'margonem_addons_version'
    };
    
    let addonsLoaded = false;
    let currentVersion = GM_getValue(CONFIG.VERSION_KEY, '0');
    
    
    if (!window.location.href.includes('lupus.margonem')) {
        return;
    }
    
    console.log('🐺 Lupus Addons Manager - załadowane');
    
    
    function fetchFromServer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 5000,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Timeout'))
            });
        });
    }
    
    
    function loadAddonsNow() {
        console.log('⚡ Ładuję dodatki NATYCHMIAST...');
        
        fetchFromServer(`${CONFIG.SERVER_URL}/addons.js?t=${Date.now()}`)
            .then(addonsCode => {
                console.log('✅ Kod dodatków pobrany!');
                
                
                const oldScript = document.getElementById('margonem-addons');
                if (oldScript) oldScript.remove();
                
                
                const script = document.createElement('script');
                script.id = 'margonem-addons';
                script.textContent = addonsCode;
                (document.head || document.documentElement).appendChild(script);
                
                addonsLoaded = true;
                console.log('🐺 załadowane!');
                
                
                checkVersionInBackground();
            })
            .catch(error => {
                console.error('❌ Błąd ładowania:', error);
                
                setTimeout(loadAddonsNow, 2000);
            });
    }
    
    
    function checkVersionInBackground() {
        fetchFromServer(`${CONFIG.SERVER_URL}/version.json?t=${Date.now()}`)
            .then(versionData => {
                const serverVersion = JSON.parse(versionData);
                
                if (serverVersion.version !== currentVersion) {
                    console.log('🔄 Nowa wersja dostępna:', serverVersion.version);
                    GM_setValue(CONFIG.VERSION_KEY, serverVersion.version);
                    currentVersion = serverVersion.version;
                    
                    
                    loadAddonsNow();
                }
            })
            .catch(error => {
                console.log('ℹ️ Nie można sprawdzić wersji:', error.message);
            });
    }
    
    
    loadAddonsNow();
    
    
    setInterval(checkVersionInBackground, CONFIG.CHECK_INTERVAL);
    
})();// ==UserScript==
// @name         Lupus Addons Manager - Świat Lupus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  loader
// @author       lupus
// @match        https://lupus.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @updateURL    https://lupusaddons.github.io/margonem-addons/loader.user.js
// @downloadURL  https://lupusaddons.github.io/margonem-addons/loader.user.js
// ==/UserScript==
(function() {
    'use strict';
    
    const CONFIG = {
        SERVER_URL: 'https://lupusaddons.github.io/margonem-addons',
        CHECK_INTERVAL: 30000,
        VERSION_KEY: 'margonem_addons_version'
    };
    
    let addonsLoaded = false;
    let currentVersion = GM_getValue(CONFIG.VERSION_KEY, '0');
    
    
    if (!window.location.href.includes('lupus.margonem')) {
        return;
    }
    
    console.log('🐺 Lupus Addons Manager - załadowane');
    
    
    function fetchFromServer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 5000,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Timeout'))
            });
        });
    }
    
    
    function loadAddonsNow() {
        console.log('⚡ Ładuję dodatki NATYCHMIAST...');
        
        fetchFromServer(`${CONFIG.SERVER_URL}/addons.js?t=${Date.now()}`)
            .then(addonsCode => {
                console.log('✅ Kod dodatków pobrany!');
                
                
                const oldScript = document.getElementById('margonem-addons');
                if (oldScript) oldScript.remove();
                
                
                const script = document.createElement('script');
                script.id = 'margonem-addons';
                script.textContent = addonsCode;
                (document.head || document.documentElement).appendChild(script);
                
                addonsLoaded = true;
                console.log('🐺 załadowane!');
                
                
                checkVersionInBackground();
            })
            .catch(error => {
                console.error('❌ Błąd ładowania:', error);
                
                setTimeout(loadAddonsNow, 2000);
            });
    }
    
    
    function checkVersionInBackground() {
        fetchFromServer(`${CONFIG.SERVER_URL}/version.json?t=${Date.now()}`)
            .then(versionData => {
                const serverVersion = JSON.parse(versionData);
                
                if (serverVersion.version !== currentVersion) {
                    console.log('🔄 Nowa wersja dostępna:', serverVersion.version);
                    GM_setValue(CONFIG.VERSION_KEY, serverVersion.version);
                    currentVersion = serverVersion.version;
                    
                    
                    loadAddonsNow();
                }
            })
            .catch(error => {
                console.log('ℹ️ Nie można sprawdzić wersji:', error.message);
            });
    }
    
    
    loadAddonsNow();
    
    
    setInterval(checkVersionInBackground, CONFIG.CHECK_INTERVAL);
    
})();
