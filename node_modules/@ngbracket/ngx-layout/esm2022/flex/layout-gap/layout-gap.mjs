import { Directive, Inject, Injectable, } from '@angular/core';
import { LAYOUT_VALUES } from '@ngbracket/ngx-layout/_private-utils';
import { BaseDirective2, LAYOUT_CONFIG, StyleBuilder, ɵmultiply as multiply, } from '@ngbracket/ngx-layout/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@ngbracket/ngx-layout/core";
import * as i2 from "@angular/cdk/bidi";
const CLEAR_MARGIN_CSS = {
    'margin-left': null,
    'margin-right': null,
    'margin-top': null,
    'margin-bottom': null,
};
export class LayoutGapStyleBuilder extends StyleBuilder {
    constructor(_styler, _config) {
        super();
        this._styler = _styler;
        this._config = _config;
    }
    buildStyles(gapValue, parent) {
        if (gapValue.endsWith(GRID_SPECIFIER)) {
            gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
            gapValue = multiply(gapValue, this._config.multiplier);
            // Add the margin to the host element
            return buildGridMargin(gapValue, parent.directionality);
        }
        else {
            return {};
        }
    }
    sideEffect(gapValue, _styles, parent) {
        const items = parent.items;
        if (gapValue.endsWith(GRID_SPECIFIER)) {
            gapValue = gapValue.slice(0, gapValue.indexOf(GRID_SPECIFIER));
            gapValue = multiply(gapValue, this._config.multiplier);
            // For each `element` children, set the padding
            const paddingStyles = buildGridPadding(gapValue, parent.directionality);
            this._styler.applyStyleToElements(paddingStyles, parent.items);
        }
        else {
            gapValue = multiply(gapValue, this._config.multiplier);
            gapValue = this.addFallbackUnit(gapValue);
            const lastItem = items.pop();
            // For each `element` children EXCEPT the last,
            // set the margin right/bottom styles...
            const gapCss = buildGapCSS(gapValue, parent);
            this._styler.applyStyleToElements(gapCss, items);
            // Clear all gaps for all visible elements
            this._styler.applyStyleToElements(CLEAR_MARGIN_CSS, [lastItem]);
        }
    }
    addFallbackUnit(value) {
        return !isNaN(+value) ? `${value}${this._config.defaultUnit}` : value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutGapStyleBuilder, deps: [{ token: i1.StyleUtils }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutGapStyleBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutGapStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.StyleUtils }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }] });
