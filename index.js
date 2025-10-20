import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const db = window.db;

// ====== PRELOADER ======
window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const assetsToLoad = ['index.png'];
  let loaded = 0;

  const img = new Image();
  img.onload = hideLoader;
  img.onerror = hideLoader;
  img.src = assetsToLoad[0];

  function hideLoader() {
    loaded++;
    if (loaded >= assetsToLoad.length && loadingOverlay) {
      setTimeout(() => loadingOverlay.classList.add('loaded'), 300);
    }
  }

  setTimeout(() => loadingOverlay?.classList.add('loaded'), 3000);
});

// ===== ELEMENTS =====
const startBtn = document.getElementById('startBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const quitBtn = document.getElementById('quitBtn');
const musicToggle = document.getElementById('musicToggle');
const musicHint = document.getElementById('musicHint');
const usernameBox = document.getElementById('usernameBox');
const goBtn = document.getElementById('goBtn');
const usernameInput = document.getElementById('usernameInput');
const lineEl = document.querySelector('.line');

// ===== FUNCTIONS =====
function updateMusicHint() {
  const on = window.musicController?.isMusicOn() || false;
  on ? musicHint.classList.remove('show') : musicHint.classList.add('show');
}

function handleMusicToggle() {
  setTimeout(updateMusicHint, 50);
}

// ===== MAIN =====
document.addEventListener('DOMContentLoaded', () => {
  updateMusicHint();
  musicToggle.addEventListener('click', handleMusicToggle);

  // Start Button
  startBtn.addEventListener('click', () => {
    usernameBox.style.display = 'flex';
    usernameInput.focus();
  });

  goBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (!name) return alert('Enter your name first!');
    localStorage.setItem('username', name);
    setTimeout(() => (window.location.href = 'optsc.html'), 150);
  });

  leaderboardBtn.addEventListener('click', () => {
    setTimeout(() => (window.location.href = 'lb1.html'), 150);
  });

  // ===== CONTACT / FEEDBACK =====
  const quitMenu = document.getElementById('quitMenu');
  const closeQuit = document.getElementById('closeQuit');
  const githubBtn = document.getElementById('githubBtn');
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackForm = document.getElementById('feedbackForm');
  const submitFeedback = document.getElementById('submitFeedback');

  quitBtn.addEventListener('click', () => (quitMenu.style.display = 'flex'));
  closeQuit.addEventListener('click', () => {
    quitMenu.style.display = 'none';
    feedbackForm.style.display = 'none';
    document.getElementById('quitOptions').style.display = 'flex';
  });

  githubBtn.addEventListener('click', () =>
    window.open("https://github.com/GfxPeak/typo-rush01", "_blank")
  );

  feedbackBtn.addEventListener('click', () => {
    document.getElementById('quitOptions').style.display = 'none';
    feedbackForm.style.display = 'flex';
  });

  // ===== FIREBASE FEEDBACK SUBMISSION =====
  submitFeedback.addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('feedbackEmail').value.trim();
    const message = document.getElementById('feedbackMsg').value.trim();

    if (!message) {
      alert("Please write your feedback before submitting.");
      return;
    }

    try {
      await addDoc(collection(db, "feedbacks"), {
        email: email || "anonymous@typorush.com",
        message: message,
        timestamp: serverTimestamp()
      });

      alert("✅ Thank you for your feedback!");
      document.getElementById('feedbackEmail').value = "";
      document.getElementById('feedbackMsg').value = "";
      quitMenu.style.display = 'none';
      feedbackForm.style.display = 'none';
      document.getElementById('quitOptions').style.display = 'flex';

    } catch (err) {
      console.error("Error saving feedback:", err);
      alert("⚠️ Error saving feedback. Check console for details.");
    }
  });
});
