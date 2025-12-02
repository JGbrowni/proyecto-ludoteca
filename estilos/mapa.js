document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn-line-wrapper');
  const svg = document.getElementById('lines-svg');

  function drawLines() {
    svg.innerHTML = ""; // Limpiar líneas anteriores

    const svgRect = svg.getBoundingClientRect();

    for (let i = 0; i < buttons.length - 1; i++) {
      const btn1 = buttons[i].getBoundingClientRect();
      const btn2 = buttons[i + 1].getBoundingClientRect();

      // Calcula el centro de cada botón relativo al SVG
      const x1 = btn1.left + btn1.width / 2 - svgRect.left;
      const y1 = btn1.top + btn1.height / 2 - svgRect.top;
      const x2 = btn2.left + btn2.width / 2 - svgRect.left;
      const y2 = btn2.top + btn2.height / 2 - svgRect.top;

      // Crear línea SVG entre los dos puntos
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "white"); //color de la linea/
      line.setAttribute("stroke-width", "7"); //grosor de la linea//
      line.setAttribute("stroke-dasharray", "15,10"); // Línea discontinua / 13 es el largo y los centra a los circulos/ 7 es el espaciado entre ellas/

      svg.appendChild(line);
    }
  }

  drawLines();
  window.addEventListener("resize", drawLines);
});

// Sistema de carrusel y bloqueo de niveles
let currentSlide = 0;
const totalSlides = 2; // 0: islas 1-2, 1: islas 3-4
const carouselContainer = document.querySelector('.carousel-container');
const carouselTrack = document.querySelector('.carousel-track');
let slideWidth = carouselContainer ? carouselContainer.clientWidth : 0;
let completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || { level1: false, level2: false };

function updateCarousel() {
  if (!carouselTrack || !carouselContainer) return;
  // recalcular ancho por si hay cambios de tamaño
  slideWidth = carouselContainer.clientWidth;
  const offset = -currentSlide * slideWidth;
  carouselTrack.style.transform = `translateX(${offset}px)`;
}

function moveCarouselLeft() {
  if (!carouselTrack) return;
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; // wrap
  updateCarousel();
}

function moveCarouselRight() {
  if (!carouselTrack) return;
  currentSlide = (currentSlide + 1) % totalSlides; // wrap
  updateCarousel();
}

// actualizar en resize para mantener cálculo correcto
window.addEventListener('resize', () => {
  if (!carouselContainer) return;
  slideWidth = carouselContainer.clientWidth;
  updateCarousel();
});

function showLockedMessage() {
  const bothComplete = completedLevels.level1 && completedLevels.level2;
  if (!bothComplete) {
    alert('🔒 Debes completar los dos primeros niveles para desbloquear este contenido');
  }
}

function unlockIslands() {
  completedLevels.level1 = true;
  completedLevels.level2 = true;
  localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
  
  const island3 = document.getElementById('island-3');
  const island4 = document.getElementById('island-4');
  
  if (island3) island3.classList.remove('disabled');
  if (island4) island4.classList.remove('disabled');
}

window.addEventListener('DOMContentLoaded', () => {
  if (completedLevels.level1 && completedLevels.level2) {
    const island3 = document.getElementById('island-3');
    const island4 = document.getElementById('island-4');
    
    if (island3) island3.classList.remove('disabled');
    if (island4) island4.classList.remove('disabled');
  }
});
    

    function redirectToPage() {
      // Redirect to another page (e.g., an about page)
      window.location.href = 'secciones/islas.html'; // Or replace with actual URL
    }


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
    window.location.href = '../index.html';
  }

  function redirectToPage() {
      window.location.href = '../secciones/niveles.html';
    }

    function redirectToNiveles2() {
      window.location.href = '../secciones/niveles2.html';
    }