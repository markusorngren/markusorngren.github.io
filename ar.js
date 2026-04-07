// --- AR TEST ENGINE ---
function startARTest() {
    playClickSound();
    const btn = document.getElementById('beta-ar-btn');
    if(btn) btn.innerText = "⏳ Laddar 3D-motor...";

    // iOS 13+ Kräver användarens tillåtelse för att läsa rörelsesensorer
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') { loadARLibraries(); } 
                else { alert("Rörelsesensorer måste tillåtas för att AR ska fungera."); if(btn) btn.innerText = "📷 TESTA AR"; }
            })
            .catch(console.error);
    } else {
        loadARLibraries();
    }
}

function loadARLibraries() {
    const loadScript = (src) => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src; s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
    });

    // Ladda A-Frame först, sedan AR.js
    loadScript("https://aframe.io/releases/1.3.0/aframe.min.js")
        .then(() => loadScript("https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js"))
        .then(() => { initARScene(); })
        .catch(err => {
            alert("Kunde inte ladda AR. Kontrollera nätverket.");
            const btn = document.getElementById('beta-ar-btn');
            if(btn) btn.innerText = "📷 TESTA AR";
        });
}

// Genererar punkter var 25:e (gående) eller 250:e (bil) meter längs rutten
function getPointsByDistance(routeCoords, intervalMeters) {
    let points = [];
    let leftover = 0; // Distans vi redan gått sedan förra äpplet
    
    if(!routeCoords || routeCoords.length < 2) return points;

    for (let i = 0; i < routeCoords.length - 1; i++) {
        let p1 = L.latLng(routeCoords[i]);
        let p2 = L.latLng(routeCoords[i+1]);
        let segDist = p1.distanceTo(p2);
        
        // Så långt in på det här segmentet ska nästa äpple ligga
        let distAlongSegment = intervalMeters - leftover;

        while (distAlongSegment <= segDist) {
            let ratio = distAlongSegment / segDist;
            let lat = p1.lat + (p2.lat - p1.lat) * ratio;
            let lng = p1.lng + (p2.lng - p1.lng) * ratio;
            points.push({ lat: lat, lng: lng, collected: false });
            
            distAlongSegment += intervalMeters;
        }
        
        // Spara exakt hur många meter vi har till godo in i nästa segment
        leftover = segDist - (distAlongSegment - intervalMeters);
    }
    return points;
}

// Globala variabler för matematisk smoothing
window.arSmoothedCoords = null;
window.arSmoothedHeading = null;
const GPS_SMOOTHING_FACTOR = 0.15; // 15% ny data, 85% gammal. Filtrerar bort GPS-studsar.
const COMPASS_SMOOTHING_FACTOR = 0.10; // Gör kompasspilen mjukare

