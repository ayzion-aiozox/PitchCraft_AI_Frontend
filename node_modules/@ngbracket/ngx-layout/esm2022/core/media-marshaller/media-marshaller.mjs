/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { sortDescendingPriority } from '../utils/sort';
import { mergeAlias } from '../add-alias';
import * as i0 from "@angular/core";
import * as i1 from "../match-media/match-media";
import * as i2 from "../breakpoints/break-point-registry";
import * as i3 from "./print-hook";
/**
 * MediaMarshaller - register responsive values from directives and
 *                   trigger them based on media query events
 */
export class MediaMarshaller {
    get activatedAlias() {
        return this.activatedBreakpoints[0]?.alias ?? '';
    }
    set activatedBreakpoints(bps) {
        this._activatedBreakpoints = [...bps];
    }
    get activatedBreakpoints() {
        return [...this._activatedBreakpoints];
    }
    set useFallbacks(value) {
        this._useFallbacks = value;
    }
    constructor(matchMedia, breakpoints, hook) {
        this.matchMedia = matchMedia;
        this.breakpoints = breakpoints;
        this.hook = hook;
        this._useFallbacks = true;
        this._activatedBreakpoints = [];
        this.elementMap = new Map();
        this.elementKeyMap = new WeakMap();
        this.watcherMap = new WeakMap(); // special triggers to update elements
        this.updateMap = new WeakMap(); // callback functions to update styles
        this.clearMap = new WeakMap(); // callback functions to clear styles
        this.subject = new Subject();
        this.observeActivations();
    }
    /**
     * Update styles on breakpoint activates or deactivates
     * @param mc
     */
    onMediaChange(mc) {
        const bp = this.findByQuery(mc.mediaQuery);
        if (bp) {
            mc = mergeAlias(mc, bp);
            const bpIndex = this.activatedBreakpoints.indexOf(bp);
            if (mc.matches && bpIndex === -1) {
                this._activatedBreakpoints.push(bp);
                this._activatedBreakpoints.sort(sortDescendingPriority);
                this.updateStyles();
            }
            else if (!mc.matches && bpIndex !== -1) {
                // Remove the breakpoint when it's deactivated
                this._activatedBreakpoints.splice(bpIndex, 1);
                this._activatedBreakpoints.sort(sortDescendingPriority);
                this.updateStyles();
            }
        }
    }
    /**
     * initialize the marshaller with necessary elements for delegation on an element
     * @param element
     * @param key
     * @param updateFn optional callback so that custom bp directives don't have to re-provide this
     * @param clearFn optional callback so that custom bp directives don't have to re-provide this
     * @param extraTriggers other triggers to force style updates (e.g. layout, directionality, etc)
     */
    init(element, key, updateFn, clearFn, extraTriggers = []) {
        initBuilderMap(this.updateMap, element, key, updateFn);
        initBuilderMap(this.clearMap, element, key, clearFn);
        this.buildElementKeyMap(element, key);
        this.watchExtraTriggers(element, key, extraTriggers);
    }
    /**
     * get the value for an element and key and optionally a given breakpoint
     * @param element
     * @param key
     * @param bp
     */
    getValue(element, key, bp) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const values = bp !== undefined ? bpMap.get(bp) : this.getActivatedValues(bpMap, key);
            if (values) {
                return values.get(key);
            }
        }
        return undefined;
    }
    /**
     * whether the element has values for a given key
     * @param element
     * @param key
     */
    hasValue(element, key) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const values = this.getActivatedValues(bpMap, key);
            if (values) {
                return values.get(key) !== undefined || false;
            }
        }
        return false;
    }
    /**
     * Set the value for an input on a directive
     * @param element the element in question
     * @param key the type of the directive (e.g. flex, layout-gap, etc)
     * @param bp the breakpoint suffix (empty string = default)
     * @param val the value for the breakpoint
     */
    setValue(element, key, val, bp) {
        let bpMap = this.elementMap.get(element);
        if (!bpMap) {
            bpMap = new Map().set(bp, new Map().set(key, val));
            this.elementMap.set(element, bpMap);
        }
        else {
            const values = (bpMap.get(bp) ?? new Map()).set(key, val);
            bpMap.set(bp, values);
            this.elementMap.set(element, bpMap);
        }
        const value = this.getValue(element, key);
        if (value !== undefined) {
            this.updateElement(element, key, value);
        }
    }
    /** Track element value changes for a specific key */
    trackValue(element, key) {
        return this.subject
            .asObservable()
            .pipe(filter(v => v.element === element && v.key === key));
    }
    /** update all styles for all elements on the current breakpoint */
    updateStyles() {
        this.elementMap.forEach((bpMap, el) => {
            const keyMap = new Set(this.elementKeyMap.get(el));
            let valueMap = this.getActivatedValues(bpMap);
            if (valueMap) {
                valueMap.forEach((v, k) => {
                    this.updateElement(el, k, v);
                    keyMap.delete(k);
                });
            }
            keyMap.forEach(k => {
                valueMap = this.getActivatedValues(bpMap, k);
                if (valueMap) {
                    const value = valueMap.get(k);
                    this.updateElement(el, k, value);
                }
                else {
                    this.clearElement(el, k);
                }
            });
        });
    }
    /**
     * clear the styles for a given element
     * @param element
     * @param key
     */
    clearElement(element, key) {
        const builders = this.clearMap.get(element);
        if (builders) {
            const clearFn = builders.get(key);
            if (!!clearFn) {
                clearFn();
                this.subject.next({ element, key, value: '' });
            }
        }
    }
    /**
     * update a given element with the activated values for a given key
     * @param element
     * @param key
     * @param value
     */
    updateElement(element, key, value) {
        const builders = this.updateMap.get(element);
        if (builders) {
            const updateFn = builders.get(key);
            if (!!updateFn) {
                updateFn(value);
                this.subject.next({ element, key, value });
            }
        }
    }
    /**
     * release all references to a given element
     * @param element
     */
    releaseElement(element) {
        const watcherMap = this.watcherMap.get(element);
        if (watcherMap) {
            watcherMap.forEach(s => s.unsubscribe());
            this.watcherMap.delete(element);
        }
        const elementMap = this.elementMap.get(element);
        if (elementMap) {
            elementMap.forEach((_, s) => elementMap.delete(s));
            this.elementMap.delete(element);
        }
    }
    /**
     * trigger an update for a given element and key (e.g. layout)
     * @param element
     * @param key
     */
    triggerUpdate(element, key) {
        const bpMap = this.elementMap.get(element);
        if (bpMap) {
            const valueMap = this.getActivatedValues(bpMap, key);
            if (valueMap) {
                if (key) {
                    this.updateElement(element, key, valueMap.get(key));
                }
                else {
                    valueMap.forEach((v, k) => this.updateElement(element, k, v));
                }
            }
        }
    }
    /** Cross-reference for HTMLElement with directive key */
    buildElementKeyMap(element, key) {
        let keyMap = this.elementKeyMap.get(element);
        if (!keyMap) {
            keyMap = new Set();
            this.elementKeyMap.set(element, keyMap);
        }
        keyMap.add(key);
    }
    /**
     * Other triggers that should force style updates:
     * - directionality
     * - layout changes
     * - mutationobserver updates
     */
    watchExtraTriggers(element, key, triggers) {
        if (triggers && triggers.length) {
            let watchers = this.watcherMap.get(element);
            if (!watchers) {
                watchers = new Map();
                this.watcherMap.set(element, watchers);
            }
            const subscription = watchers.get(key);
            if (!subscription) {
                const newSubscription = merge(...triggers).subscribe(() => {
                    const currentValue = this.getValue(element, key);
                    this.updateElement(element, key, currentValue);
                });
                watchers.set(key, newSubscription);
            }
        }
    }
    /** Breakpoint locator by mediaQuery */
    findByQuery(query) {
        return this.breakpoints.findByQuery(query);
    }
    /**
     * get the fallback breakpoint for a given element, starting with the current breakpoint
     * @param bpMap
     * @param key
     */
    getActivatedValues(bpMap, key) {
        for (let i = 0; i < this.activatedBreakpoints.length; i++) {
            const activatedBp = this.activatedBreakpoints[i];
            const valueMap = bpMap.get(activatedBp.alias);
            if (valueMap) {
                if (key === undefined || (valueMap.has(key) && valueMap.get(key) != null)) {
                    return valueMap;
                }
            }
        }
        // On the server, we explicitly have an "all" section filled in to begin with.
        // So we don't need to aggressively find a fallback if no explicit value exists.
        if (!this._useFallbacks) {
            return undefined;
        }
        const lastHope = bpMap.get('');
        return (key === undefined || lastHope && lastHope.has(key)) ? lastHope : undefined;
    }
    /**
     * Watch for mediaQuery breakpoint activations
     */
    observeActivations() {
        const queries = this.breakpoints.items.map(bp => bp.mediaQuery);
        this.hook.registerBeforeAfterPrintHooks(this);
        this.matchMedia
            .observe(this.hook.withPrintQuery(queries))
            .pipe(tap(this.hook.interceptEvents(this)), filter(this.hook.blockPropagation()))
            .subscribe(this.onMediaChange.bind(this));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MediaMarshaller, deps: [{ token: i1.MatchMedia }, { token: i2.BreakPointRegistry }, { token: i3.PrintHook }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MediaMarshaller, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: MediaMarshaller, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.MatchMedia }, { type: i2.BreakPointRegistry }, { type: i3.PrintHook }] });
