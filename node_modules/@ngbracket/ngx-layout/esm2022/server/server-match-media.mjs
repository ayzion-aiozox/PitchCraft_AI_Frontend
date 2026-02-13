/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BREAKPOINTS, LAYOUT_CONFIG, ɵMatchMedia as MatchMedia, } from '@ngbracket/ngx-layout/core';
import * as i0 from "@angular/core";
/**
 * Special server-only class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
export class ServerMediaQueryList extends EventTarget {
    get matches() {
        return this._isActive;
    }
    get media() {
        return this._mediaQuery;
    }
    constructor(_mediaQuery, _isActive = false) {
        super();
        this._mediaQuery = _mediaQuery;
        this._isActive = _isActive;
        this._listeners = [];
        this.onchange = null;
    }
    /**
     * Destroy the current list by deactivating the
     * listeners and clearing the internal list
     */
    destroy() {
        this.deactivate();
        this._listeners = [];
    }
    /** Notify all listeners that 'matches === TRUE' */
    activate() {
        if (!this._isActive) {
            this._isActive = true;
            this._listeners.forEach((callback) => {
                const cb = callback;
                cb.call(this, {
                    matches: this.matches,
                    media: this.media,
                });
            });
        }
        return this;
    }
    /** Notify all listeners that 'matches === false' */
    deactivate() {
        if (this._isActive) {
            this._isActive = false;
            this._listeners.forEach((callback) => {
                const cb = callback;
                cb.call(this, {
                    matches: this.matches,
                    media: this.media,
                });
            });
        }
        return this;
    }
    /** Add a listener to our internal list to activate later */
    addListener(listener) {
        if (this._listeners.indexOf(listener) === -1) {
            this._listeners.push(listener);
        }
        if (this._isActive) {
            const cb = listener;
            cb.call(this, {
                matches: this.matches,
                media: this.media,
            });
        }
    }
    /** Don't need to remove listeners in the server environment */
    removeListener() { }
    addEventListener() { }
    removeEventListener() { }
    dispatchEvent(_) {
        return false;
    }
}
/**
 * Special server-only implementation of MatchMedia that uses the above
 * ServerMediaQueryList as its internal representation
 *
 * Also contains methods to activate and deactivate breakpoints
 */