function initARScene() {
    if (!currentRouteCoords || currentRouteCoords.length === 0) {
        alert("Du måste ha en aktiv rutt för att starta AR-spelet!");
        const btn = document.getElementById('beta-ar-btn');
        if(btn) btn.innerText = "📷 TESTA AR";
        return;
    }

    document.getElementById('game-page').style.display = 'none';

    const intervalMeters = travelMode === 0 ? 250 : 25;

    window.arApples = getPointsByDistance(currentRouteCoords, intervalMeters);
    window.arTotalApples = window.arApples.length;

    if(window.arTotalApples === 0 && currentRouteCoords.length > 0) {
        let lastPoint = currentRouteCoords[currentRouteCoords.length - 1];
        window.arApples.push({lat: lastPoint[0], lng: lastPoint[1], collected: false});
        window.arTotalApples = 1;
    }

    let totalRouteDist = 0;
    for (let i = 0; i < currentRouteCoords.length - 1; i++) {
        totalRouteDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
    }
    
    let traveledDist = 0;
    for (let i = 0; i < lastRouteIndex; i++) {
        traveledDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
    }
    if (lastRouteIndex < currentRouteCoords.length - 1 && userCoords) {
        traveledDist += map.distance(currentRouteCoords[lastRouteIndex], userCoords);
    }

    window.arScore = totalRouteDist > 0 ? Math.floor((traveledDist / totalRouteDist) * window.arTotalApples) : 0;
    if(isNaN(window.arScore) || window.arScore < 0) window.arScore = 0;
    window.arGoalReached = false;
    
    window.arHasStarted = window.arScore > 0;

    const scene = document.createElement('a-scene');
    scene.id = "ar-scene";
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('arjs', 'sourceType: webcam; videoTexture: true; debugUIEnabled: false;');

    // gpsMinDistance satt till 5 meter istället för 2 för att hjälpa AR-motorn att ignorera jitter visuellt
    const camera = document.createElement('a-camera');
    camera.setAttribute('gps-camera', 'gpsMinDistance: 5; positionMinAccuracy: 100;');
    camera.setAttribute('rotation-reader', '');
    scene.appendChild(camera);

    const arrowContainer = document.createElement('a-entity');
    arrowContainer.id = "ar-arrow-container";
    arrowContainer.setAttribute('position', '0 -0.5 -1.5');

    const pitchRollCompensator = document.createElement('a-entity');
    pitchRollCompensator.id = "ar-pitch-roll-compensator";

    const arrowPivot = document.createElement('a-entity');
    arrowPivot.id = "ar-direction-arrow";
    
    const arrowMesh = document.createElement('a-entity');
    arrowMesh.setAttribute('rotation', '-90 0 0'); 

    const arrowhead = document.createElement('a-cone');
    arrowhead.setAttribute('color', '#FFEB3B');
    arrowhead.setAttribute('radius-bottom', '0.08');
    arrowhead.setAttribute('height', '0.15');
    arrowhead.setAttribute('position', '0 0.1 0');

    const arrowBody = document.createElement('a-cylinder');
    arrowBody.setAttribute('color', '#FFEB3B');
    arrowBody.setAttribute('radius', '0.03');
    arrowBody.setAttribute('height', '0.2');
    arrowBody.setAttribute('position', '0 -0.05 0');

    arrowMesh.appendChild(arrowhead);
    arrowMesh.appendChild(arrowBody);
    arrowPivot.appendChild(arrowMesh);
    
    pitchRollCompensator.appendChild(arrowPivot);
    arrowContainer.appendChild(pitchRollCompensator);
    camera.appendChild(arrowContainer);

    if (!window.arHasStarted) {
        const startPoint = currentRouteCoords[0];
        const startSignEl = document.createElement('a-entity');
        startSignEl.setAttribute('gps-entity-place', `latitude: ${startPoint[0]}; longitude: ${startPoint[1]}`);
        startSignEl.id = 'ar-start-sign';

        const signBox = document.createElement('a-box');
        signBox.setAttribute('color', '#2196F3');
        signBox.setAttribute('width', '2.0');
        signBox.setAttribute('height', '1.0');
        signBox.setAttribute('depth', '0.2');
        signBox.setAttribute('position', '0 2.5 0');

        const signText = document.createElement('a-text');
        signText.setAttribute('value', 'START');
        signText.setAttribute('color', '#FFFFFF');
        signText.setAttribute('align', 'center');
        signText.setAttribute('position', '0 0 0.11');
        signText.setAttribute('scale', '4 4 4');

        const signPole = document.createElement('a-cylinder');
        signPole.setAttribute('color', '#757575');
        signPole.setAttribute('radius', '0.1');
        signPole.setAttribute('height', '2');
        signPole.setAttribute('position', '0 1 0');

        signBox.appendChild(signText);
        startSignEl.appendChild(signPole);
        startSignEl.appendChild(signBox);
        scene.appendChild(startSignEl);
    }
    
    if (currentRouteCoords.length > 0) {
        const endPoint = currentRouteCoords[currentRouteCoords.length - 1];
        const endSignEl = document.createElement('a-entity');
        endSignEl.setAttribute('gps-entity-place', `latitude: ${endPoint[0]}; longitude: ${endPoint[1]}`);
        endSignEl.id = 'ar-end-sign';

        const endSignBox = document.createElement('a-box');
        endSignBox.setAttribute('color', '#4CAF50');
        endSignBox.setAttribute('width', '2.0');
        endSignBox.setAttribute('height', '1.0');
        endSignBox.setAttribute('depth', '0.2');
        endSignBox.setAttribute('position', '0 2.5 0'); 

        const endSignText = document.createElement('a-text');
        endSignText.setAttribute('value', 'MÅL');
        endSignText.setAttribute('color', '#FFFFFF');
        endSignText.setAttribute('align', 'center');
        endSignText.setAttribute('position', '0 0 0.11'); 
        endSignText.setAttribute('scale', '4 4 4'); 

        const endSignPole = document.createElement('a-cylinder');
        endSignPole.setAttribute('color', '#757575'); 
        endSignPole.setAttribute('radius', '0.1');
        endSignPole.setAttribute('height', '2');
        endSignPole.setAttribute('position', '0 1 0'); 

        endSignBox.appendChild(endSignText);
        endSignEl.appendChild(endSignPole);
        endSignEl.appendChild(endSignBox);
        scene.appendChild(endSignEl);
    }

    window.renderARApple = function(index) {
        if (index >= window.arTotalApples) return;
        const apple = window.arApples[index];
        const currentScene = document.getElementById('ar-scene');
        if (!currentScene || document.getElementById(`ar-apple-${index}`)) return;

        const appleEl = document.createElement('a-sphere');
        appleEl.setAttribute('color', '#ff3333');
        appleEl.setAttribute('radius', '1.0'); 
        appleEl.setAttribute('gps-entity-place', `latitude: ${apple.lat}; longitude: ${apple.lng}`);
        appleEl.id = `ar-apple-${index}`;
        
        const stem = document.createElement('a-cylinder');
        stem.setAttribute('color', '#4CAF50');
        stem.setAttribute('radius', '0.08');
        stem.setAttribute('height', '0.8');
        stem.setAttribute('position', '0 1 0');
        appleEl.appendChild(stem);

        currentScene.appendChild(appleEl);
    };

    document.body.appendChild(scene);

    if (window.arHasStarted && window.arScore < window.arTotalApples) {
        window.renderARApple(window.arScore);
    }

    const uiContainer = document.createElement('div');
    uiContainer.id = "ar-ui-container";
    uiContainer.style.cssText = "position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; z-index: 9999999; display: flex; flex-direction: column; gap: 10px;";

    const scoreCard = document.createElement('div');
    scoreCard.id = "ar-score-card";
    scoreCard.innerHTML = `🍎 Äpplen: <b>${window.arScore} / ${window.arTotalApples}</b>`;
    scoreCard.style.cssText = "background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 15px; text-align: center; font-weight: bold; font-size: 1.2rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3); color: #333;";
    uiContainer.appendChild(scoreCard);

    const progressWrapper = document.createElement('div');
    progressWrapper.style.cssText = "background: rgba(0,0,0,0.5); border-radius: 10px; height: 20px; width: 100%; border: 2px solid white; overflow: hidden; position: relative;";
    
    const progressBar = document.createElement('div');
    progressBar.id = "ar-progress-bar";
    progressBar.style.cssText = "background: #4CAF50; height: 100%; width: 0%; transition: width 0.3s ease;";
    
    const progressText = document.createElement('div');
    progressText.id = "ar-progress-text";
    progressText.innerHTML = "0%";
    progressText.style.cssText = "position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem; text-shadow: 1px 1px 2px black;";

    progressWrapper.appendChild(progressBar);
    progressWrapper.appendChild(progressText);
    uiContainer.appendChild(progressWrapper);

    document.body.appendChild(uiContainer);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = "✖ STÄNG AR-KAMERAN";
    closeBtn.style.cssText = "position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); z-index: 9999999; background: #f44336; color: white; padding: 15px 25px; border-radius: 15px; font-weight: bold; border: none; box-shadow: 0 5px 15px rgba(0,0,0,0.4); font-size: 1rem;";
    closeBtn.onclick = () => { window.location.reload(); };
    document.body.appendChild(closeBtn);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const orientationEvent = isIOS ? 'deviceorientation' : 'deviceorientationabsolute';

    window.addEventListener(orientationEvent, function(event) {
        if (!window.arApples || window.arScore >= window.arTotalApples || (!userCoords && !window.arSmoothedCoords)) return;

        let rawHeading;
        if (event.webkitCompassHeading !== undefined) {
            rawHeading = event.webkitCompassHeading; 
        } else if (event.alpha !== null) {
            rawHeading = 360 - event.alpha; 
        } else {
            return; 
        }

        let screenOrientation = window.orientation || 0;
        rawHeading = (rawHeading + screenOrientation) % 360;
        if (rawHeading < 0) rawHeading += 360;

        // Smootha kompassvärdet (EMA-filter)
        if (window.arSmoothedHeading === null) {
            window.arSmoothedHeading = rawHeading;
        } else {
            let diff = rawHeading - window.arSmoothedHeading;
            // Hantera 360-gradersomslaget (så den inte snurrar ett helt varv baklänges)
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            window.arSmoothedHeading += diff * COMPASS_SMOOTHING_FACTOR;
            window.arSmoothedHeading = (window.arSmoothedHeading + 360) % 360;
        }

        let targetBearing;
        let effectiveCoords = window.arSmoothedCoords || userCoords;
        
        if (!window.arHasStarted) {
            let startPoint = currentRouteCoords[0];
            targetBearing = getBearing(effectiveCoords[0], effectiveCoords[1], startPoint[0], startPoint[1]);
        } else {
            let nextApple = window.arApples[window.arScore];
            targetBearing = getBearing(effectiveCoords[0], effectiveCoords[1], nextApple.lat, nextApple.lng);
        }

        let arrowRotation = targetBearing - window.arSmoothedHeading;
        const arrowEl = document.getElementById('ar-direction-arrow');
        
        if (arrowEl && arrowEl.getAttribute('visible') !== 'false') {
            arrowEl.setAttribute('rotation', `0 ${-arrowRotation} 0`);
        }

        const compensatorEl = document.getElementById('ar-pitch-roll-compensator');
        const camEl = document.querySelector('a-camera');
        
        if (compensatorEl && camEl && camEl.object3D) {
            let pitch = camEl.object3D.rotation.x;
            let roll = camEl.object3D.rotation.z;
            
            let pitchDeg = -pitch * (180 / Math.PI);
            let rollDeg = -roll * (180 / Math.PI);
            
            compensatorEl.setAttribute('rotation', `${pitchDeg} 0 ${rollDeg}`);
        }

    }, true);
}

