# Architecture Guidelines

This document describes the folder structure, conventions, and how to extend the app so it stays easy to understand, scalable, and reusable—especially when integrating a .NET (or other) backend.

---

## Folder structure

```
src/app/
├── core/                    # App-wide singletons (one instance)
│   ├── ai/                  # AI orchestration, adapters, prompts
│   ├── feature-flags/
│   ├── guards/              # Route guards (auth, onboarding, public)
│   ├── interceptors/        # HTTP interceptors (auth, error, loader, telemetry)
│   ├── observability/      # Logging, metrics, tracing
│   └── services/           # Auth, token refresh, websocket
│
├── features/               # Lazy-loaded feature modules
│   ├── auth/
│   ├── campaign-engine/
│   ├── dashboard/
│   ├── intelligence-hub/
│   ├── landing/
│   ├── persona-forge/
│   ├── product-lab/
│   ├── prospect-hunter/
│   ├── settings/
│   └── strategy-studio/
│
├── shared/                 # Reusable across features
│   ├── components/         # UI components (buttons, inputs, layout)
│   ├── constants/          # API endpoints, app constants
│   ├── enums/
│   ├── models/             # DTOs and domain models
│   ├── modules/            # Shared module barrels (e.g. shared-imports)
│   ├── services/          # API and domain services
│   └── state/              # Stores (e.g. campaign, persona, product)
│
├── app.config.ts
├── app.routes.ts
└── app.component.*
```

**Rules of thumb**

- **core/** — Use for app-wide, singleton services (auth, HTTP interceptors, AI, feature flags). No feature-specific UI.
- **features/** — One folder per feature. Each can have its own routes, components, and feature-specific models.
- **shared/** — Only for code used by **more than one feature** or by core. Keep it generic and reusable.

---

## Where to add what

| Task | Where |
|------|--------|
| New feature (e.g. “Reports”) | `features/reports/` with its own `*.routes.ts` and components |
| New API endpoint | `shared/constants/api-endpoints.ts` (see Backend integration below) |
| New HTTP interceptor | `core/interceptors/<name>.interceptor.ts`, then register in `app.config.ts` |
| New route guard | `core/guards/<name>.guard.ts` |
| New reusable UI component | `shared/components/<name>/` |
| New reusable service | `shared/services/` or `core/services/` if app-wide |
| New model/DTO | `shared/models/` if shared; otherwise inside the feature folder |
| New AI adapter or prompt | `core/ai/` |

---

## Feature module pattern

Each feature under `features/` should:

1. Expose a route config (e.g. `feature-name.routes.ts`) and be lazy-loaded from `app.routes.ts`.
2. Keep feature-specific components and models inside its folder.
3. Import shared code from `shared/` (and core when needed); avoid feature-to-feature imports.

---

## Backend integration (e.g. .NET)

The app is structured so a .NET (or any) API can be plugged in with minimal friction.

- **Base URL** — Set per environment in `src/configurations/*.json` (e.g. `apiUrl`, `authUrl`). The app uses these so you can point to different backends per environment.
- **Endpoints** — All endpoint **paths** live in **one place**: `shared/constants/api-endpoints.ts`. Structure them by area (e.g. `auth`, `user`, `lookup`) so they map clearly to .NET controllers.
- **Services** — API-calling services typically use a base URL from config + a path from `ApiEndpoints`. For a shared base HTTP service, see `shared/services/base-api.service.ts`; inject the base URL (e.g. from an `EnvironmentService` or `APP_CONFIG`) so it stays environment-specific and reusable.

Adding a new .NET controller usually means:

1. Adding the new paths under `ApiEndpoints` in `api-endpoints.ts`.
2. Adding or extending a service in `shared/services/` (or in a feature) that calls those endpoints using the configured base URL.

See **docs/BACKEND_INTEGRATION.md** for step-by-step backend setup and examples.

---

## Shared modules and imports

Reusable Material and shared modules are centralized in:

- **`shared/modules/shared-imports.ts`** — Exports `MATERIAL`, `SHARED_MODULES`, and `SHARED_COMPONENTS` for use across features. Use this instead of scattering Material imports everywhere so the structure stays consistent and reusable.

---

## Summary

- **Single place for API paths** → `shared/constants/api-endpoints.ts`
- **Single place for HTTP interceptors** → `core/interceptors/` + `app.config.ts`
- **Single place for shared UI/modules** → `shared/modules/shared-imports.ts` and `shared/components/`
- **Backend-agnostic** → Base URL from config; endpoints and services designed so you can plug in a .NET (or other) API and scale without restructuring.
