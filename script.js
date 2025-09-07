// Embers + copy helpers + year
(function(){
  const c = document.getElementById('embers');
  const x = c.getContext('2d');
  let w,h,embers=[];
  function resize(){
    c.width = w = c.offsetWidth; c.height = h = c.offsetHeight;
    embers = Array.from({length: Math.max(80, Math.floor(w*h/30000))}, () => ({
      x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.8 + .6,
      s: Math.random()*0.4 + 0.2, o: Math.random()*0.6 + 0.2
    }));
  }
  window.addEventListener('resize', resize, {passive:true}); resize();
  function tick(){
    x.clearRect(0,0,w,h);
    for(const p of embers){
      x.globalAlpha = p.o; x.fillStyle = '#ff7b3e';
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, Math.PI*2); x.fill();
      x.fillStyle = '#ffb98d'; x.globalAlpha = p.o*0.4; x.beginPath(); x.arc(p.x-1, p.y-1, p.r*0.6, 0, Math.PI*2); x.fill();
      p.y -= p.s; p.x += Math.sin(p.y*0.03)*0.2; if(p.y < -5){ p.y = h+5; p.x = Math.random()*w; }
    }
    x.globalAlpha = 1; requestAnimationFrame(tick);
  } tick();
})();

document.querySelectorAll('.copy').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    try{ await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy', 1200); }
    catch(e){ btn.textContent='Select & Copy'; setTimeout(()=>btn.textContent='Copy', 1800); }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
