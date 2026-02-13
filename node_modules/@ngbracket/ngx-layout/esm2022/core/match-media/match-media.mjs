/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CSP_NONCE, Inject, Injectable, Optional, PLATFORM_ID, } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MediaChange } from '../media-change';
import * as i0 from "@angular/core";
/**
 * MediaMonitor configures listeners to mediaQuery changes and publishes an Observable facade to
 * convert mediaQuery change callbacks to subscriber notifications. These notifications will be
 * performed within the ng Zone to trigger change detections and component updates.
 *
 * NOTE: both mediaQuery activations and de-activations are announced in notifications
 */
export class MatchMedia {
    constructor(_zone, _platformId, _document, _nonce) {
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        this._nonce = _nonce;
        /** Initialize source with 'all' so all non-responsive APIs trigger style updates */
        this.source = new BehaviorSubject(new MediaChange(true));
        this.registry = new Map();
        this.pendingRemoveListenerFns = [];
        this._observable$ = this.source.asObservable();
    }
    /**
     * Publish list of all current activations
     */
    get activations() {
        const results = [];
        this.registry.forEach((mql, key) => {
            if (mql.matches) {
                results.push(key);
            }
        });
        return results;
    }
    /**
     * For the specified mediaQuery?
     */
    isActive(mediaQuery) {
        const mql = this.registry.get(mediaQuery);
        return (mql?.matches ?? this.registerQuery(mediaQuery).some((m) => m.matches));
    }
    /**
     * External observers can watch for all (or a specific) mql changes.
     * Typically used by the MediaQueryAdaptor; optionally available to components
     * who wish to use the MediaMonitor as mediaMonitor$ observable service.
     *
     * Use deferred registration process to register breakpoints only on subscription
     * This logic also enforces logic to register all mediaQueries BEFORE notify
     * subscribers of notifications.
     */
    observe(mqList, filterOthers = false) {
        if (mqList && mqList.length) {
            const matchMedia$ = this._observable$.pipe(filter((change) => !filterOthers ? true : mqList.indexOf(change.mediaQuery) > -1));
            const registration$ = new Observable((observer) => {
                // tslint:disable-line:max-line-length
                const matches = this.registerQuery(mqList);
                if (matches.length) {
                    const lastChange = matches.pop();
                    matches.forEach((e) => {
                        observer.next(e);
                    });
                    this.source.next(lastChange); // last match is cached
                }
                observer.complete();
            });
            return merge(registration$, matchMedia$);
        }
        return this._observable$;
    }
    /**
     * Based on the BreakPointRegistry provider, register internal listeners for each unique
     * mediaQuery. Each listener emits specific MediaChange data to observers
     */
    registerQuery(mediaQuery) {
        const list = Array.isArray(mediaQuery) ? mediaQuery : [mediaQuery];
        const matches = [];
        buildQueryCss(list, this._document, this._nonce);
        list.forEach((query) => {
            const onMQLEvent = (e) => {
                this._zone.run(() => this.source.next(new MediaChange(e.matches, query)));
            };
            let mql = this.registry.get(query);
            if (!mql) {
                mql = this.buildMQL(query);
                mql.addListener(onMQLEvent);
                this.pendingRemoveListenerFns.push(() => mql.removeListener(onMQLEvent));
                this.registry.set(query, mql);
            }
            if (mql.matches) {
                matches.push(new MediaChange(true, query));
            }
        });
        return matches;
    }
    ngOnDestroy() {
        let fn;
        while ((fn = this.pendingRemoveListenerFns.pop())) {
            fn();
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        return constructMql(query, isPlatformBrowser(this._platformId));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: CSP_NONCE, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MatchMedia, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MatchMedia, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CSP_NONCE]
                }] }] });
/**
 * Private global registry for all dynamically-created, injected style tags
 * @see prepare(query)
 */
const ALL_STYLES = {};
/**
 * For Webkit engines that only trigger the MediaQueryList Listener
 * when there is at least one CSS selector for the respective media query.
 *
 * @param mediaQueries
 * @param _document
 */
