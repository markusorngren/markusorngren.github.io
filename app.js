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
    } else if (zoomBtn && !isGameMapVisible && gameState === 'GAME') {
        zoomBtn.innerText = isApplesZoomedOut ? t('btnZoomIn') : t('btnZoomOut');
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
let backgroundChannels = [];
let isLiveSharing = false;
let isLiveReceiver = false;
let liveSessionId = null;
let liveBroadcastInterval = null;

let savedLiveChannels = JSON.parse(localStorage.getItem('mouse_live_favs')) || {};

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
let isApplesZoomedOut = false;

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

// --- EGEN MODAL FÖR ATT SLIPPA WEBBLÄSARENS STANDARD ---
function showCustomModal({ title, text, placeholder, showInput, okText, cancelText, onResult }) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed'; overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.width = '100vw'; overlay.style.height = '100svh'; overlay.style.background = 'rgba(0,0,0,0.6)'; overlay.style.zIndex = '100000'; overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center';
    
    const modal = document.createElement('div');
    modal.style.background = 'white'; modal.style.padding = '20px'; modal.style.borderRadius = '15px'; modal.style.width = '80%'; modal.style.maxWidth = '300px'; modal.style.textAlign = 'center'; modal.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    
    const tEl = document.createElement('h3'); tEl.innerText = title; tEl.style.marginTop = '0'; tEl.style.color = '#333';
    modal.appendChild(tEl);
    
    if (text) {
        const dEl = document.createElement('p'); dEl.innerText = text; dEl.style.fontSize = '0.9rem'; dEl.style.color = '#555'; dEl.style.marginBottom = '15px'; dEl.style.whiteSpace = 'pre-wrap';
        modal.appendChild(dEl);
    }
    
    let iEl;
    if (showInput) {
        iEl = document.createElement('input'); iEl.type = 'text'; iEl.placeholder = placeholder || ''; iEl.style.width = '100%'; iEl.style.padding = '10px'; iEl.style.boxSizing = 'border-box'; iEl.style.borderRadius = '10px'; iEl.style.border = '2px solid #ccc'; iEl.style.marginBottom = '15px'; iEl.style.fontSize = '1rem'; iEl.style.textAlign = 'center';
        modal.appendChild(iEl);
    }
    
    const btnRow = document.createElement('div'); btnRow.style.display = 'flex'; btnRow.style.gap = '10px';
    
    if (cancelText) {
        const btnCancel = document.createElement('button'); btnCancel.innerText = cancelText; btnCancel.style.flex = '1'; btnCancel.style.padding = '10px'; btnCancel.style.borderRadius = '10px'; btnCancel.style.border = 'none'; btnCancel.style.background = '#eee'; btnCancel.style.color = '#333';
        btnCancel.onclick = () => { overlay.remove(); if (onResult) onResult(null); };
        btnRow.appendChild(btnCancel);
    }
    
    const btnOk = document.createElement('button'); btnOk.innerText = okText || 'OK'; btnOk.style.flex = '1'; btnOk.style.padding = '10px'; btnOk.style.borderRadius = '10px'; btnOk.style.border = 'none'; btnOk.style.background = 'var(--primary)'; btnOk.style.color = 'white';
    btnOk.onclick = () => { overlay.remove(); if (onResult) onResult(showInput ? iEl.value.trim() : true); };
    btnRow.appendChild(btnOk);
    
    modal.appendChild(btnRow);
    overlay.appendChild(modal); document.body.appendChild(overlay);
    if (showInput) iEl.focus();
}

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
    { target: 'toggle-game-view-btn', textKey: 'tut13', pos: 'top' }, 
    { target: 'zoom-toggle-btn', textKey: 'tut14', pos: 'top', action: 'show_dummy_map' }, 
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

    clearInterval(window.tutorialConfettiInterval);
    window.tutorialConfettiInterval = null;
    document.querySelectorAll('.confetti').forEach(c => c.remove());
    const m = document.getElementById('the-mouse');
    if (m) {
        m.classList.remove('victory');
        m.innerHTML = activeTheme.player;
    }
    document.getElementById('tutorial-spotlight').style.display = 'block'; 

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
    document.getElementById('tutorial-spotlight').style.display = 'block';

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

    textEl.innerHTML = t(step.textKey, { pathName: getThemePathName().toLowerCase() });
    
    if (index === tutorialSteps.length - 1) {
        nextBtn.innerHTML = t('btnFinish');
    } else {
        nextBtn.innerHTML = t('btnNext');
    }

    if (targetEl) {
        let rect = targetEl.getBoundingClientRect();
        
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
        if (gameState === 'GAME' && !isApplesZoomedOut) {
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
        
        // --- BACKGROUND LISTENING FOR FAVORITE LIVE CHANNELS ---
        if (Object.keys(savedLiveChannels).length > 0 && !savedIsLiveSharing) {
            if (!pusher) pusher = new Pusher(pusherKey, getPusherConfig());
            for (const ch in savedLiveChannels) {
                const bgChan = pusher.subscribe(`private-live-${ch}`);
                bgChan.bind('client-update', (data) => handleBackgroundLiveUpdate(ch, data));
                backgroundChannels.push(bgChan);
            }
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
        if (gameState === 'GAME' && !isGameMapVisible) {
            if (isApplesZoomedOut) autoFitApples();
            checkAppleZoomVisibility();
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

// --- NEW FUNCTION: Execute Live Search using Custom Modal ---
function executeLiveSearch() {
    let q = els.searchInput.value.trim();
    if (!q) {
        showCustomModal({
            title: t('promptLiveSearchTitle'),
            text: t('promptLiveSearchDesc'),
            showInput: true,
            placeholder: 'Sökord',
            okText: 'Sök',
            cancelText: t('btnCancel'),
            onResult: (val) => { if (val) handleLiveSearchInput(val); }
        });
        return;
    }
    handleLiveSearchInput(q);
}

function handleLiveSearchInput(q) {
    els.searchContainer.classList.add('hidden');
    els.searchInput.value = "";

    if(!savedLiveChannels[q]) {
        showCustomModal({
            title: t('promptSaveLiveTitle'),
            text: t('promptSaveLiveDesc', {channel: q}),
            showInput: true,
            placeholder: q,
            okText: 'Spara',
            cancelText: t('btnSkip'),
            onResult: (alias) => {
                if (alias !== null && alias !== "") {
                    savedLiveChannels[q] = alias;
                    localStorage.setItem('mouse_live_favs', JSON.stringify(savedLiveChannels));
                }
                window.location.href = window.location.origin + window.location.pathname + '?live=' + encodeURIComponent(q);
            }
        });
    } else {
        window.location.href = window.location.origin + window.location.pathname + '?live=' + encodeURIComponent(q);
    }
}

// --- NEW FUNCTION: Background Live Listener ---
let autoPromptCooldown = false;
function handleBackgroundLiveUpdate(channelId, data) {
    if (isLiveReceiver || isLiveSharing || autoPromptCooldown) return;

    autoPromptCooldown = true;
    const alias = savedLiveChannels[channelId] || channelId;
    
    // Custom Confirm to avoid native dialog
    showCustomModal({
        title: "Sändning upptäckt! 🔴",
        text: t('autoJoinLive', {name: alias}),
        okText: 'Ja',
        cancelText: 'Nej',
        onResult: (res) => {
            if (res) {
                window.location.href = window.location.origin + window.location.pathname + '?live=' + encodeURIComponent(channelId);
            }
        }
    });
    
    setTimeout(() => { autoPromptCooldown = false; }, 60000);
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

function handleZoomClick() {
    if (!els.gameMapWrapper.classList.contains('hidden')) {
        toggleGameZoom();
    } else {
        toggleApplesZoom();
    }
}

function checkAppleZoomVisibility() {
    const zoomBtn = document.getElementById('zoom-toggle-btn');
    if (!zoomBtn || gameState !== 'GAME' || isGameMapVisible) return;

    if (isApplesZoomedOut) {
        zoomBtn.classList.remove('hidden');
        return;
    }

    const grid = els.pathGrid;
    if (grid.scrollHeight > grid.clientHeight + 5) {
        zoomBtn.classList.remove('hidden');
    } else {
        zoomBtn.classList.add('hidden');
    }
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

function toggleApplesZoom() {
    isApplesZoomedOut = !isApplesZoomedOut;
    const zoomBtn = document.getElementById('zoom-toggle-btn');
    const grid = els.pathGrid;

    if (isApplesZoomedOut) {
        grid.classList.add('zoomed-out');
        if (zoomBtn) zoomBtn.innerText = t('btnZoomIn');
        autoFitApples();
    } else {
        grid.classList.remove('zoomed-out');
        if (zoomBtn) zoomBtn.innerText = t('btnZoomOut');
        grid.style.removeProperty('--apple-size');
        grid.style.removeProperty('--apple-cols');
        grid.style.removeProperty('--apple-font');
        setTimeout(() => {
            moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 1)));
            checkAppleZoomVisibility();
        }, 50);
    }
}

function autoFitApples() {
    const container = els.pathGrid;
    if (!container || !isApplesZoomedOut || gameState !== 'GAME') return;

    const N = initialTotalKm;
    if (N <= 0) return;

    const style = window.getComputedStyle(container);
    const padLeft = parseFloat(style.paddingLeft);
    const padRight = parseFloat(style.paddingRight);
    const padTop = parseFloat(style.paddingTop);
    const padBottom = parseFloat(style.paddingBottom);

    const W = container.clientWidth - padLeft - padRight;
    const H = container.clientHeight - padTop - padBottom;
    const gap = 5;

    let bestS = 8; 
    for (let s = 40; s >= 8; s--) { 
        let cols = Math.floor((W + gap) / (s + gap));
        if (cols <= 0) cols = 1;
        let rows = Math.ceil(N / cols);
        if (rows * s + (rows - 1) * gap <= H) {
            bestS = s;
            break; 
        }
    }

    container.style.setProperty('--apple-size', bestS + 'px');
    container.style.setProperty('--apple-cols', Math.floor((W + gap) / (bestS + gap)));
    container.style.setProperty('--apple-font', (bestS * 0.6) + 'px');

    setTimeout(() => {
        moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 1)));
    }, 50);
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
            
            const releaseMap = () => {
                if (!isProgrammaticMove) {
                    gameMapAutoCenter = false;
                    isGameMapZoomedOut = false;
                    const zb = document.getElementById('zoom-toggle-btn');
                    if (zb) zb.innerText = t('btnCenter');
                }
            };

            gameMap.on('movestart', releaseMap);
            gameMap.on('dragstart', releaseMap);
            gameMap.on('zoomstart', releaseMap);
            gameMap.on('rotatestart', releaseMap);
        }
        
        gameMapAutoCenter = true; 
        isGameMapZoomedOut = false;
        if (zoomBtn) zoomBtn.innerText = t('btnZoomOut');
        
        setTimeout(() => { gameMap.invalidateSize(true); updateGameMapView(true); }, 250);
    } else { 
        els.gameMapWrapper.classList.add('hidden'); 
        els.pathGrid.classList.remove('hidden'); 
        if (toggleBtn) toggleBtn.innerText = t('btnMap');
        
        if (zoomBtn) {
            zoomBtn.innerText = isApplesZoomedOut ? t('btnZoomIn') : t('btnZoomOut');
        }
        
        if (isApplesZoomedOut) {
            setTimeout(() => { autoFitApples(); checkAppleZoomVisibility(); }, 50);
        } else {
            setTimeout(() => {
                moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 1)));
                checkAppleZoomVisibility();
            }, 50);
        }
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
    if (zoomBtn) {
        zoomBtn.innerText = isApplesZoomedOut ? t('btnZoomIn') : t('btnZoomOut');
    }

    if (!isRestoring && !isLiveReceiver && travelMode === 2 && currentRouteCoords.length > 0) { let distToTarget = 0; let splitIndex = 0; let minD = Infinity; currentRouteCoords.forEach((c, i) => { const d = L.latLng(c).distanceTo(currentTargetCoords); if (d < minD) { minD = d; splitIndex = i; } }); for (let i = 0; i < splitIndex; i++) { distToTarget += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]); } const distStr = els.distInfo.innerText.split(' ')[0].replace('<b>', '').replace('</b>', ''); const totalDistanceKm = parseFloat(distStr) || 1; const f = modes[travelMode].factor; const r = totalDistanceKm % f; const tKm = distToTarget / 1000; midpointStepIndex = r > 0.05 ? (tKm < r ? 0 : Math.floor((tKm - r) / f) + 1) : Math.floor(tKm / f); }

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
        if (isApplesZoomedOut) autoFitApples();
        moveMouse(isLiveReceiver ? maxStepsReached : (isRestoring ? maxStepsReached : 0)); 
        updateBetaDistances(); 
        checkAppleZoomVisibility();
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
            else { if (d[0].address && d[0].address.road && firstPart === d[0].address.road) { currentTargetName = d[0].address.road + (d[0].address.house_number ? ' ' + d[0].address.housenumber : ''); } else { currentTargetName = firstPart; } }
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


