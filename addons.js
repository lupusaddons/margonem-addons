(function() {
    'use strict';
    
    // System autoryzacji
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

    // Konfiguracja dodatków
    const addonConfig = {
        addon1: {
            name: 'Players Online',
            enabled: false,
            url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/players%20online.js'
        },
        addon2: {
            name: 'Players Online - Alarm',
            enabled: false,
            url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/players%20online%20alarm.js'
        },
        addon3: {
            name: 'Titans on Discord',
            enabled: false,
            url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/titans%20on%20discord.js'
        },
        addon4: {
            name: 'Heroes on Discord',
            enabled: false,
            url: 'https://raw.githubusercontent.com/lupusaddons/margonem-addons/refs/heads/main/heroes%20on%20discord.js'
        }
    };

    // Obiekt do przechowywania załadowanych dodatków
    const loadedAddons = {};

    // Funkcja do ładowania kodu dodatku z GitHub
    async function loadAddonCode(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const code = await response.text();
            return code;
        } catch (error) {
            console.error('Błąd podczas ładowania dodatku:', error);
            throw error;
        }
    }

    // Funkcja do tworzenia dodatku
    async function createAddon(addonId, config) {
        try {
            console.log(`Ładowanie dodatku: ${config.name}...`);
            
            // Załaduj kod z GitHub
            const addonCode = await loadAddonCode(config.url);
            
            // Stwórz obiekt dodatku
            const addon = {
                name: config.name,
                enabled: false,
                code: addonCode,
                addonFunction: null,
                init: function() {
                    console.log(`${config.name} włączony`);
                    try {
                        // Wykonaj kod dodatku w bezpiecznym kontekście
                        this.addonFunction = new Function(
                            'addonId', 
                            'console', 
                            'document', 
                            'window',
                            'cleanupAddon',
                            this.code
                        );
                        
                        // Uruchom dodatek
                        this.addonFunction(addonId, console, document, window, cleanupAddon);
                    } catch (error) {
                        console.error(`Błąd podczas inicjalizacji ${config.name}:`, error);
                        throw error;
                    }
                },
                destroy: function() {
                    cleanupAddon(addonId);
                }
            };
            
            return addon;
        } catch (error) {
            console.error(`Błąd podczas tworzenia dodatku ${config.name}:`, error);
            return null;
        }
    }

    // Funkcja do ładowania wszystkich dodatków
    async function loadAllAddons() {
        for (const [addonId, config] of Object.entries(addonConfig)) {
            const addon = await createAddon(addonId, config);
            if (addon) {
                loadedAddons[addonId] = addon;
                console.log(`✅ Załadowano: ${config.name}`);
            } else {
                console.log(`❌ Nie udało się załadować: ${config.name}`);
            }
        }
    }

    // Funkcja do włączania dodatku
    async function enableAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (addon.enabled) {
            console.log(`Dodatek ${addon.name} jest już włączony`);
            return true;
        }
        
        try {
            await addon.init();
            addon.enabled = true;
            console.log(`✅ Włączono: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`Błąd podczas włączania ${addon.name}:`, error);
            return false;
        }
    }

    // Funkcja do wyłączania dodatku
    function disableAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (!addon.enabled) {
            console.log(`Dodatek ${addon.name} jest już wyłączony`);
            return true;
        }
        
        try {
            addon.destroy();
            addon.enabled = false;
            console.log(`✅ Wyłączono: ${addon.name}`);
            return true;
        } catch (error) {
            console.error(`Błąd podczas wyłączania ${addon.name}:`, error);
            return false;
        }
    }

    // Funkcja do przełączania stanu dodatku
    async function toggleAddon(addonId) {
        const addon = loadedAddons[addonId];
        if (!addon) {
            console.error(`Dodatek ${addonId} nie został załadowany`);
            return false;
        }
        
        if (addon.enabled) {
            return disableAddon(addonId);
        } else {
            return await enableAddon(addonId);
        }
    }

    // Funkcja do pobierania listy dodatków
    function getAddonsList() {
        return Object.entries(loadedAddons).map(([id, addon]) => ({
            id,
            name: addon.name,
            enabled: addon.enabled
        }));
    }

    // Funkcja cleanup (musisz ją dostosować do swoich potrzeb)
    function cleanupAddon(addonId) {
        console.log(`Czyszczenie dodatku: ${addonId}`);
        // Tutaj umieść kod do czyszczenia zasobów dodatku
        // np. usuwanie event listenerów, elementów DOM, itp.
    }

    // Inicjalizacja - załaduj wszystkie dodatki przy starcie
    loadAllAddons().then(() => {
        console.log('🚀 Manager dodatków gotowy!');
        console.log('Dostępne dodatki:', getAddonsList());
        console.log(`👤 Zalogowany jako użytkownik: ${userId}`);
    });

    // Eksportuj funkcje do użycia
    window.AddonManager = {
        enable: enableAddon,
        disable: disableAddon,
        toggle: toggleAddon,
        getList: getAddonsList,
        reload: loadAllAddons,
        getCurrentUser: () => userId
    };

})();
