# Adding a New Program

This guide walks through building a new kettlebell program app using the KBs by Claude design system. A straightforward program (single movement type, fixed scheme) takes 2–3 hours. A complex program (multiple movement types, phase navigation) takes 4–6 hours.

---

## Before you start

Answer these questions about the program:

1. **How many weeks?** (determines week selector layout)
2. **How many days per week?**
3. **What is the session structure?** (one movement type, or multiple phases?)
4. **What is the primary movement type?**
   - Ladders/sets → use **cadence clock pattern**
   - EMOM complex → use **ABC/EMOM pattern**
   - Mixed → use **phase navigator pattern**
5. **What weights does the user set up?** (double bells, single bell, snatch bell?)
6. **Is there a time limit?** (DFW = 30 min countdown, others = count-up)
7. **What does the scheme data look like?** (per week/day, or per week only?)

---

## Step 1 — Define your program data

Create a `SCHEMES` object (for ladder/cadence programs) or per-week targets objects (for volume programs).

### Ladder program (DFW style)

```javascript
const SCHEMES = {
  '1-1': { name: 'Ladders 1–2–3', rungs: [1,2,3], type: 'ladder' },
  '1-2': { name: 'Sets of 1',      rungs: [1],      type: 'fixed'  },
  // ... one entry per week-day combination
};
const DESCS = {
  ladder: 'Complete each rung. C+P then FSQ for each rep count. Repeat for 30 min.',
  fixed:  'Sets of the same rep count. C+P then FSQ each set. 30 min.',
  alt:    'Alternate between the two rep counts. 30 min.',
};
```

### Volume program (ABF / Iron Tide style)

```javascript
const WEEK_PLAN = {
  1: { min: 8, max: 10, emom: 90, note: 'Build the pattern back' },
  2: { min: 10, max: 12, emom: 90, note: 'Add 2 rounds if week 1 felt easy' },
  // ...
};
```

---

## Step 2 — Choose your screen pattern

### Pattern A — Cadence clock (DFW, DFW 2.0, ABF press, Iron Tide Day B)

Use when: the athlete does a set, taps done, repeats. No fixed interval.

**Center element:** Big cadence timer counting up. Secondary info (reps, ladder position) in small badges below.

Copy the cadence clock HTML block from `DESIGN.md` or from `dfw-demo.html`.

Required elements:
```html
<div class="cadence-area">
  <div class="cadence-ctx" id="my-ctx">READY</div>
  <div class="cadence-timer idle" id="my-cadence-timer">0</div>
  <div class="target-row">
    <div class="target-pip" id="my-cadence-timer-pip"></div>
    <div class="target-lbl" id="my-target-lbl">target: 60s</div>
  </div>
  <!-- secondary info badges below -->
  <div class="set-meta-row"> ... </div>
</div>
```

Wire up:
```javascript
// On START tap:
startCadenceClock('my-cadence-timer', 'my-cadence-timer-pip');

// On DONE tap:
const sec = stopCadenceClock('my-cadence-timer', 'my-cadence-timer-pip');
// sec = elapsed seconds for this set — log it, add to chips, etc.
```

### Pattern B — EMOM / ABC (ABF ABC, Iron Tide Day A)

Use when: athlete does a complex, taps done, waits for the next interval.

**Center element:** Big round counter (Playfair Display), 120px EMOM arc centered below. No side label. No last-round feedback.

Copy from `abf-coach.html` ABC session.

Required elements:
```html
<div class="abc-center">
  <div class="abc-ctx" id="my-ctx">READY</div>
  <div class="round-display">
    <div class="round-done" id="my-done">0</div>
    <div class="round-sep">/</div>
    <div class="round-target" id="my-target">20</div>
  </div>
  <div class="abc-scheme">2 Cleans · 1 Press · 3 Front Squats</div>
  <div class="abc-wt" id="my-wt">16 / 16 kg</div>

  <!-- 120px arc — centered, no wrapper row, no side label -->
  <div class="emom-arc-wrap">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle class="emom-arc-bg" cx="60" cy="60" r="53"/>
      <circle class="emom-arc-fg" id="my-arc" cx="60" cy="60" r="53"
        stroke-dasharray="333" stroke-dashoffset="333"/>
    </svg>
    <div class="emom-time-center" id="my-arc-time">
      <span class="t-sec">—</span>
      <span class="t-lbl" id="my-arc-lbl">interval</span>
    </div>
  </div>
</div>
```

