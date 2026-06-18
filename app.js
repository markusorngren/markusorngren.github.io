// --- BETA & FEATURE FLAGS ---
const appFeatures = {
    beta_mode: { id: 'beta_active', name: 'Beta Mode', default: false }
};

function isFeatureOn(key) {
    const val = localStorage.getItem('feat_' + appFeatures[key].id);
    if (val === null) return appFeatures[key].default;
    return val === 'true';
}

function toggleFeature(key) {
    const current = isFeatureOn(key);
    localStorage.setItem('feat_' + appFeatures[key].id, !current);
    location.reload(); 
}

// --- LANGUAGE / TRANSLATIONS ENGINE ---
function getDeviceLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang.toLowerCase().startsWith('sv')) return 'sv';
    if (lang.toLowerCase().startsWith('ru')) return 'ru';
    if (lang.toLowerCase().startsWith('am')) return 'am';
    if (lang.toLowerCase().startsWith('ar')) return 'ar';
    return 'en'; // Fallback
}

let currentLang = localStorage.getItem('app_lang') || getDeviceLanguage();

const i18n = {
    sv: {
        welcomeTitle: "Välkommen till spelet! 🐭",
        welcomeDesc2: "Redo att starta resan och hjälpa {name} hitta {targetName}?",
        dontShowAgain: "Visa inte igen",
        btnSkip: "Jag har koll! Let's go!",
        btnTutorial: "Visa mig hur man gör",
        tut1: "Här kan du byta mellan bil och gång! 🚗🚶",
        tut2: "Vill du skapa en annan startpunkt? Långtryck på kartan! 📍",
        tut3: "Sök efter ditt mål med röst, text, eller klicka direkt på kartan! 🔍",
        tut4: "När du valt mål kan du långtrycka på kartan igen för att lägga till via-punkter längs vägen! 💡",
        tut11: "Blev rutten fel? Tryck på Rensa här nere för att börja om! 🗑️",
        tut5: "Vill du spara rutten? Långtryck på en av dessa knappar för att spara! 💾",
        tut6: "När rutten är klar, tryck här för att starta spelet! 🚀",
        tut7: "Det finns olika sätt att dela! 🔗",
        tut8: "Här kan du dela rutten så andra kan öppna den i sin telefon! 🗺️",
        tut9: "Med Live-delning kan dina vänner följa din resa på kartan i realtid! 🔴",
        tut10: "Och här kan du snabbt tipsa om själva appen till en kompis! 📱",
		tut17: "Dela din erfarenhet om appen i facebookgruppen. 👥",
        tut12: "Här ser du hur många {pathName} du har kvar att samla! 🍎",
        tut13: "Klicka här för att byta till kartvyn och se var du är på vägen! 🗺️",
        tut14: "Här kan du snabbt zooma ut för att se hela rutten, eller centrera på dig själv! 🔍",
        tut15: "Du kan också zooma och panera med fingrarna direkt på kartan, precis som vanligt! ✌️",
        tut16: "När du når målet firar vi med konfetti och segerdans! 🎉",
        btnNext: "Nästa ➔",
        btnFinish: "Okej, jag fattar!",
        tutSkip: "Hoppa över",
        iosFooter1: "Tryck på ",
        iosFooter2: " och välj ",
        iosAddHome: "Lägg till på hemskärmen",
        installWarning: "⚠️ Öppna i Safari/Chrome för att spara appen!",
        offlineSearch: "Sökningen fungerar tyvärr inte när du är offline. Använd kartan eller sparade platser istället!",
        shareRouteTitle: "Häng med på äventyr!",
        followRouteText: "Följ min rutt till {target}!",
        copyRouteLink: "Kopiera länken för att dela rutt:",
        followLiveTitle: "Följ mig live!",
        followLiveText: "Följ jakten live! 🔴",
        copyLiveLink: "Kopiera länken för att dela live-rutt:",
        checkAppText: "Kolla in den här appen! 🗺️",
        copyAppLink: "Kopiera länken för att dela appen:",
        btnFacebookGroup: "Vår Facebookgrupp 👥",
        devBetaTitle: "🧪 BETA & FUNKTIONER",
        devOn: "PÅ ✅",
        devOff: "AV ❌",
        arLoading: "⏳ Laddar 3D-motor...",
        arPermissionError: "Rörelsesensorer måste tillåtas för att AR ska fungera.",
        arTestBtn: "📷 TESTA AR",
        arNetworkError: "Kunde inte ladda AR. Kontrollera nätverket.",
        arNoRouteError: "Du måste ha en aktiv rutt för att starta AR-spelet!",
        arCloseBtn: "✖ STÄNG AR-KAMERAN",
        arVictory: "🎉 Grymt jobbat! Du kom fram till målet och samlade {score} {pathName}! Awesome!",
        arStartText: "START",
        arGoalText: "MÅL",
        welcome: "Hej! {player}",
        helpFind: "Hjälp {name} att hitta {targetName}!",
        okGotIt: "Okej! Jag förstår!",
        searchingGps: "Söker din GPS... 📍",
        whereToDrive: "Vart ska vi åka? {player}",
        whereToWalk: "Vart ska vi gå? {player}",
        start: "STARTA {target}",
        voiceSearch: "🎤 RÖST SÖK",
        textSearch: "✎ TEXT SÖK",
        locateMe: "🎯 HITTA MEJ",
        cancel: "AVBRYT",
        clear: "RENSA",
        searchPlaceholder: "Vart ska vi?",
        saveSlot: "SPARA {num}",
        promptSaveAs: "Spara som:",
        promptSaveWaypoints: "Vill du spara med via-punkter?",
        addressSearch: "Söker adress...",
        markedLocation: "Markerad plats",
        kmTo: "<b>{dist} km</b> till {target}",
        kmToAndBack: "<b>{dist} km</b> till {target} och tillbaka",
        kmBird: "<b>{dist} km</b> (fågelvägen)",
        kmBirdAndBack: "<b>{dist} km</b> till målet och tillbaka (fågelvägen)",
        voiceListening: "LYSSNAR...",
        didIHearRight: "HÖRDE JAG RÄTT?",
        voiceError: "FEL 🛑",
        micDenied: "Du måste tillåta mikrofonen i webbläsaren för att röstsöket ska fungera.",
        heardNothing: "Hörde inget! {player} Säg adressen lite högre.",
        voiceNoMatch: "Kunde tyvärr inte tyda vad du sa. Testa igen! {target}",
        voiceNotSupported: "Tyvärr stöder inte din webbläsare röstsök. Testa Google Chrome eller Safari!",
        liveConnecting: "🔴 Ansluter till sändaren...",
        liveWaiting: "🟢 Väntar på {name}s uppdatering...",
        liveFollowing: "🔴 Du följer resan till {target}...",
        alreadyLive: "Du följer redan en live-sändning!",
        shareStatic: "Dela rutt (Statisk)",
        shareLive: "Dela LIVE 🔴",
        shareAppBtn: "Dela appen 📱",
        btnCancel: "Avbryt",
        btnZoomOut: "🔍 ZOOMA UT",
        btnZoomIn: "🔍 ZOOMA IN",
        btnCenter: "🔍 CENTRERA",
        setStartPoint: "📍 Sätt som startpunkt",
        waypointDit: "🏁 På vägen dit",
        waypointHem: "🏁 På vägen tillbaka",
        addWaypoint: "🏁 Lägg till via-punkt",
        kmLeft: "{dist} km kvar",
        iosInstall: "Installera appen för att få fullskärm och snabb åtkomst!",
        iosClose: "Kanske senare",
        btnMap: "🗺️ KARTA",
        devTitle: "🛠 DEV MODE",
        devLang: "🌐 SPRÅK / LANGUAGE",
        devTheme: "🎨 TEMA / THEMES",
        devClose: "Stäng",
        devReset: "🔄 Återställ Inställningar",
        themes: {
            default: { name: 'musen', targetName: 'osten', pathName: 'ÄPPLEN' },
            easter: { name: 'påskharen', targetName: 'påskägget', pathName: 'GODIS' },
            midsummer: { name: 'grodan', targetName: 'jordgubben', pathName: 'BLOMMOR' },
            halloween: { name: 'spöket', targetName: 'pumpan', pathName: 'FLADDERMÖSS' },
            christmas: { name: 'tomten', targetName: 'julklappen', pathName: 'KAKOR' },
            newyear: { name: 'raketen', targetName: 'fyrverkeriet', pathName: 'STJÄRNOR' },
            birthday: { name: 'födelsedagsbarnet', targetName: 'tårtan', pathName: 'BALLONGER' }
        }
    },
    en: {
        welcomeTitle: "Welcome to the game! 🐭",
        welcomeDesc2: "Ready to start the journey and help {name} find {targetName}?",
        dontShowAgain: "Do not show again for this version",
        btnSkip: "I know how it works! Let's go!",
        btnTutorial: "Show me how",
        tut1: "Here you can switch between driving and walking! 🚗🚶",
        tut2: "Planning a route? Long-press on the map to set a custom starting point! 📍",
        tut3: "Search for your destination using voice, text, or tap directly on the map! 🔍",
        tut4: "Once you have a destination, long-press the map to add waypoints! 💡",
        tut11: "Did the route go wrong? Tap Clear down here to start over! 🗑️",
        tut5: "Want to save the route? Long-press one of these buttons! 💾",
        tut7: "Share the route in advance, or share Live so friends can follow along! 🔴",
        tut8: "Share a static link to your route so others can see it! 🗺️",
        tut9: "With Live-sharing, friends can follow your movement on the map in real time! 🔴",
        tut10: "Share a link to the app itself with a friend! 📱",
        tut17: "Share your experience about the app in the Facebook group. 👥",
        tut6: "When your route is ready, tap here to start the game! 🚀",
        tut12: "Here you can see how many {pathName} you have left to collect! 🍎",
        tut13: "Click here to switch to the map view and see where you are! 🗺️",
        tut14: "Here you can quick-zoom out to see the full route, or center back on yourself! 🔍",
        tut15: "You can also pinch to zoom and pan directly on the map, just like normal! ✌️",
        tut16: "When you reach the goal, we celebrate with confetti and a victory dance! 🎉",
        btnNext: "Next ➔",
        btnFinish: "Got it!",
        tutSkip: "Skip",
        iosFooter1: "Tap ",
        iosFooter2: " and choose ",
        iosAddHome: "Add to Home Screen",
        installWarning: "⚠️ Open in Safari/Chrome to save the app!",
        offlineSearch: "Search doesn't work offline. Please use the map or saved locations instead!",
        shareRouteTitle: "Join the adventure!",
        followRouteText: "Follow my route to {target}!",
        copyRouteLink: "Copy link to share route:",
        followLiveTitle: "Follow me live!",
        followLiveText: "Follow the hunt live! 🔴",
        copyLiveLink: "Copy link to share live route:",
        checkAppText: "Check out this app! 🗺️",
        copyAppLink: "Copy link to share app:",
        btnFacebookGroup: "Our Facebook Group 👥",
        devBetaTitle: "🧪 BETA & FEATURES",
        devOn: "ON ✅",
        devOff: "OFF ❌",
        arLoading: "⏳ Loading 3D engine...",
        arPermissionError: "Motion sensors must be allowed for AR to work.",
        arTestBtn: "📷 TEST AR",
        arNetworkError: "Could not load AR. Check your network.",
        arNoRouteError: "You must have an active route to start the AR game!",
        arCloseBtn: "✖ CLOSE AR CAMERA",
        arVictory: "🎉 Awesome! You reached the goal and collected {score} {pathName}! Great job!",
        arStartText: "START",
        arGoalText: "GOAL",
        welcome: "Hello! {player}",
        helpFind: "Help {name} find {targetName}!",
        okGotIt: "Okay! I understand!",
        searchingGps: "Searching GPS... 📍",
        whereToDrive: "Where are we driving? {player}",
        whereToWalk: "Where are we walking? {player}",
        start: "START {target}",
        voiceSearch: "🎤 VOICE SEARCH",
        textSearch: "✎ TEXT SEARCH",
        locateMe: "🎯 LOCATE ME",
        cancel: "CANCEL",
        clear: "CLEAR",
        searchPlaceholder: "Where to?",
        saveSlot: "SAVE {num}",
        promptSaveAs: "Save as:",
        promptSaveWaypoints: "Do you want to save with waypoints?",
        addressSearch: "Searching address...",
        markedLocation: "Marked location",
        kmTo: "<b>{dist} km</b> to {target}",
        kmToAndBack: "<b>{dist} km</b> to {target} and back",
        kmBird: "<b>{dist} km</b> (as the crow flies)",
        kmBirdAndBack: "<b>{dist} km</b> to target and back (as the crow flies)",
        voiceListening: "LISTENING...",
        didIHearRight: "DID I HEAR RIGHT?",
        voiceError: "ERROR 🛑",
        micDenied: "You must allow microphone access in your browser.",
        heardNothing: "Didn't catch that! {player} Speak a little louder.",
        voiceNoMatch: "Couldn't figure out what you said. Try again! {target}",
        voiceNotSupported: "Sorry, your browser doesn't support voice search.",
        liveConnecting: "🔴 Connecting to broadcaster...",
        liveWaiting: "🟢 Waiting for {name}'s update...",
        liveFollowing: "🔴 Following journey to {target}...",
        alreadyLive: "You are already following a live session!",
        shareStatic: "Share route (Static)",
        shareLive: "Share LIVE 🔴",
        shareAppBtn: "Share app 📱",
        btnCancel: "Cancel",
        btnZoomOut: "🔍 ZOOM OUT",
        btnZoomIn: "🔍 ZOOM IN",
        btnCenter: "🔍 CENTER",
        setStartPoint: "📍 Set as starting point",
        waypointDit: "🏁 On the way there",
        waypointHem: "🏁 On the way back",
        addWaypoint: "🏁 Add waypoint",
        kmLeft: "{dist} km left",
        iosInstall: "Install the app for full screen and quick access!",
        iosClose: "Maybe later",
        btnMap: "🗺️ MAP",
        devTitle: "🛠 DEV MODE",
        devLang: "🌐 LANGUAGE",
        devTheme: "🎨 THEMES",
        devClose: "Close",
        devReset: "🔄 Reset Settings",
        themes: {
            default: { name: 'the mouse', targetName: 'the cheese', pathName: 'APPLES' },
            easter: { name: 'the easter bunny', targetName: 'the egg', pathName: 'CANDY' },
            midsummer: { name: 'the frog', targetName: 'the strawberry', pathName: 'FLOWERS' },
            halloween: { name: 'the ghost', targetName: 'the pumpkin', pathName: 'BATS' },
            christmas: { name: 'Santa', targetName: 'the present', pathName: 'COOKIES' },
            newyear: { name: 'the rocket', targetName: 'the fireworks', pathName: 'STARS' },
            birthday: { name: 'the birthday kid', targetName: 'the cake', pathName: 'BALLOONS' }
        }
    },
    ru: {
        welcomeTitle: "Добро пожаловать в игру! 🐭",
        welcomeDesc2: "Готовы начать путешествие и помочь {name} найти {targetName}?",
        dontShowAgain: "Больше не показывать для этой версии",
        btnSkip: "Я знаю, как это работает! Поехали!",
        btnTutorial: "Покажите, как",
        tut1: "Здесь вы можете переключаться между автомобилем и пешком! 🚗🚶",
        tut2: "Планируете маршрут? Долгое нажатие на карту установит точку старта! 📍",
        tut3: "Ищите пункт назначения голосом, текстом или нажатием на карту! 🔍",
        tut4: "Указав цель, сделайте долгое нажатие на карту, чтобы добавить путевые точки! 💡",
        tut11: "Маршрут неверный? Нажмите Очистить, чтобы начать заново! 🗑️",
        tut5: "Хотите сохранить маршрут? Долгое нажатие на одну из этих кнопок! 💾",
        tut7: "Поделитесь маршрутом заранее или в прямом эфире, чтобы друзья могли следить! 🔴",
        tut8: "Поделитесь статической ссылкой на ваш маршрут! 🗺️",
        tut9: "С Live-трансляцией друзья могут следить за вашим движением на карте в реальном времени! 🔴",
        tut10: "Поделитесь ссылкой на само приложение с другом! 📱",
        tut17: "Поделитесь своим опытом о приложении в группе Facebook. 👥",
        tut6: "Когда маршрут готов, нажмите здесь, чтобы начать игру! 🚀",
        tut12: "Здесь вы видите, сколько {pathName} осталось собрать! 🍎",
        tut13: "Нажмите здесь, чтобы переключиться на карту и узнать, где вы! 🗺️",
        tut14: "Здесь вы можете отдалить или центрировать карту! 🔍",
        tut15: "Вы также можете масштабировать карту пальцами! ✌️",
        tut16: "Когда вы достигнете цели, будет победный танец и конфетти! 🎉",
        btnNext: "Далее ➔",
        btnFinish: "Понятно!",
        tutSkip: "Пропустить",
        iosFooter1: "Нажмите ",
        iosFooter2: " и выберите ",
        iosAddHome: "На экран Домой",
        installWarning: "⚠️ Откройте в Safari/Chrome, чтобы сохранить приложение!",
        offlineSearch: "Поиск не работает в автономном режиме. Используйте карту или сохраненные места!",
        shareRouteTitle: "Присоединяйтесь к приключению!",
        followRouteText: "Следуйте по моему маршруту в {target}!",
        copyRouteLink: "Скопируйте ссылку, чтобы поделиться маршрутом:",
        followLiveTitle: "Следите за мной в прямом эфире!",
        followLiveText: "Следите за охотой в прямом эфире! 🔴",
        copyLiveLink: "Скопируйте ссылку, чтобы поделиться живым маршрутом:",
        checkAppText: "Зацените это приложение! 🗺️",
        copyAppLink: "Скопируйте ссылку, чтобы поделиться приложением:",
        btnFacebookGroup: "Наша группа в Facebook 👥",
        devBetaTitle: "🧪 БЕТА И ФУНКЦИИ",
        devOn: "ВКЛ ✅",
        devOff: "ВЫКЛ ❌",
        arLoading: "⏳ Загрузка 3D-движка...",
        arPermissionError: "Датчики движения должны быть разрешены для работы AR.",
        arTestBtn: "📷 ТЕСТ AR",
        arNetworkError: "Не удалось загрузить AR. Проверьте сеть.",
        arNoRouteError: "У вас должен быть активный маршрут, чтобы начать игру AR!",
        arCloseBtn: "✖ ЗАКРЫТЬ КАМЕРУ AR",
        arVictory: "🎉 Отлично! Вы достигли цели и собрали {score} {pathName}! Потрясающе!",
        arStartText: "СТАРТ",
        arGoalText: "ЦЕЛЬ",
        welcome: "Привет! {player}",
        helpFind: "Помогите {name} найти {targetName}!",
        okGotIt: "Понятно!",
        searchingGps: "Поиск GPS... 📍",
        whereToDrive: "Куда едем? {player}",
        whereToWalk: "Куда идем? {player}",
        start: "СТАРТ {target}",
        voiceSearch: "🎤 ГОЛОС",
        textSearch: "✎ ТЕКСТ",
        locateMe: "🎯 ГДЕ Я",
        cancel: "ОТМЕНА",
        clear: "ОЧИСТИТЬ",
        searchPlaceholder: "Куда?",
        saveSlot: "СОХРАНИТЬ {num}",
        promptSaveAs: "Сохранить как:",
        promptSaveWaypoints: "Сохранить с путевыми точками?",
        addressSearch: "Поиск адреса...",
        markedLocation: "Отмеченное место",
        kmTo: "<b>{dist} км</b> до {target}",
        kmToAndBack: "<b>{dist} км</b> до {target} и обратно",
        kmBird: "<b>{dist} км</b> (по прямой)",
        kmBirdAndBack: "<b>{dist} км</b> туда и обратно (по прямой)",
        voiceListening: "СЛУШАЮ...",
        didIHearRight: "Я ПРАВИЛЬНО ПОНЯЛ?",
        voiceError: "ОШИБКА 🛑",
        micDenied: "Вам нужно разрешить доступ к микрофону.",
        heardNothing: "Ничего не услышал! {player} Говорите громче.",
        voiceNoMatch: "Не удалось распознать. Попробуйте еще раз! {target}",
        voiceNotSupported: "Ваш браузер не поддерживает голосовой поиск.",
        liveConnecting: "🔴 Подключение к трансляции...",
        liveWaiting: "🟢 Ожидание обновления от {name}...",
        liveFollowing: "🔴 Вы следите за маршрутом к {target}...",
        alreadyLive: "Вы уже следите за трансляцией!",
        shareStatic: "Поделиться маршрутом (Статика)",
        shareLive: "Поделиться LIVE 🔴",
        shareAppBtn: "Поделиться приложением 📱",
        btnCancel: "Отмена",
        btnZoomOut: "🔍 ОТДАЛИТЬ",
        btnZoomIn: "🔍 ПРИБЛИЗИТЬ",
        btnCenter: "🔍 В ЦЕНТР",
        setStartPoint: "📍 Установить как точку старта",
        waypointDit: "🏁 По пути туда",
        waypointHem: "🏁 По пути обратно",
        addWaypoint: "🏁 Добавить путевую точку",
        kmLeft: "осталось {dist} км",
        iosInstall: "Установите приложение для полного экрана!",
        iosClose: "Возможно позже",
        btnMap: "🗺️ КАРТА",
        devTitle: "🛠 РЕЖИМ РАЗРАБОТЧИКА",
        devLang: "🌐 ЯЗЫК / LANGUAGE",
        devTheme: "🎨 ТЕМЫ / THEMES",
        devClose: "Закрыть",
        devReset: "🔄 Сброс настроек",
        themes: {
            default: { name: 'мыши', targetName: 'сыр', pathName: 'ЯБЛОКИ' },
            easter: { name: 'пасхальному кролику', targetName: 'пасхальное яйцо', pathName: 'КОНФЕТЫ' },
            midsummer: { name: 'лягушке', targetName: 'клубнику', pathName: 'ЦВЕТЫ' },
            halloween: { name: 'призраку', targetName: 'тыкву', pathName: 'ЛЕТУЧИЕ МЫШИ' },
            christmas: { name: 'Санте', targetName: 'подарок', pathName: 'ПЕЧЕНЬЕ' },
            newyear: { name: 'ракете', targetName: 'фейерверк', pathName: 'ЗВЕЗДЫ' },
            birthday: { name: 'имениннику', targetName: 'торт', pathName: 'ШАРИКИ' }
        }
    },
    am: {
        welcomeTitle: "ወደ ጨዋታው በደህና መጡ! 🐭",
        welcomeDesc2: "ጉዞውን ለመጀመር እና {name} {targetName} እንዲያገኝ ለመርዳት ዝግጁ ነዎት?",
        dontShowAgain: "ለዚህ ስሪት እንደገና አታሳይ",
        btnSkip: "እንዴት እንደሚሰራ አውቃለሁ! እንሂድ!",
        btnTutorial: "እንዴት እንደሆነ አሳየኝ",
        tut1: "እዚህ በማሽከርከር እና በእግር መሄድ መካከል መቀየር ይችላሉ! 🚗🚶",
        tut2: "መንገድ እያቀዱ ነው? መነሻ ነጥብ ለማዘጋጀት ካርታውን በረጅሙ ይጫኑ! 📍",
        tut3: "ድምጽ፣ ጽሑፍ በመጠቀም ወይም በቀጥታ ካርታው ላይ በመጫን መድረሻዎን ይፈልጉ! 🔍",
        tut4: "መድረሻ ካለዎት በኋላ የማቆሚያ ነጥቦችን ለማከል ካርታውን በረጅሙ ይጫኑ! 💡",
        tut11: "መንገዱ ተሳስቷል? ካርታውን ለማጽዳት እና እንደገና ለመጀመር አጽዳን ይጫኑ! 🗑️",
        tut5: "መንገዱን ማስቀመጥ ይፈልጋሉ? ከእነዚህ አዝራሮች ውስጥ አንዱን በረጅሙ ይጫኑ! 💾",
        tut7: "መንገዱን አስቀድመው ያጋሩ፣ ወይም ጓደኞችዎ እንዲከታተሉዎት በቀጥታ ያጋሩ! 🔴",
        tut8: "ሌሎች እንዲያዩት ቋሚ አገናኝ ያጋሩ! 🗺️",
        tut9: "በቀጥታ ስርጭት ጓደኞችዎ እንቅስቃሴዎን በካርታው ላይ በቅጽበት መከታተል ይችላሉ! 🔴",
        tut10: "የመተግበሪያውን አገናኝ ለጓደኛዎ ያጋሩ! 📱",
        tut17: "ስለመተግበሪያው ያለዎትን ተሞክሮ በፌስቡክ ቡድን ውስጥ ያጋሩ። 👥",
        tut6: "መንገድዎ ዝግጁ ሲሆን ጨዋታውን ለመጀመር እዚህ ይጫኑ! 🚀",
        tut12: "ምን ያህል {pathName} እንደሚቀርዎ እዚህ ማየት ይችላሉ! 🍎",
        tut13: "ወደ ካርታ እይታ ለመቀየር እና የት እንዳሉ ለማየት እዚህ ጠቅ ያድርጉ! 🗺️",
        tut14: "ካርታውን ለማሳነስ ወይም መሃል ለማድረግ እዚህ መጫን ይችላሉ! 🔍",
        tut15: "በጣትዎም ካርታውን ማጉላት እና ማሳነስ ይችላሉ! ✌️",
        tut16: "ግቡ ላይ ሲደርሱ የድል ጭፈራ እና ኮንፈቲ ይኖራል! 🎉",
        btnNext: "ቀጣይ ➔",
        btnFinish: "ገባኝ!",
        tutSkip: "ዝለል",
        iosFooter1: "ይጫኑ ",
        iosFooter2: " እና ይምረጡ ",
        iosAddHome: "ወደ መነሻ ማያ ገጽ አክል",
        installWarning: "⚠️ መተግበሪያውን ለማስቀመጥ በ Safari/Chrome ይክፈቱ!",
        offlineSearch: "ከመስመር ውጭ ሆነው ፍለጋ አይሰራም። እባክዎ ካርታውን ወይም የተቀመጡ ቦታዎችን ይጠቀሙ!",
        shareRouteTitle: "ጀብዱውን ይቀላቀሉ!",
        followRouteText: "መንገዴን ወደ {target} ይከተሉ!",
        copyRouteLink: "መንገዱ ለማጋራት አገናኙን ይቅዱ፡",
        followLiveTitle: "በቀጥታ ይከተሉኝ!",
        followLiveText: "አደኑን በቀጥታ ይከተሉ! 🔴",
        copyLiveLink: "የቀጥታ መንገዱን ለማጋራት አገናኙን ይቅዱ፡",
        checkAppText: "ይህን መተግበሪያ ይመልከቱ! 🗺️",
        copyAppLink: "መተግበሪያውን ለማጋራት አገናኙን ይቅዱ፡",
        btnFacebookGroup: "የእኛ የፌስቡክ ቡድን 👥",
        devBetaTitle: "🧪 ቤታ እና ባህሪዎች",
        devOn: "በርቷል ✅",
        devOff: "ጠፍቷል ❌",
        arLoading: "⏳ የ 3D ሞተርን በመጫን ላይ...",
        arPermissionError: "የኤአር(AR) እንዲሰራ የእንቅስቃሴ ዳሳሾች ሊፈቀዱ ይገባል።",
        arTestBtn: "📷 ኤአር (AR) ሞክር",
        arNetworkError: "ኤአር(AR) መጫን አልተቻለም። አውታረ መረብዎን ያረጋግጡ።",
        arNoRouteError: "የኤአር(AR) ጨዋታ ለመጀመር ንቁ መንገድ ሊኖርዎት ይገባል!",
        arCloseBtn: "✖ የኤአር(AR) ካሜራ ዝጋ",
        arVictory: "🎉 አድርገውታል! ግቡ ላይ ደርሰው {score} {pathName} ሰብስበዋል! ምርጥ!",
        arStartText: "ጀምር",
        arGoalText: "ግም",
        welcome: "ሰላም! {player}",
        helpFind: "{name} {targetName} እንዲያገኝ እርዱት!",
        okGotIt: "እሺ! ገባኝ!",
        searchingGps: "ጂፒኤስ በመፈለግ ላይ... 📍",
        whereToDrive: "ወደ የት እንጓዝ? {player}",
        whereToWalk: "የት እንሂድ? {player}",
        start: "ጀምር {target}",
        voiceSearch: "🎤 የድምፅ ፍለጋ",
        textSearch: "✎ የጽሑፍ ፍለጋ",
        locateMe: "🎯 እኔን ፈልግ",
        cancel: "ሰርዝ",
        clear: "አጽዳ",
        searchPlaceholder: "የት እንሂድ?",
        saveSlot: "አስቀምጥ {num}",
        promptSaveAs: "እንደዚህ አስቀምጥ:",
        promptSaveWaypoints: "ከማቆሚያ ነጥቦች ጋር ያስቀምጡ?",
        addressSearch: "አድራሻ በመፈለግ ላይ...",
        markedLocation: "ምልክት የተደረገበት ቦታ",
        kmTo: "<b>{dist} ኪ.ሜ</b> ወደ {target}",
        kmToAndBack: "<b>{dist} ኪ.ሜ</b> ወደ {target} እና ወደ ኋላ",
        kmBird: "<b>{dist} ኪ.ሜ</b> (በቀጥታ መስመር)",
        kmBirdAndBack: "<b>{dist} ኪ.ሜ</b> ወደ መድረሻው እና ወደ ኋላ (በቀጥታ)",
        voiceListening: "በማዳመጥ ላይ...",
        didIHearRight: "በትክክል ሰማሁ?",
        voiceError: "ስህተት 🛑",
        micDenied: "ማይክሮፎን መጠቀም መፍቀድ አለብዎት።",
        heardNothing: "ምንም አልሰማሁም! {player} ትንሽ ከፍ አድርገው ይናገሩ።",
        voiceNoMatch: "የተናገሩት አልተለየም። እንደገና ይሞክሩ! {target}",
        voiceNotSupported: "ይቅርታ፣ የእርስዎ ብሮውዘር የድምፅ ፍለጋን አይደግፍም።",
        liveConnecting: "🔴 ከስርጭቱ ጋር በመገናኘት ላይ...",
        liveWaiting: "🟢 የ {name}ን መረጃ በመጠበቅ ላይ...",
        liveFollowing: "🔴 ጉዞውን ወደ {target} እየተከታተሉ ነው...",
        alreadyLive: "እርስዎ ቀድሞውኑ የቀጥታ ስርጭት እየተከታተሉ ነው!",
        shareStatic: "መንገድ አጋራ (መደበኛ)",
        shareLive: "በቀጥታ አጋራ 🔴",
        shareAppBtn: "መተግበሪያ አጋራ 📱",
        btnCancel: "ሰርዝ",
        btnZoomOut: "🔍 አሳንስ",
        btnZoomIn: "🔍 አጉላ",
        btnCenter: "🔍 ማዕከል",
        setStartPoint: "📍 እንደ መነሻ ነጥብ ያድርጉ",
        waypointDit: "🏁 በመሄጃው መንገድ ላይ",
        waypointHem: "🏁 በመመለሻው መንገድ ላይ",
        addWaypoint: "🏁 የማቆሚያ ነጥብ ያክሉ",
        kmLeft: "{dist} ኪ.ሜ ቀርቷል",
        iosInstall: "ሙሉ ስክሪን ለማግኘት መተግበሪያውን ይጫኑ!",
        iosClose: "ምናልባት በኋላ",
        btnMap: "🗺️ ካርታ",
        devTitle: "🛠 DEV MODE",
        devLang: "🌐 ቋንቋ / LANGUAGE",
        devTheme: "🎨 ገጽታዎች / THEMES",
        devClose: "ዝጋ",
        devReset: "🔄 ዳግም አስጀምር",
        themes: {
            default: { name: 'አይጥ', targetName: 'አይብ', pathName: 'ፖም' },
            easter: { name: 'የፋሲካ ጥንቸል', targetName: 'እንቁላል', pathName: 'ከረሜላ' },
            midsummer: { name: 'እንቁራሪት', targetName: 'እንጆሪ', pathName: 'አበቦች' },
            halloween: { name: 'መንፈስ', targetName: 'ዱባ', pathName: 'የሌሊት ወፎች' },
            christmas: { name: 'ሳንታ', targetName: 'ስጦታ', pathName: 'ብስኩቶች' },
            newyear: { name: 'ሮኬት', targetName: 'ርችት', pathName: 'ከዋክብት' },
            birthday: { name: 'የልደት ልጅ', targetName: 'ኬክ', pathName: 'ፊኛዎች' }
        }
    },
    ar: {
        welcomeTitle: "مرحبًا بك في اللعبة! 🐭",
        welcomeDesc2: "هل أنت مستعد لبدء الرحلة ومساعدة {name} في العثور على {targetName}؟",
        dontShowAgain: "لا تظهر مرة أخرى لهذا الإصدار",
        btnSkip: "أعرف كيف يعمل! لننطلق!",
        btnTutorial: "أرني كيف",
        tut1: "هنا يمكنك التبديل بين القيادة والمشي! 🚗🚶",
        tut2: "تخطط لمسار؟ اضغط مطولاً على الخريطة لتعيين نقطة بداية! 📍",
        tut3: "ابحث عن وجهتك باستخدام الصوت أو النص أو النقر مباشرة على الخريطة! 🔍",
        tut4: "بمجرد تحديد الوجهة، اضغط مطولاً على الخريطة لإضافة نقاط طريق! 💡",
        tut11: "هل المسار خاطئ؟ اضغط على مسح لتنظيف الخريطة والبدء من جديد! 🗑️",
        tut5: "هل تريد حفظ المسار؟ اضغط مطولاً على أحد هذه الأزرار! 💾",
        tut7: "شارك المسار مسبقًا، أو شارك مباشرة ليتمكن الأصدقاء من المتابعة! 🔴",
        tut8: "شارك رابطًا ثابتًا لمسارك ليتمكن الآخرون من رؤيته! 🗺️",
        tut9: "من خلال المشاركة المباشرة، يمكن للأصدقاء متابعة حركتك على الخريطة في الوقت الفعلي! 🔴",
        tut10: "شارك رابط التطبيق مع صديق! 📱",
        tut17: "شارك تجربتك عن التطبيق في مجموعة الفيسبوك. 👥",
        tut6: "عندما يكون مسارك جاهزًا، انقر هنا لبدء اللعبة! 🚀",
        tut12: "هنا يمكنك رؤية عدد {pathName} المتبقية لجمعها! 🍎",
        tut13: "انقر هنا للتبديل إلى عرض الخريطة ورؤية موقعك! 🗺️",
        tut14: "هنا يمكنك تصغير الخريطة أو توسيطها! 🔍",
        tut15: "يمكنك أيضًا التكبير بأصابعك مباشرة على الخريطة! ✌️",
        tut16: "عندما تصل إلى الهدف، سنحتفل بقصاصات الورق الملونة ورقصة النصر! 🎉",
        btnNext: "التالي ➔",
        btnFinish: "فهمت!",
        tutSkip: "تخطي",
        iosFooter1: "اضغط على ",
        iosFooter2: " واختر ",
        iosAddHome: "إضافة إلى الشاشة الرئيسية",
        installWarning: "⚠️ افتح في Safari/Chrome لحفظ التطبيق!",
        offlineSearch: "البحث لا يعمل عندما تكون غير متصل بالإنترنت. يرجى استخدام الخريطة أو المواقع المحفوظة بدلاً من ذلك!",
        shareRouteTitle: "انضم إلى المغامرة!",
        followRouteText: "اتبع مساري إلى {target}!",
        copyRouteLink: "انسخ الرابط لمشاركة المسار:",
        followLiveTitle: "اتبعني مباشرة!",
        followLiveText: "اتبع المطاردة مباشرة! 🔴",
        copyLiveLink: "انسخ الرابط لمشاركة المسار المباشر:",
        checkAppText: "تحقق من هذا التطبيق! 🗺️",
        copyAppLink: "انسخ الرابط لمشاركة التطبيق:",
        btnFacebookGroup: "مجموعتنا على الفيسبوك 👥",
        devBetaTitle: "🧪 تجريبي وميزات",
        devOn: "تشغيل ✅",
        devOff: "إيقاف ❌",
        arLoading: "⏳ جاري تحميل المحرك ثلاثي الأبعاد...",
        arPermissionError: "يجب السماح لأجهزة استشعار الحركة لكي يعمل الواقع المعزز.",
        arTestBtn: "📷 اختبار الواقع المعزز",
        arNetworkError: "تعذر تحميل الواقع المعزز. تحقق من الشبكة.",
        arNoRouteError: "يجب أن يكون لديك مسار نشط لبدء لعبة الواقع المعزز!",
        arCloseBtn: "✖ إغلاق كاميرا الواقع المعزز",
        arVictory: "🎉 رائع! لقد وصلت إلى الهدف وجمع {score} {pathName}! عمل رائع!",
        arStartText: "ابدأ",
        arGoalText: "الهدف",
        welcome: "مرحباً! {player}",
        helpFind: "ساعد {name} في العثور على {targetName}!",
        okGotIt: "حسناً! فهمت!",
        searchingGps: "جاري البحث عن GPS... 📍",
        whereToDrive: "إلى أين سنذهب بالسيارة؟ {player}",
        whereToWalk: "إلى أين سنمشي؟ {player}",
        start: "ابدأ {target}",
        voiceSearch: "🎤 بحث صوتي",
        textSearch: "✎ بحث نصي",
        locateMe: "🎯 حدد موقعي",
        cancel: "إلغاء",
        clear: "مسح",
        searchPlaceholder: "إلى أين؟",
        saveSlot: "حفظ {num}",
        promptSaveAs: "حفظ باسم:",
        promptSaveWaypoints: "هل تريد الحفظ مع نقاط الطريق؟",
        addressSearch: "جاري البحث عن العنوان...",
        markedLocation: "موقع محدد",
        kmTo: "<b>{dist} كم</b> إلى {target}",
        kmToAndBack: "<b>{dist} كم</b> إلى {target} والعودة",
        kmBird: "<b>{dist} كم</b> (بخط مستقيم)",
        kmBirdAndBack: "<b>{dist} كم</b> للهدف والعودة (بخط مستقيم)",
        voiceListening: "أستمع...",
        didIHearRight: "هل سمعت بشكل صحيح؟",
        voiceError: "خطأ 🛑",
        micDenied: "يجب عليك السماح بالوصول إلى الميكروفون في متصفح متصفحك.",
        heardNothing: "لم أسمع شيئاً! {player} تحدث بصوت أعلى قليلاً.",
        voiceNoMatch: "لم أتمكن من فهم ما قلته. حاول مرة أخرى! {target}",
        voiceNotSupported: "عذراً، متصفحك لا يدعم البحث الصوتي.",
        liveConnecting: "🔴 جاري الاتصال بالبث...",
        liveWaiting: "🟢 في انتظار تحديث {name}...",
        liveFollowing: "🔴 تتابع الرحلة إلى {target}...",
        alreadyLive: "أنت تتابع بثاً مباشراً بالفعل!",
        shareStatic: "مشاركة المسار (ثابت)",
        shareLive: "مشاركة مباشر 🔴",
        shareAppBtn: "مشاركة التطبيق 📱",
        btnCancel: "إلغاء",
        btnZoomOut: "🔍 تصغير",
        btnZoomIn: "🔍 تكبير",
        btnCenter: "🔍 تمركز",
        setStartPoint: "📍 تعيين كنقطة بداية",
        waypointDit: "🏁 في الطريق إلى هناك",
        waypointHem: "🏁 في طريق العودة",
        addWaypoint: "🏁 إضافة نقطة طريق",
        kmLeft: "متبقي {dist} كم",
        iosInstall: "قم بتثبيت التطبيق للحصول على شاشة كاملة ووصول سريع!",
        iosClose: "ربما لاحقاً",
        btnMap: "🗺️ خريطة",
        devTitle: "🛠 وضع المطور",
        devLang: "🌐 اللغة / LANGUAGE",
        devTheme: "🎨 السمات / THEMES",
        devClose: "إغلاق",
        devReset: "🔄 إعادة ضبط الإعدادات",
        themes: {
            default: { name: 'الفأر', targetName: 'الجبن', pathName: 'تفاح' },
            easter: { name: 'أرنب عيد الفصح', targetName: 'بيضة الفصح', pathName: 'حلوى' },
            midsummer: { name: 'الضفدع', targetName: 'الفراولة', pathName: 'زهور' },
            halloween: { name: 'الشبح', targetName: 'اليقطين', pathName: 'خفافيش' },
            christmas: { name: 'سانتا', targetName: 'الهدية', pathName: 'بسكويت' },
            newyear: { name: 'الصاروخ', targetName: 'الألعاب النارية', pathName: 'نجوم' },
            birthday: { name: 'صاحب عيد الميلاد', targetName: 'الكعكة', pathName: 'بالونات' }
        }
    }
};

