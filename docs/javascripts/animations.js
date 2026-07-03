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
  function initScrollAnimations() {}
  function initHoverAnimations() {}
  function initNavEffects() {}
  function initThemeToggleAnimation() {}
  function initBackToTopAnimation() {}
  function initSidebarAnimations() {}

  whenReady(initAnimations);
})();
