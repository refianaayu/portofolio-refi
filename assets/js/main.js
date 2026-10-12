/**
 * REFIANA AYU KHARISMA - PORTFOLIO INTERACTIVITY
 * Features: Dark/Light Mode, Interactive Modals, Smooth Scroll, 
 * Animated Counters, Progress Bars, Interactive Toast, Clipboard Copy.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initCounters();
  initSkillBars();
  initModals();
  initClipboardAndContact();
  initMouseGlow();
});

/* 1. Theme Toggle (Pink Dark / Soft Blossom Light) */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('refiana-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('refiana-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Rose Obsidian (Dark)' : 'Blossom Glow (Light)'} mode`);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fas fa-moon';
      themeIcon.title = 'Switch to Dark Mode';
    } else {
      themeIcon.className = 'fas fa-sun';
      themeIcon.title = 'Switch to Light Mode';
    }
  }
}

/* 2. Navigation & Sticky Scroll */
function initNavigation() {
  const navbar = document.getElementById('mainNavbar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll To Top button visibility
    if (scrollTopBtn) {
      if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.pointerEvents = 'auto';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
      }
    }

    // Active link highlighting
    highlightActiveSection();
  });

  // Mobile Menu Toggle
  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = hamburgerBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu on link click
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // Scroll to Top
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const currentLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (currentLink && scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(link => link.classList.remove('active'));
        currentLink.classList.add('active');
      }
    });
  }
}

/* 3. Animated Stats Counters */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  function runCountersAnimation() {
    if (hasAnimated) return;
    hasAnimated = true;
    statNumbers.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1800;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = easeProgress * target;

        if (isDecimal) {
          counter.textContent = currentVal.toFixed(2) + suffix;
        } else {
          counter.textContent = Math.floor(currentVal) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (isDecimal) {
            counter.textContent = target.toFixed(2) + suffix;
          } else {
            counter.textContent = target + suffix;
          }
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const statsSection = document.getElementById('statsSection');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCountersAnimation();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(statsSection);
  } else {
    runCountersAnimation();
  }

  // Fallback trigger
  setTimeout(() => {
    if (!hasAnimated) runCountersAnimation();
  }, 1200);
}

/* 4. Skill Progress Bars Animation */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress-fill');
  const skillsSection = document.getElementById('skills');

  if (!skillsSection || skillBars.length === 0) return;

  function fillBars() {
    skillBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth;
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fillBars();
        }
      });
    }, { threshold: 0.1 });
    observer.observe(skillsSection);
  } else {
    fillBars();
  }

  setTimeout(fillBars, 2500);
}

/* 5. Certificate & Resume Modals Data & Triggers */
const certificateData = {
  tpr: {
    title: "Certificate of Employment",
    company: "PT TPR INDONESIA",
    recipient: "Refiana Ayu Kharisma",
    period: "August 2023 - August 2026 (3 Years 1 Month)",
    role: "Production Administration Staff",
    description: "This document certifies that Refiana Ayu Kharisma has served with distinguished dedication and professionalism as a Production Administration Staff at PT TPR Indonesia. She demonstrated outstanding precision in managing production data, defect tracking, coordinating operations with Quality Control, Logistics, and Finance departments, and maintaining overtime & attendance administration.",
    verifier: "Human Resources Department & Operations Division",
    seal: "TPR VERIFIED"
  },
  yamaha: {
    title: "Certificate of Employment",
    company: "PT YAMAHA MUSIC MANUFACTURING ASIA",
    recipient: "Refiana Ayu Kharisma",
    period: "April 2021 - July 2023 (2 Years 4 Months)",
    role: "Warehouse Operator - Material Control (Electrical Parts)",
    description: "This document certifies that Refiana Ayu Kharisma has fulfilled her duties with high discipline and excellence in manufacturing operations and material control. She was responsible for production material preparation, incoming QA inspection, rigorous FIFO storage methodology, and systematic inventory control via SAP System.",
    verifier: "Human Resources & Material Control Management",
    seal: "YAMAHA VERIFIED"
  },
  upb: {
    title: "Academic Honor & Leadership Statement",
    company: "UNIVERSITAS PELITA BANGSA",
    recipient: "Refiana Ayu Kharisma",
    period: "September 2022 - July 2026",
    role: "Bachelor of Industrial Engineering (GPA 3.75 / 4.00)",
    description: "Recognized for exceptional academic achievement (GPA 3.75/4.00, Cum Laude standing) in the Industrial Engineering Department. Actively served as Industrial Engineering Laboratory Assistant, Class Representative (J222B), Master of Ceremonies for Industry Seminars & HMTI Debates, and Secretary of Mahakrenov Organization.",
    verifier: "Faculty of Engineering & Student Affairs",
    seal: "UPB HONORS"
  }
};