// AR Uppdaterings-logik som anropas utifrån app.js när positionen ändras
window.handleARPositionUpdate = function() {
    if (document.getElementById('ar-scene') && window.arApples) {
        
        // Applicera matematisk smoothing (EMA-filter) på positionen
        if (userCoords) {
            if (!window.arSmoothedCoords) {
                window.arSmoothedCoords = [...userCoords];
            } else {
                window.arSmoothedCoords[0] += (userCoords[0] - window.arSmoothedCoords[0]) * GPS_SMOOTHING_FACTOR;
                window.arSmoothedCoords[1] += (userCoords[1] - window.arSmoothedCoords[1]) * GPS_SMOOTHING_FACTOR;
            }
        }
        
        // Använd den smoothade positionen för alla uträkningar
        let effectiveCoords = window.arSmoothedCoords || userCoords;
        
        if (!window.arHasStarted && effectiveCoords && currentRouteCoords.length > 0) {
            let distToStart = map.distance(effectiveCoords, [currentRouteCoords[0][0], currentRouteCoords[0][1]]);
            let startThreshold = travelMode === 0 ? 50 : 10;
            
            if (distToStart <= startThreshold) {
                window.arHasStarted = true;
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                
                const startSign = document.getElementById('ar-start-sign');
                if (startSign) {
                    startSign.setAttribute('animation', 'property: scale; to: 0 0 0; dur: 300; easing: easeInOutQuad');
                    setTimeout(() => {
                        if (startSign.parentNode) startSign.parentNode.removeChild(startSign);
                    }, 300);
                }
                
                if (window.arScore < window.arTotalApples) {
                    setTimeout(() => {
                        if (typeof window.renderARApple === 'function') {
                            window.renderARApple(window.arScore);
                        }
                    }, 400); 
                }
            }
        }

        let totalRouteDist = 0;
        for (let i = 0; i < currentRouteCoords.length - 1; i++) {
            totalRouteDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
        }

        let traveledDist = 0;
        for (let i = 0; i < lastRouteIndex; i++) {
            traveledDist += map.distance(currentRouteCoords[i], currentRouteCoords[i+1]);
        }
        if (lastRouteIndex < currentRouteCoords.length - 1 && effectiveCoords) {
             traveledDist += map.distance(currentRouteCoords[lastRouteIndex], effectiveCoords);
        }

        let progressPercent = totalRouteDist > 0 ? (traveledDist / totalRouteDist) * 100 : 0;
        progressPercent = Math.max(0, Math.min(100, progressPercent));

        let oldScore = window.arScore;

        if (window.arHasStarted && effectiveCoords) {
            while (window.arScore < window.arTotalApples) {
                let nextApple = window.arApples[window.arScore];
                let distToNext = map.distance(effectiveCoords, [nextApple.lat, nextApple.lng]);
                let eatThreshold = travelMode === 0 ? 50 : 10; 
                
                if (distToNext <= eatThreshold) {
                    window.arScore++; 
                    if (navigator.vibrate) navigator.vibrate(100); 
                } else {
                    break; 
                }
            }
        }

        if (gameState === 'FINISHED' || maxStepsReached >= initialTotalKm - 1) {
            window.arScore = window.arTotalApples;
            progressPercent = 100;
        }

        if (window.arScore > oldScore) {
            
            const scoreCard = document.getElementById('ar-score-card');
            if (scoreCard) scoreCard.innerHTML = `🍎 Äpplen: <b>${window.arScore} / ${window.arTotalApples}</b>`;
            playClickSound();

            let newlyEaten = false;
            for(let i = oldScore; i < window.arScore; i++) {
                if (window.arApples[i] && !window.arApples[i].collected) {
                    window.arApples[i].collected = true;
                    const appleEl = document.getElementById(`ar-apple-${i}`);
                    if (appleEl) {
                        appleEl.setAttribute('animation', 'property: scale; to: 0 0 0; dur: 300; easing: easeInOutQuad');
                        setTimeout(() => {
                            if (appleEl && appleEl.parentNode) appleEl.parentNode.removeChild(appleEl);
                        }, 300);
                    }
                    newlyEaten = true;
                }
            }
            
            if (newlyEaten && window.arScore < window.arTotalApples) {
                setTimeout(() => {
                    if (typeof window.renderARApple === 'function') {
                        window.renderARApple(window.arScore);
                    }
                }, 400); 
            }
        }

        const progressBar = document.getElementById('ar-progress-bar');
        const progressText = document.getElementById('ar-progress-text');
        if (progressBar && progressText) {
            progressBar.style.width = `${progressPercent}%`;
            progressText.innerHTML = `${Math.round(progressPercent)}%`;
        }

        if (progressPercent >= 99 && window.arScore >= window.arTotalApples) {
            if(!window.arGoalReached) {
                window.arGoalReached = true; 
                alert(`🎉 You did it! Du kom fram till målet och samlade ${window.arScore} äpplen! Awesome!`);
                
                const endSign = document.getElementById('ar-end-sign');
                if (endSign) {
                    endSign.setAttribute('animation', 'property: scale; to: 0 0 0; dur: 300; easing: easeInOutQuad');
                    setTimeout(() => {
                        if (endSign.parentNode) endSign.parentNode.removeChild(endSign);
                    }, 300);
                }
            }
        }

        if (window.arScore < window.arTotalApples && effectiveCoords) {
            const arrowEl = document.getElementById('ar-direction-arrow');
            if (arrowEl) arrowEl.setAttribute('visible', 'true');
        } else {
            const arrowEl = document.getElementById('ar-direction-arrow');
            if (arrowEl) arrowEl.setAttribute('visible', 'false'); 
        }
    }
};