const navLinks = document.querySelectorAll('.nav-link');
const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const projectGrid = document.getElementById('project-grid');
const filterRow = document.getElementById('filter-row');
const techGrid = document.getElementById('tech-grid');
const certificateList = document.getElementById('certificate-list');
const statRow = document.getElementById('stat-row');
const focusRow = document.getElementById('focus-row');

const createTag = (label) => {
  const span = document.createElement('span');
  span.className = 'pill subtle';
  span.textContent = label;
  return span;
};

const renderStats = () => {
  stats.forEach(({ label, value }) => {
    const stat = document.createElement('div');
    stat.className = 'stat';
    stat.innerHTML = `<p class="stat-value">${value}</p><p class="stat-label">${label}</p>`;
    statRow.appendChild(stat);
  });
};

const renderFocus = () => {
  focusAreas.forEach((item) => focusRow.appendChild(createTag(item)));
};

const renderFilters = () => {
  filters.forEach((filter, index) => {
    const button = document.createElement('button');
    button.className = `chip ${index === 0 ? 'active' : ''}`;
    button.dataset.filter = filter;
    button.textContent = filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1);
    filterRow.appendChild(button);
  });
};

const createProjectCard = (project) => {
  const { title, description, image, live, repo, tech } = project;
  const card = document.createElement('article');
  card.className = 'project-card reveal';
  card.innerHTML = `
    <div class="project-media">
      <img src="${image}" alt="${title} screenshot">
      <div class="project-overlay">
        <a class="ghost-button" href="${live}" target="_blank" rel="noreferrer">Live</a>
        <a class="ghost-button" href="${repo}" target="_blank" rel="noreferrer">Code</a>
      </div>
    </div>
    <div class="project-content">
      <div class="project-top">
        <h3>${title}</h3>
        <div class="tech-pills">${tech.map((t) => `<span class="pill subtle">${t}</span>`).join('')}</div>
      </div>
      <p class="project-description">${description}</p>
      <div class="project-links">
        <a class="link" href="${live}" target="_blank" rel="noreferrer">View live</a>
        <a class="link" href="${repo}" target="_blank" rel="noreferrer">Repository</a>
      </div>
    </div>
  `;
  return card;
};

const renderProjects = (filter = 'all') => {
  projectGrid.innerHTML = '';
  const filtered = projects.filter((project) => (filter === 'all' ? true : project.tags.includes(filter)));
  filtered.forEach((project) => projectGrid.appendChild(createProjectCard(project)));
  observeReveal();
};

const createTechCard = ({ name, icon, level }) => {
  const card = document.createElement('article');
  card.className = 'tech-card reveal';
  card.innerHTML = `
    <div class="tech-icon-wrap">
      <img src="${icon}" alt="${name} icon" />
    </div>
    <div>
      <h3>${name}</h3>
      <p>${level}</p>
    </div>
  `;
  return card;
};

const renderTech = () => {
  techStack.forEach((tech) => techGrid.appendChild(createTechCard(tech)));
  observeReveal();
};

const createCertificate = ({ title, description, link }) => {
  const card = document.createElement('article');
  card.className = 'certificate-card reveal';
  card.innerHTML = `
    <div>
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
    <a class="ghost-button" href="${link}" target="_blank" rel="noreferrer">View</a>
  `;
  return card;
};

const renderCertificates = () => {
  certificates.forEach((item) => certificateList.appendChild(createCertificate(item)));
  observeReveal();
};

const handleFilterClick = (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const filter = button.dataset.filter;
  filterRow.querySelectorAll('button').forEach((btn) => btn.classList.toggle('active', btn === button));
  renderProjects(filter);
};

const handleNavHighlight = () => {
  const scrollPos = window.scrollY + 140;
  document.querySelectorAll('section').forEach((section) => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
      navLinks.forEach((lnk) => lnk.classList.remove('active'));
      link?.classList.add('active');
    }
  });
};

const toggleNav = () => {
  nav.classList.toggle('open');
  hamburger.classList.toggle('open');
};

const setupNav = () => {
  hamburger.addEventListener('click', toggleNav);
  navLinks.forEach((link) =>
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
    }),
  );
  document.addEventListener('scroll', handleNavHighlight);
};

let revealObserver;
const observeReveal = () => {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
};

const init = () => {
  renderStats();
  renderFocus();
  renderFilters();
  renderProjects();
  renderTech();
  renderCertificates();
  setupNav();
  filterRow.addEventListener('click', handleFilterClick);
  observeReveal();
};

document.addEventListener('DOMContentLoaded', init);
