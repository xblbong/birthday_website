/* --- Background Music --- */
let bgMusic;
let isMusicPlaying = false;

function setupMusicBtn() {
    bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    musicBtn.classList.remove('hidden');
    
    musicBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicBtn.innerText = '🔇';
        } else {
            bgMusic.play();
            isMusicPlaying = true;
            musicBtn.innerText = '🎵';
        }
    });
}

function playMusicIfReady() {
    if (bgMusic && !isMusicPlaying) {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            document.getElementById('music-btn').innerText = '🎵';
        }).catch(err => {
            console.log("Auto-play blocked:", err);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setupMusicBtn();
    
    // Langsung auto-play secepat mungkin begitu Kiki sentuh layar / klik apapun!
    document.body.addEventListener('click', playMusicIfReady, { once: true });
    document.body.addEventListener('touchstart', playMusicIfReady, { once: true });
    
    /* --- Floating Background Emojis --- */
    const emojisArr = ['🌸', '✨', '👑', '💖', '🎀', '🎈', '🎉'];
    for (let i = 0; i < 24; i++) {
        let el = document.createElement('div');
        el.className = 'floating-emoji font-y2k';
        el.innerText = emojisArr[Math.floor(Math.random() * emojisArr.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (8 + Math.random() * 15) + 's';
        el.style.animationDelay = (Math.random() * 8) + 's';
        el.style.fontSize = (2.5 + Math.random() * 3) + 'rem';
        elementPosRand(el);
        document.body.appendChild(el);
    }
    
    setupLockInputs();
});

function elementPosRand(el) {
    const isMobile = window.innerWidth <= 768;
    if(isMobile) {
        el.style.left = Math.random() * 95 + 'vw';
    }
}

function switchPhase(currentIdx, nextIdx) {
    const curr = document.getElementById('phase' + currentIdx);
    const next = document.getElementById('phase' + nextIdx);
    
    curr.classList.remove('fade-in');
    curr.classList.add('fade-out');
    
    setTimeout(() => {
        curr.classList.add('hidden');
        next.classList.remove('hidden');
        next.classList.add('fade-out');
        
        setTimeout(() => {
            next.classList.remove('fade-out');
            next.classList.add('fade-in');
            
            if (nextIdx === 4) startBobaRush();
            if (nextIdx === 5) showTapGame();
            if (nextIdx === 6) startReveal();
        }, 50);
    }, 400);
}

function checkLogin() {
    playMusicIfReady(); 
    
    const val = document.getElementById('login-input').value.trim().toLowerCase();
    if (val === 'kiki') {
        switchPhase(0, 1);
    } else {
        showCustomAlert("Hmm, kamu bukan Princess Kiki deh! Coba ketik namamu yang bener ya!💅", "BUKAN KIKI!");
        document.getElementById('login-input').value = '';
    }
}
document.getElementById('login-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkLogin();
});

let alertCallback = null;
function showCustomAlert(msg, title = "UPSYY!", cb = null) {
    alertCallback = cb;
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-msg').innerText = msg;
    
    const alertEl = document.getElementById('custom-alert');
    const alertBox = document.getElementById('alert-box');
    
    alertEl.classList.remove('hidden');
    setTimeout(() => {
        alertEl.classList.remove('opacity-0');
        alertBox.classList.remove('scale-75');
        alertBox.classList.add('scale-100');
    }, 10);
}

function closeAlert() {
    const alertEl = document.getElementById('custom-alert');
    const alertBox = document.getElementById('alert-box');
    
    alertEl.classList.add('opacity-0');
    alertBox.classList.remove('scale-100');
    alertBox.classList.add('scale-75');
    
    setTimeout(() => {
        alertEl.classList.add('hidden');
        if (alertCallback) alertCallback();
    }, 300);
}


/* --- Phase 2: Letter Lock Game --- */
function setupLockInputs() {
    const inputs = [
        document.getElementById('l1'),
        document.getElementById('l2'),
        document.getElementById('l3'),
        document.getElementById('l4')
    ];
    
    inputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1 && index < 3) {
                inputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 1) {
                inputs[index - 1].focus();
            }
            if (e.key === 'Enter') {
                checkLetterLock();
            }
        });
    });
}

function checkLetterLock() {
    const l1 = document.getElementById('l1').value.toUpperCase();
    const l2 = document.getElementById('l2').value.toUpperCase();
    const l3 = document.getElementById('l3').value.toUpperCase();
    const l4 = document.getElementById('l4').value.toUpperCase();
    
    const word = l1 + l2 + l3 + l4;
    
    if (word === 'ABIL') {
        switchPhase(2, 3); 
    } else {
        showCustomAlert("Dih, sok tau! Masa gak hafal siapa kakaknya yang paling imut. (Clue: A_ _ _ )", "TETOT SALAH!");
        document.getElementById('l2').value = '';
        document.getElementById('l3').value = '';
        document.getElementById('l4').value = '';
        document.getElementById('l2').focus();
    }
}

