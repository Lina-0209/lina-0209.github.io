(() => {
  'use strict';
  // Compact, accessible navigation on small screens.
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.menu-toggle');
  const closeMenu = () => { header?.classList.remove('is-menu-open'); menu?.setAttribute('aria-expanded','false'); };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded',String(open));
    header?.classList.toggle('is-menu-open',open);
  });
  document.querySelectorAll('#site-navigation a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {closeMenu();menu.focus();} });
  document.addEventListener('click',event => { if (header && !header.contains(event.target)) closeMenu(); });
})();
