// Bizarre Adventure — script.js (original homage)
(function(){
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d');
  let w, h, flakes=[];
  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.max(80, Math.floor(w*h/12000));
    flakes = Array.from({length: count}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      r: Math.random()*2 + 1.2, s: Math.random()*0.8 + 0.4, o: Math.random()*0.5 + 0.5
    }));
  }
  window.addEventListener('resize', resize, {passive:true}); resize();
  function tick(){
    ctx.clearRect(0,0,w,h); ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for(const f of flakes){
      ctx.globalAlpha = f.o; ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
      f.y += f.s; f.x += Math.sin(f.y*0.01)*0.3; if(f.y > h+5){ f.y = -5; f.x = Math.random()*w; }
    }
    ctx.globalAlpha = 1; requestAnimationFrame(tick);
  } tick();
  const toggle = document.getElementById('themeToggle'); const root = document.documentElement;
  const stored = localStorage.getItem('jj-theme');
  if(stored){ root.setAttribute('data-theme', stored); toggle?.setAttribute('aria-pressed', stored==='day'); }
  toggle?.addEventListener('click', () => {
    const isDay = root.getAttribute('data-theme') === 'day';
    const next = isDay ? 'night' : 'day';
    if(next==='night'){ root.removeAttribute('data-theme'); } else { root.setAttribute('data-theme','day'); }
    localStorage.setItem('jj-theme', next); toggle.setAttribute('aria-pressed', String(next==='day'));
  });
  const navBtn = document.querySelector('.nav-toggle'); const menu = document.getElementById('menu');
  navBtn?.addEventListener('click', () => {
    const exp = navBtn.getAttribute('aria-expanded') === 'true';
    navBtn.setAttribute('aria-expanded', String(!exp));
    menu.style.display = exp ? 'none' : 'flex'; menu.style.flexDirection = 'column';
    const cs = getComputedStyle(document.body);
    menu.style.background = cs.getPropertyValue('--panel'); menu.style.padding = '.75rem';
    menu.style.border = '1px solid ' + cs.getPropertyValue('--border'); menu.style.borderRadius = '.5rem';
  });
  const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
})();
