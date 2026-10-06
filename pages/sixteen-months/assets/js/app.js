import { launchFireworks } from './fireworks.js';

// ─── Configuration ───────────────────────────────────────────────────────────
const MAIN_PHRASE = `Dieciséis meses contigo, Amor.\nCada uno ha sido un regalo.`;

const CONFIG = {
  monthsUrl: './assets/data/months.json',
  totalMonths: 16,
  slideOutMs: 350,        // must match .slide transition in style.css
  climaxPauseMs: 900,     // let slide 16 breathe before the fireworks
  screenFadeMs: 600,      // must match .screen transition in style.css
  phraseFadeMs: 1000,     // must match .main-phrase transition in style.css
  flowerDrawMs: 3300,    // total flower draw time (see .flower.is-drawing rules)
  advanceKeys: [' ', 'Spacebar', 'Enter', 'ArrowRight'],
};

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  months: [],
  index: -1,          // -1 = welcome screen, 0..15 = slides
  isReady: false,     // months loaded (or fallback built)
  isBusy: false,      // a transition / the climax is running
  isFinished: false,  // climax reached — no more advancing
};

let els = {};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function wait(ms) {
  const duration = reducedMotionQuery.matches ? 0 : ms;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function setScreen(activeScreen) {
  [els.welcomeScreen, els.slidesScreen, els.climaxScreen].forEach((screen) => {
    const isActive = screen === activeScreen;
    screen.classList.toggle('is-active', isActive);
    screen.setAttribute('aria-hidden', String(!isActive));
  });
}

function buildFallbackMonths() {
  return Array.from({ length: CONFIG.totalMonths }, (_, i) => ({ month: i + 1, phrase: '' }));
}

async function loadMonths() {
  try {
    const res = await fetch(CONFIG.monthsUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Empty months data');
    return data;
  } catch (err) {
    // Degrade gracefully: the countdown still works, just without phrases.
    console.warn('months.json could not be loaded — showing numbers only.', err);
    return buildFallbackMonths();
  }
}

// ─── Renderers ───────────────────────────────────────────────────────────────
function renderSlideContent(index) {
  const entry = state.months[index];
  els.slideNumber.textContent = String(entry.month);
  els.slidePhrase.textContent = entry.phrase || '';
  els.progressFill.style.setProperty('--progress', String((index + 1) / state.months.length));
}

async function showSlide(index, { animateOut }) {
  const { slide } = els;

  if (animateOut) {
    slide.classList.remove('is-visible');
    slide.classList.add('is-leaving');
    await wait(CONFIG.slideOutMs);
  }

  // Reset below the fold without animating, then fade/slide in
  slide.classList.add('no-transition');
  slide.classList.remove('is-leaving');
  renderSlideContent(index);
  void slide.offsetWidth; // force reflow so the reset position sticks
  slide.classList.remove('no-transition');
  slide.classList.add('is-visible');

  state.index = index;
}

async function runClimax() {
  state.isFinished = true;

  await wait(CONFIG.climaxPauseMs);
  await launchFireworks();

  setScreen(els.climaxScreen);
  els.stage.classList.add('is-finished');
  await wait(CONFIG.screenFadeMs / 2);

  els.mainPhrase.classList.add('is-visible');
  await wait(CONFIG.phraseFadeMs * 0.7);

  els.flower.classList.add('is-drawing');
  await wait(CONFIG.flowerDrawMs);

  els.backLink.classList.add('is-visible');
}

// ─── Flow control ────────────────────────────────────────────────────────────
async function advance() {
  if (!state.isReady || state.isBusy || state.isFinished) return;
  state.isBusy = true;

  try {
    if (state.index === -1) {
      setScreen(els.slidesScreen);
      await showSlide(0, { animateOut: false });
    } else if (state.index < state.months.length - 1) {
      await showSlide(state.index + 1, { animateOut: true });
    }

    if (state.index === state.months.length - 1) {
      await runClimax();
    }
  } finally {
    state.isBusy = false;
  }
}

function handleStageClick(event) {
  if (event.target.closest('a, button')) return;
  advance();
}

function handleKeydown(event) {
  if (!CONFIG.advanceKeys.includes(event.key)) return;
  // Let Enter/Space activate a focused link (e.g. "← Volver") normally
  if (event.target.closest && event.target.closest('a, button')) return;
  event.preventDefault();
  advance();
}

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  els = {
    stage: document.getElementById('stage'),
    welcomeScreen: document.getElementById('welcomeScreen'),
    slidesScreen: document.getElementById('slidesScreen'),
    climaxScreen: document.getElementById('climaxScreen'),
    slide: document.getElementById('slide'),
    slideNumber: document.getElementById('slideNumber'),
    slidePhrase: document.getElementById('slidePhrase'),
    progressFill: document.getElementById('progressFill'),
    mainPhrase: document.getElementById('mainPhrase'),
    flower: document.getElementById('flower'),
    backLink: document.getElementById('backLink'),
  };

  // textContent + `white-space: pre-line` renders the \n as a line break safely
  els.mainPhrase.textContent = MAIN_PHRASE;

  els.stage.addEventListener('click', handleStageClick);
  document.addEventListener('keydown', handleKeydown);

  state.months = await loadMonths();
  state.isReady = true;
});