function t(key, params = {}) {
    let str = i18n[currentLang]?.[key] || i18n['en'][key] || key;
    for (let p in params) { str = str.replace(`{${p}}`, params[p]); }
    return str;
}

function getThemeName() { return i18n[currentLang]?.themes?.[activeTheme.id]?.name || activeTheme.name; }
function getThemeTarget() { return i18n[currentLang]?.themes?.[activeTheme.id]?.targetName || activeTheme.targetName; }
function getThemePathName() { return i18n[currentLang]?.themes?.[activeTheme.id]?.pathName || "APPLES"; }
function getWhereToText() { return t(travelMode === 0 ? 'whereToDrive' : 'whereToWalk', {player: activeTheme.player}); }

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            const askVersion = (worker) => {
                if (!worker) return;
                const msgChan = new MessageChannel();
                msgChan.port1.onmessage = (event) => {
                    if (event.data && event.data.version) {
                        document.getElementById('version-tag').innerText = event.data.version.toUpperCase();
                    }
                };
                worker.postMessage({ type: 'GET_VERSION' }, [msgChan.port2]);
            };
            if (reg.active) askVersion(reg.active);
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') askVersion(newWorker);
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        window.location.reload();
                    }
                });
            });
        });
    });
}

// --- DYNAMIC VOICE LANG ---
const manualLangOverride = localStorage.getItem('app_lang');
let dynamicVoiceLang = 'en-US';

