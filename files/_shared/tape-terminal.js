(() => {
  "use strict";

  const root = document.documentElement;
  const segments = [...document.querySelectorAll('.tape-segment')];
  const indexLinks = [...document.querySelectorAll('.tape-index a')];
  const monitor = document.querySelector('.monitor');
  const screenTime = document.getElementById('screenTime');
  const screenLabel = document.getElementById('screenLabel');
  const progress = document.getElementById('tapeProgressBar');
  const tapeId = document.body.dataset.tapeId || 'unknown-tape';
  const storageKey = `an009_tape_resume_${tapeId}`;
  let activeId = null;
  let glitchTimer = 0;

  function setMonitor(segment) {
    if (!segment) return;
    const tc = segment.dataset.timecode || '00:00:00';
    const label = segment.dataset.label || 'RECOVERED SEGMENT';
    if (screenTime) screenTime.textContent = tc;
    if (screenLabel) screenLabel.textContent = label;
    if (segment.classList.contains('signal') && monitor) {
      monitor.classList.remove('tracking');
      void monitor.offsetWidth;
      monitor.classList.add('tracking');
      clearTimeout(glitchTimer);
      glitchTimer = setTimeout(() => monitor.classList.remove('tracking'), 700);
    }
  }

  function updateIndex(id) {
    indexLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  function update() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, (scrollY / max) * 100))}%`;

    let current = segments[0] || null;
    for (const segment of segments) {
      const rect = segment.getBoundingClientRect();
      if (rect.top <= innerHeight * .46) current = segment;
    }
    if (!current) return;

    if (activeId !== current.id) {
      activeId = current.id;
      segments.forEach(s => s.classList.toggle('active', s === current));
      setMonitor(current);
      updateIndex(current.id);
      sessionStorage.setItem(storageKey, current.id);
    }
  }

  addEventListener('scroll', update, {passive:true});
  addEventListener('resize', update);

  const saved = sessionStorage.getItem(storageKey);
  if (saved && !location.hash && document.getElementById(saved)) {
    const resume = document.createElement('button');
    resume.className = 'resume-tape';
    resume.type = 'button';
    resume.textContent = 'RESUME RECOVERED POSITION';
    resume.addEventListener('click', () => {
      document.getElementById(saved)?.scrollIntoView({behavior:'smooth', block:'start'});
      resume.remove();
    });
    document.body.appendChild(resume);
  }

  indexLinks.forEach(link => link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      setTimeout(() => setMonitor(target), 80);
    }
  }));

  root.classList.add('tape-terminal-ready');
  update();
})();