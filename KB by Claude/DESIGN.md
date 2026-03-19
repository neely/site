# KBs by Claude — Design System

This document defines the visual language, component inventory, and interaction rules for all apps in this repo. New programs must follow this spec so the suite feels cohesive.

---

## Philosophy

**The screen is a coaching tool, not a data display.** Every design decision is evaluated by one question: does this help the athlete during a set? If not, it belongs on the summary screen.

Rules that flow from this:
- The biggest element on screen is always the **clock or round counter** — the thing you glance at mid-rep
- Stats that matter for analysis (tonnage, total reps) live on the summary screen only
- Navigation chrome is minimal — you shouldn't need to think about the UI while lifting
- Auto-start next set removes one tap between sets — less friction when fatigued

---

## Color tokens

Every app defines these CSS variables. App-specific accent colors are added on top.

```css
:root {
  --bg:        #0d1117;   /* page background */
  --surface:   #161b22;   /* card / input background */
  --surface2:  #21262d;   /* chip / badge background */
  --border:    #30363d;   /* all borders */
  --ink:       #e6edf3;   /* primary text */
  --dim:       #656d76;   /* secondary text / labels */
  --go:        #3fb950;   /* start / ready state */
  --go-dark:   #0a1f0d;   /* text on go buttons */
  --warn:      #f85149;   /* over target / destructive */
  --gold:      #e3b341;   /* pause button hover */
}
```

### Program accent colors

Each program has a primary accent used for its tap button active state, session header title, and scheme card value.

| Program | Accent | Usage |
|---------|--------|-------|
| DFW | `#e8c547` (gold) | Ladders, sets |
| DFW 2.0 | `#c084fc` (purple) | Distinguishes from DFW 1.0 |
| ABF | `#e8c547` (gold) for ABC, `#7aabe5` (blue) for Press | Two session types |
| Iron Tide Day A | `#58a6ff` (tide blue) | ABC + Carries |
| Iron Tide Day B | `#f0883e` (ember) | Press + Snatch + Push/Pull |

New programs: pick a color not already in use. Avoid red (reserved for over-target warning).

---

## Typography

```
Display / headings:  Playfair Display, serif  (700 weight for titles, 400 italic for emphasis)
Body / monospace:    IBM Plex Mono, monospace  (300 light for big numbers, 400 body, 500 medium labels)
```