if (manualLangOverride) {
    const langCodeMap = { 'sv': 'sv-SE', 'en': 'en-US', 'ru': 'ru-RU', 'am': 'am-ET', 'ar': 'ar-SA' };
    dynamicVoiceLang = langCodeMap[manualLangOverride] || 'en-US';
} else {
    const langCodeMap = { 'sv': 'sv-SE', 'en': 'en-US', 'ru': 'ru-RU', 'am': 'am-ET', 'ar': 'ar-SA' };
    dynamicVoiceLang = langCodeMap[currentLang] || 'en-US';
}

function updateVoiceLangFromCountry(countryCode) {
    if (manualLangOverride) return;

    if (!countryCode) return;
    const cc = countryCode.toLowerCase();
    const langMap = { 
        'se': 'sv-SE', 'no': 'no-NO', 'dk': 'da-DK', 'fi': 'fi-FI', 
        'gb': 'en-GB', 'us': 'en-US', 'de': 'de-DE', 'fr': 'fr-FR', 
        'es': 'es-ES', 'it': 'it-IT', 'ru': 'ru-RU', 'et': 'am-ET', 'er': 'ti-ER',
        'ae': 'ar-AE', 'sa': 'ar-SA', 'eg': 'ar-EG', 'ma': 'ar-MA', 'iq': 'ar-IQ'
    };
    if (langMap[cc]) {
        dynamicVoiceLang = langMap[cc];
    }
}

// --- THEME ENGINE ---
const themes = {
    default:   { id: 'default', player: '🐭', target: '🧀', path: '🍎', color: '#4CAF50', name: 'musen', targetName: 'osten' },
    easter:    { id: 'easter', player: '🐰', target: '🥚', path: '🍬', color: '#FFEB3B', name: 'påskharen', targetName: 'påskägget' },
    midsummer: { id: 'midsummer', player: '🐸', target: '🍓', path: '🌸', color: '#8BC34A', name: 'grodan', targetName: 'jordgubben' },
    halloween: { id: 'halloween', player: '👻', target: '🎃', path: '🦇', color: '#FF9800', name: 'spöket', targetName: 'pumpan' },
    christmas: { id: 'christmas', player: '🎅', target: '🎁', path: '🍪', color: '#F44336', name: 'tomten', targetName: 'julklappen' },
    newyear:   { id: 'newyear', player: '🚀', target: '🎆', path: '✨', color: '#3F51B5', name: 'raketen', targetName: 'fyrverkeriet' },
    birthday:  { id: 'birthday', player: '🥳', target: '🎂', path: '🎈', color: '#E91E63', name: 'födelsedagsbarnet', targetName: 'tårtan' } 
};

function getCurrentTheme() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    if ((month === 12 && date >= 30) || (month === 1 && date <= 2)) return themes.newyear;
    if ((month === 3 && date >= 20) || (month === 4 && date <= 15)) return themes.easter;
    if (month === 6 && date >= 15 && date <= 25) return themes.midsummer;
    if ((month === 10 && date >= 20) || (month === 11 && date <= 5)) return themes.halloween;
    if (month === 12) return themes.christmas;
    return themes.default;
}

let activeTheme = themes[localStorage.getItem('app_theme_override')] || getCurrentTheme(); 

