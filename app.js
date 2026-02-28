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

// Pusher Config
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

let map, targetMarker, userMarker, connectionLine, connectionLineReturn, userCoords;
let fixedStartCoords = null; 
let currentTargetCoords = null;
let waypointsDit = []; 
let waypointsHem = []; 
let waypointMarkers = []; 

let startCoords = null;
let currentTargetName = "MÅLET";
let initialZoomPerformed = false; 
let isShowingUser = true; 
let isTracking = false; 
let savedLocations = JSON.parse(localStorage.getItem('mouse_favs')) || [null, null, null, null];
let wakeLock = null;
let currentRouteCoords = []; 
let ignoreClick = false; 
let confettiInterval = null;

let maxStepsReached = 0;
let lastRouteIndex = 0; 
let hasReachedMidpoint = false; 
let midpointStepIndex = -1; 
let isCelebratingTurn = false; 
let swipeHintShown = false; 

let gameMap = null;
let gameRouteLine = null, gameUserMarker = null, gameSnapMarker = null, gameDashedLine = null;
let isGameMapVisible = false;
let swipeStartX = 0;

let travelMode = 0; 
const modes = [
    { icon: '🚗', factor: 1.0, osrm: 'car' },
    { icon: '🚶', factor: 0.1, osrm: 'foot' },
    { icon: '🚶↔️', factor: 0.1, osrm: 'foot' } 
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
    gameMapElement: document.getElementById('game-map')
};

let sessionRaw = JSON.parse(localStorage.getItem('mouse_session'));
let lastTarget = null;

if (sessionRaw && (Date.now() - sessionRaw.timestamp < 10800000)) {
    lastTarget = sessionRaw.target;
    travelMode = sessionRaw.travelMode || 0;
    waypointsDit = (sessionRaw.waypointsDit || []).map(p => L.latLng(p.lat, p.lng));
    waypointsHem = (sessionRaw.waypointsHem || []).map(p => L.latLng(p.lat, p.lng));
    swipeHintShown = sessionRaw.swipeHintShown || false;
    if (sessionRaw.startCoords) {
        fixedStartCoords = sessionRaw.startCoords;
    }
    els.welcomeOverlay.classList.add('hidden');
}

let audioCtx;
let gameState = 'MAP';
let initialTotalKm = 0;

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

// Skapar inställningarna för lokalt kryptolås (tillåter klienten att prata direkt med Pusher)
function getPusherAuthorizer() {
    return (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                const stringToSign = socketId + ':' + channel.name;
                const signature = CryptoJS.HmacSHA256(stringToSign, pusherSecret).toString(CryptoJS.enc.Hex);
                callback(false, { auth: pusherKey + ':' + signature });
            }
        };
    };
}

function initMap() {
    checkInstallState();
    map = L.map('map', { zoomControl: false, attributionControl: false }).setView([59.3, 14.1], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const clearControl = L.control({position: 'bottomright'});
    clearControl.onAdd = function () {
        const btn = L.DomUtil.create('button', '');
        btn.innerHTML = 'RENSA';
        btn.style.background = 'rgba(255, 255, 255, 0.6)';
        btn.style.border = '2px solid rgba(0,0,0,0.1)';
        btn.style.padding = '8px 12px';
        btn.style.borderRadius = '10px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.color = '#333';
        btn.style.backdropFilter = 'blur(4px)';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        btn.style.marginBottom = '15px'; 
        btn.onclick = function(e) {
            if(isLiveReceiver) return;
            L.DomEvent.stopPropagation(e);
            clearMapData();
        };
        L.DomEvent.disableClickPropagation(btn); 
        return btn;
    };
    clearControl.addTo(map);

    const urlParams = new URLSearchParams(window.location.search);
    
    // KONTROLLERA OM DET FINNS EN LIVE SESSION I URL:EN
    const liveId = urlParams.get('live');
    if (liveId) {
        isLiveReceiver = true;
        liveSessionId = liveId;
        els.welcomeOverlay.classList.add('hidden');
        els.actionContainer.classList.add('hidden');
        const cancelBtn = document.getElementById('cancel-game-btn');
        if (cancelBtn) cancelBtn.classList.add('hidden');
        els.distInfo.innerHTML = "🔴 Laddar live-rutt...";

        // Initiera Pusher direkt som klient för mottagare
        pusher = new Pusher(pusherKey, { 
            cluster: pusherCluster,
            authorizer: getPusherAuthorizer()
        });
        liveChannel = pusher.subscribe(`private-live-${liveSessionId}`);
        liveChannel.bind('client-update', handleLiveUpdate);

        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        // VANLIG START
        const routeData = urlParams.get('r');
        if (routeData) {
            try {
                const data = JSON.parse(atob(routeData));
                travelMode = data.m || 0;
                currentTargetName = data.n || "Delad rutt";
                currentTargetCoords = L.latLng(data.t[0], data.t[1]);
                waypointsDit = (data.wd || []).map(p => L.latLng(p[0], p[1]));
                waypointsHem = (data.wh || []).map(p => L.latLng(p[0], p[1]));
                window.history.replaceState({}, document.title, window.location.pathname);
                els.welcomeOverlay.classList.add('hidden');
            } catch (e) {
                console.error("Kunde inte läsa delad rutt", e);
            }
        }

        if (currentTargetCoords) {
            setTarget(currentTargetCoords, false, false, false);
            map.setView(currentTargetCoords, 14); 
            initialZoomPerformed = true;
            setupSavedWaypoints();
        } else if (lastTarget) {
            currentTargetName = lastTarget.name || "Mål";
            setTarget(lastTarget.coords, false, false, false);
            map.setView(lastTarget.coords, 14); 
            initialZoomPerformed = true;
            setupSavedWaypoints();
        }

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(handlePositionUpdate, null, { 
                enableHighAccuracy: true, 
                maximumAge: 5000, 
                timeout: 10000 
            });
        }
    }

    map.on('click', async e => { 
        if (isLiveReceiver) return; // Blockera klick om man bara kollar
        if (gameState !== 'MAP') return;
        if (ignoreClick) return; 
        playClickSound(); 
        
        currentTargetName = "Söker adress..."; 
        setTarget(e.latlng, true, true, true);

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
            const d = await res.json();
            if (d && d.display_name) {
                const parts = d.display_name.split(',');
                currentTargetName = parts[0].trim();
                updateMapLogic(); 
                updateLocateBtnText(); 
                saveSession();
            }
        } catch (err) {
            currentTargetName = "Markerad plats";
            updateMapLogic();
        }
    });

    map.on('contextmenu', e => {
        if (isLiveReceiver) return;
        if(gameState !== 'MAP' || !currentTargetCoords) return;
        ignoreClick = true;
        setTimeout(() => { ignoreClick = false; }, 600);
        playClickSound();
        if (travelMode === 2) { showWaypointChoiceMenu(e); } else { addWaypoint(e.latlng, 'dit'); }
    });

    map.on('movestart', (e) => { if (!e.hard) isTracking = false; });
    
    if (!isLiveReceiver) {
        setupInteractions();
    }
    updateButtonUI();
    handleOrientationLayout();
    window.addEventListener('resize', handleOrientationLayout);
    setupSwipeListener(); 
}

