# Programs

Complete specifications for all 7 programs in the KBs by Claude suite. Each entry answers the design questions from `ADDING_A_PROGRAM.md` and provides the full scheme data needed to build the app from scratch.

---

## 1. DFW — Dry Fighting Weight

**Author:** Geoff Neupert / Pavel Tsatsouline  
**Source:** Widely documented; original in *Kettlebell Strong*  
**Status:** Built — `dfw-demo.html`  
**Accent color:** `#e8c547` gold  
**Program field:** `'DFW'`

### Overview
30-minute session, double kettlebells at 5RM. Clean & Press alternating with Front Squat in ladder format. No fixed rest — cadence is self-regulated by the clock. Goal: accumulate maximum quality volume in 30 minutes.

### Setup inputs
- Week (1–4)
- Day (1–3)
- Bell mode: single or double
- Bell weight(s)
- Target cadence (seconds per set, default 60s)

### Session structure
Single screen. Cadence clock pattern. 30-minute countdown top-left.

### Screen pattern
Pattern A — cadence clock

### Scheme data (week-day → ladder rungs)

| Session | Scheme | Rungs |
|---------|--------|-------|
| W1D1 | Ladders 1–2–3 | [1,2,3] |
| W1D2 | Sets of 1 | [1] |
| W1D3 | Sets of 2 | [2] |
| W2D1 | Ladders 1–2–3 | [1,2,3] |
| W2D2 | Sets of 1 | [1] |
| W2D3 | Sets of 3 | [3] |
| W3D1 | Ladders 1–2–3–4 | [1,2,3,4] |
| W3D2 | Sets of 2 | [2] |
| W3D3 | Sets of 3 | [3] |
| W4D1 | Ladders 1–2–3–4–5 | [1,2,3,4,5] |
| W4D2 | Sets of 3 | [3] |
| W4D3 | Alt 3s & 4s | [3,4] |

### Movement
Each set: **C+P for rung reps → FSQ for rung reps**. Both sides counted equally. Single bell: alternate sides each rung.

### Logging
- Per set: `type:'set'`, reps, cadenceTime, onTarget (cadenceTime ≤ target)
- Session: total sets, total reps, total tonnage, elapsed

---

## 2. DFW 2.0

**Author:** Geoff Neupert  
**Source:** Program progression after completing DFW  
**Status:** Built — `dfw2-coach.html`  
**Accent color:** `#c084fc` purple  
**Program field:** `'DFW2'`

### Overview
Same architecture as DFW — 30 minutes, double KBs, C+P + FSQ — but with higher starting ladder rungs and a longer top rung. Run after completing DFW.

### Setup inputs
Same as DFW.

### Session structure
Single screen. Cadence clock pattern. 30-minute countdown.

### Screen pattern
Pattern A — cadence clock

### Scheme data

| Session | Scheme | Rungs |
|---------|--------|-------|
| W1D1 | Ladders 2–3–4 | [2,3,4] |
| W1D2 | Sets of 2 | [2] |
| W1D3 | Sets of 3 | [3] |
| W2D1 | Ladders 2–3–4 | [2,3,4] |
| W2D2 | Sets of 2 | [2] |
| W2D3 | Sets of 4 | [4] |
| W3D1 | Ladders 2–3–4–6 | [2,3,4,6] |
| W3D2 | Sets of 3 | [3] |
| W3D3 | Sets of 4 | [4] |
| W4D1 | Ladders 2–3–4–6–8 | [2,3,4,6,8] |
| W4D2 | Sets of 4 | [4] |
| W4D3 | Alt 4s & 6s | [4,6] |

### Movement
Same as DFW: C+P then FSQ per rung.

---

## 3. ABF — Armor Building Formula

**Author:** Dan John  
**Source:** *Intervention* and related Dan John writings  
**Status:** Built — `abf-coach.html`  
**Accent colors:** `#e8c547` gold (ABC), `#7aabe5` blue (Press)  
**Program field:** `'ABF'`

### Overview
8-week, 3 days/week, double KBs. Alternates between ABC (Armor Building Complex) and Military Press sessions. ABC uses EMOM format; Press uses ladder format.

### Setup inputs
- Week (1–8)
- Day (1–3)
- Bell weights L/R
- EMOM interval (seconds, shown for ABC days only)

### Session type by week/day
- Odd weeks: Day 1 = Press, Day 2 = ABC, Day 3 = Press
- Even weeks: Day 1 = ABC, Day 2 = Press, Day 3 = ABC

### ABC session
Pattern B — EMOM arc. Round counter as big number.

**ABC movement:** 2 Cleans → 1 Press → 3 Front Squats = 6 reps per round.

**Round targets by week:**

| Week | Min | Max | Note |
|------|-----|-----|------|
| 1 | 5 | 15 | Build capacity |
| 2 | 10 | 20 | Build capacity |
| 3 | 15 | 20 | Phase 2 begins |
| 4 | 18 | 22 | Medium & light |
| 5 | 20 | 25 | Pushing toward 25 |
| 6 | 23 | 27 | Near peak |
| 7 | 28 | 30 | Challenge week |
| 8 | 15 | 20 | Taper |

