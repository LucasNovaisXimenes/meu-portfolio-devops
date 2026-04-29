document.addEventListener('DOMContentLoaded', () => {

  // ── Footer timestamp ──────────────────────────────────────────
  const lastUpdate = document.getElementById('last-update');
  if (lastUpdate) {
    lastUpdate.textContent = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  // ── Mobile nav toggle ─────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ── Active nav on scroll ──────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-links a');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 80;
    sections.forEach(section => {
      const id   = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;
      const inView = scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight;
      link.classList.toggle('active', inView);
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ── Typing effect ─────────────────────────────────────────────
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Analista de Infraestrutura',
    'DevOps Engineer',
    'Cloud Specialist',
    'Kubernetes Administrator',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false, lastTime = 0;

  const tick = (timestamp = 0) => {
    const delay = deleting ? 45 : 85;
    if (timestamp - lastTime >= delay) {
      lastTime = timestamp;
      const current = phrases[phraseIdx];

      if (deleting) {
        typedEl.textContent = current.slice(0, --charIdx);
      } else {
        typedEl.textContent = current.slice(0, ++charIdx);
      }

      if (!deleting && charIdx === current.length) {
        setTimeout(() => { deleting = true; requestAnimationFrame(tick); }, 2200);
        return;
      }

      if (deleting && charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    requestAnimationFrame(tick);
  };

  if (typedEl) requestAnimationFrame(tick);

  // ── Counter animation ─────────────────────────────────────────
  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-target'));
    const duration = 1400;
    const start    = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  // ── Intersection Observer (fade-in + counters) ────────────────
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // Add fade-in class to animatable cards
  const animatables = document.querySelectorAll(
    '.highlight-card, .timeline-item, .skill-category, .cert-card, .project-card, .contact-card'
  );

  animatables.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
    fadeObserver.observe(el);
  });

});