function startLiveSharingMenu() {
    const oldMenu = document.getElementById('share-live-menu'); 
    if (oldMenu) { oldMenu.remove(); return; }

    const menu = document.createElement('div'); menu.id = 'share-live-menu';
    menu.style.position = 'fixed'; menu.style.top = '65px'; menu.style.left = '15px'; menu.style.zIndex = '10002'; menu.style.background = 'white'; menu.style.borderRadius = '15px'; menu.style.padding = '10px'; menu.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)'; menu.style.display = 'flex'; menu.style.flexDirection = 'column'; menu.style.gap = '8px'; menu.style.border = `2px solid #ff4444`;

    const btnInternal = document.createElement('button'); btnInternal.className = 'wp-menu-btn'; btnInternal.style.background = '#ff4444'; btnInternal.innerText = t('shareLiveInternal');
    btnInternal.onclick = () => { menu.remove(); startLiveSharingInternal(); };

    const btnExternal = document.createElement('button'); btnExternal.className = 'wp-menu-btn'; btnExternal.style.background = 'var(--blue)'; btnExternal.innerText = t('shareLiveExternal');
    btnExternal.onclick = () => { menu.remove(); startLiveSharingExternal(); };

    const btnCancel = document.createElement('button'); btnCancel.innerText = t('btnCancel'); btnCancel.style.fontSize = '0.7rem'; btnCancel.style.background = 'none'; btnCancel.onclick = () => menu.remove();

    menu.appendChild(btnInternal); menu.appendChild(btnExternal); menu.appendChild(btnCancel);
    document.body.appendChild(menu);

    setTimeout(() => { const close = (event) => { if (!menu.contains(event.target) && event.target.id !== 'share-btn-live') { menu.remove(); document.removeEventListener('click', close); } }; document.addEventListener('click', close); }, 100);
}


