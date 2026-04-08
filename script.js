/**
 * Mole-Bio — Minimalist Scientific Journal
 * script.js — Micro-interactions & Animations
 * ─────────────────────────────────────────────
 * Sections:
 *  1. Responsive navbar show/hide
 *  2. Navbar scroll glassmorphism
 *  3. Mobile menu toggle
 *  4. Scroll reveal (IntersectionObserver)
 *  5. DNA parallax / mouse-track
 *  6. Floating particle system (Hero)
 *  7. Blog filter tabs
 *  8. Smooth scroll for anchor links
 *  9. Contact form feedback
 * 10. Responsive grid helpers (CSS-class media)
 */

/* ─── 1. Responsive nav show/hide ─── */
(function applyResponsiveNav() {
  const links  = document.getElementById('nav-links');
  const cta    = document.getElementById('nav-cta');
  const menuBtn = document.getElementById('menu-btn');

  function toggle() {
    const wide = window.innerWidth >= 768;
    if (links)   links.style.display   = wide ? 'flex' : 'none';
    if (cta)     cta.style.display     = wide ? 'inline-flex' : 'none';
    if (menuBtn) menuBtn.style.display = wide ? 'none' : 'flex';
    // Blog / gallery header btns
    const blogBtn = document.getElementById('blog-all-btn');
    const galBtn  = document.getElementById('gal-btn');
    if (blogBtn) blogBtn.style.display = wide ? 'inline-flex' : 'none';
    if (galBtn)  galBtn.style.display  = wide ? 'inline-flex' : 'none';
  }

  toggle();
  window.addEventListener('resize', toggle);

  // About / contact / footer grid
  function gridToggle() {
    const wide = window.innerWidth >= 768;
    const aboutGrid = document.querySelector('.about-grid');
    if (aboutGrid) aboutGrid.style.gridTemplateColumns = wide ? '1fr 1fr' : '1fr';
    const contactGrid = document.querySelector('.contact-grid');
    if (contactGrid) contactGrid.style.gridTemplateColumns = wide ? '1fr 1fr' : '1fr';
    const footerGrid = document.querySelector('.footer-grid');
    if (footerGrid) footerGrid.style.gridTemplateColumns = wide ? '2fr 1fr 1fr' : '1fr';
  }
  gridToggle();
  window.addEventListener('resize', gridToggle);
})();


/* ─── 2. Navbar scroll effect ─── */
(function initNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  function update() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();


/* ─── 3. Mobile menu ─── */
window.closeMobileMenu = function () {
  const m = document.getElementById('mobile-menu');
  if (m) m.style.display = 'none';
};

(function initMobileMenu() {
  const btn  = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  });
})();


/* ─── 4. Scroll reveal ─── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => obs.observe(el));
})();


/* ─── 5. DNA mouse parallax ─── */
(function initDNAParallax() {
  const dna = document.getElementById('dna-canvas');
  if (!dna) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    // Gentle: ±14px
    targetX = ((e.clientX - cx) / cx) * 14;
    targetY = ((e.clientY - cy) / cy) * 10;
  });

  function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    dna.style.transform = `translateY(-50%) translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ─── 6. Floating particle system (Hero) ─── */
(function initParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Create a lightweight canvas overlay
  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:absolute', 'inset:0', 'width:100%', 'height:100%',
    'pointer-events:none', 'z-index:2', 'opacity:0.55'
  ].join(';');
  hero.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle: tiny circle with a connection-web feel
  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.r = Math.random() * 2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.3 + 0.1);
      this.life = 0;
      this.maxLife = Math.random() * 280 + 180;
      this.color = Math.random() > 0.4 ? '6,95,70' : '4,120,87';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -20) this.reset();
    }
    alpha() {
      const fade = Math.min(this.life / 40, 1) * Math.min((this.maxLife - this.life) / 40, 1);
      return Math.max(0, fade * 0.5);
    }
    draw() {
      const a = this.alpha();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${a})`;
      ctx.fill();
    }
  }

  const COUNT = 45;
  const particles = Array.from({ length: COUNT }, () => new Particle());

  // Draw connection lines between close particles
  function drawLines() {
    const MAX_DIST = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * Math.min(a.alpha(), b.alpha()) * 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(6,95,70,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ─── 7. Blog filter ─── */
window.filterBlog = function (btn, filter) {
  // Update button styles
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.style.background = '#fff';
    b.style.color = '#475569';
    b.style.borderColor = '#E2E8F0';
  });
  btn.style.background   = '#1E293B';
  btn.style.color        = '#fff';
  btn.style.borderColor  = '#1E293B';

  const articles = document.querySelectorAll('#blog-bento article');
  articles.forEach((card, i) => {
    const cats = (card.dataset.cat || '').split(' ');
    const show = filter === 'all' || cats.includes(filter);

    card.style.transition = `opacity 0.3s ${i * 0.04}s, transform 0.3s ${i * 0.04}s`;
    if (show) {
      card.style.opacity = '1';
      card.style.transform = 'scale(1) translateY(0)';
      card.style.pointerEvents = 'auto';
    } else {
      card.style.opacity = '0.2';
      card.style.transform = 'scale(0.97) translateY(4px)';
      card.style.pointerEvents = 'none';
    }
  });
};


/* ─── 8. Smooth anchor scroll ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── 9. Contact form ─── */
window.handleForm = function (e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const ok  = document.getElementById('form-ok');
  if (!btn) return;

  btn.disabled = true;
  btn.textContent = 'Sending…';
  btn.style.opacity = '0.7';

  // Simulate async send
  setTimeout(() => {
    btn.style.display = 'none';
    if (ok) ok.style.display = 'block';
    e.target.reset();
  }, 1200);
};


/* ─── 10. Active nav highlight on scroll ─── */
(function initActiveNav() {
  const sections = ['hero', 'about', 'blog', 'tracker', 'gallery', 'contact'];
  const links    = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          const match = link.getAttribute('href') === `#${id}`;
          link.style.color = match ? '#065F46' : '';
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();
