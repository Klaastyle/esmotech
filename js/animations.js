/**
 * animations.js - ESMOTECH Whimsy & Interactions
 * Subtle, professional B2B industrial micro-animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. SCROLL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const numberElements = document.querySelectorAll('.counter-value');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Counter animation if element has counter class
        if (entry.target.classList.contains('counter-value') && !entry.target.dataset.animated && !prefersReducedMotion) {
          animateCounter(entry.target);
          entry.target.dataset.animated = 'true';
        }
        
        // Optional: Stop observing once revealed for better performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
  numberElements.forEach(el => revealObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || 0);
    const duration = 2000;
    const isPercentage = el.dataset.suffix === '%';
    const start = performance.now();

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeProgress * target);
      
      el.textContent = current + (isPercentage ? '%' : '');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + (isPercentage ? '%' : '');
      }
    }
    requestAnimationFrame(update);
  }


  // 2. NAVBAR SCROLL & SCROLLSPY
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scrollspy
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href')?.includes(current)) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Close mega-menu on click outside (assuming a .mega-menu class exists)
  document.addEventListener('click', (e) => {
    const megaMenu = document.querySelector('.mega-menu');
    if (megaMenu && megaMenu.classList.contains('show') && !e.target.closest('.navbar')) {
      megaMenu.classList.remove('show');
    }
  });


  // 3. HERO PARALLAX & CURSOR
  const heroSection = document.querySelector('.hero-section');
  const customCursor = document.querySelector('.custom-cursor');
  const heroBg = document.querySelector('.hero-bg'); // Assuming an inner element for bg

  if (heroSection && !prefersReducedMotion) {
    // Parallax
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < heroSection.offsetHeight && heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    }, { passive: true });

    // Custom Cursor
    if (customCursor) {
      heroSection.addEventListener('mousemove', (e) => {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
      });
      heroSection.addEventListener('mouseenter', () => customCursor.style.opacity = '1');
      heroSection.addEventListener('mouseleave', () => customCursor.style.opacity = '0');
    }
  }


  // 4. PRODUCT CARDS (3D Tilt & Particles)
  const cards = document.querySelectorAll('.product-card');
  
  if (!prefersReducedMotion) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Tilt effect
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -5; // Max 5 deg
        const tiltY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Particles
        if (Math.random() > 0.9) { // Debounce particle creation slightly
          createParticle(card, x, y);
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  function createParticle(parent, x, y) {
    const particle = document.createElement('div');
    particle.className = 'gold-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    parent.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 1000);
  }


  // 5. BUTTONS (Ripple & Shimmer)
  const buttons = document.querySelectorAll('.btn-cta, .btn-ripple');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (prefersReducedMotion) return;
      
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });


  // 6. EASTER EGGS
  // Konami Code: Precision Mode
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex] || e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activatePrecisionMode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activatePrecisionMode() {
    let overlay = document.querySelector('.precision-mode-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'precision-mode-overlay';
      overlay.textContent = 'PRECISION MODE ACTIVATED';
      document.body.appendChild(overlay);
      
      setTimeout(() => {
        overlay.style.animation = 'none';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }, 5000);
    }
  }

  // Logo Spin (5 quick clicks)
  const logo = document.querySelector('.logo');
  let logoClicks = 0;
  let logoClickTimer;

  if (logo && !prefersReducedMotion) {
    logo.addEventListener('click', () => {
      logoClicks++;
      clearTimeout(logoClickTimer);
      
      if (logoClicks >= 5) {
        logo.classList.add('spin');
        logoClicks = 0;
        setTimeout(() => logo.classList.remove('spin'), 800);
      } else {
        logoClickTimer = setTimeout(() => { logoClicks = 0; }, 400);
      }
    });
  }


  // 7. CONTACT FORM VALIDATION
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const inputs = contactForm.querySelectorAll('.form-control');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    
    // Create typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = 'Escrivint<span>.</span><span>.</span><span>.</span>';
    contactForm.appendChild(typingIndicator);
    
    let typingTimeout;

    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('input', (e) => {
        // Show typing indicator
        typingIndicator.classList.add('active');
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          typingIndicator.classList.remove('active');
        }, 1000);

        // Basic validation logic
        if (input.checkValidity()) {
          input.classList.remove('invalid');
          input.classList.add('valid');
        } else {
          input.classList.remove('valid');
          input.classList.add('invalid');
        }
      });
    });

    // Form submit success animation
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // For demo purposes
      
      // Professional success checkmark
      submitBtn.innerHTML = '<span class="form-success-line success-active">Enviat Correctament</span>';
      submitBtn.classList.add('success');
      
      // Reset form after delay
      setTimeout(() => {
        contactForm.reset();
        inputs.forEach(i => i.classList.remove('valid', 'invalid'));
        submitBtn.innerHTML = 'Enviar';
        submitBtn.classList.remove('success');
      }, 3000);
    });
  }


  // 8. LOADING / PERFORMANCE (Lazy load & Smooth scroll)
  // Native smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      }
    });
  });

  // Lazy loading images
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback Intersection Observer for lazy loading
    const lazyImages = document.querySelectorAll('img.lazy');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => imageObserver.observe(img));
  }
});