Wire up — **use wall clock, not integer counting**:
```javascript
const ARC_C = 333; // circumference for r=53
let arcInterval = null;

function startEmomArc() {
  clearInterval(arcInterval);
  const arc   = document.getElementById('my-arc');
  const tEl   = document.getElementById('my-arc-time');
  const arcStart = Date.now(); // wall clock anchor
  arc.classList.remove('warn');

  arcInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - arcStart) / 1000); // always accurate
    arc.style.strokeDashoffset = ARC_C * (1 - Math.min(elapsed / S.emomSec, 1));
    const over  = elapsed > S.emomSec;
    arc.classList.toggle('warn', over);
    const secEl = tEl.querySelector('.t-sec');
    const lblEl = tEl.querySelector('.t-lbl');
    if (over) {
      const excess = elapsed - S.emomSec;
      if (secEl) { secEl.textContent = `+${excess}s`; secEl.classList.add('warn'); }
      if (lblEl) { lblEl.textContent = 'over';         lblEl.classList.add('warn'); }
    } else {
      const rem = S.emomSec - elapsed;
      if (secEl) { secEl.textContent = rem + 's';      secEl.classList.remove('warn'); }
      if (lblEl) { lblEl.textContent = 'remaining';    lblEl.classList.remove('warn'); }
    }
  }, 200); // 200ms tick — responsive, no drift
}

function stopEmomArc() {
  clearInterval(arcInterval);
}

function resetEmomArc() {
  clearInterval(arcInterval);
  const arc   = document.getElementById('my-arc');
  const tEl   = document.getElementById('my-arc-time');
  arc.style.strokeDashoffset = ARC_C;
  arc.classList.remove('warn');
  const secEl = tEl ? tEl.querySelector('.t-sec') : null;
  const lblEl = tEl ? tEl.querySelector('.t-lbl') : null;
  if (secEl) { secEl.textContent = '—';       secEl.classList.remove('warn'); }
  if (lblEl) { lblEl.textContent = 'interval'; lblEl.classList.remove('warn'); }
}

// On START tap:
S.roundStart = Date.now();
startEmomArc();

// On DONE tap — elapsed is accurate because it uses Date.now() too:
stopEmomArc();
const elapsed = Math.round((Date.now() - S.roundStart) / 1000);
```

**Never use `elapsed++` in a `setInterval`. It drifts.** See DESIGN.md timing rule.

**Target-reached — stop auto-start:**

If the session has a round/rep target, check it before the auto-start block and `return` early:

```javascript
// After logging the round/set:
if (S.rounds >= S.target) {
  S.phase = 'idle';
  _setActiveClock(null);
  resetEmomArc();  // arc resets to show interval target
  document.getElementById('ctx').textContent     = '🎯 TARGET REACHED!';
  document.getElementById('tap').className       = 'tap-btn go';
  document.getElementById('tap-lbl').textContent = `START ROUND ${S.rounds+1}`;
  return;  // ← skip auto-start block entirely
}
// auto-start next round...
```

Only implement this for target-based programs (ABF, Iron Tide). Duration-based programs (DFW, Wolf, etc.) have no round target — skip this.

### Pattern C — Phase navigator (Iron Tide)

Use when: session has multiple sequential movement types (e.g. Press → Snatch → Push/Pull).

**Structure:** Phase nav dots below session header. Each movement is a `phase-panel` div. Phase advance button at bottom of each panel.

```html
<div class="phase-nav" id="my-phase-nav">
  <div class="phase-dot active-a" onclick="goPhase(0)"></div>
  <div class="phase-dot" onclick="goPhase(1)"></div>
  <div class="phase-dot" onclick="goPhase(2)"></div>
</div>

<div class="phase-panel active" id="p0"> ... Phase 0 content ... </div>
<div class="phase-panel" id="p1"> ... Phase 1 content ... </div>
```

```javascript
function goPhase(idx) {
  document.querySelectorAll('.phase-dot').forEach((d,i) => {
    d.className = 'phase-dot' + (i<idx?' done':i===idx?' active-a':'');
  });
  document.querySelectorAll('.phase-panel').forEach((p,i) => {
    p.classList.toggle('active', i===idx);
  });
}
```

---

