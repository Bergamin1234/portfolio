/**
 * ==========================================================================
 * ÍTALO BERGAMIN | PORTFÓLIO PROFISSIONAL
 * Vanilla JavaScript: Themes, Scroll Reveal, Dynamic Typing, Mobile Nav & UX
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME ENGINE (DARK / LIGHT MODE)
     ------------------------------------------------------------------------ */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  const STORAGE_KEY = 'italo_portfolio_theme';

  // Initialize theme: Check localStorage -> System Preference -> Default to 'dark'
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'dark'; // Dark theme default as requested
  };

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Update theme-color meta tag for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#070b14' : '#f8fafc');
    }
  };

  // Set initial theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  const toggleTheme = () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    if (typeof showToast === 'function') {
      showToast(`Tema alterado para: ${newTheme === 'dark' ? 'Modo Escuro 🌙' : 'Modo Claro ☀️'}`);
    }
  };

  // Toggle button event
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Keyboard shortcut: Alt + T to toggle theme
  window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Listen for system theme changes if user has no stored preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ------------------------------------------------------------------------
     2. DYNAMIC TYPING EFFECT (HERO SUBTITLE)
     ------------------------------------------------------------------------ */
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const phrases = [
      'Estudante de Sistemas de Informação',
      'Atuação em Banco de Dados & Sistemas Web',
      'Desenvolvimento com Python, HTML, CSS & JS',
      'Certificação Azure AI-900',
      'Acadêmico na Faculdade Unisapiens'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 80;
    const pauseEnd = 2000;
    const pauseStart = 500;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 40;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 80;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing phrase, pause before deleting
        isDeleting = true;
        typingDelay = pauseEnd;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingDelay = pauseStart;
      }

      setTimeout(typeLoop, typingDelay);
    };

    // Start typing loop
    setTimeout(typeLoop, 800);
  }

  /* ------------------------------------------------------------------------
     3. HEADER SCROLL & ACTIVE SECTION NAVIGATION TRACKER
     ------------------------------------------------------------------------ */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScrollEffects = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header blur and background opacity intensification
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active navigation link detection
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });

  /* ------------------------------------------------------------------------
     4. MOBILE MENU ACCESSIBILITY & DRAWER TOGGLE
     ------------------------------------------------------------------------ */
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggleBtn && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navMenu.classList.contains('active');
      mobileToggleBtn.classList.toggle('active', isOpen);
      navMenu.classList.toggle('active', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
      mobileToggleBtn.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    };

    mobileToggleBtn.addEventListener('click', () => toggleMenu());

    // Close when clicking nav items
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleMenu(false);
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileToggleBtn.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL (INTERSECTION OBSERVER) & SKILL BARS
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-fade');
  const skillProgressBars = document.querySelectorAll('.progress-fill');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // Skill Bars animation trigger
    const skillsSection = document.getElementById('habilidades');
    if (skillsSection) {
      const skillsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              skillProgressBars.forEach((bar) => bar.classList.add('animated'));
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      skillsObserver.observe(skillsSection);
    }
  } else {
    // Fallback for browsers without IntersectionObserver support
    revealElements.forEach((el) => el.classList.add('revealed'));
    skillProgressBars.forEach((bar) => bar.classList.add('animated'));
  }

  /* ------------------------------------------------------------------------
     6. BACK TO TOP BUTTON
     ------------------------------------------------------------------------ */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. CONTACT FORM VALIDATION & INTERACTIVE HANDLING
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Simple validation
      if (!name || !email || !subject || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Por favor, preencha todos os campos obrigatórios.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Por favor, insira um endereço de e-mail válido.';
        return;
      }

      // Success feedback
      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Muito obrigado, <strong>${name}</strong>! Abrindo seu e-mail para envio direto...`;

      // Construct mailto link
      const encodedSubject = encodeURIComponent(`[Portfólio] ${subject}`);
      const encodedBody = encodeURIComponent(`Olá Ítalo,\n\nMeu nome é ${name} (${email}).\n\nMensagem:\n${message}\n\nEnviado através do seu Portfólio.`);
      const mailtoUrl = `mailto:italobergamin321@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // Open mailto URL
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      // Reset form
      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------------
     8. CLIPBOARD COPY UTILITY & TOAST NOTIFICATION
     ------------------------------------------------------------------------ */
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message, icon = 'fa-circle-check') {
    if (!toast) return;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toast.classList.add('active');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }

  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('textarea');
          tempInput.value = textToCopy;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }
        showToast(`Copiado: ${textToCopy}`);
      } catch (err) {
        showToast('Não foi possível copiar automaticamente.', 'fa-circle-exclamation');
      }
    });
  });

  /* ------------------------------------------------------------------------
     9. CONSOLE GREETING FOR DEVELOPERS
     ------------------------------------------------------------------------ */
  console.log(
    '%c< Ítalo Bergamin />%c Portfólio Desenvolvido com Sucesso! 🚀\nTecnologias: HTML5 Semântico, CSS3 Moderno & Vanilla JavaScript.\nGitHub: https://github.com/Bergamin1234',
    'color: #38bdf8; font-weight: bold; font-size: 16px; background: #070b14; padding: 6px 12px; border-radius: 4px;',
    'color: #94a3b8; font-size: 13px;'
  );
});