/* --- Phase 3: Range Slider Trap --- */
const slider = document.getElementById('beauty-slider');
const sliderVal = document.getElementById('slider-val');
const next3Btn = document.getElementById('next3-btn');
const sliderError = document.getElementById('slider-error');

function teleportLanjut() {
    if (slider.value < 100) {
        const texts = ["PELIT BANGET!", "GAK BISA DIKLIK!", "NAIKIN DONG!"];
        next3Btn.innerText = texts[Math.floor(Math.random() * texts.length)];
        
        next3Btn.style.position = 'fixed';
        const x = Math.random() * (window.innerWidth - next3Btn.offsetWidth - 40) + 20;
        const y = Math.random() * (window.innerHeight - next3Btn.offsetHeight - 40) + 20;
        
        next3Btn.style.left = `${x}px`;
        next3Btn.style.top = `${y}px`;
        
        sliderError.classList.remove('hidden');
        sliderError.innerText = `Dih, cuma ${slider.value}% balabak? Gak bisa klik lanjut lah!`;
    }
}

next3Btn.addEventListener('mouseenter', teleportLanjut);
next3Btn.addEventListener('touchstart', (e) => {
    if (slider.value < 100) {
        e.preventDefault(); 
        teleportLanjut();
    }
}, {passive: false});

slider.addEventListener('input', function() {
    const val = this.value;
    sliderVal.innerText = val + '%';
    
    const percent = (val - this.min) / (this.max - this.min);
    const thumbOffset = 22;
    const pxOffset = percent * (this.offsetWidth - thumbOffset * 2) + thumbOffset;
    sliderVal.style.left = pxOffset + 'px';
    
    const scale = 1 + (val / 150);
    sliderVal.style.transform = `translateX(-50%) scale(${scale})`;
    
    if (val < 50) sliderVal.style.color = '#fff';
    else if (val < 90) sliderVal.style.color = '#ffeb3b';
    else sliderVal.style.color = '#00ffff';
    
    if (val < 100) {
        if (!sliderError.classList.contains('hidden')) {
            sliderError.innerText = `Dih, cuma ${val}% balabak? Gak bisa klik lanjut lah!`;
        }
    } else {
        next3Btn.style.position = 'relative';
        next3Btn.style.left = 'auto';
        next3Btn.style.top = 'auto';
        next3Btn.innerText = 'LANJUT';
        sliderError.classList.add('hidden');
        sliderVal.innerText = "1000% !!!";
        sliderVal.style.color = '#ff69b4';
        sliderVal.style.transform = `translateX(-50%) scale(1.5)`;
    }
});

function checkSlider() {
    if (slider.value == 100) {
        showCustomAlert("Makasih loh ya, tau kok xixixi kak abil emang cantik dan imut 💅✨", "CIE BENER!", () => {
            switchPhase(3, 4);
        });
    }
}

/* --- Phase 4: Boba Rush --- */
const playerEl = document.getElementById('player');
let bobaScore = 0;
let gameRunning = false;
let pX = window.innerWidth / 2;
let activeItems = [];
let spawnInterval;
let gameAnimation;

function startBobaRush() {
    bobaScore = 0;
    document.getElementById('score').innerText = bobaScore;
    gameRunning = true;
    playerEl.style.left = pX + 'px';
    
    activeItems = [];
    document.getElementById('game-items-container').innerHTML = '';
    
    spawnInterval = setInterval(spawnBobaItem, 350); 
    gameLoop();
}

window.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
    pX = e.clientX;
    updatePlayerPos();
});
window.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    e.preventDefault();
    pX = e.touches[0].clientX;
    updatePlayerPos();
}, {passive: false});

function updatePlayerPos() {
    const maxW = window.innerWidth;
    const pW = 80;
    if (pX < pW/2) pX = pW/2;
    if (pX > maxW - pW/2) pX = maxW - pW/2;
    playerEl.style.left = pX + 'px';
}

const bobaItems = [
    { type: 'good', em: '🧋'},
    { type: 'good', em: '🧴'},
    { type: 'good', em: '💄'},
    { type: 'bad', em: '🤢'},
    { type: 'bad', em: '💀'}
];