function buildQueryCss(mediaQueries, _document, _nonce) {
    const list = mediaQueries.filter((it) => !ALL_STYLES[it]);
    if (list.length > 0) {
        const query = list.join(', ');
        try {
            const styleEl = _document.createElement('style');
            styleEl.setAttribute('type', 'text/css');
            if (_nonce) {
                styleEl.setAttribute('nonce', _nonce);
            }
            if (!styleEl.styleSheet) {
                const cssText = `
/*
  @ngbracket/ngx-layout - workaround for possible browser quirk with mediaQuery listeners
  see http://bit.ly/2sd4HMP
*/
@media ${query} {.fx-query-test{ }}
`;
                styleEl.appendChild(_document.createTextNode(cssText));
            }
            _document.head.appendChild(styleEl);
            // Store in private global registry
            list.forEach((mq) => (ALL_STYLES[mq] = styleEl));
        }
        catch (e) {
            console.error(e);
        }
    }
}
function buildMockMql(query) {
    const et = new EventTarget();
    et.matches = query === 'all' || query === '';
    et.media = query;
    et.addListener = () => { };
    et.removeListener = () => { };
    et.addEventListener = () => { };
    et.dispatchEvent = () => false;
    et.onchange = null;
    return et;
}
function constructMql(query, isBrowser) {
    const canListen = isBrowser && !!window.matchMedia('all').addListener;
    return canListen ? window.matchMedia(query) : buildMockMql(query);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2gtbWVkaWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWF0Y2gtbWVkaWEvbWF0Y2gtbWVkaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlELE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFVBQVUsRUFHVixRQUFRLEVBQ1IsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBWSxNQUFNLE1BQU0sQ0FBQztBQUNwRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUU5Qzs7Ozs7O0dBTUc7QUFFSCxNQUFNLE9BQU8sVUFBVTtJQU1yQixZQUNZLEtBQWEsRUFDUSxXQUFtQixFQUN0QixTQUFjLEVBQ0QsTUFBc0I7UUFIckQsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNRLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ3RCLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDRCxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQVRqRSxvRkFBb0Y7UUFDM0UsV0FBTSxHQUFHLElBQUksZUFBZSxDQUFjLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUUsYUFBUSxHQUFHLElBQUksR0FBRyxFQUEwQixDQUFDO1FBQzVCLDZCQUF3QixHQUFzQixFQUFFLENBQUM7UUFtSXhELGlCQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQTVIakQsQ0FBQztJQUVKOztPQUVHO0lBQ0gsSUFBSSxXQUFXO1FBQ2IsTUFBTSxP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T0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQjtLQUNGO0FBQ0gsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLEtBQWE7SUFDakMsTUFBTSxFQUFFLEdBQVEsSUFBSSxXQUFXLEVBQUUsQ0FBQztJQUNsQyxFQUFFLENBQUMsT0FBTyxHQUFHLEtBQUssS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUUsQ0FBQztJQUM3QyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNqQixFQUFFLENBQUMsV0FBVyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUMxQixFQUFFLENBQUMsY0FBYyxHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztJQUM3QixFQUFFLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBQy9CLEVBQUUsQ0FBQyxhQUFhLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQy9CLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBRW5CLE9BQU8sRUFBb0IsQ0FBQztBQUM5QixDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsS0FBYSxFQUFFLFNBQWtCO0lBQ3JELE1BQU0sU0FBUyxHQUNiLFNBQVMsSUFBSSxDQUFDLENBQVUsTUFBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFFaEUsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFVLE1BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBET0NVTUVOVCwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ1NQX05PTkNFLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUExBVEZPUk1fSUQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBtZXJnZSwgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTWVkaWFDaGFuZ2UgfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuXG4vKipcbiAqIE1lZGlhTW9uaXRvciBjb25maWd1cmVzIGxpc3RlbmVycyB0byBtZWRpYVF1ZXJ5IGNoYW5nZXMgYW5kIHB1Ymxpc2hlcyBhbiBPYnNlcnZhYmxlIGZhY2FkZSB0b1xuICogY29udmVydCBtZWRpYVF1ZXJ5IGNoYW5nZSBjYWxsYmFja3MgdG8gc3Vic2NyaWJlciBub3RpZmljYXRpb25zLiBUaGVzZSBub3RpZmljYXRpb25zIHdpbGwgYmVcbiAqIHBlcmZvcm1lZCB3aXRoaW4gdGhlIG5nIFpvbmUgdG8gdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9ucyBhbmQgY29tcG9uZW50IHVwZGF0ZXMuXG4gKlxuICogTk9URTogYm90aCBtZWRpYVF1ZXJ5IGFjdGl2YXRpb25zIGFuZCBkZS1hY3RpdmF0aW9ucyBhcmUgYW5ub3VuY2VkIGluIG5vdGlmaWNhdGlvbnNcbiAqL1xuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBNYXRjaE1lZGlhIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqIEluaXRpYWxpemUgc291cmNlIHdpdGggJ2FsbCcgc28gYWxsIG5vbi1yZXNwb25zaXZlIEFQSXMgdHJpZ2dlciBzdHlsZSB1cGRhdGVzICovXG4gIHJlYWRvbmx5IHNvdXJjZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8TWVkaWFDaGFuZ2U+KG5ldyBNZWRpYUNoYW5nZSh0cnVlKSk7XG4gIHJlZ2lzdHJ5ID0gbmV3IE1hcDxzdHJpbmcsIE1lZGlhUXVlcnlMaXN0PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IHBlbmRpbmdSZW1vdmVMaXN0ZW5lckZuczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgX3pvbmU6IE5nWm9uZSxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcm90ZWN0ZWQgX3BsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcm90ZWN0ZWQgX2RvY3VtZW50OiBhbnksXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChDU1BfTk9OQ0UpIHByb3RlY3RlZCBfbm9uY2U/OiBzdHJpbmcgfCBudWxsXG4gICkge31cblxuICAvKipcbiAgICogUHVibGlzaCBsaXN0IG9mIGFsbCBjdXJyZW50IGFjdGl2YXRpb25zXG4gICAqL1xuICBnZXQgYWN0aXZhdGlvbnMoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHJlc3VsdHM6IHN0cmluZ1tdID0gW107XG4gICAgdGhpcy5yZWdpc3RyeS5mb3JFYWNoKChtcWw6IE1lZGlhUXVlcnlMaXN0LCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKG1xbC5tYXRjaGVzKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvciB0aGUgc3BlY2lmaWVkIG1lZGlhUXVlcnk/XG4gICAqL1xuICBpc0FjdGl2ZShtZWRpYVF1ZXJ5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBtcWwgPSB0aGlzLnJlZ2lzdHJ5LmdldChtZWRpYVF1ZXJ5KTtcbiAgICByZXR1cm4gKFxuICAgICAgbXFsPy5tYXRjaGVzID8/IHRoaXMucmVnaXN0ZXJRdWVyeShtZWRpYVF1ZXJ5KS5zb21lKChtKSA9PiBtLm1hdGNoZXMpXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRlcm5hbCBvYnNlcnZlcnMgY2FuIHdhdGNoIGZvciBhbGwgKG9yIGEgc3BlY2lmaWMpIG1xbCBjaGFuZ2VzLlxuICAgKlxuICAgKiBJZiBhIG1lZGlhUXVlcnkgaXMgbm90IHNwZWNpZmllZCwgdGhlbiBBTEwgbWVkaWFRdWVyeSBhY3RpdmF0aW9ucyB3aWxsXG4gICAqIGJlIGFubm91bmNlZC5cbiAgICovXG4gIG9ic2VydmUoKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZT47XG4gIG9ic2VydmUobWVkaWFRdWVyaWVzOiBzdHJpbmdbXSk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+O1xuICBvYnNlcnZlKFxuICAgIG1lZGlhUXVlcmllczogc3RyaW5nW10sXG4gICAgZmlsdGVyT3RoZXJzOiBib29sZWFuXG4gICk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+O1xuXG4gIC8qKlxuICAgKiBFeHRlcm5hbCBvYnNlcnZlcnMgY2FuIHdhdGNoIGZvciBhbGwgKG9yIGEgc3BlY2lmaWMpIG1xbCBjaGFuZ2VzLlxuICAgKiBUeXBpY2FsbHkgdXNlZCBieSB0aGUgTWVkaWFRdWVyeUFkYXB0b3I7IG9wdGlvbmFsbHkgYXZhaWxhYmxlIHRvIGNvbXBvbmVudHNcbiAgICogd2hvIHdpc2ggdG8gdXNlIHRoZSBNZWRpYU1vbml0b3IgYXMgbWVkaWFNb25pdG9yJCBvYnNlcnZhYmxlIHNlcnZpY2UuXG4gICAqXG4gICAqIFVzZSBkZWZlcnJlZCByZWdpc3RyYXRpb24gcHJvY2VzcyB0byByZWdpc3RlciBicmVha3BvaW50cyBvbmx5IG9uIHN1YnNjcmlwdGlvblxuICAgKiBUaGlzIGxvZ2ljIGFsc28gZW5mb3JjZXMgbG9naWMgdG8gcmVnaXN0ZXIgYWxsIG1lZGlhUXVlcmllcyBCRUZPUkUgbm90aWZ5XG4gICAqIHN1YnNjcmliZXJzIG9mIG5vdGlmaWNhdGlvbnMuXG4gICAqL1xuICBvYnNlcnZlKG1xTGlzdD86IHN0cmluZ1tdLCBmaWx0ZXJPdGhlcnMgPSBmYWxzZSk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2U+IHtcbiAgICBpZiAobXFMaXN0ICYmIG1xTGlzdC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG1hdGNoTWVkaWEkOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlPiA9IHRoaXMuX29ic2VydmFibGUkLnBpcGUoXG4gICAgICAgIGZpbHRlcigoY2hhbmdlOiBNZWRpYUNoYW5nZSkgPT5cbiAgICAgICAgICAhZmlsdGVyT3RoZXJzID8gdHJ1ZSA6IG1xTGlzdC5pbmRleE9mKGNoYW5nZS5tZWRpYVF1ZXJ5KSA+IC0xXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgICBjb25zdCByZWdpc3RyYXRpb24kOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlPiA9IG5ldyBPYnNlcnZhYmxlKFxuICAgICAgICAob2JzZXJ2ZXI6IE9ic2VydmVyPE1lZGlhQ2hhbmdlPikgPT4ge1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgY29uc3QgbWF0Y2hlczogQXJyYXk8TWVkaWFDaGFuZ2U+ID0gdGhpcy5yZWdpc3RlclF1ZXJ5KG1xTGlzdCk7XG4gICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBsYXN0Q2hhbmdlID0gbWF0Y2hlcy5wb3AoKSE7XG4gICAgICAgICAgICBtYXRjaGVzLmZvckVhY2goKGU6IE1lZGlhQ2hhbmdlKSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlLm5leHQobGFzdENoYW5nZSk7IC8vIGxhc3QgbWF0Y2ggaXMgY2FjaGVkXG4gICAgICAgICAgfVxuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgICByZXR1cm4gbWVyZ2UocmVnaXN0cmF0aW9uJCwgbWF0Y2hNZWRpYSQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vYnNlcnZhYmxlJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBCYXNlZCBvbiB0aGUgQnJlYWtQb2ludFJlZ2lzdHJ5IHByb3ZpZGVyLCByZWdpc3RlciBpbnRlcm5hbCBsaXN0ZW5lcnMgZm9yIGVhY2ggdW5pcXVlXG4gICAqIG1lZGlhUXVlcnkuIEVhY2ggbGlzdGVuZXIgZW1pdHMgc3BlY2lmaWMgTWVkaWFDaGFuZ2UgZGF0YSB0byBvYnNlcnZlcnNcbiAgICovXG4gIHJlZ2lzdGVyUXVlcnkobWVkaWFRdWVyeTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICBjb25zdCBsaXN0ID0gQXJyYXkuaXNBcnJheShtZWRpYVF1ZXJ5KSA/IG1lZGlhUXVlcnkgOiBbbWVkaWFRdWVyeV07XG4gICAgY29uc3QgbWF0Y2hlczogTWVkaWFDaGFuZ2VbXSA9IFtdO1xuXG4gICAgYnVpbGRRdWVyeUNzcyhsaXN0LCB0aGlzLl9kb2N1bWVudCwgdGhpcy5fbm9uY2UpO1xuXG4gICAgbGlzdC5mb3JFYWNoKChxdWVyeTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBvbk1RTEV2ZW50ID0gKGU6IE1lZGlhUXVlcnlMaXN0RXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5fem9uZS5ydW4oKCkgPT5cbiAgICAgICAgICB0aGlzLnNvdXJjZS5uZXh0KG5ldyBNZWRpYUNoYW5nZShlLm1hdGNoZXMsIHF1ZXJ5KSlcbiAgICAgICAgKTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBtcWwgPSB0aGlzLnJlZ2lzdHJ5LmdldChxdWVyeSk7XG4gICAgICBpZiAoIW1xbCkge1xuICAgICAgICBtcWwgPSB0aGlzLmJ1aWxkTVFMKHF1ZXJ5KTtcbiAgICAgICAgbXFsLmFkZExpc3RlbmVyKG9uTVFMRXZlbnQpO1xuICAgICAgICB0aGlzLnBlbmRpbmdSZW1vdmVMaXN0ZW5lckZucy5wdXNoKCgpID0+XG4gICAgICAgICAgbXFsIS5yZW1vdmVMaXN0ZW5lcihvbk1RTEV2ZW50KVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5LnNldChxdWVyeSwgbXFsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG1xbC5tYXRjaGVzKSB7XG4gICAgICAgIG1hdGNoZXMucHVzaChuZXcgTWVkaWFDaGFuZ2UodHJ1ZSwgcXVlcnkpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtYXRjaGVzO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgbGV0IGZuO1xuICAgIHdoaWxlICgoZm4gPSB0aGlzLnBlbmRpbmdSZW1vdmVMaXN0ZW5lckZucy5wb3AoKSkpIHtcbiAgICAgIGZuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgd2luZG93Lm1hdGNoTWVkaWEoKSB0byBidWlsZCBhIE1lZGlhUXVlcnlMaXN0OyB3aGljaFxuICAgKiBzdXBwb3J0cyAwLi5uIGxpc3RlbmVycyBmb3IgYWN0aXZhdGlvbi9kZWFjdGl2YXRpb25cbiAgICovXG4gIHByb3RlY3RlZCBidWlsZE1RTChxdWVyeTogc3RyaW5nKTogTWVkaWFRdWVyeUxpc3Qge1xuICAgIHJldHVybiBjb25zdHJ1Y3RNcWwocXVlcnksIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfb2JzZXJ2YWJsZSQgPSB0aGlzLnNvdXJjZS5hc09ic2VydmFibGUoKTtcbn1cblxuLyoqXG4gKiBQcml2YXRlIGdsb2JhbCByZWdpc3RyeSBmb3IgYWxsIGR5bmFtaWNhbGx5LWNyZWF0ZWQsIGluamVjdGVkIHN0eWxlIHRhZ3NcbiAqIEBzZWUgcHJlcGFyZShxdWVyeSlcbiAqL1xuY29uc3QgQUxMX1NUWUxFUzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSA9IHt9O1xuXG4vKipcbiAqIEZvciBXZWJraXQgZW5naW5lcyB0aGF0IG9ubHkgdHJpZ2dlciB0aGUgTWVkaWFRdWVyeUxpc3QgTGlzdGVuZXJcbiAqIHdoZW4gdGhlcmUgaXMgYXQgbGVhc3Qgb25lIENTUyBzZWxlY3RvciBmb3IgdGhlIHJlc3BlY3RpdmUgbWVkaWEgcXVlcnkuXG4gKlxuICogQHBhcmFtIG1lZGlhUXVlcmllc1xuICogQHBhcmFtIF9kb2N1bWVudFxuICovXG5mdW5jdGlvbiBidWlsZFF1ZXJ5Q3NzKFxuICBtZWRpYVF1ZXJpZXM6IHN0cmluZ1tdLFxuICBfZG9jdW1lbnQ6IERvY3VtZW50LFxuICBfbm9uY2U/OiBzdHJpbmcgfCBudWxsXG4pIHtcbiAgY29uc3QgbGlzdCA9IG1lZGlhUXVlcmllcy5maWx0ZXIoKGl0KSA9PiAhQUxMX1NUWUxFU1tpdF0pO1xuICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgcXVlcnkgPSBsaXN0LmpvaW4oJywgJyk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3R5bGVFbCA9IF9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gICAgICBzdHlsZUVsLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICAgICAgaWYgKF9ub25jZSkge1xuICAgICAgICBzdHlsZUVsLnNldEF0dHJpYnV0ZSgnbm9uY2UnLCBfbm9uY2UpO1xuICAgICAgfVxuICAgICAgaWYgKCEoc3R5bGVFbCBhcyBhbnkpLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgY29uc3QgY3NzVGV4dCA9IGBcbi8qXG4gIEBuZ2JyYWNrZXQvbmd4LWxheW91dCAtIHdvcmthcm91bmQgZm9yIHBvc3NpYmxlIGJyb3dzZXIgcXVpcmsgd2l0aCBtZWRpYVF1ZXJ5IGxpc3RlbmVyc1xuICBzZWUgaHR0cDovL2JpdC5seS8yc2Q0SE1QXG4qL1xuQG1lZGlhICR7cXVlcnl9IHsuZngtcXVlcnktdGVzdHsgfX1cbmA7XG4gICAgICAgIHN0eWxlRWwuYXBwZW5kQ2hpbGQoX2RvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzc1RleHQpKTtcbiAgICAgIH1cblxuICAgICAgX2RvY3VtZW50LmhlYWQhLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xuXG4gICAgICAvLyBTdG9yZSBpbiBwcml2YXRlIGdsb2JhbCByZWdpc3RyeVxuICAgICAgbGlzdC5mb3JFYWNoKChtcSkgPT4gKEFMTF9TVFlMRVNbbXFdID0gc3R5bGVFbCkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkTW9ja01xbChxdWVyeTogc3RyaW5nKSB7XG4gIGNvbnN0IGV0OiBhbnkgPSBuZXcgRXZlbnRUYXJnZXQoKTtcbiAgZXQubWF0Y2hlcyA9IHF1ZXJ5ID09PSAnYWxsJyB8fCBxdWVyeSA9PT0gJyc7XG4gIGV0Lm1lZGlhID0gcXVlcnk7XG4gIGV0LmFkZExpc3RlbmVyID0gKCkgPT4ge307XG4gIGV0LnJlbW92ZUxpc3RlbmVyID0gKCkgPT4ge307XG4gIGV0LmFkZEV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7fTtcbiAgZXQuZGlzcGF0Y2hFdmVudCA9ICgpID0+IGZhbHNlO1xuICBldC5vbmNoYW5nZSA9IG51bGw7XG5cbiAgcmV0dXJuIGV0IGFzIE1lZGlhUXVlcnlMaXN0O1xufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RNcWwocXVlcnk6IHN0cmluZywgaXNCcm93c2VyOiBib29sZWFuKTogTWVkaWFRdWVyeUxpc3Qge1xuICBjb25zdCBjYW5MaXN0ZW4gPVxuICAgIGlzQnJvd3NlciAmJiAhISg8V2luZG93PndpbmRvdykubWF0Y2hNZWRpYSgnYWxsJykuYWRkTGlzdGVuZXI7XG5cbiAgcmV0dXJuIGNhbkxpc3RlbiA/ICg8V2luZG93PndpbmRvdykubWF0Y2hNZWRpYShxdWVyeSkgOiBidWlsZE1vY2tNcWwocXVlcnkpO1xufVxuIl19