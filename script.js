// ============================================================
// script.js — The Muscle Lab Gym — COMPLETE FULL FILE
// ============================================================

'use strict';

// ============================================================
// GLOBAL CONSTANTS
// ============================================================

const GYM_NAME       = "The Muscle Lab Gym";
const GYM_PHONE      = "+917727867736";
const GYM_WHATSAPP   = "917727867736";
const BOOKING_WA     = "917727867736";
const HEADER_HEIGHT  = 72;

// ============================================================
// 1. initHeader — sticky header with scroll shadow
// ============================================================

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================
// 2. initMobileMenu — fullscreen overlay menu
// ============================================================

function initMobileMenu() {
  const hamburger    = document.getElementById('hamburger');
  const overlay      = document.getElementById('mobileMenuOverlay');
  const closeBtn     = document.getElementById('mobileMenuClose');
  const menuLinks    = document.querySelectorAll('.mobile-nav-link');
  const body         = document.body;

  if (!hamburger || !overlay) return;

  function openMenu() {
    overlay.classList.add('active');
    hamburger.classList.add('open');
    body.classList.add('no-scroll');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');

    // stagger animate each link
    menuLinks.forEach((link, i) => {
      link.style.transitionDelay = `${i * 0.06}s`;
      link.classList.add('animated');
    });
  }

  function closeMenu() {
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
    body.classList.remove('no-scroll');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');

    menuLinks.forEach(link => {
      link.style.transitionDelay = '0s';
      link.classList.remove('animated');
    });
  }

  hamburger.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on backdrop click (not on nav content)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });

  // Each nav link: close menu + smooth scroll
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      closeMenu();
      setTimeout(() => {
        if (target && target.startsWith('#')) {
          smoothScrollTo(target.substring(1));
        }
      }, 320);
    });
  });
}

// ============================================================
// 3. initHeroSlider — exactly 3 slides, auto-scroll
// ============================================================

function initHeroSlider() {
  const slides      = document.querySelectorAll('.hero-slide');
  const dots        = document.querySelectorAll('.slider-dot');
  const prevBtn     = document.getElementById('sliderPrev');
  const nextBtn     = document.getElementById('sliderNext');
  const sliderWrap  = document.querySelector('.hero-slider');

  if (!slides.length) return;

  let current        = 0;
  let autoTimer      = null;
  let touchStartX    = 0;
  let touchEndX      = 0;
  let isAnimating    = false;
  const TOTAL        = slides.length; // must be 3
  const INTERVAL     = 5000;

  // ── go to specific slide ──────────────────────────────────
  function goToSlide(index) {
    if (isAnimating) return;
    if (index < 0)      index = TOTAL - 1;
    if (index >= TOTAL) index = 0;
    if (index === current && slides[current].classList.contains('active')) return;

    isAnimating = true;

    // Remove active from current
    slides[current].classList.remove('active');
    slides[current].classList.add('leaving');
    dots[current] && dots[current].classList.remove('active');

    current = index;

    // Activate new slide
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');

    // Animate content inside new slide
    animateSlideContent(slides[current]);

    // Clean up leaving class after transition
    setTimeout(() => {
      document.querySelectorAll('.hero-slide.leaving').forEach(s => s.classList.remove('leaving'));
      isAnimating = false;
    }, 850);
  }

  // ── animate heading / sub / buttons ──────────────────────
  function animateSlideContent(slide) {
    const elements = slide.querySelectorAll(
      '.slide-badge, .slide-heading, .slide-sub, .slide-buttons'
    );
    elements.forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(36px)';
      el.style.transition = 'none';

      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transition = `opacity 0.65s ease ${i * 0.12}s, transform 0.65s ease ${i * 0.12}s`;
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';
        }, 60);
      });
    });
  }

  // ── auto-scroll ───────────────────────────────────────────
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goToSlide(current + 1), INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // ── arrow buttons ─────────────────────────────────────────
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(current - 1);
      restartAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(current + 1);
      restartAuto();
    });
  }

  // ── dot indicators ────────────────────────────────────────
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (i !== current) {
        goToSlide(i);
        restartAuto();
      }
    });
  });

  // ── pause on hover ────────────────────────────────────────
  if (sliderWrap) {
    sliderWrap.addEventListener('mouseenter', stopAuto);
    sliderWrap.addEventListener('mouseleave', startAuto);
  }

  // ── touch / swipe support ─────────────────────────────────
  if (sliderWrap) {
    sliderWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    sliderWrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(current + 1); // swipe left → next
        } else {
          goToSlide(current - 1); // swipe right → prev
        }
        restartAuto();
      }
    }, { passive: true });
  }

  // ── Keyboard arrow navigation ─────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goToSlide(current - 1); restartAuto(); }
    if (e.key === 'ArrowRight') { goToSlide(current + 1); restartAuto(); }
  });

  // ── initialise ────────────────────────────────────────────
  slides.forEach((s, i) => {
    if (i === 0) {
      s.classList.add('active');
    }
  });
  dots[0] && dots[0].classList.add('active');
  animateSlideContent(slides[0]);
  startAuto();
}

