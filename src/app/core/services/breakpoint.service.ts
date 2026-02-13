import { Injectable, signal, computed, inject } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { BREAKPOINTS, type BreakpointMode } from '../../shared/constants/breakpoints';

/**
 * Logic-driven responsiveness using Angular CDK BreakpointObserver.
 * Exposes reactive state (signals + observables) for breakpoints that match
 * global SCSS (768px, 1200px). Use in components to show/hide, change
 * layout, or bind classes based on viewport.
 */
@Injectable({ providedIn: 'root' })
export class BreakpointService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  /** Observable: emits when any of the app breakpoints match or not */
  private readonly state$ = this.breakpointObserver
    .observe([BREAKPOINTS.MOBILE, BREAKPOINTS.TABLET])
    .pipe(
      map((state: BreakpointState) => this.deriveMode(state)),
      shareReplay(1)
    );

  /** Signal: current mode derived from viewport */
  readonly mode = toSignal(this.state$, { initialValue: 'desktop' as BreakpointMode });

  /** Signal: true when viewport is mobile (max-width: 768px) */
  readonly isMobile = computed(() => this.mode() === 'mobile');

  /** Signal: true when viewport is tablet (max-width: 1200px, above mobile) */
  readonly isTablet = computed(() => this.mode() === 'tablet');

  /** Signal: true when viewport is desktop (min-width: 1201px) */
  readonly isDesktop = computed(() => this.mode() === 'desktop');

  /** Observable for components that prefer observables over signals */
  get mode$(): Observable<BreakpointMode> {
    return this.state$;
  }

  /** One-off check: is the given media query matched right now? */
  isMatched(query: string): boolean {
    return this.breakpointObserver.isMatched(query);
  }

  private deriveMode(state: BreakpointState): BreakpointMode {
    const breakpoints = state.breakpoints;
    if (breakpoints[BREAKPOINTS.MOBILE]) return 'mobile';
    if (breakpoints[BREAKPOINTS.TABLET]) return 'tablet';
    return 'desktop';
  }
}