function setupSavedWaypoints() {
    waypointsDit.forEach(wp => {
        const m = L.circleMarker(wp, { radius: 7, fillColor: "#2196F3", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map);
        m.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(m, wp); });
        waypointMarkers.push(m);
    });
    waypointsHem.forEach(wp => {
        const m = L.circleMarker(wp, { radius: 7, fillColor: "#FF9800", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map);
        m.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(m, wp); });
        waypointMarkers.push(m);
    });
    if (els.modeBtn) els.modeBtn.innerText = modes[travelMode].icon;
    updateMapLogic();
}

// ---------------- LIVESÄNDNINGS LOGIK ----------------
function broadcastLiveState() {
    if (!isLiveSharing || !liveSessionId || !liveChannel) return;
    
    const distDisplay = document.getElementById('game-distance-display');
    liveChannel.trigger('client-update', {
        userCoords: userCoords,
        targetCoords: currentTargetCoords ? {lat: currentTargetCoords.lat, lng: currentTargetCoords.lng} : null,
        targetName: currentTargetName,
        travelMode: travelMode,
        waypointsDit: waypointsDit.map(w => ({lat: w.lat, lng: w.lng})),
        waypointsHem: waypointsHem.map(w => ({lat: w.lat, lng: w.lng})),
        gameState: gameState,
        initialTotalKm: initialTotalKm,
        midpointStepIndex: midpointStepIndex,
        maxStepsReached: maxStepsReached,
        lastRouteIndex: lastRouteIndex,
        distRemainingStr: distDisplay ? distDisplay.innerText : ""
    });
}

function handleLiveUpdate(parsed) {
    if (!parsed) return;

    // Synka viktiga variabler först
    if (parsed.initialTotalKm) initialTotalKm = parsed.initialTotalKm;
    if (parsed.midpointStepIndex !== undefined) midpointStepIndex = parsed.midpointStepIndex;

    // Kolla om målet har ändrats
    if (parsed.targetCoords && (!currentTargetCoords || currentTargetCoords.lat !== parsed.targetCoords.lat || currentTargetCoords.lng !== parsed.targetCoords.lng)) {
        currentTargetName = parsed.targetName;
        travelMode = parsed.travelMode;
        waypointsDit = parsed.waypointsDit.map(w => L.latLng(w.lat, w.lng));
        waypointsHem = parsed.waypointsHem.map(w => L.latLng(w.lat, w.lng));
        setTarget(L.latLng(parsed.targetCoords.lat, parsed.targetCoords.lng), false, true, false);
        els.distInfo.innerHTML = `🔴 Du följer resan till ${currentTargetName}...`;
    }

    // Uppdatera sändarens position på mottagarens skärm
    if (parsed.userCoords) {
        userCoords = parsed.userCoords;
        if (!userMarker) {
            userMarker = L.circleMarker(userCoords, {radius: 8, fillColor: "#007bff", color: "#fff", weight: 2, fillOpacity: 0.8}).addTo(map);
        } else userMarker.setLatLng(userCoords);
        if (gameState === 'MAP') map.panTo(userCoords);
        if (!initialZoomPerformed) { map.flyTo(userCoords, 18); initialZoomPerformed = true; }
    }

    // Kontrollera om spelstatusen har ändrats
    if (parsed.gameState === 'GAME' && gameState !== 'GAME') {
        startGame(); 
    } else if (parsed.gameState === 'FINISHED' && gameState !== 'FINISHED') {
        finishGame();
    } else if (parsed.gameState === 'MAP' && (gameState === 'GAME' || gameState === 'FINISHED')) {
        stopGame();
    }

    // Uppdatera spelet direkt i realtid utan att mottagaren behöver räkna om kartan
    if (gameState === 'GAME' && parsed.maxStepsReached !== undefined) {
        maxStepsReached = parsed.maxStepsReached;
        if (parsed.lastRouteIndex !== undefined) lastRouteIndex = parsed.lastRouteIndex;
        
        for (let i = 0; i < initialTotalKm - 1; i++) {
            const s = document.getElementById(`step-${i}`);
            if (s) i < maxStepsReached ? s.classList.add('eat-animation') : s.classList.remove('eat-animation');
        }
        moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 1)));
        
        const distDisplay = document.getElementById('game-distance-display');
        if (distDisplay && parsed.distRemainingStr) {
            distDisplay.innerText = parsed.distRemainingStr;
        }
        
        if (isGameMapVisible) {
            updateGameMapView(false);
        }
    }
}
// ----------------------------------------------------

