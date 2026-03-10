/**
 * Single source of truth for backend API endpoints.
 * Structure mirrors .NET controllers for easy mapping when integrating a .NET API.
 *
 * Base URL is provided by environment (e.g. environment.apiUrl).
 * Services should use: baseUrl + ApiEndpoints.<area>.<action>
 */
export const ApiEndpoints = {
  /** Auth: register, login, token, refresh */
  auth: {
    register: 'api/auth/register',
    login: 'api/auth/login',
    token: 'api/v1/Public/GetAuthToken',
  },
  /** User: session, profile */
  user: {
    getActiveToken: 'api/v1/user/GetActiveSession',
    login: 'api/v1/User/Login',
    getLoggedInUserInfo: 'api/v1/user/GetInfoOfLoggedInUser',
  },
  /** Lookup: reference data */
  lookup: {
    byType: 'Lookup/LookupByType/{lookupType}',
  },
  /** Product Lab: products, search, stats, value-matrix, documents, templates */
  products: {
    base: 'api/products',
    byId: (id: string) => `api/products/${id}`,
    status: (id: string) => `api/products/${id}/status`,
    duplicate: (id: string) => `api/products/${id}/duplicate`,
    search: 'api/products/search',
    stats: 'api/products/stats',
    valueMatrix: (id: string) => `api/products/${id}/value-matrix`,
    documents: (id: string) => `api/products/${id}/documents`,
    documentById: (documentId: string) => `api/products/documents/${documentId}`,
    templates: 'api/products/templates',
  },
} as const;

/** Flattened path keys for backward compatibility. Prefer ApiEndpoints.* for new code. */
export const ApiPaths = {
  TOKEN: ApiEndpoints.auth.token,
  GET_ACTIVE_TOKEN: 'api/v1/user/GetActiveSession?userId={userId}',
  USER_LOGIN: ApiEndpoints.user.login,
  GET_LOGIN_USER_INFO: ApiEndpoints.user.getLoggedInUserInfo,
  GET_LOOKUP_BY_TYPE: ApiEndpoints.lookup.byType,
} as const;
