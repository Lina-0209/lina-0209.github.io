(() => {
  'use strict';

  function initializeAvatar() {
    const button = document.querySelector('button[data-avatar]');
    const sprite = button?.querySelector('.avatar-sprite');
    const companion = button?.closest('.avatar-companion');
    const greeting = companion?.querySelector('.avatar-greeting');
    const dismissButton = companion?.querySelector('button[data-avatar-dismiss]');
    if (!button || !sprite) return;

    const root = document.documentElement;
    const motionPreference = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const frames = ['5.9809% 2.0734%', '94.3381% 2.2329%', '5.9809% 98.2456%', '94.3381% 98.2456%'];
    const waveDuration = 2450;
    const idleDuration = 8000;
    let frameTimer = null;
    let waveFrame = null;
    let waveStarted = null;
    let currentFrame = -1;
    let idleTimer = null;
    let greetingTimer = null;
    let greetingVisible = false;
    let dismissed = false;

    const isChinese = () => root.lang.toLowerCase().startsWith('zh');
    const syncLanguage = () => {
      button.setAttribute('aria-label', isChinese()
        ? '和 Nan Li 的小人打个招呼'
        : 'Say hello to Nan Li’s avatar');
      dismissButton?.setAttribute('aria-label', isChinese() ? '收起小人' : 'Hide character');
      if (greeting && greetingVisible) {
        greeting.textContent = isChinese()
          ? '你好，我是 Nan Li。欢迎来到我的研究主页！'
          : 'Hi, I’m Nan Li. Welcome to my research homepage!';
      }
    };

    const stopWave = () => {
      window.clearTimeout(frameTimer);
      frameTimer = null;
      if (waveFrame !== null) window.cancelAnimationFrame(waveFrame);
      waveFrame = null;
      waveStarted = null;
      currentFrame = 0;
      sprite.style.backgroundPosition = frames[0];
      button.classList.remove('is-waving', 'is-tweening');
      button.dispatchEvent(new CustomEvent('avatar:greeting', { detail: { active: false } }));
    };

    const scheduleWave = () => {
      window.clearTimeout(idleTimer);
      idleTimer = null;
      if (dismissed || document.hidden || motionPreference?.matches) return;
      idleTimer = window.setTimeout(playWave, idleDuration);
    };

    const setFrame = index => {
      if (currentFrame === index) return;
      currentFrame = index;
      sprite.style.backgroundPosition = frames[index];
    };

    const animateWave = now => {
      if (dismissed || document.hidden || motionPreference?.matches) {
        stopWave();
        return;
      }
      if (waveStarted === null) waveStarted = now;
      const time = now - waveStarted;
      if (time >= waveDuration) {
        stopWave();
        scheduleWave();
        return;
      }
      const tweening = time >= 300 && time < 2050;
      button.classList.toggle('is-tweening', tweening);
      if (time < 90) setFrame(0);
      else if (time < 190) setFrame(1);
      else if (time < 300) setFrame(2);
      else if (tweening) {
        const q = (time - 300) / 1750;
        const envelope = Math.sin(Math.PI * q) ** 2;
        const phase = 2 * Math.PI * (2.35 * q - 0.35 * q * q);
        const mix = 0.5 + 0.5 * envelope * Math.sin(phase);
        // One original raised-hand image deforms continuously; no limb replacement.
        setFrame(button.classList.contains('has-wave-tween') ? 3 : mix >= 0.5 ? 3 : 2);
        button.dispatchEvent(new CustomEvent('avatar:wave-pose', {
          detail: { from: 2, to: 3, mix }
        }));
      } else if (time < 2140) setFrame(3);
      else if (time < 2250) setFrame(2);
      else if (time < 2380) setFrame(1);
      else setFrame(0);
      waveFrame = window.requestAnimationFrame(animateWave);
    };

    function playWave() {
      window.clearTimeout(idleTimer);
      idleTimer = null;
      if (dismissed || document.hidden || motionPreference?.matches
        || frameTimer !== null || waveFrame !== null) return;
      button.dispatchEvent(new CustomEvent('avatar:greeting', { detail: { active: true } }));
      frameTimer = window.setTimeout(() => {
        frameTimer = null;
        waveStarted = null;
        button.classList.add('is-waving');
        waveFrame = window.requestAnimationFrame(animateWave);
      }, 240);
    }

    const hideGreeting = () => {
      window.clearTimeout(greetingTimer);
      greetingTimer = null;
      greetingVisible = false;
      if (greeting) {
        greeting.hidden = true;
        greeting.textContent = '';
      }
    };

    // Announcements follow a deliberate click, never an automatic animation.
    button.addEventListener('click', () => {
      if (dismissed) return;
      window.clearTimeout(greetingTimer);
      greetingVisible = true;
      if (greeting) {
        greeting.hidden = false;
        syncLanguage();
        greetingTimer = window.setTimeout(hideGreeting, 5000);
      }
      playWave();
    });

    dismissButton?.addEventListener('click', () => {
      dismissed = true;
      stopWave();
      window.clearTimeout(idleTimer);
      idleTimer = null;
      hideGreeting();
      if (companion) companion.hidden = true;
    });

    const resumeOrPause = () => {
      stopWave();
      window.clearTimeout(idleTimer);
      idleTimer = null;
      if (document.hidden) hideGreeting();
      else scheduleWave();
    };
    document.addEventListener('visibilitychange', resumeOrPause);
    motionPreference?.addEventListener?.('change', resumeOrPause);
    window.addEventListener('pagehide', () => {
      stopWave();
      window.clearTimeout(idleTimer);
      idleTimer = null;
      hideGreeting();
    });
    window.addEventListener('pageshow', scheduleWave);

    // The homepage language toggle changes <html lang> in place.
    if (typeof window.MutationObserver === 'function') {
      const languageObserver = new MutationObserver(syncLanguage);
      languageObserver.observe(root, { attributes: true, attributeFilter: ['lang'] });
    }
    if (greeting) {
      greeting.setAttribute('role', 'status');
      greeting.setAttribute('aria-live', 'polite');
      greeting.setAttribute('aria-atomic', 'true');
      greeting.hidden = true;
    }
    syncLanguage();
    stopWave();
    scheduleWave();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAvatar, { once: true });
  } else {
    initializeAvatar();
  }
})();
