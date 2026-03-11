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
        welcome: "Hej! {player}",
        helpFind: "Hjälp {name} att hitta {targetName}!",
        instr1: "🚗🚶↔️ <b>Välj färdsätt</b>",
        instr2: "📍 <b>Välj resmål</b> Klicka på kartan eller sök",
        instr3: "💡 <b>Via-punkter</b> långtryck för att lägga till eller ta bort",
        instr4: "💾 <b>Spara favoriter</b> långtryck på en spara-knapp",
        instr5: "🚀 <b>STARTA</b>",
        okGotIt: "Okej! Jag förstår!",
        searchingGps: "Söker din GPS... 📍",
        whereTo: "Vart ska vi åka? {player}",
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
        setStartPoint: "📍 Sätt som startpunkt",
        waypointDit: "🏁 På vägen dit",
        waypointHem: "🏁 På vägen tillbaka",
        addWaypoint: "🏁 Lägg till via-punkt",
        kmLeft: "{dist} km kvar",
        swipeHint: "👈 Swipa för karta 👉",
        iosInstall: "Installera appen för att få fullskärm och snabb åtkomst!",
        iosClose: "Kanske senare",
        devTitle: "🛠 DEV MODE",
        devLang: "🌐 SPRÅK / LANGUAGE",
        devTheme: "🎨 TEMA / THEMES",
        devClose: "Stäng",
        devReset: "🔄 Återställ Inställningar",
        themes: {
            default: { name: 'musen', targetName: 'osten' },
            easter: { name: 'påskharen', targetName: 'påskägget' },
            midsummer: { name: 'grodan', targetName: 'jordgubben' },
            halloween: { name: 'spöket', targetName: 'pumpan' },
            christmas: { name: 'tomten', targetName: 'julklappen' },
            newyear: { name: 'raketen', targetName: 'fyrverkeriet' },
            birthday: { name: 'födelsedagsbarnet', targetName: 'tårtan' }
        }
    },
    en: {
        welcome: "Hello! {player}",
        helpFind: "Help {name} find {targetName}!",
        instr1: "🚗🚶↔️ <b>Choose transport</b>",
        instr2: "📍 <b>Choose destination</b> Click on map or search",
        instr3: "💡 <b>Waypoints</b> long-press to add or remove",
        instr4: "💾 <b>Save favorites</b> long-press a save button",
        instr5: "🚀 <b>START</b>",
        okGotIt: "Okay! I understand!",
        searchingGps: "Searching GPS... 📍",
        whereTo: "Where are we going? {player}",
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
        setStartPoint: "📍 Set as starting point",
        waypointDit: "🏁 On the way there",
        waypointHem: "🏁 On the way back",
        addWaypoint: "🏁 Add waypoint",
        kmLeft: "{dist} km left",
        swipeHint: "👈 Swipe for map 👉",
        iosInstall: "Install the app for full screen and quick access!",
        iosClose: "Maybe later",
        devTitle: "🛠 DEV MODE",
        devLang: "🌐 LANGUAGE",
        devTheme: "🎨 THEMES",
        devClose: "Close",
        devReset: "🔄 Reset Settings",
        themes: {
            default: { name: 'the mouse', targetName: 'the cheese' },
            easter: { name: 'the easter bunny', targetName: 'the egg' },
            midsummer: { name: 'the frog', targetName: 'the strawberry' },
            halloween: { name: 'the ghost', targetName: 'the pumpkin' },
            christmas: { name: 'Santa', targetName: 'the present' },
            newyear: { name: 'the rocket', targetName: 'the fireworks' },
            birthday: { name: 'the birthday kid', targetName: 'the cake' }
        }
    },
    ru: {
        welcome: "Привет! {player}",
        helpFind: "Помогите {name} найти {targetName}!",
        instr1: "🚗🚶↔️ <b>Выберите транспорт</b>",
        instr2: "📍 <b>Пункт назначения</b> Нажмите на карту или ищите",
        instr3: "💡 <b>Путевые точки</b> долгое нажатие для доб/удаления",
        instr4: "💾 <b>Сохранить</b> долгое нажатие кнопки",
        instr5: "🚀 <b>СТАРТ</b>",
        okGotIt: "Понятно!",
        searchingGps: "Поиск GPS... 📍",
        whereTo: "Куда едем? {player}",
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
        setStartPoint: "📍 Установить как точку старта",
        waypointDit: "🏁 По пути туда",
        waypointHem: "🏁 По пути обратно",
        addWaypoint: "🏁 Добавить путевую точку",
        kmLeft: "осталось {dist} км",
        swipeHint: "👈 Свайп к карте 👉",
        iosInstall: "Установите приложение для полного экрана!",
        iosClose: "Возможно позже",
        devTitle: "🛠 РЕЖИМ РАЗРАБОТЧИКА",
        devLang: "🌐 ЯЗЫК / LANGUAGE",
        devTheme: "🎨 ТЕМЫ / THEMES",
        devClose: "Закрыть",
        devReset: "🔄 Сброс настроек",
        themes: {
            default: { name: 'мыши', targetName: 'сыр' },
            easter: { name: 'пасхальному кролику', targetName: 'пасхальное яйцо' },
            midsummer: { name: 'лягушке', targetName: 'клубнику' },
            halloween: { name: 'призраку', targetName: 'тыкву' },
            christmas: { name: 'Санте', targetName: 'подарок' },
            newyear: { name: 'ракете', targetName: 'фейерверк' },
            birthday: { name: 'имениннику', targetName: 'торт' }
        }
    },
    am: {
        welcome: "ሰላም! {player}",
        helpFind: "{name} {targetName} እንዲያገኝ እርዱት!",
        instr1: "🚗🚶↔️ <b>የመጓጓዣ አይነት ይምረጡ</b>",
        instr2: "📍 <b>መድረሻ ይምረጡ</b> ካርታ ላይ ይጫኑ ወይም ይፈልጉ",
        instr3: "💡 <b>የማቆሚያ ነጥቦች</b> ለመጨመር/ለማጥፋት በረጅሙ ይጫኑ",
        instr4: "💾 <b>ተወዳጅ ያስቀምጡ</b> የማስቀመጫ ቁልፍን በረጅሙ ይጫኑ",
        instr5: "🚀 <b>ጀምር</b>",
        okGotIt: "እሺ! ገባኝ!",
        searchingGps: "ጂፒኤስ በመፈለግ ላይ... 📍",
        whereTo: "የት እንሂድ? {player}",
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
        setStartPoint: "📍 እንደ መነሻ ነጥብ ያድርጉ",
        waypointDit: "🏁 በመሄጃው መንገድ ላይ",
        waypointHem: "🏁 በመመለሻው መንገድ ላይ",
        addWaypoint: "🏁 የማቆሚያ ነጥብ ያክሉ",
        kmLeft: "{dist} ኪ.ሜ ቀርቷል",
        swipeHint: "👈 ለካርታ ያንሸራትቱ 👉",
        iosInstall: "ሙሉ ስክሪን ለማግኘት መተግበሪያውን ይጫኑ!",
        iosClose: "ምናልባት በኋላ",
        devTitle: "🛠 DEV MODE",
        devLang: "🌐 ቋንቋ / LANGUAGE",
        devTheme: "🎨 ገጽታዎች / THEMES",
        devClose: "ዝጋ",
        devReset: "🔄 ዳግም አስጀምር",
        themes: {
            default: { name: 'አይጥ', targetName: 'አይብ' },
            easter: { name: 'የፋሲካ ጥንቸል', targetName: 'እንቁላል' },
            midsummer: { name: 'እንቁራሪት', targetName: 'እንጆሪ' },
            halloween: { name: 'መንፈስ', targetName: 'ዱባ' },
            christmas: { name: 'ሳንታ', targetName: 'ስጦታ' },
            newyear: { name: 'ሮኬት', targetName: 'ርችት' },
            birthday: { name: 'የልደት ልጅ', targetName: 'ኬክ' }
        }
    },
    ar: {
        welcome: "مرحباً! {player}",
        helpFind: "ساعد {name} في العثور على {targetName}!",
        instr1: "🚗🚶↔️ <b>اختر وسيلة النقل</b>",
        instr2: "📍 <b>اختر الوجهة</b> انقر على الخريطة أو ابحث",
        instr3: "💡 <b>نقاط الطريق</b> اضغط مطولاً للإضافة أو الإزالة",
        instr4: "💾 <b>حفظ المفضلة</b> اضغط مطولاً على زر الحفظ",
        instr5: "🚀 <b>ابدأ</b>",
        okGotIt: "حسناً! فهمت!",
        searchingGps: "جاري البحث عن GPS... 📍",
        whereTo: "إلى أين نذهب؟ {player}",
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
        micDenied: "يجب عليك السماح بالوصول إلى الميكروفون في متصفحك.",
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
        setStartPoint: "📍 تعيين كنقطة بداية",
        waypointDit: "🏁 في الطريق إلى هناك",
        waypointHem: "🏁 في طريق العودة",
        addWaypoint: "🏁 إضافة نقطة طريق",
        kmLeft: "متبقي {dist} كم",
        swipeHint: "👈 اسحب للخريطة 👉",
        iosInstall: "قم بتثبيت التطبيق للحصول على شاشة كاملة ووصول سريع!",
        iosClose: "ربما لاحقاً",
        devTitle: "🛠 وضع المطور",
        devLang: "🌐 اللغة / LANGUAGE",
        devTheme: "🎨 السمات / THEMES",
        devClose: "إغلاق",
        devReset: "🔄 إعادة ضبط الإعدادات",
        themes: {
            default: { name: 'الفأر', targetName: 'الجبن' },
            easter: { name: 'أرنب عيد الفصح', targetName: 'بيضة الفصح' },
            midsummer: { name: 'الضفدع', targetName: 'الفراولة' },
            halloween: { name: 'الشبح', targetName: 'اليقطين' },
            christmas: { name: 'سانتا', targetName: 'الهدية' },
            newyear: { name: 'الصاروخ', targetName: 'الألعاب النارية' },
            birthday: { name: 'صاحب عيد الميلاد', targetName: 'الكعكة' }
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
let dynamicVoiceLang = currentLang === 'sv' ? 'sv-SE' : currentLang === 'ru' ? 'ru-RU' : currentLang === 'am' ? 'am-ET' : currentLang === 'ar' ? 'ar-SA' : 'en-US';

function updateVoiceLangFromCountry(countryCode) {
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
    const wt = document.getElementById('welcome-title'); if(wt) wt.innerHTML = t('welcome', {player: activeTheme.player});
    const wd = document.getElementById('welcome-desc'); if(wd) wd.innerHTML = t('helpFind', {name: getThemeName(), targetName: getThemeTarget()});
    
    const i1 = document.getElementById('instr-1'); if(i1) i1.innerHTML = t('instr1');
    const i2 = document.getElementById('instr-2'); if(i2) i2.innerHTML = t('instr2');
    const i3 = document.getElementById('instr-3'); if(i3) i3.innerHTML = t('instr3');
    const i4 = document.getElementById('instr-4'); if(i4) i4.innerHTML = t('instr4');
    const i5 = document.getElementById('instr-5'); if(i5) i5.innerHTML = t('instr5');
    
    const ok = document.getElementById('welcome-ok-btn'); if(ok) ok.innerHTML = t('okGotIt');
    
    const searchInput = document.getElementById('text-search-input');
    if(searchInput) searchInput.placeholder = t('searchPlaceholder');
    
    if(els.startBtn) els.startBtn.innerText = t('start', {target: activeTheme.target});
    if(els.voiceBtn && !els.voiceBtn.classList.contains('listening')) els.voiceBtn.innerHTML = t('voiceSearch');
    const txtBtn = document.getElementById('text-btn'); if(txtBtn) txtBtn.innerHTML = t('textSearch');
    updateLocateBtnText(); 
    
    const cancelBtn = document.getElementById('cancel-game-btn');
    if(cancelBtn) cancelBtn.innerHTML = t('cancel');

    const swipeHint = document.getElementById('swipe-hint');
    if (swipeHint) swipeHint.innerHTML = t('swipeHint');

    const iosDesc = document.getElementById('ios-desc'); if(iosDesc) iosDesc.innerHTML = t('iosInstall');
    const iosClose = document.getElementById('ios-close'); if(iosClose) iosClose.innerHTML = t('iosClose');
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

let savedGameState = 'MAP';
let savedInitialTotalKm = 0;
let savedMaxStepsReached = 0;
let savedLastRouteIndex = 0;
let savedMidpointStepIndex = -1;
let savedHasReachedMidpoint = false;
let savedGameStartCoords = null;

let currentHeading = 0; let renderedHeading = 0; let lastUserCoordsForHeading = null;
let map, targetMarker, userMarker, connectionLine, connectionLineReturn, userCoords;
let fixedStartCoords = null; let manualStartMarker = null; let currentTargetCoords = null;
let waypointsDit = []; let waypointsHem = []; let waypointMarkers = []; 
let startCoords = null; let currentTargetName = "MÅLET"; let initialZoomPerformed = false; 
let isShowingUser = true; let isTracking = false; 
let savedLocations = JSON.parse(localStorage.getItem('mouse_favs')) || [null, null, null, null];
let wakeLock = null; let currentRouteCoords = []; let ignoreClick = false; let confettiInterval = null;
let maxStepsReached = 0; let lastRouteIndex = 0; let hasReachedMidpoint = false; 
let midpointStepIndex = -1; let isCelebratingTurn = false; let swipeHintShown = false; 
let gameMap = null; let gameRouteLine = null, gameUserMarker = null, gameSnapMarker = null, gameDashedLine = null;
let isGameMapVisible = false; let swipeStartX = 0;

let travelMode = 0; 
const modes = [
    { icon: '🚗', factor: 1.0, profile: 'driving-car' },
    { icon: '🚶', factor: 0.1, profile: 'foot-walking' },
    { icon: '🚶↔️', factor: 0.1, profile: 'foot-walking' } 
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

let sessionRaw = JSON.parse(localStorage.getItem('mouse_session'));
let lastTarget = null;

if (sessionRaw && (Date.now() - sessionRaw.timestamp < 10800000)) {
    lastTarget = sessionRaw.target;
    travelMode = sessionRaw.travelMode || 0;
    waypointsDit = (sessionRaw.waypointsDit || []).map(p => L.latLng(p.lat, p.lng));
    waypointsHem = (sessionRaw.waypointsHem || []).map(p => L.latLng(p.lat, p.lng));
    swipeHintShown = sessionRaw.swipeHintShown || false;
    if (sessionRaw.startCoords) { fixedStartCoords = sessionRaw.startCoords; }
    
    savedGameState = sessionRaw.gameState || 'MAP';
    savedInitialTotalKm = sessionRaw.initialTotalKm || 0;
    savedMaxStepsReached = sessionRaw.maxStepsReached || 0;
    savedLastRouteIndex = sessionRaw.lastRouteIndex || 0;
    savedMidpointStepIndex = sessionRaw.midpointStepIndex !== undefined ? sessionRaw.midpointStepIndex : -1;
    savedHasReachedMidpoint = sessionRaw.hasReachedMidpoint || false;
    savedGameStartCoords = sessionRaw.gameStartCoords || null;

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
            els.distInfo.innerHTML = "⚠️ Öppna i Safari/Chrome för att spara appen!";
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

function getBearing(lat1, lng1, lat2, lng2) {
    const toRad = Math.PI / 180; const toDeg = 180 / Math.PI;
    const dLng = (lng2 - lng1) * toRad;
    const y = Math.sin(dLng) * Math.cos(lat2 * toRad);
    const x = Math.cos(lat1 * toRad) * Math.sin(lat2 * toRad) - Math.sin(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.cos(dLng);
    const brng = Math.atan2(y, x) * toDeg;
    return (brng + 360) % 360;
}

function initMap() {
    applyThemeUI(); 
    checkInstallState();
    
    if (!currentTargetCoords && !isLiveReceiver) { els.distInfo.innerHTML = t('whereTo', {player: activeTheme.player}); }

    map = L.map('map', { zoomControl: false, attributionControl: false }).setView([59.3, 14.1], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const clearControl = L.control({position: 'bottomright'});
    clearControl.onAdd = function () {
        const btn = L.DomUtil.create('button', '');
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
            navigator.geolocation.watchPosition(handlePositionUpdate, null, { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 });
        }
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
    updateButtonUI(); handleOrientationLayout(); window.addEventListener('resize', handleOrientationLayout); setupSwipeListener(); 
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
        lastRouteIndex: lastRouteIndex, distRemainingStr: distDisplay ? distDisplay.innerText : ""
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
    els.distInfo.innerHTML = t('whereTo', {player: activeTheme.player}); els.startBtn.classList.add('hidden');
    if (userCoords) { zoomToUser(); isShowingUser = false; isTracking = true; }
    updateLocateBtnText(); saveSession(); broadcastLiveState();
}

function setupSwipeListener() {
    els.gamePage.addEventListener('touchstart', e => { swipeStartX = e.changedTouches[0].screenX; }, {passive: true});
    els.gamePage.addEventListener('touchend', e => { let swipeEndX = e.changedTouches[0].screenX; if (gameState === 'GAME' && Math.abs(swipeEndX - swipeStartX) > 60) { toggleGameMap(); } }, {passive: true});
}

function toggleGameMap() {
    isGameMapVisible = !isGameMapVisible; const distDisplay = document.getElementById('game-distance-display');
    if (isGameMapVisible) {
        els.pathGrid.classList.add('hidden'); els.gameMapWrapper.classList.remove('hidden'); if (distDisplay) distDisplay.classList.remove('hidden');
        if (!gameMap) { gameMap = L.map('game-map', { zoomControl: false, attributionControl: false, dragging: false, touchZoom: false, scrollWheelZoom: false, doubleClickZoom: false }).setView(userCoords || [59.3, 14.1], 15); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(gameMap); }
        setTimeout(() => { gameMap.invalidateSize(true); updateGameMapView(true); }, 250);
    } else { els.gameMapWrapper.classList.add('hidden'); els.pathGrid.classList.remove('hidden'); if (distDisplay) distDisplay.classList.add('hidden'); }
}

function updateGameMapView(forceCenter = false) {
    if (!isGameMapVisible || gameState !== 'GAME' || !gameMap || !userCoords) return;
    if (!gameRouteLine && currentRouteCoords.length > 0) { gameRouteLine = L.polyline(currentRouteCoords, {color: '#007bff', weight: 4, opacity: 0.5}).addTo(gameMap); } 
    else if (gameRouteLine) { gameRouteLine.setLatLngs(currentRouteCoords); }
    if (!gameUserMarker) { gameUserMarker = L.circleMarker(userCoords, {radius: 7, fillColor: "#007bff", color: "#fff", weight: 2, fillOpacity: 1}).addTo(gameMap); } 
    else { gameUserMarker.setLatLng(userCoords); }
    let snapCoords = currentRouteCoords[lastRouteIndex];
    if (snapCoords) {
        if (!gameSnapMarker) { gameSnapMarker = L.circleMarker(snapCoords, {radius: 5, fillColor: "#FF9800", color: "#fff", weight: 2, fillOpacity: 1}).addTo(gameMap); } 
        else { gameSnapMarker.setLatLng(snapCoords); }
        let dashCoords = [userCoords, snapCoords];
        if (!gameDashedLine) { gameDashedLine = L.polyline(dashCoords, {color: '#ff4444', weight: 3, dashArray: '8, 8'}).addTo(gameMap); } 
        else { gameDashedLine.setLatLngs(dashCoords); }
    }
    gameMap.setView(userCoords, 16);
    if (currentHeading !== null) { if (els.gameMapElement) { let currentRot = renderedHeading % 360; if (currentRot < 0) currentRot += 360; let diff = currentHeading - currentRot; if (diff > 180) diff -= 360; if (diff < -180) diff += 360; renderedHeading += diff; els.gameMapElement.style.transform = `translateZ(0) rotate(${-renderedHeading}deg)`; } }
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
        swipeHintShown: swipeHintShown,
        gameState: gameState,
        initialTotalKm: initialTotalKm,
        maxStepsReached: maxStepsReached,
        lastRouteIndex: lastRouteIndex,
        midpointStepIndex: midpointStepIndex,
        hasReachedMidpoint: hasReachedMidpoint,
        gameStartCoords: (gameState === 'GAME' || gameState === 'FINISHED') ? startCoords : null
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
                gameStartCoords: savedGameStartCoords
            });
        }, 500);
    }
}

function handlePositionUpdate(pos) {
    if (isLiveReceiver) return; userCoords = [pos.coords.latitude, pos.coords.longitude];
    if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) { currentHeading = pos.coords.heading; } 
    else if (lastUserCoordsForHeading) { const dist = L.latLng(lastUserCoordsForHeading).distanceTo(userCoords); if (dist > 2) { currentHeading = getBearing(lastUserCoordsForHeading[0], lastUserCoordsForHeading[1], userCoords[0], userCoords[1]); } }
    if (!lastUserCoordsForHeading || L.latLng(lastUserCoordsForHeading).distanceTo(userCoords) > 2) { lastUserCoordsForHeading = [...userCoords]; }
    if (!currentTargetCoords && !isLiveReceiver) els.distInfo.innerHTML = t('whereTo', {player: activeTheme.player});
    
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

async function updateMapLogic() {
    if ((!userCoords && !fixedStartCoords) || !currentTargetCoords) return;
    const startPoint = fixedStartCoords || userCoords; const mode = modes[travelMode];
    let coordArray = []; coordArray.push([startPoint[1], startPoint[0]]);
    waypointsDit.forEach(wp => coordArray.push([wp.lng, wp.lat])); coordArray.push([currentTargetCoords.lng, currentTargetCoords.lat]);
    if (travelMode === 2) { waypointsHem.forEach(wp => coordArray.push([wp.lng, wp.lat])); coordArray.push([startPoint[1], startPoint[0]]); }
    
    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjgxOTdlMWQxYzhmODQ2NGY4NjM0OWYzNDI2NzM3OWM5IiwiaCI6Im11cm11cjY0In0=";
    const url = `https://api.openrouteservice.org/v2/directions/${mode.profile}/geojson`;
    
    try {
        const res = await fetch(url, { method: 'POST', headers: { 'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8', 'Content-Type': 'application/json', 'Authorization': apiKey }, body: JSON.stringify({ coordinates: coordArray, elevation: false, instructions: false, preference: 'recommended' }) });
        const data = await res.json();
        
        if (data.features && data.features.length > 0) {
            const route = data.features[0]; currentRouteCoords = route.geometry.coordinates.map(c => [c[1], c[0]]); 
            let splitIndex = currentRouteCoords.length;
            if (travelMode === 2) { let minD = Infinity; currentRouteCoords.forEach((c, i) => { const d = L.latLng(c).distanceTo(currentTargetCoords); if (d < minD) { minD = d; splitIndex = i; } }); }
            const coordsDit = currentRouteCoords.slice(0, splitIndex + 1); const coordsRetur = currentRouteCoords.slice(splitIndex);
            
            if (connectionLine) connectionLine.setLatLngs(coordsDit); else connectionLine = L.polyline(coordsDit, {color: '#007bff', weight: 4, opacity: 0.7}).addTo(map);
            if (travelMode === 2) { if (connectionLineReturn) connectionLineReturn.setLatLngs(coordsRetur); else connectionLineReturn = L.polyline(coordsRetur, {color: '#FF9800', weight: 4, opacity: 0.7}).addTo(map); } else if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
            
            const distKm = route.properties.summary.distance / 1000;
            if (!isLiveReceiver) {
                if (travelMode === 2) { els.distInfo.innerHTML = t('kmToAndBack', {dist: distKm.toFixed(2), target: currentTargetName}); } 
                else { els.distInfo.innerHTML = t('kmTo', {dist: distKm.toFixed(2), target: currentTargetName}); }
                els.startBtn.classList.remove('hidden');
            }
            checkRestoreGame();
        } else { fallbackDist(); }
    } catch (e) { fallbackDist(); }
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
    if (clearWaypoints) { waypointsDit = []; waypointsHem = []; waypointMarkers.forEach(m => map.removeLayer(m)); waypointMarkers = []; }
    if (connectionLine) { map.removeLayer(connectionLine); connectionLine = null; }
    if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
    currentTargetCoords = latlng;
    if (targetMarker) targetMarker.setLatLng(latlng); else targetMarker = L.marker(latlng).addTo(map);
    if (shouldSave) saveSession(); updateMapLogic(); if (!isLiveReceiver) updateLocateBtnText(); broadcastLiveState();
}

function zoomToUser(instant = false) { if (userCoords) { if (instant) map.setView(userCoords, 18); else map.flyTo(userCoords, 18); } }
function toggleView() { if (!currentTargetCoords || isShowingUser) { zoomToUser(); isShowingUser = false; isTracking = true; } else { map.flyTo(currentTargetCoords, 18); isShowingUser = true; isTracking = false; } updateLocateBtnText(); }
function updateLocateBtnText() { els.locateBtn.innerHTML = (!currentTargetCoords || isShowingUser) ? t('locateMe') : `🏁 ${currentTargetName.toUpperCase()}`; }
function toggleTravelMode() { travelMode = (travelMode + 1) % modes.length; els.modeBtn.innerText = modes[travelMode].icon; updateMapLogic(); saveSession(); broadcastLiveState(); }
async function requestWakeLock() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {} }
function releaseWakeLock() { if (wakeLock !== null) wakeLock.release().then(() => { wakeLock = null; }); }

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
        isCelebratingTurn = false;
    } else {
        if (!isLiveReceiver) startCoords = fixedStartCoords ? [...fixedStartCoords] : [...(userCoords || [0,0])];
        maxStepsReached = 0; lastRouteIndex = 0; hasReachedMidpoint = false; midpointStepIndex = -1; isCelebratingTurn = false;
        if (!isLiveReceiver) { const distStr = els.distInfo.innerText.split(' ')[0].replace('<b>', '').replace('</b>', ''); const totalDistanceKm = parseFloat(distStr) || 1; const f = modes[travelMode].factor; const r = totalDistanceKm % f; initialTotalKm = Math.max(1, Math.floor(totalDistanceKm / f) + (r > 0.05 ? 2 : 1)); }
    }

    isGameMapVisible = false; els.gameMapWrapper.classList.add('hidden'); const distDisplay = document.getElementById('game-distance-display'); if (distDisplay) distDisplay.classList.add('hidden');
    els.pathGrid.classList.remove('hidden');
    els.mapPage.classList.add('hidden'); els.gamePage.classList.remove('hidden'); if(!isLiveReceiver) els.shareBtn.classList.add('hidden');
    requestWakeLock(); els.pathGrid.innerHTML = `<div id="the-mouse">${activeTheme.player}</div>`;

    if (!swipeHintShown && !isLiveReceiver) { const hint = document.getElementById('swipe-hint'); if (hint) { hint.classList.remove('hidden'); setTimeout(() => hint.classList.add('show-hint'), 50); setTimeout(() => { hint.classList.remove('show-hint'); setTimeout(() => hint.classList.add('hidden'), 500); }, 4000); } swipeHintShown = true; saveSession(); }

    if (!isRestoring && !isLiveReceiver && travelMode === 2 && currentRouteCoords.length > 0) { let distToTarget = 0; let splitIndex = 0; let minD = Infinity; currentRouteCoords.forEach((c, i) => { const d = L.latLng(c).distanceTo(currentTargetCoords); if (d < minD) { minD = d; splitIndex = i; } }); for (let i = 0; i < splitIndex; i++) { distToTarget += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]); } const distStr = els.distInfo.innerText.split(' ')[0].replace('<b>', '').replace('</b>', ''); const totalDistanceKm = parseFloat(distStr) || 1; const f = modes[travelMode].factor; const r = totalDistanceKm % f; const tKm = distToTarget / 1000; midpointStepIndex = r > 0.05 ? (tKm < r ? 0 : Math.floor((tKm - r) / f) + 1) : Math.floor(tKm / f); }
    
    for (let i = 0; i < initialTotalKm; i++) {
        const step = document.createElement('div'); step.className = 'step'; step.id = `step-${i}`;
        if (i === initialTotalKm - 1) { step.innerHTML = activeTheme.target; } else if (i === midpointStepIndex) { step.innerHTML = activeTheme.target; } else { step.innerHTML = activeTheme.path; }
        if (isRestoring && i < maxStepsReached) step.classList.add('eat-animation');
        els.pathGrid.appendChild(step);
    }
    setTimeout(() => moveMouse(isLiveReceiver ? maxStepsReached : (isRestoring ? maxStepsReached : 0)), 100); if(!isLiveReceiver) broadcastLiveState();
    if (!isLiveReceiver && !isRestoring) saveSession();
}

