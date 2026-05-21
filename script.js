/* ═══════════════════════════════════════════════════════
   FB CAKES – GOD MODE  |  script.js
   Premium interactions, animations, business logic
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────
   1. LOADER
────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Kick off hero animations after load
    animateHero();
  }, 1900);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';

function animateHero() {
  const els = document.querySelectorAll('.hero-content > *');
  els.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.12}s`;
  });
}


/* ──────────────────────────────
   2. CURSOR GLOW
────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top  = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}


/* ──────────────────────────────
   3. NAVBAR
────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    toggleBackToTop();
  }, { passive: true });

  function openNav() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => navLinks.classList.contains('open') ? closeNav() : openNav());
  navOverlay.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', closeNav));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNav(); });


  /* ──────────────────────────────
     4. SCROLL REVEAL
  ────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx   = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 90, 450);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────
     5. ACTIVE NAV LINK
  ────────────────────────────── */
  const sections   = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(document.querySelectorAll('section[id]')[0] || document.body);

  sections.forEach(s => {
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      });
    }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
  });


  /* ──────────────────────────────
     6. COUNT-UP ANIMATION
  ────────────────────────────── */
  const countEls = document.querySelectorAll('.count-up');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start    = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));


  /* ──────────────────────────────
     7. MENU FILTER TABS
  ────────────────────────────── */
  const tabs      = document.querySelectorAll('.menu-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;

      menuCards.forEach((card, i) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = `fadeUp .45s ${i * 50}ms ease both`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ──────────────────────────────
     8. ORDER BUTTONS
  ────────────────────────────── */
  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.busy) return;
      btn.dataset.busy = 'true';
      const orig = btn.textContent;
      btn.textContent = '✅ Added!';
      btn.style.background = 'var(--green)';
      btn.style.transform  = 'scale(1.08)';
      setTimeout(() => {
        btn.textContent      = orig;
        btn.style.background = '';
        btn.style.transform  = '';
        delete btn.dataset.busy;
      }, 2200);
    });
  });


  /* ──────────────────────────────
     9. CONTACT FORM
  ────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('name');
      const phone   = document.getElementById('phone');
      const enquiry = document.getElementById('enquiry');
      let valid = true;

      [name, phone, enquiry].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--red)';
          field.style.boxShadow   = '0 0 0 3px rgba(212,43,43,.12)';
          field.style.animation   = 'shake .35s ease';
          valid = false;
          setTimeout(() => {
            field.style.borderColor = '';
            field.style.boxShadow   = '';
            field.style.animation   = '';
          }, 2800);
        }
      });
      if (!valid) return;

      const orig = submitBtn.innerHTML;
      submitBtn.innerHTML  = '<span>Sending...</span>';
      submitBtn.disabled   = true;
      submitBtn.style.opacity = '.7';

      setTimeout(() => {
        submitBtn.innerHTML  = '<span>✅ Message Sent!</span>';
        submitBtn.style.opacity  = '1';
        submitBtn.style.background = 'var(--green)';
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML  = orig;
          submitBtn.disabled   = false;
          submitBtn.style.background = '';
          formSuccess.classList.remove('show');
        }, 4500);
      }, 1700);
    });
  }


  /* ──────────────────────────────
     10. BACK TO TOP
  ────────────────────────────── */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  /* ──────────────────────────────
     11. SMOOTH SCROLL
  ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });


  /* ──────────────────────────────
     12. PARALLAX HERO BG
  ────────────────────────────── */
  const heroBgImg = document.querySelector('.hero-bg__img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBgImg.style.transform = `scale(1.04) translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }


  /* ──────────────────────────────
     13. FLOATING CARDS MOUSE TILT
  ────────────────────────────── */
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top  - cy) / cy;

      document.querySelectorAll('.hcard').forEach((card, i) => {
        const depth = 0.8 + i * 0.4;
        card.style.transform = `
          translateY(${card.offsetParent ? -6 : 0}px)
          rotateY(${dx * 4 * depth}deg)
          rotateX(${-dy * 3 * depth}deg)
          translateZ(${10 * depth}px)
        `;
      });
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      document.querySelectorAll('.hcard').forEach(card => {
        card.style.transform = '';
      });
    });
  }


  /* ──────────────────────────────
     14. GALLERY HOVER RIPPLE
  ────────────────────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect   = item.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute;
        width:10px; height:10px;
        border-radius:50%;
        background:rgba(255,255,255,.5);
        left:${e.clientX - rect.left - 5}px;
        top:${e.clientY - rect.top - 5}px;
        transform:scale(0);
        animation:rippleOut .6s ease forwards;
        pointer-events:none;
        z-index:10;
      `;
      item.style.position = 'relative';
      item.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });


  /* ──────────────────────────────
     15. WHY CARD MAGNETIC HOVER
  ────────────────────────────── */
  document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const dx   = (e.clientX - rect.left - cx) / cx;
      const dy   = (e.clientY - rect.top  - cy) / cy;
      card.style.transform = `translateY(-6px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ──────────────────────────────
     16. CITY CHIP HOVER
  ────────────────────────────── */
  document.querySelectorAll('.city-chip:not(.city-chip--more)').forEach(chip => {
    chip.addEventListener('mouseenter', () => chip.style.transform = 'scale(1.07)');
    chip.addEventListener('mouseleave', () => chip.style.transform  = '');
  });


  /* ──────────────────────────────
     17. PLATFORM BAR ANIMATION on view
  ────────────────────────────── */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.platform-fill').forEach((fill, i) => {
        fill.style.animationDelay = `${i * 0.2}s`;
      });
      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  const reviewBar = document.querySelector('.review-bar');
  if (reviewBar) barObserver.observe(reviewBar);

}); // end DOMContentLoaded


/* ── INLINE KEYFRAMES via style tag ── */
const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes shake {
  0%,100%{ transform: translateX(0); }
  20%    { transform: translateX(-6px); }
  40%    { transform: translateX(6px); }
  60%    { transform: translateX(-4px); }
  80%    { transform: translateX(4px); }
}
@keyframes rippleOut {
  to { transform: scale(30); opacity: 0; }
}
`;
document.head.appendChild(styleTag);
