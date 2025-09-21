// Utilidades
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>[...document.querySelectorAll(s)];
const playOk = ()=> $('#sOk').play();
const playBad = ()=> $('#sBad').play();
function pop(el){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}
function shake(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}

// Estado
let currentLevel = 1;
let currentWords = [];
let currentParts = [];

// -------- Volumen con persistencia --------
const MUSIC_KEY = 'levels:volume';
const defaultVol = parseFloat(localStorage.getItem(MUSIC_KEY) || '0.2');
window.addEventListener('DOMContentLoaded', ()=>{
  const m = $('#bgm'); if(m) m.volume = defaultVol;
  const s = $('#vol'); if(s) s.value = defaultVol;
});
$('#vol')?.addEventListener('input', e=>{
  const v = parseFloat(e.target.value);
  $('#bgm').volume = v;
  localStorage.setItem(MUSIC_KEY, v.toString());
});

// Narración
function narrationState(){const ss=window.speechSynthesis;return ss.paused?'paused':(ss.speaking?'speaking':'idle');}
function speak(text){ if(!('speechSynthesis'in window)) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='es-ES'; u.onend=()=>{$('#readStory').textContent='🗣️ Leer';}; speechSynthesis.speak(u); }
function buildNarration(){
  return currentParts.map(p=>{
    if(typeof p === 'string') return p;
    const i=p.idx; const b=document.querySelector(`.blank[data-idx="${i}"]`);
    const t=(b && b.textContent && b.textContent!=='_____')? b.textContent : currentWords[i].correct;
    return t;
  }).join('').trim();
}
function toggleNarration(){
  const state=narrationState();
  if(state==='idle'){ 
    setCharacter('read');
    speak(buildNarration()); 
    $('#readStory').textContent='⏸️ Pausar'; 
  }
  else if(state==='speaking'){ 
    speechSynthesis.pause(); 
    $('#readStory').textContent='▶️ Reanudar'; 
  }
  else{ 
    speechSynthesis.resume(); 
    $('#readStory').textContent='⏸️ Pausar'; 
  }
}

// Música / reset
$('#toggleMusic').addEventListener('click',()=>{
  const m=$('#bgm');
  if(m.paused){ m.play(); $('#toggleMusic').textContent='🔈 Pausar música'; }
  else{ m.pause(); $('#toggleMusic').textContent='🔊 Música'; }
});
$('#readStory').addEventListener('click', toggleNarration);
$('#resetAll').addEventListener('click',()=>{
  speechSynthesis.cancel(); $('#readStory').textContent='🗣️ Leer';
  renderLevel(currentLevel); $('#feedback').textContent=''; hideCongrats();
});

// Opciones por hueco
function renderOptions(idx){
  const panel=$('#optionPanel'); panel.innerHTML='';
  const data=currentWords[idx];
  const title=document.createElement('strong'); title.textContent='Elige la palabra:'; panel.appendChild(title);
  data.options.slice().sort(()=>Math.random()-0.5).forEach(txt=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=txt;
    b.addEventListener('click',()=>{
      const blank=document.querySelector(`.blank[data-idx="${idx}"]`);
      blank.textContent=txt;
      if(txt.toLowerCase()===data.correct.toLowerCase()){
        blank.classList.remove('pending','error'); blank.classList.add('filled'); blank.setAttribute('aria-expanded','false');
        playOk(); pop(blank); panel.hidden=true;
        const next=document.querySelector(`.blank[data-idx="${idx+1}"]`); if(next){ next.focus(); next.click(); }
      }else{ blank.classList.add('error'); playBad(); shake(b); }
    });
    panel.appendChild(b);
  });
  panel.hidden=false;
}