Google Fonts import (both apps):
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet">
```

---

## Screen types

### 1. Setup screen

Used once per session. User picks week, day, weights, and any session-specific parameters (EMOM interval, snatch weight).

**Structure (top to bottom):**
- Hero area: program badge (tiny uppercase), program title (Playfair Display large), subtitle
- Optional hero pills describing day types
- Week selector (segmented control, 1–8 split across two rows if needed)
- Day selector (segmented control)
- Today card — describes what today's session is, with targets
- Weight inputs (double bells L/R, optional snatch bell for single-bell movements)
- Optional EMOM interval input (only shown for ABC/EMOM session types)
- Elbow reminder card (Iron Tide only — can be used for any program with injury considerations)
- START button (full width, accent color, slightly rounded)

**Rules:**
- Show/hide fields based on session type — don't show snatch weight on Day A, don't show EMOM on press days
- Uneven bells: show a warning hint when L ≠ R
- START button color matches the day type accent

---

### 2. Cadence clock session

The core session pattern used for: DFW sets, ABF press sets, Iron Tide Day B press/snatch/push-pull.

**Structure (top to bottom):**
- Session header (shared chrome — see below)
- **Cadence area** (flex:1 — takes all available space):
  - Context label (e.g. "SET IN PROGRESS" / "READY" / "LADDER 2-3-5")
  - **Big cadence timer** — `clamp(5rem, 22vw, 7rem)`, IBM Plex Mono 300 weight
    - Idle state: `--dim` color
    - Running state: `--ink` color
    - Over target: `--warn` color
  - Target row: green pip + "target: 60s" label (turns red pip when over)
  - Set meta row: one or two small badges showing secondary info (reps this rung, sets done/target)
  - Ladder rungs (if applicable) — visual rung progress
  - Detail text (weight, targets)
  - Last set feedback (green ✓ or red over)
- **Tap button** (full width minus 1.5rem margins, 96px height)
- Log chips strip
- **Bottom bar:** Next set pill + Pause + End

**Cadence clock behavior:**
- Tap START → clock starts from 0, button flips to live state (bordered, accent color)
- Tap DONE → clock stops, records elapsed, resets to 0, auto-starts next set
- Over target: clock turns red, pip turns red — no penalty, just visual feedback
- Pause: clock freezes at current value, resumes from same point

---

### 3. ABC / EMOM session

Used for: ABF ABC session, Iron Tide Day A ABC phase.

**Structure:**
- Session header
- **ABC center area:**
  - Context label ("READY" / "ROUND IN PROGRESS" / "TARGET REACHED! 🎯")
  - **Big round counter** — Playfair Display 700, `clamp(5rem, 20vw, 6.5rem)`
  - Round separator "/" and target in dim color
  - Exercise description ("2 Cleans · 1 Press · 3 Front Squats")
  - Weight label
  - **EMOM arc** — 120px centered ring, fills clockwise over the interval. No side label. No last-round feedback text. The ring tells the whole story.
- Tap button
- Log chips
- Bottom bar: Next set pill + Pause + End

**EMOM arc — locked design (D-clean):**

120px SVG circle, r=53, circumference=333. Centered below the round counter. Two-element interior: large number on top, small uppercase label underneath. Three states:

| State | Arc fill | Number | Label |
|-------|----------|--------|-------|
| Mid-round | Gold, filling | elapsed seconds | "remaining" |
| Resting / ready | Empty dim | interval target (e.g. 90s) | "interval" |
| Over target | Full red | "+Ns" | "over" in red |

No last-round feedback text anywhere on screen — athlete knows if they hit it.

```html
<!-- Arc HTML — centered, no wrapper row needed -->
<div class="emom-arc-wrap">
  <svg width="120" height="120" viewBox="0 0 120 120">
    <circle class="emom-arc-bg" cx="60" cy="60" r="53"/>
    <circle class="emom-arc-fg" id="emom-arc" cx="60" cy="60" r="53"
      stroke-dasharray="333" stroke-dashoffset="333"/>
  </svg>
  <div class="emom-time-center" id="emom-time">
    <span class="t-sec">—</span>
    <span class="t-lbl" id="emom-lbl">interval</span>
  </div>
</div>
```

```css
.emom-arc-wrap { position:relative; width:120px; height:120px; margin:.5rem 0 .15rem }
.emom-arc-wrap svg { transform:rotate(-90deg) }
.emom-arc-bg  { fill:none; stroke:var(--surface2); stroke-width:6 }
.emom-arc-fg  { fill:none; stroke:var(--accent); stroke-width:6; stroke-linecap:round }
.emom-arc-fg.warn { stroke:var(--warn) }
.emom-time-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.1rem }
.emom-time-center .t-sec { font-size:1.5rem; font-weight:500; font-variant-numeric:tabular-nums; color:var(--ink); line-height:1 }
.emom-time-center .t-lbl { font-size:.48rem; letter-spacing:.1em; text-transform:uppercase; color:var(--dim) }
.emom-time-center .t-sec.warn, .emom-time-center .t-lbl.warn { color:var(--warn) }
```

**When restructuring arc interior — audit all .textContent writes:**

The arc time element is a parent div with two child spans (`.t-sec`, `.t-lbl`). Any JS calling `.textContent` on the parent `emom-time` div will silently destroy both children. Always write to the child spans directly, or use `resetEmomArc()` which handles this correctly. If you see `getElementById('emom-time').textContent = x` anywhere in the JS, it's a bug.

**Timing rule — wall clock, not integer counting:**

Both the EMOM arc and the cadence clock must be driven by `Date.now()`, not an incrementing integer. Integer counting drifts by up to 1-2 seconds relative to the tap time because the interval fires slightly late. Wall clock anchoring eliminates this.

```javascript
// WRONG — drifts up to ~2s from actual elapsed
let elapsed = 0;
setInterval(() => { elapsed++; ... }, 1000);

