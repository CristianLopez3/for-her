const dataPath = './assets/data/wrapped.json';
const container = document.getElementById('wrappedContainer');
const indicator = document.getElementById('scrollIndicator');

async function loadSlides(){
  try{
    const res = await fetch(dataPath);
    const slides = await res.json();
    renderSlides(slides);
    observeSlides();
  }catch(e){
    console.error('Error loading slides', e);
    container.innerHTML = '<p style="padding:80px;color:#f66">Sorry, we couldn\'t load the slides.</p>';
  }
}

function renderSlides(slides){
  container.innerHTML = slides.map(s => {
    const hasImg = s.image ? true : false;
    const rewardHtml = s.downloadableReward ? `
      <div class="reward-wrap">
        <a class="reward-btn" href="${s.downloadableReward.file}" download aria-label="${s.downloadableReward.label}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 3v12" stroke="${'#1db954'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11l4 4 4-4" stroke="${'#1db954'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${s.downloadableReward.label}
        </a>
      </div>` : '';

    return `
      <section class="slide ${s.classes || ''}" data-id="${s.id}" style="background:${s.backgroundColor || 'transparent'}; font-size: 100px">
        <div class="slide-inner">
          ${hasImg ? `<div class="slide-media"><img src="${s.image}" alt="${s.title} image" loading="lazy"/></div>` : ''}
          <div class="slide-content">
            <h2 class="${s.classes} slide-title">${s.title}</h2>
            <p class="slide-text">${s.text}</p>
            ${rewardHtml}
          </div>
        </div>
      </section>
    `;
  }).join('');
}

/* Simple escape for JSON text */
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

/* Helper to apply small stagger delays to children for nicer entrance */
function applyStagger(el){
  const title = el.querySelector('.slide-title');
  const text = el.querySelector('.slide-text');
  const img = el.querySelector('.slide-media img');
  const reward = el.querySelector('.reward-btn');

  // reset
  [title, text, img, reward].forEach(node=>{
    if(!node) return;
    node.style.transitionDelay = '0s';
  });

  // apply stagger (respect prefers-reduced-motion in CSS)
  if(title) title.style.transitionDelay = '0s';
  if(text) text.style.transitionDelay = '0.08s';
  if(img) img.style.transitionDelay = '0.12s';
  if(reward) reward.style.transitionDelay = '0.18s';
}

/* remove stagger when hiding to avoid sticky delays */
function clearStagger(el){
  const nodes = el.querySelectorAll('.slide-title, .slide-text, .slide-media img, .reward-btn');
  nodes.forEach(n=> n && (n.style.transitionDelay='0s'));
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
        // mark visible
        slides.forEach(s=>{
          if(s !== el){
            s.classList.remove('visible');
            clearStagger(s);
          }
        });
        el.classList.add('visible');
        applyStagger(el);

        // indicator: show only if first slide is visible
        const firstId = slides[0].dataset.id;
        indicator.style.opacity = (el.dataset.id === firstId) ? '1' : '0';
        indicator.style.transform = (el.dataset.id === firstId) ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)';
      } else if(!entry.isIntersecting){
        // hide when leaving
        el.classList.remove('visible');
        clearStagger(el);
      }
    });
  }, {threshold:[0.48], rootMargin: ' -8% 0px -8% 0px'});

  slides.forEach(s=>obs.observe(s));

  // hide indicator after user scrolls a bit (optional).
  let hideTimer;
  window.addEventListener('scroll', ()=>{
    indicator.style.opacity = '0';
    clearTimeout(hideTimer);
    hideTimer = setTimeout(()=>{ // show again if first slide is in view
      const first = document.querySelector('.slide');
      if(first && first.getBoundingClientRect().top >= -8 && first.getBoundingClientRect().top < window.innerHeight/2){
        indicator.style.opacity = '1';
      }
    }, 900);
  }, {passive:true});
}

/* Start */
document.addEventListener('DOMContentLoaded', loadSlides);