function applyTranslations() {
    const appTitles = { 'sv': 'Hur långt?', 'en': 'How far?', 'ru': 'Как далеко?', 'am': 'ምን ያህል ይርቃል?', 'ar': 'كم تبعد؟' };
    document.title = appTitles[currentLang] || appTitles['en'];

    const wt = document.getElementById('welcome-title'); if(wt) wt.innerHTML = t('welcomeTitle');
    const wd = document.getElementById('welcome-desc2'); if(wd) wd.innerHTML = t('welcomeDesc2', {name: getThemeName(), targetName: getThemeTarget()});
    const dsaLbl = document.getElementById('dont-show-again-lbl'); if(dsaLbl) dsaLbl.innerHTML = t('dontShowAgain');
    const wsb = document.getElementById('welcome-skip-btn'); if(wsb) wsb.innerHTML = t('btnSkip');
    const wtb = document.getElementById('welcome-tut-btn'); if(wtb) wtb.innerHTML = t('btnTutorial');
    
    const tutSkip = document.getElementById('tutorial-skip'); if(tutSkip) tutSkip.innerText = t('tutSkip');
    
    const searchInput = document.getElementById('text-search-input');
    if(searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    if(els.startBtn) els.startBtn.innerText = t('start', {target: activeTheme.target});
    if(els.voiceBtn && !els.voiceBtn.classList.contains('listening')) els.voiceBtn.innerHTML = t('voiceSearch');
    const txtBtn = document.getElementById('text-btn'); if(txtBtn) txtBtn.innerHTML = t('textSearch');
    updateLocateBtnText(); 
    
    const cancelBtn = document.getElementById('cancel-game-btn');
    if(cancelBtn) cancelBtn.innerHTML = t('cancel');

    const toggleGameBtn = document.getElementById('toggle-game-view-btn');
    if (toggleGameBtn) {
        toggleGameBtn.innerText = isGameMapVisible ? `${activeTheme.path} ${getThemePathName()}` : t('btnMap');
    }

    const zoomBtn = document.getElementById('zoom-toggle-btn');
    if (zoomBtn && isGameMapVisible) {
        if (!gameMapAutoCenter && !isGameMapZoomedOut) {
            zoomBtn.innerText = t('btnCenter');
        } else {
            zoomBtn.innerText = isGameMapZoomedOut ? t('btnZoomIn') : t('btnZoomOut');
        }
    }

    const iosDesc = document.getElementById('ios-desc'); if(iosDesc) iosDesc.innerHTML = t('iosInstall');
    const iosClose = document.getElementById('ios-close'); if(iosClose) iosClose.innerHTML = t('iosClose');
    
    const iosFooterTxt = document.getElementById('ios-footer-txt');
    if (iosFooterTxt) {
        iosFooterTxt.innerHTML = t('iosFooter1') + '<svg width="20" height="20" viewBox="0 0 50 50" style="margin: 0 5px; vertical-align: middle;"><path d="M30,35v10H10V15h10v-2H8v34h24V35H30z" fill="#007AFF"/><path d="M24,2v30h2V2.5l8,8l1.5-1.5L25,0L24,2z" fill="#007AFF"/></svg>' + t('iosFooter2') + '<b>"' + t('iosAddHome') + '"</b>.';
    }
}

function applyThemeUI() {
    document.documentElement.style.setProperty('--primary', activeTheme.color);
    applyTranslations();
}
// --------------------

const pusherAppId = "2121505";
const pusherKey = "57555a0b571c5d9c6f9b";
const pusherSecret = "553a46ceea1b0e804297";
const pusherCluster = "eu";
let pusher = null;
let liveChannel = null;
let isLiveSharing = false;
let isLiveReceiver = false;
let liveSessionId = null;
let liveBroadcastInterval = null;

function getPusherConfig() {
    return {
        cluster: pusherCluster,
        channelAuthorization: {
            customHandler: (params, callback) => {
                const stringToSign = params.socketId + ':' + params.channelName;
                const signature = CryptoJS.HmacSHA256(stringToSign, pusherSecret).toString(CryptoJS.enc.Hex);
                callback(null, { auth: pusherKey + ':' + signature });
            }
        }
    };
}

// Räknar ut kompassriktningen mellan två GPS-koordinater
function getBearing(startLat, startLng, destLat, destLng) {
    const toRad = Math.PI / 180;
    const toDeg = 180 / Math.PI;

    startLat = startLat * toRad;
    startLng = startLng * toRad;
    destLat = destLat * toRad;
    destLng = destLng * toRad;

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
              Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    const bearing = Math.atan2(y, x) * toDeg;

    return (bearing + 360) % 360;
}

let savedGameState = 'MAP';
let savedInitialTotalKm = 0;
let savedMaxStepsReached = 0;
let savedLastRouteIndex = 0;
let savedMidpointStepIndex = -1;
let savedHasReachedMidpoint = false;
let savedGameStartCoords = null;

let gameBaseSteps = 0;
let gameDynamicFactor = 0;
let gameVirtualDistOffset = 0;
let isReRouting = false;
let lastReRouteTime = 0;
let originalPois = [];
let savedWayPointsIndices = [];

let currentHeading = 0; let renderedHeading = 0; let lastUserCoordsForHeading = null;
let map, targetMarker, userMarker, connectionLine, connectionLineReturn, userCoords;
let fixedStartCoords = null; let manualStartMarker = null; let currentTargetCoords = null;
let waypointsDit = []; let waypointsHem = []; let waypointMarkers = []; 
let startCoords = null; let currentTargetName = "MÅLET"; let initialZoomPerformed = false; 
let isShowingUser = true; let isTracking = false; 
let savedLocations = JSON.parse(localStorage.getItem('mouse_favs')) || [null, null, null, null];
let wakeLock = null; let currentRouteCoords = []; let historicalRouteCoords = []; let ignoreClick = false; let confettiInterval = null;
let maxStepsReached = 0; let lastRouteIndex = 0; let hasReachedMidpoint = false; 
let midpointStepIndex = -1; let isCelebratingTurn = false; 
let gameMap = null; let gameRouteLine = null, gameUserMarker = null;
let isGameMapVisible = false;
let isGameMapZoomedOut = false;
let gameMapAutoCenter = true;   
let isProgrammaticMove = false; 

let travelMode = 0; 
const modes = [
    { icon: '🚗', factor: 1.0, profile: 'driving-car', osrmProfile: 'car' },
    { icon: '🚶', factor: 0.1, profile: 'foot-walking', osrmProfile: 'foot' },
    { icon: '🚶↔️', factor: 0.1, profile: 'foot-walking', osrmProfile: 'foot' } 
];

const els = {
    distInfo: document.getElementById('dist-info'),
    startBtn: document.getElementById('start-btn'),
    mapPage: document.getElementById('map-page'),
    gamePage: document.getElementById('game-page'),
    pathGrid: document.getElementById('path'),
    locateBtn: document.getElementById('locate-btn'),
    searchContainer: document.getElementById('search-container'),
    searchInput: document.getElementById('text-search-input'),
    voiceBtn: document.getElementById('voice-btn'),
    welcomeOverlay: document.getElementById('welcome-overlay'),
    shareBtn: document.getElementById('share-btn'),
    modeBtn: document.getElementById('mode-btn'),
    actionContainer: document.querySelector('.action-container'),
    gameMapElement: document.getElementById('game-map'),
    gameMapWrapper: document.getElementById('game-map-wrapper')
};

// --- WELCOME & TUTORIAL LOGIC ---
function saveWelcomeState() {
    const chk = document.getElementById('dont-show-again-chk');
    const isChecked = chk ? chk.checked : false;
    const data = {
        timestamp: Date.now(),
        dontShowAgain: isChecked
    };
    localStorage.setItem('welcome_overlay_data', JSON.stringify(data));
}

let currentTutorialStep = 0;
const tutorialSteps = [
    { target: 'mode-btn', textKey: 'tut1', pos: 'top' },
    { target: 'map', textKey: 'tut2', pos: 'center' },
    { target: '.action-container', textKey: 'tut3', pos: 'top' },
    { target: 'map', textKey: 'tut4', pos: 'center' },
    { target: 'clear-map-btn', textKey: 'tut11', pos: 'top' },
    { target: '.save-btn-container', textKey: 'tut5', pos: 'top' },
    { target: 'share-btn', textKey: 'tut7', pos: 'bottom' },
    { target: 'share-btn-static', textKey: 'tut8', pos: 'bottom', action: 'open_share' },
    { target: 'share-btn-live', textKey: 'tut9', pos: 'bottom', action: 'open_share' },
    { target: 'share-btn-app', textKey: 'tut10', pos: 'bottom', action: 'open_share' },
    { target: 'share-btn-facebook', textKey: 'tut17', pos: 'bottom', action: 'open_share' },
	{ target: 'start-btn', textKey: 'tut6', pos: 'top' },
    { target: 'path', textKey: 'tut12', pos: 'center', action: 'start_dummy_game' },
    { target: 'toggle-game-view-btn', textKey: 'tut13', pos: 'bottom' },
    { target: 'zoom-toggle-btn', textKey: 'tut14', pos: 'bottom', action: 'show_dummy_map' },
    { target: 'game-map-wrapper', textKey: 'tut15', pos: 'center' },
    { target: 'path', textKey: 'tut16', pos: 'center', action: 'show_victory_dance' }
];

function startTutorial() {
    saveWelcomeState();
    els.welcomeOverlay.classList.add('hidden');
    currentTutorialStep = 0;
    document.getElementById('tutorial-overlay').classList.remove('hidden');
    showTutorialStep(currentTutorialStep);
}

function skipTutorial() {
    if (!els.welcomeOverlay.classList.contains('hidden')) {
        saveWelcomeState();
    }
    
    els.welcomeOverlay.classList.add('hidden');
    const tutOverlay = document.getElementById('tutorial-overlay');
    if (tutOverlay) tutOverlay.classList.add('hidden');
    
    if (els.startBtn && !currentTargetCoords) els.startBtn.classList.add('hidden');

    const shareMenu = document.getElementById('share-menu');
    if (shareMenu) shareMenu.remove();

    // --- Städning för victory dance i tutorial ---
    clearInterval(window.tutorialConfettiInterval);
    window.tutorialConfettiInterval = null;
    document.querySelectorAll('.confetti').forEach(c => c.remove());
    const m = document.getElementById('the-mouse');
    if (m) {
        m.classList.remove('victory');
        m.innerHTML = activeTheme.player;
    }
    document.getElementById('tutorial-spotlight').style.display = 'block'; 
    // ------------------------------------------------

    // Revert till kartsidan om vi avslutar under dummy-spelet
    if (els.gamePage && !els.gamePage.classList.contains('hidden')) {
        els.gamePage.classList.add('hidden');
        els.mapPage.classList.remove('hidden');
        els.pathGrid.innerHTML = '';
        els.pathGrid.classList.remove('hidden');
        els.gameMapWrapper.classList.add('hidden');
        
        const toggleBtn = document.getElementById('toggle-game-view-btn');
        if (toggleBtn) toggleBtn.innerText = t('btnMap');

        if (map) {
            setTimeout(() => map.invalidateSize(), 100);
        }
    }
}

function nextTutorialStep() {
    currentTutorialStep++;
    if (currentTutorialStep >= tutorialSteps.length) {
        skipTutorial();
    } else {
        showTutorialStep(currentTutorialStep);
    }
}

function showTutorialStep(index) {
    const step = tutorialSteps[index];

    // Återställ spotlight display om den var gömd under victory dance
    document.getElementById('tutorial-spotlight').style.display = 'block';

    // --- Hantera Actions (Share och Dummy Game) ---
    if (step.action === 'open_share') {
        if (!document.getElementById('share-menu')) {
            shareApp({}); 
        }
    } else if (step.action === 'start_dummy_game') {
        const openMenu = document.getElementById('share-menu');
        if (openMenu) openMenu.remove();

        els.mapPage.classList.add('hidden');
        els.gamePage.classList.remove('hidden');
        els.pathGrid.classList.remove('hidden');
        els.gameMapWrapper.classList.add('hidden');

        els.pathGrid.innerHTML = `<div id="the-mouse">${activeTheme.player}</div>`;
        for (let i = 0; i < 25; i++) {
            const stepEl = document.createElement('div');
            stepEl.className = 'step';
            stepEl.id = `dummy-step-${i}`;
            stepEl.innerHTML = (i === 24) ? activeTheme.target : activeTheme.path;
            els.pathGrid.appendChild(stepEl);
        }
    } else if (step.action === 'show_dummy_map') {
        els.pathGrid.classList.add('hidden');
        els.gameMapWrapper.classList.remove('hidden');

        const toggleBtn = document.getElementById('toggle-game-view-btn');
        if (toggleBtn) toggleBtn.innerText = `${activeTheme.path} ${getThemePathName()}`;

        // Ensure zoom button is visible so the tutorial can attach to it
        const zoomBtn = document.getElementById('zoom-toggle-btn');
        if (zoomBtn) {
            zoomBtn.classList.remove('hidden');
            zoomBtn.innerText = t('btnZoomOut');
        }

        if (!gameMap) {
            gameMap = L.map('game-map', {zoomControl: false}).setView([59.3, 14.1], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(gameMap);
        }
        setTimeout(() => { if (gameMap) gameMap.invalidateSize(true); }, 250);
    } else if (step.action === 'show_victory_dance') {
        els.gameMapWrapper.classList.add('hidden');
        els.pathGrid.classList.remove('hidden');
        
        // Göm spotlight så att konfettin och skärmen inte blir nermörkad
        document.getElementById('tutorial-spotlight').style.display = 'none';

        const m = document.getElementById('the-mouse');
        if (m) {
            m.innerHTML = activeTheme.player + activeTheme.target;
            m.classList.add('victory');
        }
        createConfettiBurst();
        if (!window.tutorialConfettiInterval) {
            window.tutorialConfettiInterval = setInterval(createConfettiBurst, 800);
        }
    } else {
        const openMenu = document.getElementById('share-menu');
        if (openMenu) openMenu.remove();
    }
    // -----------------------------------------------

    const targetEl = step.target.startsWith('.') ? document.querySelector(step.target) : document.getElementById(step.target);
    
    if (step.target === 'start-btn' && targetEl) {
        targetEl.classList.remove('hidden');
    } else if (els.startBtn && !currentTargetCoords) {
        els.startBtn.classList.add('hidden');
    }

    const spotlight = document.getElementById('tutorial-spotlight');
    const tooltip = document.getElementById('tutorial-tooltip');
    const textEl = document.getElementById('tutorial-text');
    const nextBtn = document.getElementById('tutorial-next');

    // Infogar pathName för game view stegen
    textEl.innerHTML = t(step.textKey, { pathName: getThemePathName().toLowerCase() });
    
    if (index === tutorialSteps.length - 1) {
        nextBtn.innerHTML = t('btnFinish');
    } else {
        nextBtn.innerHTML = t('btnNext');
    }

    if (targetEl) {
        let rect = targetEl.getBoundingClientRect();
        
        // --- LOGIK FÖR SPARA-KNAPPARNA (Bara de 4 knapparna) ---
        if (step.target === '.save-btn-container') {
            const slotBtns = targetEl.querySelectorAll('.slot-btn');
            if (slotBtns.length > 0) {
                let minTop = Infinity, minLeft = Infinity, maxBottom = -Infinity, maxRight = -Infinity;
                slotBtns.forEach(btn => {
                    const r = btn.getBoundingClientRect();
                    if(r.top < minTop) minTop = r.top;
                    if(r.left < minLeft) minLeft = r.left;
                    if(r.bottom > maxBottom) maxBottom = r.bottom;
                    if(r.right > maxRight) maxRight = r.right;
                });
                rect = {
                    top: minTop, left: minLeft, bottom: maxBottom, right: maxRight,
                    width: maxRight - minLeft, height: maxBottom - minTop
                };
            }
        }
        // --- LOGIK FÖR SÖK-KNAPPARNA (Bara Text och Röst) ---
        else if (step.target === '.action-container') {
            const textBtn = document.getElementById('text-btn');
            const voiceBtn = document.getElementById('voice-btn');
            if (textBtn && voiceBtn) {
                const r1 = textBtn.getBoundingClientRect();
                const r2 = voiceBtn.getBoundingClientRect();
                
                const minTop = Math.min(r1.top, r2.top);
                const minLeft = Math.min(r1.left, r2.left);
                const maxBottom = Math.max(r1.bottom, r2.bottom);
                const maxRight = Math.max(r1.right, r2.right);
                
                rect = {
                    top: minTop, left: minLeft, bottom: maxBottom, right: maxRight,
                    width: maxRight - minLeft, height: maxBottom - minTop
                };
            }
        }
        // --------------------------------------------------------

        let centerLeft = rect.left + rect.width / 2;
        
        if (step.target === 'map' || step.target === 'path' || step.target === 'game-map-wrapper') {
            spotlight.style.top = rect.top + 'px';
            spotlight.style.left = rect.left + 'px';
            spotlight.style.width = rect.width + 'px';
            spotlight.style.height = rect.height + 'px';
            
            tooltip.style.top = '30%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
        } else {
            const pad = 5;
            spotlight.style.top = (rect.top - pad) + 'px';
            spotlight.style.left = (rect.left - pad) + 'px';
            spotlight.style.width = (rect.width + pad * 2) + 'px';
            spotlight.style.height = (rect.height + pad * 2) + 'px';

            let safeLeft = Math.max(150, Math.min(window.innerWidth - 150, centerLeft));
            tooltip.style.left = safeLeft + 'px';

            if (step.pos === 'top') {
                let topPos = rect.top - 15;
                if (topPos < 100) {
                    tooltip.style.top = '50%';
                    tooltip.style.transform = 'translate(-50%, -50%)';
                } else {
                    tooltip.style.top = topPos + 'px';
                    tooltip.style.transform = 'translate(-50%, -100%)';
                }
            } else if (step.pos === 'bottom') {
                tooltip.style.top = (rect.bottom + 15) + 'px';
                tooltip.style.transform = 'translate(-50%, 0)';
            }
        }
    }
}
// --- SLUT TUTORIAL LOGIC ---

// --- SCROLL PAUSE FEATURE ---
let isUserScrolling = false;
let scrollResumeTimeout = null;

function pauseAutoScroll() {
    isUserScrolling = true;
    clearTimeout(scrollResumeTimeout);
    
    scrollResumeTimeout = setTimeout(() => {
        isUserScrolling = false;
        if (gameState === 'GAME') {
            moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 2)));
        }
    }, 4000); 
}

els.pathGrid.addEventListener('touchstart', pauseAutoScroll, { passive: true });
els.pathGrid.addEventListener('wheel', pauseAutoScroll, { passive: true });
els.pathGrid.addEventListener('mousedown', pauseAutoScroll, { passive: true });

let sessionRaw = JSON.parse(localStorage.getItem('mouse_session'));
let lastTarget = null;
let savedGameBaseSteps = 0;
let savedGameDynamicFactor = 0;
let savedGameVirtualDistOffset = 0;
let savedLiveSessionId = null;
let savedIsLiveSharing = false;

if (sessionRaw && (Date.now() - sessionRaw.timestamp < 10800000)) {
    lastTarget = sessionRaw.target;
    travelMode = sessionRaw.travelMode || 0;
    waypointsDit = (sessionRaw.waypointsDit || []).map(p => L.latLng(p.lat, p.lng));
    waypointsHem = (sessionRaw.waypointsHem || []).map(p => L.latLng(p.lat, p.lng));
    if (sessionRaw.startCoords) { fixedStartCoords = sessionRaw.startCoords; }
    
    savedGameState = sessionRaw.gameState || 'MAP';
    savedInitialTotalKm = sessionRaw.initialTotalKm || 0;
    savedMaxStepsReached = sessionRaw.maxStepsReached || 0;
    savedLastRouteIndex = sessionRaw.lastRouteIndex || 0;
    savedMidpointStepIndex = sessionRaw.midpointStepIndex !== undefined ? sessionRaw.midpointStepIndex : -1;
    savedHasReachedMidpoint = sessionRaw.hasReachedMidpoint || false;
    savedGameStartCoords = sessionRaw.gameStartCoords || null;
    savedGameBaseSteps = sessionRaw.gameBaseSteps || 0;
    savedGameDynamicFactor = sessionRaw.gameDynamicFactor || 0;
    savedGameVirtualDistOffset = sessionRaw.gameVirtualDistOffset || 0;
    originalPois = sessionRaw.originalPois || [];
    historicalRouteCoords = sessionRaw.historicalRouteCoords || [];
    savedWayPointsIndices = sessionRaw.savedWayPointsIndices || [];
    savedLiveSessionId = sessionRaw.liveSessionId || null;
    savedIsLiveSharing = sessionRaw.isLiveSharing || false;

    els.welcomeOverlay.classList.add('hidden');
}

let audioCtx; let gameState = 'MAP'; let initialTotalKm = 0;

function checkInstallState() {
    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/.test(ua.toLowerCase());
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    const isInApp = /FBAN|FBAV|Instagram|Messenger/i.test(ua);

    if (isInApp) {
        if (els.distInfo) {
            els.distInfo.innerHTML = t('installWarning');
            els.distInfo.style.color = "#d32f2f"; 
        }
        return; 
    }

    if (isIos && !isStandalone) {
        setTimeout(() => {
            const iosPrompt = document.getElementById('ios-install-prompt');
            if (iosPrompt) iosPrompt.classList.remove('hidden');
        }, 3000); 
    }
}

