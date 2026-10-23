'use strict';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUBMIT_DELAY_MS = 1200;
const AUTOPLAY_DELAY_MS = 5000;

function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || toggle.getAttribute('aria-expanded') !== 'true') return;
    setOpen(false);
    toggle.focus();
  });

  window.matchMedia('(min-width: 48rem)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  items.forEach((item) => observer.observe(item));
}

// Слайдер на нативном scroll-snap. Режим слайдера включается, только пока лента реально
// прокручивается: на мобильном преимущества и шаги — слайдеры, на широком экране — сетка,
// и тогда индикатор, ARIA-разметка слайдера и tabindex убираются.
function initCarousel(root) {
  const track = root.querySelector('[data-carousel-track]');
  const slides = [...track.children];
  const controls = root.querySelector('.carousel__controls');
  const dotsBox = root.querySelector('.carousel__dots');
  const label = root.dataset.carouselLabel;
  const autoplay = root.hasAttribute('data-carousel-autoplay');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let active = false;
  let index = 0;
  let positions = 0;
  let timer = 0;
  let interacting = false;
  let inView = false;

  const getMetrics = () => {
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap) || 0;
    const content = track.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
    const step = slides[0].getBoundingClientRect().width + gap;
    const visible = Math.max(1, Math.round((content + gap) / step));
    return { step, count: Math.max(1, slides.length - visible + 1) };
  };

  const renderDots = (count) => {
    positions = count;
    dotsBox.replaceChildren(
      ...Array.from({ length: count }, (_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', `Слайд ${i + 1} из ${count}`);
        dot.addEventListener('click', () => goTo(i));
        return dot;
      })
    );
  };

  const markActive = () => {
    [...dotsBox.children].forEach((dot, i) => {
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const goTo = (target, { smooth = true } = {}) => {
    const { step, count } = getMetrics();
    if (count !== positions) renderDots(count);
    index = autoplay ? (target + count) % count : Math.min(count - 1, Math.max(0, target));
    track.scrollTo({ left: index * step, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto' });
    markActive();
    schedule();
  };

  const shouldPlay = () => autoplay && active && !reducedMotion.matches && !interacting && inView && !document.hidden;

  function schedule() {
    clearTimeout(timer);
    if (!shouldPlay()) return;
    timer = setTimeout(() => goTo(index + 1), AUTOPLAY_DELAY_MS);
  }

  const syncFromScroll = () => {
    const { step, count } = getMetrics();
    if (count !== positions) renderDots(count);
    index = Math.min(count - 1, Math.max(0, Math.round(track.scrollLeft / step)));
    markActive();
  };

  const setMode = (on) => {
    if (on === active) return;
    active = on;
    controls.hidden = !on;
    if (on) {
      root.setAttribute('role', 'region');
      root.setAttribute('aria-roledescription', 'карусель');
      root.setAttribute('aria-label', label);
      track.tabIndex = 0;
      slides.forEach((slide, i) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'слайд');
        slide.setAttribute('aria-label', `${i + 1} из ${slides.length}`);
      });
      renderDots(getMetrics().count);
      markActive();
    } else {
      ['role', 'aria-roledescription', 'aria-label'].forEach((name) => {
        root.removeAttribute(name);
        slides.forEach((slide) => slide.removeAttribute(name));
      });
      track.removeAttribute('tabindex');
      index = 0;
    }
    schedule();
  };

  let scrollFrame = 0;
  track.addEventListener(
    'scroll',
    () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => active && syncFromScroll());
    },
    { passive: true }
  );

  track.addEventListener('keydown', (event) => {
    const moves = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: positions - 1 };
    if (!active || !(event.key in moves)) return;
    event.preventDefault();
    goTo(moves[event.key]);
  });

  if (autoplay) {
    const hold = () => {
      interacting = true;
      schedule();
    };
    const release = () => {
      interacting = false;
      schedule();
    };
    root.addEventListener('pointerenter', hold);
    root.addEventListener('pointerleave', release);
    root.addEventListener('focusin', hold);
    root.addEventListener('focusout', release);
    root.addEventListener('pointerdown', hold);
    root.addEventListener('pointercancel', release);

    const syncMotionPreference = () => {
      track.setAttribute('aria-live', reducedMotion.matches ? 'polite' : 'off');
      schedule();
    };
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', syncMotionPreference);
    syncMotionPreference();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          schedule();
        },
        { threshold: 0.4 }
      ).observe(root);
    } else {
      inView = true;
    }
  }

  new ResizeObserver(() => {
    setMode(track.scrollWidth > track.clientWidth + 1);
    if (active) goTo(index, { smooth: false });
  }).observe(track);
}

function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
}

// Заглушка запроса: бэкенда у лендинга нет. Для реальной подписки заменить тело
// этой функции на fetch к API — остальной код формы менять не придётся.
function subscribe() {
  return new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
}

function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  if (!form) return;

  const input = form.querySelector('.field__input');
  const field = form.querySelector('.field');
  const status = form.querySelector('.form__status');
  const statusText = status.querySelector('span');
  const statusIcon = status.querySelector('use');
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.querySelector('.btn__label');
  const idleLabel = buttonLabel.textContent;

  const showStatus = (kind, message) => {
    status.hidden = false;
    status.classList.toggle('is-error', kind === 'error');
    status.classList.toggle('is-success', kind === 'success');
    statusIcon.setAttribute('href', kind === 'error' ? '#i-alert' : '#i-check');
    statusText.textContent = message;
    field.classList.toggle('is-invalid', kind === 'error');
    field.classList.toggle('is-valid', kind === 'success');
    input.setAttribute('aria-invalid', String(kind === 'error'));
  };

  const clearStatus = () => {
    status.hidden = true;
    field.classList.remove('is-invalid', 'is-valid');
    input.removeAttribute('aria-invalid');
  };

  const validate = (value) => {
    if (!value) return 'Введите email, чтобы мы могли написать.';
    if (!value.includes('@')) return 'Проверьте адрес: не хватает «@».';
    if (!EMAIL_PATTERN.test(value)) return 'Проверьте адрес: после «@» нужен домен, например name@example.com.';
    return '';
  };

  const setLoading = (loading) => {
    button.classList.toggle('is-loading', loading);
    button.setAttribute('aria-busy', String(loading));
    buttonLabel.textContent = loading ? 'Отправляем…' : idleLabel;
  };

  input.addEventListener('input', clearStatus);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.classList.contains('is-loading')) return;

    const error = validate(input.value.trim());
    if (error) {
      showStatus('error', error);
      input.focus();
      return;
    }

    clearStatus();
    setLoading(true);
    await subscribe(input.value.trim());
    setLoading(false);
    form.reset();
    showStatus('success', 'Готово! Напишем, когда откроем партию №08.');
  });
}

initNav();
initReveal();
initCarousels();
initSubscribeForm();
