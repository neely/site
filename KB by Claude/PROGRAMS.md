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
**Source:** *Intervention* / *Mass Made Simple* / *Easy Strength*  
**Status:** Built — `abf-coach.html`  
**Accent colors:** `#e8c547` gold (ABC), `#7aabe5` blue (Press)  
**Program field:** `'ABF'`

### Overview
8-week, 3 days/week, double KBs. Alternates between ABC (Armor Building Complex) and Military Press sessions. ABC uses EMOM format; Press uses ladder format. Two explicit goals: 30 ABC rounds in 30 minutes (W7), and 100 press reps in one session (W8). W7 tapers press volume to set up the W8 press test; W8 tapers ABC to set up the W7 ABC test.

### Setup inputs
- Week (1–8)
- Day (1–3)
- Bell weights L/R
- EMOM interval (seconds, shown for ABC days only)

### Session type by week/day
- Odd weeks (1,3,5,7): Day 1 = Press, Day 2 = ABC, Day 3 = Press
- Even weeks (2,4,6,8): Day 1 = ABC, Day 2 = Press, Day 3 = ABC

### ABC session
Pattern B — EMOM arc. Round counter as big number.

**Movement:** 2 Cleans → 1 Press → 3 Front Squats = 6 reps per round.

**Round targets by week:**

| Week | Min | Max | Note |
|------|-----|-----|------|
| 1 | 5 | 15 | Find your groove with the weight |
| 2 | 10 | 20 | Increase density and speed |
| 3 | 15 | 20 | Start pushing the pace |
| 4 | 18 | 22 | Maintain volume |
| 5 | 20 | 25 | Pushing toward 30-round capacity |
| 6 | 23 | 27 | Near peak capacity |
| 7 | 28 | 30 | **The Goal: 30 rounds in 30 minutes** |
| 8 | 15 | 20 | Taper — Day 1: 15 rounds · Day 3: 20 rounds |

### Press session
Pattern A — cadence clock. Ladder rungs as secondary badges.

**Movement:** Double KB strict military press. Ladders cycling until rep target is reached.

**Press ladders and rep targets by week:**

| Week | Ladder | Min | Max | Note |
|------|--------|-----|-----|------|
| 1 | 2-3-5 | 20 | 30 | Focus on grinding the press |
| 2 | 2-3-5 | 20 | 30 | Focus on grinding the press |
| 3 | 2-3-5 | 15 | 25 | Slight deload before the push |
| 4 | 2-3-5-10 | 30 | 50 | Introduce the 10-rep hypertrophy trigger |
| 5 | 2-3-5 | 20 | 30 | Focus on speed and power |
| 6 | 2-3-5-10 | 50 | 70 | High volume peak |
| 7 | 2-3-5-10 | 40 | 60 | Taper — Day 1: 3 ladders (60 reps) · Day 3: 2 ladders (40 reps) |
| 8 | 2-3-5-10 | 80 | 100 | **The Goal: 100 total press reps — 5 full rounds of the ladder** |

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

---

## 8. Single KB ABC Experiment

**Author:** Dan John  
**Source:** *Intervention* / *Easy Strength*  
**Status:** Not yet built  
**Suggested accent:** `#7aabe5` blue (same family as ABF press)  
**Program field:** `'SingleABC'`

### Overview
6-week single-bell program developed by Dan John to address the high squat volume that occurs when performing ABCs with only one kettlebell. Alternates between twice-a-week and once-a-week training frequency. One "round" = both sides (left then right, no rest between).

### Setup inputs
- Week (1–6)
- Session number within week (1 or 2 for 2x weeks, 1 for 1x weeks)
- Bell weight (single)
- Session time limit (optional — Week 4 specifies 20 min target)

### Session type by week
| Week | Frequency | Sessions/week |
|------|-----------|---------------|
| 1 | 2x/week | 2 |
| 2 | 1x/week | 1 |
| 3 | 2x/week | 2 |
| 4 | 1x/week | 1 |
| 5 | 2x/week | 2 |
| 6 | 1x/week | 1 |

