(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const paletteNames = {sage:'Warm Sage', oat:'Cream Oat', rose:'Dusty Rose', plum:'Soft Plum'};
  const paletteControls = document.getElementById('palette-controls');
  const paletteButtons = [...paletteControls.querySelectorAll('[data-palette-choice]')];
  function applyPalette(selected, remember = false) {
    if (!Object.prototype.hasOwnProperty.call(paletteNames, selected)) selected = 'sage';
    document.documentElement.dataset.palette = selected;
    paletteButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.paletteChoice === selected)));
    const surface = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim();
    document.querySelector('meta[name="theme-color"]').setAttribute('content', surface);
    document.querySelector('link[rel="icon"]').setAttribute('href', selected === 'sage' ? './favicon.svg' : './favicon-' + selected + '.svg');
    if (remember) {
      try { localStorage.setItem('tailin-palette', selected); } catch (_) {}
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('palette', selected);
        window.history.replaceState(null, '', url);
      } catch (_) {}
      document.getElementById('palette-status').textContent = paletteNames[selected] + ' palette selected.';
    }
  }
  applyPalette(document.documentElement.dataset.palette || 'sage');
  paletteControls.hidden = false;
  paletteControls.addEventListener('click', event => {
    const button = event.target.closest('[data-palette-choice]');
    if (button) applyPalette(button.dataset.paletteChoice, true);
  });
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  menuButton.hidden = false;
  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  menuButton.addEventListener('click', () => {
    const expanded = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(expanded));
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });

  const publications = [...document.querySelectorAll('.publication')];
  const filters = document.querySelector('.publication-filters');
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const topic = button.dataset.filter;
    filters.querySelectorAll('button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    publications.forEach(paper => {
      const visible = topic === 'all' || paper.dataset.topics.split(' ').includes(topic);
      paper.hidden = !visible;
      if (visible) count++;
    });
    document.getElementById('publication-count').textContent = count + ' publication' + (count === 1 ? '' : 's');
  });

  const copyButton = document.getElementById('copy-email');
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard is unavailable');
      await navigator.clipboard.writeText('chentailin1009@outlook.com');
      status.textContent = 'Email copied.';
    } catch (_) {
      const email = document.querySelector('.contact a[href^="mailto:"]');
      const range = document.createRange();
      range.selectNodeContents(email);
      const selection = window.getSelection();
      if (selection) { selection.removeAllRanges(); selection.addRange(range); }
      status.textContent = 'Please copy the selected email address.';
    }
  });

  if ('IntersectionObserver' in window) {
    const links = [...nav.querySelectorAll('a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          const current = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('current', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, {rootMargin: '-15% 0px -60% 0px', threshold: 0});
    links.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) observer.observe(section);
    });
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();