function updateGameLogic() {
    if (gameState !== 'GAME' || !currentRouteCoords.length || isCelebratingTurn || isLiveReceiver) return;
    if (!hasReachedMidpoint && travelMode === 2) { const distToTarget = map.distance(userCoords, currentTargetCoords); if (distToTarget < 40) { triggerTurnAroundDance(); return; } }

    let minD = Infinity; let idx = lastRouteIndex; let searchLimit = (travelMode !== 2 || hasReachedMidpoint) ? currentRouteCoords.length : Math.floor(currentRouteCoords.length * 0.6); 
    for (let i = lastRouteIndex; i < searchLimit; i++) { const d = map.distance(userCoords, currentRouteCoords[i]); if (d < minD) { minD = d; idx = i; } }
    lastRouteIndex = idx;
    
    let traveledDist = 0; for (let i = 0; i < lastRouteIndex; i++) { traveledDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]); }
    let totalRouteDist = 0; for (let i = 0; i < currentRouteCoords.length - 1; i++) { totalRouteDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]); }
    
    let remainingDist = totalRouteDist - traveledDist; const distDisplay = document.getElementById('game-distance-display');
    if (distDisplay) { distDisplay.innerText = t('kmLeft', {dist: (remainingDist / 1000).toFixed(2)}); }

    const f = modes[travelMode].factor; const r = (totalRouteDist / 1000) % f; const tKm = traveledDist / 1000; let currentSteps = r > 0.05 ? (tKm < r ? 0 : Math.floor((tKm - r) / f) + 1) : Math.floor(tKm / f);
    if (!hasReachedMidpoint && travelMode === 2 && currentSteps > midpointStepIndex) { currentSteps = midpointStepIndex; }
    
    if (currentSteps > maxStepsReached) { 
        maxStepsReached = currentSteps; 
        saveSession(); 
    }
    
    for (let i = 0; i < initialTotalKm - 1; i++) { const s = document.getElementById(`step-${i}`); if (s) i < maxStepsReached ? s.classList.add('eat-animation') : s.classList.remove('eat-animation'); }
    
    const goal = (travelMode === 2) ? (fixedStartCoords || startCoords) : currentTargetCoords; const distToFinal = map.distance(userCoords, goal);
    if (travelMode === 2) { if (hasReachedMidpoint && distToFinal < 40 && maxStepsReached > (initialTotalKm * 0.8)) { moveMouse(initialTotalKm - 1); finishGame(); } else { moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 2))); } } 
    else { if (distToFinal < 40) { moveMouse(initialTotalKm - 1); finishGame(); } else { moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 2))); } }
    
    if (isGameMapVisible) { updateGameMapView(false); }
}

