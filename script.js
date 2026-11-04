const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');

// Keep secondary detail available on demand on phones, expanded on desktop.
const compactReading = window.matchMedia('(max-width: 800px)');
const readingDetails = [...document.querySelectorAll('[data-mobile-disclosure]')];
function adaptReadingDetails() {
  readingDetails.forEach((details) => { details.open = !compactReading.matches; });
}
adaptReadingDetails();
compactReading.addEventListener('change', adaptReadingDetails);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.getAttribute('href').slice(1));
    for (let parent = target?.parentElement; parent; parent = parent.parentElement) {
      if (parent instanceof HTMLDetailsElement) parent.open = true;
    }
  });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Sluit menu');
  mobileMenu.hidden = isOpen;
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  });
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

  results.slice(1).forEach(({ src }) => { const preload = new Image(); preload.src = src; });

  function showResult(index) {
    current = index;
    const result = results[current];
    image.src = result.src;
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