### Session structure
Single screen. Pattern B — EMOM arc (or density — no fixed interval, just max rounds in time). One movement type, no phases.

### Movement
Single bell: (2 Clean + 1 Press + 3 Front Squat) Left side → immediately (2 Clean + 1 Press + 3 Front Squat) Right side = 1 round.

### Round targets by week
| Week | Freq | Target Rounds | Note |
|------|------|---------------|------|
| 1 | 2x/week | 5–10 | Build the pattern |
| 2 | 1x/week | 10–12 | Consolidate |
| 3 | 2x/week | 12–15 | Build density |
| 4 | 1x/week | 15 (in 20 min) | Time-capped test |
| 5 | 2x/week | 15–20 | Push volume |
| 6 | 1x/week | **20 rounds** | The Goal |

### Notes for building
Simplest ABC variant. No press session to alternate with — every session is the same movement. Frequency varies by week rather than day. The setup screen should show frequency for the selected week and let the user pick which session (1 or 2) they're on for 2x weeks.

---

## 9. Kettlebell Easy Strength

**Author:** Dan John  
**Source:** *Easy Strength* / *Intervention*  
**Status:** Not yet built  
**Suggested accent:** `#a3e635` lime  
**Program field:** `'EasyStrength'`

### Overview
Dan John's "strength floor" — 5 days/week, never to failure, always feeling easy. Follows his five fundamental human movements. The kettlebell adaptation uses 2 sets of 5 across each pattern. The principle: the load should always feel manageable; the goal is consistency over intensity.

### Setup inputs
- Bell weight (for press, row, goblet squat)
- No week/day selector — this is an ongoing daily practice, not a timed program
- Optional: swing count target (default 75)

### Session structure
Single screen. No countdown, no EMOM. Each movement is a set — tap START, tap DONE, move to next. Cadence clock pattern for timing, but no target cadence. Five movements in sequence.

### Movement sequence (one session)
| Movement | Scheme | Notes |
|----------|--------|-------|
| **Press** | 2 × 5 | Single KB military press — alternate sides or double bell |
| **Pull** | 2 × 5 | Gorilla row or pull-up |
| **Hinge** | 75–100 swings | Total — can be broken into sets as needed |
| **Squat** | 2 × 5 | Goblet squat |
| **Carry** | 1–2 sets | Suitcase carry — one or two lengths each side |

### Screen pattern
New simple pattern: sequential movement list. Each movement shows as the current item with a tap button. When done, advances to the next. No phases, no EMOM, no countdown — just a checklist with timers.

### Next pill content
Name of the next movement in sequence.

### Logging
Per movement: name, sets, reps, seconds  
Session: all 5 movements completed (boolean), total time, weight used

### Notes for building
This is a fundamentally different interaction pattern from the other apps — it's a linear checklist of 5 movements rather than repeated rounds of one movement. Closest analogy is the phase navigator (Iron Tide) but without the tap-done-to-log mechanic; each movement just has START and DONE taps with a cadence clock. Could be built as a simplified phase navigator with 5 phases and no phase advance button — just tap DONE on each set and it auto-advances.

---

## 10. The Giant Series

**Author:** Geoff Neupert  
**Source:** *The Giant* program series  
**Status:** Not yet built  
**Suggested accent:** `#fb923c` orange  
**Program field:** `'Giant'`

### Overview
Double KB Clean & Press only. 20–30 minute time cap. Clean every single rep — no exceptions. Autoregulated rest between sets. Four variants covering foundation through pure strength. Weight is 10RM for 1.0–1.2, 5RM for 3.0.

### Setup inputs
- Variant (1.0 / 1.1 / 1.2 / 3.0)
- Week (1–4)
- Day (1–3)
- Double bell weights L/R
- Session time (20 or 30 min)

