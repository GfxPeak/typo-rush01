// ===== FIREBASE IMPORTS =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyBhCg2BMWcPgc44snQs9o5coDUEwIZyZjI",
    authDomain: "typo-rush-3551b.firebaseapp.com",
    projectId: "typo-rush-3551b",
    storageBucket: "typo-rush-3551b.firebasestorage.app",
    messagingSenderId: "769554999839",
    appId: "1:769554999839:web:8cd7f9b73040c9546bc32a"
};

// Initialize Firebase
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

// ===== DOM ELEMENTS =====
const loadingOverlay = document.getElementById('loadingOverlay');
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

// ===== PRELOADER =====
window.addEventListener('load', () => {
  const assetsToLoad = [
    'index.png', 
    './fonts/super-pixel-font/SuperPixel-m2L8j.ttf',
    './fonts/beat-word-font/BeatWordDemo-nRL20.ttf'
  ];

  let loadedCount = 0;
  const totalAssets = assetsToLoad.length;

  function checkAllLoaded() {
    loadedCount++;
    if (loadedCount >= totalAssets) {
      setTimeout(() => {
        if (loadingOverlay) loadingOverlay.classList.add('loaded');
      }, 300);
    }
  }

  // Preload images
  assetsToLoad.forEach(src => {
    const img = new Image();
    img.onload = checkAllLoaded;
    img.onerror = checkAllLoaded;
    img.src = src;
  });

  // Preload fonts
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

// ===== MUSIC =====
function updateMusicHint() {
  if (!musicHint) return;
  const musicOn = window.musicController?.isMusicOn() || false;
  if (musicOn) musicHint.classList.remove('show');
  else musicHint.classList.add('show');
}

function handleMusicToggle() {
  setTimeout(updateMusicHint, 50);
}

// ===== TAGLINE ANIMATION =====
document.addEventListener('DOMContentLoaded', () => {
  if (lineEl) {
    const txt = lineEl.textContent.trim();
    lineEl.innerHTML = txt.split('').map(ch => `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  }
  updateMusicHint();
  if (musicToggle) musicToggle.addEventListener('click', handleMusicToggle);

  // ===== MENU BUTTONS =====
  startBtn.addEventListener('click', () => {
    usernameBox.style.display = usernameBox.style.display === 'flex' ? 'none' : 'flex';
    usernameBox.style.flexDirection = 'row';
    usernameInput.focus();
  });

  goBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (!name) {
      alert('Please enter your name to start.');
      usernameInput.focus();
      return;
    }
    localStorage.setItem('username', name);
    if (window.musicController) window.musicController.playClick();
    setTimeout(() => window.location.href = 'optsc.html', 150);
  });

  leaderboardBtn.addEventListener('click', () => {
    if (window.musicController) window.musicController.playClick();
    setTimeout(() => window.location.href = 'lb1.html', 150);
  });

  quitBtn.addEventListener('click', () => {
    if (window.musicController) window.musicController.playClick();
    quitMenu.style.display = 'flex';
  });

  closeQuit.addEventListener('click', () => {
    quitMenu.style.display = 'none';
    feedbackForm.style.display = 'none';
    document.getElementById('quitOptions').style.display = 'flex';
    const quitTitle = document.querySelector('.quit-title');
    if (quitTitle) quitTitle.textContent = "Leaving Already?";
  });

  githubBtn.addEventListener('click', () => {
    if (window.musicController) window.musicController.playClick();
    window.open("https://github.com/GfxPeak/typo-rush01", "_blank");
  });

  feedbackBtn.addEventListener('click', () => {
    if (window.musicController) window.musicController.playClick();
    document.getElementById('quitOptions').style.display = 'none';
    feedbackForm.style.display = 'flex';
    const quitTitle = document.querySelector('.quit-title');
    if (quitTitle) quitTitle.textContent = "We're Listening!";
  });

  // ===== FEEDBACK SUBMISSION =====
  submitFeedback.addEventListener('click', async () => {
    console.log("🔵 Submit button clicked!");
    
    const emailInput = document.getElementById('feedbackEmail');
    const messageInput = document.getElementById('feedbackMsg');
    
    console.log("Email input found:", !!emailInput);
    console.log("Message input found:", !!messageInput);
    
    const email = emailInput.value.trim() || "anonymous";
    const message = messageInput.value.trim();
    
    console.log("Email value:", email);
    console.log("Message value:", message);
    console.log("Message length:", message.length);

    if (!message) {
      console.log("❌ No message entered");
      alert("⚠️ Please write your feedback before submitting!");
      return;
    }

    // Check if Firebase is initialized
    console.log("Checking Firebase...");
    console.log("App exists:", !!app);
    console.log("DB exists:", !!db);
    
    if (!db) {
      console.error("❌ Firestore database not initialized");
      alert("⚠️ Database connection error. Please refresh the page.");
      return;
    }

    console.log("📤 Starting submission process...");

    // Disable button to prevent double-click
    submitFeedback.disabled = true;
    submitFeedback.textContent = "Submitting...";

    try {
      const feedbackData = {
        email: email,
        message: message,
        timestamp: new Date().toISOString(),
        submittedAt: Date.now()
      };

      console.log("📦 Data prepared:", feedbackData);
      console.log("📍 Collection name: feedbacks");

      // Save to Firestore
      console.log("🚀 Calling addDoc...");
      const docRef = await addDoc(collection(db, "feedbacks"), feedbackData);
      
      console.log("✅✅✅ SUCCESS! Document ID:", docRef.id);
      console.log("✅✅✅ Feedback saved to Firestore!");

      alert("✅ Thank you for your feedback!");
      emailInput.value = "";
      messageInput.value = "";
      quitMenu.style.display = 'none';
      feedbackForm.style.display = 'none';
      document.getElementById('quitOptions').style.display = 'flex';

      const quitTitle = document.querySelector('.quit-title');
      if (quitTitle) quitTitle.textContent = "Leaving Already?";

    } catch (err) {
      console.error("❌❌❌ FIRESTORE ERROR:", err);
      console.error("Error name:", err.name);
      console.error("Error code:", err.code);
      console.error("Error message:", err.message);
      console.error("Full error object:", JSON.stringify(err, null, 2));
      
      // More specific error messages
      if (err.code === 'permission-denied') {
        alert("⚠️ PERMISSION DENIED!\n\nGo to Firebase Console → Firestore Database → Rules\n\nChange rules to:\n\nallow read, write: if true;");
      } else if (err.code === 'unavailable') {
        alert("⚠️ Network error. Check your internet connection.");
      } else if (err.code === 'not-found') {
        alert("⚠️ Firestore database not found. Make sure Firestore is enabled in Firebase Console.");
      } else {
        alert("⚠️ Error: " + err.message + "\n\nCheck browser console (F12) for details.");
      }
    } finally {
      // Re-enable button
      submitFeedback.disabled = false;
      submitFeedback.textContent = "Submit";
    }
  });

  // ===== ENTER KEY FOR USERNAME =====
  usernameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') goBtn.click();
  });
});
