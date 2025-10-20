// ===== FIREBASE IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyBhCg2BMWcPgc44snQs9o5coDUEwIZyZjI",
  authDomain: "typo-rush-3551b.firebaseapp.com",
  projectId: "typo-rush-3551b",
  storageBucket: "typo-rush-3551b.appspot.com",
  messagingSenderId: "769554999839",
  appId: "1:769554999839:web:8cd7f9b73040c9546bc32a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== PRELOADER =====
window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const assetsToLoad = [
    'index.png',
    './fonts/super-pixel-font/SuperPixel-m2L8j.ttf',
    './fonts/beat-word-font/BeatWordDemo-nRL20.ttf'
  ];

  let loadedCount = 0;
  const totalAssets = assetsToLoad.length;

  function checkAllLoaded() {
    loadedCount++;
    if (loadedCount >= totalAssets && loadingOverlay) {
      setTimeout(() => loadingOverlay.classList.add('loaded'), 300);
    }
  }

  const img = new Image();
  img.onload = checkAllLoaded;
  img.onerror = checkAllLoaded;
  img.src = assetsToLoad[0];

  if (document.fonts) {
    Promise.all([
      document.fonts.load('1em SuperPixel'),
      document.fonts.load('1em BeatWordDemo')
    ]).then(() => { checkAllLoaded(); checkAllLoaded(); })
      .catch(() => { checkAllLoaded(); checkAllLoaded(); });
  } else {
    checkAllLoaded(); checkAllLoaded();
  }
});

// ===== DOM ELEMENTS =====
const startBtn = document.getElementById('startBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const quitBtn = document.getElementById('quitBtn');
const musicToggle = document.getElementById('musicToggle');
const musicHint = document.getElementById('musicHint');
const usernameBox = document.getElementById('usernameBox');
const goBtn = document.getElementById('goBtn');
const usernameInput = document.getElementById('usernameInput');
const lineEl = document.querySelector('.line');

const quitMenu = document.getElementById('quitMenu');
const closeQuit = document.getElementById('closeQuit');
const githubBtn = document.getElementById('githubBtn');
const feedbackBtn = document.getElementById('feedbackBtn');
const feedbackForm = document.getElementById('feedbackForm');
const submitFeedback = document.getElementById('submitFeedback');

// ===== MUSIC HINT =====
function updateMusicHint() {
  if (!musicHint) return;
  const musicOn = window.musicController?.isMusicOn() || false;
  if (musicOn) musicHint.classList.remove('show');
  else musicHint.classList.add('show');
}

function handleMusicToggle() {
  setTimeout(updateMusicHint, 50);
}

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
  // Animate tagline
  if (lineEl) {
    const txt = lineEl.textContent.trim();
    lineEl.innerHTML = txt.split('').map(ch => `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  }

  updateMusicHint();
  if (musicToggle) musicToggle.addEventListener('click', handleMusicToggle);

  // ===== START / LEADERBOARD BUTTONS =====
  startBtn.addEventListener('click', () => {
    usernameBox.style.display = usernameBox.style.display === 'flex' ? 'none' : 'flex';
    usernameBox.style.flexDirection = 'row';
    usernameInput.focus();
  });

  goBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (!name) { alert('Please enter your name to start.'); usernameInput.focus(); return; }
    localStorage.setItem('username', name);
    if (window.musicController) window.musicController.playClick();
    setTimeout(() => { window.location.href = 'optsc.html'; }, 150);
  });

  leaderboardBtn.addEventListener('click', () => {
    if (window.musicController) window.musicController.playClick();
    setTimeout(() => { window.location.href = 'lb1.html'; }, 150);
  });

  // ===== QUIT MENU =====
  quitBtn.addEventListener('click', () => { if (window.musicController) window.musicController.playClick(); quitMenu.style.display = 'flex'; });
  closeQuit.addEventListener('click', () => { quitMenu.style.display = 'none'; feedbackForm.style.display = 'none'; document.getElementById('quitOptions').style.display = 'flex'; document.querySelector('.quit-title').textContent = 'Leaving Already?'; });
  githubBtn.addEventListener('click', () => { if (window.musicController) window.musicController.playClick(); window.open("https://github.com/GfxPeak/typo-rush01", "_blank"); });
  feedbackBtn.addEventListener('click', () => { if (window.musicController) window.musicController.playClick(); document.getElementById('quitOptions').style.display = 'none'; feedbackForm.style.display = 'flex'; document.querySelector('.quit-title').textContent = "We're Listening!"; });

  // ===== FEEDBACK FORM =====
  submitFeedback.addEventListener('click', async () => {
    const email = document.getElementById('feedbackEmail').value.trim() || 'anonymous';
    const message = document.getElementById('feedbackMsg').value.trim();

    if (!message) { alert('Please write your feedback before submitting.'); return; }

    try {
      await addDoc(collection(db, "feedbacks"), {
        email,
        message,
        timestamp: serverTimestamp()
      });

      alert('✅ Thank you for your feedback!');
      document.getElementById('feedbackEmail').value = '';
      document.getElementById('feedbackMsg').value = '';
      quitMenu.style.display = 'none';
      feedbackForm.style.display = 'none';
      document.getElementById('quitOptions').style.display = 'flex';
      document.querySelector('.quit-title').textContent = 'Leaving Already?';
    } catch (err) {
      console.error("Error saving feedback:", err);
      alert('⚠️ Something went wrong!');
    }
  });

  // ===== ENTER KEY =====
  usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') goBtn.click(); });
});
