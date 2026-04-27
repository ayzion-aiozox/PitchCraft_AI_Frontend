import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * On 401 from API (not auth login/register), clear session and redirect to login with ?session=expired.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const apiBase = (environment as { apiUrl?: string }).apiUrl?.replace(/\/$/, '') ?? '';

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        const url = req.url;
        const isAuthLogin = /\/api\/auth\/login/i.test(url);
        const isAuthRegister = /\/api\/auth\/register/i.test(url);
        const hitsBackendApi =
          url.includes('/api/') || (apiBase.length > 0 && url.startsWith(apiBase));

        if (hitsBackendApi && !isAuthLogin && !isAuthRegister) {
          auth.logout({ sessionExpired: true });
        }
      }
      return throwError(() => err);
    })
  );
};
