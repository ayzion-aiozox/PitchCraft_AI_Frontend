/**
 * Auth API contract (aligns with .NET backend: POST /api/auth/register, POST /api/auth/login).
 * All API responses use a wrapper: { success: boolean, data?: T, message?: string }.
 */

/** Request: POST /api/auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Request: POST /api/auth/register */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

/** User object returned in auth responses */
export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  currentWorkspaceId?: string;
  /** Workspace’s Qdrant collection id (embed `collection_id`) */
  qdrantCollectionId?: string;
  createdAt?: string;
}

/** Success payload inside data for login/register */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}

/** Raw API success response (200/201) */
export interface AuthApiSuccessResponse {
  success: true;
  data: AuthTokens;
}

/** Raw API error response (400/401) */
export interface AuthApiErrorResponse {
  success: false;
  message: string;
}

export type AuthApiResponse = AuthApiSuccessResponse | AuthApiErrorResponse;
