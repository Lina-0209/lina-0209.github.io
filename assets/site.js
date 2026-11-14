(() => {
  document.documentElement.lang = "en";
  try { localStorage.removeItem("nan-li-language"); } catch {}
  let activeFilter = 'all';
  function updateCount() {
    const count = [...document.querySelectorAll('[data-research]')].filter(el => !el.hidden).length;
    const label = document.querySelector('[data-result-count]');
    if (label) label.textContent = `${count} ${count === 1 ? 'paper' : 'papers'}`;
  }
  function filterResearch(nextFilter) {
    activeFilter = nextFilter;
    document.querySelectorAll('[data-filter]').forEach(b => {
      const selected = b.dataset.filter === activeFilter;
      b.classList.toggle('active',selected);
      b.setAttribute('aria-pressed',String(selected));
    });
    document.querySelectorAll('[data-research]').forEach(project => {
      project.hidden = activeFilter !== 'all' && project.dataset.research !== activeFilter;
    });
    updateCount();
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',() => filterResearch(button.dataset.filter)));
  document.querySelectorAll('[data-interest-filter]').forEach(link => link.addEventListener('click',() => filterResearch(link.dataset.interestFilter)));
  let toastTimer;
  function showToast(message) {
    const toast = document.querySelector('.toast');
    if (!toast) return;
    toast.textContent = message;toast.hidden = false;
    clearTimeout(toastTimer);toastTimer = setTimeout(() => {toast.hidden = true;},3000);
  }
  function updateCopyLabels() {
    document.querySelectorAll('[data-copy-email]').forEach(button => {
      const copied = button.dataset.copied === 'true';
      const label = (copied ? 'Email copied' : 'Copy email');
      button.setAttribute('aria-label',label);
      button.title = label;
    });
  }
  const copyFeedbackTimers = new WeakMap();
  document.querySelectorAll('[data-copy-email]').forEach(button => button.addEventListener('click',async () => {
    const address = 'nli841@connect.hkust-gz.edu.cn';
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(address);
      button.dataset.copied = 'true';
      clearTimeout(copyFeedbackTimers.get(button));
      copyFeedbackTimers.set(button,setTimeout(() => {
        delete button.dataset.copied;
        updateCopyLabels();
      },2200));
      updateCopyLabels();
      showToast('Email copied');
    } catch {
      showToast('Please select the email address to copy it');
    }
  }));
  updateCopyLabels();
  const profileContact = document.querySelector('.profile-contact');
  const companion = document.querySelector('.avatar-companion');
  if (profileContact && companion && 'IntersectionObserver' in window) {
    const updateCompanionPosition = () => document.querySelector('[data-avatar]')?.dispatchEvent(new Event('avatar:positionchange'));
    companion.addEventListener('transitionend',event => {
      if (event.target === companion && event.propertyName === 'bottom') updateCompanionPosition();
    });
    new IntersectionObserver(entries => {
      const avoidContact = entries.some(entry => entry.isIntersecting);
      if (companion.classList.contains('avoid-profile-contact') === avoidContact) return;
      companion.classList.toggle('avoid-profile-contact',avoidContact);
      requestAnimationFrame(updateCompanionPosition);
    }).observe(profileContact);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('nav a').forEach(a => a.classList.toggle('current',a.hash === `#${entry.target.id}`));
        }
      });
    },{rootMargin:'-10% 0px -65% 0px',threshold:0});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
  updateCount();
})();