function triggerTurnAroundDance() {
    if (isCelebratingTurn) return; isCelebratingTurn = true; moveMouse(midpointStepIndex);
    const step = document.getElementById(`step-${midpointStepIndex}`); if(step) step.classList.add('eat-animation');
    const m = document.getElementById('the-mouse'); m.innerHTML = activeTheme.player + activeTheme.target; m.classList.add('turn-dance');
    playClickSound(); setTimeout(() => { m.classList.remove('turn-dance'); m.innerHTML = activeTheme.player; hasReachedMidpoint = true; isCelebratingTurn = false; maxStepsReached = midpointStepIndex + 1; saveSession(); }, 3000);
}

function moveMouse(index) {
    const m = document.getElementById('the-mouse'); const s = document.getElementById(`step-${index}`); const container = els.pathGrid;
    if (s && container) { m.style.left = s.offsetLeft + "px"; m.style.top = s.offsetTop + "px"; let targetScroll = (s.offsetTop + (s.offsetHeight * 2.5)) - container.clientHeight; if (targetScroll > 0) container.scrollTo({ top: targetScroll, behavior: 'smooth' }); }
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
    isGameMapVisible = false; els.gameMapWrapper.classList.add('hidden'); const distDisplay = document.getElementById('game-distance-display'); if (distDisplay) distDisplay.classList.add('hidden');
    els.pathGrid.classList.remove('hidden'); const m = document.getElementById('the-mouse');
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
    } catch (e) { alert("Sökningen fungerar tyvärr inte när du är offline. Använd kartan eller sparade platser istället!"); }
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
function closeInstructions() { els.welcomeOverlay.classList.add('hidden'); if(!isLiveReceiver) saveSession(); }

