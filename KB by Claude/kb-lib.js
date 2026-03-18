/**
 * kb-lib.js  —  Shared library for kettlebell coach apps
 *
 * Provides:
 *   Cadence clock  — startCadenceClock(id), stopCadenceClock(id), resetCadenceDisplay(id)
 *   Session clock  — startSessionClock(elId, onTick?)
 *   EMOM arc       — startEmomArc(cfg), stopEmomArc(), resetEmomArc()
 *   Wake lock      — reqWakeLock(), relWakeLock()
 *   Pause/Resume   — initPause(cfg), pauseSession(), resumeSession()
 *   Chips          — addChip(containerId, text, cls)
 *   Sheet logging  — logToSheet(url, payload)
 *   Formatters     — fmtTime(sec), fmtSec(sec)
 *
 * Each app calls the functions it needs. No global state is assumed
 * except what is explicitly passed in or stored in the KB object below.
 */

const KB = {
  // ── CADENCE CLOCK ──────────────────────────────────────────
  // One interval per named clock (supports multiple simultaneous clocks)
  _cadenceIntervals: {},
  _cadenceStarts: {},

  startCadenceClock(id, targetSec) {
    this.stopCadenceClock(id);
    this._cadenceStarts[id] = Date.now();
    const el  = document.getElementById(id);
    const pip = document.getElementById(id + '-pip');
    if (el) { el.className = el.className.replace(/\bidle\b|\bover\b/g, '').trim(); }

    this._cadenceIntervals[id] = setInterval(() => {
      const sec = Math.floor((Date.now() - this._cadenceStarts[id]) / 1000);
      const m   = Math.floor(sec / 60);
      if (el) el.textContent = m > 0
        ? `${m}:${String(sec % 60).padStart(2, '0')}`
        : `${sec}`;
      const over = targetSec && sec > targetSec;
      if (el)  el.classList.toggle('over', !!over);
      if (pip) pip.classList.toggle('over', !!over);
    }, 200);
  },

  stopCadenceClock(id) {
    clearInterval(this._cadenceIntervals[id]);
    delete this._cadenceIntervals[id];
    // return elapsed seconds
    const start = this._cadenceStarts[id];
    return start ? Math.floor((Date.now() - start) / 1000) : 0;
  },

  resetCadenceDisplay(id) {
    this.stopCadenceClock(id);
    const el  = document.getElementById(id);
    const pip = document.getElementById(id + '-pip');
    if (el)  { el.textContent = '0'; el.className = (el.className + ' idle').trim(); }
    if (pip) pip.classList.remove('over');
    delete this._cadenceStarts[id];
  },

  // Pause support — snapshot elapsed at pause, restore on resume
  pauseCadenceClock(id) {
    const elapsed = this.stopCadenceClock(id);
    this._cadenceStarts[id + '_paused'] = elapsed;
    return elapsed;
  },

  resumeCadenceClock(id, targetSec) {
    const pausedElapsed = this._cadenceStarts[id + '_paused'] || 0;
    this.stopCadenceClock(id);
    this._cadenceStarts[id] = Date.now() - pausedElapsed * 1000;
    const el  = document.getElementById(id);
    const pip = document.getElementById(id + '-pip');
    if (el) { el.className = el.className.replace(/\bidle\b/g, '').trim(); }

    this._cadenceIntervals[id] = setInterval(() => {
      const sec = Math.floor((Date.now() - this._cadenceStarts[id]) / 1000);
      const m   = Math.floor(sec / 60);
      if (el) el.textContent = m > 0
        ? `${m}:${String(sec % 60).padStart(2, '0')}`
        : `${sec}`;
      const over = targetSec && sec > targetSec;
      if (el)  el.classList.toggle('over', !!over);
      if (pip) pip.classList.toggle('over', !!over);
    }, 200);
  },

  // ── SESSION CLOCK (counting up) ────────────────────────────
  _sessionInterval: null,
  _sessionStart: null,
  _sessionElapsed: 0,

  startSessionClock(elId, onTick) {
    clearInterval(this._sessionInterval);
    this._sessionStart = Date.now() - this._sessionElapsed * 1000;
    this._sessionInterval = setInterval(() => {
      this._sessionElapsed = Math.floor((Date.now() - this._sessionStart) / 1000);
      const m  = Math.floor(this._sessionElapsed / 60);
      const sc = this._sessionElapsed % 60;
      const el = document.getElementById(elId);
      if (el) el.textContent = `${m}:${String(sc).padStart(2, '0')}`;
      if (onTick) onTick(this._sessionElapsed);
    }, 500);
  },

  stopSessionClock() {
    clearInterval(this._sessionInterval);
    this._sessionInterval = null;
    return this._sessionElapsed;
  },

  resetSessionClock() {
    this.stopSessionClock();
    this._sessionElapsed = 0;
    this._sessionStart   = null;
  },

  // ── SESSION COUNTDOWN (DFW — 30 min countdown) ─────────────
  _countdownInterval: null,

  startCountdown(elId, totalSec, onExpire) {
    clearInterval(this._countdownInterval);
    const startedAt = Date.now() - this._sessionElapsed * 1000;
    this._countdownInterval = setInterval(() => {
      this._sessionElapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, totalSec - this._sessionElapsed);
      const m  = Math.floor(remaining / 60);
      const sc = remaining % 60;
      const el = document.getElementById(elId);
      if (el) el.textContent = `${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`;
      if (remaining === 0) {
        clearInterval(this._countdownInterval);
        if (onExpire) onExpire();
      }
    }, 500);
  },

  stopCountdown() {
    clearInterval(this._countdownInterval);
  },

  // ── EMOM ARC ───────────────────────────────────────────────
  _arcInterval: null,
  _arcElapsed: 0,

  startEmomArc(cfg) {
    // cfg: { arcId, timeId, labelId, targetSec }
    clearInterval(this._arcInterval);
    const C = 119.4; // circumference for r=19 circle
    const arc    = document.getElementById(cfg.arcId);
    const timeEl = document.getElementById(cfg.timeId);
    const lblEl  = document.getElementById(cfg.labelId);
    let elapsed  = this._arcElapsed;
    if (arc) arc.classList.remove('warn');

    this._arcInterval = setInterval(() => {
      elapsed++;
      this._arcElapsed = elapsed;
      if (arc) {
        arc.style.strokeDashoffset = C * (1 - Math.min(elapsed / cfg.targetSec, 1));
        arc.classList.toggle('warn', elapsed > cfg.targetSec);
      }
      if (timeEl) timeEl.textContent = elapsed + 's';
      const rem = cfg.targetSec - elapsed;
      if (lblEl) lblEl.innerHTML = rem > 0
        ? `<strong>${rem}s</strong> until next round`
        : `<strong class="late">+${Math.abs(rem)}s over</strong>`;
    }, 1000);
  },

  stopEmomArc() {
    clearInterval(this._arcInterval);
    return this._arcElapsed;
  },

  resetEmomArc(cfg) {
    clearInterval(this._arcInterval);
    this._arcElapsed = 0;
    const C = 119.4;
    const arc = document.getElementById(cfg.arcId);
    if (arc) { arc.style.strokeDashoffset = C; arc.classList.remove('warn'); }
    const timeEl = document.getElementById(cfg.timeId);
    if (timeEl) timeEl.textContent = '—';
    const lblEl = document.getElementById(cfg.labelId);
    if (lblEl) lblEl.textContent = 'Tap to start first round';
  },

  pauseEmomArc() { clearInterval(this._arcInterval); },

  resumeEmomArc(cfg) {
    // resume from where we left off — _arcElapsed preserved
    this.startEmomArc(cfg);
  },

  // ── WAKE LOCK ──────────────────────────────────────────────
  _wl: null,

  async reqWakeLock() {
    try {
      if ('wakeLock' in navigator)
        this._wl = await navigator.wakeLock.request('screen');
    } catch(e) {}
  },

  relWakeLock() {
    if (this._wl) { this._wl.release().catch(() => {}); this._wl = null; }
  },

  initWakeLockListener() {
    document.addEventListener('visibilitychange', async () => {
      if (this._wl && document.visibilityState === 'visible')
        await this.reqWakeLock();
    });
  },

  // ── PAUSE / RESUME ─────────────────────────────────────────
  // Apps call KB.initPause(cfg) with their app-specific snapshot/restore fns
  _paused: false,
  _onPause: null,   // fn() — app-specific: snapshot active clocks
  _onResume: null,  // fn() — app-specific: restore clocks

  initPause(onPause, onResume) {
    this._onPause  = onPause;
    this._onResume = onResume;
  },

  pauseSession() {
    if (this._paused) { this.resumeSession(); return; }
    this._paused = true;
    this.stopSessionClock();
    this.stopCountdown();
    this.relWakeLock();
    if (this._onPause) this._onPause();
    document.querySelectorAll('.btn-pause').forEach(btn => {
      btn.textContent = '▶ RESUME'; btn.classList.add('paused');
    });
    document.querySelectorAll('.tap-btn').forEach(b => b.style.opacity = '0.4');
  },

  resumeSession(clockElId, isCountdown, countdownTotal, onCountdownExpire) {
    if (!this._paused) return;
    this._paused = false;
    if (this._onResume) this._onResume();
    if (isCountdown) {
      this.startCountdown(clockElId, countdownTotal, onCountdownExpire);
    } else {
      this.startSessionClock(clockElId);
    }
    this.reqWakeLock();
    document.querySelectorAll('.btn-pause').forEach(btn => {
      btn.textContent = '⏸ Pause'; btn.classList.remove('paused');
    });
    document.querySelectorAll('.tap-btn').forEach(b => b.style.opacity = '');
  },

  // ── CHIPS ──────────────────────────────────────────────────
  addChip(containerId, text, cls) {
    const c = document.createElement('div');
    c.className = `chip ${cls}`;
    c.textContent = text;
    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(c);
      setTimeout(() => c.classList.remove(cls), 1800);
    }
  },

  // ── SHEET LOGGING ──────────────────────────────────────────
  logToSheet(url, payload) {
    if (!url || url.includes('YOUR_')) return;
    fetch(url, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  },

  // ── FORMATTERS ─────────────────────────────────────────────
  fmtTime(sec) {
    const m  = Math.floor(sec / 60);
    const sc = sec % 60;
    return `${m}:${String(sc).padStart(2, '0')}`;
  },

  fmtSec(sec) {
    const m = Math.floor(sec / 60);
    return m > 0
      ? `${m}:${String(sec % 60).padStart(2, '0')}`
      : `${sec}s`;
  },
};

// ── SHARED CSS CLASSES (injected once) ───────────────────────
// These are referenced by all apps. Apps include their own
// color variables; these classes use those variables.

/* Expected CSS variables in each app:
  --bg, --surface, --surface2, --border,
  --ink, --dim, --go, --go-dark, --warn,
  plus app-specific accent colors
*/
