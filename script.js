// VARIABLER OCH CONFIG
const STORAGE_KEY = 'mouse_slots_v1';
const SESSION_KEY = 'mouse_session_active';
let map, userMarker;
let slots = [null, null, null, null];
let travelMode = 'car';
let currentTargetCoords = null;
let currentTargetName = "";
let routingLines = [];
let waypointsDit = [];
let waypointsHem = [];

// DOM ELEMENT
const els = {
    distInfo: document.getElementById('dist-info'),
    welcomeOverlay: document.getElementById('welcome-overlay'),
    modeIcon: document.getElementById('mode-icon'),
    searchInput: document.getElementById('text-search-input')
};

// INITIALISERING
window.addEventListener('load', () => {
    initApp();
    if (localStorage.getItem(SESSION_KEY)) {
        els.welcomeOverlay.classList.add('hidden');
    }
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(console.error);
    }
});

function initApp() {
    // Start-position: Långerud, Kristinehamn (Marcus home turf!)
    map = L.map('map', { zoomControl: false }).setView([59.3245, 14.1560], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    loadSlots();
    setupSearch();
    locateMe();
    checkURLParameters();
}

function setupSearch() {
    els.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocation(els.searchInput.value);
            els.searchInput.blur();
        }
    });
}

async function searchLocation(query) {
    if (!query) return;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.length > 0) {
            const place = data[0];
            const latlng = [parseFloat(place.lat), parseFloat(place.lon)];
            map.flyTo(latlng, 15);
            L.popup()
                .setLatLng(latlng)
                .setContent(createPopupContent(place.display_name, latlng))
                .openOn(map);
        }
    } catch (e) { console.error("Search failed", e); }
}

function createPopupContent(name, latlng) {
    const div = document.createElement('div');
    div.className = 'popup-content';
    const shortName = name.split(',')[0];
    div.innerHTML = `<h4>${shortName}</h4><div class="popup-btns"></div>`;
    
    const btnSave = document.createElement('button');
    btnSave.className = 'popup-btn';
    btnSave.style.background = 'var(--orange)';
    btnSave.innerText = 'Spara Slot';
    btnSave.onclick = () => saveToSlotPrompt(shortName, latlng);
    
    const btnGo = document.createElement('button');
    btnGo.className = 'popup-btn';
    btnGo.style.background = 'var(--primary)';
    btnGo.innerText = 'Visa rutt';
    btnGo.onclick = () => {
        currentTargetCoords = {lat: latlng[0], lng: latlng[1]};
        currentTargetName = shortName;
        calculateRoute();
        map.closePopup();
    };
    
    div.querySelector('.popup-btns').append(btnSave, btnGo);
    return div;
}

function saveToSlotPrompt(name, latlng) {
    const slotIdx = prompt("Vilken slot? (1-4)");
    const idx = parseInt(slotIdx) - 1;
    if (idx >= 0 && idx <= 3) {
        slots[idx] = { name, lat: latlng[0], lng: latlng[1] };
        saveSlots();
        updateUI();
    }
}

function handleSlotClick(idx) {
    const slot = slots[idx];
    if (slot) {
        const latlng = [slot.lat, slot.lng];
        map.flyTo(latlng, 15);
        currentTargetCoords = {lat: slot.lat, lng: slot.lng};
        currentTargetName = slot.name;
        calculateRoute();
    } else {
        alert("Sök upp en plats på kartan först för att spara den här!");
    }
}

async function calculateRoute() {
    if (!userMarker || !currentTargetCoords) return;
    const start = userMarker.getLatLng();
    const end = currentTargetCoords;

    try {
        const profile = travelMode === 'car' ? 'driving-car' : 'foot-walking';
        const url = `https://router.project-osrm.org/route/v1/${profile.split('-')[0]}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.routes && data.routes[0]) {
            routingLines.forEach(l => map.removeLayer(l));
            routingLines = [];
            
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(c => [c[1], c[0]]);
            
            const line = L.polyline(coordinates, {
                color: travelMode === 'car' ? 'var(--blue)' : 'var(--primary)',
                weight: 6,
                opacity: 0.8,
                dashArray: travelMode === 'car' ? null : '1, 10'
            }).addTo(map);
            
            routingLines.push(line);
            map.fitBounds(line.getBounds(), {padding: [50, 50]});
            
            const distKm = (route.distance / 1000).toFixed(1);
            const timeMin = Math.round(route.duration / 60);
            els.distInfo.innerHTML = `🐭 <b>${currentTargetName}</b>: ${distKm} km (${timeMin} min med ${travelMode === 'car' ? 'bil' : 'tass'})`;
            
            playBeep();
        }
    } catch (e) { console.error("Route failed", e); }
}

function locateMe() {
    map.locate({setView: true, maxZoom: 16, watch: true});
    map.on('locationfound', (e) => {
        if (!userMarker) {
            userMarker = L.marker(e.latlng, {
                icon: L.divIcon({
                    className: 'user-icon',
                    html: '<div style="background:var(--blue);width:15px;height:15px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.3);"></div>'
                })
            }).addTo(map);
        } else {
            userMarker.setLatLng(e.latlng);
        }
        if (currentTargetCoords) calculateRoute();
    });
}

function toggleTravelMode() {
    travelMode = travelMode === 'car' ? 'walk' : 'car';
    els.modeIcon.innerText = travelMode === 'car' ? '🚗' : '👣';
    if (currentTargetCoords) calculateRoute();
}

function saveSlots() { localStorage.setItem(STORAGE_KEY, JSON.stringify(slots)); }
function loadSlots() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        slots = JSON.parse(saved);
        updateUI();
    }
}

function updateUI() {
    slots.forEach((slot, i) => {
        const btn = document.getElementById(`btn-${i}`);
        if (slot) {
            btn.innerText = slot.name;
            btn.classList.add('filled');
        } else {
            btn.innerText = `Slot ${i+1}`;
            btn.classList.remove('filled');
        }
    });
}

function playBeep() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(3000, audioCtx.currentTime);
    o.start();
    o.stop(audioCtx.currentTime + 0.1);
}

function closeInstructions() {
    els.welcomeOverlay.classList.add('hidden');
    localStorage.setItem(SESSION_KEY, 'true');
}

function shareApp() {
    const url = window.location.href;
    const text = currentTargetName ? `Följ min rutt till ${currentTargetName}! 🐭🧀` : "Kolla in min Mouse Tracker!";
    if (navigator.share) {
        navigator.share({ title: 'Mouse Tracker', text: text, url: url });
    } else {
        prompt("Kopiera länken:", url);
    }
}

function checkURLParameters() {
    const params = new URLSearchParams(window.location.search);
    const routeData = params.get('r');
    if (routeData) {
        try {
            const data = JSON.parse(atob(routeData));
            currentTargetCoords = {lat: data.t[0], lng: data.t[1]};
            currentTargetName = data.n;
            calculateRoute();
        } catch(e) { console.log("Länk-data korrupt"); }
    }
}