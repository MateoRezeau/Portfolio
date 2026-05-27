document.addEventListener('DOMContentLoaded', () => {
  // ── NAVIGATION ──
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');
  const navMenuBtn = document.getElementById('navMenuBtn');
  const navLinksContainer = document.getElementById('navLinks');

  function navigateTo(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));
    
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    const activeLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    if (navLinksContainer) navLinksContainer.classList.remove('open');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => navigateTo(link.dataset.page));
  });

  if (navMenuBtn) {
    navMenuBtn.addEventListener('click', () => {
      if (navLinksContainer) navLinksContainer.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.goto));
  });

  // ── FILTER PROJECTS ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const noResults = document.querySelector('.no-results');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      let visible = 0;
      projectCards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? 'block' : 'none';
        if (match) {
          card.style.animationDelay = `${visible * 0.06}s`;
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'fadeUp 0.4s ease both';
          visible++;
        }
      });
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });
  });

  // ── RESUME UPLOAD ──
  const resumeInput = document.getElementById('resumeInput');
  const uploadStatus = document.getElementById('uploadStatus');
  const resumePreview = document.getElementById('resumePreview');
  const resumeFrame = document.getElementById('resumeFrame');
  const downloadBtn = document.getElementById('downloadBtn');
  const dropZone = document.getElementById('dropZone');

  let uploadedFileURL = null;

  function handleResumeFile(file) {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      uploadStatus.textContent = '✕ Only PDF files are accepted.';
      uploadStatus.style.color = 'var(--danger)';
      return;
    }
    uploadStatus.textContent = `✓ ${file.name} loaded successfully`;
    uploadStatus.style.color = 'var(--accent)';
    if (uploadedFileURL) URL.revokeObjectURL(uploadedFileURL);
    uploadedFileURL = URL.createObjectURL(file);
    resumeFrame.src = uploadedFileURL;
    resumePreview.style.display = 'block';
    downloadBtn.style.display = 'flex';
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = uploadedFileURL;
      a.download = file.name;
      a.click();
    };
  }

  if (resumeInput) {
    resumeInput.addEventListener('change', e => handleResumeFile(e.target.files[0]));
  }

  if (dropZone) {
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      handleResumeFile(e.dataTransfer.files[0]);
    });
  }

  // ── CONTACT FORM ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#4a7c59';
      btn.style.color = '#e8e2d9';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.style.color = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ── INIT ──
  navigateTo('home');
});
