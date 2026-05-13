import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/** Abort hung backend calls so the UI does not wait on dead TCP (common when API is down). */
const DEFAULT_TIMEOUT_MS = 45_000;

function shouldApplyTimeout(reqUrl: string): boolean {
  if (reqUrl.includes('/assets/') || reqUrl.includes('/i18n/')) {
    return false;
  }
  const apiBase = (environment as { apiUrl?: string }).apiUrl?.replace(/\/$/, '') ?? '';
  if (apiBase && reqUrl.startsWith(apiBase)) {
    return true;
  }
  if (reqUrl.startsWith('/api/')) {
    return true;
  }
  return false;
}

export const apiTimeoutInterceptor: HttpInterceptorFn = (req, next) => {
  if (!shouldApplyTimeout(req.url)) {
    return next(req);
  }

  return next(req).pipe(
    timeout(DEFAULT_TIMEOUT_MS),
    catchError((err: unknown) => {
      if (err instanceof TimeoutError || (err as { name?: string })?.name === 'TimeoutError') {
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 0,
              statusText: 'Timeout',
              url: req.url,
              error: {
                message: `Request timed out after ${DEFAULT_TIMEOUT_MS / 1000}s. Check that the API at your configured base URL is running.`,
              },
            })
        );
      }
      return throwError(() => err);
    })
  );
};
