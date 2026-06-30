# State — demo-vite-app

## project root (from pwd): /home/cjlapao/code/cjlapao/ui-kit
## canonical loop dir (relative to project root): .projects/loops/demo-vite-app/
## INVARIANTS: built-in tools + relative paths only; absolute prefix comes from pwd, never typed; never continue if a state write fails

## X1 — Scaffold `demo/` Vite + React + Tailwind app
- status: complete
- last_evidence: npm install exited cleanly; Vite 7.3.6, React 19.2.7, Tailwind 4.3.2 installed
- updated: 2026-06-29

## X2 — Wire `demo/` scripts + entry
- status: complete
- last_evidence: App.tsx renders <UxDemo /> from ../../src/pages/UxDemo/UxDemo
- updated: 2026-06-29

## X3 — Verify `npm run build`
- status: complete
- last_evidence: vite build → demo/build/ (1759 modules, 0 errors)
- updated: 2026-06-29