function initModals() {
  const modalOverlay = document.getElementById('certModalOverlay');
  const resumeModalOverlay = document.getElementById('resumeModalOverlay');
  const closeCertBtn = document.getElementById('closeCertModal');
  const closeResumeBtn = document.getElementById('closeResumeModal');

  // Certificate Open Triggers
  document.querySelectorAll('.open-cert-btn').forEach(button => {
    button.addEventListener('click', () => {
      const certKey = button.getAttribute('data-cert');
      const data = certificateData[certKey];
      if (data && modalOverlay) {
        document.getElementById('modalCertCompany').textContent = data.company;
        document.getElementById('modalCertRole').textContent = data.role;
        document.getElementById('modalCertRecipient').textContent = data.recipient;
        document.getElementById('modalCertPeriod').textContent = data.period;
        document.getElementById('modalCertDesc').textContent = data.description;
        document.getElementById('modalCertVerifier').textContent = data.verifier;
        document.getElementById('modalCertSealText').textContent = data.seal;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Resume Open Triggers
  document.querySelectorAll('.open-resume-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (resumeModalOverlay) {
        resumeModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close handlers
  if (closeCertBtn && modalOverlay) {
    closeCertBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (closeResumeBtn && resumeModalOverlay) {
    closeResumeBtn.addEventListener('click', () => {
      resumeModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Click outside to close
  window.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    if (e.target === resumeModalOverlay) {
      resumeModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Print CV button
  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* 6. Clipboard Copy & Contact Form */
function initClipboardAndContact() {
  // Copy buttons
  document.querySelectorAll('.copy-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Selected text: ${textToCopy}`);
        });
      }
    });
  });

  // Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const subject = document.getElementById('formSubject').value;
      const message = document.getElementById('formMessage').value;

      // Prepare mailto link or notification
      const mailtoUrl = `mailto:refiayukharisma@gmail.com?subject=${encodeURIComponent(subject || 'Inquiry from Portfolio')}&body=${encodeURIComponent(`Hi Refiana,\n\nMy name is ${name} (${email}).\n\n${message}`)}`;
      
      showToast('Redirecting to your email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 700);
    });
  }
}

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: #ff2d75;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* 7. Mouse Gradient Aura / Follower */
function initMouseGlow() {
  const mouseGlow = document.createElement('div');
  mouseGlow.className = 'ambient-glow';
  mouseGlow.style.width = '350px';
  mouseGlow.style.height = '350px';
  mouseGlow.style.background = 'radial-gradient(circle, rgba(255, 45, 117, 0.15) 0%, rgba(255, 94, 152, 0.04) 50%, transparent 70%)';
  mouseGlow.style.position = 'fixed';
  mouseGlow.style.pointerEvents = 'none';
  mouseGlow.style.zIndex = '0';
  mouseGlow.style.transform = 'translate(-50%, -50%)';
  mouseGlow.style.transition = 'opacity 0.3s ease';
  document.body.appendChild(mouseGlow);

  window.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = `${e.clientX}px`;
    mouseGlow.style.top = `${e.clientY}px`;
  });
}
