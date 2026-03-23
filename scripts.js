(() => {
  const viewport = document.querySelector('.brands-viewport');
  const track = document.querySelector('.brands-track');
  if (!viewport || !track) return;

  // Pause/resume on hover
  viewport.addEventListener('pointerenter', () => { track.style.animationPlayState = 'paused'; });
  viewport.addEventListener('pointerleave', () => { track.style.animationPlayState = 'running'; });

  // Drag-to-scroll support
  let isDown = false; let startX=0; let scrollLeft=0;
  viewport.addEventListener('pointerdown', (e) => {
    isDown = true; startX = e.clientX; track.style.animationPlayState = 'paused';
    viewport.setPointerCapture(e.pointerId);
    scrollLeft = viewport.scrollLeft;
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    viewport.scrollLeft = scrollLeft - dx;
  });
  viewport.addEventListener('pointerup', (e) => { isDown=false; track.style.animationPlayState='running'; viewport.releasePointerCapture(e.pointerId); });
  viewport.addEventListener('pointercancel', () => { isDown=false; track.style.animationPlayState='running'; });
})();
// Modal video player for thumbnails
(function(){
  const modal = document.createElement('div'); modal.className='modal';
  modal.innerHTML = '<div class="box"><button class="close">✕</button><iframe src="" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
  document.body.appendChild(modal);
  const iframe = modal.querySelector('iframe');
  const close = modal.querySelector('.close');
  function open(url){ iframe.src = url + '?autoplay=1'; modal.classList.add('open'); }
  function closeModal(){ iframe.src=''; modal.classList.remove('open'); }
  document.querySelectorAll('.thumb').forEach(btn=>{
    btn.addEventListener('click',()=> open(btn.dataset.video));
  });
  close.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if (e.target===modal) closeModal(); });
})();
// ensure marquee clones width matches
document.addEventListener('DOMContentLoaded',function(){
  const tracks=document.querySelectorAll('.brands-track');
  if(tracks.length>=2){
    const first=tracks[0], clone=tracks[1];
    // set clone width to first's width
    clone.style.width=first.offsetWidth+'px';
  }
});
// TSP GMV live counter (since 2025-01-01 local timezone)
(function(){
  const startBase = new Date(2025,0,1,0,0,0); // Jan 1 2025 local
  const gmStart = 120000000; // base USD
  const incDay = {dayTicks:68,nightTicks:28,dayInc:4352,nightInc:2343};
  const TICK_MS = 15*60*1000;
  const valueEl = document.getElementById('gmv-value');
  function calculateCurrent(){
    const now=new Date();
    let days = Math.floor((now - startBase)/(24*60*60*1000));
    if(days<0) days=0;
    // total from full days
    const perDay = incDay.dayTicks*incDay.dayInc + incDay.nightTicks*incDay.nightInc;
    let total = gmStart + days*perDay;
    // partial today
    const dayStart = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    let minutesSinceMid = Math.floor((now - dayStart)/60000);
    // count 15-min ticks elapsed today
    const ticksToday = Math.floor(minutesSinceMid/15);
    // compute ticks in today's ticks by classifying each tick's time
    for(let i=0;i<=ticksToday;i++){
      const tickTime = new Date(dayStart.getTime() + i*15*60000);
      const h = tickTime.getHours();
      // day period 6:00 - 22:59 (6..22)
      if(h>=6 && h<23) total += incDay.dayInc; else total += incDay.nightInc;
    }
    return total;
  }
  function formatUSD(n){return '$'+n.toLocaleString('en-US',{maximumFractionDigits:0})}
  // animate number from previous to target
  let prev = calculateCurrent();
  function tick(){
    const target = calculateCurrent();
    // animate in 1s
    const start=prev, end=target; prev=end;
    const duration=800, startTime=Date.now();
    const raf=function(){
      const t=(Date.now()-startTime)/duration; const v=Math.round(start + (end-start)*Math.min(1,t));
      if(valueEl) valueEl.textContent = formatUSD(v);
      if(t<1) requestAnimationFrame(raf);
    };
    raf();
  }
  // initial
  if(valueEl) valueEl.textContent = formatUSD(prev);
  // schedule ticks aligned to real-world 15-minute boundaries
  function scheduleNext(){
    const now=new Date();
    const next = Math.ceil(now.getTime()/TICK_MS)*TICK_MS + 50; // small offset
    setTimeout(function(){ tick(); scheduleNext(); }, next - now.getTime());
  }
  scheduleNext();
})();