// --- INITIALIZE MAP ---
function initMap() {
    applyThemeUI(); 
    checkInstallState();

    let shouldShowWelcome = true;
    const welcomeDataStr = localStorage.getItem('welcome_overlay_data');
    if (welcomeDataStr) {
        try {
            const welcomeData = JSON.parse(welcomeDataStr);
            const hoursSinceLastSeen = (Date.now() - welcomeData.timestamp) / (1000 * 60 * 60);

            if (welcomeData.dontShowAgain) {
                shouldShowWelcome = false;
            } else if (!welcomeData.dontShowAgain && hoursSinceLastSeen < 3) {
                shouldShowWelcome = false;
            }
        } catch(e) {}
    } else if (localStorage.getItem('tutorial_done') === 'true') {
        shouldShowWelcome = true; 
    }

    if (isFeatureOn('beta_mode')) {
        shouldShowWelcome = true;
    }

    if (!shouldShowWelcome) {
        els.welcomeOverlay.classList.add('hidden');
    } else {
        els.welcomeOverlay.classList.remove('hidden');
    }
	
	if (els.modeBtn) els.modeBtn.innerText = modes[travelMode].icon;
    
    if (!currentTargetCoords && !isLiveReceiver) { els.distInfo.innerHTML = getWhereToText(); }

    map = L.map('map', { zoomControl: false, attributionControl: false }).setView([59.3, 14.1], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const clearControl = L.control({position: 'bottomright'});
    clearControl.onAdd = function () {
        const btn = L.DomUtil.create('button', '');
        btn.id = 'clear-map-btn';
        btn.innerHTML = t('clear');
        btn.style.background = 'rgba(255, 255, 255, 0.6)';
        btn.style.border = '2px solid rgba(0,0,0,0.1)';
        btn.style.padding = '8px 12px'; btn.style.borderRadius = '10px'; btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold'; btn.style.color = '#333'; btn.style.backdropFilter = 'blur(4px)';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'; btn.style.marginBottom = '15px'; 
        btn.onclick = function(e) { if(isLiveReceiver) return; L.DomEvent.stopPropagation(e); clearMapData(); };
        L.DomEvent.disableClickPropagation(btn); 
        return btn;
    };
    clearControl.addTo(map);

    const helpControl = L.control({position: 'bottomleft'});
    helpControl.onAdd = function () {
        const btn = L.DomUtil.create('button', '');
        btn.id = 'help-map-btn';
        btn.innerHTML = '❓';
        btn.style.background = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '50%';
        btn.style.width = '45px';
        btn.style.height = '45px';
        btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        btn.style.fontSize = '1.2rem';
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.marginBottom = '15px';
        btn.style.marginLeft = '10px'; 
        btn.onclick = function(e) { L.DomEvent.stopPropagation(e); startTutorial(); };
        L.DomEvent.disableClickPropagation(btn); 
        return btn;
    };
    helpControl.addTo(map);

    if (sessionRaw && sessionRaw.hasManualStart && fixedStartCoords) {
        manualStartMarker = L.circleMarker(fixedStartCoords, { radius: 8, fillColor: "#4CAF50", color: "#fff", weight: 2, fillOpacity: 1 }).addTo(map);
        manualStartMarker.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeManualStartPoint(); });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const liveId = urlParams.get('live');
    if (liveId) {
        isLiveReceiver = true; liveSessionId = liveId;
        els.welcomeOverlay.classList.add('hidden'); els.actionContainer.classList.add('hidden');
        const cancelBtn = document.getElementById('cancel-game-btn'); if (cancelBtn) cancelBtn.classList.add('hidden');
        els.distInfo.innerHTML = t('liveConnecting');

        pusher = new Pusher(pusherKey, getPusherConfig());
        liveChannel = pusher.subscribe(`private-live-${liveSessionId}`);
        liveChannel.bind('pusher:subscription_succeeded', () => { els.distInfo.innerHTML = t('liveWaiting', {name: getThemeName()}); });
        liveChannel.bind('client-update', handleLiveUpdate);
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        const routeData = urlParams.get('r');
        if (routeData) {
            try {
                const data = JSON.parse(atob(routeData));
                travelMode = data.m || 0; currentTargetName = data.n || "Mål";
                currentTargetCoords = L.latLng(data.t[0], data.t[1]);
                waypointsDit = (data.wd || []).map(p => L.latLng(p[0], p[1]));
                waypointsHem = (data.wh || []).map(p => L.latLng(p[0], p[1]));
                if (data.s) {
                    fixedStartCoords = data.s;
                    manualStartMarker = L.circleMarker(data.s, { radius: 8, fillColor: "#4CAF50", color: "#fff", weight: 2, fillOpacity: 1 }).addTo(map);
                    manualStartMarker.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeManualStartPoint(); });
                }
                window.history.replaceState({}, document.title, window.location.pathname);
                els.welcomeOverlay.classList.add('hidden');
            } catch (e) { console.error("Error", e); }
        }

        if (currentTargetCoords) {
            setTarget(currentTargetCoords, false, false, false); map.setView(currentTargetCoords, 14); 
            initialZoomPerformed = true; setupSavedWaypoints();
        } else if (lastTarget) {
            currentTargetName = lastTarget.name || "Mål";
            setTarget(lastTarget.coords, false, false, false); map.setView(lastTarget.coords, 14); 
            initialZoomPerformed = true; setupSavedWaypoints();
        }

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(handlePositionUpdate, null, { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 });
        }
    }

    if (!isLiveReceiver && savedIsLiveSharing && savedLiveSessionId) {
        liveSessionId = savedLiveSessionId;
        resumeLiveSharing();
    }

    map.on('click', async e => { 
        if (isLiveReceiver || gameState !== 'MAP' || ignoreClick) return; 
        playClickSound(); 
        
        currentTargetName = t('addressSearch'); 
        setTarget(e.latlng, true, true, true);

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
            const d = await res.json();
            if (d && d.display_name) {
                if (d.address && d.address.country_code) updateVoiceLangFromCountry(d.address.country_code); 
                let parts = d.display_name.split(','); let firstPart = parts[0].trim();
                if (!isNaN(firstPart)) { currentTargetName = (d.address && d.address.road) ? (d.address.road + ' ' + firstPart) : firstPart; } 
                else { currentTargetName = (d.address && d.address.road && firstPart === d.address.road) ? (d.address.road + (d.address.house_number ? ' ' + d.address.house_number : '')) : firstPart; }
                updateMapLogic(); updateLocateBtnText(); saveSession();
            }
        } catch (err) { currentTargetName = t('markedLocation'); updateMapLogic(); }
    });

    map.on('contextmenu', e => {
        if (isLiveReceiver || gameState !== 'MAP') return;
        ignoreClick = true; setTimeout(() => { ignoreClick = false; }, 600);
        playClickSound(); showMapContextMenu(e);
    });

    map.on('movestart', (e) => { if (!e.hard) isTracking = false; });
    
    if (!isLiveReceiver) { setupInteractions(); }
    updateButtonUI(); handleOrientationLayout(); 
    window.addEventListener('resize', () => {
        handleOrientationLayout();
        if (!document.getElementById('tutorial-overlay').classList.contains('hidden')) {
            showTutorialStep(currentTutorialStep);
        }
    });
}

function showMapContextMenu(e) {
    const oldMenu = document.getElementById('waypoint-menu'); if (oldMenu) oldMenu.remove();
    const menu = document.createElement('div'); menu.id = 'waypoint-menu';
    menu.style.left = Math.min(window.innerWidth - 180, Math.max(10, e.containerPoint.x)) + "px";
    menu.style.top = Math.min(window.innerHeight - 180, Math.max(10, e.containerPoint.y)) + "px";

    const btnStart = document.createElement('button'); btnStart.className = 'wp-menu-btn'; btnStart.style.background = '#4CAF50'; btnStart.innerText = t('setStartPoint');
    btnStart.onclick = () => { setManualStartPoint(e.latlng); menu.remove(); }; menu.appendChild(btnStart);

    if (currentTargetCoords) {
        if (travelMode === 2) {
            const btnDit = document.createElement('button'); btnDit.className = 'wp-menu-btn'; btnDit.style.background = 'var(--blue)'; btnDit.innerText = t('waypointDit');
            btnDit.onclick = () => { addWaypoint(e.latlng, 'dit'); menu.remove(); }; menu.appendChild(btnDit);

            const btnHem = document.createElement('button'); btnHem.className = 'wp-menu-btn'; btnHem.style.background = 'var(--orange)'; btnHem.innerText = t('waypointHem');
            btnHem.onclick = () => { addWaypoint(e.latlng, 'hem'); menu.remove(); }; menu.appendChild(btnHem);
        } else {
            const btnWp = document.createElement('button'); btnWp.className = 'wp-menu-btn'; btnWp.style.background = 'var(--blue)'; btnWp.innerText = t('addWaypoint');
            btnWp.onclick = () => { addWaypoint(e.latlng, 'dit'); menu.remove(); }; menu.appendChild(btnWp);
        }
    }

    const btnCancel = document.createElement('button'); btnCancel.innerText = t('btnCancel'); btnCancel.style.fontSize = '0.7rem'; btnCancel.style.background = 'none';
    btnCancel.onclick = () => menu.remove(); menu.appendChild(btnCancel);

    document.body.appendChild(menu);
    setTimeout(() => { const close = () => { menu.remove(); document.removeEventListener('click', close); }; document.addEventListener('click', close); }, 100);
}

function setManualStartPoint(latlng) {
    fixedStartCoords = [latlng.lat, latlng.lng];
    if (!manualStartMarker) { manualStartMarker = L.circleMarker(latlng, { radius: 8, fillColor: "#4CAF50", color: "#fff", weight: 2, fillOpacity: 1 }).addTo(map); manualStartMarker.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeManualStartPoint(); }); } 
    else { manualStartMarker.setLatLng(latlng); }
    if (currentTargetCoords) updateMapLogic(); saveSession(); broadcastLiveState();
}

function removeManualStartPoint() {
    if (manualStartMarker) { map.removeLayer(manualStartMarker); manualStartMarker = null; }
    if (userCoords) fixedStartCoords = [...userCoords]; else fixedStartCoords = null;
    if (currentTargetCoords) updateMapLogic(); saveSession(); broadcastLiveState();
}

function setupSavedWaypoints() {
    waypointsDit.forEach(wp => { const m = L.circleMarker(wp, { radius: 7, fillColor: "#2196F3", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map); m.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(m, wp); }); waypointMarkers.push(m); });
    waypointsHem.forEach(wp => { const m = L.circleMarker(wp, { radius: 7, fillColor: "#FF9800", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map); m.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(m, wp); }); waypointMarkers.push(m); });
    if (els.modeBtn) els.modeBtn.innerText = modes[travelMode].icon;
    updateMapLogic();
}

function broadcastLiveState() {
    if (!isLiveSharing || !liveSessionId || !liveChannel) return;
    const distDisplay = document.getElementById('game-distance-display');
    liveChannel.trigger('client-update', {
        userCoords: userCoords, startCoords: fixedStartCoords, 
        targetCoords: currentTargetCoords ? {lat: currentTargetCoords.lat, lng: currentTargetCoords.lng} : null,
        targetName: currentTargetName, travelMode: travelMode,
        waypointsDit: waypointsDit.map(w => ({lat: w.lat, lng: w.lng})), waypointsHem: waypointsHem.map(w => ({lat: w.lat, lng: w.lng})),
        gameState: gameState, initialTotalKm: initialTotalKm, midpointStepIndex: midpointStepIndex, maxStepsReached: maxStepsReached,
        lastRouteIndex: lastRouteIndex, distRemainingStr: distDisplay ? distDisplay.innerText : "",
        lastReRouteTime: lastReRouteTime,
        originalPois: originalPois
    });
}

function handleLiveUpdate(parsed) {
    if (!parsed) return;
    if (parsed.initialTotalKm) initialTotalKm = parsed.initialTotalKm;
    if (parsed.midpointStepIndex !== undefined) midpointStepIndex = parsed.midpointStepIndex;
    if (parsed.startCoords) fixedStartCoords = parsed.startCoords; 

    if (parsed.userCoords) {
        if (lastUserCoordsForHeading) { const dist = L.latLng(lastUserCoordsForHeading).distanceTo(parsed.userCoords); if (dist > 2) { currentHeading = getBearing(lastUserCoordsForHeading[0], lastUserCoordsForHeading[1], parsed.userCoords[0], parsed.userCoords[1]); } }
        if (!lastUserCoordsForHeading || L.latLng(lastUserCoordsForHeading).distanceTo(parsed.userCoords) > 2) { lastUserCoordsForHeading = [...parsed.userCoords]; }
        userCoords = parsed.userCoords;
        if (!userMarker) { userMarker = L.circleMarker(userCoords, {radius: 8, fillColor: "#007bff", color: "#fff", weight: 2, fillOpacity: 0.8}).addTo(map); } else userMarker.setLatLng(userCoords);
        if (gameState === 'MAP') { map.panTo(userCoords); if (!initialZoomPerformed) { map.flyTo(userCoords, 18); initialZoomPerformed = true; } }
    }

    if (parsed.targetCoords && (!currentTargetCoords || currentTargetCoords.lat !== parsed.targetCoords.lat || currentTargetCoords.lng !== parsed.targetCoords.lng)) {
        currentTargetName = parsed.targetName; travelMode = parsed.travelMode;
        waypointsDit = parsed.waypointsDit.map(w => L.latLng(w.lat, w.lng)); waypointsHem = parsed.waypointsHem.map(w => L.latLng(w.lat, w.lng));
        setTarget(L.latLng(parsed.targetCoords.lat, parsed.targetCoords.lng), false, true, false);
        els.distInfo.innerHTML = t('liveFollowing', {target: currentTargetName});
    } 
    else if (gameState === 'MAP' && !connectionLine && currentTargetCoords && userCoords) { updateMapLogic(); }

    if (parsed.lastReRouteTime && parsed.lastReRouteTime !== lastReRouteTime) {
        lastReRouteTime = parsed.lastReRouteTime;
        originalPois = parsed.originalPois || [];
        if (currentTargetCoords) {
            updateMapLogic();
        }
    }

    if (parsed.gameState === 'GAME' && gameState !== 'GAME') { startGame(); } 
    else if (parsed.gameState === 'FINISHED' && gameState !== 'FINISHED') { finishGame(); } 
    else if (parsed.gameState === 'MAP' && (gameState === 'GAME' || gameState === 'FINISHED')) { stopGame(); }

    if (gameState === 'GAME' && parsed.maxStepsReached !== undefined) {
        maxStepsReached = parsed.maxStepsReached; if (parsed.lastRouteIndex !== undefined) lastRouteIndex = parsed.lastRouteIndex;
        for (let i = 0; i < initialTotalKm - 1; i++) { const s = document.getElementById(`step-${i}`); if (s) i < maxStepsReached ? s.classList.add('eat-animation') : s.classList.remove('eat-animation'); }
        moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 1)));
        const distDisplay = document.getElementById('game-distance-display'); if (distDisplay && parsed.distRemainingStr) { distDisplay.innerText = parsed.distRemainingStr; }
        if (isGameMapVisible) { updateGameMapView(false); }
    }
}

function clearMapData() {
    playClickSound(); currentTargetCoords = null; currentTargetName = "MÅLET";
    if (targetMarker) { map.removeLayer(targetMarker); targetMarker = null; }
    if (connectionLine) { map.removeLayer(connectionLine); connectionLine = null; }
    if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
    waypointsDit = []; waypointsHem = []; waypointMarkers.forEach(m => map.removeLayer(m)); waypointMarkers = [];
    if (manualStartMarker) { map.removeLayer(manualStartMarker); manualStartMarker = null; } fixedStartCoords = null;
    originalPois = []; savedWayPointsIndices = []; historicalRouteCoords = [];
    els.distInfo.innerHTML = getWhereToText(); els.startBtn.classList.add('hidden');
    if (userCoords) { zoomToUser(); isShowingUser = false; isTracking = true; }
    updateLocateBtnText(); saveSession(); broadcastLiveState();
}

function toggleGameZoom() {
    if (!gameMapAutoCenter) {
        gameMapAutoCenter = true;
        isGameMapZoomedOut = false;
    } else {
        isGameMapZoomedOut = !isGameMapZoomedOut;
    }
    
    const zoomBtn = document.getElementById('zoom-toggle-btn');
    if (zoomBtn) {
        zoomBtn.innerText = isGameMapZoomedOut ? t('btnZoomIn') : t('btnZoomOut');
    }
    updateGameMapView(true);
}

function toggleGameMap() {
    isGameMapVisible = !isGameMapVisible; 
    const toggleBtn = document.getElementById('toggle-game-view-btn');
    const zoomBtn = document.getElementById('zoom-toggle-btn');

    if (isGameMapVisible) {
        els.pathGrid.classList.add('hidden'); 
        els.gameMapWrapper.classList.remove('hidden'); 
        if (toggleBtn) toggleBtn.innerText = `${activeTheme.path} ${getThemePathName()}`;
        
        if (zoomBtn) {
            zoomBtn.classList.remove('hidden');
            zoomBtn.innerText = isGameMapZoomedOut ? t('btnZoomIn') : t('btnZoomOut');
        }
        
        if (!gameMap) { 
            gameMap = L.map('game-map', { 
                zoomControl: false, 
                attributionControl: false, 
                dragging: true, 
                touchZoom: true, 
                scrollWheelZoom: true, 
                doubleClickZoom: false,
                rotate: true,
				touchRotate: true,
                bearing: 0
            }).setView(userCoords || [59.3, 14.1], 15); 
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(gameMap); 
            
            gameMap.on('dragstart', () => { 
                gameMapAutoCenter = false; 
                isGameMapZoomedOut = false; 
                
                if (zoomBtn) zoomBtn.innerText = t('btnCenter');
            });
            
            gameMap.on('zoomstart', () => {
                if (!isProgrammaticMove) {
                    gameMapAutoCenter = false;
                    isGameMapZoomedOut = false;
                    if (zoomBtn) zoomBtn.innerText = t('btnCenter');
                }
            });
        }
        
        gameMapAutoCenter = true; 
        isGameMapZoomedOut = false;
        if (zoomBtn) zoomBtn.innerText = t('btnZoomOut');
        
        setTimeout(() => { gameMap.invalidateSize(true); updateGameMapView(true); }, 250);
    } else { 
        els.gameMapWrapper.classList.add('hidden'); 
        els.pathGrid.classList.remove('hidden'); 
        if (toggleBtn) toggleBtn.innerText = t('btnMap');
        if (zoomBtn) zoomBtn.classList.add('hidden');
    }
}

function updateGameMapView(forceCenter = false) {
    if (!isGameMapVisible || gameState !== 'GAME' || !gameMap || !userCoords) return;
    
    const fullVisualRoute = (typeof historicalRouteCoords !== 'undefined' && historicalRouteCoords.length > 0)
        ? [...historicalRouteCoords, ...currentRouteCoords]
        : currentRouteCoords;

    if (!gameRouteLine && fullVisualRoute.length > 0) { 
        gameRouteLine = L.polyline(fullVisualRoute, {color: '#007bff', weight: 4, opacity: 0.5}).addTo(gameMap); 
    } else if (gameRouteLine) { 
        gameRouteLine.setLatLngs(fullVisualRoute); 
    }
    
    if (!gameUserMarker) { 
        gameUserMarker = L.circleMarker(userCoords, {radius: 7, fillColor: "#007bff", color: "#fff", weight: 2, fillOpacity: 1}).addTo(gameMap); 
    } else { 
        gameUserMarker.setLatLng(userCoords); 
    }
    
    isProgrammaticMove = true; 
    
    if (isGameMapZoomedOut) {
        if (fullVisualRoute && fullVisualRoute.length > 0) {
            const bounds = L.latLngBounds(fullVisualRoute);
            bounds.extend(userCoords);
            gameMap.fitBounds(bounds, { padding: [40, 140] });
        }
        
        if (gameMap.setBearing) gameMap.setBearing(0);
    } else if (gameMapAutoCenter || forceCenter) {
        let targetZoom = forceCenter ? 16 : (gameMap.getZoom() || 16);
        gameMap.setView(userCoords, targetZoom);
        
        if (currentHeading !== null) { 
            let currentRot = renderedHeading % 360; 
            if (currentRot < 0) currentRot += 360; 
            let diff = currentHeading - currentRot; 
            if (diff > 180) diff -= 360; 
            if (diff < -180) diff += 360; 
            renderedHeading += diff; 
            
            if (gameMap.setBearing) gameMap.setBearing(360 - renderedHeading);
        }
    }
    
    setTimeout(() => { isProgrammaticMove = false; }, 100);
}

