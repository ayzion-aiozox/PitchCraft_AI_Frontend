/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { asapScheduler, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, } from 'rxjs/operators';
import { mergeAlias } from '../add-alias';
import { MediaChange } from '../media-change';
import { coerceArray } from '../utils/array';
import { sortDescendingPriority } from '../utils/sort';
import * as i0 from "@angular/core";
import * as i1 from "../breakpoints/break-point-registry";
import * as i2 from "../match-media/match-media";
import * as i3 from "../media-marshaller/print-hook";
/**
 * MediaObserver enables applications to listen for 1..n mediaQuery activations and to determine
 * if a mediaQuery is currently activated.
 *
 * Since a breakpoint change will first deactivate 1...n mediaQueries and then possibly activate
 * 1..n mediaQueries, the MediaObserver will debounce notifications and report ALL *activations*
 * in 1 event notification. The reported activations will be sorted in descending priority order.
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * Note: Developers should note that only mediaChange activations (not de-activations)
 *       are announced by the MediaObserver.
 *
 *  @usage
 *
 *  // RxJS
 *  import { filter } from 'rxjs/operators';
 *  import { MediaObserver } from '@ngbracket/ngx-layout';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    status: string = '';
 *
 *    constructor(mediaObserver: MediaObserver) {
 *      const media$ = mediaObserver.asObservable().pipe(
 *        filter((changes: MediaChange[]) => true)   // silly noop filter
 *      );
 *
 *      media$.subscribe((changes: MediaChange[]) => {
 *        let status = '';
 *        changes.forEach( change => {
 *          status += `'${change.mqAlias}' = (${change.mediaQuery}) <br/>` ;
 *        });
 *        this.status = status;
 *     });
 *
 *    }
 *  }
 */
export class MediaObserver {
    constructor(breakpoints, matchMedia, hook) {
        this.breakpoints = breakpoints;
        this.matchMedia = matchMedia;
        this.hook = hook;
        /** Filter MediaChange notifications for overlapping breakpoints */
        this.filterOverlaps = false;
        this.destroyed$ = new Subject();
        this._media$ = this.watchActivations();
    }
    /**
     * Completes the active subject, signalling to all complete for all
     * MediaObserver subscribers
     */
    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
    // ************************************************
    // Public Methods
    // ************************************************
    /**
     * Observe changes to current activation 'list'
     */
    asObservable() {
        return this._media$;
    }
    /**
     * Allow programmatic query to determine if one or more media query/alias match
     * the current viewport size.
     * @param value One or more media queries (or aliases) to check.
     * @returns Whether any of the media queries match.
     */
    isActive(value) {
        const aliases = splitQueries(coerceArray(value));
        return aliases.some((alias) => {
            const query = toMediaQuery(alias, this.breakpoints);
            return query !== null && this.matchMedia.isActive(query);
        });
    }
    // ************************************************
    // Internal Methods
    // ************************************************
    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     */
    watchActivations() {
        const queries = this.breakpoints.items.map((bp) => bp.mediaQuery);
        return this.buildObservable(queries);
    }
    /**
     * Only pass/announce activations (not de-activations)
     *
     * Since multiple-mediaQueries can be activation in a cycle,
     * gather all current activations into a single list of changes to observers
     *
     * Inject associated (if any) alias information into the MediaChange event
     * - Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
     * - Exclude print activations that do not have an associated mediaQuery
     *
     * NOTE: the raw MediaChange events [from MatchMedia] do not
     *       contain important alias information; as such this info
     *       must be injected into the MediaChange
     */
    buildObservable(mqList) {
        const hasChanges = (changes) => {
            const isValidQuery = (change) => change.mediaQuery.length > 0;
            return changes.filter(isValidQuery).length > 0;
        };
        const excludeOverlaps = (changes) => {
            return !this.filterOverlaps
                ? changes
                : changes.filter((change) => {
                    const bp = this.breakpoints.findByQuery(change.mediaQuery);
                    return bp?.overlapping ?? true;
                });
        };
        const ignoreDuplicates = (previous, current) => {
            if (previous.length !== current.length) {
                return false;
            }
            const previousMqs = previous.map((mc) => mc.mediaQuery);
            const currentMqs = new Set(current.map((mc) => mc.mediaQuery));
            const difference = new Set(previousMqs.filter((mq) => !currentMqs.has(mq)));
            return difference.size === 0;
        };
        /**
         */
        return this.matchMedia.observe(this.hook.withPrintQuery(mqList)).pipe(filter((change) => change.matches), debounceTime(0, asapScheduler), switchMap((_) => of(this.findAllActivations())), map(excludeOverlaps), filter(hasChanges), distinctUntilChanged(ignoreDuplicates), takeUntil(this.destroyed$));
    }
    /**
     * Find all current activations and prepare single list of activations
     * sorted by descending priority.
     */
    findAllActivations() {
        const mergeMQAlias = (change) => {
            const bp = this.breakpoints.findByQuery(change.mediaQuery);
            return mergeAlias(change, bp);
        };
        const replaceWithPrintAlias = (change) => this.hook.isPrintEvent(change) ? this.hook.updateEvent(change) : change;
        return this.matchMedia.activations
            .map((query) => new MediaChange(true, query))
            .map(replaceWithPrintAlias)
            .map(mergeMQAlias)
            .sort(sortDescendingPriority);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MediaObserver, deps: [{ token: i1.BreakPointRegistry }, { token: i2.MatchMedia }, { token: i3.PrintHook }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MediaObserver, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MediaObserver, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.BreakPointRegistry }, { type: i2.MatchMedia }, { type: i3.PrintHook }] });
