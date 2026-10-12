(() => {
  const allowed = ['sage', 'oat', 'rose', 'plum'];
  let selected = 'sage';
  try {
    const requested = new URL(window.location.href).searchParams.get('palette');
    if (allowed.includes(requested)) selected = requested;
    else {
      const saved = localStorage.getItem('tailin-palette');
      if (allowed.includes(saved)) selected = saved;
    }
  } catch (_) { /* The original palette remains available without storage. */ }
  document.documentElement.dataset.palette = selected;
})();
