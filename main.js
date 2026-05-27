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
          void card.offsetWidth; // Trigger reflow for restart animation
          card.style.animation = 'fadeUp 0.4s ease both';
          visible++;
        }
      });
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    });
  });

  // ── CONTACT FORM WITH FORMSPREE ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = contactForm.querySelector('.form-submit');
      const formData = new FormData(contactForm);
      
      // Disable button UI while transmitting
      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const response = await fetch('https://formspree.io/f/xaqkajdy', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success UI feedback animation
          btn.textContent = 'Message Sent ✓';
          btn.style.background = '#4a7c59';
          btn.style.color = '#e8e2d9';
          contactForm.reset();
        } else {
          const data = await response.json();
          throw new Error(data.errors ? data.errors.map(err => err.message).join(', ') : 'Submission failed');
        }
      } catch (error) {
        console.error('Formspree Error:', error);
        btn.textContent = 'Error sending message';
        btn.style.background = '#df4759'; // Fallback to danger red
        btn.style.color = '#ffffff';
      } finally {
        // Reset button interface back to default state after 3 seconds
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = 'Send Message';
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      }
    });
  }

  // ── INIT ──
  navigateTo('home');
});
