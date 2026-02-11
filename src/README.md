# Source Code Structure

Feature-based architecture for better scalability and maintainability.

## Directory Structure

### Features (Domain-Driven)

- `admin/` - Admin dashboard & user/project management
- `auth/` - Authentication (sign in/up)
- `forms/` - Form submissions & approvals
- `groups/` - Group management & membership
- `projects/` - Project creation & config management
- `storage/` - File browser & persistent volumes
- `monitoring/` - Real-time logs & resource monitoring

### Core Infrastructure

- `config/` - App configuration & constants
- `context/` - React contexts (auth, theme, WebSocket)
- `interfaces/` - TypeScript type definitions
- `services/` - API client functions
- `layout/` - App layout & sidebar
- `response/` - API response types

### Shared (Project-specific)

- `components/` - Header & navigation
- `hooks/` - Custom React hooks
- `utils/` - Helper functions
- `icons/` - SVG icon components

## Packages (Reusable)

- `@nthucscc/ui` - UI components
- `@nthucscc/components-shared` - Feature components
- `@nthucscc/utils` - Utilities & i18n
