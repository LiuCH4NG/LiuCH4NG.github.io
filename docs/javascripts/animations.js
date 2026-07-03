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

  function initPageLoadAnimations() {}
  function initScrollAnimations() {}
  function initHoverAnimations() {}
  function initNavEffects() {}
  function initThemeToggleAnimation() {}
  function initBackToTopAnimation() {}
  function initSidebarAnimations() {}

  whenReady(initAnimations);
})();