// CORRECT — always in sync with tap time
const arcStart = Date.now();
setInterval(() => {
  const elapsed = Math.floor((Date.now() - arcStart) / 1000);
  ...
}, 200); // 200ms tick = responsive display, negligible CPU
```

This applies to: EMOM arc, cadence clock, session clock, countdown. All clocks in every app use this pattern.

---

### 4. Carry session

Used for: Iron Tide Day A Carries phase.

**Structure:**
- Same cadence area pattern as cadence clock session
- Context label shows which arm is active ("CARRY 3 IN PROGRESS")
- Big cadence timer counts up (tide blue color when running)
- Detail shows weight + "Suitcase or rack — your call. Switch arm each carry."
- Progress note: "3 / 6 carries done"
- Tap button: START — LEFT ARM → DONE — LEFT ARM → auto-advances to RIGHT ARM
- When all 6 done: button goes neutral, shows "ALL CARRIES DONE ✓"

---

### 5. Phase navigator

Used for: Iron Tide Day A (ABC → Carries), Iron Tide Day B (Press → Snatch → Push/Pull).

**Structure:**
- Phase dots row below session header — one dot per phase
  - Done phases: green border
  - Active phase: accent color fill
  - Future phases: dim border
- Each phase is a full-height panel that shows/hides
- At the bottom of each phase panel (above the stat bar): **phase advance button** — full width, accent color, "ABC done → Carries ›"
- Dots are tappable — can navigate back to review, but not forward past current phase

**Rules:**
- Phase advance button is additive — it doesn't end the session, it moves to the next movement
- End session is always available from any phase
- The session clock runs continuously across all phases

---

### 6. Summary screen

**Structure:**
- Program/day title (Playfair Display, accent color)
- 2-column stat grid: rounds, reps, kg moved, time, any program-specific stats
- Chip log of round/set times
- Elbow check reminder (Iron Tide)
- "← New Session" button

**Rules:**
- This is where tonnage and total reps live — not the session screen
- Summary is built from S (state) at endSession() time — nothing is calculated twice

---

## Shared session header (all session screens)

```
[session clock top-left]        [Week N · Day N — right aligned]
[label: "remaining"/"session"]  [Scheme name in accent color]
────────────────────────────────────────────────────
```

- DFW uses countdown (30:00 → 0:00) — "REMAINING" label
- All other apps use count-up — "SESSION" label
- Scheme name: Playfair Display, accent color, 1rem

---

## Bottom bar

Three pills, flex layout: **Next (flex:2) · Pause (flex:1) · End (flex:1)**. All same height (56px min), same border-radius (7px).

```
[ Next set ×3 · C+P → FSQ  ] [ ⏸ Pause ] [ ⏏ End ]
       flex: 2                   flex: 1     flex: 1
```

**Next set pill** — neutral surface, `--border`
- Tiny uppercase label on top: "NEXT SET" / "NEXT ROUND" / "NEXT CARRY"
- `.85rem` 500-weight content line: the actual next action
- Content by movement type:
  - Ladder: `×3 · C+P → FSQ`
  - ABC: `2 cleans · 1 press · 3 FSQ` (static)
  - Snatch: `Set 3 of 4 · 8L 8R`
  - Push/Pull: `Pushups ×9 → Pullups ×4`
  - Carries: `RIGHT ARM`

**Pause pill** — gold tint background + border, gold text
- `background: rgba(227,179,65,.06)`, `border: 1px solid rgba(227,179,65,.25)`
- Label: "ACTION" in dim gold
- Content: `⏸ Pause` at `.82rem` 500-weight, color `#e3b341`
- When paused: green tint, `▶ RESUME`, full opacity