### Session structure
Single screen. Cadence clock pattern. Countdown from time limit. User taps START, does the set (clean every rep), taps DONE. Rest as needed, repeat.

### Screen pattern
Pattern A — cadence clock. Countdown clock top-left. Set count as secondary badge.

### Movement
Double clean → double press, repeating for the target rep count. Clean every rep — no rack between reps.

### Scheme data

**Giant 1.0 — Foundation (10RM)**

| Week | Day 1 | Day 2 | Day 3 |
|------|-------|-------|-------|
| 1 | Sets of 5 | Sets of 6 | Sets of 4 |
| 2 | Sets of 6 | Sets of 7 | Sets of 5 |
| 3 | Sets of 7 | Sets of 8 | Sets of 6 |
| 4 | Sets of 8 | Sets of 9 | Sets of 7 |

**Giant 1.1 — Intermediate (10RM)**

| Week | Day 1 | Day 2 | Day 3 |
|------|-------|-------|-------|
| 1 | Sets of 6 | Sets of 7 | Sets of 5 |
| 2 | Sets of 7 | Sets of 8 | Sets of 6 |
| 3 | Sets of 8 | Sets of 9 | Sets of 7 |
| 4 | Sets of 9 | Sets of 10 | Sets of 8 |

**Giant 1.2 — Hypertrophy Peak (10RM)**

| Week | Day 1 | Day 2 | Day 3 |
|------|-------|-------|-------|
| 1 | Sets of 7 | Sets of 8 | Sets of 6 |
| 2 | Sets of 8 | Sets of 9 | Sets of 7 |
| 3 | Sets of 9 | Sets of 10 | Sets of 8 |
| 4 | Sets of 10 | Sets of 11 | Sets of 9 |

**Giant 3.0 — Pure Strength (5RM)**

| Week | Day 1 | Day 2 | Day 3 |
|------|-------|-------|-------|
| 1 | Sets of 1 | Sets of 2 | Sets of 3 |
| 2 | Sets of 2 | Sets of 3 | Sets of 1 |
| 3 | Sets of 3 | Sets of 1 | Sets of 2 |
| 4 | 1-2-3 Ladder | 1-2-3 Ladder | 1-2-3 Ladder |

### Coaching notes
- Track total reps per session. Week 2 total should exceed Week 1 — density is the metric.
- If overhead lockout feels soft, increase rest. This is strength/hypertrophy, not cardio.
- When timer beeps, session ends — even mid-set.

### Next pill content
`Set N · ×M C+P`

### Logging
Per set: set number, reps, seconds  
Session: variant, total sets, total reps, kg moved, elapsed

### Notes for building
Closest to Maximorum in architecture — countdown clock, autoregulated rest, tap START/DONE per set. Main difference: rep count is fixed per day (not autoregulated). Setup screen needs a variant selector (1.0/1.1/1.2/3.0) in addition to week/day. Week 4 Day 1-3 of 3.0 are ladders not fixed sets — needs the rung cycling pattern from DFW.

---

## 11. King-Sized Killer 1.0 (KSK)

**Author:** Geoff Neupert  
**Source:** *King-Sized Killer*  
**Status:** Not yet built  
**Suggested accent:** `#a3e635` lime  
**Program field:** `'KSK'`

### Overview
Single KB snatch only. 3 days/week, 9 weeks across 3 phases. 20-minute sessions (max sets in time). L then R each set. Goal is to beat total rep count from previous week. Weight is 7–8RM.

### Setup inputs
- Week (1–9)
- Day (1–3)
- Bell weight (single)
- Session time (20 min fixed)

### Session structure
Single screen. Cadence clock pattern. Countdown from 20 min. Each tap = one set done (L+R). Ladder rungs cycle per day scheme.

### Screen pattern
Pattern A — cadence clock. Countdown top-left. Rung display as secondary badge (same as DFW press days).

### Phase and scheme data

**Phase 1 — Power (Weeks 1–3)**

