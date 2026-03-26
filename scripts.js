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
// TSP GMV live counter (smoother & continuous updates)
(function(){
  const startBase = new Date(); // baseline timestamp (now)
  const gmStart = 120000000; // base USD at baseline
  const incDay = {dayTicks:68,nightTicks:28,dayInc:4352,nightInc:2343};
  const TICK_MS = 15*60*1000;
  const valueEl = document.getElementById('gmv-value');
  function formatUSD(n){return '$'+Math.round(n).toLocaleString('en-US',{maximumFractionDigits:0})}

  // calculate a continuous (fractional) current GMV based on time within current 15-min tick
  function calculateContinuous(){
    const now = new Date();
    let days = Math.floor((now - startBase)/(24*60*60*1000));
    if(days<0) days=0;
    const perDay = incDay.dayTicks*incDay.dayInc + incDay.nightTicks*incDay.nightInc;
    let total = gmStart + days*perDay;

    const dayStart = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const minutesSinceMid = (now - dayStart)/60000;
    const ticksToday = Math.floor(minutesSinceMid/15);

    // full ticks already elapsed today
    for(let i=0;i<=ticksToday;i++){
      const tickTime = new Date(dayStart.getTime() + i*15*60000);
      const h = tickTime.getHours();
      if(h>=6 && h<23) total += incDay.dayInc; else total += incDay.nightInc;
    }

    // fractional progress into the next tick
    const tickStartTime = new Date(dayStart.getTime() + (ticksToday+1)*15*60000);
    const tickPrevTime = new Date(dayStart.getTime() + (ticksToday)*15*60000);
    const tickDuration = TICK_MS;
    const nowMs = now.getTime();
    const tickElapsed = Math.max(0, Math.min(nowMs - tickPrevTime.getTime(), tickDuration));
    // determine which increment applies for the upcoming tick (use tickPrevTime hour)
    const hPrev = tickPrevTime.getHours();
    const upcomingInc = (hPrev>=6 && hPrev<23) ? incDay.dayInc : incDay.nightInc;
    // add fractional portion of upcoming tick so the number grows smoothly
    total += (tickElapsed / tickDuration) * upcomingInc;

    return total;
  }

  // update display at a smooth interval (every 800ms) using the continuous calculation
  let lastRendered = calculateContinuous();
  if(valueEl) valueEl.textContent = formatUSD(lastRendered);
  const SMOOTH_MS = 800;
  setInterval(function(){
    const current = calculateContinuous();
    // small damping to avoid micro-jitter: interpolate from lastRendered to current
    lastRendered = lastRendered + (current - lastRendered) * 0.35;
    if(valueEl) valueEl.textContent = formatUSD(lastRendered);
  }, SMOOTH_MS);
})();
// compute partnership duration for any td[data-start]
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('td[data-start]').forEach(function(td){
    const s=td.getAttribute('data-start');
    const start=new Date(s+'T00:00:00');
    if(isNaN(start)) return;
    const now=new Date();
    let years=now.getFullYear()-start.getFullYear();
    let months=now.getMonth()-start.getMonth();
    if(now.getDate()<start.getDate()) months--;
    if(months<0){years--;months+=12}
    td.textContent = (years>0? years+'y ':'') + (months>0? months+'m':'') || '<1m';
  });
});


// helper: init counters by id and base value
function initGMVCounter(id, base){
  const elem=document.getElementById(id); if(!elem) return;
  const startBase = new Date(); const gmStart = base;
  const incDay = {dayTicks:68,nightTicks:28,dayInc:4352,nightInc:2343};
  const TICK_MS = 15*60*1000;
  function calculate(){
    const now=new Date(); let total=gmStart;
    const minutesSince = Math.floor((now - startBase)/60000);
    const ticks = Math.floor(minutesSince/15);
    for(let i=0;i<=ticks;i++){
      const tickTime = new Date(startBase.getTime() + i*15*60000);
      const h = tickTime.getHours();
      if(h>=6 && h<23) total += incDay.dayInc; else total += incDay.nightInc;
    }
    return total;
  }
  function formatUSD(n){return '$'+n.toLocaleString('en-US',{maximumFractionDigits:0})}
  let prev=calculate(); elem.textContent=formatUSD(prev);
  function tick(){const target=calculate(); const start=prev,end=target; prev=end; const duration=800,st=Date.now(); (function raf(){const t=(Date.now()-st)/duration; const v=Math.round(start+(end-start)*Math.min(1,t)); elem.textContent=formatUSD(v); if(t<1) requestAnimationFrame(raf);})();}
  function scheduleNext(){const now=new Date(); const next=Math.ceil(now.getTime()/TICK_MS)*TICK_MS+50; setTimeout(function(){tick(); scheduleNext();}, next-now.getTime());}
  scheduleNext();
}

// initialize MCN counter with monthly non-linear growth model and 2-minute tick
(function(){
  const startBase = new Date();
  const gmStart = 318630000; // cumulative baseline
  const monthlyInc = 7000000; // approx monthly added GMV
  const monthlyRate = 1.03; // +3% month-over-month growth
  const TICK_MS = 2*60*1000; // update frequency: every 2 minutes
  const valueEl = document.getElementById('gmv-mcn');
  function formatUSD(n){return '$'+Math.round(n).toLocaleString('en-US',{maximumFractionDigits:0})}

  // compute months difference and fractional month since startBase
  function monthDiffAndFraction(now){
    const startYear = startBase.getFullYear(), startMonth = startBase.getMonth();
    const nowYear = now.getFullYear(), nowMonth = now.getMonth();
    const monthsElapsed = (nowYear - startYear)*12 + (nowMonth - startMonth);
    // compute start of current month and length of this month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth()+1, 1);
    const fraction = (now - monthStart) / (nextMonthStart - monthStart);
    return {monthsElapsed: Math.max(0, monthsElapsed), fraction: Math.max(0, Math.min(1, fraction))};
  }

  function calculateNonLinearTotal(){
    const now = new Date();
    const mf = monthDiffAndFraction(now);
    const m = mf.monthsElapsed;
    const f = mf.fraction;
    // sum of geometric series for full months: monthlyInc * (1 - r^m) / (1 - r)
    let fullMonthsSum = 0;
    if(monthlyRate === 1) fullMonthsSum = monthlyInc * m; else fullMonthsSum = monthlyInc * (1 - Math.pow(monthlyRate, m)) / (1 - monthlyRate);
    // fractional current month contribution: monthlyInc * r^m * f
    const fractional = monthlyInc * Math.pow(monthlyRate, m) * f;
    return gmStart + fullMonthsSum + fractional;
  }

  // render loop: update every TICK_MS with smoothing to appear natural
  let lastRendered = calculateNonLinearTotal();
  if(valueEl) valueEl.textContent = formatUSD(lastRendered);
  const SMOOTH_MS = 1000; // display updates every 1s for smoother visual (target still advances on 2-min cadence)
  setInterval(function(){
    const current = calculateNonLinearTotal();
    // interpolate moderately for natural feel
    lastRendered = lastRendered + (current - lastRendered) * 0.5;
    if(valueEl) valueEl.textContent = formatUSD(lastRendered);
  }, SMOOTH_MS);
})();
