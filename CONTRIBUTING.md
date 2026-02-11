# Contributing Guide

## Monorepo Structure

- Shared components: `packages/components-shared`
- Shared hooks and i18n: `packages/utils`
- UI components: `packages/ui`
- App package: `packages/frontend-app`

## Development Workflow

1. Pull the latest `main` branch.
2. Add or move shared components within the appropriate package.
3. Run `npm run lint`, `npm run format`, and `npx tsc -b`.
4. Ensure CI passes before opening a PR.

## CI/CD

- PRs and `main` pushes run formatting, linting, TypeScript builds, and package builds.

## Notes

- Update `package.json` workspaces when adding a new package.
- Use PRs or issues for questions.
