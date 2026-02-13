# Backend Integration Guide

This guide explains how to wire the Angular app to a .NET (or any) backend in a scalable, reusable way.

---

## 1. Configure the API base URL

Base URLs are environment-specific and come from config files:

- **Development:** `src/configurations/developmentConfig.json`
- **Staging / QA / Production:** `src/configurations/stagingConfig.json`, `qaConfig.json`, `productionConfig.json`

Example:

```json
{
  "apiUrl": "https://your-api.example.com/api",
  "authUrl": "https://your-api.example.com/auth",
  "adminPortalUrl": "https://admin.example.com"
}
```

The app loads the right config per build (e.g. via `environment.ts` or your build pipeline). Use `apiUrl` as the base for all API calls so switching environments is a single place change.

---

## 2. Define endpoints in one place

All endpoint **paths** (no base URL) live in:

**`src/app/shared/constants/api-endpoints.ts`**

Structure mirrors your backend (e.g. .NET controllers):

```ts
export const ApiEndpoints = {
  auth: {
    login: 'api/auth/login',
    token: 'api/v1/Public/GetAuthToken',
  },
  user: {
    login: 'api/v1/User/Login',
    getLoggedInUserInfo: 'api/v1/user/GetInfoOfLoggedInUser',
  },
  lookup: {
    byType: 'Lookup/LookupByType/{lookupType}',
  },
  // Add new areas as you add backend controllers:
  // campaigns: { list: 'api/campaigns', create: 'api/campaigns', ... },
} as const;
```

**When you add a new .NET controller:**

1. Add a new section (or keys) under `ApiEndpoints`.
2. Use path parameters with `{paramName}`; services replace these via `BaseApiService.appendUrlParams` (or your own helper).

This keeps the app easy to understand and reusable across environments.

---

## 3. Use a base URL in services

API-calling services should:

- Get the **base URL** from your config (e.g. `environment.apiUrl` or an injected config service).
- Use **paths** from `ApiEndpoints` only (no hardcoded full URLs).

Example pattern (conceptual):

```ts
// In a service that extends BaseApiService or uses HttpClient
this.http.get(`${this.config.apiUrl}/${ApiEndpoints.lookup.byType}`, ...);
```

If you use `BaseApiService`, set its `apiUrl` from config (e.g. in the constructor via an injected environment/config service) so all derived services stay environment-agnostic and reusable.

---

## 4. HTTP interceptors

Interceptors are registered once in **`app.config.ts`** and apply to all HTTP calls:

- **authInterceptor** — Adds `Authorization: Bearer <token>` from storage.
- **errorInterceptor** — Central place for error handling (e.g. 401 redirect to login).
- **loaderInterceptor** — Global loading state.
- **telemetryInterceptor** — Logging/tracing.

To add a new interceptor:

1. Create `core/interceptors/<name>.interceptor.ts`.
2. Add it to the `withInterceptors([...])` array in `app.config.ts`.

This keeps behavior consistent and the structure easy to scale.

---

## 5. Checklist for a new backend (e.g. .NET)

- [ ] Set `apiUrl` (and optional `authUrl`) in each environment config.
- [ ] Add all endpoint paths to `api-endpoints.ts`, grouped by controller/area.
- [ ] Ensure services use config base URL + `ApiEndpoints` (no hardcoded full URLs).
- [ ] Use `authInterceptor` (and optionally error/loader) so all requests are consistent.
- [ ] Add new endpoints only in `api-endpoints.ts` and new services in `shared/services/` or the relevant feature.

Following this keeps the project easy to understand, scalable, and reusable when you integrate .NET or any other backend.