### Press session
Pattern A — cadence clock. Ladder rungs as secondary badges.

**Press ladders and rep targets by week:**

| Week | Min | Max | Ladder |
|------|-----|-----|--------|
| 1 | 20 | 30 | 2-3-5 |
| 2 | 20 | 30 | 2-3-5 |
| 3 | 15 | 25 | 2-3-5 |
| 4 | 30 | 50 | 2-3-5-10 |
| 5 | 20 | 30 | 2-3-5 |
| 6 | 50 | 70 | 2-3-5-10 |
| 7 | 30 | 50 | 2-3-5 |
| 8 | 80 | 100 | 2-3-5-10 |

### Logging
- ABC: per-round log (round number, seconds, onTarget = sec ≤ emomSec)
- Press: per-set log (set number, reps, seconds)
- Session: type (ABC/Press), rounds or reps, kg moved, elapsed

---

## 4. Iron Tide

**Author:** Custom  
**Source:** Built for this suite  
**Status:** Built — `iron-tide.html`  
**Accent colors:** `#58a6ff` tide blue (Day A), `#f0883e` ember (Day B)  
**Program field:** `'IronTide'`

### Overview
8-week, 3 days/week (A-B-A / B-A-B alternating), double KBs + single snatch bell. Day A = ABC + Carries. Day B = Press + Half Snatch + Push/Pull superset.

### Setup inputs
- Week (1–8), Day (1–3)
- Double bells L/R
- Snatch bell (single, shown for Day B only)
- EMOM interval (shown for Day A only, pre-filled from plan)

### Day type by week/day
- Odd weeks: Day 1 = A, Day 2 = B, Day 3 = A
- Even weeks: Day 1 = B, Day 2 = A, Day 3 = B

### Day A — two phases (phase navigator)

**Phase 1: ABC**  
Pattern B — EMOM arc. Same movement as ABF: 2 Cleans → 1 Press → 3 FSQ.

| Week | Min | Max | EMOM |
|------|-----|-----|------|
| 1 | 8 | 10 | 90s |
| 2 | 10 | 12 | 90s |
| 3 | 12 | 15 | 75s |
| 4 | 15 | 18 | 75s |
| 5 | 18 | 22 | 60s |
| 6 | 20 | 25 | 60s |
| 7 | 25 | 28 | 60s |
| 8 | 28 | 30 | 60s |

**Phase 2: Farmer Carries**  
Pattern A — cadence clock. 6 carries total (3 each side), alternating LEFT/RIGHT. Single-arm, 3 lengths each carry. Suitcase or rack position.

### Day B — three phases (phase navigator)

**Phase 1: Double Press**  
Pattern A — cadence clock. Ladder rungs.

| Week | Min | Max | Ladder |
|------|-----|-----|--------|
| 1–2 | 20 | 30 | 2-3-5 |
| 3–4 | 30 | 40 | 2-3-5 |
| 5–6 | 40 | 60 | 2-3-5-10 |
| 7 | 60 | 80 | 2-3-5-10 |
| 8 | 80 | 100 | 2-3-5-10 |

**Phase 2: Half Snatch**  
Pattern A — cadence clock. Single bell. 8 reps each side per set.

| Week | Sets |
|------|------|
| 1–3 | 3 |
| 4–8 | 4 |

**Phase 3: Push/Pull Superset**  
Pattern A — cadence clock. Pushups then Pullups, no rest between. Rest 90s between supersets. Always 3 supersets.

| Week | Pushups | Pullups |
|------|---------|---------|
| 1 | 9 | 4 |
| 2 | 10 | 4 |
| 3 | 11 | 5 |
| 4 | 12 | 6 |
| 5 | 13 | 6 |
| 6 | 14 | 7 |
| 7 | 15 | 7 |
| 8 | 15 | 8 |

Formula: `push = min(8+week, 15)`, `pull = min(4+floor(week/2), 8)`

### Special: elbow reminder
Shown on setup screen and summary. "Wrist neutral in rack and snatch catch. Pain 3/10 or lower."

---

## 5. The Wolf

**Author:** Geoff Neupert  
**Source:** *More Kettlebell Muscle*  
**Status:** Not yet built  
**Suggested accent:** `#34d399` emerald  
**Program field:** `'Wolf'`

### Overview
6-week, 3 days/week, double KBs at 10RM. Three distinct daily complexes, each 5 reps per exercise. Timed work:rest format — work a complex, rest for the prescribed ratio, repeat for the target sets. Sets progress across weeks, rest ratio tightens.

### Setup inputs
- Week (1–6), Day (1–3)
- Bell weights L/R
- Work:rest ratio (shown, not editable — pulled from plan)

### Session structure
Single screen. Phase navigator not needed — one complex per day.

