# KBs by Claude

**Open-source iPhone web apps for kettlebell programs — built with AI, designed for real training.**

Static HTML apps that live on your home screen, log to Google Sheets, and work offline. No app store. No subscription. No algorithm. Just clean coaching apps for proven programs.

---

## Programs included

| App | Program | Author | Type |
|-----|---------|--------|------|
| `dfw-demo.html` | Dry Fighting Weight (DFW) | Geoff Neupert / Pavel | Double KB, ladders, 30 min |
| `dfw2-coach.html` | DFW 2.0 | Geoff Neupert | Double KB, ladders, 30 min |
| `abf-coach.html` | Armor Building Formula (ABF) | Dan John | Double KB, complex + press, 8 weeks |
| `iron-tide.html` | Iron Tide | Custom | Double KB, 8 weeks, 3×/week |

**Dashboard:** `workout-dashboard.html` — reads your Google Sheet and shows tonnage timeline, consistency heatmap, and session history.

---

## Deploy in 5 minutes

### 1. Fork this repo

Click **Fork** on GitHub.

### 2. Enable GitHub Pages

Settings → Pages → Source: Deploy from branch → `main` → `/root`

Your apps are now live at `https://yourusername.github.io/kbs-by-claude/`

### 3. Set up Google Sheets logging (optional but recommended)

1. Create a new Google Sheet
2. Extensions → Apps Script → paste contents of `backend/WorkoutLogger.gs`
3. Deploy → New deployment → Web app → Execute as: Me → Who has access: **Anyone**
4. Copy the `/exec` URL
5. Open each HTML file, find `const APPS_SCRIPT_URL` and paste your URL

### 4. Add to iPhone home screen

Safari → Share → Add to Home Screen

Each app runs full-screen with no browser chrome.

---

## How it works

- **No framework.** Pure HTML/CSS/JS, single files per app.
- **No localStorage.** Safari purges it after 7 days of inactivity. All data goes to Google Sheets via a Apps Script webhook.
- **Wake lock.** Screen stays on during sessions (iOS 16.4+).
- **Pause/Resume.** All clocks freeze and restore correctly across all movements.
- **Offline capable.** Works without network; logs queue until connectivity returns (coming soon).

---

## Repo structure

```
kbs-by-claude/
├── README.md
├── DESIGN.md               # Design system and component rules
├── ADDING_A_PROGRAM.md     # How to build a new program app
├── kb-lib.js               # Shared JS library (reference — inlined in apps)
│
├── apps/
│   ├── dfw-demo.html
│   ├── dfw2-coach.html
│   ├── abf-coach.html
│   ├── iron-tide.html
│   └── workout-dashboard.html
│
├── mockups/
│   └── screens.html        # Static mockup of all screen types
│
└── backend/
    └── WorkoutLogger.gs    # Google Apps Script
```

---

## Design system

See [DESIGN.md](./DESIGN.md) for the full component inventory, color tokens, typography rules, and screen pattern specs.

---

## Adding a new program

See [ADDING_A_PROGRAM.md](./ADDING_A_PROGRAM.md) for a step-by-step guide. A new program app takes roughly 2–3 hours to build using the existing patterns.

---

## Programs on the roadmap

- The Giant (Neupert) — EMOM C+P, 3 versions
- Right of Strength (Neupert) — 3-lift percentage-based
- The Wolf (Neupert) — 3-day complex program, 6 weeks
- Maximorum (Neupert) — snatch + C+P/FSQ, 12 weeks

---

## Credits

Programs are the intellectual property of their respective authors (Geoff Neupert, Pavel Tsatsouline, Dan John). This repo contains only the coaching app infrastructure — not the programs themselves. Buy the programs. They're worth it.

Built entirely with [Claude](https://claude.ai) by Anthropic. Every line of HTML, CSS, JS, and documentation was written in conversation with Claude Sonnet.

---

## License

MIT. Fork it, modify it, build your own programs with it.
