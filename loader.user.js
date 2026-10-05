// ==UserScript==
// @name         grzib
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  grzib
// @author       kaczka
// @match        https://luvia.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// ==/UserScript==
(function() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/heroes%20on%20discord.js?t=" + Date.now(),
        onload: r => {
            const s = document.createElement("script");
            s.textContent = r.responseText;
            document.documentElement.appendChild(s);
        }
    });
})();