function saveSession() {
    if (isLiveReceiver) return;
    const sessionData = { 
        target: currentTargetCoords ? { coords: {lat: currentTargetCoords.lat, lng: currentTargetCoords.lng}, name: currentTargetName } : null, 
        startCoords: fixedStartCoords, 
        hasManualStart: !!manualStartMarker, 
        travelMode: travelMode, 
        waypointsDit: waypointsDit.map(wp => ({lat: wp.lat, lng: wp.lng})), 
        waypointsHem: waypointsHem.map(wp => ({lat: wp.lat, lng: wp.lng})), 
        timestamp: Date.now(), 
        gameState: gameState,
        initialTotalKm: initialTotalKm,
        maxStepsReached: maxStepsReached,
        lastRouteIndex: lastRouteIndex,
        midpointStepIndex: midpointStepIndex,
        hasReachedMidpoint: hasReachedMidpoint,
        gameStartCoords: (gameState === 'GAME' || gameState === 'FINISHED') ? startCoords : null,
        gameBaseSteps: gameBaseSteps,
        gameDynamicFactor: gameDynamicFactor,
        gameVirtualDistOffset: gameVirtualDistOffset,
        historicalRouteCoords: historicalRouteCoords,
        originalPois: originalPois,
        savedWayPointsIndices: savedWayPointsIndices,
        liveSessionId: liveSessionId,
        isLiveSharing: isLiveSharing
    };
    localStorage.setItem('mouse_session', JSON.stringify(sessionData));
}

function removeWaypoint(marker, latlng) {
    if (isLiveReceiver) return; playClickSound();
    let index = waypointsDit.findIndex(wp => wp.lat === latlng.lat && wp.lng === latlng.lng);
    if (index !== -1) { waypointsDit.splice(index, 1); } 
    else { index = waypointsHem.findIndex(wp => wp.lat === latlng.lat && wp.lng === latlng.lng); if (index !== -1) waypointsHem.splice(index, 1); }
    map.removeLayer(marker); waypointMarkers = waypointMarkers.filter(m => m !== marker);
    updateMapLogic(); saveSession(); broadcastLiveState();
}

function addWaypoint(latlng, direction) {
    if (!fixedStartCoords && userCoords) fixedStartCoords = [...userCoords];
    if (direction === 'dit') { waypointsDit.push(latlng); } else { waypointsHem.push(latlng); }
    const color = direction === 'dit' ? "#2196F3" : "#FF9800";
    const wpMarker = L.circleMarker(latlng, { radius: 7, fillColor: color, color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map);
    wpMarker.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(wpMarker, latlng); });
    waypointMarkers.push(wpMarker); updateMapLogic(); saveSession(); broadcastLiveState();
}

function checkRestoreGame() {
    if (savedGameState === 'GAME' && !isLiveReceiver) {
        savedGameState = 'MAP';
        setTimeout(() => {
            startGame(true, {
                initialTotalKm: savedInitialTotalKm,
                maxStepsReached: savedMaxStepsReached,
                lastRouteIndex: savedLastRouteIndex,
                midpointStepIndex: savedMidpointStepIndex,
                hasReachedMidpoint: savedHasReachedMidpoint,
                gameStartCoords: savedGameStartCoords,
                gameBaseSteps: savedGameBaseSteps,
                gameDynamicFactor: savedGameDynamicFactor,
                gameVirtualDistOffset: savedGameVirtualDistOffset
            });
        }, 500);
    }
}

function handlePositionUpdate(pos) {
    if (isLiveReceiver) return; userCoords = [pos.coords.latitude, pos.coords.longitude];
    
    if (typeof window.handleARPositionUpdate === 'function') {
        window.handleARPositionUpdate();
    }

    if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) { currentHeading = pos.coords.heading; } 
    else if (lastUserCoordsForHeading) { const dist = L.latLng(lastUserCoordsForHeading).distanceTo(userCoords); if (dist > 2) { currentHeading = getBearing(lastUserCoordsForHeading[0], lastUserCoordsForHeading[1], userCoords[0], userCoords[1]); } }
    if (!lastUserCoordsForHeading || L.latLng(lastUserCoordsForHeading).distanceTo(userCoords) > 2) { lastUserCoordsForHeading = [...userCoords]; }
    if (!currentTargetCoords && !isLiveReceiver) els.distInfo.innerHTML = getWhereToText();
    
    if (!userMarker) { 
        userMarker = L.circleMarker(userCoords, {radius: 8, fillColor: "#007bff", color: "#fff", weight: 2, fillOpacity: 0.8}).addTo(map); 
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userCoords[0]}&lon=${userCoords[1]}`)
            .then(r => r.json())
            .then(d => { if (d && d.address && d.address.country_code) updateVoiceLangFromCountry(d.address.country_code); })
            .catch(() => {});
    } else { 
        userMarker.setLatLng(userCoords); 
    }
    
    if (isTracking && gameState === 'MAP') map.panTo(userCoords);
    if (!initialZoomPerformed) { zoomToUser(true); initialZoomPerformed = true; isTracking = true; }
    if (gameState === 'MAP') { if (!fixedStartCoords) updateMapLogic(); } else if (gameState === 'GAME') updateGameLogic();
}

let isFetchingRoute = false; 

async function updateMapLogic() {
    if ((!userCoords && !fixedStartCoords) || !currentTargetCoords) return;
    
    if (isFetchingRoute) return;
    isFetchingRoute = true;
    
    let coordArray = []; 
    const mode = modes[travelMode];

    if ((savedGameState === 'GAME' || (isLiveReceiver && gameState === 'GAME')) && originalPois && originalPois.length > 0) {
        coordArray = originalPois.map(c => [c[1], c[0]]); 
    } else {
        const startPoint = fixedStartCoords || userCoords; 
        const startLatLng = L.latLng(startPoint[0], startPoint[1]);
        
        if (waypointsDit.length > 1) {
            waypointsDit.sort((a, b) => startLatLng.distanceTo(a) - startLatLng.distanceTo(b));
        }
        if (travelMode === 2 && waypointsHem.length > 1) {
            waypointsHem.sort((a, b) => currentTargetCoords.distanceTo(a) - currentTargetCoords.distanceTo(b));
        }

        coordArray.push([startPoint[1], startPoint[0]]);
        waypointsDit.forEach(wp => coordArray.push([wp.lng, wp.lat])); 
        coordArray.push([currentTargetCoords.lng, currentTargetCoords.lat]);
        
        if (travelMode === 2) { 
            waypointsHem.forEach(wp => coordArray.push([wp.lng, wp.lat])); 
            coordArray.push([startPoint[1], startPoint[0]]); 
        }
        originalPois = coordArray.map(c => [c[1], c[0]]);
    }

    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgxOTdlMWQxYzhmODQ2NGY4NjM0OWYzNDI2NzM3OWM5IiwiaCI6Im11cm11cjY0In0=";
    const url = `https://api.openrouteservice.org/v2/directions/${mode.profile}/geojson`;
    
    try {
        const res = await fetch(url, { 
            method: 'POST', 
            headers: { 'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8', 'Content-Type': 'application/json', 'Authorization': apiKey }, 
            body: JSON.stringify({ coordinates: coordArray, elevation: false, instructions: false, preference: 'recommended' }) 
        });
        
        if (!res.ok) throw new Error("ORS Rate Limit eller fel: " + res.status);
        
        const data = await res.json();
        
        if (data.features && data.features.length > 0) {
            const route = data.features[0]; currentRouteCoords = route.geometry.coordinates.map(c => [c[1], c[0]]); 
            savedWayPointsIndices = route.properties.way_points || []; 

            let splitIndex = currentRouteCoords.length;
            if (travelMode === 2) { let minD = Infinity; currentRouteCoords.forEach((c, i) => { const d = L.latLng(c).distanceTo(currentTargetCoords); if (d < minD) { minD = d; splitIndex = i; } }); }
            const coordsDit = currentRouteCoords.slice(0, splitIndex + 1); const coordsRetur = currentRouteCoords.slice(splitIndex);
            
            if (connectionLine) connectionLine.setLatLngs(coordsDit); else connectionLine = L.polyline(coordsDit, {color: '#007bff', weight: 4, opacity: 0.7}).addTo(map);
            if (travelMode === 2) { if (connectionLineReturn) connectionLineReturn.setLatLngs(coordsRetur); else connectionLineReturn = L.polyline(coordsRetur, {color: '#FF9800', weight: 4, opacity: 0.7}).addTo(map); } else if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
            
            if (gameRouteLine) { gameRouteLine.setLatLngs(currentRouteCoords); }

            const distKm = route.properties.summary.distance / 1000;
            if (!isLiveReceiver) {
                if (travelMode === 2) { els.distInfo.innerHTML = t('kmToAndBack', {dist: distKm.toFixed(2), target: currentTargetName}); } 
                else { els.distInfo.innerHTML = t('kmTo', {dist: distKm.toFixed(2), target: currentTargetName}); }
                els.startBtn.classList.remove('hidden');
            }
            checkRestoreGame();
        } else { 
            throw new Error("Inga rutter hittades i OpenRouteService"); 
        }
    } catch (e) { 
        console.warn("Huvud-API misslyckades. Testar reserv-API (OSRM)...", e);
        
        try {
            const coordString = coordArray.map(c => `${c[0]},${c[1]}`).join(';');
            const osrmUrl = `https://router.project-osrm.org/route/v1/${mode.osrmProfile}/${coordString}?overview=full&geometries=geojson`;
            
            const osrmRes = await fetch(osrmUrl);
            if (!osrmRes.ok) throw new Error("OSRM API fel");
            
            const osrmData = await osrmRes.json();
            if (osrmData.routes && osrmData.routes.length > 0) {
                const route = osrmData.routes[0];
                currentRouteCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
                savedWayPointsIndices = []; 
                
                if (connectionLine) connectionLine.setLatLngs(currentRouteCoords);
                else connectionLine = L.polyline(currentRouteCoords, {color: '#007bff', weight: 4, opacity: 0.7}).addTo(map);
                
                if (gameRouteLine) { gameRouteLine.setLatLngs(currentRouteCoords); }

                const distKm = route.distance / 1000;
                if (!isLiveReceiver) {
                    if (travelMode === 2) { els.distInfo.innerHTML = t('kmToAndBack', {dist: distKm.toFixed(2), target: currentTargetName}); } 
                    else { els.distInfo.innerHTML = t('kmTo', {dist: distKm.toFixed(2), target: currentTargetName}); }
                    els.startBtn.classList.remove('hidden');
                }
                checkRestoreGame();
            } else {
                fallbackDist(); 
            }
        } catch (err2) {
            console.error("Båda rutt-tjänsterna misslyckades", err2);
            fallbackDist(); 
        }
    } finally {
        isFetchingRoute = false; 
    }
}

function fallbackDist() {
    if (!fixedStartCoords && !userCoords) return;
    const startPoint = fixedStartCoords || userCoords; const d = map.distance(startPoint, currentTargetCoords) / 1000; const total = d * (travelMode === 2 ? 2 : 1);
    const coordsDit = [[startPoint[0], startPoint[1]], [currentTargetCoords.lat, currentTargetCoords.lng]];
    if (connectionLine) connectionLine.setLatLngs(coordsDit); else connectionLine = L.polyline(coordsDit, {color: '#007bff', weight: 4, opacity: 0.7}).addTo(map);
    if (travelMode === 2) { const coordsRetur = [[currentTargetCoords.lat, currentTargetCoords.lng], [startPoint[0], startPoint[1]]]; if (connectionLineReturn) connectionLineReturn.setLatLngs(coordsRetur); else connectionLineReturn = L.polyline(coordsRetur, {color: '#FF9800', weight: 4, opacity: 0.7}).addTo(map); } else if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
    if (!isLiveReceiver) {
        if (travelMode === 2) { els.distInfo.innerHTML = t('kmBirdAndBack', {dist: total.toFixed(2)}); } 
        else { els.distInfo.innerHTML = t('kmBird', {dist: total.toFixed(2)}); }
        els.startBtn.classList.remove('hidden');
    }
    checkRestoreGame();
}

function setTarget(latlng, shouldSave, clearWaypoints = true, updateStart = true) {
    if (updateStart && !manualStartMarker) { if (userCoords) fixedStartCoords = [...userCoords]; else fixedStartCoords = null; }
    if (clearWaypoints) { waypointsDit = []; waypointsHem = []; waypointMarkers.forEach(m => map.removeLayer(m)); waypointMarkers = []; originalPois = []; savedWayPointsIndices = []; historicalRouteCoords = []; }
    if (connectionLine) { map.removeLayer(connectionLine); connectionLine = null; }
    if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
    currentTargetCoords = latlng;
    if (targetMarker) targetMarker.setLatLng(latlng); else targetMarker = L.marker(latlng).addTo(map);
    if (shouldSave) saveSession(); updateMapLogic(); if (!isLiveReceiver) updateLocateBtnText(); broadcastLiveState();
}

function zoomToUser(instant = false) { if (userCoords) { if (instant) map.setView(userCoords, 18); else map.flyTo(userCoords, 18); } }
function toggleView() { if (!currentTargetCoords || isShowingUser) { zoomToUser(); isShowingUser = false; isTracking = true; } else { map.flyTo(currentTargetCoords, 18); isShowingUser = true; isTracking = false; } updateLocateBtnText(); }
function updateLocateBtnText() { els.locateBtn.innerHTML = (!currentTargetCoords || isShowingUser) ? t('locateMe') : `🏁 ${currentTargetName.toUpperCase()}`; }
function toggleTravelMode() { travelMode = (travelMode + 1) % modes.length; els.modeBtn.innerText = modes[travelMode].icon; if (!currentTargetCoords && !isLiveReceiver) els.distInfo.innerHTML = getWhereToText(); updateMapLogic(); saveSession(); broadcastLiveState(); }
async function requestWakeLock() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {} }
function releaseWakeLock() { if (wakeLock !== null) wakeLock.release().then(() => { wakeLock = null; }); }

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && gameState === 'GAME') {
        requestWakeLock();
    }
});

function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert(t('voiceNotSupported')); return; }
    const recognition = new SpeechRecognition(); 
    recognition.lang = dynamicVoiceLang; 
    
    recognition.onstart = () => { els.voiceBtn.classList.add('listening'); els.voiceBtn.innerText = t('voiceListening'); };
    recognition.onresult = (event) => { 
        const result = event.results[0][0]; const transcript = result.transcript; const confidence = result.confidence;
        els.searchInput.value = transcript; els.searchContainer.classList.remove('hidden'); 
        if (confidence > 0.75) { executeTextSearch(); } else { els.searchInput.focus(); els.voiceBtn.innerText = t('didIHearRight'); setTimeout(() => { if (!els.voiceBtn.classList.contains('listening')) { els.voiceBtn.innerText = t('voiceSearch'); } }, 3000); }
    };
    recognition.onerror = (event) => {
        els.voiceBtn.classList.remove('listening'); 
        if (event.error === 'not-allowed') { alert(t('micDenied')); els.voiceBtn.innerText = t('voiceSearch'); } 
        else if (event.error === 'no-speech') { alert(t('heardNothing', {player: activeTheme.player})); els.voiceBtn.innerText = t('voiceSearch'); } 
        else { els.voiceBtn.innerText = t('voiceError'); setTimeout(() => { els.voiceBtn.innerText = t('voiceSearch'); }, 2000); }
    };
    recognition.onnomatch = () => { alert(t('voiceNoMatch', {target: activeTheme.target})); els.voiceBtn.classList.remove('listening'); els.voiceBtn.innerText = t('voiceSearch'); };
    recognition.onend = () => { els.voiceBtn.classList.remove('listening'); if (els.voiceBtn.innerText === t('voiceListening')) { els.voiceBtn.innerText = t('voiceSearch'); } };
    recognition.start();
}

function updateBetaDistances() {
    if (!isFeatureOn('beta_mode') || gameState !== 'GAME') return;

    let f = modes[travelMode].factor;
    let rMeters = 0;
    let hasRemainder = false;

    if (gameDynamicFactor === 0) {
        const distStr = els.distInfo.innerText.split(' ')[0].replace('<b>', '').replace('</b>', '');
        const totalDistanceKm = parseFloat(distStr) || 1;
        const r = totalDistanceKm % f;
        
        if (r > 0.05) {
            hasRemainder = true;
            rMeters = Math.round(r * 1000);
        }
    }

    for (let i = 0; i < initialTotalKm - 1; i++) {
        const label = document.getElementById(`beta-dist-${i}`);
        if (!label) continue;

        let currentDistMeters = 0;
        if (gameDynamicFactor > 0) {
            currentDistMeters = Math.round(gameDynamicFactor);
        } else {
            if (hasRemainder && i === 0) {
                currentDistMeters = rMeters;
            } else {
                currentDistMeters = Math.round(f * 1000);
            }
        }

        let text = currentDistMeters >= 1000 ? (currentDistMeters / 1000).toFixed(1) + 'km' : currentDistMeters + 'm';
        label.innerText = `➔ ${text}`;
    }
}