/**
 * Find associated breakpoint (if any)
 */
function toMediaQuery(query, locator) {
    const bp = locator.findByAlias(query) ?? locator.findByQuery(query);
    return bp?.mediaQuery ?? null;
}
/**
 * Split each query string into separate query strings if two queries are provided as comma
 * separated.
 */
function splitQueries(queries) {
    return queries
        .flatMap((query) => query.split(','))
        .map((query) => query.trim());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWVkaWEtb2JzZXJ2ZXIvbWVkaWEtb2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFFLFVBQVUsRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsYUFBYSxFQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUQsT0FBTyxFQUNMLFlBQVksRUFDWixvQkFBb0IsRUFDcEIsTUFBTSxFQUNOLEdBQUcsRUFDSCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQU0xQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHOUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFFdkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Q0c7QUFFSCxNQUFNLE9BQU8sYUFBYTtJQUl4QixZQUNZLFdBQStCLEVBQy9CLFVBQXNCLEVBQ3RCLElBQWU7UUFGZixnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFDL0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixTQUFJLEdBQUosSUFBSSxDQUFXO1FBTjNCLG1FQUFtRTtRQUNuRSxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQTBJTixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQW5JaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsV0FBVztRQUNULElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsbURBQW1EO0lBQ25ELGlCQUFpQjtJQUNqQixtREFBbUQ7SUFFbkQ7O09BRUc7SUFDSCxZQUFZO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFFBQVEsQ0FBQyxLQUF3QjtRQUMvQixNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDakQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDcEQsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxtQkFBbUI7SUFDbkIsbURBQW1EO0lBRW5EOzs7O09BSUc7SUFDSyxnQkFBZ0I7UUFDdEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEUsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ssZUFBZSxDQUFDLE1BQWdCO1FBQ3RDLE1BQU0sVUFBVSxHQUFHLENBQUMsT0FBc0IsRUFBRSxFQUFFO1lBQzVDLE1BQU0sWUFBWSxHQUFHLENBQUMsTUFBbUIsRUFBRSxFQUFFLENBQzNDLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUMvQixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUM7UUFDRixNQUFNLGVBQWUsR0FBRyxDQUFDLE9BQXNCLEVBQUUsRUFBRTtZQUNqRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWM7Z0JBQ3pCLENBQUMsQ0FBQyxPQUFPO2dCQUNULENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7b0JBQ3hCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDM0QsT0FBTyxFQUFFLEVBQUUsV0FBVyxJQUFJLElBQUksQ0FBQztnQkFDakMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUM7UUFDRixNQUFNLGdCQUFnQixHQUFHLENBQ3ZCLFFBQXVCLEVBQ3ZCLE9BQXNCLEVBQ2IsRUFBRTtZQUNYLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUN0QyxPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUN4QixXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDaEQsQ0FBQztZQUVGLE9BQU8sVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDO1FBRUY7V0FDRztRQUNILE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ25FLE1BQU0sQ0FBQyxDQUFDLE1BQW1CLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFDL0MsWUFBWSxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsRUFDOUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxFQUMvQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQ3BCLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFDbEIsb0JBQW9CLENBQUMsZ0JBQWdCLENBQUMsRUFDdEMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FDM0IsQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSyxrQkFBa0I7UUFDeEIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFtQixFQUFFLEVBQUU7WUFDM0MsTUFBTSxFQUFFLEdBQXVCLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUN6RCxNQUFNLENBQUMsVUFBVSxDQUNsQixDQUFDO1lBQ0YsT0FBTyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQztRQUNGLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxNQUFtQixFQUFFLEVBQUUsQ0FDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFMUUsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVc7YUFDL0IsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDNUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDO2FBQzFCLEdBQUcsQ0FBQyxZQUFZLENBQUM7YUFDakIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDbEMsQ0FBQzs4R0F6SVUsYUFBYTtrSEFBYixhQUFhLGNBREEsTUFBTTs7MkZBQ25CLGFBQWE7a0JBRHpCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOztBQWdKbEM7O0dBRUc7QUFDSCxTQUFTLFlBQVksQ0FDbkIsS0FBYSxFQUNiLE9BQTJCO0lBRTNCLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwRSxPQUFPLEVBQUUsRUFBRSxVQUFVLElBQUksSUFBSSxDQUFDO0FBQ2hDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLFlBQVksQ0FBQyxPQUFpQjtJQUNyQyxPQUFPLE9BQU87U0FDWCxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDcEMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IGFzYXBTY2hlZHVsZXIsIE9ic2VydmFibGUsIG9mLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBkZWJvdW5jZVRpbWUsXG4gIGRpc3RpbmN0VW50aWxDaGFuZ2VkLFxuICBmaWx0ZXIsXG4gIG1hcCxcbiAgc3dpdGNoTWFwLFxuICB0YWtlVW50aWwsXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgbWVyZ2VBbGlhcyB9IGZyb20gJy4uL2FkZC1hbGlhcyc7XG5pbXBvcnQge1xuICBCcmVha1BvaW50UmVnaXN0cnksXG4gIE9wdGlvbmFsQnJlYWtQb2ludCxcbn0gZnJvbSAnLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnknO1xuaW1wb3J0IHsgTWF0Y2hNZWRpYSB9IGZyb20gJy4uL21hdGNoLW1lZGlhL21hdGNoLW1lZGlhJztcbmltcG9ydCB7IE1lZGlhQ2hhbmdlIH0gZnJvbSAnLi4vbWVkaWEtY2hhbmdlJztcbmltcG9ydCB7IFByaW50SG9vayB9IGZyb20gJy4uL21lZGlhLW1hcnNoYWxsZXIvcHJpbnQtaG9vayc7XG5cbmltcG9ydCB7IGNvZXJjZUFycmF5IH0gZnJvbSAnLi4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgc29ydERlc2NlbmRpbmdQcmlvcml0eSB9IGZyb20gJy4uL3V0aWxzL3NvcnQnO1xuXG4vKipcbiAqIE1lZGlhT2JzZXJ2ZXIgZW5hYmxlcyBhcHBsaWNhdGlvbnMgdG8gbGlzdGVuIGZvciAxLi5uIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnMgYW5kIHRvIGRldGVybWluZVxuICogaWYgYSBtZWRpYVF1ZXJ5IGlzIGN1cnJlbnRseSBhY3RpdmF0ZWQuXG4gKlxuICogU2luY2UgYSBicmVha3BvaW50IGNoYW5nZSB3aWxsIGZpcnN0IGRlYWN0aXZhdGUgMS4uLm4gbWVkaWFRdWVyaWVzIGFuZCB0aGVuIHBvc3NpYmx5IGFjdGl2YXRlXG4gKiAxLi5uIG1lZGlhUXVlcmllcywgdGhlIE1lZGlhT2JzZXJ2ZXIgd2lsbCBkZWJvdW5jZSBub3RpZmljYXRpb25zIGFuZCByZXBvcnQgQUxMICphY3RpdmF0aW9ucypcbiAqIGluIDEgZXZlbnQgbm90aWZpY2F0aW9uLiBUaGUgcmVwb3J0ZWQgYWN0aXZhdGlvbnMgd2lsbCBiZSBzb3J0ZWQgaW4gZGVzY2VuZGluZyBwcmlvcml0eSBvcmRlci5cbiAqXG4gKiBUaGlzIGNsYXNzIHVzZXMgdGhlIEJyZWFrUG9pbnQgUmVnaXN0cnkgdG8gaW5qZWN0IGFsaWFzIGluZm9ybWF0aW9uIGludG8gdGhlIHJhdyBNZWRpYUNoYW5nZVxuICogbm90aWZpY2F0aW9uLiBGb3IgY3VzdG9tIG1lZGlhUXVlcnkgbm90aWZpY2F0aW9ucywgYWxpYXMgaW5mb3JtYXRpb24gd2lsbCBub3QgYmUgaW5qZWN0ZWQgYW5kXG4gKiB0aG9zZSBmaWVsZHMgd2lsbCBiZSAnJy5cbiAqXG4gKiBOb3RlOiBEZXZlbG9wZXJzIHNob3VsZCBub3RlIHRoYXQgb25seSBtZWRpYUNoYW5nZSBhY3RpdmF0aW9ucyAobm90IGRlLWFjdGl2YXRpb25zKVxuICogICAgICAgYXJlIGFubm91bmNlZCBieSB0aGUgTWVkaWFPYnNlcnZlci5cbiAqXG4gKiAgQHVzYWdlXG4gKlxuICogIC8vIFJ4SlNcbiAqICBpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiAgaW1wb3J0IHsgTWVkaWFPYnNlcnZlciB9IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dCc7XG4gKlxuICogIEBDb21wb25lbnQoeyAuLi4gfSlcbiAqICBleHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcbiAqICAgIHN0YXR1czogc3RyaW5nID0gJyc7XG4gKlxuICogICAgY29uc3RydWN0b3IobWVkaWFPYnNlcnZlcjogTWVkaWFPYnNlcnZlcikge1xuICogICAgICBjb25zdCBtZWRpYSQgPSBtZWRpYU9ic2VydmVyLmFzT2JzZXJ2YWJsZSgpLnBpcGUoXG4gKiAgICAgICAgZmlsdGVyKChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiB0cnVlKSAgIC8vIHNpbGx5IG5vb3AgZmlsdGVyXG4gKiAgICAgICk7XG4gKlxuICogICAgICBtZWRpYSQuc3Vic2NyaWJlKChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiB7XG4gKiAgICAgICAgbGV0IHN0YXR1cyA9ICcnO1xuICogICAgICAgIGNoYW5nZXMuZm9yRWFjaCggY2hhbmdlID0+IHtcbiAqICAgICAgICAgIHN0YXR1cyArPSBgJyR7Y2hhbmdlLm1xQWxpYXN9JyA9ICgke2NoYW5nZS5tZWRpYVF1ZXJ5fSkgPGJyLz5gIDtcbiAqICAgICAgICB9KTtcbiAqICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAqICAgICB9KTtcbiAqXG4gKiAgICB9XG4gKiAgfVxuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIE1lZGlhT2JzZXJ2ZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKiogRmlsdGVyIE1lZGlhQ2hhbmdlIG5vdGlmaWNhdGlvbnMgZm9yIG92ZXJsYXBwaW5nIGJyZWFrcG9pbnRzICovXG4gIGZpbHRlck92ZXJsYXBzID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIGJyZWFrcG9pbnRzOiBCcmVha1BvaW50UmVnaXN0cnksXG4gICAgcHJvdGVjdGVkIG1hdGNoTWVkaWE6IE1hdGNoTWVkaWEsXG4gICAgcHJvdGVjdGVkIGhvb2s6IFByaW50SG9va1xuICApIHtcbiAgICB0aGlzLl9tZWRpYSQgPSB0aGlzLndhdGNoQWN0aXZhdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wbGV0ZXMgdGhlIGFjdGl2ZSBzdWJqZWN0LCBzaWduYWxsaW5nIHRvIGFsbCBjb21wbGV0ZSBmb3IgYWxsXG4gICAqIE1lZGlhT2JzZXJ2ZXIgc3Vic2NyaWJlcnNcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveWVkJC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95ZWQkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHVibGljIE1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqIE9ic2VydmUgY2hhbmdlcyB0byBjdXJyZW50IGFjdGl2YXRpb24gJ2xpc3QnXG4gICAqL1xuICBhc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZVtdPiB7XG4gICAgcmV0dXJuIHRoaXMuX21lZGlhJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyBwcm9ncmFtbWF0aWMgcXVlcnkgdG8gZGV0ZXJtaW5lIGlmIG9uZSBvciBtb3JlIG1lZGlhIHF1ZXJ5L2FsaWFzIG1hdGNoXG4gICAqIHRoZSBjdXJyZW50IHZpZXdwb3J0IHNpemUuXG4gICAqIEBwYXJhbSB2YWx1ZSBPbmUgb3IgbW9yZSBtZWRpYSBxdWVyaWVzIChvciBhbGlhc2VzKSB0byBjaGVjay5cbiAgICogQHJldHVybnMgV2hldGhlciBhbnkgb2YgdGhlIG1lZGlhIHF1ZXJpZXMgbWF0Y2guXG4gICAqL1xuICBpc0FjdGl2ZSh2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBjb25zdCBhbGlhc2VzID0gc3BsaXRRdWVyaWVzKGNvZXJjZUFycmF5KHZhbHVlKSk7XG4gICAgcmV0dXJuIGFsaWFzZXMuc29tZSgoYWxpYXMpID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdG9NZWRpYVF1ZXJ5KGFsaWFzLCB0aGlzLmJyZWFrcG9pbnRzKTtcbiAgICAgIHJldHVybiBxdWVyeSAhPT0gbnVsbCAmJiB0aGlzLm1hdGNoTWVkaWEuaXNBY3RpdmUocXVlcnkpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIEludGVybmFsIE1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGFsbCB0aGUgbWVkaWFRdWVyaWVzIHJlZ2lzdGVyZWQgaW4gdGhlIEJyZWFrUG9pbnRSZWdpc3RyeVxuICAgKiBUaGlzIGlzIG5lZWRlZCBzbyBzdWJzY3JpYmVycyBjYW4gYmUgYXV0by1ub3RpZmllZCBvZiBhbGwgc3RhbmRhcmQsIHJlZ2lzdGVyZWRcbiAgICogbWVkaWFRdWVyeSBhY3RpdmF0aW9uc1xuICAgKi9cbiAgcHJpdmF0ZSB3YXRjaEFjdGl2YXRpb25zKCkge1xuICAgIGNvbnN0IHF1ZXJpZXMgPSB0aGlzLmJyZWFrcG9pbnRzLml0ZW1zLm1hcCgoYnApID0+IGJwLm1lZGlhUXVlcnkpO1xuICAgIHJldHVybiB0aGlzLmJ1aWxkT2JzZXJ2YWJsZShxdWVyaWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPbmx5IHBhc3MvYW5ub3VuY2UgYWN0aXZhdGlvbnMgKG5vdCBkZS1hY3RpdmF0aW9ucylcbiAgICpcbiAgICogU2luY2UgbXVsdGlwbGUtbWVkaWFRdWVyaWVzIGNhbiBiZSBhY3RpdmF0aW9uIGluIGEgY3ljbGUsXG4gICAqIGdhdGhlciBhbGwgY3VycmVudCBhY3RpdmF0aW9ucyBpbnRvIGEgc2luZ2xlIGxpc3Qgb2YgY2hhbmdlcyB0byBvYnNlcnZlcnNcbiAgICpcbiAgICogSW5qZWN0IGFzc29jaWF0ZWQgKGlmIGFueSkgYWxpYXMgaW5mb3JtYXRpb24gaW50byB0aGUgTWVkaWFDaGFuZ2UgZXZlbnRcbiAgICogLSBFeGNsdWRlIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnMgZm9yIG92ZXJsYXBwaW5nIG1Rcy4gTGlzdCBib3VuZGVkIG1RIHJhbmdlcyBvbmx5XG4gICAqIC0gRXhjbHVkZSBwcmludCBhY3RpdmF0aW9ucyB0aGF0IGRvIG5vdCBoYXZlIGFuIGFzc29jaWF0ZWQgbWVkaWFRdWVyeVxuICAgKlxuICAgKiBOT1RFOiB0aGUgcmF3IE1lZGlhQ2hhbmdlIGV2ZW50cyBbZnJvbSBNYXRjaE1lZGlhXSBkbyBub3RcbiAgICogICAgICAgY29udGFpbiBpbXBvcnRhbnQgYWxpYXMgaW5mb3JtYXRpb247IGFzIHN1Y2ggdGhpcyBpbmZvXG4gICAqICAgICAgIG11c3QgYmUgaW5qZWN0ZWQgaW50byB0aGUgTWVkaWFDaGFuZ2VcbiAgICovXG4gIHByaXZhdGUgYnVpbGRPYnNlcnZhYmxlKG1xTGlzdDogc3RyaW5nW10pOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlW10+IHtcbiAgICBjb25zdCBoYXNDaGFuZ2VzID0gKGNoYW5nZXM6IE1lZGlhQ2hhbmdlW10pID0+IHtcbiAgICAgIGNvbnN0IGlzVmFsaWRRdWVyeSA9IChjaGFuZ2U6IE1lZGlhQ2hhbmdlKSA9PlxuICAgICAgICBjaGFuZ2UubWVkaWFRdWVyeS5sZW5ndGggPiAwO1xuICAgICAgcmV0dXJuIGNoYW5nZXMuZmlsdGVyKGlzVmFsaWRRdWVyeSkubGVuZ3RoID4gMDtcbiAgICB9O1xuICAgIGNvbnN0IGV4Y2x1ZGVPdmVybGFwcyA9IChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiB7XG4gICAgICByZXR1cm4gIXRoaXMuZmlsdGVyT3ZlcmxhcHNcbiAgICAgICAgPyBjaGFuZ2VzXG4gICAgICAgIDogY2hhbmdlcy5maWx0ZXIoKGNoYW5nZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYnAgPSB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KGNoYW5nZS5tZWRpYVF1ZXJ5KTtcbiAgICAgICAgICAgIHJldHVybiBicD8ub3ZlcmxhcHBpbmcgPz8gdHJ1ZTtcbiAgICAgICAgICB9KTtcbiAgICB9O1xuICAgIGNvbnN0IGlnbm9yZUR1cGxpY2F0ZXMgPSAoXG4gICAgICBwcmV2aW91czogTWVkaWFDaGFuZ2VbXSxcbiAgICAgIGN1cnJlbnQ6IE1lZGlhQ2hhbmdlW11cbiAgICApOiBib29sZWFuID0+IHtcbiAgICAgIGlmIChwcmV2aW91cy5sZW5ndGggIT09IGN1cnJlbnQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJldmlvdXNNcXMgPSBwcmV2aW91cy5tYXAoKG1jKSA9PiBtYy5tZWRpYVF1ZXJ5KTtcbiAgICAgIGNvbnN0IGN1cnJlbnRNcXMgPSBuZXcgU2V0KGN1cnJlbnQubWFwKChtYykgPT4gbWMubWVkaWFRdWVyeSkpO1xuICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IG5ldyBTZXQoXG4gICAgICAgIHByZXZpb3VzTXFzLmZpbHRlcigobXEpID0+ICFjdXJyZW50TXFzLmhhcyhtcSkpXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gZGlmZmVyZW5jZS5zaXplID09PSAwO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKi9cbiAgICByZXR1cm4gdGhpcy5tYXRjaE1lZGlhLm9ic2VydmUodGhpcy5ob29rLndpdGhQcmludFF1ZXJ5KG1xTGlzdCkpLnBpcGUoXG4gICAgICBmaWx0ZXIoKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IGNoYW5nZS5tYXRjaGVzKSxcbiAgICAgIGRlYm91bmNlVGltZSgwLCBhc2FwU2NoZWR1bGVyKSxcbiAgICAgIHN3aXRjaE1hcCgoXykgPT4gb2YodGhpcy5maW5kQWxsQWN0aXZhdGlvbnMoKSkpLFxuICAgICAgbWFwKGV4Y2x1ZGVPdmVybGFwcyksXG4gICAgICBmaWx0ZXIoaGFzQ2hhbmdlcyksXG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZChpZ25vcmVEdXBsaWNhdGVzKSxcbiAgICAgIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3llZCQpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIGFsbCBjdXJyZW50IGFjdGl2YXRpb25zIGFuZCBwcmVwYXJlIHNpbmdsZSBsaXN0IG9mIGFjdGl2YXRpb25zXG4gICAqIHNvcnRlZCBieSBkZXNjZW5kaW5nIHByaW9yaXR5LlxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kQWxsQWN0aXZhdGlvbnMoKTogTWVkaWFDaGFuZ2VbXSB7XG4gICAgY29uc3QgbWVyZ2VNUUFsaWFzID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IHtcbiAgICAgIGNvbnN0IGJwOiBPcHRpb25hbEJyZWFrUG9pbnQgPSB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KFxuICAgICAgICBjaGFuZ2UubWVkaWFRdWVyeVxuICAgICAgKTtcbiAgICAgIHJldHVybiBtZXJnZUFsaWFzKGNoYW5nZSwgYnApO1xuICAgIH07XG4gICAgY29uc3QgcmVwbGFjZVdpdGhQcmludEFsaWFzID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+XG4gICAgICB0aGlzLmhvb2suaXNQcmludEV2ZW50KGNoYW5nZSkgPyB0aGlzLmhvb2sudXBkYXRlRXZlbnQoY2hhbmdlKSA6IGNoYW5nZTtcblxuICAgIHJldHVybiB0aGlzLm1hdGNoTWVkaWEuYWN0aXZhdGlvbnNcbiAgICAgIC5tYXAoKHF1ZXJ5KSA9PiBuZXcgTWVkaWFDaGFuZ2UodHJ1ZSwgcXVlcnkpKVxuICAgICAgLm1hcChyZXBsYWNlV2l0aFByaW50QWxpYXMpXG4gICAgICAubWFwKG1lcmdlTVFBbGlhcylcbiAgICAgIC5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfbWVkaWEkOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlW10+O1xuICBwcml2YXRlIHJlYWRvbmx5IGRlc3Ryb3llZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xufVxuXG4vKipcbiAqIEZpbmQgYXNzb2NpYXRlZCBicmVha3BvaW50IChpZiBhbnkpXG4gKi9cbmZ1bmN0aW9uIHRvTWVkaWFRdWVyeShcbiAgcXVlcnk6IHN0cmluZyxcbiAgbG9jYXRvcjogQnJlYWtQb2ludFJlZ2lzdHJ5XG4pOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgYnAgPSBsb2NhdG9yLmZpbmRCeUFsaWFzKHF1ZXJ5KSA/PyBsb2NhdG9yLmZpbmRCeVF1ZXJ5KHF1ZXJ5KTtcbiAgcmV0dXJuIGJwPy5tZWRpYVF1ZXJ5ID8/IG51bGw7XG59XG5cbi8qKlxuICogU3BsaXQgZWFjaCBxdWVyeSBzdHJpbmcgaW50byBzZXBhcmF0ZSBxdWVyeSBzdHJpbmdzIGlmIHR3byBxdWVyaWVzIGFyZSBwcm92aWRlZCBhcyBjb21tYVxuICogc2VwYXJhdGVkLlxuICovXG5mdW5jdGlvbiBzcGxpdFF1ZXJpZXMocXVlcmllczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBxdWVyaWVzXG4gICAgLmZsYXRNYXAoKHF1ZXJ5KSA9PiBxdWVyeS5zcGxpdCgnLCcpKVxuICAgIC5tYXAoKHF1ZXJ5KSA9PiBxdWVyeS50cmltKCkpO1xufVxuIl19