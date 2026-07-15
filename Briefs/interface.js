
document.querySelectorAll('.folder:not(.locked)').forEach(folder => {
  folder.addEventListener('pointermove', e => {
    const r = folder.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 2;
    const y = ((e.clientY - r.top) / r.height - .5) * 2;
    folder.style.transform = `translateY(-8px) rotateX(${-y * 1.4}deg) rotateY(${x * 1.4}deg)`;
  });
  folder.addEventListener('pointerleave', () => folder.style.transform = '');
});