| Day | Ladders |
|-----|---------|
| Day 1 | 1, 2, 3 |
| Day 2 | 1, 2 |
| Day 3 | 1, 2, 3, 4 |

Scheme repeats identically across weeks 1, 2, 3.

**Phase 2 — Strength (Weeks 4–6)**

| Day | Ladders |
|-----|---------|
| Day 1 | 2, 3, 4 |
| Day 2 | 2, 3 |
| Day 3 | 2, 3, 4, 5 |

Scheme repeats identically across weeks 4, 5, 6.

**Phase 3 — Conditioning (Weeks 7–9)**

| Day | Sets |
|-----|------|
| Day 1 | Sets of 5 |
| Day 2 | Sets of 4 |
| Day 3 | Sets of 6 |

Scheme repeats identically across weeks 7, 8, 9.

### Movement
Single bell snatch. Each rung: snatch L for rung count, switch, snatch R for rung count. "Punch" the ceiling at the top. Stop if grip fails.

### Coaching notes
- Goal each week: beat previous week's total reps
- Grip management: stop the set if grip starts to fail
- Shoulder health: excellent after a pressing block like ABF

### Next pill content
Phase 1–2: `Rung N · ×M each side`  
Phase 3: `Set N · ×M each side`

### Logging
Per set: rung/set number, reps (each side), seconds  
Session: phase, total sets, total reps, elapsed

### Notes for building
Phases 1–2 use rung cycling (same as DFW). Phase 3 uses fixed sets (same as Maximorum). The week selector drives which phase and which day scheme. Since the scheme is identical across all 3 weeks within a phase, the data object only needs one entry per phase-day combination, not per week-day.

---

## 12. GiantKiller (Hybrid)

**Author:** Geoff Neupert  
**Source:** *GiantKiller* hybrid program  
**Status:** Not yet built  
**Suggested accent:** `#f59e0b` amber  
**Program field:** `'GiantKiller'`

### Overview
Alternating strength (grind) and power (ballistic) hybrid. Giant press days alternate with KSK snatch days across a 4-week repeating block. Premier fat-loss and conditioning hybrid. 20–30 minute sessions.

### Schedule pattern (repeating 4-week block)

| Week | Day 1 | Day 2 | Day 3 |
|------|-------|-------|-------|
| A | KSK Snatch | Giant Press | KSK Snatch |
| B | Giant Press | KSK Snatch | Giant Press |

Week A and Week B alternate. Within each, the specific scheme follows KSK Phase 1/2 ladders and Giant 1.0/1.1 sets respectively.

**Sample 4-week block:**

| Week | Monday | Wednesday | Friday |
|------|--------|-----------|--------|
| 1 | KSK (1,2,3) | Giant (×5) | KSK (1,2) |
| 2 | Giant (×6) | KSK (1,2,3,4) | Giant (×4) |
| 3 | KSK (1,2,3) | Giant (×6) | KSK (1,2) |
| 4 | Giant (×7) | KSK (1,2,3,4) | Giant (×5) |

### Setup inputs
- Week (1–4, repeating)
- Day (1–3)
- Double bells L/R (for Giant days)
- Single bell (for KSK days)
- Session time (20 or 30 min)

### Session structure
Two distinct session types per day — app detects from week/day which type to show. Giant days: double KB cadence clock. KSK days: single KB cadence clock with rung display.

### Screen pattern
Pattern A — cadence clock, countdown. Session type auto-detected from week/day.

### Coaching notes
- Giant builds "show" muscles (shoulders/chest)
- KSK builds "go" muscles (glutes/lats/hamstrings)
- Both done for 20–30 minutes autoregulated

### Notes for building
This is essentially two programs in one file — detect session type from week/day, show the appropriate setup and session screen. Closest existing architecture: Iron Tide (two day types, same week/day selector). Setup screen shows different fields depending on detected day type (double bells vs single bell). Could also be built as two separate apps (Giant + KSK) with GiantKiller as just a scheduling guide in the setup card.