function shareApp(e) { 
    if (isLiveReceiver) { alert(t('alreadyLive')); return; }
    const oldMenu = document.getElementById('share-menu'); if (oldMenu) { oldMenu.remove(); return; }

    const menu = document.createElement('div'); menu.id = 'share-menu';
    menu.style.position = 'fixed'; menu.style.top = '65px'; menu.style.left = '15px'; menu.style.zIndex = '10001'; menu.style.background = 'white'; menu.style.borderRadius = '15px'; menu.style.padding = '10px'; menu.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)'; menu.style.display = 'flex'; menu.style.flexDirection = 'column'; menu.style.gap = '8px'; menu.style.border = `2px solid var(--primary)`;

    const btnNormal = document.createElement('button'); btnNormal.className = 'wp-menu-btn'; btnNormal.style.background = 'var(--blue)'; btnNormal.innerText = t('shareStatic');
    btnNormal.onclick = () => { menu.remove(); shareNormal(); };

    const btnLive = document.createElement('button'); btnLive.className = 'wp-menu-btn'; btnLive.style.background = '#ff4444'; btnLive.innerText = t('shareLive');
    btnLive.onclick = () => { menu.remove(); startLiveSharing(); };

    const btnShareApp = document.createElement('button'); btnShareApp.className = 'wp-menu-btn'; btnShareApp.style.background = 'var(--primary)'; btnShareApp.innerText = t('shareAppBtn');
    btnShareApp.onclick = () => { menu.remove(); shareOnlyApp(); };

    const btnCancel = document.createElement('button'); btnCancel.innerText = t('btnCancel'); btnCancel.style.fontSize = '0.7rem'; btnCancel.style.background = 'none'; btnCancel.onclick = () => menu.remove();

    menu.appendChild(btnNormal); menu.appendChild(btnLive); menu.appendChild(btnShareApp); menu.appendChild(btnCancel); document.body.appendChild(menu);

    setTimeout(() => { const close = (event) => { if (!menu.contains(event.target) && event.target.id !== 'share-btn') { menu.remove(); document.removeEventListener('click', close); } }; document.addEventListener('click', close); }, 100);
}

