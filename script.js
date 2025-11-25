const tabButtons = document.querySelectorAll('.portfolio-button');
const tabContents = document.querySelectorAll('.tab-content');
const navLinks = document.querySelectorAll('.nav-item a');
const hamburger = document.querySelector('.hamburger');
const navItems = document.querySelector('.nav-items');

// Tab switching
if (tabButtons.length) {
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const tab = document.getElementById(btn.dataset.tab);
      tab?.classList.add('active');
    });
  });
}

// Reveal animations
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

// Mobile nav
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navItems?.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navItems?.classList.remove('open');
  });
});

// Active link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const setActiveNav = () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navLinks.forEach((link) => link.classList.remove('active'));
      const active = document.querySelector(`.nav-item a[href="#${section.id}"]`);
      active?.classList.add('active');
    }
  });
};

window.addEventListener('scroll', setActiveNav);
setActiveNav();
