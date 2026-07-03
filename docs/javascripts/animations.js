(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initAnimations() {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add('reduce-motion');
      return;
    }
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded; animations disabled.');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    document.documentElement.classList.add('js-animations-ready');

    initPageLoadAnimations();
    initScrollAnimations();
    initHoverAnimations();
    initNavEffects();
    initThemeToggleAnimation();
    initBackToTopAnimation();
    initSidebarAnimations();
  }

  function initPageLoadAnimations() {
    const hero = document.querySelector('.hero');

    // Global content fade-in for non-homepage pages
    const contentInner = document.querySelector('.md-content__inner');
    if (contentInner && !hero) {
      gsap.fromTo(contentInner,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
      );
      return;
    }

    if (!hero) return;

    const eyebrow = hero.querySelector('.hero__eyebrow');
    const title = hero.querySelector('h1');
    const lead = hero.querySelector('.hero__lead');
    const buttons = hero.querySelectorAll('.hero__actions .md-button');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (eyebrow) {
      tl.fromTo(eyebrow,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.1
      );
    }

    if (title) {
      tl.fromTo(title,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.2
      );
    }

    if (lead) {
      tl.fromTo(lead,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.35
      );
    }

    if (buttons.length) {
      tl.fromTo(buttons,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        0.5
      );
    }
  }
  function initScrollAnimations() {
    // Focus strip
    const focusItems = document.querySelectorAll('.focus-item');
    if (focusItems.length) {
      gsap.fromTo(focusItems,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.focus-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Featured cards
    const cards = document.querySelectorAll('.card-grid .card');
    if (cards.length) {
      gsap.fromTo(cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.card-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Category tiles
    const tiles = document.querySelectorAll('.category-grid .category-tile');
    if (tiles.length) {
      gsap.fromTo(tiles,
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.category-grid',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // GitHub stats row
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) {
      gsap.fromTo(statsRow,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRow,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }
  function initHoverAnimations() {
    const interactiveCards = document.querySelectorAll('.card, .category-tile, .gh-grid a');

    interactiveCards.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(el, {
          y: el.classList.contains('category-tile') ? -2 : -4,
          duration: 0.25,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          y: 0,
          duration: 0.35,
          ease: 'power2.out',
        });
      });
    });
  }
  function initNavEffects() {
    const header = document.querySelector('.md-header');
    if (!header) return;

    const scrollThreshold = 60;
    let ticking = false;

    function updateHeader() {
      const scrolled = window.scrollY > scrollThreshold;
      header.classList.toggle('is-scrolled', scrolled);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateHeader();
  }
  function initThemeToggleAnimation() {
    const paletteForm = document.querySelector('.md-header__option');
    if (!paletteForm) return;

    const buttons = paletteForm.querySelectorAll('.md-header__button');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const icon = btn.querySelector('.md-icon, svg, .twemoji');
        if (icon) {
          gsap.fromTo(icon,
            { rotation: 0, scale: 1 },
            { rotation: 180, scale: 1.15, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 }
          );
        }

        document.documentElement.classList.add('theme-transitioning');
        window.setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning');
        }, 350);
      });
    });
  }
  function initBackToTopAnimation() {
    const topButton = document.querySelector('.md-top');
    if (!topButton) return;

    gsap.set(topButton, { scale: 0.8, opacity: 0 });

    const observer = new MutationObserver(() => {
      const isHidden = topButton.hasAttribute('hidden') || topButton.getAttribute('aria-hidden') === 'true';
      gsap.to(topButton, {
        scale: isHidden ? 0.8 : 1,
        opacity: isHidden ? 0 : 1,
        duration: 0.25,
        ease: 'power2.out',
      });
    });

    observer.observe(topButton, { attributes: true, attributeFilter: ['hidden', 'aria-hidden'] });

    topButton.addEventListener('mouseenter', () => {
      gsap.to(topButton, { y: -2, duration: 0.2, ease: 'power2.out' });
    });
    topButton.addEventListener('mouseleave', () => {
      gsap.to(topButton, { y: 0, duration: 0.2, ease: 'power2.out' });
    });
  }

  function initSidebarAnimations() {
    const activeLinks = document.querySelectorAll('.md-nav__link--active');
    activeLinks.forEach((link) => {
      gsap.fromTo(link,
        { '--indicator-height': '0%' },
        { '--indicator-height': '100%', duration: 0.25, ease: 'power2.out' }
      );
    });
  }

  whenReady(initAnimations);
})();