function clearMapData() {
    playClickSound();
    
    currentTargetCoords = null;
    currentTargetName = "MÅLET";
    
    if (targetMarker) { map.removeLayer(targetMarker); targetMarker = null; }
    if (connectionLine) { map.removeLayer(connectionLine); connectionLine = null; }
    if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
    
    waypointsDit = []; 
    waypointsHem = []; 
    waypointMarkers.forEach(m => map.removeLayer(m)); 
    waypointMarkers = [];
    
    fixedStartCoords = null;
    
    els.distInfo.innerHTML = "Vart ska vi åka? 🐭";
    els.startBtn.classList.add('hidden');
    
    if (userCoords) {
        zoomToUser();
        isShowingUser = false;
        isTracking = true;
    }
    
    updateLocateBtnText();
    saveSession();
    broadcastLiveState();
}

function setupSwipeListener() {
    els.gamePage.addEventListener('touchstart', e => {
        swipeStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    els.gamePage.addEventListener('touchend', e => {
        let swipeEndX = e.changedTouches[0].screenX;
        if (gameState === 'GAME' && Math.abs(swipeEndX - swipeStartX) > 60) {
            toggleGameMap();
        }
    }, {passive: true});
}

function toggleGameMap() {
    isGameMapVisible = !isGameMapVisible;
    const distDisplay = document.getElementById('game-distance-display');
    if (isGameMapVisible) {
        els.pathGrid.classList.add('hidden');
        els.gameMapElement.classList.remove('hidden');
        if (distDisplay) distDisplay.classList.remove('hidden');
        if (!gameMap) {
            gameMap = L.map('game-map', { 
                zoomControl: false, attributionControl: false,
                dragging: false, touchZoom: false, scrollWheelZoom: false, doubleClickZoom: false
            }).setView(userCoords || [59.3, 14.1], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(gameMap);
        }
        setTimeout(() => {
            gameMap.invalidateSize();
            updateGameMapView(true);
        }, 50);
    } else {
        els.gameMapElement.classList.add('hidden');
        els.pathGrid.classList.remove('hidden');
        if (distDisplay) distDisplay.classList.add('hidden');
    }
}

function updateGameMapView(forceCenter = false) {
    if (!isGameMapVisible || gameState !== 'GAME' || !gameMap || !userCoords) return;
    
    if (!gameRouteLine && currentRouteCoords.length > 0) {
        gameRouteLine = L.polyline(currentRouteCoords, {color: '#007bff', weight: 4, opacity: 0.5}).addTo(gameMap);
    } else if (gameRouteLine) {
        gameRouteLine.setLatLngs(currentRouteCoords);
    }
    
    if (!gameUserMarker) {
        gameUserMarker = L.circleMarker(userCoords, {radius: 7, fillColor: "#007bff", color: "#fff", weight: 2, fillOpacity: 1}).addTo(gameMap);
    } else {
        gameUserMarker.setLatLng(userCoords);
    }
    
    let snapCoords = currentRouteCoords[lastRouteIndex];
    if (snapCoords) {
        if (!gameSnapMarker) {
            gameSnapMarker = L.circleMarker(snapCoords, {radius: 5, fillColor: "#FF9800", color: "#fff", weight: 2, fillOpacity: 1}).addTo(gameMap);
        } else {
            gameSnapMarker.setLatLng(snapCoords);
        }
        let dashCoords = [userCoords, snapCoords];
        if (!gameDashedLine) {
            gameDashedLine = L.polyline(dashCoords, {color: '#ff4444', weight: 3, dashArray: '8, 8'}).addTo(gameMap);
        } else {
            gameDashedLine.setLatLngs(dashCoords);
        }
    }
    
    gameMap.setView(userCoords, 16);
}

function saveSession() {
    if (isLiveReceiver) return;
    const sessionData = {
        target: currentTargetCoords ? { coords: {lat: currentTargetCoords.lat, lng: currentTargetCoords.lng}, name: currentTargetName } : null,
        startCoords: fixedStartCoords,
        travelMode: travelMode,
        waypointsDit: waypointsDit.map(wp => ({lat: wp.lat, lng: wp.lng})),
        waypointsHem: waypointsHem.map(wp => ({lat: wp.lat, lng: wp.lng})),
        timestamp: Date.now(),
        swipeHintShown: swipeHintShown
    };
    localStorage.setItem('mouse_session', JSON.stringify(sessionData));
}

function removeWaypoint(marker, latlng) {
    if (isLiveReceiver) return;
    playClickSound();
    let index = waypointsDit.findIndex(wp => wp.lat === latlng.lat && wp.lng === latlng.lng);
    if (index !== -1) { waypointsDit.splice(index, 1); } 
    else {
        index = waypointsHem.findIndex(wp => wp.lat === latlng.lat && wp.lng === latlng.lng);
        if (index !== -1) waypointsHem.splice(index, 1);
    }
    map.removeLayer(marker);
    waypointMarkers = waypointMarkers.filter(m => m !== marker);
    updateMapLogic();
    saveSession();
    broadcastLiveState();
}

function showWaypointChoiceMenu(e) {
    const oldMenu = document.getElementById('waypoint-menu');
    if (oldMenu) oldMenu.remove();
    const menu = document.createElement('div');
    menu.id = 'waypoint-menu';
    menu.style.left = Math.min(window.innerWidth - 160, Math.max(10, e.containerPoint.x)) + "px";
    menu.style.top = Math.min(window.innerHeight - 120, Math.max(10, e.containerPoint.y)) + "px";
    const btnDit = document.createElement('button');
    btnDit.className = 'wp-menu-btn'; btnDit.style.background = 'var(--blue)'; btnDit.innerText = 'På vägen dit';
    btnDit.onclick = () => { addWaypoint(e.latlng, 'dit'); menu.remove(); };
    const btnHem = document.createElement('button');
    btnHem.className = 'wp-menu-btn'; btnHem.style.background = 'var(--orange)'; btnHem.innerText = 'På vägen tillbaka';
    btnHem.onclick = () => { addWaypoint(e.latlng, 'hem'); menu.remove(); };
    const btnCancel = document.createElement('button');
    btnCancel.innerText = 'Avbryt'; btnCancel.style.fontSize = '0.7rem'; btnCancel.style.background = 'none';
    btnCancel.onclick = () => menu.remove();
    menu.appendChild(btnDit); menu.appendChild(btnHem); menu.appendChild(btnCancel);
    document.body.appendChild(menu);
    setTimeout(() => { const close = () => { menu.remove(); document.removeEventListener('click', close); }; document.addEventListener('click', close); }, 100);
}

function addWaypoint(latlng, direction) {
    if (!fixedStartCoords && userCoords) fixedStartCoords = [...userCoords];
    if (direction === 'dit') { waypointsDit.push(latlng); } else { waypointsHem.push(latlng); }
    const color = direction === 'dit' ? "#2196F3" : "#FF9800";
    const wpMarker = L.circleMarker(latlng, { radius: 7, fillColor: color, color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map);
    wpMarker.on('contextmenu', (e) => {
        L.DomEvent.stopPropagation(e);
        removeWaypoint(wpMarker, latlng);
    });
    waypointMarkers.push(wpMarker);
    updateMapLogic();
    saveSession();
    broadcastLiveState();
}

function handlePositionUpdate(pos) {
    userCoords = [pos.coords.latitude, pos.coords.longitude];
    if (!currentTargetCoords && !isLiveReceiver) els.distInfo.innerHTML = "Vart ska vi åka? 🐭";
    if (!userMarker) {
        userMarker = L.circleMarker(userCoords, {radius: 8, fillColor: "#007bff", color: "#fff", weight: 2, fillOpacity: 0.8}).addTo(map);
    } else userMarker.setLatLng(userCoords);
    if (isTracking && gameState === 'MAP') map.panTo(userCoords);
    if (!initialZoomPerformed) { zoomToUser(); initialZoomPerformed = true; isTracking = true; }
    if (gameState === 'MAP') { if (!fixedStartCoords) updateMapLogic(); }
    else if (gameState === 'GAME') updateGameLogic();
}

async function updateMapLogic() {
    if ((!userCoords && !fixedStartCoords) || !currentTargetCoords) return;
    const startPoint = fixedStartCoords || userCoords;
    const mode = modes[travelMode];
    let pts = [`${startPoint[1]},${startPoint[0]}`];
    waypointsDit.forEach(wp => pts.push(`${wp.lng},${wp.lat}`));
    pts.push(`${currentTargetCoords.lng},${currentTargetCoords.lat}`);
    if (travelMode === 2) {
        waypointsHem.forEach(wp => pts.push(`${wp.lng},${wp.lat}`));
        pts.push(`${startPoint[1]},${startPoint[0]}`);
    }
    const url = `https://router.project-osrm.org/route/v1/${mode.osrm}/${pts.join(';')}?overview=full&geometries=geojson`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.code === 'Ok') {
            const route = data.routes[0];
            currentRouteCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            let splitIndex = currentRouteCoords.length;
            if (travelMode === 2) {
                let minD = Infinity;
                currentRouteCoords.forEach((c, i) => {
                    const d = L.latLng(c).distanceTo(currentTargetCoords);
                    if (d < minD) { minD = d; splitIndex = i; }
                });
            }
            const coordsDit = currentRouteCoords.slice(0, splitIndex + 1);
            const coordsRetur = currentRouteCoords.slice(splitIndex);
            if (connectionLine) connectionLine.setLatLngs(coordsDit);
            else connectionLine = L.polyline(coordsDit, {color: '#007bff', weight: 4, opacity: 0.7}).addTo(map);
            if (travelMode === 2) {
                if (connectionLineReturn) connectionLineReturn.setLatLngs(coordsRetur);
                else connectionLineReturn = L.polyline(coordsRetur, {color: '#FF9800', weight: 4, opacity: 0.7}).addTo(map);
            } else if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
            
            const distKm = route.distance / 1000;
            if (!isLiveReceiver) {
                if (travelMode === 2) {
                    els.distInfo.innerHTML = `<b>${distKm.toFixed(2)} km</b> till ${currentTargetName} och tillbaka`;
                } else {
                    els.distInfo.innerHTML = `<b>${distKm.toFixed(2)} km</b> till ${currentTargetName}`;
                }
                els.startBtn.classList.remove('hidden');
            }
        } else { fallbackDist(); }
    } catch (e) { fallbackDist(); }
}

function fallbackDist() {
    if (!fixedStartCoords && !userCoords) return;
    const startPoint = fixedStartCoords || userCoords;
    const d = map.distance(startPoint, currentTargetCoords) / 1000;
    const total = d * (travelMode === 2 ? 2 : 1);
    const coordsDit = [[startPoint[0], startPoint[1]], [currentTargetCoords.lat, currentTargetCoords.lng]];
    if (connectionLine) connectionLine.setLatLngs(coordsDit);
    else connectionLine = L.polyline(coordsDit, {color: '#007bff', weight: 4, opacity: 0.7}).addTo(map);
    if (travelMode === 2) {
        const coordsRetur = [[currentTargetCoords.lat, currentTargetCoords.lng], [startPoint[0], startPoint[1]]];
        if (connectionLineReturn) connectionLineReturn.setLatLngs(coordsRetur);
        else connectionLineReturn = L.polyline(coordsRetur, {color: '#FF9800', weight: 4, opacity: 0.7}).addTo(map);
    } else if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
    
    if (!isLiveReceiver) {
        if (travelMode === 2) {
            els.distInfo.innerHTML = `<b>${total.toFixed(2)} km</b> till målet och tillbaka (fågelvägen)`;
        } else {
            els.distInfo.innerHTML = `<b>${total.toFixed(2)} km</b> (fågelvägen)`;
        }
        els.startBtn.classList.remove('hidden');
    }
}

function setTarget(latlng, shouldSave, clearWaypoints = true, updateStart = true) {
    if (updateStart) {
        if (userCoords) fixedStartCoords = [...userCoords];
        else fixedStartCoords = null;
    }
    if (clearWaypoints) {
        waypointsDit = []; waypointsHem = []; 
        waypointMarkers.forEach(m => map.removeLayer(m)); 
        waypointMarkers = [];
    }
    if (connectionLine) { map.removeLayer(connectionLine); connectionLine = null; }
    if (connectionLineReturn) { map.removeLayer(connectionLineReturn); connectionLineReturn = null; }
    currentTargetCoords = latlng;
    if (targetMarker) targetMarker.setLatLng(latlng);
    else targetMarker = L.marker(latlng).addTo(map);
    if (shouldSave) saveSession();
    updateMapLogic(); 
    if (!isLiveReceiver) updateLocateBtnText();
    broadcastLiveState();
}

function zoomToUser() { if (userCoords) map.flyTo(userCoords, 18); }
function toggleView() { 
    if (!currentTargetCoords || isShowingUser) { zoomToUser(); isShowingUser = false; isTracking = true; }
    else { map.flyTo(currentTargetCoords, 18); isShowingUser = true; isTracking = false; }
    updateLocateBtnText();
}
function updateLocateBtnText() { els.locateBtn.innerHTML = (!currentTargetCoords || isShowingUser) ? "🎯 HITTA MEJ" : `🏁 ${currentTargetName.toUpperCase()}`; }
function toggleTravelMode() { travelMode = (travelMode + 1) % modes.length; els.modeBtn.innerText = modes[travelMode].icon; updateMapLogic(); saveSession(); broadcastLiveState(); }
async function requestWakeLock() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {} }
function releaseWakeLock() { if (wakeLock !== null) wakeLock.release().then(() => { wakeLock = null; }); }

function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Tyvärr stöder inte din webbläsare röstsök."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'sv-SE';
    recognition.onstart = () => { els.voiceBtn.classList.add('listening'); els.voiceBtn.innerText = "LYSSNAR..."; };
    recognition.onresult = (event) => { els.searchInput.value = event.results[0][0].transcript; els.searchContainer.classList.remove('hidden'); executeTextSearch(); };
    recognition.onend = () => { els.voiceBtn.classList.remove('listening'); els.voiceBtn.innerText = "🎤 RÖST"; };
    recognition.start();
}

