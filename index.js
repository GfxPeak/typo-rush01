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

// ===== FEEDBACK SYNC FUNCTION =====
async function saveFeedbacksToFirebase() {
  const pendingFeedbacks = JSON.parse(localStorage.getItem('pendingFeedbacks') || '[]');
  
  if (pendingFeedbacks.length === 0) {
    console.log("✅ No pending feedbacks");
    return;
  }

  if (!window.db) {
    console.log("⚠️ Firebase not ready, will retry later");
    return;
  }

  console.log(`📤 Saving ${pendingFeedbacks.length} feedbacks to Firebase...`);

  try {
    const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js");
    
    const savedIndices = [];
    
    for (let i = 0; i < pendingFeedbacks.length; i++) {
      const feedback = pendingFeedbacks[i];
      
      try {
        const docRef = await addDoc(collection(window.db, "feedbacks"), feedback);
        console.log(`✅ Feedback ${i+1} saved! Doc ID:`, docRef.id);
        savedIndices.push(i);
      } catch (err) {
        console.error(`❌ Feedback ${i+1} failed:`, err.code, err.message);
        if (err.code === 'permission-denied') {
          console.error("🚫 PERMISSION DENIED - Check Firestore Rules!");
        }
      }
    }

    // Remove saved feedbacks
    if (savedIndices.length > 0) {
      const remainingFeedbacks = pendingFeedbacks.filter((_, index) => !savedIndices.includes(index));
      localStorage.setItem('pendingFeedbacks', JSON.stringify(remainingFeedbacks));
      console.log(`✅✅✅ ${savedIndices.length} feedbacks synced to Firebase!`);
      console.log(`📋 ${remainingFeedbacks.length} still pending`);
    }

  } catch (err) {
    console.error("❌ Error syncing feedbacks:", err);
  }
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
    
    // Restore original text
    const quitTitle = document.querySelector('.quit-title');
    if (quitTitle) {
      quitTitle.textContent = 'Leaving Already?';
    }
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

  // ===== FEEDBACK SUBMISSION (localStorage + Firebase sync) =====
  submitFeedback.addEventListener('click', () => {
    console.log("🔵 Submit feedback clicked");
    
    const email = document.getElementById('feedbackEmail').value.trim() || "anonymous";
    const message = document.getElementById('feedbackMsg').value.trim();

    if (!message) {
      alert('⚠️ Please write your feedback before submitting.');
      return;
    }

    console.log("📦 Saving feedback to localStorage...");

    // Save to localStorage immediately (like username)
    const feedbackData = {
      email: email,
      message: message,
      timestamp: new Date().toISOString(),
      submittedAt: Date.now()
    };

    // Get existing feedbacks or create new array
    let pendingFeedbacks = JSON.parse(localStorage.getItem('pendingFeedbacks') || '[]');
    pendingFeedbacks.push(feedbackData);
    localStorage.setItem('pendingFeedbacks', JSON.stringify(pendingFeedbacks));

    console.log("✅ Feedback saved to localStorage");
    console.log("Total pending feedbacks:", pendingFeedbacks.length);

    // Show success immediately
    alert('✅ Thank you for your feedback!');
    document.getElementById('feedbackEmail').value = '';
    document.getElementById('feedbackMsg').value = '';
    quitMenu.style.display = 'none';
    feedbackForm.style.display = 'none';
    document.getElementById('quitOptions').style.display = 'flex';
    
    const quitTitle = document.querySelector('.quit-title');
    if (quitTitle) quitTitle.textContent = 'Leaving Already?';

    // Try to save to Firebase in background
    saveFeedbacksToFirebase();
  });

  // Auto-sync pending feedbacks on page load
  setTimeout(() => {
    const pending = JSON.parse(localStorage.getItem('pendingFeedbacks') || '[]');
    if (pending.length > 0) {
      console.log(`📋 Found ${pending.length} pending feedbacks, attempting sync...`);
      saveFeedbacksToFirebase();
    }
  }, 2000);
  
  usernameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') goBtn.click();
  });
});
