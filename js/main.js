/* ================================================================
   DOANHOANG PORTFOLIO V2 — main.js
   Ultra Optimized | Class-based | Shared RAF | Performance-First
   ================================================================ */
(() => {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────────────── */
  const CFG = {
    EMAILJS_SERVICE:    'YOUR_SERVICE_ID',
    EMAILJS_TEMPLATE:   'YOUR_TEMPLATE_ID',
    EMAILJS_KEY:        'YOUR_PUBLIC_KEY',
    TYPED_WORDS:        ['Software Engineer','Frontend Developer','Chemistry Nerd','Calisthenics Athlete','Creative Builder'],
    TYPED_TYPE_SPEED:   90,
    TYPED_DELETE_SPEED: 60,
    TYPED_PAUSE:        1600,
    PARTICLE_HI:        1200,
    PARTICLE_LO:        600,
    MOBILE_BP:          768,
    LERP_CURSOR:        0.12,
    LERP_CAMERA:        0.05,
  };

  /* ── UTILS ──────────────────────────────────────────────────────── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const isMobile = () => window.innerWidth <= CFG.MOBILE_BP;
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) }; };
  const on = (el, ev, fn, opts = {}) => el?.addEventListener(ev, fn, { passive: true, ...opts });

  /* ── SHARED RAF LOOP ─────────────────────────────────────────────
     All modules register tasks here — ONE rAF for the whole app.    */
  const RAF = (() => {
    const tasks = new Set();
    let id = null;
    const loop = () => {
      if (!document.hidden) tasks.forEach(fn => fn());
      id = tasks.size ? requestAnimationFrame(loop) : null;
    };
    return {
      add(fn)    { tasks.add(fn);    if (!id) id = requestAnimationFrame(loop); },
      remove(fn) { tasks.delete(fn); if (!tasks.size && id) { cancelAnimationFrame(id); id = null; } }
    };
  })();

  /* ── GLOBAL STATE ────────────────────────────────────────────────── */
  const State = {
    theme:  localStorage.getItem('theme') || 'dark',
    mouse:  { x: 0, y: 0 },
    ready:  false,
  };

  /* ================================================================
     1. LOADER
     ================================================================ */
  class Loader {
    constructor() {
      this.fill  = $('#loader-fill');
      this.pctEl = $('#loader-pct');
      this.el    = $('#loader');
      this.prog  = 0;
      this.target = 0;
      this._run();
    }
    _run() {
      const iv = setInterval(() => {
        this.target = clamp(this.target + Math.random() * 14, 0, 95);
      }, 80);
      window.addEventListener('load', () => { clearInterval(iv); this.target = 100; }, { once: true });
      requestAnimationFrame(this._tick.bind(this));
    }
    _tick() {
      this.prog = lerp(this.prog, this.target, 0.08);
      if (this.fill)  this.fill.style.width  = this.prog + '%';
      if (this.pctEl) this.pctEl.textContent = Math.floor(this.prog) + '%';
      this.prog < 99.5 ? requestAnimationFrame(this._tick.bind(this)) : this._done();
    }
    _done() {
      setTimeout(() => {
        gsap.to(this.el, {
          opacity: 0, duration: .55, ease: 'power2.inOut',
          onComplete: () => { this.el.style.display = 'none'; State.ready = true; App.boot(); }
        });
      }, 280);
    }
  }

  /* ================================================================
     2. CURSOR — 60fps via shared RAF, no layout thrash
     ================================================================ */
  class Cursor {
    constructor() {
      this.dot  = $('#cursor');
      this.ring = $('#cursor-follower');
      this.cx = this.cy = 0;
      this.fx = this.fy = 0;
      on(document, 'mousemove', e => { this.cx = e.clientX; this.cy = e.clientY; });
      on(document, 'mousedown', () => document.body.classList.add('cursor-click'));
      on(document, 'mouseup',   () => document.body.classList.remove('cursor-click'));
      RAF.add(this._frame.bind(this));
      this._bindHover();
    }
    _frame() {
      if (this.dot)  { this.dot.style.left  = this.cx + 'px'; this.dot.style.top  = this.cy + 'px'; }
      this.fx = lerp(this.fx, this.cx, CFG.LERP_CURSOR);
      this.fy = lerp(this.fy, this.cy, CFG.LERP_CURSOR);
      if (this.ring) { this.ring.style.left = this.fx + 'px'; this.ring.style.top  = this.fy + 'px'; }
    }
    _bindHover() {
      const SEL = 'a,button,.proj-card,.skill-card,.contact-card,.soc-btn,.tab,.filter-btn,.back-top,.testi-btn,.testi-dot,.magnetic,.ol-btn,.proj-btn,.nav-cta';
      on(document, 'mouseover', e => { if (e.target.closest(SEL)) document.body.classList.add('cursor-hover'); });
      on(document, 'mouseout',  e => { if (e.target.closest(SEL)) document.body.classList.remove('cursor-hover'); });
    }
  }

  /* ================================================================
     3. SCROLL PROGRESS BAR — RAF-driven
     ================================================================ */
  class ScrollProgress {
    constructor() {
      this.bar = $('#scroll-progress');
      RAF.add(this._frame.bind(this));
    }
    _frame() {
      const pct = clamp(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100, 0, 100);
      if (this.bar) this.bar.style.width = pct + '%';
    }
  }

  /* ================================================================
     4. THEME MANAGER
     ================================================================ */
  class ThemeManager {
    constructor() {
      this.btn  = $('#theme-toggle');
      this.icon = $('#theme-icon');
      this.themes = ['dark', 'light', 'anime'];
      this.current = this.themes.indexOf(State.theme) || 0;
      document.documentElement.setAttribute('data-theme', State.theme);
      this._update();
      this.btn?.addEventListener('click', () => {
        this.current = (this.current + 1) % this.themes.length;
        State.theme = this.themes[this.current];
        document.documentElement.setAttribute('data-theme', State.theme);
        localStorage.setItem('theme', State.theme);
        this._update();
      });
    }
    _update() {
      const icons = {
        dark: 'fa-solid fa-sun',
        light: 'fa-solid fa-moon',
        anime: 'fa-solid fa-sparkles'
      };
      if (this.icon) this.icon.className = icons[State.theme] || 'fa-solid fa-sun';
    }
  }

  /* ================================================================
     5. THREE.JS PARTICLE FIELD
     ================================================================ */
  class ParticleField {
    constructor() {
      this.canvas = $('#three-canvas');
      if (!this.canvas || typeof THREE === 'undefined') return;
      this._build();
      RAF.add(this._frame.bind(this));
      on(window, 'resize', debounce(this._resize.bind(this), 150));
    }
    _build() {
      const W = window.innerWidth, H = window.innerHeight;
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: !isMobile(), powerPreference: 'high-performance' });
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      this.renderer.setSize(W, H);
      this.scene  = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      this.camera.position.z = 5;
      this._makePoints();
    }
    _makePoints() {
      const N   = isMobile() ? CFG.PARTICLE_LO : CFG.PARTICLE_HI;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const pc  = new THREE.Color('#ffb7c5');
      const vc  = new THREE.Color('#c9b1ff');
      for (let i = 0; i < N; i++) {
        pos[i*3]   = (Math.random()-.5)*12;
        pos[i*3+1] = (Math.random()-.5)*12;
        pos[i*3+2] = (Math.random()-.5)*8;
        const c = pc.clone().lerp(vc, Math.random());
        col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
      this.points = new THREE.Points(geo, new THREE.PointsMaterial({ size:.035, vertexColors:true, transparent:true, opacity:.7, sizeAttenuation:true, depthWrite:false }));
      this.scene.add(this.points);
    }
    _frame() {
      const speed = isMobile() ? .0002 : .0004;
      this.points.rotation.y += speed;
      this.points.rotation.x += speed * .5;
      this.camera.position.x = lerp(this.camera.position.x, State.mouse.x * .3, CFG.LERP_CAMERA);
      this.camera.position.y = lerp(this.camera.position.y, -State.mouse.y * .3, CFG.LERP_CAMERA);
      this.renderer.render(this.scene, this.camera);
    }
    _resize() {
      const W = window.innerWidth, H = window.innerHeight;
      this.camera.aspect = W / H;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(W, H);
    }
  }

  /* ================================================================
     6. TYPED TEXT — setTimeout-based (rAF not needed for text)
     ================================================================ */
  class TypedText {
    constructor() {
      this.el  = $('#typed');
      if (!this.el) return;
      this.wi  = 0; this.ci = 0; this.del = false;
      this._tick();
    }
    _tick() {
      const word = CFG.TYPED_WORDS[this.wi];
      this.el.textContent = this.del ? word.slice(0, --this.ci) : word.slice(0, ++this.ci);
      let delay = this.del ? CFG.TYPED_DELETE_SPEED : CFG.TYPED_TYPE_SPEED;
      if (!this.del && this.ci === word.length)    { delay = CFG.TYPED_PAUSE; this.del = true; }
      else if (this.del && this.ci === 0)          { this.wi = (this.wi + 1) % CFG.TYPED_WORDS.length; this.del = false; }
      setTimeout(() => this._tick(), delay);
    }
  }

  /* ================================================================
     7. NAVBAR — scroll check in RAF (no scroll listener reflow)
     ================================================================ */
  class Navbar {
    constructor() {
      this.nav    = $('#navbar');
      this.toggle = $('#nav-toggle');
      this.menu   = $('#mobile-menu');
      this._was   = false;
      RAF.add(this._checkScroll.bind(this));
      this.toggle?.addEventListener('click', this._toggleMenu.bind(this));
      $$('.mobile-link').forEach(l => l.addEventListener('click', this._closeMenu.bind(this)));
      this._initActiveLinks();
    }
    _checkScroll() {
      const s = window.scrollY > 50;
      if (s !== this._was) { this._was = s; this.nav?.classList.toggle('scrolled', s); }
    }
    _toggleMenu() {
      const open = this.toggle.classList.toggle('open');
      this.menu?.classList.toggle('open', open);
      this.toggle?.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    }
    _closeMenu() {
      this.toggle?.classList.remove('open');
      this.menu?.classList.remove('open');
      document.body.style.overflow = '';
    }
    _initActiveLinks() {
      const links = $$('.nav-links a');
      $$('section[id]').forEach(sec => {
        new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) return;
          links.forEach(l => l.classList.remove('active'));
          $(`.nav-links a[href="#${sec.id}"]`)?.classList.add('active');
        }, { threshold: .4 }).observe(sec);
      });
    }
  }

  /* ================================================================
     8. HERO ANIMATIONS (GSAP)
     ================================================================ */
  const HeroAnim = {
    run() {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero-badge',     { opacity:0, y:14,  duration:.7 })
        .from('.title-block',    { opacity:0, x:-28, stagger:.12, duration:.9 }, '-=.3')
        .from('.hero-role',      { opacity:0, y:12,  duration:.6 }, '-=.5')
        .from('.hero-desc',      { opacity:0, y:12,  duration:.5 }, '-=.4')
        .from('.hero-btns .btn', { opacity:0, y:12,  stagger:.08, duration:.5 }, '-=.4')
        .from('.hero-socials a', { opacity:0, y:10,  stagger:.05, duration:.4 }, '-=.4')
        .from('.hero-card',      { opacity:0, x:40,  duration:1.1, ease:'expo.out' }, '-=.9')
        .from('.scroll-hint',    { opacity:0, y:8,   duration:.5 }, '-=.3');
    },
    counters() {
      $$('.stat-val[data-count]').forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true,
          onEnter: () => gsap.to({ n: 0 }, { n: +el.dataset.count, duration: 2, ease: 'power2.out',
            onUpdate() { el.textContent = Math.floor(this.targets()[0].n); }
          })
        });
      });
    },
    scroll() {
      gsap.to('.about-img-card', { yPercent:-8, ease:'none',
        scrollTrigger: { trigger:'#about', start:'top bottom', end:'bottom top', scrub:true }
      });
      $$('.sec-head').forEach(el => {
        gsap.from(el, { opacity:0, x:-30, duration:.8, ease:'power2.out',
          scrollTrigger: { trigger:el, start:'top 85%', once:true }
        });
      });
      $$('.proj-card').forEach((card, i) => {
        gsap.from(card, { opacity:0, y:40, duration:.8, ease:'power2.out', delay: i * .08,
          scrollTrigger: { trigger:card, start:'top 88%', once:true }
        });
      });
    }
  };

  /* ================================================================
     9. REVEAL SYSTEM — IntersectionObserver
     ================================================================ */
  class RevealSystem {
    constructor() {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('visible');
          // skill-fill stores --lv on itself
          const fill = e.target.querySelector('.skill-fill');
          if (fill) {
            const lv = getComputedStyle(fill).getPropertyValue('--lv').trim() || '80%';
            fill.style.width = lv;
          }
        });
      }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
      $$('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
    }
  }

  /* ================================================================
     10. SKILLS TABS
     ================================================================ */
  class SkillsTabs {
    constructor() {
      $$('.tab').forEach(btn => {
        btn.addEventListener('click', () => {
          $$('.tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          $$('.tab-panel').forEach(p => p.classList.remove('active'));
          const panel = $('#tab-' + btn.dataset.tab);
          if (!panel) return;
          panel.classList.add('active');
          gsap.from(panel, { opacity:0, y:10, duration:.3 });
          // re-trigger skill bars
          $$('.skill-card', panel).forEach(card => {
            card.classList.remove('visible');
            const fill = card.querySelector('.skill-fill');
            if (fill) fill.style.width = '0';
            requestAnimationFrame(() => {
              card.classList.add('visible');
              if (fill) {
                const lv = getComputedStyle(fill).getPropertyValue('--lv').trim() || '80%';
                fill.style.width = lv;
              }
            });
          });
        });
      });
    }
  }

  /* ================================================================
     11. PROJECT FILTER
     ================================================================ */
  class ProjectFilter {
    constructor() {
      $$('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          $$('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed','true');
          const f = btn.dataset.filter;
          $$('.proj-card').forEach(card => {
            const show = f === 'all' || card.dataset.cat === f;
            if (show) {
              card.classList.remove('hidden');
              gsap.fromTo(card, { opacity:0, scale:.96 }, { opacity:1, scale:1, duration:.35, ease:'power2.out' });
            } else {
              gsap.to(card, { opacity:0, scale:.96, duration:.25, ease:'power2.in',
                onComplete: () => card.classList.add('hidden')
              });
            }
          });
        });
      });
    }
  }

  /* ================================================================
     12. TESTIMONIALS SLIDER — touch + auto-play
     ================================================================ */
  class TestimonialsSlider {
    constructor() {
      this.track  = $('#testi-track');
      if (!this.track) return;
      this.cards  = $$('.testi-card', this.track);
      this.dotsEl = $('#testi-dots');
      this.cur    = 0;
      this._calcPerView();
      this._buildDots();
      this._bindControls();
      this._bindTouch();
      this._startAuto();
      on(window, 'resize', debounce(this._onResize.bind(this), 200));
    }
    _calcPerView() {
      this.perView = window.innerWidth < 900 ? 1 : 2;
      this.total   = Math.ceil(this.cards.length / this.perView);
    }
    _buildDots() {
      if (!this.dotsEl) return;
      this.dotsEl.innerHTML = '';
      for (let i = 0; i < this.total; i++) {
        const d = document.createElement('div');
        d.className = 'testi-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => this._go(i));
        this.dotsEl.appendChild(d);
      }
    }
    _go(i) {
      this.cur = (i + this.total) % this.total;
      const pct = this.cur * (100 / this.cards.length * this.perView);
      gsap.to(this.track, { x: `-${pct}%`, duration:.5, ease:'power2.inOut' });
      $$('.testi-dot', this.dotsEl).forEach((d, idx) => d.classList.toggle('active', idx === this.cur));
    }
    _bindControls() {
      $('#testi-prev')?.addEventListener('click', () => { this._go(this.cur - 1); this._resetAuto(); });
      $('#testi-next')?.addEventListener('click', () => { this._go(this.cur + 1); this._resetAuto(); });
    }
    _bindTouch() {
      let sx = 0;
      on(this.track, 'touchstart', e => { sx = e.touches[0].clientX; });
      on(this.track, 'touchend',   e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 40) { this._go(this.cur + (dx < 0 ? 1 : -1)); this._resetAuto(); }
      });
    }
    _startAuto() {
      this.auto = setInterval(() => this._go(this.cur + 1), 5000);
      this.track.addEventListener('mouseenter', () => clearInterval(this.auto));
      this.track.addEventListener('mouseleave', () => this._resetAuto());
    }
    _resetAuto() {
      clearInterval(this.auto);
      this.auto = setInterval(() => this._go(this.cur + 1), 5000);
    }
    _onResize() {
      this._calcPerView();
      this.cur = 0;
      this._buildDots();
      gsap.set(this.track, { x: 0 });
    }
  }

  /* ================================================================
     13. CONTACT FORM — EmailJS + full validation
     ================================================================ */
  class ContactForm {
    constructor() {
      this.form = $('#contact-form');
      if (!this.form) return;
      this.btn  = $('#submit-btn');
      this.s    = { def: $('#btn-default'), load: $('#btn-loading'), ok: $('#btn-success') };
      this.rules = [
        { id:'fname',  err:'err-name',  msg:'Please enter your name' },
        { id:'femail', err:'err-email', msg:'Valid email required', email:true },
        { id:'fsubj',  err:'err-subj',  msg:'Please enter a subject' },
        { id:'fmsg',   err:'err-msg',   msg:'Please enter your message' },
      ];
      this.form.addEventListener('submit', this._submit.bind(this));

      // Live validation
      this.rules.forEach(r => {
        $('#' + r.id)?.addEventListener('input', () => this._clearErr(r));
      });
    }
    _validate() {
      let ok = true;
      this.rules.forEach(r => {
        const input = $('#' + r.id);
        const errEl = $('#' + r.err);
        input?.classList.remove('error');
        if (errEl) errEl.textContent = '';
        const val = input?.value.trim() || '';
        if (!val || (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))) {
          input?.classList.add('error');
          if (errEl) errEl.textContent = r.msg;
          ok = false;
        }
      });
      return ok;
    }
    _clearErr(r) {
      $('#' + r.id)?.classList.remove('error');
      const e = $('#' + r.err);
      if (e) e.textContent = '';
    }
    _state(s) {
      ['def','load','ok'].forEach(k => {
        if (this.s[k]) this.s[k].style.display = k === s ? 'flex' : 'none';
      });
      if (this.btn) this.btn.disabled = s === 'load';
    }
    async _submit(e) {
      e.preventDefault();
      if (!this._validate()) return;
      // Build mailto link and open Gmail
      const name    = $('#fname')?.value.trim() || '';
      const email   = $('#femail')?.value.trim() || '';
      const subject = $('#fsubj')?.value.trim() || 'Portfolio Contact';
      const message = $('#fmsg')?.value.trim() || '';
      const body    = `From: ${name} <${email}>\n\n${message}`;
      const mailto  = `mailto:doanhoang.4work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      // Show success feedback
      this._state('ok');
      this.form.reset();
      setTimeout(() => this._state('def'), 3000);
    }
    _success() {
      this._state('ok');
      if (this.btn) this.btn.style.background = 'linear-gradient(135deg,#4ade80,#16a34a)';
      gsap.from(this.s.ok, { scale:.85, duration:.4, ease:'back.out(2)' });
      this.form.reset();
      setTimeout(() => { this._state('def'); if (this.btn) this.btn.style.background = ''; }, 3500);
    }
    _error() {
      this._state('def');
      if (this.btn) this.btn.style.background = 'linear-gradient(135deg,#f87171,#dc2626)';
      setTimeout(() => { if (this.btn) this.btn.style.background = ''; }, 2000);
    }
  }

  /* ================================================================
     13.5 CALCULATOR
     ================================================================ */
  class Calculator {
    constructor() {
      this.form = $('#calc-form');
      this.result = $('#calc-result');
      if (!this.form) return;
      this.form.addEventListener('submit', this._calc.bind(this));
    }
    _calc(e) {
      e.preventDefault();
      const hours = parseFloat($('#calc-hours').value) || 0;
      const rate = parseFloat($('#calc-rate').value) || 0;
      const total = hours * rate;
      if (this.result) {
        this.result.textContent = `Total: $${total.toFixed(2)}`;
      }
    }
  }

  /* ================================================================
     13.6 GITHUB STATS
     ================================================================ */
  class GitHubStats {
    constructor() {
      this.starsEl = $('#github-stars');
      this.forksEl = $('#github-forks');
      this._fetch();
    }
    async _fetch() {
      try {
        const res = await fetch('https://api.github.com/repos/ndhoang1401-ops/ndhoang1401-ops');
        const data = await res.json();
        if (this.starsEl) this.starsEl.textContent = data.stargazers_count || 0;
        if (this.forksEl) this.forksEl.textContent = data.forks_count || 0;
      } catch (e) {
        console.log('GitHub API error:', e);
      }
    }
  }

  /* ================================================================
     14. MAGNETIC BUTTONS
     ================================================================ */
  class MagneticButtons {
    constructor() {
      $$('.magnetic, .nav-cta, .btn-primary').forEach(el => {
        on(el, 'mousemove', e => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - r.left - r.width/2) * .14}px, ${(e.clientY - r.top - r.height/2) * .14}px)`;
        });
        on(el, 'mouseleave', () => gsap.to(el, { x:0, y:0, duration:.45, ease:'elastic.out(1,.5)' }));
      });
    }
  }

  /* ================================================================
     15. SMOOTH SCROLL — offset for fixed navbar
     ================================================================ */
  class SmoothScroll {
    constructor() {
      $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const target = $(a.getAttribute('href'));
          if (!target) return;
          e.preventDefault();
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        });
      });
    }
  }

  /* ================================================================
     16. MOUSE TRACKER — normalized -1..1, feeds Three.js camera
     ================================================================ */
  class MouseTracker {
    constructor() {
      on(document, 'mousemove', e => {
        State.mouse.x = (e.clientX / window.innerWidth  - .5) * 2;
        State.mouse.y = (e.clientY / window.innerHeight - .5) * 2;
      });
    }
  }

  /* ================================================================
     17. PERFORMANCE DEBUG — add ?debug to URL to enable
     ================================================================ */
  class PerfMonitor {
    static start() {
      if (!location.search.includes('debug')) return;
      const el = document.createElement('div');
      el.style.cssText = 'position:fixed;top:4px;left:4px;z-index:99999;font:10px monospace;color:#4ade80;background:rgba(0,0,0,.65);padding:4px 8px;border-radius:4px;pointer-events:none';
      document.body.appendChild(el);
      let frames = 0, last = performance.now();
      RAF.add(() => {
        frames++;
        const now = performance.now();
        if (now - last >= 1000) {
          el.textContent = `FPS ${frames} | scroll ${Math.round(window.scrollY)}px | theme ${State.theme}`;
          frames = 0; last = now;
        }
      });
    }
  }


  /* ================================================================
     SAKURA PETALS — ambient hero animation
     ================================================================ */
  class SakuraPetals {
    constructor() {
      this.container = document.getElementById('sakura-container');
      if (!this.container) return;
      this.container.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1';
      this._spawn();
    }
    _spawn() {
      const count = isMobile() ? 6 : 12;
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'sakura-petal';
        const size = 5 + Math.random() * 7;
        const dur  = 6 + Math.random() * 8;
        const delay = Math.random() * 10;
        p.style.cssText = `
          left:${Math.random()*100}%;
          width:${size}px;height:${size}px;
          animation-duration:${dur}s;
          animation-delay:-${delay}s;
          opacity:${0.3 + Math.random()*.4};
        `;
        this.container.appendChild(p);
      }
    }
  }

  /* ================================================================
     HERO CARD 3D TILT
     ================================================================ */
  class HeroTilt {
    constructor() {
      const card = document.querySelector('.hero-card');
      if (!card || isMobile()) return;
      on(card, 'mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        card.style.transform = `perspective(600px) rotateY(${x*10}deg) rotateX(${-y*10}deg) scale(1.02)`;
      });
      on(card, 'mouseleave', () => {
        gsap.to(card, { rotateX:0, rotateY:0, scale:1, duration:.5, ease:'power2.out', clearProps:'transform' });
      });
    }
  }


  /* ================================================================
     YOUTUBE MUSIC PLAYER — auto-play muted, user unmutes
     ================================================================ */
  class MusicPlayer {
    constructor() {
      // Vietnamese chill playlist
      this.playlist = [
        { id:'V5GS5ANG96M', title:'3107',           artist:'W/n ft. Nâu, Duongg'        },
        { id:'2TRPgOVHwAg', title:'Em Không Khóc',  artist:'buitruonglinh ft. Vũ Phụng Tiên' },
        { id:'v60QHnGG9GE', title:'Waiting For You', artist:'MONO'                       },
        { id:'OFM1p_6HEEY', title:'Có Chắc Yêu Là Đây', artist:'Sơn Tùng M-TP'        },
        { id:'GD0EUcPSxkI', title:'Nơi Này Có Anh', artist:'Sơn Tùng M-TP'             },
        { id:'i-TiXm4_eDQ', title:'Thất Tình',     artist:'Bảo Thy'                    },
      ];
      this.curIdx    = 0;
      this.videoId   = this.playlist[0].id;
      this.player    = null;
      this.playing   = false;
      this.muted     = true;
      this.progress  = 0;
      this._rafId    = null;
      this._load();
    }

    _load() {
      // Load YouTube IFrame API
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => this._initPlayer();
      } else {
        this._initPlayer();
      }
    }

    _initPlayer() {
      this.player = new YT.Player('yt-player', {
        videoId: this.videoId,
        playerVars: {
          autoplay: 1, mute: 1, loop: 1,
          playlist: this.videoId,
          controls: 0, disablekb: 1,
          modestbranding: 1, rel: 0
        },
        events: {
          onReady: e => {
            e.target.playVideo();
            this.playing = true;
            this._updateUI();
            this._trackProgress();
          },
          onStateChange: e => {
            this.playing = e.data === YT.PlayerState.PLAYING;
            if (e.data === YT.PlayerState.ENDED) this._onEnd();
            this._updateUI();
          }
        }
      });
    }

    _trackProgress() {
      const tick = () => {
        if (this.player?.getDuration) {
          const dur  = this.player.getDuration() || 1;
          const cur  = this.player.getCurrentTime() || 0;
          this.progress = (cur / dur) * 100;
          const bar = $('#music-progress');
          if (bar) bar.style.width = this.progress + '%';
        }
        this._rafId = requestAnimationFrame(tick);
      };
      tick();
    }

    _updateUI() {
      const icon     = $('#play-icon');
      const vinyl    = $('#util-vinyl');
      const muteIcon = $('#mute-icon');
      const title    = $('.util-song-title');
      const artist   = $('.util-song-artist');
      const song     = this.playlist[this.curIdx];
      if (icon)   icon.className = this.playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
      if (vinyl)  vinyl.classList.toggle('paused', !this.playing);
      if (muteIcon) muteIcon.className = this.muted
        ? 'fa-solid fa-volume-xmark'
        : 'fa-solid fa-volume-high';
      if (title && song)  title.textContent  = song.title;
      if (artist && song) artist.textContent = song.artist;
    }

    togglePlay() {
      if (!this.player) return;
      this.playing ? this.player.pauseVideo() : this.player.playVideo();
    }

    toggleMute() {
      if (!this.player) return;
      this.muted = !this.muted;
      this.muted ? this.player.mute() : this.player.unMute();
      this._updateUI();
    }

    skip(dir) {
      if (!this.player) return;
      // dir -1 = prev song, 1 = next song
      this.curIdx = (this.curIdx + dir + this.playlist.length) % this.playlist.length;
      const song = this.playlist[this.curIdx];
      this.player.loadVideoById(song.id);
      this.player.playVideo();
      this.playing = true;
      this._updateUI();
    }

    // Auto next song when ended
    _onEnd() {
      this.skip(1);
    }
  }

  /* ================================================================
     UTILITY BAR — clock + music controls + collapse
     ================================================================ */
  class UtilityBar {
    constructor(musicPlayer) {
      this.bar    = $('#utility-bar');
      this.music  = musicPlayer;
      this._collapsed = false;
      this._pinned = false;
      this._initClock();
      this._bindControls();
      this._bindPin();
    }

    _bindPin() {
      // Click the bar to pin/unpin
      this.bar?.addEventListener('click', () => {
        this._pinned = !this._pinned;
        this.bar.classList.toggle('pinned', this._pinned);
      });
    }

    _initClock() {
      const tick = () => {
        const now  = new Date();
        const h    = String(now.getHours()).padStart(2,'0');
        const m    = String(now.getMinutes()).padStart(2,'0');
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const timeEl = $('#util-time');
        const dateEl = $('#util-date');
        if (timeEl) timeEl.textContent = h + ':' + m;
        if (dateEl) dateEl.textContent = days[now.getDay()] + ' ' + now.getDate() + ' ' + mons[now.getMonth()];
        setTimeout(tick, 10000);
      };
      tick();
    }

    _bindControls() {
      $('#music-play')?.addEventListener('click', () => this.music?.togglePlay());
      $('#music-mute')?.addEventListener('click', () => this.music?.toggleMute());
      $('#music-prev')?.addEventListener('click', () => this.music?.skip(-1));
      $('#music-next')?.addEventListener('click', () => this.music?.skip(1));
      $('#util-collapse')?.addEventListener('click', () => this._toggle());
    }

    _toggle() {
      this._collapsed = !this._collapsed;
      this.bar?.classList.toggle('collapsed', this._collapsed);
      const icon = $('#collapse-icon');
      if (icon) icon.className = this._collapsed
        ? 'fa-solid fa-chevron-up'
        : 'fa-solid fa-chevron-down';
    }
  }

  /* ================================================================
     APP ORCHESTRATOR
     ================================================================ */
  const App = {
    boot() {
      gsap.registerPlugin(ScrollTrigger);
      if (typeof emailjs !== 'undefined') emailjs.init(CFG.EMAILJS_KEY);

      // Page transition overlay
      const pt = document.createElement('div');
      pt.className = 'page-transition';
      document.body.appendChild(pt);

      // iOS 26 liquid glass anchor transitions
      $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', () => {
          pt.classList.add('active');
          setTimeout(() => pt.classList.remove('active'), 250);
        });
      });

      // Synchronous — needed immediately
      new MouseTracker();
      new Cursor();
      new ScrollProgress();
      new ThemeManager();
      new SmoothScroll();

      // Back-to-top
      $('.back-top')?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

      // Deferred one frame — unblocks first paint
      requestAnimationFrame(() => {
        new ParticleField();
        new TypedText();
        new Navbar();
        new RevealSystem();
        new SkillsTabs();
        // ProjectFilter removed — all projects shown
        new TestimonialsSlider();
        new ContactForm();
        new Calculator();
        new GitHubStats();
        new MagneticButtons();

        HeroAnim.run();
        HeroAnim.counters();
        HeroAnim.scroll();
        new SakuraPetals();
        new HeroTilt();

        // Music + Utility Bar
        const mp = new MusicPlayer();
        new UtilityBar(mp);

        PerfMonitor.start();
      });
    }
  };

  /* ── ENTRY POINT ─────────────────────────────────────────────── */
  new Loader();

})();