## Step 3 — State object

Every app uses a single `const S = { ... }` state object. Include:

```javascript
const S = {
  // Setup
  week: 1,
  day: 1,
  wL: 24, wR: 24,           // double bell weights
  wSnatch: 16,               // single bell (if applicable)
  emomSec: 60,               // EMOM interval (if applicable)

  // Session
  sessionStart: null,
  sessionInterval: null,
  totalElapsed: 0,

  // Movement-specific (add per movement)
  myRounds: 0,
  myPhase: 'idle',           // 'idle' | 'running' | 'done'
  myStart: null,
  myLog: [],
};
```

---

## Step 4 — Bottom bar

Every session screen uses the locked bottom bar: **Next (flex:2) · ⏸ Pause (flex:1, gold tint) · ⏏ End (flex:1, red tint)**.

```html
<div class="new-stat-bar">
  <!-- Next set pill — flex:2, neutral -->
  <div class="next-pill">
    <div class="np-lbl" id="my-next-lbl">Next set</div>
    <div class="np-val" id="my-next-val">×3 · C+P → FSQ</div>
  </div>

  <!-- Pause — flex:1, gold tint -->
  <button class="action-pill pause-pill" onclick="pauseSession()">
    <div class="ap-lbl">Action</div>
    <div class="ap-val">⏸ Pause</div>
  </button>

  <!-- End — flex:1, red tint, overlay confirm -->
  <div class="end-pill-wrap">
    <button class="end-pill" id="my-end" onclick="showEndConfirm('my')">
      <div class="ap-lbl">Action</div>
      <div class="ap-val">⏏ End</div>
    </button>
    <div class="end-confirm-overlay" id="my-end-confirm">
      <span>end session?</span>
      <div class="end-confirm-btns">
        <button class="ec-yes" onclick="endSession()">Yes</button>
        <button class="ec-no" onclick="hideEndConfirm('my')">No</button>
      </div>
    </div>
  </div>
</div>
```

**Important:** The confirm is an overlay inside `end-pill-wrap`, not a separate element that replaces the button. `showEndConfirm` adds class `vis`, `hideEndConfirm` removes it.

```javascript
function showEndConfirm(id) {
  document.getElementById(`${id}-end-confirm`).classList.add('vis');
}
function hideEndConfirm(id) {
  document.getElementById(`${id}-end-confirm`).classList.remove('vis');
}
```

Update the next pill on every tap — **define `updateNextPill()` before calling it**:

```javascript
function updateNextPill() {
  // IMPORTANT: rungIdx has already been incremented when this is called.
  // rungIdx     → the set currently about to run (shown in rep badge + tap sub)
  // rungIdx + 1 → what comes AFTER that (shown in next pill)
  // Always use +1 here or the next pill shows the same rung as the tap button.
  const nextReps = S.scheme.rungs[(S.rungIdx + 1) % S.scheme.rungs.length];
  const el  = document.getElementById('my-next-val');
  const lbl = document.getElementById('my-next-lbl');
  if (el)  el.textContent  = `×${nextReps} · C+P → FSQ`;
  if (lbl) lbl.textContent = `Set ${S.sets.length + 1} next`;
}
// Call on session start AND after every tap
```

**The rungIdx timing rule:**
- `currentReps()` = `rungs[rungIdx % length]` — what you're doing right now
- `updateNextPill()` = `rungs[(rungIdx + 1) % length]` — what comes after
- `rungIdx` is incremented immediately when a set is logged, before `updateNextPill()` is called
- So at call time: `rungIdx` = the set now running, `rungIdx + 1` = the one after that

**Pause/resume updates the pill button, not `.btn-pause` (no longer used):**
```javascript
document.querySelectorAll('.pause-pill').forEach(btn => {
  btn.querySelector('.ap-val').textContent = '▶ Resume';
  btn.classList.add('paused');
});
// On resume:
document.querySelectorAll('.pause-pill').forEach(btn => {
  btn.querySelector('.ap-val').textContent = '⏸ Pause';
  btn.classList.remove('paused');
});
```

---

## Step 5 — Pause / Resume

**The rule: freeze and restore, never restart.** On pause, snapshot the active clock's elapsed time. On resume, rebase from that snapshot. Never call `startCadenceClock()` or `startEmomArc()` from resume — that resets the clock to zero.

