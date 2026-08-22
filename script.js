/**
 * AJAS Developers - Official Website Script
 * Domain: https://ajasdevelopers.in
 * Features: Dark Mode, Accessible Nav, Smooth Scroll, FAQs, Copy Email
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Dark Mode / Theme Toggle ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('ajas_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon('light');
  }

  // Listen for OS theme preference changes if user hasn't overridden
  try {
    prefersDarkScheme.addEventListener('change', (e) => {
      if (!localStorage.getItem('ajas_theme')) {
        const systemTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        updateThemeIcon(systemTheme);
      }
    });
  } catch (e) {
    // Fallback for older browsers
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ajas_theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  // --- Throttled Scroll Handling (Navbar & Nav Links) ---
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar state
        if (navbar) {
          if (scrollY > 15) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }

        // Active link highlight
        if (sections.length > 0 && navLinks.length > 0) {
          sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
              navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${sectionId}` || href === `index.html#${sectionId}`) {
                  link.classList.add('active');
                } else if (href.startsWith('#') || href.startsWith('index.html#')) {
                  link.classList.remove('active');
                }
              });
            }
          });
        }

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  function closeMobileMenu() {
    if (!navMenu || !mobileToggle) return;
    navMenu.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  function openMobileMenu() {
    if (!navMenu || !mobileToggle) return;
    navMenu.classList.add('is-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
        closeMobileMenu();
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });

    // Close menu when clicking a nav link
    const links = navMenu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // --- Copy Email Helper Functionality ---
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('supportEmailText');

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', async () => {
      const textToCopy = emailText.textContent.trim() || 'iajadpatel@gmail.com';
      let copied = false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
          copied = true;
        } else {
          // Fallback using temporary textarea
          const textArea = document.createElement('textarea');
          textArea.value = textToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          copied = document.execCommand('copy');
          textArea.remove();
        }
      } catch (err) {
        console.error('Failed to copy email:', err);
      }

      if (copied) {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          <span style="color: #10B981; font-weight: 700;">Email Copied!</span>
        `;
        copyBtn.setAttribute('aria-label', 'Email copied to clipboard');

        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.setAttribute('aria-label', 'Copy support email to clipboard');
        }, 2500);
      }
    });
  }

  // --- Support FAQs Accordion with Accessibility ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (item) {
        const isNowOpen = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isNowOpen ? 'true' : 'false');
      }
    });
  });

  // --- Auto-update copyright year ---
  const yearElements = document.querySelectorAll('#currentYear');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

  // --- Scroll Reveal Observer (Respecting Reduced Motion) ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animatableElements = document.querySelectorAll('.featured-app-spotlight, .app-card, .about-compact-card, .value-item, .legal-compact-bar, .support-compact-card, .about-hero-grid, .studio-brand-card, .developer-profile-card, .philosophy-card, .trust-card, .privacy-banner-card, .faq-item, .contact-card-main, .legal-card, .footer-col');

  if (prefersReducedMotion) {
    animatableElements.forEach(el => {
      el.classList.add('is-revealed');
    });
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -25px 0px'
    });

    animatableElements.forEach(el => {
      el.classList.add('reveal-item');
      revealObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver not supported
    animatableElements.forEach(el => {
      el.classList.add('is-revealed');
    });
  }
});