function shareApp(e) { 
    const oldMenu = document.getElementById('share-menu'); if (oldMenu) { oldMenu.remove(); return; }

    const menu = document.createElement('div'); menu.id = 'share-menu';
    menu.style.position = 'fixed'; menu.style.top = '65px'; menu.style.left = '15px'; menu.style.zIndex = '10001'; menu.style.background = 'white'; menu.style.borderRadius = '15px'; menu.style.padding = '10px'; menu.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)'; menu.style.display = 'flex'; menu.style.flexDirection = 'column'; menu.style.gap = '8px'; menu.style.border = `2px solid var(--primary)`;

    const btnNormal = document.createElement('button'); btnNormal.id = 'share-btn-static'; btnNormal.className = 'wp-menu-btn'; btnNormal.style.background = 'var(--blue)'; btnNormal.innerText = t('shareStatic');
    btnNormal.onclick = () => { menu.remove(); shareNormal(); };

    const btnLive = document.createElement('button'); btnLive.id = 'share-btn-live'; btnLive.className = 'wp-menu-btn'; btnLive.style.background = '#ff4444'; btnLive.innerText = t('shareLive');
    btnLive.onclick = () => { menu.remove(); startLiveSharingMenu(); };

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

function startLiveSharingExternal() {
    if (isLiveReceiver && liveSessionId) {
        let shareUrl = window.location.origin + window.location.pathname + '?live=' + liveSessionId;
        const d = {title: t('followLiveTitle'), text: t('followLiveText'), url: shareUrl};
        if(navigator.share) { 
            navigator.share(d).catch(e => console.log("Delning avbruten")); 
        } else { 
            prompt(t('copyLiveLink'), shareUrl); 
        }
        return;
    }

    if (!liveSessionId) liveSessionId = Math.random().toString(36).substr(2, 9);

    if (!pusher) { pusher = new Pusher(pusherKey, getPusherConfig()); }
    liveChannel = pusher.subscribe(`private-live-${liveSessionId}`);
    liveChannel.bind('pusher:subscription_succeeded', () => { 
        isLiveSharing = true; 
        broadcastLiveState(); 
        if(!liveBroadcastInterval) { 
            liveBroadcastInterval = setInterval(() => { if (isLiveSharing) broadcastLiveState(); }, 3000); 
        } 
    });

    let shareUrl = window.location.origin + window.location.pathname + '?live=' + encodeURIComponent(liveSessionId);
    
    const d = {title: t('followLiveTitle'), text: t('followLiveText'), url: shareUrl};
    if(navigator.share) { navigator.share(d).catch(e => console.log("Delning avbruten")); } else { prompt(t('copyLiveLink'), shareUrl); }
}

function startLiveSharingInternal() {
    showCustomModal({
        title: t('promptCustomChannelTitle'),
        text: t('promptCustomChannelDesc'),
        showInput: true,
        placeholder: 'Kanalnamn',
        okText: t('start', {target: ''}).trim(),
        cancelText: t('btnCancel'),
        onResult: (customName) => {
            if (customName) {
                liveSessionId = customName.trim();
                if (!pusher) { pusher = new Pusher(pusherKey, getPusherConfig()); }
                liveChannel = pusher.subscribe(`private-live-${liveSessionId}`);
                liveChannel.bind('pusher:subscription_succeeded', () => { 
                    isLiveSharing = true; 
                    broadcastLiveState(); 
                    if(!liveBroadcastInterval) { 
                        liveBroadcastInterval = setInterval(() => { if (isLiveSharing) broadcastLiveState(); }, 3000); 
                    } 
                });
                
                showCustomModal({
                    title: t('liveInternalSuccessTitle'),
                    text: t('liveInternalSuccessDesc', {name: liveSessionId}),
                    okText: 'OK'
                });
            }
        }
    });
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