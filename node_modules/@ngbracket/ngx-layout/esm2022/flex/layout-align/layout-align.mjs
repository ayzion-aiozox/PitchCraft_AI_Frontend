/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@ngbracket/ngx-layout/core';
import { takeUntil } from 'rxjs/operators';
import { extendObject, isFlowHorizontal, LAYOUT_VALUES, } from '@ngbracket/ngx-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "@ngbracket/ngx-layout/core";
export class LayoutAlignStyleBuilder extends StyleBuilder {
    buildStyles(align, parent) {
        const css = {}, [mainAxis, crossAxis] = align.split(' ');
        // Main axis
        switch (mainAxis) {
            case 'center':
                css['justify-content'] = 'center';
                break;
            case 'space-around':
                css['justify-content'] = 'space-around';
                break;
            case 'space-between':
                css['justify-content'] = 'space-between';
                break;
            case 'space-evenly':
                css['justify-content'] = 'space-evenly';
                break;
            case 'end':
            case 'flex-end':
                css['justify-content'] = 'flex-end';
                break;
            case 'start':
            case 'flex-start':
            default: // default main axis
                css['justify-content'] = 'flex-start';
                break;
        }
        // Cross-axis
        switch (crossAxis) {
            case 'start':
            case 'flex-start':
                css['align-items'] = css['align-content'] = 'flex-start';
                break;
            case 'center':
                css['align-items'] = css['align-content'] = 'center';
                break;
            case 'end':
            case 'flex-end':
                css['align-items'] = css['align-content'] = 'flex-end';
                break;
            case 'space-between':
                css['align-content'] = 'space-between';
                css['align-items'] = 'stretch';
                break;
            case 'space-around':
                css['align-content'] = 'space-around';
                css['align-items'] = 'stretch';
                break;
            case 'baseline':
                css['align-content'] = 'stretch';
                css['align-items'] = 'baseline';
                break;
            case 'stretch':
            default: // 'stretch'
                // default cross axis
                css['align-items'] = css['align-content'] = 'stretch';
                break;
        }
        return extendObject(css, {
            display: parent.inline ? 'inline-flex' : 'flex',
            'flex-direction': parent.layout,
            'box-sizing': 'border-box',
            'max-width': crossAxis === 'stretch'
                ? !isFlowHorizontal(parent.layout)
                    ? '100%'
                    : null
                : null,
            'max-height': crossAxis === 'stretch'
                ? isFlowHorizontal(parent.layout)
                    ? '100%'
                    : null
                : null,
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutAlignStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutAlignStyleBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
const inputs = [
    'fxLayoutAlign',
    'fxLayoutAlign.xs',
    'fxLayoutAlign.sm',
    'fxLayoutAlign.md',
    'fxLayoutAlign.lg',
    'fxLayoutAlign.xl',
    'fxLayoutAlign.lt-sm',
    'fxLayoutAlign.lt-md',
    'fxLayoutAlign.lt-lg',
    'fxLayoutAlign.lt-xl',
    'fxLayoutAlign.gt-xs',
    'fxLayoutAlign.gt-sm',
    'fxLayoutAlign.gt-md',
    'fxLayoutAlign.gt-lg',
];
const selector = `
  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],
  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],
  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],
  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]
`;
/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
export class LayoutAlignDirective extends BaseDirective2 {
    constructor(elRef, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.DIRECTIVE_KEY = 'layout-align';
        this.layout = 'row'; // default flex-direction
        this.inline = false; // default inline value
        this.init();
        this.marshal
            .trackValue(this.nativeElement, 'layout')
            .pipe(takeUntil(this.destroySubject))
            .subscribe(this.onLayoutChange.bind(this));
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *
     */
    updateWithValue(value) {
        const layout = this.layout || 'row';
        const inline = this.inline;
        if (layout === 'row' && inline) {
            this.styleCache = layoutAlignHorizontalInlineCache;
        }
        else if (layout === 'row' && !inline) {
            this.styleCache = layoutAlignHorizontalCache;
        }
        else if (layout === 'row-reverse' && inline) {
            this.styleCache = layoutAlignHorizontalRevInlineCache;
        }
        else if (layout === 'row-reverse' && !inline) {
            this.styleCache = layoutAlignHorizontalRevCache;
        }
        else if (layout === 'column' && inline) {
            this.styleCache = layoutAlignVerticalInlineCache;
        }
        else if (layout === 'column' && !inline) {
            this.styleCache = layoutAlignVerticalCache;
        }
        else if (layout === 'column-reverse' && inline) {
            this.styleCache = layoutAlignVerticalRevInlineCache;
        }
        else if (layout === 'column-reverse' && !inline) {
            this.styleCache = layoutAlignVerticalRevCache;
        }
        this.addStyles(value, { layout, inline });
    }
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    onLayoutChange(matcher) {
        const layoutKeys = matcher.value.split(' ');
        this.layout = layoutKeys[0];
        this.inline = matcher.value.includes('inline');
        if (!LAYOUT_VALUES.find((x) => x === this.layout)) {
            this.layout = 'row';
        }
        this.triggerUpdate();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutAlignDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: LayoutAlignStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: LayoutAlignDirective, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: LayoutAlignStyleBuilder }, { type: i1.MediaMarshaller }] });
export class DefaultLayoutAlignDirective extends LayoutAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultLayoutAlignDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultLayoutAlignDirective, selector: "\n  [fxLayoutAlign], [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md],\n  [fxLayoutAlign.lg], [fxLayoutAlign.xl], [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md],\n  [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl], [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm],\n  [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]\n", inputs: { fxLayoutAlign: "fxLayoutAlign", "fxLayoutAlign.xs": "fxLayoutAlign.xs", "fxLayoutAlign.sm": "fxLayoutAlign.sm", "fxLayoutAlign.md": "fxLayoutAlign.md", "fxLayoutAlign.lg": "fxLayoutAlign.lg", "fxLayoutAlign.xl": "fxLayoutAlign.xl", "fxLayoutAlign.lt-sm": "fxLayoutAlign.lt-sm", "fxLayoutAlign.lt-md": "fxLayoutAlign.lt-md", "fxLayoutAlign.lt-lg": "fxLayoutAlign.lt-lg", "fxLayoutAlign.lt-xl": "fxLayoutAlign.lt-xl", "fxLayoutAlign.gt-xs": "fxLayoutAlign.gt-xs", "fxLayoutAlign.gt-sm": "fxLayoutAlign.gt-sm", "fxLayoutAlign.gt-md": "fxLayoutAlign.gt-md", "fxLayoutAlign.gt-lg": "fxLayoutAlign.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultLayoutAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const layoutAlignHorizontalCache = new Map();
const layoutAlignVerticalCache = new Map();
const layoutAlignHorizontalRevCache = new Map();
const layoutAlignVerticalRevCache = new Map();
const layoutAlignHorizontalInlineCache = new Map();
const layoutAlignVerticalInlineCache = new Map();
const layoutAlignHorizontalRevInlineCache = new Map();
const layoutAlignVerticalRevInlineCache = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LWFsaWduLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L2xheW91dC1hbGlnbi9sYXlvdXQtYWxpZ24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFFLFNBQVMsRUFBYyxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEUsT0FBTyxFQUNMLGNBQWMsRUFHZCxZQUFZLEdBR2IsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUNMLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsYUFBYSxHQUNkLE1BQU0sc0NBQXNDLENBQUM7OztBQVE5QyxNQUFNLE9BQU8sdUJBQXdCLFNBQVEsWUFBWTtJQUN2RCxXQUFXLENBQUMsS0FBYSxFQUFFLE1BQXlCO1FBQ2xELE1BQU0sR0FBRyxHQUFvQixFQUFFLEVBQzdCLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFM0MsWUFBWTtRQUNaLFFBQVEsUUFBUSxFQUFFO1lBQ2hCLEtBQUssUUFBUTtnQkFDWCxHQUFHLENBQUMsaUJBQWlCLENBQUMsR0FBRyxRQUFRLENBQUM7Z0JBQ2xDLE1BQU07WUFDUixLQUFLLGNBQWM7Z0JBQ2pCLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLGNBQWMsQ0FBQztnQkFDeEMsTUFBTTtZQUNSLEtBQUssZUFBZTtnQkFDbEIsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsZUFBZSxDQUFDO2dCQUN6QyxNQUFNO1lBQ1IsS0FBSyxjQUFjO2dCQUNqQixHQUFHLENBQUMsaUJBQWlCLENBQUMsR0FBRyxjQUFjLENBQUM7Z0JBQ3hDLE1BQU07WUFDUixLQUFLLEtBQUssQ0FBQztZQUNY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U0FDckI7UUFDRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQzs4R0E1RFUsb0JBQW9CO2tHQUFwQixvQkFBb0I7OzJGQUFwQixvQkFBb0I7a0JBRGhDLFNBQVM7O0FBaUVWLE1BQU0sT0FBTywyQkFBNEIsU0FBUSxvQkFBb0I7SUFEckU7O1FBRXFCLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDcEM7OEdBRlksMkJBQTJCO2tHQUEzQiwyQkFBMkI7OzJGQUEzQiwyQkFBMkI7a0JBRHZDLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFOztBQUsvQixNQUFNLDBCQUEwQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzNFLE1BQU0sd0JBQXdCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDekUsTUFBTSw2QkFBNkIsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM5RSxNQUFNLDJCQUEyQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzVFLE1BQU0sZ0NBQWdDLEdBQ3BDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDWixNQUFNLDhCQUE4QixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQy9FLE1BQU0sbUNBQW1DLEdBQ3ZDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDWixNQUFNLGlDQUFpQyxHQUNyQyxJQUFJLEdBQUcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBFbGVtZW50TWF0Y2hlcixcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbn0gZnJvbSAnQG5nYnJhY2tldC9uZ3gtbGF5b3V0L2NvcmUnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICBleHRlbmRPYmplY3QsXG4gIGlzRmxvd0hvcml6b250YWwsXG4gIExBWU9VVF9WQUxVRVMsXG59IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9fcHJpdmF0ZS11dGlscyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGF5b3V0QWxpZ25QYXJlbnQge1xuICBsYXlvdXQ6IHN0cmluZztcbiAgaW5saW5lOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIExheW91dEFsaWduU3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoYWxpZ246IHN0cmluZywgcGFyZW50OiBMYXlvdXRBbGlnblBhcmVudCkge1xuICAgIGNvbnN0IGNzczogU3R5bGVEZWZpbml0aW9uID0ge30sXG4gICAgICBbbWFpbkF4aXMsIGNyb3NzQXhpc10gPSBhbGlnbi5zcGxpdCgnICcpO1xuXG4gICAgLy8gTWFpbiBheGlzXG4gICAgc3dpdGNoIChtYWluQXhpcykge1xuICAgICAgY2FzZSAnY2VudGVyJzpcbiAgICAgICAgY3NzWydqdXN0aWZ5LWNvbnRlbnQnXSA9ICdjZW50ZXInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NwYWNlLWFyb3VuZCc6XG4gICAgICAgIGNzc1snanVzdGlmeS1jb250ZW50J10gPSAnc3BhY2UtYXJvdW5kJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGFjZS1iZXR3ZWVuJzpcbiAgICAgICAgY3NzWydqdXN0aWZ5LWNvbnRlbnQnXSA9ICdzcGFjZS1iZXR3ZWVuJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGFjZS1ldmVubHknOlxuICAgICAgICBjc3NbJ2p1c3RpZnktY29udGVudCddID0gJ3NwYWNlLWV2ZW5seSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZW5kJzpcbiAgICAgIGNhc2UgJ2ZsZXgtZW5kJzpcbiAgICAgICAgY3NzWydqdXN0aWZ5LWNvbnRlbnQnXSA9ICdmbGV4LWVuZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgY2FzZSAnZmxleC1zdGFydCc6XG4gICAgICBkZWZhdWx0OiAvLyBkZWZhdWx0IG1haW4gYXhpc1xuICAgICAgICBjc3NbJ2p1c3RpZnktY29udGVudCddID0gJ2ZsZXgtc3RhcnQnO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBDcm9zcy1heGlzXG4gICAgc3dpdGNoIChjcm9zc0F4aXMpIHtcbiAgICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgIGNhc2UgJ2ZsZXgtc3RhcnQnOlxuICAgICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdmbGV4LXN0YXJ0JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjZW50ZXInOlxuICAgICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdjZW50ZXInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICBjYXNlICdmbGV4LWVuZCc6XG4gICAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9IGNzc1snYWxpZ24tY29udGVudCddID0gJ2ZsZXgtZW5kJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGFjZS1iZXR3ZWVuJzpcbiAgICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3BhY2UtYmV0d2Vlbic7XG4gICAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9ICdzdHJldGNoJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzcGFjZS1hcm91bmQnOlxuICAgICAgICBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdzcGFjZS1hcm91bmQnO1xuICAgICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnc3RyZXRjaCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYmFzZWxpbmUnOlxuICAgICAgICBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdzdHJldGNoJztcbiAgICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gJ2Jhc2VsaW5lJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzdHJldGNoJzpcbiAgICAgIGRlZmF1bHQ6IC8vICdzdHJldGNoJ1xuICAgICAgICAvLyBkZWZhdWx0IGNyb3NzIGF4aXNcbiAgICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3RyZXRjaCc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBleHRlbmRPYmplY3QoY3NzLCB7XG4gICAgICBkaXNwbGF5OiBwYXJlbnQuaW5saW5lID8gJ2lubGluZS1mbGV4JyA6ICdmbGV4JyxcbiAgICAgICdmbGV4LWRpcmVjdGlvbic6IHBhcmVudC5sYXlvdXQsXG4gICAgICAnYm94LXNpemluZyc6ICdib3JkZXItYm94JyxcbiAgICAgICdtYXgtd2lkdGgnOlxuICAgICAgICBjcm9zc0F4aXMgPT09ICdzdHJldGNoJ1xuICAgICAgICAgID8gIWlzRmxvd0hvcml6b250YWwocGFyZW50LmxheW91dClcbiAgICAgICAgICAgID8gJzEwMCUnXG4gICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICA6IG51bGwsXG4gICAgICAnbWF4LWhlaWdodCc6XG4gICAgICAgIGNyb3NzQXhpcyA9PT0gJ3N0cmV0Y2gnXG4gICAgICAgICAgPyBpc0Zsb3dIb3Jpem9udGFsKHBhcmVudC5sYXlvdXQpXG4gICAgICAgICAgICA/ICcxMDAlJ1xuICAgICAgICAgICAgOiBudWxsXG4gICAgICAgICAgOiBudWxsLFxuICAgIH0pIGFzIFN0eWxlRGVmaW5pdGlvbjtcbiAgfVxufVxuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdmeExheW91dEFsaWduJyxcbiAgJ2Z4TGF5b3V0QWxpZ24ueHMnLFxuICAnZnhMYXlvdXRBbGlnbi5zbScsXG4gICdmeExheW91dEFsaWduLm1kJyxcbiAgJ2Z4TGF5b3V0QWxpZ24ubGcnLFxuICAnZnhMYXlvdXRBbGlnbi54bCcsXG4gICdmeExheW91dEFsaWduLmx0LXNtJyxcbiAgJ2Z4TGF5b3V0QWxpZ24ubHQtbWQnLFxuICAnZnhMYXlvdXRBbGlnbi5sdC1sZycsXG4gICdmeExheW91dEFsaWduLmx0LXhsJyxcbiAgJ2Z4TGF5b3V0QWxpZ24uZ3QteHMnLFxuICAnZnhMYXlvdXRBbGlnbi5ndC1zbScsXG4gICdmeExheW91dEFsaWduLmd0LW1kJyxcbiAgJ2Z4TGF5b3V0QWxpZ24uZ3QtbGcnLFxuXTtcbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZnhMYXlvdXRBbGlnbl0sIFtmeExheW91dEFsaWduLnhzXSwgW2Z4TGF5b3V0QWxpZ24uc21dLCBbZnhMYXlvdXRBbGlnbi5tZF0sXG4gIFtmeExheW91dEFsaWduLmxnXSwgW2Z4TGF5b3V0QWxpZ24ueGxdLCBbZnhMYXlvdXRBbGlnbi5sdC1zbV0sIFtmeExheW91dEFsaWduLmx0LW1kXSxcbiAgW2Z4TGF5b3V0QWxpZ24ubHQtbGddLCBbZnhMYXlvdXRBbGlnbi5sdC14bF0sIFtmeExheW91dEFsaWduLmd0LXhzXSwgW2Z4TGF5b3V0QWxpZ24uZ3Qtc21dLFxuICBbZnhMYXlvdXRBbGlnbi5ndC1tZF0sIFtmeExheW91dEFsaWduLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnbGF5b3V0LWFsaWduJyBmbGV4Ym94IHN0eWxpbmcgZGlyZWN0aXZlXG4gKiAgRGVmaW5lcyBwb3NpdGlvbmluZyBvZiBjaGlsZCBlbGVtZW50cyBhbG9uZyBtYWluIGFuZCBjcm9zcyBheGlzIGluIGEgbGF5b3V0IGNvbnRhaW5lclxuICogIE9wdGlvbmFsIHZhbHVlczoge21haW4tYXhpc30gdmFsdWVzIG9yIHttYWluLWF4aXMgY3Jvc3MtYXhpc30gdmFsdWUgcGFpcnNcbiAqXG4gKiAgQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL2FsbWFuYWMvcHJvcGVydGllcy9qL2p1c3RpZnktY29udGVudC9cbiAqICBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vYWxtYW5hYy9wcm9wZXJ0aWVzL2EvYWxpZ24taXRlbXMvXG4gKiAgQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL2FsbWFuYWMvcHJvcGVydGllcy9hL2FsaWduLWNvbnRlbnQvXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIExheW91dEFsaWduRGlyZWN0aXZlIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTIge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgRElSRUNUSVZFX0tFWSA9ICdsYXlvdXQtYWxpZ24nO1xuICBwcm90ZWN0ZWQgbGF5b3V0ID0gJ3Jvdyc7IC8vIGRlZmF1bHQgZmxleC1kaXJlY3Rpb25cbiAgcHJvdGVjdGVkIGlubGluZSA9IGZhbHNlOyAvLyBkZWZhdWx0IGlubGluZSB2YWx1ZVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHN0eWxlVXRpbHM6IFN0eWxlVXRpbHMsXG4gICAgc3R5bGVCdWlsZGVyOiBMYXlvdXRBbGlnblN0eWxlQnVpbGRlcixcbiAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXJcbiAgKSB7XG4gICAgc3VwZXIoZWxSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVVdGlscywgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5tYXJzaGFsXG4gICAgICAudHJhY2tWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsICdsYXlvdXQnKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveVN1YmplY3QpKVxuICAgICAgLnN1YnNjcmliZSh0aGlzLm9uTGF5b3V0Q2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgY29uc3QgbGF5b3V0ID0gdGhpcy5sYXlvdXQgfHwgJ3Jvdyc7XG4gICAgY29uc3QgaW5saW5lID0gdGhpcy5pbmxpbmU7XG4gICAgaWYgKGxheW91dCA9PT0gJ3JvdycgJiYgaW5saW5lKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRBbGlnbkhvcml6b250YWxJbmxpbmVDYWNoZTtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ3JvdycgJiYgIWlubGluZSkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0QWxpZ25Ib3Jpem9udGFsQ2FjaGU7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdyb3ctcmV2ZXJzZScgJiYgaW5saW5lKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRBbGlnbkhvcml6b250YWxSZXZJbmxpbmVDYWNoZTtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ3Jvdy1yZXZlcnNlJyAmJiAhaW5saW5lKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRBbGlnbkhvcml6b250YWxSZXZDYWNoZTtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbicgJiYgaW5saW5lKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRBbGlnblZlcnRpY2FsSW5saW5lQ2FjaGU7XG4gICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdjb2x1bW4nICYmICFpbmxpbmUpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEFsaWduVmVydGljYWxDYWNoZTtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbi1yZXZlcnNlJyAmJiBpbmxpbmUpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEFsaWduVmVydGljYWxSZXZJbmxpbmVDYWNoZTtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbi1yZXZlcnNlJyAmJiAhaW5saW5lKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRBbGlnblZlcnRpY2FsUmV2Q2FjaGU7XG4gICAgfVxuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlLCB7IGxheW91dCwgaW5saW5lIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhY2hlIHRoZSBwYXJlbnQgY29udGFpbmVyICdmbGV4LWRpcmVjdGlvbicgYW5kIHVwZGF0ZSB0aGUgJ2ZsZXgnIHN0eWxlc1xuICAgKi9cbiAgcHJvdGVjdGVkIG9uTGF5b3V0Q2hhbmdlKG1hdGNoZXI6IEVsZW1lbnRNYXRjaGVyKSB7XG4gICAgY29uc3QgbGF5b3V0S2V5czogc3RyaW5nW10gPSBtYXRjaGVyLnZhbHVlLnNwbGl0KCcgJyk7XG4gICAgdGhpcy5sYXlvdXQgPSBsYXlvdXRLZXlzWzBdO1xuICAgIHRoaXMuaW5saW5lID0gbWF0Y2hlci52YWx1ZS5pbmNsdWRlcygnaW5saW5lJyk7XG4gICAgaWYgKCFMQVlPVVRfVkFMVUVTLmZpbmQoKHgpID0+IHggPT09IHRoaXMubGF5b3V0KSkge1xuICAgICAgdGhpcy5sYXlvdXQgPSAncm93JztcbiAgICB9XG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yLCBpbnB1dHMgfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0TGF5b3V0QWxpZ25EaXJlY3RpdmUgZXh0ZW5kcyBMYXlvdXRBbGlnbkRpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbnB1dHMgPSBpbnB1dHM7XG59XG5cbmNvbnN0IGxheW91dEFsaWduSG9yaXpvbnRhbENhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0QWxpZ25WZXJ0aWNhbENhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0QWxpZ25Ib3Jpem9udGFsUmV2Q2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRBbGlnblZlcnRpY2FsUmV2Q2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRBbGlnbkhvcml6b250YWxJbmxpbmVDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9XG4gIG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEFsaWduVmVydGljYWxJbmxpbmVDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEFsaWduSG9yaXpvbnRhbFJldklubGluZUNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID1cbiAgbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0QWxpZ25WZXJ0aWNhbFJldklubGluZUNhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID1cbiAgbmV3IE1hcCgpO1xuIl19