**End pill** — warm red tint background + border, warn-red text
- `background: rgba(248,81,73,.06)`, `border: 1px solid rgba(248,81,73,.2)`
- Label: "ACTION" in dim red
- Content: `⏏ End` at `.82rem` 500-weight, color `var(--warn)`
- Tapping shows inline two-step confirm — End pill shows "sure? / Yes / No" in same space

---

## Tap button states

| State | Background | Text color | Border |
|-------|-----------|------------|--------|
| Idle (go) | `--go` | `--go-dark` | none |
| Running (accent) | dark tint of accent | accent color | 1.5px accent |
| Done/neutral | `--surface2` | `--dim` | `--border` |

Button is always 96px tall, `border-radius: 12px`, full width minus 1.5rem margins. Font: IBM Plex Mono 500, `.9rem`, `.1em` letter-spacing.

Sub-label (exercise description): `.88rem`, `.04em` letter-spacing, `.9` opacity. **This is the most important text on the button** — it tells you what to do.

---

## Log chips

Horizontal scrolling row of small chips below the tap button. Each chip shows: `×3 45s` (reps + time) or `R4 62s` (round + time) or `LEFT 34s` (side + time).

Fresh chip: accent-colored border, fades to dim after 1.8s.
Over-target chip: red border (DFW cadence sessions only).

---

## Segment controls (week/day selectors)

```css
.seg { display: flex; background: var(--surface); border: 1px solid var(--border); border-radius: 7px; overflow: hidden; }
.seg-btn { flex: 1; padding: .5rem 0; font-size: .78rem; color: var(--dim); }
.seg-btn.active { background: var(--surface2); color: var(--ink); }
```

8-week programs split into two rows of 4. Day selector max-width 200px.

---

## Input fields

```css
input[type=number] {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 7px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  padding: .6rem 2.3rem .6rem .8rem;
}
input[type=number]:focus { border-color: var(--accent); }
```

Unit label (kg, sec) is absolutely positioned right inside the input wrapper.
Spinner arrows hidden via `-webkit-appearance: none`.

---

## Ladder rung display

Used in press sessions. Shows progress through the current ladder.

```
[ 2 ]  [ 3 ]  [ 5 ]
done  current  pending
```

- Done: accent-color border and text, `--surface2` background
- Current: accent-color background, dark text
- Pending: `--border` border, `--dim` text

Rungs are 36–38px squares, `border-radius: 6–7px`.

---

## Today card (setup screen)

Shows the session type and targets before starting. Color-coded by day type via left border (3px, accent color).

```
TODAY'S SESSION           ← tiny uppercase label
Day A — Tide              ← Playfair Display, accent color
8–10 rounds ABC at 90s EMOM   ← dim text, line height 1.6
2 cleans · 1 press · 3 front squats
```

---

## Animation

Single `fadeIn` on screen transition:
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
```

Tap button: `transform: scale(0.97)` on `:active`.
No other animations — keep it fast and distraction-free.

---

## Mobile constraints

- `max-width: 480px`, centered
- `user-select: none`, `-webkit-user-select: none` on tap targets
- `user-scalable=no` in viewport meta
- `apple-mobile-web-app-capable` for full-screen home screen mode
- Wake lock requested on session start, released on summary screen
- No localStorage — all persistence via Google Sheets

---

## File structure per app

Each app is a single self-contained HTML file:
1. `<head>` — meta, fonts, `<style>` with all CSS
2. HTML screens — one `<div class="screen">` per screen, `active` class on visible one
3. `<script>` — program data, state object, all functions, init calls at bottom

The shared library (`kb-lib.js`) documents these patterns as reusable functions but apps currently inline everything for zero-dependency deployment.
