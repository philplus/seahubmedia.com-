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
