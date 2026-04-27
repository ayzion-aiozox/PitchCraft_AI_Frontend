import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../shared/constants/api-endpoints';
import { LocalStorageConstant } from '../../shared/constants/local-storage.constant';
import type {
  LoginRequest,
  RegisterRequest,
  AuthUser,
  AuthTokens,
  AuthApiResponse,
} from '../../shared/models/auth.model';

/** Result of login/register for the UI: either tokens + user or an error message */
export type AuthResult =
  | { ok: true; data: AuthTokens }
  | { ok: false; message: string };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = (environment as { apiUrl?: string })?.apiUrl ?? '';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  /**
   * POST /api/auth/login
   * On success: stores accessToken, refreshToken, expiresAt, user and returns { ok: true, data }.
   * On 401 or error: returns { ok: false, message }.
   */
  login(payload: LoginRequest): Observable<AuthResult> {
    const url = this.buildUrl(ApiEndpoints.auth.login);
    return this.http.post<AuthApiResponse>(url, payload).pipe(
      map((res) => this.mapAuthResponse(res)),
      tap((result) => {
        if (result.ok) this.setSession(result.data);
      }),
      catchError((err) => of(this.mapAuthError(err)))
    );
  }

  /**
   * POST /api/auth/register
   * On success: stores tokens and user, returns { ok: true, data }.
   * On 400 (e.g. email exists) or error: returns { ok: false, message }.
   */
  register(payload: RegisterRequest): Observable<AuthResult> {
    const url = this.buildUrl(ApiEndpoints.auth.register);
    return this.http.post<AuthApiResponse>(url, payload).pipe(
      map((res) => this.mapAuthResponse(res)),
      tap((result) => {
        if (result.ok) this.setSession(result.data);
      }),
      catchError((err) => of(this.mapAuthError(err)))
    );
  }

  logout(options?: { sessionExpired?: boolean }): void {
    localStorage.removeItem(LocalStorageConstant.Token);
    localStorage.removeItem(LocalStorageConstant.RefreshToken);
    localStorage.removeItem(LocalStorageConstant.ExpiresAt);
    localStorage.removeItem(LocalStorageConstant.UserId);
    localStorage.removeItem(LocalStorageConstant.User);
    localStorage.removeItem(LocalStorageConstant.WorkspaceId);
    localStorage.removeItem(LocalStorageConstant.QdrantCollectionId);
    if (options?.sessionExpired) {
      this.router.navigate(['/auth/login'], { queryParams: { session: 'expired' } });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(LocalStorageConstant.Token);
  }

  getToken(): string | null {
    return localStorage.getItem(LocalStorageConstant.Token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(LocalStorageConstant.RefreshToken);
  }

  getExpiresAt(): string | null {
    return localStorage.getItem(LocalStorageConstant.ExpiresAt);
  }

  getWorkspaceId(): string | null {
    return localStorage.getItem(LocalStorageConstant.WorkspaceId);
  }

  /** Qdrant collection id from last login (for embed); null if not set. */
  getQdrantCollectionId(): string | null {
    return localStorage.getItem(LocalStorageConstant.QdrantCollectionId);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(LocalStorageConstant.User);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  private setSession(data: AuthTokens): void {
    if (data.accessToken) {
      localStorage.setItem(LocalStorageConstant.Token, data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem(LocalStorageConstant.RefreshToken, data.refreshToken);
    }
    if (data.expiresAt) {
      localStorage.setItem(LocalStorageConstant.ExpiresAt, data.expiresAt);
    }
    if (data.user) {
      localStorage.setItem(LocalStorageConstant.User, JSON.stringify(data.user));
      if (data.user.id) {
        localStorage.setItem(LocalStorageConstant.UserId, data.user.id);
      }
      if (data.user.currentWorkspaceId) {
        localStorage.setItem(LocalStorageConstant.WorkspaceId, data.user.currentWorkspaceId);
      }
      const u = data.user as AuthUser & Record<string, unknown>;
      const qidRaw = u.qdrantCollectionId ?? u['QdrantCollectionId'];
      const qid = typeof qidRaw === 'string' ? qidRaw.trim() : '';
      if (qid) {
        localStorage.setItem(LocalStorageConstant.QdrantCollectionId, qid);
      } else {
        localStorage.removeItem(LocalStorageConstant.QdrantCollectionId);
      }
    }
  }

  private mapAuthResponse(res: AuthApiResponse): AuthResult {
    if (res.success && res.data) {
      return { ok: true, data: res.data };
    }
    return {
      ok: false,
      message: (res as { message?: string }).message ?? 'Request failed.',
    };
  }

  private mapAuthError(err: { error?: { message?: string }; status?: number }): AuthResult {
    const msg =
      err?.error?.message ??
      (err?.status === 401 ? 'Invalid credentials.' : 'Something went wrong. Please try again.');
    return { ok: false, message: msg };
  }

  private buildUrl(endpoint: string): string {
    const base = this.baseUrl.replace(/\/$/, '');
    return endpoint.startsWith('http') ? endpoint : `${base}/${endpoint}`;
  }
}
