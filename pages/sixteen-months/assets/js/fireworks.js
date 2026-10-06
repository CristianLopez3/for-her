// ─── Fireworks (canvas) ──────────────────────────────────────────────────────
// Standalone module: exports launchFireworks(). Registers no page-load
// listeners of its own — app.js decides when to call it.

// Pink and gold have no palette token in theme.css, so they live here.
const PINK = '#f472b6';
const GOLD = '#fbbf24';

const FIREWORKS_CONFIG = {
  durationMs: 4000,        // total show length before the canvas fades out
  spawnUntilMs: 3000,      // stop launching new bursts after this point
  burstIntervalMs: 280,    // average time between bursts
  particlesPerBurst: 70,
  gravity: 0.06,
  drag: 0.985,
  minSpeed: 1.5,
  maxSpeed: 5.5,
  fadeOutMs: 800,          // must match .fireworks-canvas transition in style.css
};

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function readToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Purple / purple-light / white come from theme.css tokens; any token that
// fails to resolve is simply dropped so we never hardcode palette values here.
function getPalette() {
  return [
    readToken('--accent-purple'),
    readToken('--accent-purple-light'),
    readToken('--text-primary'),
    PINK,
    GOLD,
  ].filter(Boolean);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createBurst(width, height, palette) {
  const x = randomBetween(width * 0.15, width * 0.85);
  const y = randomBetween(height * 0.15, height * 0.55);
  const mainColor = palette[Math.floor(Math.random() * palette.length)];
  const particles = [];

  for (let i = 0; i < FIREWORKS_CONFIG.particlesPerBurst; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(FIREWORKS_CONFIG.minSpeed, FIREWORKS_CONFIG.maxSpeed);
    // Mostly the burst color, with a sprinkle of the others for sparkle
    const color = Math.random() < 0.75
      ? mainColor
      : palette[Math.floor(Math.random() * palette.length)];

    particles.push({
      x,
      y,
      prevX: x,
      prevY: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: randomBetween(0.011, 0.02),
      size: randomBetween(1.2, 2.6),
      color,
    });
  }
  return particles;
}

/**
 * Plays a ~4s fullscreen fireworks show, then fades the canvas out and removes it.
 * Resolves when the show is completely over. Resolves immediately when the user
 * prefers reduced motion.
 * @returns {Promise<void>}
 */
export function launchFireworks() {
  if (reducedMotionQuery.matches) return Promise.resolve();

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.className = 'fireworks-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      canvas.remove();
      resolve();
      return;
    }

    const palette = getPalette();
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let particles = createBurst(width, height, palette);
    const startTime = performance.now();
    let nextBurstAt = startTime + FIREWORKS_CONFIG.burstIntervalMs;

    const finish = () => {
      window.removeEventListener('resize', resize);
      canvas.classList.add('is-fading');
      let done = false;
      const cleanup = () => {
        if (done) return;
        done = true;
        canvas.remove();
        resolve();
      };
      canvas.addEventListener('transitionend', cleanup, { once: true });
      // Safety net in case transitionend never fires
      setTimeout(cleanup, FIREWORKS_CONFIG.fadeOutMs + 100);
    };

    const frame = (now) => {
      const elapsed = now - startTime;

      if (elapsed < FIREWORKS_CONFIG.spawnUntilMs && now >= nextBurstAt) {
        particles = particles.concat(createBurst(width, height, palette));
        nextBurstAt = now + randomBetween(
          FIREWORKS_CONFIG.burstIntervalMs * 0.6,
          FIREWORKS_CONFIG.burstIntervalMs * 1.4
        );
      }

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';

      for (const p of particles) {
        p.prevX = p.x;
        p.prevY = p.y;
        p.vx *= FIREWORKS_CONFIG.drag;
        p.vy = p.vy * FIREWORKS_CONFIG.drag + FIREWORKS_CONFIG.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) continue;
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.prevX, p.prevY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      particles = particles.filter((p) => p.alpha > 0);

      if (elapsed < FIREWORKS_CONFIG.durationMs) {
        requestAnimationFrame(frame);
      } else {
        finish();
      }
    };

    requestAnimationFrame(frame);
  });
}
