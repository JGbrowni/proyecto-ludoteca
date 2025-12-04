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
const carouselContainer = document.querySelector('.carousel-container');
const carouselTrack = document.querySelector('.carousel-track');
const totalItems = carouselTrack ? carouselTrack.children.length : 0;
let itemsPerView = window.innerWidth <= 768 ? 1 : 2;
let totalPages = Math.max(1, Math.ceil(totalItems / itemsPerView));
let slideWidth = carouselContainer ? carouselContainer.clientWidth : 0;
let completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || { level1: false, level2: false };

function updateCarousel() {
  if (!carouselTrack || !carouselContainer) return;
  // recalcular ancho por si hay cambios de tamaño
  slideWidth = carouselContainer.clientWidth;
  // itemsPerView puede cambiar según ancho
  itemsPerView = window.innerWidth <= 768 ? 1 : 2;
  // Si estamos en modo mobile (apilado), desactivar transform y permitir scroll vertical
  const mobileStack = window.innerWidth <= 768;
  if (mobileStack) {
    carouselTrack.style.transform = 'none';
    carouselTrack.style.transition = 'none';
    return;
  }
  totalPages = Math.max(1, Math.ceil(totalItems / itemsPerView));
  // asegurar currentSlide válido
  if (currentSlide > totalPages - 1) currentSlide = totalPages - 1;
  // calcular gap en px (valor CSS puede ser '30px' o '2rem')
  const gapValue = window.getComputedStyle(carouselTrack).gap || '0px';
  const gapPx = parseFloat(gapValue) || 0;
  // desplazamiento: start of page k is at k * (containerWidth + itemsPerView * gap)
  const offset = -currentSlide * (slideWidth + itemsPerView * gapPx);
  carouselTrack.style.transition = 'transform 0.5s ease-in-out';
  carouselTrack.style.transform = `translateX(${offset}px)`;
}

function moveCarouselLeft() {
  if (!carouselTrack) return;
  if (window.innerWidth <= 768) return; // en móvil no usar flechas
  currentSlide = (currentSlide - 1 + totalPages) % totalPages; // wrap
  updateCarousel();
}

function moveCarouselRight() {
  if (!carouselTrack) return;
  if (window.innerWidth <= 768) return; // en móvil no usar flechas
  currentSlide = (currentSlide + 1) % totalPages; // wrap
  updateCarousel();
}

// actualizar en resize para mantener cálculo correcto
window.addEventListener('resize', () => {
  if (!carouselContainer) return;
  slideWidth = carouselContainer.clientWidth;
  // recalcular itemsPerView y páginas
  itemsPerView = window.innerWidth <= 768 ? 1 : 2;
  totalPages = Math.max(1, Math.ceil(totalItems / itemsPerView));
  if (currentSlide > totalPages - 1) currentSlide = totalPages - 1;
  updateCarousel();
});

// Inicializar posición al cargar
window.addEventListener('DOMContentLoaded', () => {
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
    const mobileIcon = document.getElementById('mobileMusicIcon');
    if (audio.paused) {
      audio.play();
      if (icon) icon.src = '../img/simusica.png';
      if (mobileIcon) mobileIcon.src = '../img/simusica.png';
    } else {
      audio.pause();
      if (icon) icon.src = '../img/Nomusica.png';
      if (mobileIcon) mobileIcon.src = '../img/Nomusica.png';
    }
  }

  // Menú móvil (hamburguesa)
  function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburgerBtn');
    if (!menu || !btn) return;
    const isOpen = menu.classList.toggle('open');
    menu.setAttribute('aria-hidden', !isOpen);
    // cambiar foco / aria y estado visual del botón
    if (isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.add('open');
    } else {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('open');
    }
  }

  function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburgerBtn');
    if (!menu || !btn) return;
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  // cerrar menú al hacer click fuera
  window.addEventListener('click', (e) => {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburgerBtn');
    if (!menu || !btn) return;
    if (!menu.classList.contains('open')) return;
    const target = e.target;
    if (btn.contains(target) || menu.contains(target)) return; // click dentro
    closeMobileMenu();
  });

  // cerrar menú si se redimensiona a escritorio (umbral ampliado a 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeMobileMenu();
  });

  // Exponer funciones al scope global por seguridad (llamadas desde HTML)
  window.toggleMobileMenu = toggleMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.gomap = gomap;

    function goHome() {
    window.location.href = '../index.html';
  }

  function gomap() {
    // ir a la página de islas (mapa)
    window.location.href = '../secciones/islas.html';
  }

  function redirectToPage() {
      window.location.href = '../secciones/niveles.html';
    }

    function redirectToNiveles2() {
      window.location.href = '../secciones/niveles2.html';
    }