function startGame() {
    if (!currentTargetCoords) return;
    if (!isLiveReceiver && !userCoords) return; 

    gameState = 'GAME';
    if (!isLiveReceiver) startCoords = [...(userCoords || [0,0])];
    
    maxStepsReached = 0;
    lastRouteIndex = 0;
    hasReachedMidpoint = false;
    midpointStepIndex = -1;
    isCelebratingTurn = false;
    
    isGameMapVisible = false;
    els.gameMapElement.classList.add('hidden');
    const distDisplay = document.getElementById('game-distance-display');
    if (distDisplay) distDisplay.classList.add('hidden');
    
    els.pathGrid.classList.remove('hidden');
    
    if (!isLiveReceiver) {
        const distStr = els.distInfo.innerText.split(' ')[0].replace('<b>', '').replace('</b>', '');
        const totalDistanceKm = parseFloat(distStr) || 1;
        initialTotalKm = Math.max(1, Math.ceil(totalDistanceKm / modes[travelMode].factor));
    }
    
    els.mapPage.classList.add('hidden');
    els.gamePage.classList.remove('hidden');
    if(!isLiveReceiver) els.shareBtn.classList.add('hidden');
    
    requestWakeLock();
    els.pathGrid.innerHTML = '<div id="the-mouse">🐭</div>';

    if (!swipeHintShown && !isLiveReceiver) {
        const hint = document.getElementById('swipe-hint');
        if (hint) {
            hint.classList.remove('hidden');
            setTimeout(() => hint.classList.add('show-hint'), 50); 
            setTimeout(() => {
                hint.classList.remove('show-hint');
                setTimeout(() => hint.classList.add('hidden'), 500); 
            }, 4000); 
        }
        swipeHintShown = true;
        saveSession();
    }

    if (!isLiveReceiver && travelMode === 2 && currentRouteCoords.length > 0) {
        let distToTarget = 0;
        let splitIndex = 0;
        let minD = Infinity;
        currentRouteCoords.forEach((c, i) => {
            const d = L.latLng(c).distanceTo(currentTargetCoords);
            if (d < minD) { minD = d; splitIndex = i; }
        });
        for (let i = 0; i < splitIndex; i++) {
            distToTarget += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
        }
        midpointStepIndex = Math.floor((distToTarget / 1000) / modes[travelMode].factor);
    }
    
    for (let i = 0; i < initialTotalKm; i++) {
        const step = document.createElement('div');
        step.className = 'step'; step.id = `step-${i}`;
        if (i === initialTotalKm - 1) { step.innerHTML = '🧀'; } 
        else if (i === midpointStepIndex) { step.innerHTML = '🧀'; } 
        else { step.innerHTML = '🍎'; }
        els.pathGrid.appendChild(step);
    }
    
    setTimeout(() => moveMouse(isLiveReceiver ? maxStepsReached : 0), 100);
    if(!isLiveReceiver) broadcastLiveState();
}

