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