export class ServerMatchMedia extends MatchMedia {
    constructor(_zone, _platformId, _document, breakpoints, layoutConfig) {
        super(_zone, _platformId, _document);
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        this.breakpoints = breakpoints;
        this.layoutConfig = layoutConfig;
        this._activeBreakpoints = [];
        const serverBps = layoutConfig.ssrObserveBreakpoints;
        if (serverBps) {
            this._activeBreakpoints = serverBps.reduce((acc, serverBp) => {
                const foundBp = breakpoints.find((bp) => serverBp === bp.alias);
                if (!foundBp) {
                    console.warn(`FlexLayoutServerModule: unknown breakpoint alias "${serverBp}"`);
                }
                else {
                    acc.push(foundBp);
                }
                return acc;
            }, []);
        }
    }
    /** Activate the specified breakpoint if we're on the server, no-op otherwise */
    activateBreakpoint(bp) {
        const lookupBreakpoint = this.registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.activate();
        }
    }
    /** Deactivate the specified breakpoint if we're on the server, no-op otherwise */
    deactivateBreakpoint(bp) {
        const lookupBreakpoint = this.registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.deactivate();
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        const isActive = this._activeBreakpoints.some((ab) => ab.mediaQuery === query);
        return new ServerMediaQueryList(query, isActive);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ServerMatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: BREAKPOINTS }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ServerMatchMedia }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ServerMatchMedia, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [BREAKPOINTS]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLW1hdGNoLW1lZGlhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9zZXJ2ZXIvc2VydmVyLW1hdGNoLW1lZGlhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBVSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUVMLFdBQVcsRUFFWCxhQUFhLEVBQ2IsV0FBVyxJQUFJLFVBQVUsR0FDMUIsTUFBTSw0QkFBNEIsQ0FBQzs7QUFFcEM7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxvQkFDWCxTQUFRLFdBQVc7SUFLbkIsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELFlBQW9CLFdBQW1CLEVBQVUsWUFBWSxLQUFLO1FBQ2hFLEtBQUssRUFBRSxDQUFDO1FBRFUsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBVjFELGVBQVUsR0FBNkIsRUFBRSxDQUFDO1FBaUZsRCxhQUFRLEdBQTJCLElBQUksQ0FBQztJQXJFeEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILE9BQU87UUFDTCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELG1EQUFtRDtJQUNuRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLFVB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LENBQUM7WUFDYixDQUFDLEVBQ0QsRUFBRSxDQUNILENBQUM7U0FDSDtJQUNILENBQUM7SUFFRCxnRkFBZ0Y7SUFDaEYsa0JBQWtCLENBQUMsRUFBYztRQUMvQixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUN4QyxFQUFFLENBQUMsVUFBVSxDQUNVLENBQUM7UUFDMUIsSUFBSSxnQkFBZ0IsRUFBRTtZQUNwQixnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCxrRkFBa0Y7SUFDbEYsb0JBQW9CLENBQUMsRUFBYztRQUNqQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUN4QyxFQUFFLENBQUMsVUFBVSxDQUNVLENBQUM7UUFDMUIsSUFBSSxnQkFBZ0IsRUFBRTtZQUNwQixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUMvQjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDZ0IsUUFBUSxDQUFDLEtBQWE7UUFDdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FDM0MsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUNoQyxDQUFDO1FBRUYsT0FBTyxJQUFJLG9CQUFvQixDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuRCxDQUFDOzhHQTdEVSxnQkFBZ0Isd0NBS2pCLFdBQVcsYUFDWCxRQUFRLGFBQ1IsV0FBVyxhQUNYLGFBQWE7a0hBUlosZ0JBQWdCOzsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVOzswQkFNTixNQUFNOzJCQUFDLFdBQVc7OzBCQUNsQixNQUFNOzJCQUFDLFFBQVE7OzBCQUNmLE1BQU07MkJBQUMsV0FBVzs7MEJBQ2xCLE1BQU07MkJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBOZ1pvbmUsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBCcmVha1BvaW50LFxuICBCUkVBS1BPSU5UUyxcbiAgTGF5b3V0Q29uZmlnT3B0aW9ucyxcbiAgTEFZT1VUX0NPTkZJRyxcbiAgybVNYXRjaE1lZGlhIGFzIE1hdGNoTWVkaWEsXG59IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9jb3JlJztcblxuLyoqXG4gKiBTcGVjaWFsIHNlcnZlci1vbmx5IGNsYXNzIHRvIHNpbXVsYXRlIGEgTWVkaWFRdWVyeUxpc3QgYW5kXG4gKiAtIHN1cHBvcnRzIG1hbnVhbCBhY3RpdmF0aW9uIHRvIHNpbXVsYXRlIG1lZGlhUXVlcnkgbWF0Y2hpbmdcbiAqIC0gbWFuYWdlcyBsaXN0ZW5lcnNcbiAqL1xuZXhwb3J0IGNsYXNzIFNlcnZlck1lZGlhUXVlcnlMaXN0XG4gIGV4dGVuZHMgRXZlbnRUYXJnZXRcbiAgaW1wbGVtZW50cyBNZWRpYVF1ZXJ5TGlzdFxue1xuICBwcml2YXRlIF9saXN0ZW5lcnM6IE1lZGlhUXVlcnlMaXN0TGlzdGVuZXJbXSA9IFtdO1xuXG4gIGdldCBtYXRjaGVzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc0FjdGl2ZTtcbiAgfVxuXG4gIGdldCBtZWRpYSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9tZWRpYVF1ZXJ5O1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbWVkaWFRdWVyeTogc3RyaW5nLCBwcml2YXRlIF9pc0FjdGl2ZSA9IGZhbHNlKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBjdXJyZW50IGxpc3QgYnkgZGVhY3RpdmF0aW5nIHRoZVxuICAgKiBsaXN0ZW5lcnMgYW5kIGNsZWFyaW5nIHRoZSBpbnRlcm5hbCBsaXN0XG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IFtdO1xuICB9XG5cbiAgLyoqIE5vdGlmeSBhbGwgbGlzdGVuZXJzIHRoYXQgJ21hdGNoZXMgPT09IFRSVUUnICovXG4gIGFjdGl2YXRlKCk6IFNlcnZlck1lZGlhUXVlcnlMaXN0IHtcbiAgICBpZiAoIXRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IHRydWU7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgICAgY29uc3QgY2I6ICh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCwgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IGFueSA9XG4gICAgICAgICAgY2FsbGJhY2shO1xuICAgICAgICBjYi5jYWxsKHRoaXMsIHtcbiAgICAgICAgICBtYXRjaGVzOiB0aGlzLm1hdGNoZXMsXG4gICAgICAgICAgbWVkaWE6IHRoaXMubWVkaWEsXG4gICAgICAgIH0gYXMgTWVkaWFRdWVyeUxpc3RFdmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogTm90aWZ5IGFsbCBsaXN0ZW5lcnMgdGhhdCAnbWF0Y2hlcyA9PT0gZmFsc2UnICovXG4gIGRlYWN0aXZhdGUoKTogU2VydmVyTWVkaWFRdWVyeUxpc3Qge1xuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgdGhpcy5faXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICBjb25zdCBjYjogKHRoaXM6IE1lZGlhUXVlcnlMaXN0LCBldjogTWVkaWFRdWVyeUxpc3RFdmVudCkgPT4gYW55ID1cbiAgICAgICAgICBjYWxsYmFjayE7XG4gICAgICAgIGNiLmNhbGwodGhpcywge1xuICAgICAgICAgIG1hdGNoZXM6IHRoaXMubWF0Y2hlcyxcbiAgICAgICAgICBtZWRpYTogdGhpcy5tZWRpYSxcbiAgICAgICAgfSBhcyBNZWRpYVF1ZXJ5TGlzdEV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBBZGQgYSBsaXN0ZW5lciB0byBvdXIgaW50ZXJuYWwgbGlzdCB0byBhY3RpdmF0ZSBsYXRlciAqL1xuICBhZGRMaXN0ZW5lcihsaXN0ZW5lcjogTWVkaWFRdWVyeUxpc3RMaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICAgIGlmICh0aGlzLl9pc0FjdGl2ZSkge1xuICAgICAgY29uc3QgY2I6ICh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCwgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IGFueSA9XG4gICAgICAgIGxpc3RlbmVyITtcbiAgICAgIGNiLmNhbGwodGhpcywge1xuICAgICAgICBtYXRjaGVzOiB0aGlzLm1hdGNoZXMsXG4gICAgICAgIG1lZGlhOiB0aGlzLm1lZGlhLFxuICAgICAgfSBhcyBNZWRpYVF1ZXJ5TGlzdEV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKiogRG9uJ3QgbmVlZCB0byByZW1vdmUgbGlzdGVuZXJzIGluIHRoZSBzZXJ2ZXIgZW52aXJvbm1lbnQgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoKSB7fVxuXG4gIG92ZXJyaWRlIGFkZEV2ZW50TGlzdGVuZXIoKSB7fVxuXG4gIG92ZXJyaWRlIHJlbW92ZUV2ZW50TGlzdGVuZXIoKSB7fVxuXG4gIG92ZXJyaWRlIGRpc3BhdGNoRXZlbnQoXzogRXZlbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBvbmNoYW5nZTogTWVkaWFRdWVyeUxpc3RMaXN0ZW5lciA9IG51bGw7XG59XG5cbi8qKlxuICogU3BlY2lhbCBzZXJ2ZXItb25seSBpbXBsZW1lbnRhdGlvbiBvZiBNYXRjaE1lZGlhIHRoYXQgdXNlcyB0aGUgYWJvdmVcbiAqIFNlcnZlck1lZGlhUXVlcnlMaXN0IGFzIGl0cyBpbnRlcm5hbCByZXByZXNlbnRhdGlvblxuICpcbiAqIEFsc28gY29udGFpbnMgbWV0aG9kcyB0byBhY3RpdmF0ZSBhbmQgZGVhY3RpdmF0ZSBicmVha3BvaW50c1xuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VydmVyTWF0Y2hNZWRpYSBleHRlbmRzIE1hdGNoTWVkaWEge1xuICBwcml2YXRlIF9hY3RpdmVCcmVha3BvaW50czogQnJlYWtQb2ludFtdID0gW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIG92ZXJyaWRlIF96b25lOiBOZ1pvbmUsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJvdGVjdGVkIG92ZXJyaWRlIF9wbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJvdGVjdGVkIG92ZXJyaWRlIF9kb2N1bWVudDogYW55LFxuICAgIEBJbmplY3QoQlJFQUtQT0lOVFMpIHByb3RlY3RlZCBicmVha3BvaW50czogQnJlYWtQb2ludFtdLFxuICAgIEBJbmplY3QoTEFZT1VUX0NPTkZJRykgcHJvdGVjdGVkIGxheW91dENvbmZpZzogTGF5b3V0Q29uZmlnT3B0aW9uc1xuICApIHtcbiAgICBzdXBlcihfem9uZSwgX3BsYXRmb3JtSWQsIF9kb2N1bWVudCk7XG5cbiAgICBjb25zdCBzZXJ2ZXJCcHMgPSBsYXlvdXRDb25maWcuc3NyT2JzZXJ2ZUJyZWFrcG9pbnRzO1xuICAgIGlmIChzZXJ2ZXJCcHMpIHtcbiAgICAgIHRoaXMuX2FjdGl2ZUJyZWFrcG9pbnRzID0gc2VydmVyQnBzLnJlZHVjZShcbiAgICAgICAgKGFjYzogQnJlYWtQb2ludFtdLCBzZXJ2ZXJCcDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3QgZm91bmRCcCA9IGJyZWFrcG9pbnRzLmZpbmQoKGJwKSA9PiBzZXJ2ZXJCcCA9PT0gYnAuYWxpYXMpO1xuICAgICAgICAgIGlmICghZm91bmRCcCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICBgRmxleExheW91dFNlcnZlck1vZHVsZTogdW5rbm93biBicmVha3BvaW50IGFsaWFzIFwiJHtzZXJ2ZXJCcH1cImBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjYy5wdXNoKGZvdW5kQnApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LFxuICAgICAgICBbXVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWN0aXZhdGUgdGhlIHNwZWNpZmllZCBicmVha3BvaW50IGlmIHdlJ3JlIG9uIHRoZSBzZXJ2ZXIsIG5vLW9wIG90aGVyd2lzZSAqL1xuICBhY3RpdmF0ZUJyZWFrcG9pbnQoYnA6IEJyZWFrUG9pbnQpIHtcbiAgICBjb25zdCBsb29rdXBCcmVha3BvaW50ID0gdGhpcy5yZWdpc3RyeS5nZXQoXG4gICAgICBicC5tZWRpYVF1ZXJ5XG4gICAgKSBhcyBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdDtcbiAgICBpZiAobG9va3VwQnJlYWtwb2ludCkge1xuICAgICAgbG9va3VwQnJlYWtwb2ludC5hY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWFjdGl2YXRlIHRoZSBzcGVjaWZpZWQgYnJlYWtwb2ludCBpZiB3ZSdyZSBvbiB0aGUgc2VydmVyLCBuby1vcCBvdGhlcndpc2UgKi9cbiAgZGVhY3RpdmF0ZUJyZWFrcG9pbnQoYnA6IEJyZWFrUG9pbnQpIHtcbiAgICBjb25zdCBsb29rdXBCcmVha3BvaW50ID0gdGhpcy5yZWdpc3RyeS5nZXQoXG4gICAgICBicC5tZWRpYVF1ZXJ5XG4gICAgKSBhcyBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdDtcbiAgICBpZiAobG9va3VwQnJlYWtwb2ludCkge1xuICAgICAgbG9va3VwQnJlYWtwb2ludC5kZWFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgd2luZG93Lm1hdGNoTWVkaWEoKSB0byBidWlsZCBhIE1lZGlhUXVlcnlMaXN0OyB3aGljaFxuICAgKiBzdXBwb3J0cyAwLi5uIGxpc3RlbmVycyBmb3IgYWN0aXZhdGlvbi9kZWFjdGl2YXRpb25cbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBidWlsZE1RTChxdWVyeTogc3RyaW5nKTogU2VydmVyTWVkaWFRdWVyeUxpc3Qge1xuICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5fYWN0aXZlQnJlYWtwb2ludHMuc29tZShcbiAgICAgIChhYikgPT4gYWIubWVkaWFRdWVyeSA9PT0gcXVlcnlcbiAgICApO1xuXG4gICAgcmV0dXJuIG5ldyBTZXJ2ZXJNZWRpYVF1ZXJ5TGlzdChxdWVyeSwgaXNBY3RpdmUpO1xuICB9XG59XG5cbnR5cGUgTWVkaWFRdWVyeUxpc3RMaXN0ZW5lciA9XG4gIHwgKCh0aGlzOiBNZWRpYVF1ZXJ5TGlzdCwgZXY6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IGFueSlcbiAgfCBudWxsO1xuIl19