function updateGameLogic() {
    if (gameState !== 'GAME' || !currentRouteCoords.length || isCelebratingTurn || isLiveReceiver) return;
    
    if (!hasReachedMidpoint && travelMode === 2) {
        const distToTarget = map.distance(userCoords, currentTargetCoords);
        if (distToTarget < 40) { triggerTurnAroundDance(); return; }
    }

    let minD = Infinity;
    let idx = lastRouteIndex;
    let searchLimit = (travelMode !== 2 || hasReachedMidpoint) ? currentRouteCoords.length : Math.floor(currentRouteCoords.length * 0.6); 
    for (let i = lastRouteIndex; i < searchLimit; i++) {
        const d = map.distance(userCoords, currentRouteCoords[i]);
        if (d < minD) { minD = d; idx = i; }
    }
    lastRouteIndex = idx;
    
    let traveledDist = 0;
    for (let i = 0; i < lastRouteIndex; i++) {
        traveledDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
    }

    let totalRouteDist = 0;
    for (let i = 0; i < currentRouteCoords.length - 1; i++) {
        totalRouteDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
    }
    
    let remainingDist = totalRouteDist - traveledDist;
    const distDisplay = document.getElementById('game-distance-display');
    if (distDisplay) {
        distDisplay.innerText = (remainingDist / 1000).toFixed(2) + ' km kvar';
    }

    let currentSteps = Math.floor((traveledDist / 1000) / modes[travelMode].factor);
    if (!hasReachedMidpoint && travelMode === 2 && currentSteps > midpointStepIndex) { currentSteps = midpointStepIndex; }
    if (currentSteps > maxStepsReached) { maxStepsReached = currentSteps; }
    
    for (let i = 0; i < initialTotalKm - 1; i++) {
        const s = document.getElementById(`step-${i}`);
        if (s) i < maxStepsReached ? s.classList.add('eat-animation') : s.classList.remove('eat-animation');
    }
    
    const goal = (travelMode === 2) ? (fixedStartCoords || startCoords) : currentTargetCoords;
    const distToFinal = map.distance(userCoords, goal);

    if (travelMode === 2) {
        if (hasReachedMidpoint && distToFinal < 40 && maxStepsReached > (initialTotalKm * 0.8)) {
            moveMouse(initialTotalKm - 1); setTimeout(finishGame, 500);
        } else { moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 2))); }
    } else {
        if (distToFinal < 40) { moveMouse(initialTotalKm - 1); setTimeout(finishGame, 500); } 
        else { moveMouse(Math.max(0, Math.min(maxStepsReached, initialTotalKm - 1))); }
    }
    
    if (isGameMapVisible) { updateGameMapView(false); }
}