function spawnBobaItem() {
    if (!gameRunning) return;
    const itm = bobaItems[Math.floor(Math.random() * bobaItems.length)];
    const el = document.createElement('div');
    el.innerText = itm.em;
    el.className = 'absolute text-6xl drop-shadow-lg';
    
    const maxW = window.innerWidth;
    el.style.left = Math.random() * (maxW - 80) + 'px';
    el.style.top = '-80px';
    document.getElementById('game-items-container').appendChild(el);
    
    activeItems.push({
        el,
        y: -80,
        speed: 4 + Math.random() * 5 + (bobaScore * 0.4), 
        type: itm.type
    });
}

function gameLoop() {
    if (!gameRunning) return;
    
    const pRect = playerEl.getBoundingClientRect();
    
    for (let i = activeItems.length - 1; i >= 0; i--) {
        let it = activeItems[i];
        it.y += it.speed;
        it.el.style.top = it.y + 'px';
        
        const iRect = it.el.getBoundingClientRect();
        
        if (
            iRect.bottom > pRect.top + 20 &&
            iRect.top < pRect.bottom &&
            iRect.right > pRect.left + 15 &&
            iRect.left < pRect.right - 15
        ) {
            
            if (it.type === 'good') {
                bobaScore++;
                document.getElementById('score').innerText = bobaScore;
                
                playerEl.style.transform = 'translate(-50%, -15px) scale(1.3)';
                setTimeout(() => playerEl.style.transform = 'translate(-50%, 0) scale(1)', 150);
            } else {
                bobaScore = Math.max(0, bobaScore - 2);
                document.getElementById('score').innerText = bobaScore;
                
                document.body.style.filter = 'hue-rotate(90deg) invert(20%)';
                setTimeout(() => document.body.style.filter = 'none', 300);
            }
            
            it.el.remove();
            activeItems.splice(i, 1);
        } else if (it.y > window.innerHeight) {
            it.el.remove();
            activeItems.splice(i, 1);
        }
    }
    
    if (bobaScore >= 7) {
        gameRunning = false;
        clearInterval(spawnInterval);
        switchPhase(4, 5); // To Tap Tiup Lilin
    } else {
        gameAnimation = requestAnimationFrame(gameLoop);
    }
}

/* --- Phase 5: Tap Tap Game (Tiup Lilin) --- */
let taps = 0;
let tapTime = 10;
let tapInterval;
let tapActive = false;

function showTapGame() {
    taps = 0;
    tapTime = 10;
    tapActive = false;
    document.getElementById('tap-count').innerText = "0/50";
    document.getElementById('tap-time').innerText = "10";
    document.getElementById('start-tap-btn').classList.remove('hidden');
    document.getElementById('candle-fire').style.opacity = '1';
    document.getElementById('candle-fire').style.transform = 'scale(1)';
}

function startTapGame() {
    document.getElementById('start-tap-btn').classList.add('hidden');
    taps = 0;
    tapTime = 10;
    tapActive = true;
    document.getElementById('tap-count').innerText = "0/50";
    
    tapInterval = setInterval(() => {
        tapTime--;
        document.getElementById('tap-time').innerText = tapTime;
        
        if (tapTime <= 0) {
            clearInterval(tapInterval);
            tapActive = false;
            if (taps < 50) {
                showCustomAlert("Hahaha napasnya abis ya? Ulang lagi tiupnya dari awal! 🤣", "YAAH TEWAS!", () => {
                    showTapGame();
                });
            }
        }
    }, 1000);
}

document.getElementById('candle-fire').addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    if (tapActive) handleTap();
}, {passive: false});

document.getElementById('candle-fire').addEventListener('mousedown', (e) => {
    if (tapActive) handleTap();
});

function handleTap() {
    taps++;
    document.getElementById('tap-count').innerText = taps + "/50";
    
    const fire = document.getElementById('candle-fire');
    fire.style.transform = `scale(${1 + (Math.random() * 0.2)}) rotate(${(Math.random() - 0.5) * 20}deg)`;
    
    // Scale opacity down slightly
    const fireScale = Math.max(0, 1 - (taps / 50));
    fire.style.opacity = fireScale + 0.2; 
    
    if (taps >= 50) {
        tapActive = false;
        clearInterval(tapInterval);
        fire.style.opacity = '0';
        setTimeout(() => {
            switchPhase(5, 6);
        }, 500);
    }
}


/* --- Phase 6: Reveal --- */
function startReveal() {
    playMusicIfReady();
    const duration = 15 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        const colors = ['#ff69b4', '#00ffff', '#ffeb3b', '#d8b4e2', '#ffffff'];
        confetti({
            particleCount: 8,
            angle: 60,
            spread: 70,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 8,
            angle: 120,
            spread: 70,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
