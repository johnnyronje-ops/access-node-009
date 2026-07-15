
const toc = document.getElementById('toc');
document.getElementById('tocToggle')?.addEventListener('click',()=>toc.classList.add('open'));
document.getElementById('tocClose')?.addEventListener('click',()=>toc.classList.remove('open'));
toc.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toc.classList.remove('open')));

const progress = document.getElementById('progressBar');
const chapters = [...document.querySelectorAll('.chapter')];
const links = [...document.querySelectorAll('.toc a')];

function update(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY/max)*100 : 0}%`;
  let current = chapters[0]?.id;
  chapters.forEach(ch => {
    if(ch.getBoundingClientRect().top < innerHeight * .38) current = ch.id;
  });
  links.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  if(current) localStorage.setItem('ps014-last-chapter', current);
}
addEventListener('scroll', update, {passive:true});
addEventListener('resize', update);
update();

const saved = localStorage.getItem('ps014-last-chapter');
if(saved && location.hash === ''){
  const resume = document.createElement('button');
  resume.textContent = 'RESUME LAST RECORDED CHAPTER';
  resume.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:60;background:#151611;color:#d0a33d;border:1px solid #645a40;padding:11px 14px;font:900 9px ui-monospace,monospace;letter-spacing:.1em;cursor:pointer';
  resume.onclick=()=>{document.getElementById(saved)?.scrollIntoView();resume.remove();};
  document.body.appendChild(resume);
}