function triggerTurnAroundDance() {
    if (isCelebratingTurn) return;
    isCelebratingTurn = true;
    moveMouse(midpointStepIndex);
    const step = document.getElementById(`step-${midpointStepIndex}`);
    if(step) step.classList.add('eat-animation');
    const m = document.getElementById('the-mouse');
    m.innerHTML = '🐭🧀'; m.classList.add('turn-dance');
    playClickSound();
    setTimeout(() => {
        m.classList.remove('turn-dance'); m.innerHTML = '🐭';
        hasReachedMidpoint = true; isCelebratingTurn = false; maxStepsReached = midpointStepIndex + 1;
    }, 3000);
}

function moveMouse(index) {
    const m = document.getElementById('the-mouse');
    const s = document.getElementById(`step-${index}`);
    const container = els.pathGrid;
    if (s && container) { 
        m.style.left = s.offsetLeft + "px"; m.style.top = s.offsetTop + "px"; 
        let targetScroll = (s.offsetTop + (s.offsetHeight * 2.5)) - container.clientHeight;
        if (targetScroll > 0) container.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
}

function finishGame() {
    if (gameState === 'FINISHED') return;
    gameState = 'FINISHED';
    const m = document.getElementById('the-mouse');
    m.innerHTML = '🐭🧀'; m.classList.add('victory');
    createConfettiBurst(); 
    confettiInterval = setInterval(createConfettiBurst, 800); 
    if(!isLiveReceiver) els.shareBtn.classList.remove('hidden');
    releaseWakeLock();
    broadcastLiveState();
}

function stopGame() { 
    gameState = 'MAP'; 
    if (!isLiveReceiver) fixedStartCoords = null; 
    clearInterval(confettiInterval);
    isGameMapVisible = false;
    els.gameMapElement.classList.add('hidden');
    const distDisplay = document.getElementById('game-distance-display');
    if (distDisplay) distDisplay.classList.add('hidden');
    
    els.pathGrid.classList.remove('hidden');
    const m = document.getElementById('the-mouse');
    m.classList.remove('victory'); m.classList.remove('turn-dance'); m.innerHTML = '🐭';
    document.querySelectorAll('.confetti').forEach(c => c.remove());
    els.gamePage.classList.add('hidden'); els.mapPage.classList.remove('hidden'); 
    
    if(!isLiveReceiver) els.shareBtn.classList.remove('hidden'); 
    releaseWakeLock();
    if(!isLiveReceiver) saveSession();

    setTimeout(() => {
        if (map) { map.invalidateSize(); }
    }, 50);
    broadcastLiveState();
}

function createConfettiBurst() {
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const colors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#800080', '#ffc0cb'];
    for(let i=0; i<40; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.left = startX + 'px'; c.style.top = startY + 'px';
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 200; 
        c.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        c.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 1200);
    }
}