// ============================================================
// 4. initScrollReveal — IntersectionObserver fade in
// ============================================================

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold : 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

// ============================================================
// 5. initActiveNav — highlight nav link for visible section
// ============================================================

function initActiveNav() {
  const sectionIds = [
    'home', 'about', 'programs', 'membership',
    'trainers', 'gallery', 'booking', 'faq', 'contact'
  ];

  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  let ticking = false;

  function updateActiveNav() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY + HEADER_HEIGHT + 60;
        let activeId  = sectionIds[0];

        sectionIds.forEach(id => {
          const section = document.getElementById(id);
          if (section && section.offsetTop <= scrollY) {
            activeId = id;
          }
        });

        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

// ============================================================
// 6. smoothScrollTo — smooth scroll helper
// ============================================================

function smoothScrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ============================================================
// 7. initSmoothScroll — attach to all hash links
// ============================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.length > 1 && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href.substring(1));
      }
    });
  });
}

// ============================================================
// 8. initBackToTop — show/hide + scroll to top
// ============================================================

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 400) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  onScroll();
}

// ============================================================
// 9. initCountUp — animated number counter
// ============================================================

function initCountUp() {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  let countersStarted = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start    = performance.now();

    function frame(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = Math.floor(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        statsBar.querySelectorAll('.stat-number').forEach(animateCounter);
        observer.unobserve(statsBar);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsBar);
}

// ============================================================
// 10. initFAQAccordion — single-open accordion
// ============================================================

function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  function closeAll() {
    faqItems.forEach(item => {
      item.classList.remove('open');
      const btn = item.querySelector('.faq-question');
      const ans = item.querySelector('.faq-answer');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (ans) ans.style.maxHeight = '0';
    });
  }

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const ans = item.querySelector('.faq-answer');
    if (!btn || !ans) return;

    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    ans.style.maxHeight = '0';
    ans.style.overflow  = 'hidden';
    ans.style.transition = 'max-height 0.38s ease, padding 0.38s ease';

    function toggle() {
      const isOpen = item.classList.contains('open');
      closeAll();
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        ans.style.maxHeight = ans.scrollHeight + 32 + 'px';
      }
    }

    btn.addEventListener('click', toggle);

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

// ============================================================
// 11. submitBooking — form validation + WhatsApp redirect
// ============================================================

