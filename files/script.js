/* ═══════════════════════════════════════════════════
   Mole-Bio — Deep Biotech Midnight
   script.js
   ═══════════════════════════════════════════════════ */

/* ─── 1. MOLECULAR PARTICLE SYSTEM ─── */
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Resize canvas to fill hero
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Molecule node class
    class Molecule {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
            this.radius = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = -(Math.random() * 0.4 + 0.15);
            this.opacity = 0;
            this.maxOpacity = Math.random() * 0.5 + 0.15;
            this.fadeSpeed = Math.random() * 0.003 + 0.002;
            this.fading = 'in';
            // Bond partner index (set externally)
            this.bonded = false;
            // Colour: neon green or cyan
            this.color = Math.random() > 0.5 ? '74,222,128' : '34,211,238';
            // Pulse phase
            this.phase = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.phase += this.pulseSpeed;

            if (this.fading === 'in') {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= this.maxOpacity) {
                    this.opacity = this.maxOpacity;
                    this.fading = 'hold';
                    this.holdTimer = Math.random() * 200 + 100;
                }
            } else if (this.fading === 'hold') {
                this.holdTimer--;
                if (this.holdTimer <= 0) this.fading = 'out';
            } else {
                this.opacity -= this.fadeSpeed * 0.5;
                if (this.opacity <= 0) this.reset();
            }

            // Soft drift — gentle sinusoidal wobble
            this.x += Math.sin(this.phase) * 0.2;
        }

        draw() {
            const pulse = 0.8 + 0.2 * Math.sin(this.phase);
            const r = this.radius * pulse;

            // Outer glow
            const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 6);
            grd.addColorStop(0, `rgba(${this.color},${this.opacity * 0.8})`);
            grd.addColorStop(1, `rgba(${this.color},0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, r * 6, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            // Core dot
            ctx.beginPath();
            ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
            ctx.fill();
        }
    }

    // Draw bonds (lines between close molecules)
    function drawBonds(molecules) {
        const maxDist = 120;
        for (let i = 0; i < molecules.length; i++) {
            for (let j = i + 1; j < molecules.length; j++) {
                const a = molecules[i], b = molecules[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * Math.min(a.opacity, b.opacity) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    // Alternate bond colour
                    ctx.strokeStyle = `rgba(74,222,128,${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    const COUNT = 55;
    const molecules = Array.from({ length: COUNT }, () => new Molecule());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBonds(molecules);
        molecules.forEach(m => { m.update(); m.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
})();


/* ─── 2. NAVBAR SCROLL BEHAVIOR ─── */
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
})();


/* ─── 3. SCROLL REVEAL ─── */
(function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
})();


/* ─── 4. BLOG FILTER ─── */
(function initBlogFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const featuredCard = document.querySelector('.featured-card');
    const blogCards = document.querySelectorAll('#blog-grid article');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter featured card
            if (featuredCard) {
                const catMatch = filter === 'all' || featuredCard.dataset.category === filter;
                featuredCard.style.transition = 'opacity 0.3s, transform 0.3s';
                if (catMatch) {
                    featuredCard.style.opacity = '1';
                    featuredCard.style.transform = 'translateY(0)';
                    featuredCard.style.display = '';
                } else {
                    featuredCard.style.opacity = '0';
                    featuredCard.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        if (btn.dataset.filter !== 'all' && featuredCard.dataset.category !== btn.dataset.filter) {
                            featuredCard.style.display = 'none';
                        }
                    }, 300);
                }
            }

            // Filter grid cards
            blogCards.forEach((card, i) => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.transition = `opacity 0.3s ${i * 0.05}s, transform 0.3s ${i * 0.05}s`;
                if (match) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.display = '';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px)';
                    setTimeout(() => {
                        if (card.dataset.category !== filter && filter !== 'all') {
                            card.style.display = 'none';
                        }
                    }, 300 + i * 50);
                }
            });
        });
    });
})();


/* ─── 5. SMOOTH ANCHOR LINKS ─── */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();


/* ─── 6. TYPEWRITER EFFECT (optional hero sub-label) ─── */
(function initTypewriter() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;
    // The CSS handles blinking; nothing extra needed unless you want typed text.
})();
