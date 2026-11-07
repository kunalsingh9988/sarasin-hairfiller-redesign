// Vendor-neutral measurement adapter. No tags, cookies or network requests are loaded here.
// Connect the site's approved CMP and analytics configuration on WordPress staging.
(() => {
  let analyticsConsent = false;
  const allowedEvents = new Set(['consultation_click', 'contact_click', 'video_play']);

  function emit(event, placement) {
    if (!analyticsConsent || !allowedEvents.has(event)) return;
    // Do not include URLs, search terms, FAQ questions, conditions, form fields or identifiers.
    const payload = Object.freeze({ event, placement });
    window.dispatchEvent(new CustomEvent('sarasin:measurement', { detail: payload }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(payload);
  }

  window.sarasinMeasurement = Object.freeze({
    setConsent(consent) { analyticsConsent = consent?.analytics === true; },
    getConsent() { return { analytics: analyticsConsent }; }
  });

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const control = target?.closest('a[href],button[data-video]');
    if (!control) return;
    const placement = control.closest('header') ? 'header'
      : control.closest('footer') ? 'footer'
        : control.closest('.hero') ? 'hero' : 'main';
    const href = control.getAttribute('href') || '';
    if (href.startsWith('https://booking.sarasinclinic.com/')) emit('consultation_click', placement);
    else if (/^(tel:|mailto:)/.test(href)) emit('contact_click', placement);
    else if (control.matches('button[data-video]')) emit('video_play', placement);
  });
})();
