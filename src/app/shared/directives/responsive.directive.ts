import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  input,
} from '@angular/core';
import { BreakpointService } from '../../core/services/breakpoint.service';
import type { BreakpointMode } from '../constants/breakpoints';

export type ShowWhen = BreakpointMode | 'tabletOrDesktop' | 'mobileOrTablet';

/**
 * Structural directive for logic-driven responsiveness (Angular CDK).
 * Shows the host when the current breakpoint matches the given mode.
 *
 * Usage:
 *   *appShowWhen="'desktop'"     - show only on desktop
 *   *appShowWhen="'tabletOrDesktop'" - show on tablet and desktop (hide on mobile)
 *   *appShowWhen="'mobile'"      - show only on mobile
 */
@Directive({
  selector: '[appShowWhen]',
  standalone: true,
})
export class ShowWhenDirective {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly breakpoint = inject(BreakpointService);

  private hasView = false;
  readonly appShowWhen = input<ShowWhen>('desktop');

  constructor() {
    effect(() => {
      const current = this.breakpoint.mode();
      const showWhen = this.appShowWhen();
      const show = this.shouldShow(current, showWhen);
      if (show && !this.hasView) {
        this.vcr.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!show && this.hasView) {
        this.vcr.clear();
        this.hasView = false;
      }
    });
  }

  private shouldShow(current: BreakpointMode, showWhen: ShowWhen): boolean {
    switch (showWhen) {
      case 'mobile':
        return current === 'mobile';
      case 'tablet':
        return current === 'tablet';
      case 'desktop':
        return current === 'desktop';
      case 'tabletOrDesktop':
        return current === 'tablet' || current === 'desktop';
      case 'mobileOrTablet':
        return current === 'mobile' || current === 'tablet';
      default:
        return false;
    }
  }
}

/**
 * Structural directive: hide the host when the current breakpoint matches (CDK-driven).
 *   *appHideWhen="'mobile'" - hide on mobile (show on tablet and desktop)
 */
@Directive({
  selector: '[appHideWhen]',
  standalone: true,
})
export class HideWhenDirective {
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly breakpoint = inject(BreakpointService);

  private hasView = false;
  readonly appHideWhen = input<ShowWhen>('mobile');

  constructor() {
    effect(() => {
      const current = this.breakpoint.mode();
      const hideWhen = this.appHideWhen();
      const hide = this.shouldHide(current, hideWhen);
      const show = !hide;
      if (show && !this.hasView) {
        this.vcr.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!show && this.hasView) {
        this.vcr.clear();
        this.hasView = false;
      }
    });
  }

  private shouldHide(current: BreakpointMode, hideWhen: ShowWhen): boolean {
    switch (hideWhen) {
      case 'mobile':
        return current === 'mobile';
      case 'tablet':
        return current === 'tablet';
      case 'desktop':
        return current === 'desktop';
      case 'tabletOrDesktop':
        return current === 'tablet' || current === 'desktop';
      case 'mobileOrTablet':
        return current === 'mobile' || current === 'tablet';
      default:
        return false;
    }
  }
}
