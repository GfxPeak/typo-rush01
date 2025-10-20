// scoresc.js — navigation + persistent music + stats + leaderboard saving
window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  // List of assets to preload
  const assetsToLoad = [
    'scoresc.jpg', // Your background image
    './fonts/super-pixel-font/SuperPixel-m2L8j.ttf',
    './fonts/dropline-font/DroplineRegular-Wpegz.otf'
  ];

  let loadedCount = 0;
  const totalAssets = assetsToLoad.length;

  function checkAllLoaded() {
    loadedCount++;
    if (loadedCount >= totalAssets) {
      setTimeout(() => {
        if (loadingOverlay) {
          loadingOverlay.classList.add('loaded');
        }
      }, 300);
    }
  }

  // Preload background image
  const img = new Image();
  img.onload = checkAllLoaded;
  img.onerror = checkAllLoaded; 
  img.src = assetsToLoad[0];

  // Preload fonts
  if (document.fonts) {
    Promise.all([
      document.fonts.load('1em SuperPixel'),
      document.fonts.load('1em DroplineRegular')
    ]).then(() => {
      checkAllLoaded();
      checkAllLoaded();
    }).catch(() => {
      checkAllLoaded();
      checkAllLoaded();
    });
  } else {
    checkAllLoaded();
    checkAllLoaded();
  }
});

// Elements
const musicToggle = document.getElementById('musicToggle');
const musicHint = document.getElementById('musicHint');
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");

// ===== MUSIC HANDLING =====
function updateMusicHint() {
  if (!musicHint) return;
  const musicOn = window.musicController?.isMusicOn() || false;
  if (musicOn) {
    musicHint.classList.remove('show');
  } else {
    musicHint.classList.add('show');
  }
}

function handleMusicToggle() {
  setTimeout(updateMusicHint, 50);
}

// ===== ON PAGE LOAD =====
window.addEventListener('DOMContentLoaded', () => {
  if (window.musicController) window.musicController.resumeMusicFromMenu();
  updateMusicHint();

  if (musicToggle) {
    musicToggle.addEventListener('click', handleMusicToggle);
  }
});

// ===== LOAD SAVED STATS =====
const totalWords = localStorage.getItem("finalWords") || 0;
const wrongs = localStorage.getItem("finalWrongs") || 0;
const finalScore = localStorage.getItem("finalScore") || 0;
const typingSpeed = localStorage.getItem("typingSpeed") || 0;
const playerName = localStorage.getItem("playerName") || "Player";

// Update stats on load
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll(".card h2");
  if (cards.length >= 4) {
    cards[0].textContent = totalWords;
    cards[1].textContent = wrongs;
    cards[2].textContent = finalScore;
    cards[3].textContent = typingSpeed + " LPS";
  }

  const descText = document.querySelector("p");
  if (descText) {
    descText.textContent = `Great job, ${playerName}! Here's your final performance.`;
  }

  // Save score to Firebase automatically
  saveScoreToFirebase(playerName, typingSpeed);
});

// ===== FIREBASE SAVE FUNCTION =====
async function saveScoreToFirebase(name, lps) {
  if (!name || !window.db) return;

  try {
    const { collection, addDoc } = await import(
      "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"
    );

    const now = new Date();

    const scoreData = {
      name: name,
      lps: parseFloat(lps),
      // Human-readable time
      submittedAt: now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }),
      // ISO timestamp for internal use
      timestamp: now.toISOString()
    };

    await addDoc(collection(window.db, "leaderboard"), scoreData);
    console.log("✅ Score saved to Firebase:", scoreData);
  } catch (err) {
    console.error("❌ Failed to save score:", err);
  }
}

// ===== BUTTONS =====
restartBtn.addEventListener("click", () => {
  if (window.musicController) window.musicController.playClick();
  setTimeout(() => {
    window.location.href = "optsc.html";
  }, 150);
});

leaderboardBtn.addEventListener('click', () => {
  if (window.musicController) window.musicController.playClick();
  setTimeout(() => {
    window.location.href = 'lb1.html';
  }, 150);
});

menuBtn.addEventListener("click", () => {
  if (window.musicController) window.musicController.playClick();
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 150);
});
