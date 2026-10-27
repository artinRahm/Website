/**
 * HomeLab Guide - Main JavaScript
 * Handles navigation, tabs, and interactive elements
 */

(function() {
  'use strict';

  // ========================================
  // DOM Elements
  // ========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const hardwarePanels = document.querySelectorAll('.hardware-panel');

  // ========================================
  // Mobile Navigation Toggle
  // ========================================
  function initMobileNav() {
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', function() {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        navToggle.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // ========================================
  // Hardware Tabs
  // ========================================
  function initHardwareTabs() {
    if (!tabButtons.length || !hardwarePanels.length) return;

    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.dataset.tab;

        // Update active button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Update active panel
        hardwarePanels.forEach(panel => {
          panel.classList.toggle('active', panel.id === tabId);
        });
      });

      // Keyboard navigation
      button.addEventListener('keydown', function(e) {
        let targetIndex;
        const currentIndex = Array.from(tabButtons).indexOf(this);

        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            targetIndex = (currentIndex + 1) % tabButtons.length;
            tabButtons[targetIndex].focus();
            tabButtons[targetIndex].click();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            targetIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
            tabButtons[targetIndex].focus();
            tabButtons[targetIndex].click();
            break;
          case 'Home':
            e.preventDefault();
            tabButtons[0].focus();
            tabButtons[0].click();
            break;
          case 'End':
            e.preventDefault();
            tabButtons[tabButtons.length - 1].focus();
            tabButtons[tabButtons.length - 1].click();
            break;
        }
      });
    });
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 64; // Header height
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL without scrolling
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  // ========================================
  // Active Nav Link on Scroll
  // ========================================
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a[href^="#"]');

    if (!sections.length || !navLinksList.length) return;

    const observerOptions = {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinksList.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  // ========================================
  // External Link Handling
  // ========================================
  function initExternalLinks() {
    document.querySelectorAll('a[rel="noopener"]').forEach(link => {
      link.setAttribute('target', '_blank');
    });
  }

  // ========================================
  // Initialize All
  // ========================================
  function init() {
    initMobileNav();
    initHardwareTabs();
    initSmoothScroll();
    initScrollSpy();
    initExternalLinks();

    // Add animation class to elements as they come into view
    const animatedElements = document.querySelectorAll('.guide-card, .service-card, .hardware-card, .network-card, .resource-category');
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${index * 100}ms`;
          entry.target.classList.add('animate-in');
          animationObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    animatedElements.forEach(el => animationObserver.observe(el));
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();