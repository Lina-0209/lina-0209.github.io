(() => {
  'use strict';

  function initializeInteractions() {
    const root = document.documentElement;
    const dialog = document.querySelector('dialog[data-figure-dialog]');
    const dialogImage = dialog?.querySelector('img[data-figure-image]');
    const dialogCaption = dialog?.querySelector('p[data-figure-caption]');
    const closeButton = dialog?.querySelector('button[data-figure-close]');
    const galleryControls = dialog?.querySelector('[data-figure-controls]');
    const previousButton = dialog?.querySelector('[data-figure-prev]');
    const nextButton = dialog?.querySelector('[data-figure-next]');
    const galleryCount = dialog?.querySelector('[data-figure-count]');
    const figureError = dialog?.querySelector('[data-figure-error]');
    const originalLink = dialog?.querySelector('[data-figure-original]');
    let figureOpener = null;
    let galleryLinks = [];
    let galleryIndex = 0;

    // Image links remain usable without JavaScript or native dialog support.
    if (dialog && dialogImage && typeof dialog.showModal === 'function') {
      dialogImage.addEventListener('load', () => { dialogImage.hidden = false; if (figureError) figureError.hidden = true; });
      dialogImage.addEventListener('error', () => {
        dialogImage.hidden = true;
        if (figureError) {
          figureError.hidden = false;
          figureError.textContent = root.lang.startsWith('zh') ? '图片预览暂时无法加载，请打开原文件查看。' : 'The preview could not load. Open the original file to view it.';
        }
      });
      const showFigure = index => {
        galleryIndex = (index + galleryLinks.length) % galleryLinks.length;
        const link = galleryLinks[galleryIndex];
        const sourceImage = link.querySelector('img');
        const isChinese = root.lang.toLowerCase().startsWith('zh');
        dialogImage.hidden = false;
        if (figureError) figureError.hidden = true;
        // Hidden lazy thumbnails may retain stale currentSrc values; the link is the canonical gallery resource.
        dialogImage.src = link.href;
        if (originalLink) {
          const pdf = link.dataset.figurePdf;
          originalLink.href = pdf || link.href;
          originalLink.hidden = !pdf;
          originalLink.textContent = isChinese ? '打开矢量 PDF ↗' : 'Open vector PDF ↗';
        }
        dialogImage.alt = sourceImage.alt;
        if (dialogCaption) {
          dialogCaption.textContent = link.getAttribute(isChinese ? 'data-caption-zh' : 'data-caption-en') || sourceImage.alt;
        }
        const hasGallery = galleryLinks.length > 1;
        dialog.toggleAttribute('data-gallery-active', hasGallery);
        if (galleryControls) galleryControls.hidden = !hasGallery;
        if (galleryCount) galleryCount.textContent = `${galleryIndex + 1} / ${galleryLinks.length}`;
        if (previousButton) previousButton.setAttribute('aria-label', isChinese ? '上一张' : 'Previous image');
        if (nextButton) nextButton.setAttribute('aria-label', isChinese ? '下一张' : 'Next image');
      };

      document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.target instanceof Element ? event.target.closest('a[data-figure]') : null;
        if (!link?.querySelector('img') || dialog.open) return;
        event.preventDefault();
        figureOpener = link;
        const group = link.dataset.figureGroup;
        galleryLinks = group
          ? [...document.querySelectorAll('a[data-figure]')].filter(item => item.dataset.figureGroup === group && item.querySelector('img'))
          : [link];
        showFigure(galleryLinks.indexOf(link));
        dialog.showModal();
        closeButton?.focus({ preventScroll: true });
      });

      previousButton?.addEventListener('click', () => showFigure(galleryIndex - 1));
      nextButton?.addEventListener('click', () => showFigure(galleryIndex + 1));
      dialog.addEventListener('keydown', event => {
        if (galleryLinks.length < 2) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          showFigure(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
        }
      });
      closeButton?.addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener('close', () => {
        const opener = figureOpener;
        figureOpener = null;
        galleryLinks = [];
        galleryIndex = 0;
        if (opener?.isConnected) opener.focus({ preventScroll: true });
      });
    }

    const revealElements = [...document.querySelectorAll('.reveal')];
    const motionPreference = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    let revealObserver;
    const showAllReveals = () => {
      root.classList.remove('motion-ready');
      revealObserver?.disconnect();
      revealElements.forEach(element => element.classList.add('is-visible'));
    };

    if (typeof window.IntersectionObserver === 'function' && !motionPreference?.matches) {
      try {
        revealObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          });
        }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
        root.classList.add('motion-ready');
        // Hidden filter results stay observed and enter when shown again.
        revealElements.forEach(element => revealObserver.observe(element));
      } catch {
        showAllReveals();
      }
    } else {
      showAllReveals();
    }
    motionPreference?.addEventListener?.('change', event => {
      if (event.matches) showAllReveals();
    });

    const progressBar = document.querySelector('.reading-progress span');
    if (progressBar) {
      let progressFrame = null;
      const updateProgress = () => {
        progressFrame = null;
        const scrollableHeight = root.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 1;
        progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      };
      const scheduleProgress = () => {
        if (progressFrame === null) progressFrame = window.requestAnimationFrame(updateProgress);
      };
      window.addEventListener('scroll', scheduleProgress, { passive: true });
      window.addEventListener('resize', scheduleProgress, { passive: true });
      window.addEventListener('load', scheduleProgress, { once: true });
      document.addEventListener('toggle', scheduleProgress, { capture: true, passive: true });
      // Recalculate after language changes, filters, and expanded research details.
      if (typeof window.ResizeObserver === 'function' && document.body) {
        const resizeObserver = new ResizeObserver(scheduleProgress);
        resizeObserver.observe(document.body);
      }
      updateProgress();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInteractions, { once: true });
  } else {
    initializeInteractions();
  }
})();