function submitBooking() {
  const name    = document.getElementById('bkName');
  const mobile  = document.getElementById('bkMobile');
  const email   = document.getElementById('bkEmail');
  const program = document.getElementById('bkProgram');
  const date    = document.getElementById('bkDate');
  const time    = document.getElementById('bkTime');
  const msg     = document.getElementById('bkMsg');

  let valid = true;

  // Clear all errors first
  clearBkError('bkName',    'errBkName');
  clearBkError('bkMobile',  'errBkMobile');
  clearBkError('bkProgram', 'errBkProgram');
  clearBkError('bkDate',    'errBkDate');
  clearBkError('bkTime',    'errBkTime');

  // Validate Name
  if (!name || name.value.trim().length < 3) {
    showBkError('bkName', 'errBkName', 'Please enter your full name (min 3 characters).');
    valid = false;
  }

  // Validate Mobile (10 digits)
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobile || !mobileRegex.test(mobile.value.trim())) {
    showBkError('bkMobile', 'errBkMobile', 'Please enter a valid 10-digit mobile number.');
    valid = false;
  }

  // Validate Program
  if (!program || !program.value || program.value === '') {
    showBkError('bkProgram', 'errBkProgram', 'Please select a program.');
    valid = false;
  }

  // Validate Date
  if (!date || !date.value) {
    showBkError('bkDate', 'errBkDate', 'Please select your preferred date.');
    valid = false;
  }

  // Validate Time
  if (!time || !time.value || time.value === '') {
    showBkError('bkTime', 'errBkTime', 'Please select a preferred time slot.');
    valid = false;
  }

  if (!valid) {
    showToast('Please fix the errors before submitting.', 'error');
    return;
  }

  // Build WhatsApp message
  const nameVal    = name.value.trim();
  const mobileVal  = mobile.value.trim();
  const emailVal   = (email && email.value.trim()) ? email.value.trim() : 'Not provided';
  const programVal = program.options[program.selectedIndex].text;
  const dateVal    = date.value;
  const timeVal    = time.options[time.selectedIndex].text;
  const msgVal     = (msg && msg.value.trim()) ? msg.value.trim() : 'No additional message';

  const waMessage =
    `Hello! I want to book a session at ${GYM_NAME}.\n\n` +
    `Name: ${nameVal}\n` +
    `Mobile: ${mobileVal}\n` +
    `Email: ${emailVal}\n` +
    `Program: ${programVal}\n` +
    `Date: ${dateVal}\n` +
    `Time: ${timeVal}\n` +
    `Message: ${msgVal}\n\n` +
    `Please confirm my slot. Thank you!`;

  const encodedMsg = encodeURIComponent(waMessage);
  const waURL      = `https://wa.me/${BOOKING_WA}?text=${encodedMsg}`;

  window.open(waURL, '_blank', 'noopener,noreferrer');

  // Reset form
  const form = document.getElementById('bookingForm');
  if (form) form.reset();

  // Clear all errors
  clearBkError('bkName',    'errBkName');
  clearBkError('bkMobile',  'errBkMobile');
  clearBkError('bkProgram', 'errBkProgram');
  clearBkError('bkDate',    'errBkDate');
  clearBkError('bkTime',    'errBkTime');

  showToast('Booking request sent! We\'ll confirm your slot within 2 hours.', 'success');
}

// ============================================================
// 12. showBkError — display inline form error
// ============================================================

function showBkError(fieldId, spanId, message) {
  const field = document.getElementById(fieldId);
  const span  = document.getElementById(spanId);
  if (field) field.classList.add('field-error');
  if (span) {
    span.textContent    = message;
    span.style.display  = 'block';
  }
}

// ============================================================
// 13. clearBkError — remove inline form error
// ============================================================

function clearBkError(fieldId, spanId) {
  const field = document.getElementById(fieldId);
  const span  = document.getElementById(spanId);
  if (field) field.classList.remove('field-error');
  if (span) {
    span.textContent   = '';
    span.style.display = 'none';
  }
}

// ============================================================
// 14. initLiveValidation — clear errors as user types
// ============================================================

function initLiveValidation() {
  const fields = [
    { id: 'bkName',    err: 'errBkName',    event: 'input'  },
    { id: 'bkMobile',  err: 'errBkMobile',  event: 'input'  },
    { id: 'bkProgram', err: 'errBkProgram', event: 'change' },
    { id: 'bkDate',    err: 'errBkDate',    event: 'change' },
    { id: 'bkTime',    err: 'errBkTime',    event: 'change' },
  ];

  fields.forEach(({ id, err, event }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(event, () => {
      if (el.classList.contains('field-error')) {
        clearBkError(id, err);
      }
    });
  });

  // Mobile field — digits only, max 10
  const mobileField = document.getElementById('bkMobile');
  if (mobileField) {
    mobileField.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });

    mobileField.addEventListener('input', () => {
      mobileField.value = mobileField.value.replace(/\D/g, '').slice(0, 10);
    });

    mobileField.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      mobileField.value = pasted.replace(/\D/g, '').slice(0, 10);
    });
  }
}

// ============================================================
// 15. initMembershipButtons — WhatsApp redirect with plan name
// ============================================================

