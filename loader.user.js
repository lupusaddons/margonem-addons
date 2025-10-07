// ==UserScript==
// @name         Kaczor Addons Manager - Lupus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  zestaw dodateczkow
// @author       kaczka
// @match        https://lupus.margonem.pl/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://raw.githubusercontent.com/krystianasaaa/margonem-addons/b939ec05fdd03f6f973cef7a931659c224596bde/ikonka.png
// @run-at       document-body
// @updateURL    https://lupusaddons.github.io/margonem-addons/loader.user.js
// @downloadURL  https://lupusaddons.github.io/margonem-addons/loader.user.js
// ==/UserScript==
(function() {
    const s = document.createElement("script");
    s.src = "https://lupusaddons.github.io/margonem-addons/addons.js?" + Date.now();
    document.head.appendChild(s);
})();
