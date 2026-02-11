# Frontend (monorepo)

This repository is a Vite + React + TypeScript monorepo (npm workspaces). It contains reusable UI packages and a frontend application.

Key points

- Workspace packages: `packages/components-shared`, `packages/ui`, `packages/utils`, `packages/frontend-app`.
- Root package scripts build and manage workspaces; most package builds use `tsc -b`.

Prerequisites

- Node.js (recommend v18+)
- npm (or yarn)

Quick start (development)

```bash
# from repo root
npm install
npm run dev:app   # runs the frontend app (workspace)
```

References: This repository uses per-folder `REFERENCES.md` files plus a root `REFERENCES.md` index at the project root. Before editing components, check the nearest `REFERENCES.md` for implementation notes and add a short entry describing your change and rationale when you modify files.

Build (production)

```bash
npm run build      # builds types and runs vite build
npm run build:packages   # build packages (may be required in CI)
```

Useful scripts

- `npm run dev` — start vite at root (general dev)
- `npm run dev:app` — start `packages/frontend-app` dev server
- `npm run build` — typecheck and build
- `npm run lint` / `npm run lint:fix` — eslint
- `npm run format` — prettier

## Kubernetes deployment notes (frontend)

- Development (local): Run the frontend dev server on the host for fast iteration. Using `tmux` or a process manager is recommended for long-running sessions:

  ```bash
  cd frontend
  tmux new -s frontend
  npm run dev
  ```

- Container and deploy to Kubernetes: To deploy the frontend to a cluster:
  1.  Run `npm run build` in the monorepo root or `packages/frontend-app` to produce static files.
  2.  Build a Docker image using the project Dockerfile or a custom Dockerfile.
  3.  Set the image name to your registry (e.g. `registry:5000/namespace/frontend:tag`).
  4.  Push the image to your registry and update the frontend manifest image, then run `kubectl apply -f <frontend-manifest>.yaml`.

- Note: For development, the host dev server is convenient. For cluster deployment, ensure static files and environment variables (API endpoint) point to the cluster backend.

Workspace packages overview

- `packages/frontend-app` — the application; run with `npm run dev:app`.
- `packages/ui` — UI primitives/components (build with `npm run build:packages` or `npm run -w @nthucscc/ui build`).
- `packages/components-shared` — small shared components and helpers.
- `packages/utils` — utility functions and scripts (i18n helpers, build helpers).

Project layout (important paths)

- `src/` — app source (App.tsx, main.tsx, pages/, components/)
- `packages/` — local reusable packages
- `public/` — static assets
- `vite.config.ts`, `tsconfig.*.json` — build configs

Environment

- Create a `.env` in project root or `packages/frontend-app` if needed to set API endpoints, e.g. `VITE_API_URL`.

Notes

- This repo uses TypeScript project references; building packages before the app is recommended in CI.
- Check `packages/*/package.json` for package-specific scripts.

For package-specific documentation or CI instructions, see the package folders or add dedicated README files under `packages/frontend-app`.