Use the active clock registry in kb-lib.js. Call `KB.setActiveClock()` on every tap:

```javascript
// Cadence clock app — in your tap handler:
if (phase === 'idle') {
  // starting a set
  KB.setActiveClock('cadence', { id: 'my-timer', pipId: 'my-pip', targetSec: S.targetCadence });
  startCadenceClock();
} else {
  // set done
  KB.setActiveClock(null);
  stopCadenceClock();
}

// EMOM arc app — in your tap handler:
if (phase === 'idle') {
  KB.setActiveClock('arc', { arcId: 'my-arc', timeId: 'my-time', targetSec: S.emomSec });
  startEmomArc();
} else {
  KB.setActiveClock(null);
  stopEmomArc();
}
```

Then `pauseSession()` and `resumeSession()` handle the rest automatically via kb-lib.js.

**For apps that inline their own pause/resume** (not using kb-lib.js), follow this pattern:

Add these variables and functions (copy from any existing app):

```javascript
let _paused = false;
let _workoutAtPause = 0;
let _movementElapsedAtPause = 0;

function pauseSession() {
  if (_paused) { resumeSession(); return; }
  _paused = true;
  _workoutAtPause = S.totalElapsed;

  // Snapshot any running cadence clock
  if (S.myPhase === 'running') _movementElapsedAtPause = pauseCadenceClock();

  clearInterval(S.sessionInterval);
  relWakeLock();

  document.querySelectorAll('.btn-pause').forEach(b => {
    b.textContent = '▶ RESUME'; b.classList.add('paused');
  });
  document.querySelectorAll('.tap-btn').forEach(b => b.style.opacity = '0.4');
}

function resumeSession() {
  if (!_paused) return;
  _paused = false;
  S.sessionStart = Date.now() - _workoutAtPause * 1000;

  // Restore cadence clock if mid-set
  if (S.myPhase === 'running')
    resumeCadenceClock('my-cadence-timer', 'my-cadence-timer-pip', _movementElapsedAtPause);

  startSessionClock();
  reqWakeLock();

  document.querySelectorAll('.btn-pause').forEach(b => {
    b.textContent = '⏸ Pause'; b.classList.remove('paused');
  });
  document.querySelectorAll('.tap-btn').forEach(b => b.style.opacity = '');
}
```

---

## Step 6 — Google Sheets logging

Two log calls per session: one per set/round (granular), one at session end (summary).

```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

// Per round / set
function logRound(roundNum, reps, seconds) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_')) return;
  fetch(APPS_SCRIPT_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'round',
      program: 'MyProgram',        // ← unique program identifier
      week: S.week, day: S.day,
      session: `W${S.week}D${S.day} · My Session Name`,
      number: roundNum, reps, seconds,
      weightL: S.wL, weightR: S.wR,
      onTarget: true,
    }),
  }).catch(() => {});
}

// Session summary (call from endSession())
function logSession() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_')) return;
  const elapsed = S.totalElapsed;
  const m = Math.floor(elapsed / 60), sc = elapsed % 60;
  fetch(APPS_SCRIPT_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'session',
      program: 'MyProgram',
      week: S.week, day: S.day,
      session: `W${S.week}D${S.day} · My Session Name`,
      weightL: S.wL, weightR: S.wR,
      reps: totalReps,
      kgMoved: totalKg,
      duration: elapsed,
      durationStr: `${m}:${String(sc).padStart(2, '0')}`,
    }),
  }).catch(() => {});
}
```

The `program` field is what appears as a filter pill in the dashboard. Keep it short and unique (e.g. `'Wolf'`, `'Maximorum'`, `'Giant'`).

---

## Step 7 — Program accent color

Pick a color not used by existing programs:

| Taken | Available |
|-------|-----------|
| `#e8c547` gold (DFW, ABF) | `#67e8f9` cyan |
| `#c084fc` purple (DFW 2.0) | `#a3e635` lime |
| `#7aabe5` blue (ABF press) | `#fb923c` orange-red |
| `#58a6ff` tide (Iron Tide A) | `#f472b6` pink |
| `#f0883e` ember (Iron Tide B) | `#34d399` emerald |

Add to `:root` and use as your tap button active border color and scheme card value color.

---

## Checklist before shipping

