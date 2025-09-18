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
      icon.src = 'img/simusica.png';
    } else {
      audio.pause();
      icon.src = 'img/Nomusica.png';
    }
  }