function startGame(isRestoring = false, restoreData = null) {
    if (!currentTargetCoords) return;
    if (!isLiveReceiver && !userCoords && !fixedStartCoords) return; 
    gameState = 'GAME'; 

    if (isRestoring && restoreData) {
        if (!isLiveReceiver) startCoords = restoreData.gameStartCoords || (fixedStartCoords ? [...fixedStartCoords] : [...(userCoords || [0,0])]);
        maxStepsReached = restoreData.maxStepsReached;
        lastRouteIndex = restoreData.lastRouteIndex;
        hasReachedMidpoint = restoreData.hasReachedMidpoint;
        midpointStepIndex = restoreData.midpointStepIndex;
        initialTotalKm = restoreData.initialTotalKm;
        gameBaseSteps = restoreData.gameBaseSteps || 0;
        gameDynamicFactor = restoreData.gameDynamicFactor || 0;
        gameVirtualDistOffset = restoreData.gameVirtualDistOffset || 0;
        isCelebratingTurn = false;
    } else {
        if (!isLiveReceiver) startCoords = fixedStartCoords ? [...fixedStartCoords] : [...(userCoords || [0,0])];
        maxStepsReached = 0; lastRouteIndex = 0; hasReachedMidpoint = false; midpointStepIndex = -1; isCelebratingTurn = false;
        gameBaseSteps = 0; gameDynamicFactor = 0; gameVirtualDistOffset = 0;
        if (!isLiveReceiver) { const distStr = els.distInfo.innerText.split(' ')[0].replace('<b>', '').replace('</b>', ''); const totalDistanceKm = parseFloat(distStr) || 1; const f = modes[travelMode].factor; const r = totalDistanceKm % f; initialTotalKm = Math.max(1, Math.floor(totalDistanceKm / f) + (r > 0.05 ? 2 : 1)); }
    }

    isGameMapVisible = false; els.gameMapWrapper.classList.add('hidden'); const distDisplay = document.getElementById('game-distance-display'); if (distDisplay) distDisplay.classList.remove('hidden');
    els.pathGrid.classList.remove('hidden');
    els.mapPage.classList.add('hidden'); els.gamePage.classList.remove('hidden');
    requestWakeLock(); els.pathGrid.innerHTML = `<div id="the-mouse">${activeTheme.player}</div>`;

    const toggleBtn = document.getElementById('toggle-game-view-btn');
    if (toggleBtn) toggleBtn.innerText = t('btnMap');

    const zoomBtn = document.getElementById('zoom-toggle-btn');
    if (zoomBtn) zoomBtn.classList.add('hidden');

    if (!isRestoring && !isLiveReceiver && travelMode === 2 && currentRouteCoords.length > 0) { let distToTarget = 0; let splitIndex = 0; let minD = Infinity; currentRouteCoords.forEach((c, i) => { const d = L.latLng(c).distanceTo(currentTargetCoords); if (d < minD) { minD = d; splitIndex = i; } }); for (let i = 0; i < splitIndex; i++) { distToTarget += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]); } const distStr = els.distInfo.innerText.split(' ')[0].replace('<b>', '').replace('</b>', ''); const totalDistanceKm = parseFloat(distStr) || 1; const f = modes[travelMode].factor; const r = totalDistanceKm % f; const tKm = distToTarget / 1000; midpointStepIndex = r > 0.05 ? (tKm < r ? 0 : Math.floor((tKm - r) / f) + 1) : Math.floor(tKm / f); }
    
    if (isFeatureOn('beta_mode') && !isLiveReceiver) {
        let arBtn = document.getElementById('beta-ar-btn');
        if (!arBtn) {
            arBtn = document.createElement('button');
            arBtn.id = 'beta-ar-btn';
            arBtn.innerText = t('arTestBtn');
            arBtn.style.cssText = "background: #9C27B0; color: white; border-radius: 20px; padding: 6px 15px; font-size: 0.75rem; font-weight: bold; border: none; box-shadow: 0 2px 5px rgba(0,0,0,0.2); cursor: pointer;";
            arBtn.onclick = startARTest;
            
            const topBar = document.getElementById('cancel-game-btn').parentNode;
            if (topBar) topBar.insertBefore(arBtn, document.getElementById('cancel-game-btn'));
        }
    }

    for (let i = 0; i < initialTotalKm; i++) {
        const step = document.createElement('div'); step.className = 'step'; step.id = `step-${i}`;
        if (i === initialTotalKm - 1) { step.innerHTML = activeTheme.target; } else if (i === midpointStepIndex) { step.innerHTML = activeTheme.target; } else { step.innerHTML = activeTheme.path; }
        if (isRestoring && i < maxStepsReached) step.classList.add('eat-animation');
        
        if (isFeatureOn('beta_mode') && i < initialTotalKm - 1) {
            const distLabel = document.createElement('span');
            distLabel.className = 'beta-dist-label';
            distLabel.id = `beta-dist-${i}`;
            distLabel.style.position = 'absolute';
            distLabel.style.bottom = '-12px';
            distLabel.style.left = '50%';
            distLabel.style.transform = 'translateX(-50%)';
            distLabel.style.fontSize = '0.5rem';
            distLabel.style.color = '#333';
            distLabel.style.whiteSpace = 'nowrap';
            distLabel.style.fontWeight = 'bold';
            step.style.position = 'relative';
            step.appendChild(distLabel);
        }

        els.pathGrid.appendChild(step);
    }
    
    setTimeout(() => { 
        moveMouse(isLiveReceiver ? maxStepsReached : (isRestoring ? maxStepsReached : 0)); 
        updateBetaDistances(); 
    }, 100); 
    if(!isLiveReceiver) broadcastLiveState();
    if (!isLiveReceiver && !isRestoring) saveSession();
}

async function performReRoute() {
    if (isReRouting || isLiveReceiver || gameState !== 'GAME' || !currentTargetCoords) return;
    isReRouting = true;

    const mode = modes[travelMode];
    
    let oldTraveledDist = 0;
    for (let i = 0; i < lastRouteIndex; i++) {
        oldTraveledDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
    }

    let oldFraction = 0;
    if (gameDynamicFactor > 0) {
        oldFraction = (oldTraveledDist + gameVirtualDistOffset) / gameDynamicFactor;
    } else {
        const f = modes[travelMode].factor * 1000;
        oldFraction = oldTraveledDist / f;
    }

    let fractionalProgress = oldFraction - Math.floor(oldFraction);
    if (fractionalProgress < 0 || isNaN(fractionalProgress)) fractionalProgress = 0;

    let nextPoiIndex = 1; 
    if (savedWayPointsIndices && savedWayPointsIndices.length > 0) {
        nextPoiIndex = savedWayPointsIndices.length - 1; 
        for (let i = 0; i < savedWayPointsIndices.length; i++) {
            if (lastRouteIndex < savedWayPointsIndices[i]) {
                nextPoiIndex = i;
                break;
            }
        }
        if (nextPoiIndex < 1) nextPoiIndex = 1;
    }

    if (originalPois && originalPois.length > 0) {
        let bestPoiIndex = nextPoiIndex;
        for (let i = nextPoiIndex; i < originalPois.length - 1; i++) {
            let distToCurrent = map.distance(userCoords, originalPois[i]);
            let distToNext = map.distance(userCoords, originalPois[i+1]);
            
            if (distToNext < distToCurrent) {
                bestPoiIndex = i + 1;
            } else {
                break;
            }
        }
        nextPoiIndex = bestPoiIndex;
    }

    let coordArray = [];
    coordArray.push([userCoords[1], userCoords[0]]); 

    if (originalPois && originalPois.length > 0) {
         for (let i = nextPoiIndex; i < originalPois.length; i++) {
             coordArray.push([originalPois[i][1], originalPois[i][0]]);
         }
    } else {
         if (travelMode === 2) {
             if (!hasReachedMidpoint) {
                 coordArray.push([currentTargetCoords.lng, currentTargetCoords.lat]);
                 if (fixedStartCoords) coordArray.push([fixedStartCoords[1], fixedStartCoords[0]]);
             } else {
                 if (fixedStartCoords) coordArray.push([fixedStartCoords[1], fixedStartCoords[0]]);
             }
         } else {
             coordArray.push([currentTargetCoords.lng, currentTargetCoords.lat]);
         }
    }

    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgxOTdlMWQxYzhmODQ2NGY4NjM0OWYzNDI2NzM3OWM5IiwiaCI6Im11cm11cjY0In0=";
    const url = `https://api.openrouteservice.org/v2/directions/${mode.profile}/geojson`;

    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8', 'Content-Type': 'application/json', 'Authorization': apiKey }, body: JSON.stringify({ coordinates: coordArray, elevation: false, instructions: false, preference: 'recommended' }) });
        const data = await res.json();

        if (data.features && data.features.length > 0) {
            const route = data.features[0];
            
            const historyPart = currentRouteCoords.slice(0, lastRouteIndex);
            historicalRouteCoords = historicalRouteCoords.concat(historyPart);
            
            currentRouteCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            
            if (originalPois && originalPois.length > 0) {
                let newOriginalPois = [[userCoords[0], userCoords[1]]];
                for (let i = nextPoiIndex; i < originalPois.length; i++) {
                    newOriginalPois.push(originalPois[i]);
                }
                originalPois = newOriginalPois;
                savedWayPointsIndices = route.properties.way_points || [];
            }

            const fullVisualRoute = [...historicalRouteCoords, ...currentRouteCoords];

            if (travelMode === 2 && !hasReachedMidpoint) {
                let splitIndex = currentRouteCoords.length - 1;
                let minD = Infinity;
                currentRouteCoords.forEach((c, i) => { const d = L.latLng(c).distanceTo(currentTargetCoords); if (d < minD) { minD = d; splitIndex = i; } });
                const coordsDit = currentRouteCoords.slice(0, splitIndex + 1);
                const coordsRetur = currentRouteCoords.slice(splitIndex);
                if (connectionLine) connectionLine.setLatLngs([...historicalRouteCoords, ...coordsDit]);
                if (connectionLineReturn) connectionLineReturn.setLatLngs(coordsRetur);
            } else {
                if (connectionLine) connectionLine.setLatLngs(fullVisualRoute);
                if (travelMode === 2 && hasReachedMidpoint) {
                    if (connectionLineReturn) connectionLineReturn.setLatLngs(fullVisualRoute);
                    if (connectionLine) connectionLine.setLatLngs([...historicalRouteCoords]); 
                }
            }

            if (gameRouteLine) gameRouteLine.setLatLngs(fullVisualRoute);

            gameBaseSteps = maxStepsReached;
            let stepsLeft = initialTotalKm - 1 - gameBaseSteps;
            
            let exactApplesLeft = stepsLeft - fractionalProgress;
            
            if (exactApplesLeft > 0) {
                let newTotalDist = 0;
                for (let i = 0; i < currentRouteCoords.length - 1; i++) {
                    newTotalDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
                }
                gameDynamicFactor = newTotalDist / exactApplesLeft;
                gameVirtualDistOffset = fractionalProgress * gameDynamicFactor;
            } else {
                gameDynamicFactor = 0;
                gameVirtualDistOffset = 0;
            }

            lastRouteIndex = 0; 
            lastReRouteTime = Date.now();
            saveSession();
            updateBetaDistances();
        }
    } catch (e) {
        console.error("Re-route error", e);
    }
    isReRouting = false;
}

function updateGameLogic() {
    if (gameState !== 'GAME' || !currentRouteCoords.length || isCelebratingTurn || isLiveReceiver) return;
    
    const goal = (travelMode === 2) ? (fixedStartCoords || startCoords) : currentTargetCoords; 
    const distToFinal = map.distance(userCoords, goal);
    
    if (!hasReachedMidpoint && travelMode === 2) { const distToTarget = map.distance(userCoords, currentTargetCoords); if (distToTarget < 10) { triggerTurnAroundDance(); return; } }

    let minD = Infinity; let idx = lastRouteIndex; let searchLimit = (travelMode !== 2 || hasReachedMidpoint) ? currentRouteCoords.length : Math.floor(currentRouteCoords.length * 0.6); 
    
    let searchStart = lastRouteIndex;
    if (searchStart >= searchLimit) {
        searchStart = 0; 
    }

    for (let i = searchStart; i < searchLimit; i++) { 
        const d = map.distance(userCoords, currentRouteCoords[i]); 
        if (d < minD) { minD = d; idx = i; } 
    }
    
    const reRouteThreshold = (travelMode === 0) ? 300 : 50;
    if (minD > reRouteThreshold && minD !== Infinity && !isReRouting && (Date.now() - lastReRouteTime > 30000)) {
        performReRoute();
        return; 
    }
    
    lastRouteIndex = idx;
    
    let traveledDist = 0; for (let i = 0; i < lastRouteIndex; i++) { traveledDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]); }
    let totalRouteDist = 0; for (let i = 0; i < currentRouteCoords.length - 1; i++) { totalRouteDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]); }
    
    let remainingDist = totalRouteDist - traveledDist; const distDisplay = document.getElementById('game-distance-display');
    if (distDisplay) { distDisplay.innerText = t('kmLeft', {dist: (remainingDist / 1000).toFixed(2)}); }

    let currentSteps = 0;
    if (gameDynamicFactor > 0) {
        currentSteps = gameBaseSteps + Math.floor((traveledDist + gameVirtualDistOffset) / gameDynamicFactor);
    } else {
        const f = modes[travelMode].factor; const r = (totalRouteDist / 1000) % f; const tKm = traveledDist / 1000;
        currentSteps = r > 0.05 ? (tKm < r ? 0 : Math.floor((tKm - r) / f) + 1) : Math.floor(tKm / f);
    }
    
    if (!hasReachedMidpoint && travelMode === 2 && currentSteps > midpointStepIndex) { currentSteps = midpointStepIndex; }
    if (currentSteps >= initialTotalKm) { currentSteps = initialTotalKm - 1; }
    
    if (currentSteps > maxStepsReached) { 
        maxStepsReached = currentSteps; 
        saveSession(); 
    }
    
    for (let i = 0; i < initialTotalKm - 1; i++) { const s = document.getElementById(`step-${i}`); if (s) i < maxStepsReached ? s.classList.add('eat-animation') : s.classList.remove('eat-animation'); }
    
    const finalLimit = (travelMode === 0) ? 40 : 10;
    
    if (travelMode === 2) { if (hasReachedMidpoint && distToFinal < finalLimit && maxStepsReached > (initialTotalKm * 0.8)) { moveMouse(initialTotalKm - 1); finishGame(); } else { moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 2))); } } 
    else { if (distToFinal < finalLimit) { moveMouse(initialTotalKm - 1); finishGame(); } else { moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 2))); } }
    
    if (isGameMapVisible) { updateGameMapView(false); }
}

function triggerTurnAroundDance() {
    if (isCelebratingTurn) return; isCelebratingTurn = true; moveMouse(midpointStepIndex);
    const step = document.getElementById(`step-${midpointStepIndex}`); if(step) step.classList.add('eat-animation');
    const m = document.getElementById('the-mouse'); m.innerHTML = activeTheme.player + activeTheme.target; m.classList.add('turn-dance');
    playClickSound(); setTimeout(() => { m.classList.remove('turn-dance'); m.innerHTML = activeTheme.player; hasReachedMidpoint = true; isCelebratingTurn = false; maxStepsReached = midpointStepIndex + 1; saveSession(); }, 3000);
}

function moveMouse(index) {
    const m = document.getElementById('the-mouse'); 
    const s = document.getElementById(`step-${index}`); 
    const container = els.pathGrid;
    
    if (s && container) { 
        m.style.left = s.offsetLeft + "px"; 
        m.style.top = s.offsetTop + "px"; 
        
        if (!isUserScrolling) {
            let targetScroll = s.offsetTop - (container.clientHeight * 0.2); 
            if (targetScroll < 0) { 
                targetScroll = 0; 
            } 
            container.scrollTo({ top: targetScroll, behavior: 'smooth' }); 
        }
    }
}

function finishGame() {
    if (gameState === 'FINISHED') return; gameState = 'FINISHED'; const m = document.getElementById('the-mouse');
    m.innerHTML = activeTheme.player + activeTheme.target; m.classList.add('victory');
    createConfettiBurst(); confettiInterval = setInterval(createConfettiBurst, 800); 
    if(!isLiveReceiver) els.shareBtn.classList.remove('hidden'); releaseWakeLock(); broadcastLiveState();
    if(!isLiveReceiver) saveSession();
}

function stopGame() { 
    gameState = 'MAP'; if (!isLiveReceiver) fixedStartCoords = null; clearInterval(confettiInterval);
    gameBaseSteps = 0; gameDynamicFactor = 0; gameVirtualDistOffset = 0; isReRouting = false;
    isGameMapVisible = false; els.gameMapWrapper.classList.add('hidden'); const distDisplay = document.getElementById('game-distance-display'); if (distDisplay) distDisplay.classList.add('hidden');
    const zoomBtn = document.getElementById('zoom-toggle-btn'); if (zoomBtn) zoomBtn.classList.add('hidden');
    els.pathGrid.classList.remove('hidden'); const m = document.getElementById('the-mouse');
    
    const toggleBtn = document.getElementById('toggle-game-view-btn');
    if (toggleBtn) toggleBtn.innerText = t('btnMap');
    
    m.classList.remove('victory'); m.classList.remove('turn-dance'); m.innerHTML = activeTheme.player;
    document.querySelectorAll('.confetti').forEach(c => c.remove()); els.gamePage.classList.add('hidden'); els.mapPage.classList.remove('hidden'); 
    if(!isLiveReceiver) els.shareBtn.classList.remove('hidden'); releaseWakeLock(); if(!isLiveReceiver) saveSession();
    setTimeout(() => { if (map) { map.invalidateSize(); } }, 50); broadcastLiveState();
}