function handleOrientationLayout() { if (window.innerHeight < window.innerWidth) { els.actionContainer.prepend(els.modeBtn); } else { document.querySelector('.save-btn-container').appendChild(els.modeBtn); } }
function toggleSearchUI() { els.searchContainer.classList.toggle('hidden'); if (!els.searchContainer.classList.contains('hidden')) els.searchInput.focus(); }

async function executeTextSearch() {
    const q = els.searchInput.value; if (!q) return;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
        const d = await res.json();
        if (d.length > 0) {
            currentTargetName = d[0].display_name.split(',')[0];
            setTarget({lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon)}, true, true, true);
            map.flyTo(currentTargetCoords, 18); els.searchContainer.classList.add('hidden');
        }
    } catch (e) {
        alert("Sökningen fungerar tyvärr inte när du är offline. Använd kartan eller sparade platser istället!");
    }
}

function updateButtonUI() {
    savedLocations.forEach((loc, i) => {
        const btn = document.getElementById(`btn-${i}`);
        const span = btn.querySelector('.scrolling-text');
        const textContent = loc ? loc.name : "SPARA " + (i + 1);
        span.innerText = textContent; span.classList.remove('animate-scroll');
        if (span.scrollWidth > btn.querySelector('.btn-text-container').offsetWidth) {
            span.innerText = textContent + " \u00A0\u00A0\u00A0 " + textContent + " \u00A0\u00A0\u00A0 ";
            span.classList.add('animate-scroll');
        }
        loc ? btn.classList.add('filled') : btn.classList.remove('filled');
    });
}

function handleSlotClick(i) { 
    if(isLiveReceiver) return;
    const d = savedLocations[i]; 
    if (d) { 
        currentTargetName = d.name; 
        waypointsDit = []; waypointsHem = []; 
        waypointMarkers.forEach(m => map.removeLayer(m)); 
        waypointMarkers = [];
        if (d.waypointsDit) {
            d.waypointsDit.forEach(wp => {
                const latlng = L.latLng(wp.lat, wp.lng);
                waypointsDit.push(latlng);
                const m = L.circleMarker(latlng, { radius: 7, fillColor: "#2196F3", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map);
                m.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(m, latlng); });
                waypointMarkers.push(m);
            });
        }
        if (d.waypointsHem) {
            d.waypointsHem.forEach(wp => {
                const latlng = L.latLng(wp.lat, wp.lng);
                waypointsHem.push(latlng);
                const m = L.circleMarker(latlng, { radius: 7, fillColor: "#FF9800", color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.8 }).addTo(map);
                m.on('contextmenu', (e) => { L.DomEvent.stopPropagation(e); removeWaypoint(m, latlng); });
                waypointMarkers.push(m);
            });
        }
        setTarget(d.coords, true, false, true); 
        map.flyTo(d.coords, 14); 
    } 
}

function saveCurrentPos(i) { 
    if (!currentTargetCoords) return; 
    const l = prompt("Spara som:", currentTargetName); 
    if (l) { 
        let includeWaypoints = false;
        if (waypointsDit.length > 0 || waypointsHem.length > 0) {
            includeWaypoints = confirm("Vill du spara med via-punkter?");
        }
        savedLocations[i] = {
            coords: {lat: currentTargetCoords.lat, lng: currentTargetCoords.lng}, 
            name: l,
            waypointsDit: includeWaypoints ? waypointsDit.map(wp => ({lat: wp.lat, lng: wp.lng})) : [],
            waypointsHem: includeWaypoints ? waypointsHem.map(wp => ({lat: wp.lat, lng: wp.lng})) : []
        }; 
        localStorage.setItem('mouse_favs', JSON.stringify(savedLocations)); 
        updateButtonUI(); 
    } 
}