- [ ] All session screens have correct `id` attributes matching JS selectors
- [ ] `APPS_SCRIPT_URL` is set (or left as placeholder for forks)
- [ ] `program:` field in log calls is unique
- [ ] Session name format is `W${week}D${day} · Scheme Name`
- [ ] Pause/resume tested: pause mid-set, take a call, resume — clock should be correct
- [ ] Wake lock: screen stays on during session, releases on summary
- [ ] End confirm: two-step confirm works, No returns to session
- [ ] Summary screen: totals are correct
- [ ] Tested on iPhone in Safari, saved to home screen

---

## Quick reference — program accent and session name

| Program | `program:` field | Accent color |
|---------|-----------------|--------------|
| DFW | `'DFW'` | `#e8c547` |
| DFW 2.0 | `'DFW2'` | `#c084fc` |
| ABF | `'ABF'` | `#e8c547` / `#7aabe5` |
| Iron Tide | `'IronTide'` | `#58a6ff` / `#f0883e` |
| The Giant | `'Giant'` | (pick from available above) |
| The Wolf | `'Wolf'` | (pick from available above) |
| Maximorum | `'Maximorum'` | (pick from available above) |

---

## Runtime safety — lessons from production bugs

These are the silent killers. They all pass JS syntax checks and Node.js `new Function()` validation but crash at runtime in Safari, killing `startSession()` without any visible error.

### Rule 1 — Never call `.textContent` on a potentially missing element

Any element referenced in JS **must exist in the HTML**. This sounds obvious but breaks in practice when you redesign the bottom bar, replace stat pills, or restructure a session screen — the JS still references the old element IDs.

**Wrong:**
```javascript
document.getElementById('my-stat-pill').textContent = value;
```

**Right:**
```javascript
const el = document.getElementById('my-stat-pill');
if (el) el.textContent = value;
```

### Rule 2 — forEach loops are not exempt

The regex-based guard pass that checks for `const el = getElementById` **misses** the arrow function pattern. Both of these crash identically if the element is missing:

```javascript
// Both crash the same way — forEach pattern is easy to miss:
['id-a', 'id-b'].forEach(id => document.getElementById(id).textContent = '0');

// Safe version:
['id-a', 'id-b'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.textContent = '0';
});
```

### Rule 3 — Every function that is called must be defined

If you call `updateNextPill()` from `startSession()`, the function must exist somewhere in the script. Patches applied incrementally are prone to adding calls without adding definitions. The function will be undefined at runtime even though JS parses fine.

**Verification:** grep for every function call in `startSession()` and its entire call chain, confirm each has a `function X()` definition.

### Rule 4 — When you remove HTML elements, audit the JS immediately

When the bottom bar was redesigned from three stat pills to the new Next/Pause/End layout, all the old element IDs (`abc-s-rounds`, `press-s-sets`, `pp-s-push` etc) disappeared from the HTML but the JS still wrote to them. The result: `startSession()` silently dies before showing the session screen.

**Process when removing any HTML element with an `id`:**
1. `grep -n 'getElementById.*YOUR_ID' yourapp.html` 
2. Guard or remove every reference found
3. Run the validation script below

### Rule 5 — When you restructure an element from flat to nested, audit all .textContent writes

Changing an element from a simple text node to a parent-with-children is a common design evolution (e.g. the EMOM arc going from a single `<div>` to a wrapper containing `.t-sec` and `.t-lbl` spans). Any JS that still calls `.textContent = x` on the **parent** will silently destroy its children on every invocation.

**Example of the failure:**
```html
<!-- Old: flat -->
<div id="emom-time">—</div>

<!-- New: nested -->
<div id="emom-time">
  <span class="t-sec">—</span>
  <span class="t-lbl">interval</span>
</div>
```

```javascript
// This looks harmless but wipes the two child spans on every call:
document.getElementById('emom-time').textContent = '—'; // ← DESTROYS children
```

**Process when restructuring any element:**
1. Note the old `id`
2. `grep -n "getElementById.*OLD_ID.*textContent" yourapp.html`
3. For every hit: does it write to the parent or a specific child?
4. Parent writes → replace with child-targeted writes or remove if a reset function already handles it
5. Re-run the validation script

This is distinct from Rule 4 (removing elements) — the element still exists, so the validation script won't flag it. It only manifests at runtime when the parent's children silently vanish.

---

### Validation script — run before shipping any app

