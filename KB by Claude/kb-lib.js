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
  //
  // Locked design: 120px centered ring, r=53, circumference=333.
  // Two-element interior: .t-sec (number) + .t-lbl (label).
  // Three states:
  //   mid-round  → arc fills gold, shows remaining seconds
  //   over target → arc full red, shows "+Ns over"
  //   resting    → arc empty dim, shows interval target (via resetEmomArc)
  //
  // TIMING RULE: always use Date.now() wall clock, never elapsed++.
  // Integer counting drifts up to ~2s relative to tap time.
  // 200ms tick = responsive display with no perceptible CPU cost.
  //
  // cfg: { arcId, timeId, targetSec }
  //   arcId   — id of the <circle> element (the arc stroke)
  //   timeId  — id of the .emom-time-center wrapper div
  //   targetSec — EMOM interval in seconds (S.emomSec)
  //
  // HTML required:
  //   <div class="emom-arc-wrap">
  //     <svg width="120" height="120" viewBox="0 0 120 120">
  //       <circle class="emom-arc-bg" cx="60" cy="60" r="53"/>
  //       <circle class="emom-arc-fg" id="MY_ARC_ID" cx="60" cy="60" r="53"
  //         stroke-dasharray="333" stroke-dashoffset="333"/>
  //     </svg>
  //     <div class="emom-time-center" id="MY_TIME_ID">
  //       <span class="t-sec">—</span>
  //       <span class="t-lbl">interval</span>
  //     </div>
  //   </div>

  _arcInterval: null,
  _arcStart: null,
  _arcElapsedAtPause: 0,
  ARC_C: 333, // circumference for r=53

  startEmomArc(cfg) {
    clearInterval(this._arcInterval);
    this._arcStart = Date.now();
    const arc   = document.getElementById(cfg.arcId);
    const tEl   = document.getElementById(cfg.timeId);
    if (arc) arc.classList.remove('warn');

    this._arcInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this._arcStart) / 1000);
      if (arc) {
        arc.style.strokeDashoffset = this.ARC_C * (1 - Math.min(elapsed / cfg.targetSec, 1));
        arc.classList.toggle('warn', elapsed > cfg.targetSec);
      }
      const secEl = tEl ? tEl.querySelector('.t-sec') : null;
      const lblEl = tEl ? tEl.querySelector('.t-lbl') : null;
      const over  = elapsed > cfg.targetSec;
      if (over) {
        const excess = elapsed - cfg.targetSec;
        if (secEl) { secEl.textContent = `+${excess}s`; secEl.classList.add('warn'); }
        if (lblEl) { lblEl.textContent = 'over';         lblEl.classList.add('warn'); }
      } else {
        const rem = cfg.targetSec - elapsed;
        if (secEl) { secEl.textContent = rem + 's';   secEl.classList.remove('warn'); }
        if (lblEl) { lblEl.textContent = 'remaining'; lblEl.classList.remove('warn'); }
      }
    }, 200);
  },

  stopEmomArc() {
    clearInterval(this._arcInterval);
    // Return accurate elapsed using wall clock, not a counter
    return this._arcStart ? Math.floor((Date.now() - this._arcStart) / 1000) : 0;
  },

  resetEmomArc(cfg) {
    // Call after a round is logged to show resting state:
    // arc empties, interior shows the interval target
    clearInterval(this._arcInterval);
    this._arcStart = null;
    const arc = document.getElementById(cfg.arcId);
    if (arc) { arc.style.strokeDashoffset = this.ARC_C; arc.classList.remove('warn'); }
    const tEl   = document.getElementById(cfg.timeId);
    const secEl = tEl ? tEl.querySelector('.t-sec') : null;
    const lblEl = tEl ? tEl.querySelector('.t-lbl') : null;
    if (secEl) { secEl.textContent = cfg.targetSec + 's'; secEl.classList.remove('warn'); }
    if (lblEl) { lblEl.textContent = 'interval';           lblEl.classList.remove('warn'); }
  },

  pauseEmomArc() {
    // Stop the tick and snapshot elapsed — real time keeps passing during pause
    // so we must rebase _arcStart on resume to exclude the pause duration
    clearInterval(this._arcInterval);
    this._arcElapsedAtPause = this._arcStart
      ? Math.floor((Date.now() - this._arcStart) / 1000)
      : 0;
  },

  resumeEmomArc(cfg) {
    // Rebase _arcStart to exclude pause time, then restart interval
    this._arcStart = Date.now() - (this._arcElapsedAtPause || 0) * 1000;
    const arc = document.getElementById(cfg.arcId);
    if (arc) arc.classList.remove('warn');
    this._arcInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this._arcStart) / 1000);
      if (arc) {
        arc.style.strokeDashoffset = this.ARC_C * (1 - Math.min(elapsed / cfg.targetSec, 1));
        arc.classList.toggle('warn', elapsed > cfg.targetSec);
      }
      const tEl   = document.getElementById(cfg.timeId);
      const secEl = tEl ? tEl.querySelector('.t-sec') : null;
      const lblEl = tEl ? tEl.querySelector('.t-lbl') : null;
      const over  = elapsed > cfg.targetSec;
      if (over) {
        const excess = elapsed - cfg.targetSec;
        if (secEl) { secEl.textContent = `+${excess}s`; secEl.classList.add('warn'); }
        if (lblEl) { lblEl.textContent = 'over';         lblEl.classList.add('warn'); }
      } else {
        const rem = cfg.targetSec - elapsed;
        if (secEl) { secEl.textContent = rem + 's';   secEl.classList.remove('warn'); }
        if (lblEl) { lblEl.textContent = 'remaining'; lblEl.classList.remove('warn'); }
      }
    }, 200);
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
  //
  // CLOCK PAUSE CONTRACT
  // Every running clock must be frozen on pause and restored on resume
  // from its exact elapsed value. Never call startXClock() fresh from
  // resume — always snapshot on pause and rebase on resume.
  //
  // The library handles this automatically via an "active clock" registry.
  // Before calling pauseSession(), apps register what is currently running:
  //
  //   KB.setActiveClock('cadence', { id: 'my-timer', pipId: 'my-pip', targetSec: 60 })
  //   KB.setActiveClock('arc',     { arcId: 'my-arc', timeId: 'my-time', targetSec: S.emomSec })
  //   KB.setActiveClock(null)   // nothing running (between sets)
  //
  // pauseSession() freezes the registered clock.
  // resumeSession() restores it from the snapshot.
  //
  // Apps must call setActiveClock() on every tap:
  //   - Tap START → setActiveClock('cadence', cfg) or setActiveClock('arc', cfg)
  //   - Tap DONE  → setActiveClock(null)
  //
  // This is the single source of truth for pause behaviour across all apps.

  _paused: false,
  _activeClockType: null,   // 'cadence' | 'arc' | null
  _activeClockCfg:  null,   // config object for the active clock

  setActiveClock(type, cfg) {
    this._activeClockType = type || null;
    this._activeClockCfg  = cfg  || null;
  },

  pauseSession() {
    if (this._paused) { this.resumeSession(); return; }
    this._paused = true;

    // Freeze the active clock — snapshot elapsed so resume is accurate
    if (this._activeClockType === 'cadence' && this._activeClockCfg) {
      this.pauseCadenceClock(this._activeClockCfg.id);
    } else if (this._activeClockType === 'arc') {
      this.pauseEmomArc();
    }

    this.stopSessionClock();
    this.stopCountdown();
    this.relWakeLock();

    document.querySelectorAll('.pause-pill').forEach(btn => {
      btn.querySelector('.ap-val').textContent = '▶ Resume'; btn.classList.add('paused');
    });
    document.querySelectorAll('.tap-btn, .tap-zone').forEach(b => b.style.opacity = '0.4');
  },

  resumeSession(clockElId, isCountdown, countdownTotal, onCountdownExpire) {
    if (!this._paused) return;
    this._paused = false;

    // Restore the active clock from its snapshot — never restart fresh
    if (this._activeClockType === 'cadence' && this._activeClockCfg) {
      const cfg = this._activeClockCfg;
      this.resumeCadenceClock(cfg.id, cfg.targetSec);
    } else if (this._activeClockType === 'arc' && this._activeClockCfg) {
      this.resumeEmomArc(this._activeClockCfg);
    }

    if (isCountdown) {
      this.startCountdown(clockElId, countdownTotal, onCountdownExpire);
    } else {
      this.startSessionClock(clockElId);
    }
    this.reqWakeLock();

    document.querySelectorAll('.pause-pill').forEach(btn => {
      btn.querySelector('.ap-val').textContent = '⏸ Pause'; btn.classList.remove('paused');
    });
    document.querySelectorAll('.tap-btn, .tap-zone').forEach(b => b.style.opacity = '');
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