function shareNormal() {
    let shareUrl = window.location.origin + window.location.pathname; let title = 'Tracker'; let text = `Häng med på äventyr!`;
    if (currentTargetCoords) {
        const data = { t: [currentTargetCoords.lat, currentTargetCoords.lng], m: travelMode, wd: waypointsDit.map(w => [w.lat, w.lng]), wh: waypointsHem.map(w => [w.lat, w.lng]), n: currentTargetName, s: manualStartMarker ? fixedStartCoords : null };
        const encoded = btoa(JSON.stringify(data)); shareUrl += '?r=' + encoded; text = `Följ min rutt till ${currentTargetName}!`;
    }
    const d = {title: title, text: text, url: shareUrl}; 
    if(navigator.share) { navigator.share(d).catch(e => console.log("Delning avbruten")); } else { prompt("Kopiera länken för att dela rutt:", shareUrl); }
}

function startLiveSharing() {
    if (!liveSessionId) liveSessionId = Math.random().toString(36).substr(2, 9);
    if (!pusher) { pusher = new Pusher(pusherKey, getPusherConfig()); }
    liveChannel = pusher.subscribe(`private-live-${liveSessionId}`);
    liveChannel.bind('pusher:subscription_succeeded', () => { isLiveSharing = true; broadcastLiveState(); if(!liveBroadcastInterval) { liveBroadcastInterval = setInterval(() => { if (isLiveSharing) broadcastLiveState(); }, 3000); } });
    let shareUrl = window.location.origin + window.location.pathname + '?live=' + liveSessionId;
    const d = {title: 'Följ mig live!', text: `Följ jakten live! 🔴`, url: shareUrl};
    if(navigator.share) { navigator.share(d).catch(e => console.log("Delning avbruten")); } else { prompt("Kopiera länken för att dela live-rutt:", shareUrl); }
}

