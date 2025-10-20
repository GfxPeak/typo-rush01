
// ===== PRELOADER =====
window.addEventListener('load', () => {
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  // List of assets to preload
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
        if (loadingOverlay) {
          loadingOverlay.classList.add('loaded');
        }
      }, 300);
    }
  }

  // Preload background image
  const img = new Image();
  img.onload = checkAllLoaded;
  img.onerror = checkAllLoaded; // Still hide loader even if image fails
  img.src = assetsToLoad[0];

  // Preload fonts
  if (document.fonts) {
    Promise.all([
      document.fonts.load('1em SuperPixel'),
      document.fonts.load('1em BeatWordDemo')
    ]).then(() => {
      checkAllLoaded();
      checkAllLoaded();
    }).catch(() => {
      checkAllLoaded();
      checkAllLoaded();
    });
  } else {
    // Fallback if Font Loading API not supported
    checkAllLoaded();
    checkAllLoaded();
  }
});


const startBtn = document.getElementById('startBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');
const quitBtn = document.getElementById('quitBtn');
const musicToggle = document.getElementById('musicToggle');
const musicHint = document.getElementById('musicHint');
const usernameBox = document.getElementById('usernameBox');
const goBtn = document.getElementById('goBtn');
const usernameInput = document.getElementById('usernameInput');
const lineEl = document.querySelector('.line');

// --- Update hint based on music state ---
function updateMusicHint() {
  if (!musicHint) return;
  
  // Check if music is on via the global controller
  const musicOn = window.musicController?.isMusicOn() || false;
  
  if (musicOn) {
    musicHint.classList.remove('show');
  } else {
    musicHint.classList.add('show');
  }
}

// --- Custom toggle handler to update hint ---
function handleMusicToggle() {

  setTimeout(updateMusicHint, 50); // Small delay to let music.js update first
}

// --- On load ---
document.addEventListener('DOMContentLoaded', () => {
  // Animate tagline
  if (lineEl) {
    const txt = lineEl.textContent.trim();
    lineEl.innerHTML = txt.split('').map(ch => `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  }

  // Update hint based on current music state
  updateMusicHint();

  // Add listener to update hint when music is toggled
  if (musicToggle) {
    musicToggle.addEventListener('click', handleMusicToggle);
  }

  // Menu buttons
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
    setTimeout(() => {
      window.location.href = 'optsc.html';
    }, 150); // small delay so the sound plays fully
  });

  leaderboardBtn.addEventListener('click', () => {
    if (window.musicController) window.musicController.playClick();
    setTimeout(() => {
      window.location.href = 'lb1.html';
    }, 150); // small delay so the sound plays fully
  });

  
  const quitMenu = document.getElementById('quitMenu');
const closeQuit = document.getElementById('closeQuit');
const githubBtn = document.getElementById('githubBtn');
const feedbackBtn = document.getElementById('feedbackBtn');
const feedbackForm = document.getElementById('feedbackForm');
const submitFeedback = document.getElementById('submitFeedback');

quitBtn.addEventListener('click', () => {
  if (window.musicController) window.musicController.playClick();
  quitMenu.style.display = 'flex';
});

closeQuit.addEventListener('click', () => {
  quitMenu.style.display = 'none';
  feedbackForm.style.display = 'none';
  document.getElementById('quitOptions').style.display = 'flex';
});

githubBtn.addEventListener('click', () => {
  if (window.musicController) window.musicController.playClick();
  window.open("https://github.com/GfxPeak/typo-rush01", "_blank");
});

feedbackBtn.addEventListener('click', () => {
  if (window.musicController) window.musicController.playClick();
  document.getElementById('quitOptions').style.display = 'none';
  feedbackForm.style.display = 'flex';
  
  // Change the title text for feedback
  const quitTitle = document.querySelector('.quit-title');
  if (quitTitle) {
    quitTitle.textContent = 'We\'re Listening!';
  }
});

  closeQuit.addEventListener('click', () => {
  quitMenu.style.display = 'none';
  feedbackForm.style.display = 'none';
  document.getElementById('quitOptions').style.display = 'flex';
  
  // Restore original text
  const quitTitle = document.querySelector('.quit-title');
  if (quitTitle) {
    quitTitle.textContent = 'Leaving Already?';
  }
});
submitFeedback.addEventListener('click', (e) => {
  e.preventDefault();

  const email = document.getElementById('feedbackEmail').value.trim();
  const message = document.getElementById('feedbackMsg').value.trim();

  if (!message) {
    alert("Please write your feedback before submitting.");
    return;
  }

  const formData = new FormData();
  formData.append("entry.592221968", email);
  formData.append("entry.1379318390", message);

  fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSdxM-ixMqudOndJO-X2E6Cv6r7rlWK7btRMX9j3Ptq3IPyZQA/formResponse", {
    method: "POST",
    body: formData,
    mode: "no-cors"
  })
  .then(() => {
    alert("✅ Feedback submitted successfully!");
    document.getElementById('feedbackEmail').value = "";
    document.getElementById('feedbackMsg').value = "";

    quitMenu.style.display = 'none';
    feedbackForm.style.display = 'none';
    document.getElementById('quitOptions').style.display = 'flex';
  })
  .catch((error) => {
    console.error("Error submitting feedback:", error);
    alert("⚠️ Something went wrong. Try again later.");
  });
});

  usernameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') goBtn.click();
  });
});







