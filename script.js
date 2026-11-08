// Resolve carousel assets beside this script, including the optional WordPress plugin URL.
const sarasinAssetBase = new URL('assets/', document.currentScript?.src || window.location.href);
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const menuBackdrop = document.querySelector('.menu-backdrop');
const siteHeader = document.querySelector('.site-header');
const menuBackground = [...document.querySelectorAll('main, .site-footer, .announcement')];

// Keep secondary detail available on demand on phones, expanded on desktop.
const compactReading = window.matchMedia('(max-width: 800px)');
const readingDetails = [...document.querySelectorAll('[data-mobile-disclosure]')];
function adaptReadingDetails() {
  readingDetails.forEach((details) => { details.open = !compactReading.matches; });
}
adaptReadingDetails();
compactReading.addEventListener('change', adaptReadingDetails);

// Review-checklist links must reveal their destination even inside a closed disclosure.
function revealHashTarget() {
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
  }
  if (location.hash.startsWith('#source-')) requestAnimationFrame(() => target.scrollIntoView());
}
revealHashTarget();
window.addEventListener('hashchange', revealHashTarget);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    for (let parent = target?.parentElement; parent; parent = parent.parentElement) {
      if (parent instanceof HTMLDetailsElement) parent.open = true;
    }
  });
});

function setMobileMenu(isOpen, restoreFocus = false) {
  if (!menuToggle || !mobileMenu || !menuBackdrop) return;
  const open = isOpen && compactReading.matches;
  const root = document.documentElement;
  if (open) {
    root.style.setProperty('--menu-scrollbar-gap', `${window.innerWidth - root.clientWidth}px`);
    root.style.setProperty('--mobile-menu-top', `${siteHeader.getBoundingClientRect().bottom}px`);
  }
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Sluit menu' : 'Open menu');
  mobileMenu.hidden = !open;
  menuBackdrop.hidden = !open;
  root.classList.toggle('menu-open', open);
  menuBackground.forEach((element) => { element.inert = open; });
  if (!open) {
    root.style.removeProperty('--menu-scrollbar-gap');
    root.style.removeProperty('--mobile-menu-top');
    if (restoreFocus && compactReading.matches) menuToggle.focus({ preventScroll: true });
  }
}

menuToggle?.addEventListener('click', () => setMobileMenu(mobileMenu.hidden));
menuBackdrop?.addEventListener('click', () => setMobileMenu(false, true));
mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMobileMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (!mobileMenu || mobileMenu.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    setMobileMenu(false, true);
  } else if (event.key === 'Tab') {
    const lastLink = mobileMenu.querySelector('a:last-child');
    if (event.shiftKey && document.activeElement === menuToggle) {
      event.preventDefault();
      lastLink?.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      menuToggle.focus();
    }
  }
});

compactReading.addEventListener('change', (event) => {
  if (!event.matches) setMobileMenu(false);
});
window.addEventListener('resize', () => {
  if (mobileMenu && !mobileMenu.hidden) {
    document.documentElement.style.setProperty('--mobile-menu-top', `${siteHeader.getBoundingClientRect().bottom}px`);
  }
});

const dialog = document.querySelector('#video-dialog');
const frame = dialog?.querySelector('.video-frame');

document.querySelectorAll('[data-video]').forEach((button) => {
  button.addEventListener('click', () => {
    const id = button.getAttribute('data-video');
    if (!/^[\w-]{11}$/.test(id)) return;
    frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" title="Sarasin Clinic video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    dialog.showModal();
  });
});

dialog?.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog?.addEventListener('close', () => { frame.innerHTML = ''; });

const heroCarousel = document.querySelector('.hero-image');
if (heroCarousel) {
  const results = [
    {
      src: 'assets/real-result.jpg',
      alt: 'Voor en na Hairfiller bij een persoon met dunner wordend haar; twee opnamen van de hoofdhuid naast elkaar',
      after: 'Na 3 sessies',
      caption: 'Echt resultaat van Sarasin Clinic · na 4 maanden. Resultaten verschillen.'
    },
    {
      src: 'assets/result-man-5.jpg',
      alt: 'Voor- en nafoto van de kruin van een Sarasin Clinic patiënt na vijf Hairfiller sessies',
      after: 'Na 5 sessies',
      caption: 'Echt patiëntbeeld van Sarasin Clinic · na 5 sessies. Resultaten verschillen.'
    },
    {
      src: 'assets/result-woman.jpg',
      alt: 'Voor- en nafoto van de haarlijn van een Sarasin Clinic patiënt na een Hairfiller traject',
      after: 'Na behandeling',
      caption: 'Echt patiëntbeeld van Sarasin Clinic. Resultaten verschillen per persoon.'
    }
  ];
  const image = heroCarousel.querySelector('.hero-result');
  const afterTag = heroCarousel.querySelector('.comparison-after');
  const caption = heroCarousel.querySelector('.image-label');
  const dots = [...heroCarousel.querySelectorAll('.hero-carousel-dot')];
  const pauseButton = heroCarousel.querySelector('.hero-carousel-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reducedMotion.matches;
  let timer;

  results.slice(1).forEach(({ src }) => { const preload = new Image(); preload.src = new URL(src.replace(/^assets\//, ''), sarasinAssetBase).href; });

  function showResult(index) {
    current = index;
    const result = results[current];
    image.src = new URL(result.src.replace(/^assets\//, ''), sarasinAssetBase).href;
    image.alt = result.alt;
    afterTag.textContent = result.after;
    caption.textContent = result.caption;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
      if (dotIndex === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function startCarousel() {
    clearInterval(timer);
    if (!paused && !document.hidden) {
      timer = setInterval(() => showResult((current + 1) % results.length), 2000);
    }
  }

  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showResult(index);
    startCarousel();
  }));
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Hervat de diavoorstelling' : 'Pauzeer de diavoorstelling');
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
    startCarousel();
  });
  document.addEventListener('visibilitychange', startCarousel);
  reducedMotion.addEventListener('change', (event) => {
    paused = event.matches;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Hervat de diavoorstelling' : 'Pauzeer de diavoorstelling');
    pauseButton.textContent = paused ? '▶' : 'Ⅱ';
    startCarousel();
  });
  if (paused) {
    pauseButton.setAttribute('aria-pressed', 'true');
    pauseButton.setAttribute('aria-label', 'Hervat de diavoorstelling');
    pauseButton.textContent = '▶';
  }
  startCarousel();
}
