const CONFIG = {
  relationshipStart: new Date('2025-06-06'),
};

// ── Days together ──
function getDaysTogether() {
  const ms = Date.now() - CONFIG.relationshipStart.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

// ── Animated counter (easeOutCubic) ──
function animateCounter(el, target, duration = 1400) {
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Floating hearts ──
function spawnHearts() {
  const container = document.getElementById('heartsContainer');
  if (!container) return;

  const icons = ['♥', '♡', '❤', '💜', '✦', '♥'];
  const count = 14;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'floating-heart';
    el.textContent = icons[i % icons.length];

    const left     = 3 + Math.random() * 94;
    const dur      = 6 + Math.random() * 8;
    const delay    = Math.random() * 10;
    const r0       = -25 + Math.random() * 50;
    const r1       = -25 + Math.random() * 50;
    const size     = 0.8 + Math.random() * 1.5;

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      --dur: ${dur}s;
      --delay: ${delay}s;
      --r0: ${r0}deg;
      --r1: ${r1}deg;
    `;
    container.appendChild(el);
  }
}

// ── Background sparkle dots ──
function spawnSparkles() {
  const section = document.getElementById('bannerSection');
  if (!section) return;

  for (let i = 0; i < 24; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    const size = 2 + Math.random() * 5;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${1.2 + Math.random() * 3.5}s;
      --delay: ${Math.random() * 5}s;
    `;
    section.appendChild(el);
  }
}

// ── Canvas confetti burst ──
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(dpr, dpr);

  const W = window.innerWidth;
  const H = window.innerHeight;

  const colors = [
    '#8b5cf6', '#a78bfa', '#c4b5fd',
    '#e879f9', '#f0abfc', '#ffffff',
    '#818cf8', '#6d28d9', '#ddd6fe',
  ];

  const particles = Array.from({ length: 140 }, () => {
    const side = Math.random() < 0.5 ? 0 : W;
    return {
      x: side === 0 ? -10 : W + 10,
      y: -20 - Math.random() * 150,
      r: 3 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: side === 0 ? 1 + Math.random() * 3 : -(1 + Math.random() * 3),
      vy: 1.5 + Math.random() * 4.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (-0.06 + Math.random() * 0.12),
      shape: Math.random() > 0.35 ? 'rect' : 'circle',
      opacity: 1,
    };
  });

  let raf;
  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    let anyAlive = false;

    particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.06;
      p.rotation += p.rotSpeed;
      p.opacity  -= 0.0035;

      if (p.y < H + 20 && p.opacity > 0) anyAlive = true;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle   = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.r, -p.r * 0.45, p.r * 2, p.r * 0.9);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (anyAlive) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  };

  tick();
}

// ── CTA button ──
function setupCta() {
  const btn = document.getElementById('celebrateBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = document.getElementById('timelineSection');
    if (next) {
      next.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Phase 2 not built yet — extra confetti as a preview
      launchConfetti();
    }
  });
}

// Color palette — purple family, stays in-brand
const MILESTONE_PALETTE = [
  '139, 92, 246',   // #8b5cf6  purple
  '129, 140, 248',  // #818cf8  indigo
  '167, 139, 250',  // #a78bfa  lavender
  '192, 132, 252',  // #c084fc  pink-purple
  '232, 121, 249',  // #e879f9  fuchsia
  '147, 51, 234',   // #9333ea  vivid purple
  '99,  102, 241',  // #6366f1  blue-indigo
  '109, 40,  217',  // #6d28d9  deep purple
];

// ── Timeline: render full-screen milestone pages ──
function renderTimeline(milestones) {
  const track = document.getElementById('timelineTrack');
  if (!track) return;

  // Build fixed progress dots container
  const dotsEl = document.createElement('nav');
  dotsEl.className = 'milestone-dots';
  dotsEl.setAttribute('aria-label', 'Timeline progress');
  document.body.appendChild(dotsEl);

  const dotEls = [];

  milestones.forEach((m, i) => {
    const rgb    = MILESTONE_PALETTE[i % MILESTONE_PALETTE.length];
    const isLast = i === milestones.length - 1;

    const section = document.createElement('div');
    section.className  = 'milestone';
    section.dataset.idx = i;
    section.style.setProperty('--m-rgb', rgb);

    const imgHtml = m.image
      ? `<img src="${m.image}" alt="${m.title}" class="milestone-img" loading="lazy">`
      : '';

    section.innerHTML = `
      <div class="milestone-blob milestone-blob--a" aria-hidden="true"></div>
      <div class="milestone-blob milestone-blob--b" aria-hidden="true"></div>
      <div class="milestone-blob milestone-blob--c" aria-hidden="true"></div>
      <div class="milestone-bg-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</div>
      <div class="milestone-content">
        <span class="milestone-date">${m.date}</span>
        <span class="milestone-emoji" aria-hidden="true">${m.emoji}</span>
        <h2 class="milestone-title">${m.title}</h2>
        <p class="milestone-text">${m.text}</p>
        ${imgHtml}
      </div>
      ${isLast ? '' : '<div class="milestone-hint" aria-hidden="true"><i class="fas fa-chevron-down"></i></div>'}
    `;

    track.appendChild(section);

    // Progress dot
    const dot = document.createElement('button');
    dot.className = 'milestone-dot';
    dot.setAttribute('aria-label', `Go to: ${m.title}`);
    dot.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    dotsEl.appendChild(dot);
    dotEls.push(dot);
  });

  return { dotEls };
}