function initMembershipButtons() {
  const planBtns = document.querySelectorAll('.plan-cta-btn');
  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan') || 'your membership plan';
      const message  =
        `Hello! I am interested in the ${planName} plan at ${GYM_NAME}.\n` +
        `Please share more details and pricing. Thank you!`;
      const encoded  = encodeURIComponent(message);
      const url      = `https://wa.me/${GYM_WHATSAPP}?text=${encoded}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
}

// ============================================================
// 16. showToast — notification toast
// ============================================================

function showToast(message, type = 'info') {
  let toast = document.getElementById('siteToast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    document.body.appendChild(toast);
  }

  // Set color based on type
  const colors = {
    success : '#48bb78',
    error   : '#e53e3e',
    info    : '#4299e1'
  };

  toast.textContent         = message;
  toast.style.background    = colors[type] || colors.info;
  toast.style.position      = 'fixed';
  toast.style.bottom        = '24px';
  toast.style.right         = '90px';
  toast.style.padding       = '14px 24px';
  toast.style.borderRadius  = '8px';
  toast.style.color         = '#ffffff';
  toast.style.fontFamily    = '"DM Sans", sans-serif';
  toast.style.fontSize      = '0.95rem';
  toast.style.fontWeight    = '500';
  toast.style.zIndex        = '9999';
  toast.style.boxShadow     = '0 8px 32px rgba(0,0,0,0.4)';
  toast.style.maxWidth      = '320px';
  toast.style.lineHeight    = '1.4';
  toast.style.opacity       = '0';
  toast.style.transform     = 'translateY(20px)';
  toast.style.transition    = 'opacity 0.35s ease, transform 0.35s ease';
  toast.style.pointerEvents = 'none';

  // Show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateY(0)';
    });
  });

  // Auto dismiss after 3500ms
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 3500);
}

// ============================================================
// 17. initImageFallbacks — gradient bg if image errors
// ============================================================

function initImageFallbacks() {
  const gradients = [
    'linear-gradient(135deg, #1a1a1a 0%, #2d0a0a 100%)',
    'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%)',
    'linear-gradient(135deg, #111111 0%, #2a1010 100%)',
    'linear-gradient(135deg, #0f0f0f 0%, #1f0808 100%)',
  ];

  let fallbackIndex = 0;

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      const parent = this.parentElement;
      if (parent) {
        parent.style.background = gradients[fallbackIndex % gradients.length];
        fallbackIndex++;
      }
      this.style.display = 'none';
    });
  });
}

// ============================================================
// 18. initResizeHandler — debounced resize events
// ============================================================

function initResizeHandler() {
  let resizeTimer = null;
  const overlay   = document.getElementById('mobileMenuOverlay');
  const body      = document.body;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = window.innerWidth;

      // Close mobile menu if resized to desktop
      if (w > 768 && overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
        const hamburger = document.getElementById('hamburger');
        if (hamburger) {
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }

      // Recalculate FAQ answer heights if any are open
      document.querySelectorAll('.faq-item.open .faq-answer').forEach(ans => {
        ans.style.maxHeight = ans.scrollHeight + 32 + 'px';
      });

    }, 220);
  });
}

// ============================================================
// EXTRA: initCardTiltEffect — 3D tilt on program/trainer cards
// ============================================================

function initCardTiltEffect() {
  const tiltCards = document.querySelectorAll(
    '.program-card, .trainer-card, .plan-card, .gallery-item'
  );

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const dx     = (x - cx) / cx;
      const dy     = (y - cy) / cy;
      const tiltX  = -dy * 6;
      const tiltY  =  dx * 6;

      card.style.transform     = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      card.style.transition    = 'transform 0.12s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.55s ease';
    });
  });
}

// ============================================================
// EXTRA: initParallaxHero — subtle parallax on hero text
// ============================================================

function initParallaxHero() {
  const heroSection = document.querySelector('.hero-slider');
  if (!heroSection) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const slides  = document.querySelectorAll('.hero-slide.active .slide-content');
        slides.forEach(content => {
          content.style.transform = `translateY(${scrollY * 0.25}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ============================================================
// EXTRA: initStatCardHover — glow effect on hover
// ============================================================

function initStatCardHover() {
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.boxShadow = '0 0 40px rgba(229,62,62,0.25), inset 0 0 40px rgba(229,62,62,0.05)';
      item.style.transform = 'translateY(-6px) scale(1.04)';
      item.style.transition = 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.boxShadow = '';
      item.style.transform = 'translateY(0) scale(1)';
      item.style.transition = 'all 0.35s ease';
    });
  });
}

// ============================================================
// EXTRA: initMagneticButtons — subtle magnetic effect on CTAs
// ============================================================

