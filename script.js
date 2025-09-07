// JoJo’s Blizzard Adventure — script.js
// Snow canvas, theme toggle, and small interactions

(function(){
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d');
  let w, h, flakes;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    flakes = Array.from({length: Math.max(80, Math.floor(w*h/12000))}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*2 + 1.2,
      s: Math.random()*0.8 + 0.4,   // speed
      o: Math.random()*0.5 + 0.5    // opacity
    }));
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  function tick(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for(const f of flakes){
      ctx.globalAlpha = f.o;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fill();
      f.y += f.s;
      f.x += Math.sin(f.y * 0.01) * 0.3;
      if(f.y > h+5){ f.y = -5; f.x = Math.random()*w; }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  tick();

  // Theme toggle
  const root = document.documentElement;
  const stored = localStorage.getItem('jj-theme');
  toggle?.addEventListener('click', () => {
    const next = isDay ? 'night' : 'day';
    localStorage.setItem('jj-theme', next);
    toggle.setAttribute('aria-pressed', String(next==='day'));
  });

  // Mobile menu
  const navBtn = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  navBtn?.addEventListener('click', () => {
    const exp = navBtn.getAttribute('aria-expanded') === 'true';
    navBtn.setAttribute('aria-expanded', String(!exp));
    menu.style.display = exp ? 'none' : 'flex';
    menu.style.flexDirection = 'column';
    menu.style.background = getComputedStyle(document.body).getPropertyValue('--panel');
    menu.style.padding = '.75rem';
    menu.style.border = '1px solid ' + getComputedStyle(document.body).getPropertyValue('--border');
    menu.style.borderRadius = '.5rem';
  });

  // Year
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
})();

// Blizzard transition on internal same-site links (spawns from top-right)
(function(){
  const overlay = document.querySelector('.blizzard-overlay');
  let canvas = document.getElementById('blizzardCanvas');
  if(!overlay){
    // inject if missing (on index)
    const o = document.createElement('div'); o.className='blizzard-overlay'; o.setAttribute('aria-hidden','true');
    canvas = document.createElement('canvas'); canvas.id='blizzardCanvas';
    const wash = document.createElement('div'); wash.className='blizzard-wash';
    o.appendChild(canvas); o.appendChild(wash); document.body.appendChild(o);
  }
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function size(){canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight;}
  window.addEventListener('resize', size); size();
  let raf;
  function flake(w,h){return{x:w-40*Math.random(),y:-20*Math.random(),vx:-(1.5+2.5*Math.random()),vy:1+2.5*Math.random(),r:1+2*Math.random(),a:.6+.4*Math.random(),life:600+600*Math.random()};}
  function start(ms=900){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    document.querySelector('.blizzard-overlay').classList.add('active');
    const w=canvas.width,h=canvas.height; let pts=[]; for(let i=0;i<250;i++) pts.push(flake(w,h));
    let t0=performance.now();
    function step(t){ const dt=Math.min(32,t-(t0||t)); t0=t; ctx.clearRect(0,0,w,h);
      for(let p of pts){ p.x+=p.vx*dt/16; p.y+=p.vy*dt/16; p.vx*=.995; p.vy=Math.min(p.vy+.01,4); p.life-=dt;
        ctx.globalAlpha=p.a*Math.max(0,Math.min(1,p.life/600)); ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();}
      pts=pts.filter(p=>p.life>0&&p.y<h+10); raf=requestAnimationFrame(step); }
    cancelAnimationFrame(raf); raf=requestAnimationFrame(step); return true;
  }
  function stop(){ const ov=document.querySelector('.blizzard-overlay'); if(ov){ ov.classList.remove('active'); } cancelAnimationFrame(raf); ctx.clearRect(0,0,canvas.width,canvas.height); }
  document.addEventListener('click', (e)=>{
    const a=e.target.closest('a[href]'); if(!a) return;
    const href=a.getAttribute('href')||'';
    if(href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||a.target==='_blank') return;
    e.preventDefault(); const ok=start(900); if(!ok){ location.href=href; return;} setTimeout(()=>location.href=href,900);
  }, true);
  window.addEventListener('pageshow', ()=> setTimeout(stop, 100));
})();