// ── Timeline: scroll-triggered entrance + dot sync ──
function initTimelineObserver(dotEls) {
  const milestones = document.querySelectorAll('.milestone');
  if (!milestones.length) return;

  // Entrance animation observer
  const entranceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entranceObserver.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  // Active dot sync observer
  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = parseInt(entry.target.dataset.idx, 10);
      dotEls.forEach((d, di) => d.classList.toggle('active', di === idx));
    });
  }, { threshold: 0.5 });

  milestones.forEach(m => {
    entranceObserver.observe(m);
    dotObserver.observe(m);
  });
}

// ── Reward Pack: snake background animation ──
function initRewardsSnakeAnimation() {
  const canvas = document.getElementById('rewardsCanvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  // Size canvas to match the card element
  function resize() {
    const card = canvas.parentElement;
    const W = card.offsetWidth;
    const H = card.offsetHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);
    return { W, H };
  }

  let dims = resize();

  // Snake config — 3 snakes, different colors & speeds
  const SNAKE_DEFS = [
    { color: [139, 92, 246],  speed: 1.1, trail: 160, turnRate: 0.028 },
    { color: [167, 139, 250], speed: 0.8, trail: 120, turnRate: 0.038 },
    { color: [232, 121, 249], speed: 0.65, trail: 90, turnRate: 0.018 },
  ];

  const snakes = SNAKE_DEFS.map((def, i) => ({
    ...def,
    x: dims.W * (0.2 + i * 0.3),
    y: dims.H * (0.3 + (i % 2) * 0.4),
    angle: (i / SNAKE_DEFS.length) * Math.PI * 2,
    history: [],
  }));

  function tick() {
    const { W, H } = dims;
    ctx.clearRect(0, 0, W, H);

    snakes.forEach(s => {
      // Gentle random steering
      s.angle += (Math.random() - 0.5) * s.turnRate * 2;

      // Soft wall repulsion — push angle toward center
      const margin = 28;
      if (s.x < margin)     s.angle += 0.06;
      if (s.x > W - margin) s.angle -= 0.06;
      if (s.y < margin)     s.angle += 0.06;
      if (s.y > H - margin) s.angle -= 0.06;

      s.x = Math.max(2, Math.min(W - 2, s.x + Math.cos(s.angle) * s.speed));
      s.y = Math.max(2, Math.min(H - 2, s.y + Math.sin(s.angle) * s.speed));

      s.history.push({ x: s.x, y: s.y });
      if (s.history.length > s.trail) s.history.shift();

      // Draw trail — fades from tail (transparent) to head (brighter)
      const [r, g, b] = s.color;
      for (let i = 1; i < s.history.length; i++) {
        const t = i / s.history.length;
        const alpha = t * 0.45;   // max 45% — text stays readable
        const width = 1 + t * 2.5;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(s.history[i - 1].x, s.history[i - 1].y);
        ctx.lineTo(s.history[i].x,     s.history[i].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth   = width;
        ctx.lineCap     = 'round';
        ctx.shadowColor = `rgba(${r},${g},${b},0.35)`;
        ctx.shadowBlur  = 8;
        ctx.stroke();
        ctx.restore();
      }

      // Glowing head dot
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowBlur  = 14;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(tick);
  }

  // Re-size when card height settles (content renders)
  requestAnimationFrame(() => {
    dims = resize();
    // Re-seed snake positions after resize
    snakes.forEach((s, i) => {
      s.x = dims.W * (0.2 + i * 0.3);
      s.y = dims.H * (0.3 + (i % 2) * 0.4);
    });
    tick();
  });
}

// ── Reward Pack: modal carousel ──
const REWARDS_KEY = 'anniversary_rewards_v1';

function getClaimedRewards() {
  try { return JSON.parse(localStorage.getItem(REWARDS_KEY)) || {}; }
  catch { return {}; }
}

function initRewardsModal(rewards) {
  const modal    = document.getElementById('rwdModal');
  const overlay  = document.getElementById('rwdModalOverlay');
  const closeBtn = document.getElementById('rwdModalClose');
  const track    = document.getElementById('rwdTrack');
  const dotsEl   = document.getElementById('rwdDots');
  const prevBtn  = document.getElementById('rwdPrev');
  const nextBtn  = document.getElementById('rwdNext');
  const trigger  = document.getElementById('rewardsTriggerBtn');
  if (!modal || !track || !trigger) return;

  let current = 0;
  const claimed = getClaimedRewards();

  rewards.forEach((r, i) => {
    const isClaimed = !!claimed[r.id];
    const slide = document.createElement('div');
    slide.className = 'rwd-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML = `
      <span class="rwd-slide-emoji">${r.emoji}</span>
      <h3 class="rwd-slide-title">${r.title}</h3>
      <p class="rwd-slide-desc">${r.description}</p>
      <button class="rwd-claim-btn" ${isClaimed ? 'disabled' : ''} data-id="${r.id}">
        ${isClaimed ? `✓ Claimed on ${claimed[r.id]}` : 'Claim'}
      </button>
    `;
    if (!isClaimed) {
      slide.querySelector('.rwd-claim-btn').addEventListener('click', (e) => {
        const dateStr = new Date().toLocaleDateString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
        });
        const c = getClaimedRewards();
        c[r.id] = dateStr;
        localStorage.setItem(REWARDS_KEY, JSON.stringify(c));
        e.currentTarget.textContent = `✓ Claimed on ${dateStr}`;
        e.currentTarget.disabled = true;
      });
    }
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'rwd-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Reward ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  const slideEls = track.querySelectorAll('.rwd-slide');
  const dotEls   = dotsEl.querySelectorAll('.rwd-dot');

  function goTo(idx) {
    slideEls[current].classList.remove('active');
    dotEls[current].classList.remove('active');
    current = idx;
    track.style.transform = `translateX(-${current * 100}%)`;
    setTimeout(() => slideEls[current].classList.add('active'), 60);
    dotEls[current].classList.add('active');
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slideEls.length - 1;
  }

  prevBtn.disabled = true;
  prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  nextBtn.addEventListener('click', () => { if (current < slideEls.length - 1) goTo(current + 1); });

  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const d = touchX - e.changedTouches[0].clientX;
    if (Math.abs(d) < 44) return;
    d > 0 ? (current < slideEls.length - 1 && goTo(current + 1))
           : (current > 0 && goTo(current - 1));
  });

  const openModal  = () => { modal.classList.add('active');    document.body.style.overflow = 'hidden'; };
  const closeModal = () => { modal.classList.remove('active'); document.body.style.overflow = ''; };

  trigger.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
}

// ── Wrapped carousel ──
function initWrapped(slides) {
  const track    = document.getElementById('wrappedTrack');
  const dotsEl   = document.getElementById('wrappedDots');
  const prevBtn  = document.getElementById('wrappedPrev');
  const nextBtn  = document.getElementById('wrappedNext');
  if (!track || !dotsEl || !prevBtn || !nextBtn) return;

  let current = 0;

  // Build slides
  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'wrapped-slide' + (i === 0 ? ' active' : '');
    slide.style.setProperty('--g1', s.g1);
    slide.style.setProperty('--g2', s.g2);
    slide.style.setProperty('--g3', s.g3);
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-label', s.title);

    const statHtml = s.stat
      ? `<div class="wrapped-stat" data-target="${s.stat.replace(/,/g, '')}" data-display="${s.stat}">0</div>
         <p class="wrapped-stat-label">${s.statLabel}</p>`
      : '';

    slide.innerHTML = `
      <div class="wrapped-blob wrapped-blob--a" aria-hidden="true"></div>
      <div class="wrapped-blob wrapped-blob--b" aria-hidden="true"></div>
      <div class="wrapped-blob wrapped-blob--c" aria-hidden="true"></div>
      <span class="wrapped-counter">${i + 1} / ${slides.length}</span>
      <div class="wrapped-content">
        <span class="wrapped-tag">${s.tag}</span>
        <span class="wrapped-icon" aria-hidden="true">${s.icon}</span>
        ${statHtml}
        <h2 class="wrapped-title">${s.title}</h2>
        <p class="wrapped-subtitle">${s.subtitle}</p>
      </div>
    `;

    track.appendChild(slide);

    // Dot
    const dot = document.createElement('button');
    dot.className = 'wrapped-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}: ${s.title}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  const slideEls = track.querySelectorAll('.wrapped-slide');
  const dotEls   = dotsEl.querySelectorAll('.wrapped-dot');

  // Animated counter for numeric stats
  function runStatCounter(slideEl) {
    const el = slideEl.querySelector('.wrapped-stat');
    if (!el) return;
    const target  = parseInt(el.dataset.target, 10);
    const display = el.dataset.display;
    const start   = performance.now();
    const dur     = 900;
    const tick = (now) => {
      const p    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = Math.round(ease * target);
      // Re-apply commas if original had them
      el.textContent = display.includes(',')
        ? val.toLocaleString()
        : String(val);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = display;
    };
    requestAnimationFrame(tick);
  }

  function goTo(idx) {
    // Fade out current slide — removing .active resets all child transitions
    slideEls[current].classList.remove('active');
    dotEls[current].classList.remove('active');

    current = idx;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slideEls.length - 1;

    // Tiny gap so the browser commits the outgoing fade before starting the new one
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        slideEls[current].classList.add('active');
        dotEls[current].classList.add('active');
        // Stat counter fires after content has had time to stagger in
        setTimeout(() => runStatCounter(slideEls[current]), 520);
      });
    });
  }

  // Init first slide
  prevBtn.disabled = true;
  setTimeout(() => runStatCounter(slideEls[0]), 800);

  prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
  nextBtn.addEventListener('click', () => { if (current < slideEls.length - 1) goTo(current + 1); });

  // Keyboard arrows
  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('wrappedSection');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft'  && current > 0)                  goTo(current - 1);
    if (e.key === 'ArrowRight' && current < slideEls.length - 1) goTo(current + 1);
  });

  // Touch swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const delta = touchX - e.changedTouches[0].clientX;
    if (Math.abs(delta) < 48) return;
    delta > 0
      ? (current < slideEls.length - 1 && goTo(current + 1))
      : (current > 0 && goTo(current - 1));
  });
}

// ── Looking Forward ──
const GOALS_KEY = 'anniversary_goals_v1';

function getCheckedGoals() {
  try { return new Set(JSON.parse(localStorage.getItem(GOALS_KEY)) || []); }
  catch { return new Set(); }
}

function saveCheckedGoals(set) {
  localStorage.setItem(GOALS_KEY, JSON.stringify([...set]));
}

function initLookingForward(data) {
  const section  = document.getElementById('forwardSection');
  const list     = document.getElementById('forwardGoalsList');
  const subEl    = document.getElementById('forwardSub');
  const closeEl  = document.getElementById('forwardClosing');
  const daysEl   = document.getElementById('forwardDaysCount');
  if (!section || !list) return;

  if (subEl)   subEl.textContent   = data.subtitle  || '';
  if (closeEl) closeEl.textContent = data.closing   || '';
  if (daysEl)  animateCounter(daysEl, getDaysTogether(), 1600);

  const checked = getCheckedGoals();

  (data.goals || []).forEach((goal, i) => {
    const li = document.createElement('li');
    li.className = 'goal-item' + (checked.has(i) ? ' checked' : '');
    li.dataset.idx = i;
    li.innerHTML = `
      <button class="goal-check" aria-label="Toggle goal" aria-pressed="${checked.has(i)}">
        <i class="fas fa-check"></i>
      </button>
      <span class="goal-text">${goal}</span>
    `;

    li.addEventListener('click', () => {
      const isChecked = li.classList.toggle('checked');
      li.querySelector('.goal-check').setAttribute('aria-pressed', isChecked);
      if (isChecked) checked.add(i); else checked.delete(i);
      saveCheckedGoals(checked);
    });

    list.appendChild(li);
  });

  // Entrance animation via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      section.classList.add('visible');
      observer.unobserve(section);
    });
  }, { threshold: 0.2 });

  observer.observe(section);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Animated day counter
  const dayEl = document.getElementById('daysCount');
  if (dayEl) animateCounter(dayEl, getDaysTogether());

  // Ambient effects
  spawnHearts();
  spawnSparkles();

  // Confetti after short dramatic pause
  setTimeout(launchConfetti, 350);

  setupCta();

  // Reward Pack — DJ card + modal
  initRewardsSnakeAnimation();
  fetch('./assets/data/rewardsData.json')
    .then(r => r.json())
    .then(data => initRewardsModal(data))
    .catch(() => console.warn('rewardsData.json not found'));

  // Wrapped carousel
  fetch('./assets/data/wrappedData.json')
    .then(r => r.json())
    .then(data => initWrapped(data))
    .catch(() => console.warn('wrappedData.json not found'));

  // Timeline
  fetch('./assets/data/timelineData.json')
    .then(r => r.json())
    .then(data => {
      const { dotEls } = renderTimeline(data);
      initTimelineObserver(dotEls);
    })
    .catch(() => {
      const track = document.getElementById('timelineTrack');
      if (track) track.innerHTML = '<p style="color:var(--text-secondary);padding:20px 32px">Timeline coming soon.</p>';
    });

  // Looking Forward
  fetch('./assets/data/lookingForwardData.json')
    .then(r => r.json())
    .then(data => initLookingForward(data))
    .catch(() => console.warn('lookingForwardData.json not found'));
});
