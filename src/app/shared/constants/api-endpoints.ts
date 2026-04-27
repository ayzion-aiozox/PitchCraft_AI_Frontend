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
    byType: 'api/lookup/LookupByType/{lookupType}',
  },
  /** Product Lab: products, search, stats, value-matrix, documents, templates */
  products: {
    base: 'api/products',
    /** Start a web extraction job */
    extract: 'api/products/extract',
    /** Poll extraction job */
    extractById: (extractionId: string) => `api/products/extract/${extractionId}`,
    /** Download extracted markdown */
    extractDownloadMd: (extractionId: string) => `api/products/extract/${extractionId}/download`,
    /** Download extracted pdf */
    extractDownloadPdf: (extractionId: string) => `api/products/extract/${extractionId}/download/pdf`,
    byId: (id: string) => `api/products/${id}`,
    status: (id: string) => `api/products/${id}/status`,
    duplicate: (id: string) => `api/products/${id}/duplicate`,
    search: 'api/products/search',
    stats: 'api/products/stats',
    valueMatrix: (id: string) => `api/products/${id}/value-matrix`,
    documents: (id: string) => `api/products/${id}/documents`,
    /** Multipart upload: form field name `file` (see ProductService.uploadDocument). */
    documentUpload: (id: string) => `api/products/${id}/documents/upload`,
    documentById: (documentId: string) => `api/products/documents/${documentId}`,
    templates: 'api/products/templates',
    /** Embed via BFF; body includes `collection_id` (Qdrant id from login, see LocalStorageConstant.QdrantCollectionId). */
    embed: (id: string) => `api/products/${id}/embed`,
    analyzeKnowledge: (id: string) => `api/products/${id}/analyze-knowledge`,
    analyzeStrategic: (id: string) => `api/products/${id}/analyze-strategic`,
    marketRadar: (id: string) => `api/products/${id}/market-radar`,
    generateValueMatrix: (id: string) => `api/products/${id}/generate-value-matrix`,
    score: (id: string) => `api/products/${id}/score`,
    auditLive: 'api/products/audit-live',
    /** BFF ContextBuilder: AI-suggested values for empty form fields (optional; 404 OK). */
    proposedFields: (id: string) => `api/products/${id}/proposed-fields`,
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