function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-primary, .btn-outline, .btn-whatsapp');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform  = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      btn.style.transition = 'transform 0.15s ease';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = 'translate(0, 0)';
      btn.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

// ============================================================
// EXTRA: initTestimonialHover — card flip reveal on hover
// ============================================================

function initTestimonialHover() {
  const cards = document.querySelectorAll('.testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderLeftColor = '#e53e3e';
      card.style.boxShadow =
        '0 20px 60px rgba(0,0,0,0.5), -4px 0 0 #e53e3e, 0 0 40px rgba(229,62,62,0.15)';
      card.style.transform  = 'translateY(-10px)';
      card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.borderLeftColor = '';
      card.style.boxShadow = '';
      card.style.transform  = 'translateY(0)';
      card.style.transition = 'all 0.4s ease';
    });
  });
}

// ============================================================
// EXTRA: initGlowTrail — cursor glow trail effect
// ============================================================

function initGlowTrail() {
  // Only on desktop (performance)
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const trail = document.createElement('div');
  trail.id = 'cursorTrail';
  trail.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(229,62,62,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.4s ease, top 0.4s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(trail);

  document.addEventListener('mousemove', (e) => {
    trail.style.left = e.clientX + 'px';
    trail.style.top  = e.clientY + 'px';
  }, { passive: true });
}

// ============================================================
// EXTRA: initSectionProgressBar — reading progress at top
// ============================================================

function initSectionProgressBar() {
  const bar = document.createElement('div');
  bar.id    = 'readingProgress';
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #e53e3e, #f6ad55);
    z-index: 10000;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = Math.min(progress, 100) + '%';
  }, { passive: true });
}

