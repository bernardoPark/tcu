/* =========================================================
   THE CLUB UNDERCRAFT — behaviour
   Progressive enhancement only: the page is complete
   without any of this running.
   ========================================================= */
(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Header state ---------------------------------- */
  const header = document.querySelector('[data-header]');
  if (header) {
    const setStuck = () => header.classList.toggle('is-stuck', window.scrollY > 40);
    setStuck();
    window.addEventListener('scroll', setStuck, { passive: true });
  }

  /* ---- 2. Mobile navigation ----------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---- 3. Scroll reveal --------------------------------- */
  const revealables = document.querySelectorAll('[data-reveal]');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${(i % 4) * 70}ms`);
      io.observe(el);
    });
  }

  /* ---- 4. Hero parallax --------------------------------- */
  const heroMedia = document.querySelector('.hero__media video, .hero__media img');

  /* a moving picture is motion too — hold it still when asked */
  if (reduced && heroMedia && heroMedia.tagName === 'VIDEO') {
    heroMedia.removeAttribute('autoplay');
    heroMedia.pause();
  }

  if (heroMedia && !reduced) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight) * 0.18;
        heroMedia.style.translate = `0 ${y}px`;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

/* =========================================================
   NEWS — EVENTS / EDITORIAL tabs
   Progressive enhancement: without JS both panels are in the
   markup and the browser simply shows the first.
   ========================================================= */
(() => {
  'use strict';
  const list = document.querySelector('.nw-tabs[role="tablist"]');
  if (!list) return;

  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const panelFor = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

  const select = (tab, focus = true) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.classList.toggle('is-current', on);
      t.tabIndex = on ? 0 : -1;
      const panel = panelFor(t);
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  };

  list.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab, false);
  });

  list.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let next = null;
    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (next) { e.preventDefault(); select(next); }
  });
})();

/* =========================================================
   HERO VIDEO — keep it running
   Autoplay can be refused (data saver, low power mode) or the
   browser pauses it when the tab is hidden. Nudge it back.
   =========================================================  */
(() => {
  'use strict';
  const video = document.querySelector('.hero__video');
  if (!video) return;

  const nudge = () => {
    if (document.hidden || !video.paused) return;
    const attempt = video.play();
    if (attempt) attempt.catch(() => { /* blocked — the poster stands in */ });
  };

  video.addEventListener('loadeddata', nudge);
  document.addEventListener('visibilitychange', nudge);
  nudge();
})();

/* =========================================================
   MEMBERSHIP APPLICATION — modal
   Native <dialog>: focus stays inside, Esc closes, the page
   behind is inert. A click on the dimmed backdrop closes too.
   =========================================================  */
(() => {
  'use strict';
  const dialog = document.getElementById('apply');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const scroller = dialog.querySelector('.apply__scroll');
  const form = dialog.querySelector('[data-apply-form]');
  const done = dialog.querySelector('[data-apply-done]');

  document.querySelectorAll('[data-apply-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // a form that was already sent starts over clean
      if (form.hidden) {
        form.reset();
        form.hidden = false;
        done.hidden = true;
      }
      scroller.scrollTop = 0;
      dialog.showModal();
      dialog.querySelector('#apply-name').focus({ preventScroll: true });
    });
  });

  dialog.querySelectorAll('[data-apply-close]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });

  // the dialog box itself is only hit outside its content — i.e. the backdrop
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  // Application numbers. Nothing reaches a server yet, so this device keeps
  // its own count — on the exhibition iMac they still go up in order.
  // Once a form service is connected, use the number it hands back instead.
  const FIRST_NUMBER = 417;
  const nextNumber = () => {
    let n = FIRST_NUMBER;
    try {
      const last = parseInt(localStorage.getItem('tcu-application-no'), 10);
      if (last >= FIRST_NUMBER) n = last + 1;
      localStorage.setItem('tcu-application-no', String(n));
    } catch (err) { /* storage blocked — the first number stands */ }
    return String(n).padStart(4, '0');
  };

  const pad = (n) => String(n).padStart(2, '0');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: send new FormData(form) to the form service here.

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const today = new Date();

    done.querySelector('[data-receipt-no]').textContent = nextNumber();
    done.querySelector('[data-receipt-date]').textContent =
      today.getFullYear() + '.' + pad(today.getMonth() + 1) + '.' + pad(today.getDate());
    done.querySelector('[data-receipt-name]').textContent = name || '—';
    done.querySelector('[data-receipt-note]').textContent = email
      ? '심사 결과는 완료되는 대로 ' + email + '(으)로 안내해 드립니다.'
      : '심사 결과는 완료되는 대로 안내해 드립니다.';

    form.hidden = true;
    done.hidden = false;
    scroller.scrollTop = 0;
    done.querySelector('.apply__submit').focus({ preventScroll: true });
  });
})();
