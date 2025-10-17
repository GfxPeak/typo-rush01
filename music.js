// music.js â€” background music + UI click/hover sounds 
(function () {
  const MUSIC_PATH = "music/mainbg.mp3";
  const TARGET_VOLUME = 0.45;
  const FADE_MS = 800;
  const SAVE_INTERVAL_MS = 1000;

  let bgMusic = null;
  let musicOn = JSON.parse(localStorage.getItem("musicOn"));
  if (musicOn === null) musicOn = false;

  let lastTime = parseFloat(localStorage.getItem("musicTime")) || 0;
  let fadeTimer = null;
  let hasStartedPlayback = false;

  // --- Core helpers ---
  function ensureAudio() {
    if (!bgMusic) {
      bgMusic = new Audio(MUSIC_PATH);
      bgMusic.loop = true;
      bgMusic.volume = 0;
      try { bgMusic.currentTime = lastTime; } catch (e) {}
    }
  }

  function fadeTo(targetVolume = TARGET_VOLUME, ms = FADE_MS, onComplete = null) {
    if (!bgMusic) return;
    clearInterval(fadeTimer);
    const start = performance.now();
    const initial = bgMusic.volume;
    const delta = targetVolume - initial;
    fadeTimer = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / ms);
      bgMusic.volume = initial + delta * t;
      if (t >= 1) {
        clearInterval(fadeTimer);
        fadeTimer = null;
        if (onComplete) onComplete();
      }
    }, 16);
  }

  function fadeOutAndPause(ms = FADE_MS, cb = null) {
    if (!bgMusic) return;
    fadeTo(0, ms, () => {
      try { bgMusic.pause(); } catch (e) {}
      if (cb) cb();
    });
  }

  async function tryPlayAndFadeIn() {
    ensureAudio();
    if (!bgMusic) return;

    try {
      await bgMusic.play();
      hasStartedPlayback = true;
      fadeTo(TARGET_VOLUME);
    } catch (err) {
      hasStartedPlayback = false;
    }
  }

  // --- UI sync ---
  function updateToggleLabel() {
    const toggleBtn = document.getElementById("musicToggle");
    if (!toggleBtn) return;
    toggleBtn.textContent = `Music: ${musicOn ? "On" : "Off"}`;
  }

  // --- Main toggle ---
  function toggleMusic() {
    ensureAudio();
    musicOn = !musicOn;
    localStorage.setItem("musicOn", JSON.stringify(musicOn));
    updateToggleLabel();

    if (musicOn) {
      tryPlayAndFadeIn();
    } else {
      fadeOutAndPause();
    }
  }

  // --- Save position ---
  function startSavingPosition() {
    setInterval(() => {
      if (bgMusic && !bgMusic.paused) {
        localStorage.setItem("musicTime", bgMusic.currentTime);
      }
    }, SAVE_INTERVAL_MS);
  }

  // --- Unlock playback on user action ---
  function unlockOnInteraction() {
    if (!musicOn || hasStartedPlayback) return;
    tryPlayAndFadeIn();
    hasStartedPlayback = true;
  }

  // --- Change background track dynamically (based on mode) ---
  function changeTrack(newPath) {
    // Stop current music
    if (bgMusic) {
      bgMusic.pause();
      bgMusic = null;
    }

    // Create new audio object with the new track
    bgMusic = new Audio(newPath);
    bgMusic.loop = true;
    bgMusic.volume = 0; // Start at 0 for fade-in effect

    // Only play if music is currently ON
    if (musicOn) {
      bgMusic.play().catch(err => console.log("Track switch failed:", err));
      fadeTo(TARGET_VOLUME); // Fade in to target volume
    }
    
    console.log(`ðŸŽµ Track changed to: ${newPath}, Music is: ${musicOn ? "ON" : "OFF"}`);
  }

  // --- Game control API ---
  function stopMusicForGame() {
    if (bgMusic) localStorage.setItem("musicTime", bgMusic.currentTime);
    fadeOutAndPause();
  }

  function resumeMusicFromMenu() {
    musicOn = JSON.parse(localStorage.getItem("musicOn")) || false;
    updateToggleLabel();
    if (musicOn) {
      ensureAudio();
      const t = parseFloat(localStorage.getItem("musicTime")) || 0;
      bgMusic.currentTime = t;
      tryPlayAndFadeIn();
    }
  }

  // --- ðŸŽ§ Click & Hover Sound Effects ---
  const clickSound = new Audio("music/single_click.mp3");
  const hoverSound = new Audio("music/hover_click.mp3");
  clickSound.volume = 0.5;
  hoverSound.volume = 0.4;

  function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

  function playHover() {
    hoverSound.currentTime = 0;
    hoverSound.play().catch(() => {});
  }

  function stopMusicHard() {
  if (fadeTimer) {
    clearInterval(fadeTimer);
    fadeTimer = null;
  }
  if (bgMusic) {
    try {
      bgMusic.pause();
      bgMusic.currentTime = 0;
      bgMusic.volume = TARGET_VOLUME; // reset volume for next play
    } catch (e) {
      console.error("Error stopping music hard:", e);
    }
  }
}

  // --- Global button + hover sound handler (works on all screens) ---
  document.addEventListener("DOMContentLoaded", () => {
    // play sounds for existing buttons
    document.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", playClick);
      btn.addEventListener("mouseenter", playHover);
    });

    // also handle dynamically added buttons (like in leaderboard)
    document.body.addEventListener("click", e => {
      if (e.target.matches("button")) playClick();
    });
    document.body.addEventListener("mouseenter", e => {
      if (e.target.matches("button")) playHover();
    }, true);
  });


  // --- Init background music ---
  document.addEventListener("DOMContentLoaded", () => {
    ensureAudio();
    updateToggleLabel();

    if (musicOn) tryPlayAndFadeIn();

    const btn = document.getElementById("musicToggle");
    if (btn) btn.addEventListener("click", toggleMusic);

    startSavingPosition();

    ["click", "keydown", "touchstart"].forEach(evt =>
      window.addEventListener(evt, unlockOnInteraction, { once: true, passive: true })
    );
  });

  // --- Global API ---
  window.musicController = {
    toggleMusic,
    stopMusicForGame,
    resumeMusicFromMenu,
    changeTrack,
    isMusicOn: () => musicOn,
    playClick,
    playHover,
    stopMusicHard
  };

})();