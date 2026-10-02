/* ==========================================================================
   KUMARESH & DANAMMA — INVITATION INTERACTION & FLORAL ANIMATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     AUTOMATIC AUDIO PLAYBACK ENGINE & CONTROL HANDLER
     -------------------------------------------------------------------------- */
  const weddingAudio = document.getElementById('weddingAudio');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  let audioStarted = false;

  function updateAudioUI(isPlaying) {
    if (!audioToggleBtn) return;
    const playingIcon = audioToggleBtn.querySelector('.audio-icon.playing');
    const mutedIcon = audioToggleBtn.querySelector('.audio-icon.muted');
    if (isPlaying) {
      audioToggleBtn.classList.remove('paused');
      if (playingIcon) playingIcon.classList.remove('hidden');
      if (mutedIcon) mutedIcon.classList.add('hidden');
    } else {
      audioToggleBtn.classList.add('paused');
      if (playingIcon) playingIcon.classList.add('hidden');
      if (mutedIcon) mutedIcon.classList.remove('hidden');
    }
  }

  function playAudio() {
    if (!weddingAudio || audioStarted) return;

    weddingAudio.muted = false;
    weddingAudio.volume = 1.0;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      try {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      } catch (err) {}
    }

    const playPromise = weddingAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        audioStarted = true;
        updateAudioUI(true);
      }).catch(() => {
        updateAudioUI(false);
      });
    }
  }

  function toggleAudio() {
    if (!weddingAudio) return;
    if (weddingAudio.paused) {
      weddingAudio.muted = false;
      weddingAudio.play().then(() => {
        audioStarted = true;
        updateAudioUI(true);
      });
    } else {
      weddingAudio.pause();
      updateAudioUI(false);
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  // Attempt instant autoplay on website open and all user interaction vectors
  playAudio();
  window.addEventListener('load', playAudio);
  ['click', 'touchstart', 'touchend', 'pointerdown', 'mousemove', 'scroll', 'keydown'].forEach((evtName) => {
    window.addEventListener(evtName, playAudio, { passive: true });
    document.addEventListener(evtName, playAudio, { passive: true });
  });

  /* --------------------------------------------------------------------------
     0. INITIAL 1-SECOND GLANCE SPLASH AUTO-SLIDE
     -------------------------------------------------------------------------- */
  const glanceOverlay = document.getElementById('glanceOverlay');
  if (glanceOverlay) {
    const dismissGlance = () => {
      if (!glanceOverlay.classList.contains('dismissed')) {
        glanceOverlay.classList.add('dismissed');
      }
    };

    // Auto dismiss and slide away after 1 second
    const glanceTimer = setTimeout(dismissGlance, 1000);

    // Instant dismiss on click/tap
    glanceOverlay.addEventListener('click', () => {
      clearTimeout(glanceTimer);
      dismissGlance();
      playAudio();
    });
  }

  /* --------------------------------------------------------------------------
     1. OPEN INVITATION OVERLAY INTERACTION
     -------------------------------------------------------------------------- */
  const openInviteBtn = document.getElementById('openInviteBtn');
  const openingOverlay = document.getElementById('openingOverlay');

  if (openInviteBtn && openingOverlay) {
    openInviteBtn.addEventListener('click', () => {
      openingOverlay.classList.add('opened');
      document.body.style.overflow = '';
      playAudio();
      
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  /* --------------------------------------------------------------------------
     2. COUNTDOWN TIMER (Target: December 18, 2026 09:44:00 AM)
     -------------------------------------------------------------------------- */
  const targetDate = new Date('December 18, 2026 09:44:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* --------------------------------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
    revealObserver.observe(el);
  });

  const style = document.createElement('style');
  style.innerHTML = `.scroll-reveal.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);


  /* --------------------------------------------------------------------------
     4. LOW-DENSITY DELICATE SHOWERING FLOWERS (CANVAS)
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('petalCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const flowers = [];
    // Low density: only 6 delicate flowers showering at a time
    const flowerCount = 6;
    const colors = [
      'rgba(255, 255, 255, 0.85)',   // Ivory White
      'rgba(255, 248, 230, 0.85)',   // Jasmine Off-White
      'rgba(255, 235, 238, 0.8)'     // Soft Pastel Blossom
    ];

    for (let i = 0; i < flowerCount; i++) {
      flowers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 5, // small size (5px to 8px)
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.015,
        speedY: Math.random() * 0.35 + 0.25, // slow gentle fall
        speedX: Math.sin(Math.random() * Math.PI) * 0.2,
        color: colors[i % colors.length]
      });
    }

    function drawLittleFlower(f) {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);

      const petalCount = 5;
      const r = f.radius;

      // Draw 5 petals
      ctx.fillStyle = f.color;
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 0.6;

      for (let i = 0; i < petalCount; i++) {
        ctx.save();
        ctx.rotate((i * 2 * Math.PI) / petalCount);
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.6, r * 0.4, r * 0.7, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Golden flower center
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.28, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
      ctx.fill();

      ctx.restore();
    }

    function animateFlowers() {
      ctx.clearRect(0, 0, width, height);

      flowers.forEach((f) => {
        f.y += f.speedY;
        f.x += Math.sin(f.y * 0.008) * 0.25;
        f.angle += f.angularSpeed;

        if (f.y > height + 20) {
          f.y = -20;
          f.x = Math.random() * width;
        }

        drawLittleFlower(f);
      });

      requestAnimationFrame(animateFlowers);
    }

    animateFlowers();
  }

  /* --------------------------------------------------------------------------
     5. LEAVE YOUR BLESSINGS & SEND PRIVATE WISHES HANDLER
     -------------------------------------------------------------------------- */
  const wishesForm = document.getElementById('wishesForm');
  const wishSuccessState = document.getElementById('wishSuccessState');
  const wishSuccessText = document.getElementById('wishSuccessText');
  const whatsappWishBtn = document.getElementById('whatsappWishBtn');
  const sendAnotherWishBtn = document.getElementById('sendAnotherWishBtn');

  if (wishesForm) {
    wishesForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestNameInput = document.getElementById('guestName');
      const guestMessageInput = document.getElementById('guestMessage');

      const name = guestNameInput ? guestNameInput.value.trim() : '';
      const message = guestMessageInput ? guestMessageInput.value.trim() : '';

      if (!name || !message) return;

      // Save wish locally
      try {
        const savedWishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
        savedWishes.push({ name, message, timestamp: new Date().toISOString() });
        localStorage.setItem('weddingWishes', JSON.stringify(savedWishes));
      } catch (err) {}

      // Prepare native mailto URL to kumargoudar24@gmail.com
      const mailSubject = `Wedding Wish for Kumaresh & Danamma from ${name}`;
      const mailBody = `Dear Kumaresh & Danamma,\n\n${message}\n\nWarm regards,\n${name}`;
      const mailtoUrl = `mailto:kumargoudar24@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

      // Prepare WhatsApp share link to +91 8050360048
      const encodedMsg = encodeURIComponent(
        `Warm Wishes for Kumaresh & Danamma 💍✨\n\nFrom: ${name}\nWish: ${message}`
      );
      if (whatsappWishBtn) {
        whatsappWishBtn.href = `https://api.whatsapp.com/send?phone=918050360048&text=${encodedMsg}`;
      }

      // Launch native email client directly
      window.location.href = mailtoUrl;

      if (wishSuccessText) {
        wishSuccessText.textContent = `Thank you ${name}! Your email client has been launched with your wish for Kumaresh & Danamma.`;
      }

      wishesForm.style.display = 'none';
      if (wishSuccessState) {
        wishSuccessState.style.display = 'block';
      }
    });
  }

  if (sendAnotherWishBtn) {
    sendAnotherWishBtn.addEventListener('click', () => {
      if (wishesForm) {
        wishesForm.reset();
        wishesForm.style.display = 'flex';
      }
      if (wishSuccessState) {
        wishSuccessState.style.display = 'none';
      }
    });
  }

});
