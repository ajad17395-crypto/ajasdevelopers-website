/**
 * AJAS Developers - Official Website Script
 * Domain: https://ajasdevelopers.in
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
        navMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
      }
    });

    // Close menu when clicking a nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active Link Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // Copy Email Helper Functionality
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('supportEmailText');

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', async () => {
      try {
        const textToCopy = emailText.textContent.trim();
        await navigator.clipboard.writeText(textToCopy);
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
          <span>Copied!</span>
        `;
        copyBtn.style.color = '#34D399';
        
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.color = '';
        }, 2500);
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    });
  }

  // Auto update copyright year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // App Screenshots Manager (Uploads, Drag & Drop, Local Storage, Asset Fallbacks)
  const resetBtn = document.getElementById('resetScreenshotsBtn');

  const screenshotSlots = [1, 2, 3];

  function updateResetButtonVisibility() {
    let hasCustom = false;
    screenshotSlots.forEach(index => {
      if (localStorage.getItem(`ajas_app_screenshot_${index}`)) {
        hasCustom = true;
      }
    });
    if (resetBtn) {
      resetBtn.style.display = hasCustom ? 'inline-flex' : 'none';
    }
  }

  function setScreenshotImage(index, dataUrl) {
    const img = document.getElementById(`screenshotImg${index}`);
    const mock = document.getElementById(`screenshotMock${index}`);

    if (img) {
      img.src = dataUrl;
      img.style.display = 'block';
    }
    if (mock) {
      mock.style.display = 'none';
    }

    try {
      localStorage.setItem(`ajas_app_screenshot_${index}`, dataUrl);
    } catch (e) {
      console.warn('Could not save screenshot to localStorage:', e);
    }

    updateResetButtonVisibility();
  }

  screenshotSlots.forEach(index => {
    const fileInput = document.getElementById(`uploadInput${index}`);
    const device = document.getElementById(`deviceDrop${index}`);
    const img = document.getElementById(`screenshotImg${index}`);
    const mock = document.getElementById(`screenshotMock${index}`);

    // 1. Check LocalStorage first
    const saved = localStorage.getItem(`ajas_app_screenshot_${index}`);
    if (saved) {
      setScreenshotImage(index, saved);
    } else if (img) {
      // 2. Check if default assets image exists
      img.onload = () => {
        img.style.display = 'block';
        if (mock) mock.style.display = 'none';
      };
      img.onerror = () => {
        img.style.display = 'none';
        if (mock) mock.style.display = 'flex';
      };
    }

    // File Input change
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target && event.target.result) {
              setScreenshotImage(index, event.target.result);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Drag and drop handlers
    if (device) {
      ['dragenter', 'dragover'].forEach(eventName => {
        device.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          device.classList.add('drag-over');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        device.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          device.classList.remove('drag-over');
        }, false);
      });

      device.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt && dt.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target && event.target.result) {
                setScreenshotImage(index, event.target.result);
              }
            };
            reader.readAsDataURL(file);
          }
        }
      });
    }
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      screenshotSlots.forEach(index => {
        localStorage.removeItem(`ajas_app_screenshot_${index}`);
        const img = document.getElementById(`screenshotImg${index}`);
        const mock = document.getElementById(`screenshotMock${index}`);
        const fileInput = document.getElementById(`uploadInput${index}`);
        
        if (fileInput) fileInput.value = '';
        if (img) {
          img.src = `assets/screenshot${index}.png`;
          // Let error handler reset back to mock if file doesn't exist
          img.onerror = () => {
            img.style.display = 'none';
            if (mock) mock.style.display = 'flex';
          };
        }
      });
      resetBtn.style.display = 'none';
    });
  }
});
