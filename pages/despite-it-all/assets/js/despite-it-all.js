const dataPath = './assets/data/despite-it-all.json';
const container = document.getElementById('despiteContainer');
const indicator = document.getElementById('scrollIndicator');

async function loadSlides(){
  try{
    const res = await fetch(dataPath);
    const slides = await res.json();
    renderSlides(slides);
    observeSlides();
  }catch(e){
    console.error('Error loading slides', e);
    container.innerHTML = '<p class="despite-error">Sorry, we couldn\'t load the slides.</p>';
  }
}

function renderSlides(slides){
  container.innerHTML = slides.map(s => {
    const hasImg = s.image ? true : false;

    return `
      <section class="slide ${s.tone || ''} ${s.classes || ''}" data-id="${s.id}">
        <div class="slide-inner">
          ${hasImg ? `<div class="slide-media"><img src="${s.image}" alt="${s.title} image" loading="lazy"/></div>` : ''}
          <div class="slide-content">
            <h2 class="slide-title">${s.title}</h2>
            <p class="slide-text">${s.text}</p>
          </div>
        </div>
      </section>
    `;
  }).join('');
}

/* Helper to apply small stagger delays to children for nicer entrance */
function applyStagger(el){
  const nodes = el.querySelectorAll('.slide-title, .slide-text, .slide-media img');
  nodes.forEach(n => n.classList.add('stagger-delay'));
}

/* remove stagger when hiding to avoid sticky delays */
function clearStagger(el){
  const nodes = el.querySelectorAll('.slide-title, .slide-text, .slide-media img');
  nodes.forEach(n => n.classList.remove('stagger-delay'));
}

/* IntersectionObserver to trigger animations when slide enters viewport.
   Also shows/hides the scroll indicator (only show on first slide). */
function observeSlides(){
  const slides = document.querySelectorAll('.slide');
  if(!slides.length) return;

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const el = entry.target;
      if(entry.isIntersecting && entry.intersectionRatio > 0.48){
        slides.forEach(s=>{
          if(s !== el){
            s.classList.remove('visible');
            clearStagger(s);
          }
        });
        el.classList.add('visible');
        applyStagger(el);

        const firstId = slides[0].dataset.id;
        indicator.classList.toggle('is-active', el.dataset.id === firstId);
      } else if(!entry.isIntersecting){
        el.classList.remove('visible');
        clearStagger(el);
      }
    });
  }, {threshold:[0.48], rootMargin: '-8% 0px -8% 0px'});

  slides.forEach(s=>obs.observe(s));

  // hide indicator after user scrolls a bit, show again near the top
  let hideTimer;
  window.addEventListener('scroll', ()=>{
    indicator.classList.remove('is-active');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(()=>{
      const first = document.querySelector('.slide');
      if(first && first.getBoundingClientRect().top >= -8 && first.getBoundingClientRect().top < window.innerHeight/2){
        indicator.classList.add('is-active');
      }
    }, 900);
  }, {passive:true});
}

/* Keyboard navigation: arrow keys/space advance between slides like a swipe deck */
function goToSlide(index){
  const slides = document.querySelectorAll('.slide');
  if(!slides.length) return;
  const clamped = Math.max(0, Math.min(index, slides.length - 1));
  slides[clamped].scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function currentSlideIndex(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  let closest = 0;
  let closestDistance = Infinity;
  slides.forEach((s, i)=>{
    const distance = Math.abs(s.getBoundingClientRect().top);
    if(distance < closestDistance){
      closestDistance = distance;
      closest = i;
    }
  });
  return closest;
}

function setupKeyboardNav(){
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown'){
      e.preventDefault();
      goToSlide(currentSlideIndex() + 1);
    } else if(e.key === 'ArrowUp' || e.key === 'PageUp'){
      e.preventDefault();
      goToSlide(currentSlideIndex() - 1);
    }
  });
}

/* Touch swipe navigation, mirroring the wrapped page's up/down swipe behavior */
function setupSwipeNav(){
  let touchStartY = 0;
  let touchEndY = 0;
  const threshold = 50;

  window.addEventListener('touchstart', (e)=>{
    touchStartY = e.changedTouches[0].screenY;
  }, {passive:true});

  window.addEventListener('touchend', (e)=>{
    touchEndY = e.changedTouches[0].screenY;
    const delta = touchStartY - touchEndY;
    if(Math.abs(delta) < threshold) return;
    if(delta > 0){
      goToSlide(currentSlideIndex() + 1);
    } else {
      goToSlide(currentSlideIndex() - 1);
    }
  }, {passive:true});
}

/* Background audio toggle — starts paused (browsers block autoplay with sound anyway) */
function setupBgAudio(){
  const audio = document.getElementById('bgAudio');
  const btn = document.getElementById('audioToggle');
  if(!audio || !btn) return;

  audio.volume = 0.35;

  btn.addEventListener('click', () => {
    if(audio.paused){
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play',  () => {
    btn.classList.add('is-playing');
    btn.innerHTML = '<i class="fas fa-pause"></i>';
  });
  audio.addEventListener('pause', () => {
    btn.classList.remove('is-playing');
    btn.innerHTML = '<i class="fas fa-music"></i>';
  });
}

/* Start */
document.addEventListener('DOMContentLoaded', () => {
  loadSlides();
  setupKeyboardNav();
  setupSwipeNav();
  setupBgAudio();
});