function setupInteractions() {
    document.querySelectorAll('.slot-btn').forEach((b, i) => {
        let lastTriggerTime = 0;
        const triggerSave = (e) => {
            const now = Date.now(); if (now - lastTriggerTime < 7000) return; lastTriggerTime = now;
            if (e && typeof e.preventDefault === 'function') { e.preventDefault(); e.stopPropagation(); }
            saveCurrentPos(i);
        };
        b.oncontextmenu = (e) => { triggerSave(e); return false; };
        let pressTimer;
        b.addEventListener('touchstart', (e) => { pressTimer = setTimeout(() => triggerSave(e), 600); }, {passive: true});
        b.addEventListener('touchend', () => clearTimeout(pressTimer));
    });
}

function playClickSound() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const o = audioCtx.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(3000, audioCtx.currentTime); o.start(); o.stop(audioCtx.currentTime+0.1); }
function closeInstructions() { els.welcomeOverlay.classList.add('hidden'); if(!isLiveReceiver) saveSession(); }

// --- NY DELA-FUNKTION MED VAL-MENY ---
function shareApp(e) { 
    if (isLiveReceiver) {
        alert("Du följer redan en live-sändning!");
        return;
    }

    const oldMenu = document.getElementById('share-menu');
    if (oldMenu) { oldMenu.remove(); return; }

    const menu = document.createElement('div');
    menu.id = 'share-menu';
    menu.style.position = 'fixed';
    menu.style.top = '65px';
    menu.style.left = '15px';
    menu.style.zIndex = '10001';
    menu.style.background = 'white';
    menu.style.borderRadius = '15px';
    menu.style.padding = '10px';
    menu.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.gap = '8px';
    menu.style.border = '2px solid var(--primary)';

    const btnNormal = document.createElement('button');
    btnNormal.className = 'wp-menu-btn';
    btnNormal.style.background = 'var(--blue)';
    btnNormal.innerText = 'Dela rutt (Statisk)';
    btnNormal.onclick = () => { menu.remove(); shareNormal(); };

    const btnLive = document.createElement('button');
    btnLive.className = 'wp-menu-btn';
    btnLive.style.background = '#ff4444';
    btnLive.innerText = 'Dela LIVE 🔴';
    btnLive.onclick = () => { menu.remove(); startLiveSharing(); };

    const btnCancel = document.createElement('button');
    btnCancel.innerText = 'Avbryt';
    btnCancel.style.fontSize = '0.7rem';
    btnCancel.style.background = 'none';
    btnCancel.onclick = () => menu.remove();

    menu.appendChild(btnNormal);
    menu.appendChild(btnLive);
    menu.appendChild(btnCancel);
    document.body.appendChild(menu);

    setTimeout(() => {
        const close = (event) => {
            if (!menu.contains(event.target) && event.target.id !== 'share-btn') {
                menu.remove();
                document.removeEventListener('click', close);
            }
        };
        document.addEventListener('click', close);
    }, 100);
}

function shareNormal() {
    let shareUrl = window.location.origin + window.location.pathname;
    let title = 'Mouse & Cheese Tracker';
    let text = 'Häng med på äventyr med musen!';

    if (currentTargetCoords) {
        const data = {
            t: [currentTargetCoords.lat, currentTargetCoords.lng],
            m: travelMode,
            wd: waypointsDit.map(w => [w.lat, w.lng]),
            wh: waypointsHem.map(w => [w.lat, w.lng]),
            n: currentTargetName
        };
        const encoded = btoa(JSON.stringify(data));
        shareUrl += '?r=' + encoded;
        text = `Följ min rutt till ${currentTargetName}! 🐭🧀`;
    }

    const d = {title: title, text: text, url: shareUrl}; 
    if(navigator.share) {
        navigator.share(d).catch(e => console.log("Delning avbruten"));
    } else {
        prompt("Kopiera länken för att dela rutt:", shareUrl);
    }
}

function startLiveSharing() {
    if (!liveSessionId) liveSessionId = Math.random().toString(36).substr(2, 9);
    
    // Initiera Pusher lokalt så att sändaren själv pratar direkt via WebSockets
    if (!pusher) {
        pusher = new Pusher(pusherKey, {
            cluster: pusherCluster,
            authorizer: getPusherAuthorizer()
        });
    }

    liveChannel = pusher.subscribe(`private-live-${liveSessionId}`);
    liveChannel.bind('pusher:subscription_succeeded', () => {
        isLiveSharing = true;
        broadcastLiveState();
        
        // Tvinga uppdatering av datan till åskådare var 3:e sekund
        if(!liveBroadcastInterval) {
            liveBroadcastInterval = setInterval(() => {
                if (isLiveSharing) broadcastLiveState();
            }, 3000); 
        }
    });

    let shareUrl = window.location.origin + window.location.pathname + '?live=' + liveSessionId;

    const d = {title: 'Följ mig live!', text: 'Följ musens jakt på osten live! 🐭🔴', url: shareUrl};
    if(navigator.share) {
        navigator.share(d).catch(e => console.log("Delning avbruten"));
    } else {
        prompt("Kopiera länken för att dela live-rutt:", shareUrl);
    }
}

window.onload = initMap;