function createConfettiBurst() {
    const startX = Math.random() * window.innerWidth; const startY = Math.random() * window.innerHeight; const colors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#800080', '#ffc0cb'];
    for(let i=0; i<40; i++) { const c = document.createElement('div'); c.className = 'confetti'; c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; c.style.left = startX + 'px'; c.style.top = startY + 'px'; const angle = Math.random() * Math.PI * 2; const dist = 60 + Math.random() * 200; c.style.setProperty('--dx', Math.cos(angle) * dist + 'px'); c.style.setProperty('--dy', Math.sin(angle) * dist + 'px'); document.body.appendChild(c); setTimeout(() => c.remove(), 1200); }
}

function handleOrientationLayout() { if (window.innerHeight < window.innerWidth) { els.actionContainer.prepend(els.modeBtn); } else { document.querySelector('.save-btn-container').appendChild(els.modeBtn); } }
function toggleSearchUI() { els.searchContainer.classList.toggle('hidden'); if (!els.searchContainer.classList.contains('hidden')) els.searchInput.focus(); }

async function executeTextSearch() {
    const q = els.searchInput.value; if (!q) return;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(q)}`); const d = await res.json();
        if (d.length > 0) {
            if (d[0].address && d[0].address.country_code) updateVoiceLangFromCountry(d[0].address.country_code); 
            let parts = d[0].display_name.split(','); let firstPart = parts[0].trim();
            if (!isNaN(firstPart)) { currentTargetName = (d[0].address && d[0].address.road) ? (d[0].address.road + ' ' + firstPart) : firstPart; } 
            else { if (d[0].address && d[0].address.road && firstPart === d[0].address.road) { currentTargetName = d[0].address.road + (d[0].address.house_number ? ' ' + d[0].address.house_number : ''); } else { currentTargetName = firstPart; } }
            setTarget({lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon)}, true, true, true); map.flyTo(currentTargetCoords, 18); els.searchContainer.classList.add('hidden');
        }
    } catch (e) { alert(t('offlineSearch')); }
}

function updateButtonUI() {
    savedLocations.forEach((loc, i) => {
        const btn = document.getElementById(`btn-${i}`); const span = btn.querySelector('.scrolling-text');
        const textContent = loc ? loc.name : t('saveSlot', {num: i+1});
        span.innerText = textContent; span.classList.remove('animate-scroll');
        if (span.scrollWidth > btn.querySelector('.btn-text-container').offsetWidth) { span.innerText = textContent + " \u00A0\u00A0\u00A0 " + textContent + " \u00A0\u00A0\u00A0 "; span.classList.add('animate-scroll'); }
        loc ? btn.classList.add('filled') : btn.classList.remove('filled');
    });
}

function handleSlotClick(i) { 
    if(isLiveReceiver) return; const d = savedLocations[i]; 
    if (d) { 
        currentTargetName = d.name; waypointsDit = []; waypointsHem = []; waypointMarkers.forEach(m => map.removeLayer(m)); waypointMarkers = [];
        if (d.manualStart) { fixedStartCoords = d.manualStart; if (!manualStartMarker) { manualStartMarker = L.circleMarker(d.manualStart, { radius: 8, fillColor: "#4CAF50", color: "#fff", weight: 2, fillOpacity: 1 }).addTo(map); manualStartMarker.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeManualStartPoint(); }); } else { manualStartMarker.setLatLng(d.manualStart); } } else { if (manualStartMarker) { map.removeLayer(manualStartMarker); manualStartMarker = null; } if (userCoords) fixedStartCoords = [...userCoords]; else fixedStartCoords = null; }
        if (d.waypointsDit) { d.waypointsDit.forEach(wp => { const latlng = L.latLng(wp.lat, wp.lng); waypointsDit.push(latlng); const m = L.circleMarker(latlng, { radius: 7, fillColor: "#2196F3", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map); m.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(m, latlng); }); waypointMarkers.push(m); }); }
        if (d.waypointsHem) { d.waypointsHem.forEach(wp => { const latlng = L.latLng(wp.lat, wp.lng); waypointsHem.push(latlng); const m = L.circleMarker(latlng, { radius: 7, fillColor: "#FF9800", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map); m.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(m, latlng); }); waypointMarkers.push(m); }); }
        setTarget(d.coords, true, false, false); map.flyTo(d.coords, 14); 
    } 
}

function saveCurrentPos(i) { 
    if (!currentTargetCoords) return; const l = prompt(t('promptSaveAs'), currentTargetName); 
    if (l) { 
        let includeWaypoints = false; if (waypointsDit.length > 0 || waypointsHem.length > 0) { includeWaypoints = confirm(t('promptSaveWaypoints')); }
        savedLocations[i] = { coords: {lat: currentTargetCoords.lat, lng: currentTargetCoords.lng}, name: l, waypointsDit: includeWaypoints ? waypointsDit.map(wp => ({lat: wp.lat, lng: wp.lng})) : [], waypointsHem: includeWaypoints ? waypointsHem.map(wp => ({lat: wp.lat, lng: wp.lng})) : [], manualStart: manualStartMarker ? fixedStartCoords : null }; 
        localStorage.setItem('mouse_favs', JSON.stringify(savedLocations)); updateButtonUI(); 
    } 
}

function setupInteractions() { document.querySelectorAll('.slot-btn').forEach((b, i) => { let lastTriggerTime = 0; const triggerSave = (e) => { const now = Date.now(); if (now - lastTriggerTime < 7000) return; lastTriggerTime = now; if (e && typeof e.preventDefault === 'function') { e.preventDefault(); e.stopPropagation(); } saveCurrentPos(i); }; b.oncontextmenu = (e) => { triggerSave(e); return false; }; let pressTimer; b.addEventListener('touchstart', (e) => { pressTimer = setTimeout(() => triggerSave(e), 600); }, {passive: true}); b.addEventListener('touchend', () => clearTimeout(pressTimer)); }); }
function playClickSound() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(3000, audioCtx.currentTime); o.start(); o.stop(audioCtx.currentTime+0.1); }

function shareApp(e) { 
    if (isLiveReceiver) { alert(t('alreadyLive')); return; }
    const oldMenu = document.getElementById('share-menu'); if (oldMenu) { oldMenu.remove(); return; }

    const menu = document.createElement('div'); menu.id = 'share-menu';
    menu.style.position = 'fixed'; menu.style.top = '65px'; menu.style.left = '15px'; menu.style.zIndex = '10001'; menu.style.background = 'white'; menu.style.borderRadius = '15px'; menu.style.padding = '10px'; menu.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)'; menu.style.display = 'flex'; menu.style.flexDirection = 'column'; menu.style.gap = '8px'; menu.style.border = `2px solid var(--primary)`;

    const btnNormal = document.createElement('button'); btnNormal.id = 'share-btn-static'; btnNormal.className = 'wp-menu-btn'; btnNormal.style.background = 'var(--blue)'; btnNormal.innerText = t('shareStatic');
    btnNormal.onclick = () => { menu.remove(); shareNormal(); };

    const btnLive = document.createElement('button'); btnLive.id = 'share-btn-live'; btnLive.className = 'wp-menu-btn'; btnLive.style.background = '#ff4444'; btnLive.innerText = t('shareLive');
    btnLive.onclick = () => { menu.remove(); startLiveSharing(); };

    const btnShareApp = document.createElement('button'); btnShareApp.id = 'share-btn-app'; btnShareApp.className = 'wp-menu-btn'; btnShareApp.style.background = 'var(--primary)'; btnShareApp.innerText = t('shareAppBtn');
    btnShareApp.onclick = () => { menu.remove(); shareOnlyApp(); };

    const btnFacebook = document.createElement('button'); 
    btnFacebook.id = 'share-btn-facebook'; 
    btnFacebook.className = 'wp-menu-btn'; 
    btnFacebook.style.background = '#1877F2'; 
    btnFacebook.innerText = t('btnFacebookGroup'); 
    btnFacebook.onclick = () => { 
        menu.remove(); 
        window.open('https://www.facebook.com/groups/1821002065283654', '_blank'); 
    };

    const btnCancel = document.createElement('button'); btnCancel.id = 'share-btn-cancel'; btnCancel.innerText = t('btnCancel'); btnCancel.style.fontSize = '0.7rem'; btnCancel.style.background = 'none'; btnCancel.onclick = () => menu.remove();

    menu.appendChild(btnNormal); 
    menu.appendChild(btnLive); 
    menu.appendChild(btnShareApp); 
    menu.appendChild(btnFacebook); 
    menu.appendChild(btnCancel); 
    
    document.body.appendChild(menu);

    setTimeout(() => { const close = (event) => { if (!menu.contains(event.target) && event.target.id !== 'share-btn' && !event.target.closest('#tutorial-overlay')) { menu.remove(); document.removeEventListener('click', close); } }; document.addEventListener('click', close); }, 100);
}

function shareNormal() {
    let shareUrl = window.location.origin + window.location.pathname; let title = 'Tracker'; let text = t('shareRouteTitle');
    if (currentTargetCoords) {
        const data = { t: [currentTargetCoords.lat, currentTargetCoords.lng], m: travelMode, wd: waypointsDit.map(w => [w.lat, w.lng]), wh: waypointsHem.map(w => [w.lat, w.lng]), n: currentTargetName, s: manualStartMarker ? fixedStartCoords : null };
        const encoded = btoa(JSON.stringify(data)); shareUrl += '?r=' + encoded; text = t('followRouteText', {target: currentTargetName});
    }
    const d = {title: title, text: text, url: shareUrl}; 
    if(navigator.share) { navigator.share(d).catch(e => console.log("Delning avbruten")); } else { prompt(t('copyRouteLink'), shareUrl); }
}

function startLiveSharing() {
    if (!liveSessionId) liveSessionId = Math.random().toString(36).substr(2, 9);
    if (!pusher) { pusher = new Pusher(pusherKey, getPusherConfig()); }
    liveChannel = pusher.subscribe(`private-live-${liveSessionId}`);
    liveChannel.bind('pusher:subscription_succeeded', () => { isLiveSharing = true; broadcastLiveState(); if(!liveBroadcastInterval) { liveBroadcastInterval = setInterval(() => { if (isLiveSharing) broadcastLiveState(); }, 3000); } });
    let shareUrl = window.location.origin + window.location.pathname + '?live=' + liveSessionId;
    const d = {title: t('followLiveTitle'), text: t('followLiveText'), url: shareUrl};
    if(navigator.share) { navigator.share(d).catch(e => console.log("Delning avbruten")); } else { prompt(t('copyLiveLink'), shareUrl); }
}

function resumeLiveSharing() {
    if (!pusher) { pusher = new Pusher(pusherKey, getPusherConfig()); }
    liveChannel = pusher.subscribe(`private-live-${liveSessionId}`);
    liveChannel.bind('pusher:subscription_succeeded', () => { 
        isLiveSharing = true; 
        broadcastLiveState(); 
        if(!liveBroadcastInterval) { 
            liveBroadcastInterval = setInterval(() => { if (isLiveSharing) broadcastLiveState(); }, 3000); 
        } 
    });
}

function shareOnlyApp() {
    let shareUrl = window.location.origin + window.location.pathname;
    const appTitles = { 'sv': 'Hur långt?', 'en': 'How far?', 'ru': 'Как далеко?', 'am': 'ምን ያህል ይርቃል?', 'ar': 'كم تبعد؟' };
    const appName = appTitles[currentLang] || appTitles['en'];
    
    const d = {title: appName, text: t('checkAppText'), url: shareUrl}; 
    if(navigator.share) { navigator.share(d).catch(e => console.log("Delning avbruten")); } else { prompt(t('copyAppLink'), shareUrl); }
}

// --- DEVELOPER MODE ---
window.addEventListener('DOMContentLoaded', () => {
    const versionTag = document.getElementById('version-tag');
    if (versionTag) {
        versionTag.style.pointerEvents = 'auto'; versionTag.style.cursor = 'pointer';
        let devTapCount = 0; let devTapTimer = null;
        versionTag.addEventListener('click', () => { devTapCount++; clearTimeout(devTapTimer); devTapTimer = setTimeout(() => { devTapCount = 0; }, 1000); if (devTapCount >= 5) { devTapCount = 0; openDeveloperMode(); } });
    }
});

function openDeveloperMode() {
    playClickSound();
    const oldMenu = document.getElementById('dev-menu'); if (oldMenu) oldMenu.remove();

    const menu = document.createElement('div'); menu.id = 'dev-menu';
    menu.style.position = 'fixed'; menu.style.top = '50%'; menu.style.left = '50%'; menu.style.transform = 'translate(-50%, -50%)';
    menu.style.zIndex = '100000'; menu.style.background = 'rgba(30, 30, 30, 0.95)'; menu.style.backdropFilter = 'blur(10px)';
    menu.style.color = 'white'; menu.style.padding = '25px'; menu.style.borderRadius = '20px'; menu.style.boxShadow = '0 15px 40px rgba(0,0,0,0.5)';
    menu.style.display = 'flex'; menu.style.flexDirection = 'column'; menu.style.gap = '12px'; menu.style.width = '260px'; menu.style.border = '2px solid #555';
    menu.style.maxHeight = '80vh'; menu.style.overflowY = 'auto';

    const title = document.createElement('h3'); title.innerText = t('devTitle'); title.style.margin = '0 0 10px 0'; title.style.textAlign = 'center'; title.style.letterSpacing = '2px'; menu.appendChild(title);

    const betaHeader = document.createElement('h4');
    betaHeader.innerText = t('devBetaTitle');
    betaHeader.style.margin = "10px 0 5px 0";
    betaHeader.style.textAlign = "center";
    menu.appendChild(betaHeader);

    Object.keys(appFeatures).forEach(key => {
        const active = isFeatureOn(key);
        const btn = document.createElement('button');
        btn.innerText = `${appFeatures[key].name}: ${active ? t('devOn') : t('devOff')}`;
        btn.style.padding = '10px'; btn.style.borderRadius = '10px'; btn.style.border = 'none';
        btn.style.marginBottom = '15px';
        btn.style.background = active ? '#4CAF50' : '#444';
        btn.style.color = 'white'; btn.style.fontWeight = 'bold'; btn.style.cursor = 'pointer';
        btn.onclick = () => toggleFeature(key);
        menu.appendChild(btn);
    });

    const langTitle = document.createElement('h4'); langTitle.innerText = t('devLang'); langTitle.style.margin = '10px 0 5px 0'; langTitle.style.textAlign = 'center'; menu.appendChild(langTitle);
    
    const langGrid = document.createElement('div'); langGrid.style.display = 'grid'; langGrid.style.gridTemplateColumns = '1fr 1fr'; langGrid.style.gap = '8px'; menu.appendChild(langGrid);

    ['sv', 'en', 'ru', 'am', 'ar'].forEach(l => {
        const btn = document.createElement('button');
        btn.innerText = l.toUpperCase() + (currentLang === l ? ' ✔' : '');
        btn.style.padding = '10px'; btn.style.borderRadius = '10px'; btn.style.border = 'none';
        btn.style.background = currentLang === l ? '#4CAF50' : '#444';
        btn.style.color = 'white'; btn.style.fontWeight = 'bold'; btn.style.cursor = 'pointer';
        btn.onclick = () => { localStorage.setItem('app_lang', l); location.reload(); };
        langGrid.appendChild(btn);
    });

    const themeTitle = document.createElement('h4'); themeTitle.innerText = t('devTheme'); themeTitle.style.margin = '15px 0 5px 0'; themeTitle.style.textAlign = 'center'; menu.appendChild(themeTitle);

    const currentThemeId = localStorage.getItem('app_theme_override');

    Object.keys(themes).forEach(themeKey => {
        const btn = document.createElement('button');
        const translatedThemeName = i18n[currentLang]?.themes?.[themeKey]?.name || themes[themeKey].name;
        btn.innerText = `${themes[themeKey].player} ${translatedThemeName.toUpperCase()}` + (currentThemeId === themeKey ? ' ✔' : '');
        btn.style.padding = '10px'; btn.style.borderRadius = '10px'; btn.style.border = 'none'; 
        btn.style.background = currentThemeId === themeKey ? '#4CAF50' : '#444'; 
        btn.style.color = 'white'; btn.style.fontWeight = 'bold'; btn.style.cursor = 'pointer';
        btn.onclick = () => {
            localStorage.setItem('app_theme_override', themeKey); location.reload();
        };
        menu.appendChild(btn);
    });

    const resetBtn = document.createElement('button'); resetBtn.innerText = t('devReset');
    resetBtn.style.background = '#FF9800'; resetBtn.style.color = 'white'; resetBtn.style.padding = '12px'; resetBtn.style.borderRadius = '10px'; resetBtn.style.marginTop = '15px'; resetBtn.style.fontWeight = 'bold'; resetBtn.style.border = 'none'; resetBtn.style.cursor = 'pointer';
    resetBtn.onclick = () => {
        localStorage.removeItem('app_lang');
        localStorage.removeItem('app_theme_override');
        location.reload();
    };
    menu.appendChild(resetBtn);

    const closeBtn = document.createElement('button'); closeBtn.innerText = t('devClose'); 
    closeBtn.style.background = '#ff4444'; closeBtn.style.color = 'white'; closeBtn.style.padding = '12px'; closeBtn.style.borderRadius = '10px'; closeBtn.style.marginTop = '5px'; closeBtn.style.fontWeight = 'bold'; closeBtn.style.border = 'none'; closeBtn.style.cursor = 'pointer'; 
    closeBtn.onclick = () => menu.remove(); 
    menu.appendChild(closeBtn);
    
    document.body.appendChild(menu);
}
// ----------------------

window.onload = initMap;