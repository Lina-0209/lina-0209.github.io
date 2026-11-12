(() => {
  'use strict';

  function initializeGaze() {
    const button = document.querySelector('button[data-avatar]');
    const companion = button?.closest('.avatar-companion');
    if (!button?.querySelector('.avatar-head') || !companion || !window.matchMedia) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const head = { x: 0, y: 0 };
    const eyes = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let lastPointer = null;
    let bounds = null;
    let frame = null;
    let previousTime = null;
    let pageSuspended = false;
    let returning = false;
    let greetingActive = false;

    const clamp = value => Math.max(-1, Math.min(1, value));
    const mayTrack = () => finePointer.matches && !reducedMotion.matches
      && !document.hidden && !companion.hidden && !pageSuspended;

    function paint() {
      const set = (name, value, unit) => button.style.setProperty(name, `${value.toFixed(4)}${unit}`);
      const scale = bounds?.scale ?? 1;
      // The eyes acquire the target first; their offset relaxes as the head catches up.
      const eyeX = clamp(eyes.x - head.x * 0.45);
      const eyeY = clamp(eyes.y - head.y * 0.45);
      // CSS is the fallback; the curved head renderer consumes the same pose.
      const yaw = head.x * 18;
      const pitch = head.y * (head.y < 0 ? 10 : 7);
      const roll = head.x * 0.5;
      set('--head-x', 0, 'px');
      set('--head-y', 0, 'px');
      set('--head-yaw', yaw, 'deg');
      set('--head-pitch', -pitch, 'deg');
      set('--head-roll', roll, 'deg');
      set('--eye-x', eyeX * 2.2 * scale, 'px');
      set('--eye-y', eyeY * 1.5 * scale, 'px');
      button.dispatchEvent(new CustomEvent('avatar:gaze', {
        detail: { yaw, pitch, roll, eyeX, eyeY }
      }));
    }

    function reset() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
      returning = false;
      lastPointer = null;
      head.x = head.y = eyes.x = eyes.y = target.x = target.y = 0;
      paint();
      button.classList.remove('has-look');
    }

    function animate(time) {
      frame = null;
      if (!mayTrack()) {
        reset();
        return;
      }
      const elapsed = previousTime === null ? 1000 / 60 : Math.min(48, time - previousTime);
      previousTime = time;
      const headBlend = 1 - Math.exp(-elapsed / (greetingActive ? 60 : returning ? 280 : 210));
      const eyeBlend = 1 - Math.exp(-elapsed / (returning ? 90 : 80));
      head.x += (target.x - head.x) * headBlend;
      head.y += (target.y - head.y) * headBlend;
      eyes.x += (target.x - eyes.x) * eyeBlend;
      eyes.y += (target.y - eyes.y) * eyeBlend;
      const settled = [head, eyes].every(state =>
        Math.abs(target.x - state.x) < 0.0008
        && Math.abs(target.y - state.y) < 0.0008);
      if (settled) {
        head.x = eyes.x = target.x;
        head.y = eyes.y = target.y;
      }
      paint();
      if (settled) {
        previousTime = null;
        if (returning) {
          returning = false;
          button.classList.remove('has-look');
        }
      } else {
        frame = window.requestAnimationFrame(animate);
      }
    }

    function start() {
      if (!mayTrack() || (!lastPointer && !returning)) return;
      button.classList.add('has-look');
      if (frame === null) frame = window.requestAnimationFrame(animate);
    }

    function returnToCenter() {
      if (!mayTrack()) {
        reset();
        return;
      }
      lastPointer = null;
      target.x = target.y = 0;
      returning = true;
      start();
    }

    function updateTarget() {
      if (greetingActive) { target.x = target.y = 0; return; }
      if (!lastPointer || !bounds) return;
      const dx = lastPointer.x - bounds.eyeX;
      const dy = lastPointer.y - bounds.eyeY;
      // A curved response stays expressive near the face without saturating across the page.
      target.x = (2 / Math.PI) * Math.atan(dx / bounds.focusX);
      target.y = (2 / Math.PI) * Math.atan(dy / bounds.focusY);
    }

    // Bounds are cached; the animation loop only writes transforms.
    function updateBounds() {
      const rect = button.getBoundingClientRect();
      const eyeX = rect.left + rect.width * 0.5;
      const eyeY = rect.top + rect.height * 0.35;
      bounds = {
        eyeX,
        eyeY,
        focusX: Math.max(80, Math.min(140, rect.width * 0.60)),
        focusY: Math.max(70, Math.min(120, rect.height * 0.50)),
        scale: rect.width / 154
      };
      updateTarget();
    }

    button.addEventListener('avatar:positionchange', () => {
      updateBounds();
      start();
    });

    button.addEventListener('avatar:greeting', event => {
      greetingActive = Boolean(event.detail?.active);
      if (greetingActive) {
        target.x = target.y = 0;
        returning = true;
      } else {
        updateBounds();
        updateTarget();
        returning = !lastPointer;
      }
      start();
    });

    document.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || !mayTrack()) return;
      lastPointer = { x: event.clientX, y: event.clientY };
      returning = false;
      updateTarget();
      start();
    }, { passive: true });

    document.addEventListener('pointerleave', returnToCenter);
    document.addEventListener('pointerout', event => {
      if (event.relatedTarget === null) returnToCenter();
    }, { passive: true });
    window.addEventListener('blur', returnToCenter);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) reset();
      else updateBounds();
    });
    window.addEventListener('resize', () => {
      updateBounds();
      start();
    }, { passive: true });
    window.addEventListener('pagehide', () => {
      pageSuspended = true;
      reset();
    });
    window.addEventListener('pageshow', () => {
      pageSuspended = false;
      updateBounds();
    });

    const preferenceChanged = () => {
      reset();
      updateBounds();
    };
    finePointer.addEventListener?.('change', preferenceChanged);
    reducedMotion.addEventListener?.('change', preferenceChanged);

    if (companion) {
      new MutationObserver(() => {
        reset();
        if (!companion.hidden) updateBounds();
      }).observe(companion, { attributes: true, attributeFilter: ['hidden'] });
    }

    updateBounds();
    paint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGaze, { once: true });
  } else {
    initializeGaze();
  }
})();