const inputs = [
    'fxLayoutGap',
    'fxLayoutGap.xs',
    'fxLayoutGap.sm',
    'fxLayoutGap.md',
    'fxLayoutGap.lg',
    'fxLayoutGap.xl',
    'fxLayoutGap.lt-sm',
    'fxLayoutGap.lt-md',
    'fxLayoutGap.lt-lg',
    'fxLayoutGap.lt-xl',
    'fxLayoutGap.gt-xs',
    'fxLayoutGap.gt-sm',
    'fxLayoutGap.gt-md',
    'fxLayoutGap.gt-lg',
];
const selector = `
  [fxLayoutGap], [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md],
  [fxLayoutGap.lg], [fxLayoutGap.xl], [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md],
  [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl], [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm],
  [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]
`;
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
export class LayoutGapDirective extends BaseDirective2 {
    /** Special accessor to query for all child 'element' nodes regardless of type, class, etc */
    get childrenNodes() {
        const obj = this.nativeElement.children;
        const buffer = [];
        // iterate backwards ensuring that length is an UInt32
        for (let i = obj.length; i--;) {
            buffer[i] = obj[i];
        }
        return buffer;
    }
    constructor(elRef, zone, directionality, styleUtils, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.zone = zone;
        this.directionality = directionality;
        this.styleUtils = styleUtils;
        this.layout = 'row'; // default flex-direction
        this.DIRECTIVE_KEY = 'layout-gap';
        this.observerSubject = new Subject();
        const extraTriggers = [
            this.directionality.change,
            this.observerSubject.asObservable(),
        ];
        this.init(extraTriggers);
        this.marshal
            .trackValue(this.nativeElement, 'layout')
            .pipe(takeUntil(this.destroySubject))
            .subscribe(this.onLayoutChange.bind(this));
    }
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    ngAfterContentInit() {
        this.buildChildObservable();
        this.triggerUpdate();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        if (this.observer) {
            this.observer.disconnect();
        }
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Cache the parent container 'flex-direction' and update the 'margin' styles
     */
    onLayoutChange(matcher) {
        const layout = matcher.value;
        // Make sure to filter out 'wrap' option
        let newDirection = layout.split(' ')[0];
        if (!LAYOUT_VALUES.find((x) => x === newDirection)) {
            newDirection = 'row';
        }
        // Clear the previous style before we change the layout
        if (this.layout && this.layout !== newDirection) {
            this.clearStyles();
        }
        this.layout = newDirection;
        this.triggerUpdate();
    }
    /**
     *
     */
    updateWithValue(value) {
        // Gather all non-hidden Element nodes
        const items = this.childrenNodes
            .filter((el) => el.nodeType === 1 && this.willDisplay(el))
            .sort((a, b) => {
            const orderA = +this.styler.lookupStyle(a, 'order');
            const orderB = +this.styler.lookupStyle(b, 'order');
            if (isNaN(orderA) || isNaN(orderB) || orderA === orderB) {
                return 0;
            }
            else {
                return orderA > orderB ? 1 : -1;
            }
        });
        if (items.length > 0) {
            const directionality = this.directionality.value;
            const layout = this.layout;
            if (layout === 'row' && directionality === 'rtl') {
                this.styleCache = layoutGapCacheRowRtl;
            }
            else if (layout === 'row' && directionality !== 'rtl') {
                this.styleCache = layoutGapCacheRowLtr;
            }
            else if (layout === 'column' && directionality === 'rtl') {
                this.styleCache = layoutGapCacheColumnRtl;
            }
            else if (layout === 'column' && directionality !== 'rtl') {
                this.styleCache = layoutGapCacheColumnLtr;
            }
            this.addStyles(value, { directionality, items, layout });
        }
    }
    /** We need to override clearStyles because in most cases mru isn't populated */
    clearStyles() {
        const gridMode = Object.keys(this.mru).length > 0;
        const childrenStyle = gridMode
            ? 'padding'
            : getMarginType(this.directionality.value, this.layout);
        // If there are styles on the parent remove them
        if (gridMode) {
            super.clearStyles();
        }
        // Then remove the children styles too
        this.styleUtils.applyStyleToElements({ [childrenStyle]: '' }, this.childrenNodes);
    }
    /** Determine if an element will show or hide based on current activation */
    willDisplay(source) {
        const value = this.marshal.getValue(source, 'show-hide');
        return (value === true ||
            (value === undefined &&
                this.styleUtils.lookupStyle(source, 'display') !== 'none'));
    }
    buildChildObservable() {
        this.zone.runOutsideAngular(() => {
            if (typeof MutationObserver !== 'undefined') {
                this.observer = new MutationObserver((mutations) => {
                    const validatedChanges = (it) => {
                        return ((it.addedNodes && it.addedNodes.length > 0) ||
                            (it.removedNodes && it.removedNodes.length > 0));
                    };
                    // update gap styles only for child 'added' or 'removed' events
                    if (mutations.some(validatedChanges)) {
                        this.observerSubject.next();
                    }
                });
                this.observer.observe(this.nativeElement, { childList: true });
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutGapDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i2.Directionality }, { token: i1.StyleUtils }, { token: LayoutGapStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: LayoutGapDirective, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: LayoutGapDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i2.Directionality }, { type: i1.StyleUtils }, { type: LayoutGapStyleBuilder }, { type: i1.MediaMarshaller }] });
export class DefaultLayoutGapDirective extends LayoutGapDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultLayoutGapDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultLayoutGapDirective, selector: "\n  [fxLayoutGap], [fxLayoutGap.xs], [fxLayoutGap.sm], [fxLayoutGap.md],\n  [fxLayoutGap.lg], [fxLayoutGap.xl], [fxLayoutGap.lt-sm], [fxLayoutGap.lt-md],\n  [fxLayoutGap.lt-lg], [fxLayoutGap.lt-xl], [fxLayoutGap.gt-xs], [fxLayoutGap.gt-sm],\n  [fxLayoutGap.gt-md], [fxLayoutGap.gt-lg]\n", inputs: { fxLayoutGap: "fxLayoutGap", "fxLayoutGap.xs": "fxLayoutGap.xs", "fxLayoutGap.sm": "fxLayoutGap.sm", "fxLayoutGap.md": "fxLayoutGap.md", "fxLayoutGap.lg": "fxLayoutGap.lg", "fxLayoutGap.xl": "fxLayoutGap.xl", "fxLayoutGap.lt-sm": "fxLayoutGap.lt-sm", "fxLayoutGap.lt-md": "fxLayoutGap.lt-md", "fxLayoutGap.lt-lg": "fxLayoutGap.lt-lg", "fxLayoutGap.lt-xl": "fxLayoutGap.lt-xl", "fxLayoutGap.gt-xs": "fxLayoutGap.gt-xs", "fxLayoutGap.gt-sm": "fxLayoutGap.gt-sm", "fxLayoutGap.gt-md": "fxLayoutGap.gt-md", "fxLayoutGap.gt-lg": "fxLayoutGap.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultLayoutGapDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const layoutGapCacheRowRtl = new Map();
const layoutGapCacheColumnRtl = new Map();
const layoutGapCacheRowLtr = new Map();
const layoutGapCacheColumnLtr = new Map();
const GRID_SPECIFIER = ' grid';
function buildGridPadding(value, directionality) {
    const [between, below] = value.split(' ');
    const bottom = below ?? between;
    let paddingRight = '0px', paddingBottom = bottom, paddingLeft = '0px';
    if (directionality === 'rtl') {
        paddingLeft = between;
    }
    else {
        paddingRight = between;
    }
    return { padding: `0px ${paddingRight} ${paddingBottom} ${paddingLeft}` };
}
function buildGridMargin(value, directionality) {
    const [between, below] = value.split(' ');
    const bottom = below ?? between;
    const minus = (str) => `-${str}`;
    let marginRight = '0px', marginBottom = minus(bottom), marginLeft = '0px';
    if (directionality === 'rtl') {
        marginLeft = minus(between);
    }
    else {
        marginRight = minus(between);
    }
    return { margin: `0px ${marginRight} ${marginBottom} ${marginLeft}` };
}
function getMarginType(directionality, layout) {
    switch (layout) {
        case 'column':
            return 'margin-bottom';
        case 'column-reverse':
            return 'margin-top';
        case 'row':
            return directionality === 'rtl' ? 'margin-left' : 'margin-right';
        case 'row-reverse':
            return directionality === 'rtl' ? 'margin-right' : 'margin-left';
        default:
            return directionality === 'rtl' ? 'margin-left' : 'margin-right';
    }
}
function buildGapCSS(gapValue, parent) {
    const key = getMarginType(parent.directionality, parent.layout);
    const margins = { ...CLEAR_MARGIN_CSS };
    margins[key] = gapValue;
    return margins;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LWdhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZmxleC9sYXlvdXQtZ2FwL2xheW91dC1nYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxNQUFNLEVBQ04sVUFBVSxHQUdYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNyRSxPQUFPLEVBQ0wsY0FBYyxFQUVkLGFBQWEsRUFHYixZQUFZLEVBR1osU0FBUyxJQUFJLFFBQVEsR0FDdEIsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQVEzQyxNQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLGVBQWUsRUFBRSxJQUFJO0NBQ3RCLENBQUM7QUFHRixNQUFNLE9BQU8scUJBQXNCLFNBQVEsWUFBWTtJQUNyRCxZQUNVLE9BQW1CLEVBQ0ksT0FBNEI7UUFFM0QsS0FBSyxFQUFFLENBQUM7UUFIQSxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQ0ksWUFBTyxHQUFQLE9BQU8sQ0FBcUI7SUFHN0QsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFnQixFQUFFLE1BQXVCO1FBQ25ELElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNyQyxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQy9ELFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLElB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U0FBUyxhQUFhLENBQUMsY0FBc0IsRUFBRSxNQUFjO0lBQzNELFFBQVEsTUFBTSxFQUFFO1FBQ2QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxlQUFlLENBQUM7UUFDekIsS0FBSyxnQkFBZ0I7WUFDbkIsT0FBTyxZQUFZLENBQUM7UUFDdEIsS0FBSyxLQUFLO1lBQ1IsT0FBTyxjQUFjLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUNuRSxLQUFLLGFBQWE7WUFDaEIsT0FBTyxjQUFjLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUNuRTtZQUNFLE9BQU8sY0FBYyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUM7S0FDcEU7QUFDSCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQ2xCLFFBQWdCLEVBQ2hCLE1BQWtEO0lBRWxELE1BQU0sR0FBRyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoRSxNQUFNLE9BQU8sR0FBcUMsRUFBRSxHQUFHLGdCQUFnQixFQUFFLENBQUM7SUFDMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUN4QixPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBMQVlPVVRfVkFMVUVTIH0gZnJvbSAnQG5nYnJhY2tldC9uZ3gtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBFbGVtZW50TWF0Y2hlcixcbiAgTEFZT1VUX0NPTkZJRyxcbiAgTGF5b3V0Q29uZmlnT3B0aW9ucyxcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbiAgybVtdWx0aXBseSBhcyBtdWx0aXBseSxcbn0gZnJvbSAnQG5nYnJhY2tldC9uZ3gtbGF5b3V0L2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExheW91dEdhcFBhcmVudCB7XG4gIGRpcmVjdGlvbmFsaXR5OiBzdHJpbmc7XG4gIGl0ZW1zOiBIVE1MRWxlbWVudFtdO1xuICBsYXlvdXQ6IHN0cmluZztcbn1cblxuY29uc3QgQ0xFQVJfTUFSR0lOX0NTUyA9IHtcbiAgJ21hcmdpbi1sZWZ0JzogbnVsbCxcbiAgJ21hcmdpbi1yaWdodCc6IG51bGwsXG4gICdtYXJnaW4tdG9wJzogbnVsbCxcbiAgJ21hcmdpbi1ib3R0b20nOiBudWxsLFxufTtcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBMYXlvdXRHYXBTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9zdHlsZXI6IFN0eWxlVXRpbHMsXG4gICAgQEluamVjdChMQVlPVVRfQ09ORklHKSBwcml2YXRlIF9jb25maWc6IExheW91dENvbmZpZ09wdGlvbnNcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGJ1aWxkU3R5bGVzKGdhcFZhbHVlOiBzdHJpbmcsIHBhcmVudDogTGF5b3V0R2FwUGFyZW50KSB7XG4gICAgaWYgKGdhcFZhbHVlLmVuZHNXaXRoKEdSSURfU1BFQ0lGSUVSKSkge1xuICAgICAgZ2FwVmFsdWUgPSBnYXBWYWx1ZS5zbGljZSgwLCBnYXBWYWx1ZS5pbmRleE9mKEdSSURfU1BFQ0lGSUVSKSk7XG4gICAgICBnYXBWYWx1ZSA9IG11bHRpcGx5KGdhcFZhbHVlLCB0aGlzLl9jb25maWcubXVsdGlwbGllcik7XG5cbiAgICAgIC8vIEFkZCB0aGUgbWFyZ2luIHRvIHRoZSBob3N0IGVsZW1lbnRcbiAgICAgIHJldHVybiBidWlsZEdyaWRNYXJnaW4oZ2FwVmFsdWUsIHBhcmVudC5kaXJlY3Rpb25hbGl0eSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBzaWRlRWZmZWN0KFxuICAgIGdhcFZhbHVlOiBzdHJpbmcsXG4gICAgX3N0eWxlczogU3R5bGVEZWZpbml0aW9uLFxuICAgIHBhcmVudDogTGF5b3V0R2FwUGFyZW50XG4gICkge1xuICAgIGNvbnN0IGl0ZW1zID0gcGFyZW50Lml0ZW1zO1xuICAgIGlmIChnYXBWYWx1ZS5lbmRzV2l0aChHUklEX1NQRUNJRklFUikpIHtcbiAgICAgIGdhcFZhbHVlID0gZ2FwVmFsdWUuc2xpY2UoMCwgZ2FwVmFsdWUuaW5kZXhPZihHUklEX1NQRUNJRklFUikpO1xuICAgICAgZ2FwVmFsdWUgPSBtdWx0aXBseShnYXBWYWx1ZSwgdGhpcy5fY29uZmlnLm11bHRpcGxpZXIpO1xuICAgICAgLy8gRm9yIGVhY2ggYGVsZW1lbnRgIGNoaWxkcmVuLCBzZXQgdGhlIHBhZGRpbmdcbiAgICAgIGNvbnN0IHBhZGRpbmdTdHlsZXMgPSBidWlsZEdyaWRQYWRkaW5nKGdhcFZhbHVlLCBwYXJlbnQuZGlyZWN0aW9uYWxpdHkpO1xuICAgICAgdGhpcy5fc3R5bGVyLmFwcGx5U3R5bGVUb0VsZW1lbnRzKHBhZGRpbmdTdHlsZXMsIHBhcmVudC5pdGVtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdhcFZhbHVlID0gbXVsdGlwbHkoZ2FwVmFsdWUsIHRoaXMuX2NvbmZpZy5tdWx0aXBsaWVyKTtcbiAgICAgIGdhcFZhbHVlID0gdGhpcy5hZGRGYWxsYmFja1VuaXQoZ2FwVmFsdWUpO1xuXG4gICAgICBjb25zdCBsYXN0SXRlbSA9IGl0ZW1zLnBvcCgpITtcblxuICAgICAgLy8gRm9yIGVhY2ggYGVsZW1lbnRgIGNoaWxkcmVuIEVYQ0VQVCB0aGUgbGFzdCxcbiAgICAgIC8vIHNldCB0aGUgbWFyZ2luIHJpZ2h0L2JvdHRvbSBzdHlsZXMuLi5cbiAgICAgIGNvbnN0IGdhcENzcyA9IGJ1aWxkR2FwQ1NTKGdhcFZhbHVlLCBwYXJlbnQpO1xuICAgICAgdGhpcy5fc3R5bGVyLmFwcGx5U3R5bGVUb0VsZW1lbnRzKGdhcENzcywgaXRlbXMpO1xuXG4gICAgICAvLyBDbGVhciBhbGwgZ2FwcyBmb3IgYWxsIHZpc2libGUgZWxlbWVudHNcbiAgICAgIHRoaXMuX3N0eWxlci5hcHBseVN0eWxlVG9FbGVtZW50cyhDTEVBUl9NQVJHSU5fQ1NTLCBbbGFzdEl0ZW1dKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFkZEZhbGxiYWNrVW5pdCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuICFpc05hTigrdmFsdWUpID8gYCR7dmFsdWV9JHt0aGlzLl9jb25maWcuZGVmYXVsdFVuaXR9YCA6IHZhbHVlO1xuICB9XG59XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2Z4TGF5b3V0R2FwJyxcbiAgJ2Z4TGF5b3V0R2FwLnhzJyxcbiAgJ2Z4TGF5b3V0R2FwLnNtJyxcbiAgJ2Z4TGF5b3V0R2FwLm1kJyxcbiAgJ2Z4TGF5b3V0R2FwLmxnJyxcbiAgJ2Z4TGF5b3V0R2FwLnhsJyxcbiAgJ2Z4TGF5b3V0R2FwLmx0LXNtJyxcbiAgJ2Z4TGF5b3V0R2FwLmx0LW1kJyxcbiAgJ2Z4TGF5b3V0R2FwLmx0LWxnJyxcbiAgJ2Z4TGF5b3V0R2FwLmx0LXhsJyxcbiAgJ2Z4TGF5b3V0R2FwLmd0LXhzJyxcbiAgJ2Z4TGF5b3V0R2FwLmd0LXNtJyxcbiAgJ2Z4TGF5b3V0R2FwLmd0LW1kJyxcbiAgJ2Z4TGF5b3V0R2FwLmd0LWxnJyxcbl07XG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2Z4TGF5b3V0R2FwXSwgW2Z4TGF5b3V0R2FwLnhzXSwgW2Z4TGF5b3V0R2FwLnNtXSwgW2Z4TGF5b3V0R2FwLm1kXSxcbiAgW2Z4TGF5b3V0R2FwLmxnXSwgW2Z4TGF5b3V0R2FwLnhsXSwgW2Z4TGF5b3V0R2FwLmx0LXNtXSwgW2Z4TGF5b3V0R2FwLmx0LW1kXSxcbiAgW2Z4TGF5b3V0R2FwLmx0LWxnXSwgW2Z4TGF5b3V0R2FwLmx0LXhsXSwgW2Z4TGF5b3V0R2FwLmd0LXhzXSwgW2Z4TGF5b3V0R2FwLmd0LXNtXSxcbiAgW2Z4TGF5b3V0R2FwLmd0LW1kXSwgW2Z4TGF5b3V0R2FwLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnbGF5b3V0LXBhZGRpbmcnIHN0eWxpbmcgZGlyZWN0aXZlXG4gKiAgRGVmaW5lcyBwYWRkaW5nIG9mIGNoaWxkIGVsZW1lbnRzIGluIGEgbGF5b3V0IGNvbnRhaW5lclxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBMYXlvdXRHYXBEaXJlY3RpdmVcbiAgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMlxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveVxue1xuICBwcm90ZWN0ZWQgbGF5b3V0ID0gJ3Jvdyc7IC8vIGRlZmF1bHQgZmxleC1kaXJlY3Rpb25cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIERJUkVDVElWRV9LRVkgPSAnbGF5b3V0LWdhcCc7XG4gIHByb3RlY3RlZCBvYnNlcnZlclN1YmplY3QgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBTcGVjaWFsIGFjY2Vzc29yIHRvIHF1ZXJ5IGZvciBhbGwgY2hpbGQgJ2VsZW1lbnQnIG5vZGVzIHJlZ2FyZGxlc3Mgb2YgdHlwZSwgY2xhc3MsIGV0YyAqL1xuICBwcm90ZWN0ZWQgZ2V0IGNoaWxkcmVuTm9kZXMoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5uYXRpdmVFbGVtZW50LmNoaWxkcmVuO1xuICAgIGNvbnN0IGJ1ZmZlcjogYW55W10gPSBbXTtcblxuICAgIC8vIGl0ZXJhdGUgYmFja3dhcmRzIGVuc3VyaW5nIHRoYXQgbGVuZ3RoIGlzIGFuIFVJbnQzMlxuICAgIGZvciAobGV0IGkgPSBvYmoubGVuZ3RoOyBpLS07ICkge1xuICAgICAgYnVmZmVyW2ldID0gb2JqW2ldO1xuICAgIH1cbiAgICByZXR1cm4gYnVmZmVyO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIHpvbmU6IE5nWm9uZSxcbiAgICBwcm90ZWN0ZWQgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByb3RlY3RlZCBzdHlsZVV0aWxzOiBTdHlsZVV0aWxzLFxuICAgIHN0eWxlQnVpbGRlcjogTGF5b3V0R2FwU3R5bGVCdWlsZGVyLFxuICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlclxuICApIHtcbiAgICBzdXBlcihlbFJlZiwgc3R5bGVCdWlsZGVyLCBzdHlsZVV0aWxzLCBtYXJzaGFsKTtcbiAgICBjb25zdCBleHRyYVRyaWdnZXJzID0gW1xuICAgICAgdGhpcy5kaXJlY3Rpb25hbGl0eS5jaGFuZ2UsXG4gICAgICB0aGlzLm9ic2VydmVyU3ViamVjdC5hc09ic2VydmFibGUoKSxcbiAgICBdO1xuICAgIHRoaXMuaW5pdChleHRyYVRyaWdnZXJzKTtcbiAgICB0aGlzLm1hcnNoYWxcbiAgICAgIC50cmFja1ZhbHVlKHRoaXMubmF0aXZlRWxlbWVudCwgJ2xheW91dCcpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95U3ViamVjdCkpXG4gICAgICAuc3Vic2NyaWJlKHRoaXMub25MYXlvdXRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gTGlmZWN5Y2xlIE1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuYnVpbGRDaGlsZE9ic2VydmFibGUoKTtcbiAgICB0aGlzLnRyaWdnZXJVcGRhdGUoKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgaWYgKHRoaXMub2JzZXJ2ZXIpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBQcm90ZWN0ZWQgbWV0aG9kc1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuICAvKipcbiAgICogQ2FjaGUgdGhlIHBhcmVudCBjb250YWluZXIgJ2ZsZXgtZGlyZWN0aW9uJyBhbmQgdXBkYXRlIHRoZSAnbWFyZ2luJyBzdHlsZXNcbiAgICovXG4gIHByb3RlY3RlZCBvbkxheW91dENoYW5nZShtYXRjaGVyOiBFbGVtZW50TWF0Y2hlcikge1xuICAgIGNvbnN0IGxheW91dDogc3RyaW5nID0gbWF0Y2hlci52YWx1ZTtcblxuICAgIC8vIE1ha2Ugc3VyZSB0byBmaWx0ZXIgb3V0ICd3cmFwJyBvcHRpb25cbiAgICBsZXQgbmV3RGlyZWN0aW9uID0gbGF5b3V0LnNwbGl0KCcgJylbMF07XG5cbiAgICBpZiAoIUxBWU9VVF9WQUxVRVMuZmluZCgoeCkgPT4geCA9PT0gbmV3RGlyZWN0aW9uKSkge1xuICAgICAgbmV3RGlyZWN0aW9uID0gJ3Jvdyc7XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgdGhlIHByZXZpb3VzIHN0eWxlIGJlZm9yZSB3ZSBjaGFuZ2UgdGhlIGxheW91dFxuICAgIGlmICh0aGlzLmxheW91dCAmJiB0aGlzLmxheW91dCAhPT0gbmV3RGlyZWN0aW9uKSB7XG4gICAgICB0aGlzLmNsZWFyU3R5bGVzKCk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXlvdXQgPSBuZXdEaXJlY3Rpb247XG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSB1cGRhdGVXaXRoVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIC8vIEdhdGhlciBhbGwgbm9uLWhpZGRlbiBFbGVtZW50IG5vZGVzXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLmNoaWxkcmVuTm9kZXNcbiAgICAgIC5maWx0ZXIoKGVsKSA9PiBlbC5ub2RlVHlwZSA9PT0gMSAmJiB0aGlzLndpbGxEaXNwbGF5KGVsKSlcbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IG9yZGVyQSA9ICt0aGlzLnN0eWxlci5sb29rdXBTdHlsZShhLCAnb3JkZXInKTtcbiAgICAgICAgY29uc3Qgb3JkZXJCID0gK3RoaXMuc3R5bGVyLmxvb2t1cFN0eWxlKGIsICdvcmRlcicpO1xuICAgICAgICBpZiAoaXNOYU4ob3JkZXJBKSB8fCBpc05hTihvcmRlckIpIHx8IG9yZGVyQSA9PT0gb3JkZXJCKSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9yZGVyQSA+IG9yZGVyQiA/IDEgOiAtMTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICBpZiAoaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZGlyZWN0aW9uYWxpdHkgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICAgICAgY29uc3QgbGF5b3V0ID0gdGhpcy5sYXlvdXQ7XG4gICAgICBpZiAobGF5b3V0ID09PSAncm93JyAmJiBkaXJlY3Rpb25hbGl0eSA9PT0gJ3J0bCcpIHtcbiAgICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0R2FwQ2FjaGVSb3dSdGw7XG4gICAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ3JvdycgJiYgZGlyZWN0aW9uYWxpdHkgIT09ICdydGwnKSB7XG4gICAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGxheW91dEdhcENhY2hlUm93THRyO1xuICAgICAgfSBlbHNlIGlmIChsYXlvdXQgPT09ICdjb2x1bW4nICYmIGRpcmVjdGlvbmFsaXR5ID09PSAncnRsJykge1xuICAgICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBsYXlvdXRHYXBDYWNoZUNvbHVtblJ0bDtcbiAgICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAnY29sdW1uJyAmJiBkaXJlY3Rpb25hbGl0eSAhPT0gJ3J0bCcpIHtcbiAgICAgICAgdGhpcy5zdHlsZUNhY2hlID0gbGF5b3V0R2FwQ2FjaGVDb2x1bW5MdHI7XG4gICAgICB9XG4gICAgICB0aGlzLmFkZFN0eWxlcyh2YWx1ZSwgeyBkaXJlY3Rpb25hbGl0eSwgaXRlbXMsIGxheW91dCB9KTtcbiAgICB9XG4gIH1cblxuICAvKiogV2UgbmVlZCB0byBvdmVycmlkZSBjbGVhclN0eWxlcyBiZWNhdXNlIGluIG1vc3QgY2FzZXMgbXJ1IGlzbid0IHBvcHVsYXRlZCAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgY2xlYXJTdHlsZXMoKSB7XG4gICAgY29uc3QgZ3JpZE1vZGUgPSBPYmplY3Qua2V5cyh0aGlzLm1ydSkubGVuZ3RoID4gMDtcbiAgICBjb25zdCBjaGlsZHJlblN0eWxlID0gZ3JpZE1vZGVcbiAgICAgID8gJ3BhZGRpbmcnXG4gICAgICA6IGdldE1hcmdpblR5cGUodGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZSwgdGhpcy5sYXlvdXQpO1xuXG4gICAgLy8gSWYgdGhlcmUgYXJlIHN0eWxlcyBvbiB0aGUgcGFyZW50IHJlbW92ZSB0aGVtXG4gICAgaWYgKGdyaWRNb2RlKSB7XG4gICAgICBzdXBlci5jbGVhclN0eWxlcygpO1xuICAgIH1cblxuICAgIC8vIFRoZW4gcmVtb3ZlIHRoZSBjaGlsZHJlbiBzdHlsZXMgdG9vXG4gICAgdGhpcy5zdHlsZVV0aWxzLmFwcGx5U3R5bGVUb0VsZW1lbnRzKFxuICAgICAgeyBbY2hpbGRyZW5TdHlsZV06ICcnIH0sXG4gICAgICB0aGlzLmNoaWxkcmVuTm9kZXNcbiAgICApO1xuICB9XG5cbiAgLyoqIERldGVybWluZSBpZiBhbiBlbGVtZW50IHdpbGwgc2hvdyBvciBoaWRlIGJhc2VkIG9uIGN1cnJlbnQgYWN0aXZhdGlvbiAqL1xuICBwcm90ZWN0ZWQgd2lsbERpc3BsYXkoc291cmNlOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5tYXJzaGFsLmdldFZhbHVlKHNvdXJjZSwgJ3Nob3ctaGlkZScpO1xuICAgIHJldHVybiAoXG4gICAgICB2YWx1ZSA9PT0gdHJ1ZSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgdGhpcy5zdHlsZVV0aWxzLmxvb2t1cFN0eWxlKHNvdXJjZSwgJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYnVpbGRDaGlsZE9ic2VydmFibGUoKTogdm9pZCB7XG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgTXV0YXRpb25PYnNlcnZlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnM6IE11dGF0aW9uUmVjb3JkW10pID0+IHtcbiAgICAgICAgICBjb25zdCB2YWxpZGF0ZWRDaGFuZ2VzID0gKGl0OiBNdXRhdGlvblJlY29yZCk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgKGl0LmFkZGVkTm9kZXMgJiYgaXQuYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB8fFxuICAgICAgICAgICAgICAoaXQucmVtb3ZlZE5vZGVzICYmIGl0LnJlbW92ZWROb2Rlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gdXBkYXRlIGdhcCBzdHlsZXMgb25seSBmb3IgY2hpbGQgJ2FkZGVkJyBvciAncmVtb3ZlZCcgZXZlbnRzXG4gICAgICAgICAgaWYgKG11dGF0aW9ucy5zb21lKHZhbGlkYXRlZENoYW5nZXMpKSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyU3ViamVjdC5uZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMubmF0aXZlRWxlbWVudCwgeyBjaGlsZExpc3Q6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb2JzZXJ2ZXI/OiBNdXRhdGlvbk9ic2VydmVyO1xufVxuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3IsIGlucHV0cyB9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRMYXlvdXRHYXBEaXJlY3RpdmUgZXh0ZW5kcyBMYXlvdXRHYXBEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5wdXRzID0gaW5wdXRzO1xufVxuXG5jb25zdCBsYXlvdXRHYXBDYWNoZVJvd1J0bDogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGxheW91dEdhcENhY2hlQ29sdW1uUnRsOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgbGF5b3V0R2FwQ2FjaGVSb3dMdHI6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBsYXlvdXRHYXBDYWNoZUNvbHVtbkx0cjogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcblxuY29uc3QgR1JJRF9TUEVDSUZJRVIgPSAnIGdyaWQnO1xuXG5mdW5jdGlvbiBidWlsZEdyaWRQYWRkaW5nKFxuICB2YWx1ZTogc3RyaW5nLFxuICBkaXJlY3Rpb25hbGl0eTogc3RyaW5nXG4pOiBTdHlsZURlZmluaXRpb24ge1xuICBjb25zdCBbYmV0d2VlbiwgYmVsb3ddID0gdmFsdWUuc3BsaXQoJyAnKTtcbiAgY29uc3QgYm90dG9tID0gYmVsb3cgPz8gYmV0d2VlbjtcbiAgbGV0IHBhZGRpbmdSaWdodCA9ICcwcHgnLFxuICAgIHBhZGRpbmdCb3R0b20gPSBib3R0b20sXG4gICAgcGFkZGluZ0xlZnQgPSAnMHB4JztcblxuICBpZiAoZGlyZWN0aW9uYWxpdHkgPT09ICdydGwnKSB7XG4gICAgcGFkZGluZ0xlZnQgPSBiZXR3ZWVuO1xuICB9IGVsc2Uge1xuICAgIHBhZGRpbmdSaWdodCA9IGJldHdlZW47XG4gIH1cblxuICByZXR1cm4geyBwYWRkaW5nOiBgMHB4ICR7cGFkZGluZ1JpZ2h0fSAke3BhZGRpbmdCb3R0b219ICR7cGFkZGluZ0xlZnR9YCB9O1xufVxuXG5mdW5jdGlvbiBidWlsZEdyaWRNYXJnaW4oXG4gIHZhbHVlOiBzdHJpbmcsXG4gIGRpcmVjdGlvbmFsaXR5OiBzdHJpbmdcbik6IFN0eWxlRGVmaW5pdGlvbiB7XG4gIGNvbnN0IFtiZXR3ZWVuLCBiZWxvd10gPSB2YWx1ZS5zcGxpdCgnICcpO1xuICBjb25zdCBib3R0b20gPSBiZWxvdyA/PyBiZXR3ZWVuO1xuICBjb25zdCBtaW51cyA9IChzdHI6IHN0cmluZykgPT4gYC0ke3N0cn1gO1xuICBsZXQgbWFyZ2luUmlnaHQgPSAnMHB4JyxcbiAgICBtYXJnaW5Cb3R0b20gPSBtaW51cyhib3R0b20pLFxuICAgIG1hcmdpbkxlZnQgPSAnMHB4JztcblxuICBpZiAoZGlyZWN0aW9uYWxpdHkgPT09ICdydGwnKSB7XG4gICAgbWFyZ2luTGVmdCA9IG1pbnVzKGJldHdlZW4pO1xuICB9IGVsc2Uge1xuICAgIG1hcmdpblJpZ2h0ID0gbWludXMoYmV0d2Vlbik7XG4gIH1cblxuICByZXR1cm4geyBtYXJnaW46IGAwcHggJHttYXJnaW5SaWdodH0gJHttYXJnaW5Cb3R0b219ICR7bWFyZ2luTGVmdH1gIH07XG59XG5cbmZ1bmN0aW9uIGdldE1hcmdpblR5cGUoZGlyZWN0aW9uYWxpdHk6IHN0cmluZywgbGF5b3V0OiBzdHJpbmcpIHtcbiAgc3dpdGNoIChsYXlvdXQpIHtcbiAgICBjYXNlICdjb2x1bW4nOlxuICAgICAgcmV0dXJuICdtYXJnaW4tYm90dG9tJztcbiAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6XG4gICAgICByZXR1cm4gJ21hcmdpbi10b3AnO1xuICAgIGNhc2UgJ3Jvdyc6XG4gICAgICByZXR1cm4gZGlyZWN0aW9uYWxpdHkgPT09ICdydGwnID8gJ21hcmdpbi1sZWZ0JyA6ICdtYXJnaW4tcmlnaHQnO1xuICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzpcbiAgICAgIHJldHVybiBkaXJlY3Rpb25hbGl0eSA9PT0gJ3J0bCcgPyAnbWFyZ2luLXJpZ2h0JyA6ICdtYXJnaW4tbGVmdCc7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBkaXJlY3Rpb25hbGl0eSA9PT0gJ3J0bCcgPyAnbWFyZ2luLWxlZnQnIDogJ21hcmdpbi1yaWdodCc7XG4gIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRHYXBDU1MoXG4gIGdhcFZhbHVlOiBzdHJpbmcsXG4gIHBhcmVudDogeyBkaXJlY3Rpb25hbGl0eTogc3RyaW5nOyBsYXlvdXQ6IHN0cmluZyB9XG4pOiBTdHlsZURlZmluaXRpb24ge1xuICBjb25zdCBrZXkgPSBnZXRNYXJnaW5UeXBlKHBhcmVudC5kaXJlY3Rpb25hbGl0eSwgcGFyZW50LmxheW91dCk7XG4gIGNvbnN0IG1hcmdpbnM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgbnVsbCB9ID0geyAuLi5DTEVBUl9NQVJHSU5fQ1NTIH07XG4gIG1hcmdpbnNba2V5XSA9IGdhcFZhbHVlO1xuICByZXR1cm4gbWFyZ2lucztcbn1cbiJdfQ==