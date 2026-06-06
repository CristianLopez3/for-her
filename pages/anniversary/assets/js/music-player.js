(function () {
  const TRACKS = [
    { src: '../spotify/assets/mp3/tip-toe.mp3',  name: 'Tip Toe'   },
    { src: '../spotify/assets/mp3/sick-love.mp3', name: 'Sick Love' },
  ];

  let current = 0;
  let isPlaying = false;
  const audio = new Audio();
  audio.volume = 0.5;

  function setPlaying(val) {
    isPlaying = val;
    const player  = document.getElementById('musicPlayer');
    const icon    = document.getElementById('musicPlayIcon');
    const playBtn = document.getElementById('musicPlay');
    if (!player) return;
    player.classList.toggle('is-paused', !isPlaying);
    if (icon)    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    if (playBtn) playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  }

  function tryPlay() {
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }

  function loadTrack(idx, autoPlay) {
    current = ((idx % TRACKS.length) + TRACKS.length) % TRACKS.length;
    audio.src = TRACKS[current].src;
    const nameEl = document.getElementById('musicName');
    if (nameEl) nameEl.textContent = TRACKS[current].name;
    if (autoPlay) tryPlay();
  }

  function buildWidget() {
    const el = document.createElement('div');
    el.className = 'music-player is-paused';
    el.id = 'musicPlayer';
    el.innerHTML = `
      <div class="music-eq" aria-hidden="true">
        <span style="--dur:0.55s;--delay:0s"></span>
        <span style="--dur:0.80s;--delay:0.11s"></span>
        <span style="--dur:0.65s;--delay:0.22s"></span>
        <span style="--dur:0.72s;--delay:0.05s"></span>
      </div>
      <div class="music-info">
        <span class="music-label">Now Playing</span>
        <span class="music-name" id="musicName">${TRACKS[current].name}</span>
      </div>
      <div class="music-controls">
        <button class="music-btn" id="musicPrev" aria-label="Previous track">
          <i class="fas fa-backward-step"></i>
        </button>
        <button class="music-btn music-btn--play" id="musicPlay" aria-label="Play">
          <i class="fas fa-play" id="musicPlayIcon"></i>
        </button>
        <button class="music-btn" id="musicNext" aria-label="Next track">
          <i class="fas fa-forward-step"></i>
        </button>
        <button class="music-btn music-btn--close" id="musicClose" aria-label="Close player">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    document.body.appendChild(el);

    document.getElementById('musicPlay').addEventListener('click', () => {
      isPlaying ? (audio.pause(), setPlaying(false)) : tryPlay();
    });

    document.getElementById('musicPrev').addEventListener('click', () => {
      loadTrack(current - 1, isPlaying);
    });

    document.getElementById('musicNext').addEventListener('click', () => {
      loadTrack(current + 1, isPlaying);
    });

    document.getElementById('musicClose').addEventListener('click', () => {
      audio.pause();
      setPlaying(false);
      el.classList.add('is-dismissed');
    });

    audio.addEventListener('ended', () => loadTrack(current + 1, true));
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildWidget();
    audio.src = TRACKS[current].src;

    audio.play().then(() => setPlaying(true)).catch(() => {
      // Autoplay blocked — start on first user gesture
      const EVENTS = ['click', 'touchstart', 'scroll', 'keydown'];
      function onGesture() {
        EVENTS.forEach(evt => document.removeEventListener(evt, onGesture));
        tryPlay();
      }
      EVENTS.forEach(evt => document.addEventListener(evt, onGesture, { passive: true }));
    });
  });
})();
