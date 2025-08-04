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
    
    // Sprawdź czy jest zaktualizowana lista z panelu administratora
    let allowedUsers;
    const savedUsers = localStorage.getItem('margonem_allowed_users');
    if (savedUsers) {
        try {
            allowedUsers = JSON.parse(savedUsers);
            console.log('📂 Użyto zaktualizowanej listy z panelu administratora');
        } catch (e) {
            // Jeśli błąd, użyj domyślnej listy
            const allowedUsers = ['5676978', '6901372', '9449685', '1406394', '9839862', '6680459', '829797', '6581687', '251614', '7949481', '1909323', '1193100', '9682982', '6591109', '5261188', '2221811', '4116980', '5942859', '9434153', '6145947', '9848909', '9550217', '9376321', '6283400', '583750', '4672322', '9085663', '7736753', '7712777', '6505636', '6555412', '3155337', '7466726', '6464617', '5090092', '9923077', '7246870', '8170184', '8631058', '6110079', '3449240', '7443491', '9794893', '9803001', '7617868', '8228619', '9668158', '5630085', '9442821', '5906841', '6580761', '5801771', '9604384', '9975302', '9285345', '6558282', '8320962', '8889608', '8776354', '9181569', '5641911', '6719921', '6770292', '8986880', '6873278', '4217774', '5365202', '1763767', '8797715', '6036183', '9710930', '8187398', '9153488', '4540634', '5158011'];
        }
    } else {
        // Domyślna lista
       allowedUsers = ['5676978', '6901372', '9449685', '1406394', '9839862', '6680459', '829797', '6581687', '251614', '7949481', '1909323', '1193100', '9682982', '6591109', '5261188', '2221811', '4116980', '5942859', '9434153', '6145947', '9848909', '9550217', '9376321', '6283400', '583750', '4672322', '9085663', '7736753', '7712777', '6505636', '6555412', '3155337', '7466726', '6464617', '5090092', '9923077', '7246870', '8170184', '8631058', '6110079', '3449240', '7443491', '9794893', '9803001', '7617868', '8228619', '9668158', '5630085', '9442821', '5906841', '6580761', '5801771', '9604384', '9975302', '9285345', '6558282', '8320962', '8889608', '8776354', '9181569', '5641911', '6719921', '6770292', '8986880', '6873278', '4217774', '5365202', '1763767', '8797715', '6036183', '9710930', '8187398', '9153488', '4540634', '5158011'];
    }
    
    const userId = getCookie('user_id');
    if (!allowedUsers.includes(userId)) {
        console.log('🚫 Brak uprawnień dla użytkownika:', userId);
        console.log('✅ Dozwoleni użytkownicy:', allowedUsers);
        return; 
    }
    console.log('✅ Użytkownik autoryzowany:', userId);
     let customText = "PRZERWA TECHNICZNA - SPRAWDZ SERWER LUPUS ADDONS NA DISCORDZIE";

    // Funkcja do tworzenia powiadomienia
    function createNotification() {
        // Sprawdź czy powiadomienie już istnieje
        if (document.getElementById('custom-notification')) {
            return;
        }

        const notification = document.createElement('div');
        notification.id = 'custom-notification';

        // Style - pozycja nieco poniżej środka ekranu
        notification.style.cssText = `
            position: fixed;
            top: 80%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(42, 42, 42, 0.7);
            border: 2px solid rgba(74, 74, 74, 0.8);
            border-radius: 5px;
            padding: 15px 15px;
            color: #ffff00;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            box-shadow: 0 4px 8px rgba(0,0,0,0.6);
            z-index: 99999;
            min-width: 200px;
            text-align: center;
            opacity: 1;
            transition: opacity 0.5s ease-out;
            backdrop-filter: blur(5px);
        `;

        notification.textContent = customText;
        document.body.appendChild(notification);

        // Automatyczne znikanie po 5 sekundach
        setTimeout(function() {
            if (document.getElementById('custom-notification')) {
                const notif = document.getElementById('custom-notification');
                notif.style.opacity = '0';
                setTimeout(function() {
                    if (notif && notif.parentNode) {
                        notif.parentNode.removeChild(notif);
                    }
                }, 500);
            }
        }, 5000);
    }

    // Uruchom po załadowaniu strony
    setTimeout(createNotification, 2000);

    // Dodatkowa próba
    window.addEventListener('load', function() {
        setTimeout(createNotification, 1000);
    });

})();