function shareOnlyApp() {
    let shareUrl = window.location.origin + window.location.pathname;
    const d = {title: 'Marcus Mouse & Cheese Tracker', text: `Kolla in den här appen! 🐭🧀`, url: shareUrl}; 
    if(navigator.share) { navigator.share(d).catch(e => console.log("Delning avbruten")); } else { prompt("Kopiera länken för att dela appen:", shareUrl); }
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

    // --- SPRÅKVAL ---
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

    // --- TEMAVAL ---
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

    // --- ÅTERSTÄLL ---
    const resetBtn = document.createElement('button'); resetBtn.innerText = t('devReset');
    resetBtn.style.background = '#FF9800'; resetBtn.style.color = 'white'; resetBtn.style.padding = '12px'; resetBtn.style.borderRadius = '10px'; resetBtn.style.marginTop = '15px'; resetBtn.style.fontWeight = 'bold'; resetBtn.style.border = 'none'; resetBtn.style.cursor = 'pointer';
    resetBtn.onclick = () => {
        localStorage.removeItem('app_lang');
        localStorage.removeItem('app_theme_override');
        location.reload();
    };
    menu.appendChild(resetBtn);

    // --- STÄNG ---
    const closeBtn = document.createElement('button'); closeBtn.innerText = t('devClose'); 
    closeBtn.style.background = '#ff4444'; closeBtn.style.color = 'white'; closeBtn.style.padding = '12px'; closeBtn.style.borderRadius = '10px'; closeBtn.style.marginTop = '5px'; closeBtn.style.fontWeight = 'bold'; closeBtn.style.border = 'none'; closeBtn.style.cursor = 'pointer'; 
    closeBtn.onclick = () => menu.remove(); 
    menu.appendChild(closeBtn);
    
    document.body.appendChild(menu);
}
// ----------------------

window.onload = initMap;