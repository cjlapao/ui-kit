# Memory — demo-vite-app

- 2026-06-29 [orchestrator/X1] Scaffolding `demo/` requires bash (mkdir); write tool restricted to .projects/loops/
- 2026-06-29 [general/X1] Key insight: demos import `../../..` from within ui-kit/src/, so Rollup resolves from ui-kit/ not demo/; a custom Vite plugin resolves bare imports from demo/node_modules for source files outside demo/, plus the alias @cjlapao/ui-kit → root/src/index.ts
- 2026-06-29 [general/X1] Extra deps installed for demo: uuid, classnames, clsx, crypto-js, react-icons, recharts, tailwind-merge, @uiw/react-md-editor, react-router-dom