// Render del nivel
function renderLevel(idx){
  const lvl=window.levels[idx];
  currentWords=lvl.words;
  currentParts=lvl.parts;
  $('#titulo').textContent=lvl.title;
  if(lvl.image) $('#sceneImg').src=lvl.image;

  const p=document.createElement('p'); p.className='story'; p.id='storyText';
  p.innerHTML=currentParts.map(part=>{
    if(typeof part==='string'){return part.replace(/</g,'&lt;').replace(/>/g,'&gt;');}
    const i=part.idx; return `<button class="blank" data-idx="${i}" aria-haspopup="true" aria-expanded="false" aria-controls="optionPanel">_____</button>`;
  }).join('');
  const container=$('#storyText').parentNode; container.replaceChild(p, $('#storyText'));

  $('#optionPanel').hidden=true; $('#optionPanel').innerHTML='';
  $$('.blank').forEach(b=>{ b.className='blank pending'; b.setAttribute('aria-expanded','false'); b.onclick=()=>{ b.classList.remove('error'); b.setAttribute('aria-expanded','true'); renderOptions(Number(b.dataset.idx)); }; });
  hideCongrats(); $('#feedback').textContent='';
}

// Comprobar
// Cambiar personaje según resultado al comprobar
$('#checkAll').addEventListener('click',()=>{
  let allOk=true;
  currentWords.forEach((w,i)=>{
    const b=document.querySelector(`.blank[data-idx="${i}"]`);
    const ok=b && b.textContent.trim().toLowerCase()===w.correct.toLowerCase();
    if(!ok){ b.classList.add('error'); allOk=false; }
  });
  const fb=$('#feedback');
  if(allOk){
    playOk(); fb.textContent='¡Felicidades!';
    setCharacter('happy');
    speak('¡Lo hiciste muy bien! Sigamos con el siguiente nivel.');
    showCongrats(); updateCongratsButton();
  }
  else{
    playBad(); fb.textContent='Prueba de nuevo';
    setCharacter('sad');
    speak('Prueba de nuevo');
  }
});

$('#clearStory').addEventListener('click',()=>{ renderLevel(currentLevel); $('#feedback').textContent=''; });

// Felicitaciones
function showCongrats(){ $('#congrats').classList.remove('hidden'); }
function hideCongrats(){ $('#congrats').classList.add('hidden'); }
function updateCongratsButton(){ const btn=$('#nextLevel'); btn.textContent = (currentLevel >= window.levels.length-1) ? 'Finalizar' : 'Siguiente nivel'; }
$('#nextLevel').addEventListener('click',()=>{
  if(currentLevel < window.levels.length-1) currentLevel += 1;
  else currentLevel = 0;
  hideCongrats(); renderLevel(currentLevel);
});

// Init
renderLevel(currentLevel);




function setCharacter(state) {
  const img = $('#characterImg');
  if (!img) return;
  if (state === 'read') img.src = 'assets/leyendo.png';
  else if (state === 'happy') img.src = 'assets/aprobado.png';
  else if (state === 'sad') img.src = 'assets/repite.png';
}

function toggleMusic() {
      if (isPlaying) {
        backgroundMusic.pause();
        musicIcon.textContent = '▶️'; // Replace emoji with text if needed, but per guidelines, avoid
        // Actually, to follow, don't use ▶️; use text or image. Let's change to | |
        musicIcon.textContent = '||'; // Pause symbol
      } else {
        backgroundMusic.play();
        musicIcon.textContent = '►'; // Play symbol
      }
      isPlaying = !isPlaying;
    }

    // Add hover effect description - but since it's CSS, already handled
    musicButton.addEventListener('mouseenter', () => {
      musicButton.style.transform = 'scale(1.1)';
    });
    musicButton.addEventListener('mouseleave', () => {
      musicButton.style.transform = 'scale(1)';
    });

    function toggleMusic() {
    const audio = document.getElementById('backgroundMusic');
    const icon = document.getElementById('musicIcon');
    if (audio.paused) {
      audio.play();
      icon.src = '../img/simusica.png';
    } else {
      audio.pause();
      icon.src = '../img/Nomusica.png';
    }
  }

      function goHome() {
    window.location.href = '../index.html'; // Or replace with actual URL
  }

  function redirectToPage() {
      // Redirect to another page (e.g., an about page)
      window.location.href = '../secciones/niveles.html'; // Or replace with actual URL
    }

    function gomap() {
      window.location.href = '../secciones/niveles.html'; // Or replace with actual URL
    }