// ==========================================================================
// RETRO OKUMA UYGULAMASI - JAVASCRIPT ÇEKİRDEK KODU
// ==========================================================================

// Durum Değişkenleri
let currentSetIndex = "all"; // 'all' veya set id'si
let activeWordList = [];
let currentIndex = 0;
let readCount = 0;
let isShuffled = false;
let autoAdvanceTimer = null;

// DOM Elementleri
const wordDisplay = document.getElementById("wordDisplay");
const wordCard = document.getElementById("wordCard");
const mainStage = document.getElementById("mainStage");
const setSelector = document.getElementById("setSelector");
const wordMetaBadge = document.getElementById("wordMetaBadge");
const wordCounterBadge = document.getElementById("wordCounterBadge");
const statsCount = document.getElementById("statsCount");
const praiseToast = document.getElementById("praiseToast");

const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnRead = document.getElementById("btnRead");
const btnFullscreen = document.getElementById("btnFullscreen");
const btnSpeak = document.getElementById("btnSpeak");
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
// 8-BIT RETRO SES MOTORU (Web Audio API - Harici dosya gerektirmez)
// --------------------------------------------------------------------------
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playRetroSound(type = 'click') {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'click') {
    // Hafif sevimli retro bip sesi
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'success') {
    // 8-bit Mario/Arcade coin melodisi
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.08); // A5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  }
}

// --------------------------------------------------------------------------
// TÜRKÇE SESLENDİRME (Web Speech API)
// --------------------------------------------------------------------------
function speakCurrentWord() {
  if (!('speechSynthesis' in window)) return;
  
  const currentWord = activeWordList[currentIndex]?.word || "";
  if (!currentWord) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentWord);
  utterance.lang = "tr-TR";
  utterance.rate = 0.85; // Öğrencinin rahat duyması için hafif tane tane
  window.speechSynthesis.speak(utterance);
}

// --------------------------------------------------------------------------
// KELİME LİSTESİ HAZIRLAMA VE YÖNETİMİ
// --------------------------------------------------------------------------
function initSetSelector() {
  setSelector.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = `📚 TÜM KELİMELER (${ALL_WORDS.length} Kelime)`;
  setSelector.appendChild(allOption);

  WORD_SETS.forEach((set, index) => {
    const opt = document.createElement("option");
    opt.value = set.id;
    opt.textContent = `${set.title} (${set.words.length})`;
    setSelector.appendChild(opt);
  });

  setSelector.addEventListener("change", (e) => {
    currentSetIndex = e.target.value;
    loadWordSet(currentSetIndex);
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
function renderCurrentWord() {
  if (!activeWordList || activeWordList.length === 0) return;

  const currentItem = activeWordList[currentIndex];
  
  // Kelime animasyonunu tazele
  wordDisplay.classList.remove("word-pop");
  void wordDisplay.offsetWidth; // reflow tetikle
  wordDisplay.textContent = currentItem.word;
  wordDisplay.classList.add("word-pop");

  wordMetaBadge.textContent = currentItem.category;
  wordCounterBadge.textContent = `${currentIndex + 1} / ${activeWordList.length}`;
}

// Sonraki kelime
function nextWord(playSound = true) {
  if (playSound) playRetroSound('click');
  currentIndex = (currentIndex + 1) % activeWordList.length;
  renderCurrentWord();
}

// Önceki kelime
function prevWord(playSound = true) {
  if (playSound) playRetroSound('click');
  currentIndex = (currentIndex - 1 + activeWordList.length) % activeWordList.length;
  renderCurrentWord();
}

// --------------------------------------------------------------------------
// OKUNDU & KONFETİ PATLAMASI
// --------------------------------------------------------------------------
function triggerConfetti() {
  // Eğer harici confetti kütüphanesi varsa onu kullan, yoksa canvas fallback
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.75 },
      colors: ['#ffeb3b', '#ff4081', '#00e676', '#00b0ff', '#7c4dff']
    });
  } else {
    runFallbackConfetti();
  }
}

// İnternet olmasa da çalışan minimal konfeti
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

  for (let i = 0; i < 70; i++) {
    pieces.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.75,
      w: Math.random() * 12 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: -(Math.random() * 15 + 8),
      gravity: 0.5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10
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
    if (frames < 75) {
      requestAnimationFrame(update);
    } else {
      canvas.remove();
    }
  }
  update();
}

// "Okudum" Butonu Eylemi
function markAsRead(e) {
  if (e) e.stopPropagation(); // Ekrana dokunma olayını engelle

  // Skor artışı
  readCount++;
  statsCount.textContent = readCount;

  // Ses ve Konfeti
  playRetroSound('success');
  triggerConfetti();

  // Tebrik Rozeti Göster
  const randomPraise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
  praiseToast.textContent = randomPraise;
  praiseToast.classList.add("show");

  clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = setTimeout(() => {
    praiseToast.classList.remove("show");
    nextWord(false); // Otomatik bir sonraki kelimeye geçir
  }, 650);
}

// --------------------------------------------------------------------------
// TAM EKRAN (FULLSCREEN) YÖNETİMİ
// --------------------------------------------------------------------------
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn("Fullscreen hatası:", err);
    });
    btnFullscreen.innerHTML = `<span>🗗</span> Çık`;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    btnFullscreen.innerHTML = `<span>⛶</span> Tam Ekran`;
  }
}

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    btnFullscreen.innerHTML = `<span>🗗</span> Çık`;
  } else {
    btnFullscreen.innerHTML = `<span>⛶</span> Tam Ekran`;
  }
});

// --------------------------------------------------------------------------
// ETKİNLİK DİNLEYİCİLERİ (EVENTS)
// --------------------------------------------------------------------------
// Ekrana dokunulduğunda sıradaki kelimeye geçiş
mainStage.addEventListener("click", () => {
  nextWord(true);
});

// Alt gezinme butonları
btnNext.addEventListener("click", (e) => {
  e.stopPropagation();
  nextWord(true);
});

btnPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  prevWord(true);
});

// Okundu butonu
btnRead.addEventListener("click", markAsRead);

// Tam Ekran butonu
btnFullscreen.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleFullscreen();
});

// Sesli okuma
btnSpeak.addEventListener("click", (e) => {
  e.stopPropagation();
  speakCurrentWord();
});

// Karışık mod butonu
btnShuffle.addEventListener("click", (e) => {
  e.stopPropagation();
  isShuffled = !isShuffled;
  btnShuffle.style.background = isShuffled ? "#c8e6c9" : "#ffffff";
  loadWordSet(currentSetIndex);
});

// Klavye Kısayolları (Masaüstü için)
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
  }
});

// Başlangıç Yüklemesi
window.addEventListener("DOMContentLoaded", () => {
  initSetSelector();
  loadWordSet("all");
});