function initBuilderMap(map, element, key, input) {
    if (input !== undefined) {
        const oldMap = map.get(element) ?? new Map();
        oldMap.set(key, input);
        map.set(element, oldMap);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtbWFyc2hhbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9tZWRpYS1tYXJzaGFsbGVyL21lZGlhLW1hcnNoYWxsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUM5RCxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzNDLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQU1yRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7OztBQW9CeEM7OztHQUdHO0FBRUgsTUFBTSxPQUFPLGVBQWU7SUFXMUIsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVELElBQUksb0JBQW9CLENBQUMsR0FBaUI7UUFDeEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBSSxvQkFBb0I7UUFDdEIsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELElBQUksWUFBWSxDQUFDLEtBQWM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELFlBQXNCLFVBQXNCLEVBQ3RCLFdBQStCLEVBQy9CLElBQWU7UUFGZixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQUMvQixTQUFJ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QU8sQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDN0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDMUI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0JyZWFrUG9pbnR9IGZyb20gJy4uL2JyZWFrcG9pbnRzL2JyZWFrLXBvaW50JztcbmltcG9ydCB7c29ydERlc2NlbmRpbmdQcmlvcml0eX0gZnJvbSAnLi4vdXRpbHMvc29ydCc7XG5pbXBvcnQge0JyZWFrUG9pbnRSZWdpc3RyeX0gZnJvbSAnLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnknO1xuaW1wb3J0IHtNYXRjaE1lZGlhfSBmcm9tICcuLi9tYXRjaC1tZWRpYS9tYXRjaC1tZWRpYSc7XG5pbXBvcnQge01lZGlhQ2hhbmdlfSBmcm9tICcuLi9tZWRpYS1jaGFuZ2UnO1xuXG5pbXBvcnQge1ByaW50SG9vaywgSG9va1RhcmdldH0gZnJvbSAnLi9wcmludC1ob29rJztcbmltcG9ydCB7bWVyZ2VBbGlhc30gZnJvbSAnLi4vYWRkLWFsaWFzJztcblxudHlwZSBDbGVhckNhbGxiYWNrID0gKCkgPT4gdm9pZDtcbnR5cGUgVXBkYXRlQ2FsbGJhY2sgPSAodmFsOiBhbnkpID0+IHZvaWQ7XG50eXBlIEJ1aWxkZXIgPSBVcGRhdGVDYWxsYmFjayB8IENsZWFyQ2FsbGJhY2s7XG5cbnR5cGUgVmFsdWVNYXAgPSBNYXA8c3RyaW5nLCBzdHJpbmc+O1xudHlwZSBCcmVha3BvaW50TWFwID0gTWFwPHN0cmluZywgVmFsdWVNYXA+O1xudHlwZSBFbGVtZW50TWFwID0gTWFwPEhUTUxFbGVtZW50LCBCcmVha3BvaW50TWFwPjtcbnR5cGUgRWxlbWVudEtleU1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIFNldDxzdHJpbmc+PjtcbnR5cGUgU3Vic2NyaXB0aW9uTWFwID0gTWFwPHN0cmluZywgU3Vic2NyaXB0aW9uPjtcbnR5cGUgV2F0Y2hlck1hcCA9IFdlYWtNYXA8SFRNTEVsZW1lbnQsIFN1YnNjcmlwdGlvbk1hcD47XG50eXBlIEJ1aWxkZXJNYXAgPSBXZWFrTWFwPEhUTUxFbGVtZW50LCBNYXA8c3RyaW5nLCBCdWlsZGVyPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWxlbWVudE1hdGNoZXIge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAga2V5OiBzdHJpbmc7XG4gIHZhbHVlOiBhbnk7XG59XG5cbi8qKlxuICogTWVkaWFNYXJzaGFsbGVyIC0gcmVnaXN0ZXIgcmVzcG9uc2l2ZSB2YWx1ZXMgZnJvbSBkaXJlY3RpdmVzIGFuZFxuICogICAgICAgICAgICAgICAgICAgdHJpZ2dlciB0aGVtIGJhc2VkIG9uIG1lZGlhIHF1ZXJ5IGV2ZW50c1xuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBNZWRpYU1hcnNoYWxsZXIge1xuICBwcml2YXRlIF91c2VGYWxsYmFja3MgPSB0cnVlO1xuICBwcml2YXRlIF9hY3RpdmF0ZWRCcmVha3BvaW50czogQnJlYWtQb2ludFtdID0gW107XG4gIHByaXZhdGUgZWxlbWVudE1hcDogRWxlbWVudE1hcCA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBlbGVtZW50S2V5TWFwOiBFbGVtZW50S2V5TWFwID0gbmV3IFdlYWtNYXAoKTtcbiAgcHJpdmF0ZSB3YXRjaGVyTWFwOiBXYXRjaGVyTWFwID0gbmV3IFdlYWtNYXAoKTsgICAgIC8vIHNwZWNpYWwgdHJpZ2dlcnMgdG8gdXBkYXRlIGVsZW1lbnRzXG4gIHByaXZhdGUgdXBkYXRlTWFwOiBCdWlsZGVyTWFwID0gbmV3IFdlYWtNYXAoKTsgICAgICAvLyBjYWxsYmFjayBmdW5jdGlvbnMgdG8gdXBkYXRlIHN0eWxlc1xuICBwcml2YXRlIGNsZWFyTWFwOiBCdWlsZGVyTWFwID0gbmV3IFdlYWtNYXAoKTsgICAgICAgLy8gY2FsbGJhY2sgZnVuY3Rpb25zIHRvIGNsZWFyIHN0eWxlc1xuXG4gIHByaXZhdGUgc3ViamVjdDogU3ViamVjdDxFbGVtZW50TWF0Y2hlcj4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGdldCBhY3RpdmF0ZWRBbGlhcygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzWzBdPy5hbGlhcyA/PyAnJztcbiAgfVxuXG4gIHNldCBhY3RpdmF0ZWRCcmVha3BvaW50cyhicHM6IEJyZWFrUG9pbnRbXSkge1xuICAgIHRoaXMuX2FjdGl2YXRlZEJyZWFrcG9pbnRzID0gWy4uLmJwc107XG4gIH1cblxuICBnZXQgYWN0aXZhdGVkQnJlYWtwb2ludHMoKTogQnJlYWtQb2ludFtdIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX2FjdGl2YXRlZEJyZWFrcG9pbnRzXTtcbiAgfVxuXG4gIHNldCB1c2VGYWxsYmFja3ModmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl91c2VGYWxsYmFja3MgPSB2YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBtYXRjaE1lZGlhOiBNYXRjaE1lZGlhLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgYnJlYWtwb2ludHM6IEJyZWFrUG9pbnRSZWdpc3RyeSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIGhvb2s6IFByaW50SG9vaykge1xuICAgIHRoaXMub2JzZXJ2ZUFjdGl2YXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHN0eWxlcyBvbiBicmVha3BvaW50IGFjdGl2YXRlcyBvciBkZWFjdGl2YXRlc1xuICAgKiBAcGFyYW0gbWNcbiAgICovXG4gIG9uTWVkaWFDaGFuZ2UobWM6IE1lZGlhQ2hhbmdlKSB7XG4gICAgY29uc3QgYnA6IEJyZWFrUG9pbnQgfCBudWxsID0gdGhpcy5maW5kQnlRdWVyeShtYy5tZWRpYVF1ZXJ5KTtcblxuICAgIGlmIChicCkge1xuICAgICAgbWMgPSBtZXJnZUFsaWFzKG1jLCBicCk7XG5cbiAgICAgIGNvbnN0IGJwSW5kZXggPSB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzLmluZGV4T2YoYnApO1xuXG4gICAgICBpZiAobWMubWF0Y2hlcyAmJiBicEluZGV4ID09PSAtMSkge1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZWRCcmVha3BvaW50cy5wdXNoKGJwKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVkQnJlYWtwb2ludHMuc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0eWxlcygpO1xuICAgICAgfSBlbHNlIGlmICghbWMubWF0Y2hlcyAmJiBicEluZGV4ICE9PSAtMSkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGJyZWFrcG9pbnQgd2hlbiBpdCdzIGRlYWN0aXZhdGVkXG4gICAgICAgIHRoaXMuX2FjdGl2YXRlZEJyZWFrcG9pbnRzLnNwbGljZShicEluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVkQnJlYWtwb2ludHMuc29ydChzb3J0RGVzY2VuZGluZ1ByaW9yaXR5KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVN0eWxlcygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBpbml0aWFsaXplIHRoZSBtYXJzaGFsbGVyIHdpdGggbmVjZXNzYXJ5IGVsZW1lbnRzIGZvciBkZWxlZ2F0aW9uIG9uIGFuIGVsZW1lbnRcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcGFyYW0gdXBkYXRlRm4gb3B0aW9uYWwgY2FsbGJhY2sgc28gdGhhdCBjdXN0b20gYnAgZGlyZWN0aXZlcyBkb24ndCBoYXZlIHRvIHJlLXByb3ZpZGUgdGhpc1xuICAgKiBAcGFyYW0gY2xlYXJGbiBvcHRpb25hbCBjYWxsYmFjayBzbyB0aGF0IGN1c3RvbSBicCBkaXJlY3RpdmVzIGRvbid0IGhhdmUgdG8gcmUtcHJvdmlkZSB0aGlzXG4gICAqIEBwYXJhbSBleHRyYVRyaWdnZXJzIG90aGVyIHRyaWdnZXJzIHRvIGZvcmNlIHN0eWxlIHVwZGF0ZXMgKGUuZy4gbGF5b3V0LCBkaXJlY3Rpb25hbGl0eSwgZXRjKVxuICAgKi9cbiAgaW5pdChlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICB1cGRhdGVGbj86IFVwZGF0ZUNhbGxiYWNrLFxuICAgICAgIGNsZWFyRm4/OiBDbGVhckNhbGxiYWNrLFxuICAgICAgIGV4dHJhVHJpZ2dlcnM6IE9ic2VydmFibGU8YW55PltdID0gW10pOiB2b2lkIHtcblxuICAgIGluaXRCdWlsZGVyTWFwKHRoaXMudXBkYXRlTWFwLCBlbGVtZW50LCBrZXksIHVwZGF0ZUZuKTtcbiAgICBpbml0QnVpbGRlck1hcCh0aGlzLmNsZWFyTWFwLCBlbGVtZW50LCBrZXksIGNsZWFyRm4pO1xuXG4gICAgdGhpcy5idWlsZEVsZW1lbnRLZXlNYXAoZWxlbWVudCwga2V5KTtcbiAgICB0aGlzLndhdGNoRXh0cmFUcmlnZ2VycyhlbGVtZW50LCBrZXksIGV4dHJhVHJpZ2dlcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgdmFsdWUgZm9yIGFuIGVsZW1lbnQgYW5kIGtleSBhbmQgb3B0aW9uYWxseSBhIGdpdmVuIGJyZWFrcG9pbnRcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcGFyYW0gYnBcbiAgICovXG4gIGdldFZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZywgYnA/OiBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IGJwTWFwID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoYnBNYXApIHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGJwICE9PSB1bmRlZmluZWQgPyBicE1hcC5nZXQoYnApIDogdGhpcy5nZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXAsIGtleSk7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXMuZ2V0KGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogd2hldGhlciB0aGUgZWxlbWVudCBoYXMgdmFsdWVzIGZvciBhIGdpdmVuIGtleVxuICAgKiBAcGFyYW0gZWxlbWVudFxuICAgKiBAcGFyYW0ga2V5XG4gICAqL1xuICBoYXNWYWx1ZShlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBicE1hcCA9IHRoaXMuZWxlbWVudE1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGJwTWFwKSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCwga2V5KTtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5nZXQoa2V5KSAhPT0gdW5kZWZpbmVkIHx8IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSB2YWx1ZSBmb3IgYW4gaW5wdXQgb24gYSBkaXJlY3RpdmVcbiAgICogQHBhcmFtIGVsZW1lbnQgdGhlIGVsZW1lbnQgaW4gcXVlc3Rpb25cbiAgICogQHBhcmFtIGtleSB0aGUgdHlwZSBvZiB0aGUgZGlyZWN0aXZlIChlLmcuIGZsZXgsIGxheW91dC1nYXAsIGV0YylcbiAgICogQHBhcmFtIGJwIHRoZSBicmVha3BvaW50IHN1ZmZpeCAoZW1wdHkgc3RyaW5nID0gZGVmYXVsdClcbiAgICogQHBhcmFtIHZhbCB0aGUgdmFsdWUgZm9yIHRoZSBicmVha3BvaW50XG4gICAqL1xuICBzZXRWYWx1ZShlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5OiBzdHJpbmcsIHZhbDogYW55LCBicDogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGJwTWFwOiBCcmVha3BvaW50TWFwIHwgdW5kZWZpbmVkID0gdGhpcy5lbGVtZW50TWFwLmdldChlbGVtZW50KTtcbiAgICBpZiAoIWJwTWFwKSB7XG4gICAgICBicE1hcCA9IG5ldyBNYXAoKS5zZXQoYnAsIG5ldyBNYXAoKS5zZXQoa2V5LCB2YWwpKTtcbiAgICAgIHRoaXMuZWxlbWVudE1hcC5zZXQoZWxlbWVudCwgYnBNYXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB2YWx1ZXMgPSAoYnBNYXAuZ2V0KGJwKSA/PyBuZXcgTWFwKCkpLnNldChrZXksIHZhbCk7XG4gICAgICBicE1hcC5zZXQoYnAsIHZhbHVlcyk7XG4gICAgICB0aGlzLmVsZW1lbnRNYXAuc2V0KGVsZW1lbnQsIGJwTWFwKTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGVsZW1lbnQsIGtleSk7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudXBkYXRlRWxlbWVudChlbGVtZW50LCBrZXksIHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogVHJhY2sgZWxlbWVudCB2YWx1ZSBjaGFuZ2VzIGZvciBhIHNwZWNpZmljIGtleSAqL1xuICB0cmFja1ZhbHVlKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZyk6IE9ic2VydmFibGU8RWxlbWVudE1hdGNoZXI+IHtcbiAgICByZXR1cm4gdGhpcy5zdWJqZWN0XG4gICAgICAgIC5hc09ic2VydmFibGUoKVxuICAgICAgICAucGlwZShmaWx0ZXIodiA9PiB2LmVsZW1lbnQgPT09IGVsZW1lbnQgJiYgdi5rZXkgPT09IGtleSkpO1xuICB9XG5cbiAgLyoqIHVwZGF0ZSBhbGwgc3R5bGVzIGZvciBhbGwgZWxlbWVudHMgb24gdGhlIGN1cnJlbnQgYnJlYWtwb2ludCAqL1xuICB1cGRhdGVTdHlsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50TWFwLmZvckVhY2goKGJwTWFwLCBlbCkgPT4ge1xuICAgICAgY29uc3Qga2V5TWFwID0gbmV3IFNldCh0aGlzLmVsZW1lbnRLZXlNYXAuZ2V0KGVsKSEpO1xuICAgICAgbGV0IHZhbHVlTWFwID0gdGhpcy5nZXRBY3RpdmF0ZWRWYWx1ZXMoYnBNYXApO1xuXG4gICAgICBpZiAodmFsdWVNYXApIHtcbiAgICAgICAgdmFsdWVNYXAuZm9yRWFjaCgodiwgaykgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudChlbCwgaywgdik7XG4gICAgICAgICAga2V5TWFwLmRlbGV0ZShrKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGtleU1hcC5mb3JFYWNoKGsgPT4ge1xuICAgICAgICB2YWx1ZU1hcCA9IHRoaXMuZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwLCBrKTtcbiAgICAgICAgaWYgKHZhbHVlTWFwKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZU1hcC5nZXQoayk7XG4gICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsLCBrLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbGVhckVsZW1lbnQoZWwsIGspO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjbGVhciB0aGUgc3R5bGVzIGZvciBhIGdpdmVuIGVsZW1lbnRcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgY2xlYXJFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGJ1aWxkZXJzID0gdGhpcy5jbGVhck1hcC5nZXQoZWxlbWVudCk7XG5cbiAgICBpZiAoYnVpbGRlcnMpIHtcbiAgICAgIGNvbnN0IGNsZWFyRm46IENsZWFyQ2FsbGJhY2sgPSBidWlsZGVycy5nZXQoa2V5KSBhcyBDbGVhckNhbGxiYWNrO1xuICAgICAgaWYgKCEhY2xlYXJGbikge1xuICAgICAgICBjbGVhckZuKCk7XG4gICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtlbGVtZW50LCBrZXksIHZhbHVlOiAnJ30pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB1cGRhdGUgYSBnaXZlbiBlbGVtZW50IHdpdGggdGhlIGFjdGl2YXRlZCB2YWx1ZXMgZm9yIGEgZ2l2ZW4ga2V5XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqIEBwYXJhbSBrZXlcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB1cGRhdGVFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGJ1aWxkZXJzID0gdGhpcy51cGRhdGVNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChidWlsZGVycykge1xuICAgICAgY29uc3QgdXBkYXRlRm46IFVwZGF0ZUNhbGxiYWNrID0gYnVpbGRlcnMuZ2V0KGtleSkgYXMgVXBkYXRlQ2FsbGJhY2s7XG4gICAgICBpZiAoISF1cGRhdGVGbikge1xuICAgICAgICB1cGRhdGVGbih2YWx1ZSk7XG4gICAgICAgIHRoaXMuc3ViamVjdC5uZXh0KHtlbGVtZW50LCBrZXksIHZhbHVlfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJlbGVhc2UgYWxsIHJlZmVyZW5jZXMgdG8gYSBnaXZlbiBlbGVtZW50XG4gICAqIEBwYXJhbSBlbGVtZW50XG4gICAqL1xuICByZWxlYXNlRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGNvbnN0IHdhdGNoZXJNYXAgPSB0aGlzLndhdGNoZXJNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmICh3YXRjaGVyTWFwKSB7XG4gICAgICB3YXRjaGVyTWFwLmZvckVhY2gocyA9PiBzLnVuc3Vic2NyaWJlKCkpO1xuICAgICAgdGhpcy53YXRjaGVyTWFwLmRlbGV0ZShlbGVtZW50KTtcbiAgICB9XG4gICAgY29uc3QgZWxlbWVudE1hcCA9IHRoaXMuZWxlbWVudE1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGVsZW1lbnRNYXApIHtcbiAgICAgIGVsZW1lbnRNYXAuZm9yRWFjaCgoXywgcykgPT4gZWxlbWVudE1hcC5kZWxldGUocykpO1xuICAgICAgdGhpcy5lbGVtZW50TWFwLmRlbGV0ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdHJpZ2dlciBhbiB1cGRhdGUgZm9yIGEgZ2l2ZW4gZWxlbWVudCBhbmQga2V5IChlLmcuIGxheW91dClcbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGtleVxuICAgKi9cbiAgdHJpZ2dlclVwZGF0ZShlbGVtZW50OiBIVE1MRWxlbWVudCwga2V5Pzogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgYnBNYXAgPSB0aGlzLmVsZW1lbnRNYXAuZ2V0KGVsZW1lbnQpO1xuICAgIGlmIChicE1hcCkge1xuICAgICAgY29uc3QgdmFsdWVNYXAgPSB0aGlzLmdldEFjdGl2YXRlZFZhbHVlcyhicE1hcCwga2V5KTtcbiAgICAgIGlmICh2YWx1ZU1hcCkge1xuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsZW1lbnQsIGtleSwgdmFsdWVNYXAuZ2V0KGtleSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlTWFwLmZvckVhY2goKHYsIGspID0+IHRoaXMudXBkYXRlRWxlbWVudChlbGVtZW50LCBrLCB2KSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQ3Jvc3MtcmVmZXJlbmNlIGZvciBIVE1MRWxlbWVudCB3aXRoIGRpcmVjdGl2ZSBrZXkgKi9cbiAgcHJpdmF0ZSBidWlsZEVsZW1lbnRLZXlNYXAoZWxlbWVudDogSFRNTEVsZW1lbnQsIGtleTogc3RyaW5nKSB7XG4gICAgbGV0IGtleU1hcCA9IHRoaXMuZWxlbWVudEtleU1hcC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKCFrZXlNYXApIHtcbiAgICAgIGtleU1hcCA9IG5ldyBTZXQoKTtcbiAgICAgIHRoaXMuZWxlbWVudEtleU1hcC5zZXQoZWxlbWVudCwga2V5TWFwKTtcbiAgICB9XG4gICAga2V5TWFwLmFkZChrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE90aGVyIHRyaWdnZXJzIHRoYXQgc2hvdWxkIGZvcmNlIHN0eWxlIHVwZGF0ZXM6XG4gICAqIC0gZGlyZWN0aW9uYWxpdHlcbiAgICogLSBsYXlvdXQgY2hhbmdlc1xuICAgKiAtIG11dGF0aW9ub2JzZXJ2ZXIgdXBkYXRlc1xuICAgKi9cbiAgcHJpdmF0ZSB3YXRjaEV4dHJhVHJpZ2dlcnMoZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyczogT2JzZXJ2YWJsZTxhbnk+W10pIHtcbiAgICBpZiAodHJpZ2dlcnMgJiYgdHJpZ2dlcnMubGVuZ3RoKSB7XG4gICAgICBsZXQgd2F0Y2hlcnMgPSB0aGlzLndhdGNoZXJNYXAuZ2V0KGVsZW1lbnQpO1xuICAgICAgaWYgKCF3YXRjaGVycykge1xuICAgICAgICB3YXRjaGVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy53YXRjaGVyTWFwLnNldChlbGVtZW50LCB3YXRjaGVycyk7XG4gICAgICB9XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSB3YXRjaGVycy5nZXQoa2V5KTtcbiAgICAgIGlmICghc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIGNvbnN0IG5ld1N1YnNjcmlwdGlvbiA9IG1lcmdlKC4uLnRyaWdnZXJzKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoZWxlbWVudCwga2V5KTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoZWxlbWVudCwga2V5LCBjdXJyZW50VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgd2F0Y2hlcnMuc2V0KGtleSwgbmV3U3Vic2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQnJlYWtwb2ludCBsb2NhdG9yIGJ5IG1lZGlhUXVlcnkgKi9cbiAgcHJpdmF0ZSBmaW5kQnlRdWVyeShxdWVyeTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuYnJlYWtwb2ludHMuZmluZEJ5UXVlcnkocXVlcnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgZmFsbGJhY2sgYnJlYWtwb2ludCBmb3IgYSBnaXZlbiBlbGVtZW50LCBzdGFydGluZyB3aXRoIHRoZSBjdXJyZW50IGJyZWFrcG9pbnRcbiAgICogQHBhcmFtIGJwTWFwXG4gICAqIEBwYXJhbSBrZXlcbiAgICovXG4gIHByaXZhdGUgZ2V0QWN0aXZhdGVkVmFsdWVzKGJwTWFwOiBCcmVha3BvaW50TWFwLCBrZXk/OiBzdHJpbmcpOiBWYWx1ZU1hcCB8IHVuZGVmaW5lZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmFjdGl2YXRlZEJyZWFrcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhY3RpdmF0ZWRCcCA9IHRoaXMuYWN0aXZhdGVkQnJlYWtwb2ludHNbaV07XG4gICAgICBjb25zdCB2YWx1ZU1hcCA9IGJwTWFwLmdldChhY3RpdmF0ZWRCcC5hbGlhcyk7XG5cbiAgICAgIGlmICh2YWx1ZU1hcCkge1xuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQgfHwgKHZhbHVlTWFwLmhhcyhrZXkpICYmIHZhbHVlTWFwLmdldChrZXkpICE9IG51bGwpKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlTWFwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gT24gdGhlIHNlcnZlciwgd2UgZXhwbGljaXRseSBoYXZlIGFuIFwiYWxsXCIgc2VjdGlvbiBmaWxsZWQgaW4gdG8gYmVnaW4gd2l0aC5cbiAgICAvLyBTbyB3ZSBkb24ndCBuZWVkIHRvIGFnZ3Jlc3NpdmVseSBmaW5kIGEgZmFsbGJhY2sgaWYgbm8gZXhwbGljaXQgdmFsdWUgZXhpc3RzLlxuICAgIGlmICghdGhpcy5fdXNlRmFsbGJhY2tzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RIb3BlID0gYnBNYXAuZ2V0KCcnKTtcbiAgICByZXR1cm4gKGtleSA9PT0gdW5kZWZpbmVkIHx8IGxhc3RIb3BlICYmIGxhc3RIb3BlLmhhcyhrZXkpKSA/IGxhc3RIb3BlIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFdhdGNoIGZvciBtZWRpYVF1ZXJ5IGJyZWFrcG9pbnQgYWN0aXZhdGlvbnNcbiAgICovXG4gIHByaXZhdGUgb2JzZXJ2ZUFjdGl2YXRpb25zKCkge1xuICAgIGNvbnN0IHF1ZXJpZXMgPSB0aGlzLmJyZWFrcG9pbnRzLml0ZW1zLm1hcChicCA9PiBicC5tZWRpYVF1ZXJ5KTtcblxuICAgIHRoaXMuaG9vay5yZWdpc3RlckJlZm9yZUFmdGVyUHJpbnRIb29rcyh0aGlzKTtcbiAgICB0aGlzLm1hdGNoTWVkaWFcbiAgICAgICAgLm9ic2VydmUodGhpcy5ob29rLndpdGhQcmludFF1ZXJ5KHF1ZXJpZXMpKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAgIHRhcCh0aGlzLmhvb2suaW50ZXJjZXB0RXZlbnRzKHRoaXMpKSxcbiAgICAgICAgICAgIGZpbHRlcih0aGlzLmhvb2suYmxvY2tQcm9wYWdhdGlvbigpKVxuICAgICAgICApXG4gICAgICAgIC5zdWJzY3JpYmUodGhpcy5vbk1lZGlhQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gaW5pdEJ1aWxkZXJNYXAobWFwOiBCdWlsZGVyTWFwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0PzogQnVpbGRlcik6IHZvaWQge1xuICBpZiAoaW5wdXQgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IG9sZE1hcCA9IG1hcC5nZXQoZWxlbWVudCkgPz8gbmV3IE1hcCgpO1xuICAgIG9sZE1hcC5zZXQoa2V5LCBpbnB1dCk7XG4gICAgbWFwLnNldChlbGVtZW50LCBvbGRNYXApO1xuICB9XG59XG5cbiJdfQ==