Catches missing element refs, arc spec drift, bottom bar regressions, and the rungIdx+1 rule in one pass. Save as `validate.py` and run with `python3 validate.py yourapp.html`.

```python
import re, sys

path = sys.argv[1] if len(sys.argv) > 1 else 'yourapp.html'
with open(path) as f:
    html = f.read()

js = re.search(r'<script>([\s\S]*?)</script>', html).group(1)
html_ids = set(re.findall(r'id="([^"]+)"', html))
ok = True

# ── 1. Unguarded missing element references ──────────────────────
unguarded = []
for m in re.finditer(r"getElementById\('([^']+)'\)", js):
    el_id = m.group(1)
    if el_id in html_ids:
        continue
    pre = js[max(0, m.start()-60):m.start()]
    if not re.search(r'const |let |if\s*\(', pre):
        line_start = js.rfind('\n', 0, m.start())
        line_end   = js.find('\n', m.start())
        line = js[line_start:line_end].strip()
        if 'if(' not in line and 'if (' not in line:
            unguarded.append((el_id, line[:80]))
if unguarded:
    ok = False
    print(f"✗ UNGUARDED MISSING ELEMENTS ({len(unguarded)}):")
    for el, line in unguarded:
        print(f"    {el}: {line}")
else:
    print("✓ missing elements: none")

# ── 2. Arc spec (only checked if app has an arc) ─────────────────
arc_c = re.search(r'const ARC_C = ([0-9.]+)', js)
if arc_c:
    checks = [
        ("ARC_C = 333",        arc_c.group(1) == "333"),
        ("arc r = 53",         bool(re.search(r'id="(?:emom-arc|abc-arc)"[^>]*r="53"', html))),
        ("stroke-dasharray=333", bool(re.search(r'stroke-dasharray="333"', html))),
        (".t-sec/.t-lbl present", "t-sec" in html and "t-lbl" in html),
        ("no abc-last in HTML", 'id="abc-last"' not in html),
        ("no elapsed++",       "elapsed++" not in js),
        ("arcStart wall clock","arcStart = Date.now()" in js),
    ]
    arc_tick = re.search(r'arcInterval\s*=\s*setInterval[\s\S]{0,600}?},\s*(200|1000)\)', js)
    if arc_tick:
        checks.append(("arc tick 200ms", arc_tick.group(1) == "200"))
    for label, result in checks:
        if not result:
            ok = False
            print(f"✗ arc: {label}")
        else:
            print(f"✓ arc: {label}")

# ── 3. Bottom bar ────────────────────────────────────────────────
bar_checks = [
    ("pause-pill present",       "pause-pill" in html),
    ("new-stat-bar present",     "new-stat-bar" in html),
    ("end-pill present",         "end-pill" in html),
    ("no old btn-pause class",   'class="btn-pause"' not in html),
    ("no old stat-pill class",   'class="stat-pill"' not in html),
]
for label, result in bar_checks:
    if not result:
        ok = False
        print(f"✗ bar: {label}")
    else:
        print(f"✓ bar: {label}")

# ── 4. updateNextPill rungIdx+1 ──────────────────────────────────
npp_start = js.find("function updateNextPill()")
if npp_start != -1:
    npp_end = js.find("\n}", npp_start) + 2
    npp_fn  = js[npp_start:npp_end]
    has_plus1 = "rungIdx + 1" in npp_fn or "rungIdx+1" in npp_fn
    if not has_plus1:
        ok = False
        print("✗ nextPill: missing rungIdx+1")
    else:
        print("✓ nextPill: rungIdx+1 correct")

print("\n" + ("ALL CHECKS PASSED ✓" if ok else "FAILURES FOUND — see above"))
```

### Updated pre-ship checklist additions

- [ ] Run validation script — zero unguarded missing element references
- [ ] Every function called from `startSession()` chain has a `function X()` definition
- [ ] Every `forEach(id => ...)` loop that writes to DOM uses a null guard
- [ ] After any HTML redesign, grep for all removed element IDs in the JS
- [ ] `updateNextPill()` (and any variant like `updatePressNextPill()`) is called in **two places**: on session init AND after the rung/set index increments in the tap handler. Define the function, then grep for calls — if it only appears once, it's missing one of the two wiring points.
- [ ] The validation script cannot detect missing function call wiring — check next pill, ladder render, and chip log calls manually after building a new program.
