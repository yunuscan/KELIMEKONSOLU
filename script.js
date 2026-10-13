// ==========================================================================
// RETRO OKUMA UYGULAMASI - JAVASCRIPT ÇEKİRDEK KODU
// ==========================================================================

// Durum Değişkenleri
let currentSetIndex = "all";
let activeWordList = [];
let currentIndex = 0;
let readCount = 0;
let isShuffled = false;
let isSoundEnabled = false; // VARSAYILAN OLARAK SES KAPALI
let autoAdvanceTimer = null;

// DOM Elementleri
const wordDisplay = document.getElementById("wordDisplay");
const wordCard = document.getElementById("wordCard");
const mainStage = document.getElementById("mainStage");
const setSelector = document.getElementById("setSelector");
const wordMetaBadge = document.getElementById("wordMetaBadge");
const wordCounterBadge = document.getElementById("wordCounterBadge");
const praiseToast = document.getElementById("praiseToast");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnRead = document.getElementById("btnRead");
const btnFullscreen = document.getElementById("btnFullscreen");
const btnExitFsBottom = document.getElementById("btnExitFsBottom");
const btnSoundToggle = document.getElementById("btnSoundToggle");
const soundIcon = document.getElementById("soundIcon");
const soundLabel = document.getElementById("soundLabel");
const btnShuffle = document.getElementById("btnShuffle");

// Rastgele Tebrik Cümleleri
const PRAISES = [
  "HARİKA! ⭐",
  "AFERİN! 🎯",
  "SÜPERSİN! 🚀",
  "MÜKEMMEL! 🌟",
  "ÇOK İYİ! 👍",
  "IŞIK HIZINDA! ⚡",
  "DEVAM ET! 🔥",
  "KOCAMAN TEBRİKLER! 🎈"
];

// --------------------------------------------------------------------------
// 8-BIT RETRO SES MOTORU (Sadece Ses Açıksa Çalar)
// --------------------------------------------------------------------------
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playRetroSound(type = 'click') {
  if (!isSoundEnabled) return; // Ses kapalıysa hiçbir şey çalma

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    // Ses desteklenmiyorsa sessiz kal
  }
}

// Ses Aç / Kapat Toggle
function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  if (isSoundEnabled) {
    soundIcon.textContent = "🔊";
    if (soundLabel) soundLabel.textContent = "Ses Açık";
    btnSoundToggle.classList.add("is-active");
    playRetroSound('click');
  } else {
    soundIcon.textContent = "🔇";
    if (soundLabel) soundLabel.textContent = "Sessiz";
    btnSoundToggle.classList.remove("is-active");
  }
}

// --------------------------------------------------------------------------
// KELİME LİSTESİ YÖNETİMİ
// --------------------------------------------------------------------------
function initSetSelector() {
  setSelector.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = `📚 TÜM KELİMELER (${ALL_WORDS.length})`;
  setSelector.appendChild(allOption);

  WORD_SETS.forEach((set) => {
    const opt = document.createElement("option");
    opt.value = set.id;
    opt.textContent = `${set.title} (${set.words.length})`;
    setSelector.appendChild(opt);
  });

  setSelector.addEventListener("change", (e) => {
    currentSetIndex = e.target.value;
    loadWordSet(currentSetIndex);
    e.target.blur();
  });
}

function loadWordSet(setId) {
  let list = [];

  if (setId === "all") {
    WORD_SETS.forEach(set => {
      set.words.forEach(w => {
        list.push({ word: w, category: set.title.split("(")[0].trim() });
      });
    });
  } else {
    const found = WORD_SETS.find(s => s.id === setId);
    if (found) {
      found.words.forEach(w => {
        list.push({ word: w, category: found.title.split("(")[0].trim() });
      });
    }
  }

  if (isShuffled) {
    list = shuffleArray([...list]);
  }

  activeWordList = list;
  currentIndex = 0;
  renderCurrentWord();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --------------------------------------------------------------------------
// KELİME GÖSTERİMİ
// --------------------------------------------------------------------------
function updateWordFontSize(wordText) {
  wordDisplay.classList.remove("word-len-short", "word-len-medium", "word-len-long", "word-len-xlong");

  const len = wordText.length;
  if (len <= 4) {
    wordDisplay.classList.add("word-len-short");
  } else if (len <= 8) {
    wordDisplay.classList.add("word-len-medium");
  } else if (len <= 13) {
    wordDisplay.classList.add("word-len-long");
  } else {
    wordDisplay.classList.add("word-len-xlong");
  }
}

function renderCurrentWord() {
  if (!activeWordList || activeWordList.length === 0) return;

  const currentItem = activeWordList[currentIndex];
  
  wordDisplay.classList.remove("word-pop");
  void wordDisplay.offsetWidth; // Reflow
  wordDisplay.textContent = currentItem.word;
  updateWordFontSize(currentItem.word);
  wordDisplay.classList.add("word-pop");

  wordMetaBadge.textContent = currentItem.category;
  wordCounterBadge.textContent = `${currentIndex + 1} / ${activeWordList.length}`;
}

function nextWord(playSound = true) {
  if (playSound) playRetroSound('click');
  currentIndex = (currentIndex + 1) % activeWordList.length;
  renderCurrentWord();
}

function prevWord(playSound = true) {
  if (playSound) playRetroSound('click');
  currentIndex = (currentIndex - 1 + activeWordList.length) % activeWordList.length;
  renderCurrentWord();
}

// --------------------------------------------------------------------------
// OKUNDU & KONFETİ
// --------------------------------------------------------------------------
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#ffeb3b', '#ff4081', '#00e676', '#00b0ff', '#7c4dff']
    });
  } else {
    runFallbackConfetti();
  }
}

function runFallbackConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#4caf50', '#ffeb3b', '#ff9800'];

  for (let i = 0; i < 60; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.8,
      w: Math.random() * 10 + 5,
      h: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 14 + 6),
      gravity: 0.45,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8
    });
  }

  let frames = 0;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    frames++;
    if (frames < 70) {
      requestAnimationFrame(update);
    } else {
      canvas.remove();
    }
  }
  update();
}

function markAsRead(e) {
  if (e) {
    e.stopPropagation();
    if (e.currentTarget) e.currentTarget.blur();
  }

  readCount++;
  playRetroSound('success');
  triggerConfetti();

  const randomPraise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
  praiseToast.textContent = randomPraise;
  praiseToast.classList.add("show");

  clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = setTimeout(() => {
    praiseToast.classList.remove("show");
    nextWord(false);
  }, 600);
}

// --------------------------------------------------------------------------
// TAM EKRAN (FULLSCREEN) YÖNETİMİ
// --------------------------------------------------------------------------
function enterFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) {
    el.requestFullscreen().catch(() => {});
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  }
  document.body.classList.add("app-fullscreen");
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
  document.body.classList.remove("app-fullscreen");
}

function toggleFullscreen() {
  if (!document.fullscreenElement && !document.body.classList.contains("app-fullscreen")) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    document.body.classList.add("app-fullscreen");
  } else {
    document.body.classList.remove("app-fullscreen");
  }
});

// --------------------------------------------------------------------------
// DOKUNMATİK JESTLER (SWIPE)
// --------------------------------------------------------------------------
let touchStartX = 0;
let touchStartY = 0;

mainStage.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

mainStage.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX < 0) {
      nextWord(true);
    } else {
      prevWord(true);
    }
  } else if (Math.abs(diffX) < 15 && Math.abs(diffY) < 15) {
    nextWord(true);
  }
}, { passive: true });

mainStage.addEventListener("click", () => {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  nextWord(true);
});

// Buton Olayları (blur çağrısı ile basılı kalma önlenir)
btnNext.addEventListener("click", (e) => {
  e.stopPropagation();
  e.currentTarget.blur();
  nextWord(true);
});

btnPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  e.currentTarget.blur();
  prevWord(true);
});

btnRead.addEventListener("click", markAsRead);

btnFullscreen.addEventListener("click", (e) => {
  e.stopPropagation();
  e.currentTarget.blur();
  toggleFullscreen();
});

btnExitFsBottom.addEventListener("click", (e) => {
  e.stopPropagation();
  e.currentTarget.blur();
  exitFullscreen();
});

btnSoundToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  e.currentTarget.blur();
  toggleSound();
});

btnShuffle.addEventListener("click", (e) => {
  e.stopPropagation();
  e.currentTarget.blur();
  isShuffled = !isShuffled;
  btnShuffle.classList.toggle("is-active", isShuffled);
  loadWordSet(currentSetIndex);
});

// Klavye Kısayolları
window.addEventListener("keydown", (e) => {
  if (e.target.tagName === 'SELECT') return;

  if (e.code === "Space" || e.code === "ArrowRight") {
    e.preventDefault();
    nextWord(true);
  } else if (e.code === "ArrowLeft") {
    e.preventDefault();
    prevWord(true);
  } else if (e.code === "Enter") {
    e.preventDefault();
    markAsRead();
  } else if (e.key === "f" || e.key === "F") {
    e.preventDefault();
    toggleFullscreen();
  } else if (e.key === "Escape") {
    exitFullscreen();
  }
});

window.addEventListener("resize", () => {
  if (activeWordList[currentIndex]) {
    updateWordFontSize(activeWordList[currentIndex].word);
  }
});

// Başlangıç
window.addEventListener("DOMContentLoaded", () => {
  initSetSelector();
  loadWordSet("all");
});
