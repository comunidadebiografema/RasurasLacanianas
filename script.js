/* ═══════════════════════════════════════════════
   PSICANÁLISE & LITERATURA — Landing Page JS
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar scroll ─────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ─── Scroll Reveal ─────────────────────────── */
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ─── Hero elementos visíveis imediatamente ─── */
  // Os elementos do hero recebem visibilidade com delay escalonado
  const heroElements = document.querySelectorAll('.hero__content [data-reveal]');
  setTimeout(() => {
    heroElements.forEach(el => el.classList.add('visible'));
  }, 100);


  /* ─── FAQ Accordion ─────────────────────────── */
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Fecha todos
      faqItems.forEach(i => i.classList.remove('open'));

      // Abre o clicado (se não estava aberto)
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });


  /* ─── Smooth scroll para âncoras ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // altura da navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─── Contador regressivo até 04 de maio ────── */
  const targetDate = new Date('2025-05-04T23:59:59');

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (countdownEl) countdownEl.textContent = 'Inscrições encerradas';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');
    return { days, hours, minutes, seconds, pad };
  }

  // Injeta countdown no pricing card
  const pricingCard = document.querySelector('.pricing__card');
  if (pricingCard) {
    const countdownWrapper = document.createElement('div');
    countdownWrapper.className = 'countdown';
    countdownWrapper.innerHTML = `
      <div class="countdown__label">Inscrições encerram em:</div>
      <div class="countdown__units">
        <div class="countdown__unit">
          <span class="countdown__number" id="cd-days">--</span>
          <span class="countdown__text">dias</span>
        </div>
        <div class="countdown__sep">:</div>
        <div class="countdown__unit">
          <span class="countdown__number" id="cd-hours">--</span>
          <span class="countdown__text">horas</span>
        </div>
        <div class="countdown__sep">:</div>
        <div class="countdown__unit">
          <span class="countdown__number" id="cd-min">--</span>
          <span class="countdown__text">min</span>
        </div>
        <div class="countdown__sep">:</div>
        <div class="countdown__unit">
          <span class="countdown__number" id="cd-sec">--</span>
          <span class="countdown__text">seg</span>
        </div>
      </div>
    `;

    const urgencyEl = pricingCard.querySelector('.pricing__urgency');
    if (urgencyEl) {
      pricingCard.insertBefore(countdownWrapper, urgencyEl);
    } else {
      pricingCard.appendChild(countdownWrapper);
    }

    function tick() {
      const data = updateCountdown();
      if (!data) return;
      document.getElementById('cd-days').textContent  = data.days;
      document.getElementById('cd-hours').textContent = data.pad(data.hours);
      document.getElementById('cd-min').textContent   = data.pad(data.minutes);
      document.getElementById('cd-sec').textContent   = data.pad(data.seconds);
    }

    tick();
    setInterval(tick, 1000);
  }


  /* ─── CTA pulse animation trigger ──────────── */
  const ctaMain = document.getElementById('cta-main');
  if (ctaMain) {
    setInterval(() => {
      ctaMain.classList.add('pulse');
      setTimeout(() => ctaMain.classList.remove('pulse'), 600);
    }, 4000);
  }


  /* ─── Parallax sutil no hero ────────────────── */
  const heroContent = document.querySelector('.hero__content');
  const heroBg = document.querySelector('.hero__bg-overlay');

  if (heroContent && heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.12}px)`;
        heroBg.style.transform = `translateY(${scrolled * 0.06}px)`;
      }
    }, { passive: true });
  }


  /* ─── Active section highlight na nav ───────── */
  const sections = document.querySelectorAll('section[id]');
  const navCta = document.querySelector('.nav__cta');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id === 'inscricao') {
        if (navCta) {
          navCta.style.background = 'var(--amber)';
          navCta.style.color = 'var(--dark)';
        }
      } else if (navCta && entry.target.id === 'inscricao') {
        navCta.style.background = '';
        navCta.style.color = '';
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));

});


/* ═══════════════════════════════════════════════
   CSS DINÂMICO — Countdown styles + pulse
═══════════════════════════════════════════════ */
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
  /* Countdown */
  .countdown {
    margin-bottom: 28px;
    padding: 28px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(232,145,58,0.2);
    border-radius: 4px;
    text-align: center;
  }
  .countdown__label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #9A7A54;
    margin-bottom: 16px;
  }
  .countdown__units {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  .countdown__unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 70px;
  }
  .countdown__number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px;
    letter-spacing: 2px;
    line-height: 1;
    color: #E8913A;
  }
  .countdown__text {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #9A7A54;
  }
  .countdown__sep {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 40px;
    color: rgba(232,145,58,0.35);
    margin-bottom: 18px;
  }

  /* Pulse CTA */
  @keyframes ctaPulse {
    0% { box-shadow: 0 8px 32px rgba(232,145,58,0.35); }
    50% { box-shadow: 0 8px 60px rgba(232,145,58,0.7), 0 0 0 8px rgba(232,145,58,0.1); }
    100% { box-shadow: 0 8px 32px rgba(232,145,58,0.35); }
  }
  .btn--primary.pulse {
    animation: ctaPulse 0.6s ease-in-out;
  }

  /* Mobile countdown */
  @media (max-width: 480px) {
    .countdown__number { font-size: 38px; }
    .countdown__unit { min-width: 54px; }
  }
`;
document.head.appendChild(dynamicStyles);