### Screen pattern
New pattern needed: **timed complex**. User taps START, does the complex (all exercises), taps DONE. Rest timer counts down. When rest is up, auto-start next set. Or: cadence clock counts up for work, then a rest countdown appears before next set.

Simpler implementation: cadence clock for the work set, then a "REST — tap when ready" state before auto-starting. This keeps the tap-to-control pattern.

### Sets and work:rest by week

| Week | Sets/day | Work:Rest |
|------|----------|-----------|
| 1 | 3 | 1:2 |
| 2 | 4 | 1:2 |
| 3 | 5 | 1:2 |
| 4 | 3 | 1:1.5 |
| 5 | 4 | 1:1.5 |
| 6 | 5 | 1:1.5 |

### Daily complexes (all 5 reps each exercise)

**Day 1:**
Clean → Front Squat → Press → Front Squat

**Day 2:**
Clean → Press → Front Squat

**Day 3:**
Front Squat → Clean → Press → Front Squat → Jerk

### Next pill content
"Set N of M · rest Xs after"

### Logging
Per set: complex name, set number, work seconds, rest seconds  
Session: day type, total sets, total reps, elapsed

---

## 6. Maximorum

**Author:** Geoff Neupert  
**Source:** *Kettlebell Maximorum*  
**Status:** Not yet built  
**Suggested accent:** `#f472b6` pink  
**Program field:** `'Maximorum'`

### Overview
12-week, 4 days/week. Two snatch days (single bell, 20 min), two double C+P + FSQ days (30 min). Goal is maximum rounds within the time window. Auto-regulated — start the next set only when breathing is recovered. Two 6-week phases.

### Setup inputs
- Week (1–12), Day (1–4)
- Double bells L/R (for C+P/FSQ days)
- Snatch bell (single, for snatch days)
- Session time limit (20 or 30 min — pulled from plan)

### Day structure (repeating weekly)
- Day 1: Double C+P + FSQ (30 min)
- Day 2: Snatch (20 min)
- Day 3: Double C+P + FSQ (30 min)
- Day 4: Snatch (20 min)

### Session structure
Single screen per session type. Countdown clock. Round counter as big number (same as ABC pattern but with countdown not EMOM arc).

### Screen pattern
Pattern B variant — round counter + countdown clock (no EMOM arc). Tap START to begin round, tap DONE when round is complete. Clock counts down from session limit. No fixed interval — go when recovered.

### Phase structure

**Phase 1 (weeks 1–6):** Build work capacity. Light-medium loading.  
**Phase 2 (weeks 7–12):** Increase density. Same structure, higher volume expectation.

### C+P + FSQ movement
Double clean → double press → double front squat = one round. 5RM bells.

### Snatch movement
Single bell half snatch, 10RM bell. Sets of 5–10 per side. Switch hands as needed.

### Auto-regulation coaching note
Show in the center area: "Start next set when breathing is controlled." This replaces the EMOM countdown — no fixed rest target.

### Next pill content
"Tap when recovered · set N"

### Logging
Per round: movement type (C+P or Snatch), round number, seconds  
Session: day type, total rounds, total reps, elapsed

---

## 7. Iron Cardio (Brett Jones original)

**Author:** Brett Jones  
**Source:** *Iron Cardio* (strongandfit.com)  
**Status:** Not yet built  
**Suggested accent:** `#67e8f9` cyan  
**Program field:** `'IronCardio'`

### Overview
Single bell, clean → press → front squat complex. 1-2-3 ladder (or 2-3-5). Max rounds in a time window (20–30 min). Recovery program — use between harder programs. Auto-regulated, go when ready. No fixed weekly scheme — user picks bell and time window each session.

### Setup inputs
- Bell weight (single)
- Ladder: 1-2-3 or 2-3-5 (user choice)
- Session time (20, 25, or 30 min)

No week/day selector — this program has no fixed weekly progression. Every session is the same structure; the progression is natural density increase over time.

### Session structure
Single screen. Cadence clock pattern. Countdown from chosen time limit.

### Screen pattern
Pattern A — cadence clock. Round counter as secondary badge.

### Movement
Single bell. Each rung: Clean → Press → FSQ for rung reps, switch hands, repeat same reps other side.
- Rung 1: 1L + 1R = 2 reps
- Rung 2: 2L + 2R = 4 reps  
- Rung 3: 3L + 3R = 6 reps
- Full ladder (1-2-3): 12 reps total

Tap START → do the rung → tap DONE. Auto-advance through rungs, cycle back to rung 1 when complete.

### Next pill content
"Rung N of M · ×N each side"

### Logging
Per rung: rung number, reps (each side), seconds  
Session: ladder type, total rounds (full ladders completed), total reps, elapsed

### Notes for building
This is the simplest app in the suite. No week/day data, no EMOM, no phases. Just: pick a bell, pick a ladder, start the clock, tap each rung done. Closest to DFW in architecture — copy DFW, remove week/day selectors, replace scheme data with two ladder options, change countdown to user-selected time.
