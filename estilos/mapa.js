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

const musicButton = document.getElementById('musicButton');
    const musicIcon = document.getElementById('musicIcon');
    const backgroundMusic = document.getElementById('backgroundMusic');
    let isPlaying = false;

    function redirectToPage() {
      // Redirect to another page (e.g., an about page)
      window.location.href = 'secciones/islas.html'; // Or replace with actual URL
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