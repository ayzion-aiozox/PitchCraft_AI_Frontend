import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { Lookup } from '../models/lookup.model';
import { ApiEndpoints } from '../constants/api-endpoints';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private readonly baseUrl = (environment as { apiUrl?: string })?.apiUrl ?? '';
  private readonly cache$ = new Map<string, Observable<Lookup[]>>();

  constructor(private readonly http: HttpClient) {}

  private url(path: string): string {
    const base = this.baseUrl.replace(/\/$/, '');
    return path.startsWith('http') ? path : `${base}/${path}`;
  }

  private replaceParam(endpoint: string, params: Record<string, string>): string {
    return endpoint.replace(/{(\w+)}/g, (match, key) => params[key] ?? match);
  }

  /**
   * Fetch lookups by type from backend.
   * Supports multiple response shapes: `{ data: Lookup[] }`, `{ data: { items: Lookup[] } }`, or a single `Lookup`.
   */
  getLookups$(lookupType: string): Observable<Lookup[]> {
    const key = (lookupType ?? '').trim();
    if (!key) return of([]);
    const cached = this.cache$.get(key);
    if (cached) return cached;

    const endpoint = this.replaceParam(ApiEndpoints.lookup.byType, { lookupType: key });
    const req$ = this.http.get<unknown>(this.url(endpoint)).pipe(
      map((raw) => {
        const r = raw as any;
        const data = r?.data ?? r?.Data ?? r;
        const items = data?.items ?? data?.Items ?? data;
        const arr = Array.isArray(items) ? (items as Lookup[]) : items ? [items as Lookup] : [];
        // Filter invalid rows and keep stable order
        return arr.filter((x) => x && typeof x === 'object' && (x as any).VisibleValue != null);
      }),
      catchError(() => of([])),
      shareReplay(1)
    );
    this.cache$.set(key, req$);
    return req$;
  }

  /** Convenience: return VisibleValue strings for dropdowns */
  getVisibleValues$(lookupType: string): Observable<string[]> {
    return this.getLookups$(lookupType).pipe(
      map((rows) =>
        rows
          .map((x) => String(x.VisibleValue ?? '').trim())
          .filter(Boolean)
      )
    );
  }
}
