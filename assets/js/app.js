// ─── Configuration ─────────────────────────────────────────────────────────
// Update RELATIONSHIP_START to your real start date
const CONFIG = {
  relationshipStart: new Date('2025-06-06'),
  anniversaryLabel: 'Our Anniversary',
  cardDataUrl: 'assets/data/cardsData.json',

  notes: [
    "I'll love you eternally",
    "Every day with you is a gift",
    "You make my world brighter",
    "Forever grateful for you",
    "My heart is yours, always",
    "Did you know I now love purple? guest why? :)",
    "Do you enjoy reading this? I hope so, I put a lot of love into it <3",
    "Can't wait to make more memories together",
    "Thank you for being you, and for being with me",
  ],

  featuredMoment: {
    image: './pages/aniversary-pinterest/assets/img/image1.jpeg',
    title: 'Anniversary Pinterest',
    caption: 'Our special moments together',
    route: 'pages/aniversary-pinterest/index.html'
  }
};

// ─── Invitation data (for profile modal) ────────────────────────────────────
const invitationData = {
  place: "Dejate sorprender mi amor!",
  date: "Viernes, 10 de Abril hasta el 12 de Abril",
  dressCode: "Lleva ropa linda, tendremos una cita en un restaurante lindo y luego, bueno, habran mas cosas.",
  activity: "Agrega el evento a tu calendario: ",
  whatsappNumber: "3133751604",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getDaysTogether() {
  const diff = Date.now() - CONFIG.relationshipStart.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDaysToAnniversary() {
  const now = new Date();
  const start = CONFIG.relationshipStart;
  let next = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  if (next <= now) next.setFullYear(next.getFullYear() + 1);
  return Math.ceil((next - now) / (1000 * 60 * 60 * 24));
}

function animateCounter(el, target) {
  const startVal = Math.max(0, target - 30);
  let current = startVal;
  const tick = () => {
    current = Math.min(current + 1, target);
    el.textContent = current.toLocaleString();
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ─── Renderers ───────────────────────────────────────────────────────────────
function renderHero() {
  const dayEl = document.getElementById('dayCount');
  animateCounter(dayEl, getDaysTogether());

  const daysLeft = getDaysToAnniversary();
  document.getElementById('heroCountdown').innerHTML = `
    <span class="countdown-badge">
      <i class="fas fa-calendar-day"></i>
      ${CONFIG.anniversaryLabel} &middot; <strong>${daysLeft}</strong> day${daysLeft !== 1 ? 's' : ''}
    </span>
  `;
}

function renderNavGrid(cards) {
  const grid = document.getElementById('navGrid');
  grid.innerHTML = cards.map(card => `
    <a href="${card.route}" class="nav-item">
      <div class="nav-item-icon">
        <img src="${card.icon}" alt="${card.title}">
      </div>
      <span class="nav-item-title">${card.title}</span>
    </a>
  `).join('');
}

let noteIndex = 0;

function renderNote() {
  document.getElementById('noteCard').innerHTML = `
    <div class="note-animation-zone">
      <canvas id="noteCanvas" class="note-canvas"></canvas>
    </div>
    <div class="note-text-zone">
      <p class="note-message">${CONFIG.notes[0]}</p>
    </div>
  `;
  initNoteAnimation();
}

function startNoteRotation() {
  if (CONFIG.notes.length <= 1) return;
  setInterval(() => {
    const el = document.querySelector('.note-message');
    if (!el) return;
    el.classList.add('fading');
    setTimeout(() => {
      noteIndex = (noteIndex + 1) % CONFIG.notes.length;
      el.textContent = CONFIG.notes[noteIndex];
      el.classList.remove('fading');
    }, 400);
  }, 5000);
}

function initNoteAnimation() {
  const canvas = document.getElementById('noteCanvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const SIZE = 180;

  canvas.width  = SIZE * dpr;
  canvas.height = SIZE * dpr;
  canvas.style.width  = SIZE + 'px';
  canvas.style.height = SIZE + 'px';
  ctx.scale(dpr, dpr);

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const BASE_R  = 58;
  const RING_W  = 11;
  const POINTS  = 220;

  // Each wave has a frequency, amplitude, phase, and drift speed.
  // Amplitude drifts randomly within [1.5, maxAmp] each frame for true randomness.
  const waves = [
    { freq: 2,  amp: 13, maxAmp: 19, phase: 0.0,  speed:  0.018 },
    { freq: 3,  amp:  9, maxAmp: 14, phase: 1.5,  speed: -0.012 },
    { freq: 5,  amp:  6, maxAmp: 10, phase: 0.8,  speed:  0.022 },
    { freq: 7,  amp:  4, maxAmp:  7, phase: 2.4,  speed: -0.016 },
    { freq: 11, amp:  3, maxAmp:  5, phase: 0.4,  speed:  0.019 },
    { freq: 13, amp:  2, maxAmp:  4, phase: 1.2,  speed: -0.024 },
  ];

  let rotation = 0;

  function getR(angle) {
    let r = BASE_R;
    for (const w of waves) r += Math.sin(w.freq * angle + w.phase) * w.amp;
    return r;
  }

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Slowly drift rotation and randomise each wave amplitude
    rotation += 0.005;
    for (const w of waves) {
      w.phase += w.speed;
      w.amp += (Math.random() - 0.5) * 0.2;
      w.amp = Math.max(1.5, Math.min(w.maxAmp, w.amp));
    }

    // Soft inner glow that breathes with the blob
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, BASE_R + RING_W + 6);
    glow.addColorStop(0.0, 'rgba(109, 40, 217, 0.14)');
    glow.addColorStop(0.6, 'rgba(76,  29, 149, 0.07)');
    glow.addColorStop(1.0, 'rgba(0,   0,   0,  0.00)');
    ctx.beginPath();
    ctx.arc(cx, cy, BASE_R + RING_W + 10, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Draw the deforming ring as POINTS small segments,
    // each coloured individually to approximate a conic gradient.
    ctx.save();
    ctx.lineWidth = RING_W;
    ctx.lineCap  = 'round';

    for (let i = 0; i < POINTS; i++) {
      const t1 = i / POINTS;
      const t2 = (i + 1) / POINTS;
      const a1 = t1 * Math.PI * 2 + rotation;
      const a2 = t2 * Math.PI * 2 + rotation;

      const r1 = getR(a1);
      const r2 = getR(a2);

      const x1 = cx + r1 * Math.cos(a1);
      const y1 = cy + r1 * Math.sin(a1);
      const x2 = cx + r2 * Math.cos(a2);
      const y2 = cy + r2 * Math.sin(a2);

      // Hue drifts gently around the violet/purple range (250–285)
      const hue = 265 + Math.sin(t1 * Math.PI * 2 + rotation * 0.4) * 18;
      const sat = 62 + t1 * 22;
      const lit = 40 + t1 * 30;
      // Brightness pulse travels around the ring like a highlight
      const pulse = 0.5 + Math.sin(t1 * Math.PI * 6 - rotation * 2.5) * 0.38;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${lit}%, ${Math.max(0.12, pulse)})`;
      ctx.stroke();
    }

    ctx.restore();
    requestAnimationFrame(draw);
  }

  draw();
}

function renderFeaturedMoment() {
  const el = document.getElementById('momentCard');
  el.href = CONFIG.featuredMoment.route;
  el.innerHTML = `
    <img class="moment-image" src="${CONFIG.featuredMoment.image}" alt="${CONFIG.featuredMoment.title}">
    <div class="moment-overlay">
      <p class="moment-title">${CONFIG.featuredMoment.title}</p>
      <p class="moment-caption">${CONFIG.featuredMoment.caption}</p>
    </div>
  `;
}

function setupModal() {
  const modal = document.getElementById('invitationModal');

  document.getElementById('invitationPlace').textContent = invitationData.place;
  document.getElementById('invitationDate').textContent = invitationData.date;
  document.getElementById('invitationDressCode').textContent = invitationData.dressCode;
  document.getElementById('invitationActivity').textContent = invitationData.activity;
  document.getElementById('invitationActivity').innerHTML +=
    `<a href="https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NGN2ZWJlaTNsMXNoZW5yaWp2dmVrdGsxdXYgY3Jpc3RpYW4uYy5sb3Blei5tQG0&tmsrc=cristian.c.lopez.m%40gmail.com" target="_blank" style="color:#8b5cf6;text-decoration:none;font-weight:700;"> Google Calendar</a>.`;

  const msg = encodeURIComponent('Obvio que voy mi amorcito lindo!!!!!');
  document.getElementById('whatsappBtn').href = `https://wa.me/${invitationData.whatsappNumber}?text=${msg}`;

  function openModal()  { modal.classList.add('active');    document.body.style.overflow = 'hidden'; }
  function closeModal() { modal.classList.remove('active'); document.body.style.overflow = ''; }

  document.getElementById('profileIcon').addEventListener('click', openModal);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  renderHero();
  renderNote();
  startNoteRotation();
  renderFeaturedMoment();
  setupModal();

  try {
    const res = await fetch(CONFIG.cardDataUrl);
    const cards = await res.json();
    renderNavGrid(cards);
  } catch (err) {
    console.error('Error loading cards:', err);
  }
});
