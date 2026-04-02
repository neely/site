What to bring over:
The repo files are your grounding context. Everything a fresh Claude needs is in these docs:
Core docs (drop all into Project Knowledge):

DESIGN.md — locked UI/UX spec, clock contracts, arc spec, color system
PROGRAMS.md — all 12 program schemes
ADDING_A_PROGRAM.md — build guide, patterns, validation script, pre-ship checklist
kb-lib.js — shared library reference

The apps themselves — Projects allow file uploads but there's a size/count limit. You don't need all 7 in knowledge permanently. My suggestion: keep the docs in Project Knowledge permanently, and upload specific app HTMLs only when you're actively working on them. Iron Tide is your current training app so that one is worth keeping in.
What you don't need to bring:

This conversation — the docs capture everything that matters
The mockup files — reference only, not needed for building
The dashboard — separate concern, bring it when you need it

Instructions for the first message in the new project:
Start with something like:

"We are continuing development of KBs by Claude — a suite of static HTML kettlebell coaching apps. The attached files are the grounding docs. Read DESIGN.md, PROGRAMS.md, ADDING_A_PROGRAM.md, and kb-lib.js before doing anything. I am currently running Iron Tide (Week 1, 16kg). Next program is ABF."

That's it. The docs are written for me — a fresh Claude reading them cold should be able to pick up exactly where we left off.