// ============================================================
// EXTRA: initGalleryLightbox — click to view full image
// ============================================================

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'galleryLightbox';
  lb.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s ease;
    padding: 24px;
  `;
  lb.innerHTML = `
    <button id="lbClose" style="
      position: absolute; top: 20px; right: 24px;
      background: rgba(229,62,62,0.8); border: none; color: white;
      width: 44px; height: 44px; border-radius: 50%; font-size: 1.4rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background 0.2s ease; z-index: 1;
    ">✕</button>
    <button id="lbPrev" style="
      position: absolute; left: 20px;
      background: rgba(229,62,62,0.6); border: none; color: white;
      width: 50px; height: 50px; border-radius: 50%; font-size: 1.5rem;
      cursor: pointer; transition: background 0.2s ease;
    ">‹</button>
    <img id="lbImg" src="" alt="Gallery Image" style="
      max-width: 90vw; max-height: 85vh; object-fit: contain;
      border-radius: 8px; box-shadow: 0 20px 80px rgba(0,0,0,0.8);
      transition: opacity 0.3s ease;
    " />
    <button id="lbNext" style="
      position: absolute; right: 20px;
      background: rgba(229,62,62,0.6); border: none; color: white;
      width: 50px; height: 50px; border-radius: 50%; font-size: 1.5rem;
      cursor: pointer; transition: background 0.2s ease;
    ">›</button>
  `;
  document.body.appendChild(lb);

  const lbImg  = document.getElementById('lbImg');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbClose = document.getElementById('lbClose');

  let currentLbIndex = 0;
  const images = [];

  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      images.push({ src: img.src, alt: img.alt });
      item.style.cursor = 'pointer';

      item.addEventListener('click', () => {
        currentLbIndex = i;
        openLightbox(i);
      });
    }
  });

  function openLightbox(index) {
    if (!images[index]) return;
    lbImg.src     = images[index].src;
    lbImg.alt     = images[index].alt;
    lb.style.opacity      = '1';
    lb.style.pointerEvents = 'all';
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    lb.style.opacity       = '0';
    lb.style.pointerEvents = 'none';
    document.body.classList.remove('no-scroll');
  }

  function showPrev() {
    currentLbIndex = (currentLbIndex - 1 + images.length) % images.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      openLightbox(currentLbIndex);
      lbImg.style.opacity = '1';
    }, 200);
  }

  function showNext() {
    currentLbIndex = (currentLbIndex + 1) % images.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      openLightbox(currentLbIndex);
      lbImg.style.opacity = '1';
    }, 200);
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click',  showPrev);
  if (lbNext)  lbNext.addEventListener('click',  showNext);

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.style.opacity || lb.style.opacity === '0') return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
}

// ============================================================
// EXTRA: initHeaderLogoAnimation — logo hover effect
// ============================================================

function initHeaderLogoAnimation() {
  const logo = document.querySelector('.site-logo');
  if (!logo) return;

  logo.addEventListener('mouseenter', () => {
    const icon = logo.querySelector('.logo-icon');
    if (icon) {
      icon.style.transform  = 'rotate(20deg) scale(1.1)';
      icon.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  });

  logo.addEventListener('mouseleave', () => {
    const icon = logo.querySelector('.logo-icon');
    if (icon) {
      icon.style.transform  = 'rotate(0deg) scale(1)';
      icon.style.transition = 'transform 0.35s ease';
    }
  });
}

// ============================================================
// EXTRA: initContactCardAnimation — stagger on scroll reveal
// ============================================================

function initContactCardAnimation() {
  const contactCards = document.querySelectorAll('.contact-info-card');
  contactCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });
}

// ============================================================
// EXTRA: initTrainerCardHover — overlay animation
// ============================================================

function initTrainerCardHover() {
  const trainerCards = document.querySelectorAll('.trainer-card');
  trainerCards.forEach(card => {
    const overlay = card.querySelector('.trainer-overlay');

    card.addEventListener('mouseenter', () => {
      card.style.transform  = 'translateY(-12px)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease';
      card.style.boxShadow  = '0 24px 60px rgba(229,62,62,0.3), 0 8px 20px rgba(0,0,0,0.6)';
      if (overlay) {
        overlay.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'translateY(0)';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
      card.style.boxShadow  = '';
      if (overlay) {
        overlay.style.opacity = '0';
      }
    });
  });
}

// ============================================================
// EXTRA: initFloatingButtonsAnimation — ensure animation
// ============================================================

function initFloatingButtonsAnimation() {
  const waBtn   = document.getElementById('floatWA');
  const callBtn = document.getElementById('floatCall');

  // Add tooltips dynamically if not in HTML
  [
    { btn: waBtn,   text: 'Chat on WhatsApp' },
    { btn: callBtn, text: 'Call Us Now' }
  ].forEach(({ btn, text }) => {
    if (!btn) return;
    const tip = btn.querySelector('.float-tooltip');
    if (!tip) {
      const newTip = document.createElement('span');
      newTip.className   = 'float-tooltip';
      newTip.textContent = text;
      btn.appendChild(newTip);
    }
  });
}

// ============================================================
// EXTRA: initProgramCardHover — content slide on hover
// ============================================================

function initProgramCardHover() {
  const cards = document.querySelectorAll('.program-card');
  cards.forEach(card => {
    const overlay = card.querySelector('.program-overlay');
    const content = card.querySelector('.program-content');

    card.addEventListener('mouseenter', () => {
      if (overlay) overlay.style.background = 'rgba(0,0,0,0.55)';
      card.style.transform  = 'translateY(-8px) scale(1.02)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      card.style.boxShadow  = '0 0 0 2px #e53e3e, 0 20px 50px rgba(229,62,62,0.3)';
    });

    card.addEventListener('mouseleave', () => {
      if (overlay) overlay.style.background = '';
      card.style.transform  = 'translateY(0) scale(1)';
      card.style.transition = 'transform 0.4s ease';
      card.style.boxShadow  = '';
    });
  });
}

// ============================================================
// EXTRA: initPlanCardHover — popular plan pulse glow
// ============================================================

function initPlanCardHover() {
  const popularCard = document.querySelector('.plan-card.popular');
  if (!popularCard) return;

  let glowToggle = true;
  setInterval(() => {
    popularCard.style.boxShadow = glowToggle
      ? '0 0 50px rgba(229,62,62,0.5), 0 20px 60px rgba(0,0,0,0.6)'
      : '0 0 30px rgba(229,62,62,0.25), 0 20px 60px rgba(0,0,0,0.4)';
    glowToggle = !glowToggle;
  }, 1800);
}

// ============================================================
// EXTRA: initScrollProgressDots — section dots sidebar
// ============================================================

function initScrollProgressDots() {
  // Only on desktop
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  const sectionIds = [
    'home', 'about', 'programs', 'membership',
    'trainers', 'gallery', 'booking', 'faq', 'contact'
  ];

  const container = document.createElement('div');
  container.id = 'scrollDots';
  container.style.cssText = `
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 500;
  `;

  sectionIds.forEach((id, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('data-section', id);
    dot.setAttribute('aria-label', `Scroll to ${id}`);
    dot.style.cssText = `
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid rgba(229,62,62,0.5);
      background: transparent;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    `;

    dot.addEventListener('click', () => smoothScrollTo(id));
    container.appendChild(dot);
  });

  document.body.appendChild(container);

  // Update active dot on scroll
  function updateDots() {
    const scrollY  = window.scrollY + HEADER_HEIGHT + 100;
    let activeId   = sectionIds[0];

    sectionIds.forEach(id => {
      const sec = document.getElementById(id);
      if (sec && sec.offsetTop <= scrollY) activeId = id;
    });

    container.querySelectorAll('button').forEach(dot => {
      const isActive = dot.getAttribute('data-section') === activeId;
      dot.style.background    = isActive ? '#e53e3e' : 'transparent';
      dot.style.borderColor   = isActive ? '#e53e3e' : 'rgba(229,62,62,0.5)';
      dot.style.transform     = isActive ? 'scale(1.4)' : 'scale(1)';
    });
  }

  window.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
}

// ============================================================
// EXTRA: typewriterEffect — animated text in hero badge
// ============================================================

function initTypewriterEffect() {
  const badges = document.querySelectorAll('.slide-badge');
  if (!badges.length) return;

  // Only apply to visible/active badge
  function runTypewriter(el) {
    const text    = el.textContent.trim();
    el.textContent = '';
    el.style.borderRight = '2px solid #f6ad55';
    let i = 0;

    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => { el.style.borderRight = 'none'; }, 500);
      }
    }, 60);
  }

  // Observe first badge
  const firstActiveBadge = document.querySelector('.hero-slide.active .slide-badge');
  if (firstActiveBadge) {
    setTimeout(() => runTypewriter(firstActiveBadge), 600);
  }
}

// ============================================================
// EXTRA: initNavLinkHoverEffect — underline slide animation
// ============================================================

function initNavLinkHoverEffect() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    // Underline bar is handled by CSS ::after pseudo-element
    // Add ripple on click
    link.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(229,62,62,0.3);
        width: 60px;
        height: 60px;
        transform: scale(0);
        animation: rippleEffect 0.5s ease-out forwards;
        pointer-events: none;
        top: 50%;
        left: 50%;
        margin-left: -30px;
        margin-top: -30px;
      `;
      link.style.position = 'relative';
      link.style.overflow = 'hidden';
      link.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe if not already in stylesheet
  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id    = 'rippleStyle';
    style.textContent = `
      @keyframes rippleEffect {
        from { transform: scale(0); opacity: 1; }
        to   { transform: scale(3); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ============================================================
// EXTRA: initAboutSectionAnimation — stagger image reveal
// ============================================================

function initAboutSectionAnimation() {
  const aboutImgs = document.querySelectorAll('.about-img-item');
  aboutImgs.forEach((img, i) => {
    img.style.transitionDelay = `${i * 0.12}s`;
  });
}

// ============================================================
// DOMContentLoaded — initialise all functions in order
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // Core functionality
  initHeader();
  initMobileMenu();
  initHeroSlider();
  initScrollReveal();
  initActiveNav();
  initSmoothScroll();
  initBackToTop();
  initCountUp();
  initFAQAccordion();
  initLiveValidation();
  initMembershipButtons();
  initImageFallbacks();
  initResizeHandler();

  // Enhanced animations & effects
  initCardTiltEffect();
  initParallaxHero();
  initStatCardHover();
  initMagneticButtons();
  initTestimonialHover();
  initGlowTrail();
  initSectionProgressBar();
  initGalleryLightbox();
  initHeaderLogoAnimation();
  initContactCardAnimation();
  initTrainerCardHover();
  initFloatingButtonsAnimation();
  initProgramCardHover();
  initPlanCardHover();
  initScrollProgressDots();
  initTypewriterEffect();
  initNavLinkHoverEffect();
  initAboutSectionAnimation();

  // Console signature
  console.log(
    '%c💪 The Muscle Lab Gym — Website Loaded Successfully',
    'background:#e53e3e;color:#fff;padding:10px 20px;border-radius:6px;font-weight:bold;font-size:14px;'
  );
});

// ============================================================
// END OF script.js — The Muscle Lab Gym
// ============================================================
