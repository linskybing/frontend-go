Environment variables used by frontend config

- VITE_API_BASE_URL: (optional) full base URL for API (e.g. https://api.example.com). If not set, the app will default to a local or cluster address derived from `window.location.hostname` or `VITE_USE_K8S_SVC`.
- VITE_BASE_URL: (optional) base host used for WebSocket host and other base paths.
- VITE_API_KEY: (optional) API key injected at build time for service-to-service calls. Treat this value as a secret: only include it in trusted images/builds and never commit the literal key to the repository.
- VITE_USE_K8S_SVC: (optional) set to `true` in cluster dev to use `http://backend:30080` as the API host by default.

Recommendations

- Prefer server-set HttpOnly cookies for user sessions. Only use `VITE_API_KEY` for machine-to-machine or CI builds that are trusted.
- When building images for production or CI, inject `VITE_API_KEY` at build time (CI secrets). Avoid exposing `VITE_API_KEY` in public or developer-facing builds.
- For local development, use `.env.local` and `.env` files but never commit secrets.

Files

- `src/core/config/config.ts` is the single-source of runtime/build-time configuration used by the frontend code.

Security note

- If you need to use `VITE_API_KEY` in a shared image, rotate keys regularly and restrict the key's permissions on the backend.
