import { Directive, Inject, Injectable, } from '@angular/core';
import { BaseDirective2, LAYOUT_CONFIG, StyleBuilder, ɵmultiply as multiply, } from '@ngbracket/ngx-layout/core';
import { isFlowHorizontal } from '@ngbracket/ngx-layout/_private-utils';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@ngbracket/ngx-layout/core";
export class FlexOffsetStyleBuilder extends StyleBuilder {
    constructor(_config) {
        super();
        this._config = _config;
    }
    buildStyles(offset, parent) {
        offset ||= '0';
        offset = multiply(offset, this._config.multiplier);
        const isPercent = String(offset).indexOf('%') > -1;
        const isPx = String(offset).indexOf('px') > -1;
        if (!isPx && !isPercent && !isNaN(+offset)) {
            offset = `${offset}%`;
        }
        const horizontalLayoutKey = parent.isRtl ? 'margin-right' : 'margin-left';
        const styles = isFlowHorizontal(parent.layout)
            ? { [horizontalLayoutKey]: offset }
            : { 'margin-top': offset };
        return styles;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexOffsetStyleBuilder, deps: [{ token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexOffsetStyleBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexOffsetStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }] });
const inputs = [
    'fxFlexOffset',
    'fxFlexOffset.xs',
    'fxFlexOffset.sm',
    'fxFlexOffset.md',
    'fxFlexOffset.lg',
    'fxFlexOffset.xl',
    'fxFlexOffset.lt-sm',
    'fxFlexOffset.lt-md',
    'fxFlexOffset.lt-lg',
    'fxFlexOffset.lt-xl',
    'fxFlexOffset.gt-xs',
    'fxFlexOffset.gt-sm',
    'fxFlexOffset.gt-md',
    'fxFlexOffset.gt-lg',
];
const selector = `
  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],
  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],
  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],
  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
`;
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
export class FlexOffsetDirective extends BaseDirective2 {
    constructor(elRef, directionality, styleBuilder, marshal, styler) {
        super(elRef, styleBuilder, styler, marshal);
        this.directionality = directionality;
        this.DIRECTIVE_KEY = 'flex-offset';
        this.init([this.directionality.change]);
        // Parent DOM `layout-gap` with affect the nested child with `flex-offset`
        if (this.parentElement) {
            this.marshal
                .trackValue(this.parentElement, 'layout-gap')
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerUpdate.bind(this));
        }
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     * Using the current fxFlexOffset value, update the inline CSS
     * NOTE: this will assign `margin-left` if the parent flex-direction == 'row',
     *       otherwise `margin-top` is used for the offset.
     */
    updateWithValue(value = '') {
        // The flex-direction of this element's flex container. Defaults to 'row'.
        const layout = this.getFlexFlowDirection(this.parentElement, true);
        const isRtl = this.directionality.value === 'rtl';
        if (layout === 'row' && isRtl) {
            this.styleCache = flexOffsetCacheRowRtl;
        }
        else if (layout === 'row' && !isRtl) {
            this.styleCache = flexOffsetCacheRowLtr;
        }
        else if (layout === 'column' && isRtl) {
            this.styleCache = flexOffsetCacheColumnRtl;
        }
        else if (layout === 'column' && !isRtl) {
            this.styleCache = flexOffsetCacheColumnLtr;
        }
        this.addStyles(value + '', { layout, isRtl });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexOffsetDirective, deps: [{ token: i0.ElementRef }, { token: i1.Directionality }, { token: FlexOffsetStyleBuilder }, { token: i2.MediaMarshaller }, { token: i2.StyleUtils }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: FlexOffsetDirective, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexOffsetDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Directionality }, { type: FlexOffsetStyleBuilder }, { type: i2.MediaMarshaller }, { type: i2.StyleUtils }] });
export class DefaultFlexOffsetDirective extends FlexOffsetDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultFlexOffsetDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultFlexOffsetDirective, selector: "\n  [fxFlexOffset], [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md],\n  [fxFlexOffset.lg], [fxFlexOffset.xl], [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md],\n  [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl], [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm],\n  [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]\n", inputs: { fxFlexOffset: "fxFlexOffset", "fxFlexOffset.xs": "fxFlexOffset.xs", "fxFlexOffset.sm": "fxFlexOffset.sm", "fxFlexOffset.md": "fxFlexOffset.md", "fxFlexOffset.lg": "fxFlexOffset.lg", "fxFlexOffset.xl": "fxFlexOffset.xl", "fxFlexOffset.lt-sm": "fxFlexOffset.lt-sm", "fxFlexOffset.lt-md": "fxFlexOffset.lt-md", "fxFlexOffset.lt-lg": "fxFlexOffset.lt-lg", "fxFlexOffset.lt-xl": "fxFlexOffset.lt-xl", "fxFlexOffset.gt-xs": "fxFlexOffset.gt-xs", "fxFlexOffset.gt-sm": "fxFlexOffset.gt-sm", "fxFlexOffset.gt-md": "fxFlexOffset.gt-md", "fxFlexOffset.gt-lg": "fxFlexOffset.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultFlexOffsetDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
const flexOffsetCacheRowRtl = new Map();
const flexOffsetCacheColumnRtl = new Map();
const flexOffsetCacheRowLtr = new Map();
const flexOffsetCacheColumnLtr = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC1vZmZzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2ZsZXgvZmxleC1vZmZzZXQvZmxleC1vZmZzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxNQUFNLEVBQ04sVUFBVSxHQUVYLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxjQUFjLEVBRWQsYUFBYSxFQUViLFlBQVksRUFHWixTQUFTLElBQUksUUFBUSxHQUN0QixNQUFNLDRCQUE0QixDQUFDO0FBQ3BDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQVEzQyxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsWUFBWTtJQUN0RCxZQUEyQyxPQUE0QjtRQUNyRSxLQUFLLEVBQUUsQ0FBQztRQURpQyxZQUFPLEdBQVAsT0FBTyxDQUFxQjtJQUV2RSxDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQWMsRUFBRSxNQUF3QjtRQUNsRCxNQUFNLEtBQUssR0FBRyxDQUFDO1FBQ2YsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNuRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzFDLE1BQU0sR0FB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SSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQzs4R0E1Q1UsbUJBQW1CO2tHQUFuQixtQkFBbUI7OzJGQUFuQixtQkFBbUI7a0JBRC9CLFNBQVM7O0FBaURWLE1BQU0sT0FBTywwQkFBMkIsU0FBUSxtQkFBbUI7SUFEbkU7O1FBRXFCLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDcEM7OEdBRlksMEJBQTBCO2tHQUExQiwwQkFBMEI7OzJGQUExQiwwQkFBMEI7a0JBRHRDLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFOztBQUsvQixNQUFNLHFCQUFxQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RFLE1BQU0sd0JBQXdCLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDekUsTUFBTSxxQkFBcUIsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUN0RSxNQUFNLHdCQUF3QixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBPbkNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIExheW91dENvbmZpZ09wdGlvbnMsXG4gIExBWU9VVF9DT05GSUcsXG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG4gIFN0eWxlVXRpbHMsXG4gIMm1bXVsdGlwbHkgYXMgbXVsdGlwbHksXG59IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9jb3JlJztcbmltcG9ydCB7IGlzRmxvd0hvcml6b250YWwgfSBmcm9tICdAbmdicmFja2V0L25neC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZsZXhPZmZzZXRQYXJlbnQge1xuICBsYXlvdXQ6IHN0cmluZztcbiAgaXNSdGw6IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRmxleE9mZnNldFN0eWxlQnVpbGRlciBleHRlbmRzIFN0eWxlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTEFZT1VUX0NPTkZJRykgcHJpdmF0ZSBfY29uZmlnOiBMYXlvdXRDb25maWdPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGJ1aWxkU3R5bGVzKG9mZnNldDogc3RyaW5nLCBwYXJlbnQ6IEZsZXhPZmZzZXRQYXJlbnQpIHtcbiAgICBvZmZzZXQgfHw9ICcwJztcbiAgICBvZmZzZXQgPSBtdWx0aXBseShvZmZzZXQsIHRoaXMuX2NvbmZpZy5tdWx0aXBsaWVyKTtcbiAgICBjb25zdCBpc1BlcmNlbnQgPSBTdHJpbmcob2Zmc2V0KS5pbmRleE9mKCclJykgPiAtMTtcbiAgICBjb25zdCBpc1B4ID0gU3RyaW5nKG9mZnNldCkuaW5kZXhPZigncHgnKSA+IC0xO1xuICAgIGlmICghaXNQeCAmJiAhaXNQZXJjZW50ICYmICFpc05hTigrb2Zmc2V0KSkge1xuICAgICAgb2Zmc2V0ID0gYCR7b2Zmc2V0fSVgO1xuICAgIH1cbiAgICBjb25zdCBob3Jpem9udGFsTGF5b3V0S2V5ID0gcGFyZW50LmlzUnRsID8gJ21hcmdpbi1yaWdodCcgOiAnbWFyZ2luLWxlZnQnO1xuICAgIGNvbnN0IHN0eWxlczogU3R5bGVEZWZpbml0aW9uID0gaXNGbG93SG9yaXpvbnRhbChwYXJlbnQubGF5b3V0KVxuICAgICAgPyB7IFtob3Jpem9udGFsTGF5b3V0S2V5XTogb2Zmc2V0IH1cbiAgICAgIDogeyAnbWFyZ2luLXRvcCc6IG9mZnNldCB9O1xuXG4gICAgcmV0dXJuIHN0eWxlcztcbiAgfVxufVxuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdmeEZsZXhPZmZzZXQnLFxuICAnZnhGbGV4T2Zmc2V0LnhzJyxcbiAgJ2Z4RmxleE9mZnNldC5zbScsXG4gICdmeEZsZXhPZmZzZXQubWQnLFxuICAnZnhGbGV4T2Zmc2V0LmxnJyxcbiAgJ2Z4RmxleE9mZnNldC54bCcsXG4gICdmeEZsZXhPZmZzZXQubHQtc20nLFxuICAnZnhGbGV4T2Zmc2V0Lmx0LW1kJyxcbiAgJ2Z4RmxleE9mZnNldC5sdC1sZycsXG4gICdmeEZsZXhPZmZzZXQubHQteGwnLFxuICAnZnhGbGV4T2Zmc2V0Lmd0LXhzJyxcbiAgJ2Z4RmxleE9mZnNldC5ndC1zbScsXG4gICdmeEZsZXhPZmZzZXQuZ3QtbWQnLFxuICAnZnhGbGV4T2Zmc2V0Lmd0LWxnJyxcbl07XG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2Z4RmxleE9mZnNldF0sIFtmeEZsZXhPZmZzZXQueHNdLCBbZnhGbGV4T2Zmc2V0LnNtXSwgW2Z4RmxleE9mZnNldC5tZF0sXG4gIFtmeEZsZXhPZmZzZXQubGddLCBbZnhGbGV4T2Zmc2V0LnhsXSwgW2Z4RmxleE9mZnNldC5sdC1zbV0sIFtmeEZsZXhPZmZzZXQubHQtbWRdLFxuICBbZnhGbGV4T2Zmc2V0Lmx0LWxnXSwgW2Z4RmxleE9mZnNldC5sdC14bF0sIFtmeEZsZXhPZmZzZXQuZ3QteHNdLCBbZnhGbGV4T2Zmc2V0Lmd0LXNtXSxcbiAgW2Z4RmxleE9mZnNldC5ndC1tZF0sIFtmeEZsZXhPZmZzZXQuZ3QtbGddXG5gO1xuXG4vKipcbiAqICdmbGV4LW9mZnNldCcgZmxleGJveCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgJ21hcmdpbi1sZWZ0JyBvZiB0aGUgZWxlbWVudCBpbiBhIGxheW91dCBjb250YWluZXJcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgRmxleE9mZnNldERpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIERJUkVDVElWRV9LRVkgPSAnZmxleC1vZmZzZXQnO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsUmVmOiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgc3R5bGVCdWlsZGVyOiBGbGV4T2Zmc2V0U3R5bGVCdWlsZGVyLFxuICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcixcbiAgICBzdHlsZXI6IFN0eWxlVXRpbHNcbiAgKSB7XG4gICAgc3VwZXIoZWxSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVyLCBtYXJzaGFsKTtcbiAgICB0aGlzLmluaXQoW3RoaXMuZGlyZWN0aW9uYWxpdHkuY2hhbmdlXSk7XG4gICAgLy8gUGFyZW50IERPTSBgbGF5b3V0LWdhcGAgd2l0aCBhZmZlY3QgdGhlIG5lc3RlZCBjaGlsZCB3aXRoIGBmbGV4LW9mZnNldGBcbiAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLm1hcnNoYWxcbiAgICAgICAgLnRyYWNrVmFsdWUodGhpcy5wYXJlbnRFbGVtZW50LCAnbGF5b3V0LWdhcCcpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3lTdWJqZWN0KSlcbiAgICAgICAgLnN1YnNjcmliZSh0aGlzLnRyaWdnZXJVcGRhdGUuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiBVc2luZyB0aGUgY3VycmVudCBmeEZsZXhPZmZzZXQgdmFsdWUsIHVwZGF0ZSB0aGUgaW5saW5lIENTU1xuICAgKiBOT1RFOiB0aGlzIHdpbGwgYXNzaWduIGBtYXJnaW4tbGVmdGAgaWYgdGhlIHBhcmVudCBmbGV4LWRpcmVjdGlvbiA9PSAncm93JyxcbiAgICogICAgICAgb3RoZXJ3aXNlIGBtYXJnaW4tdG9wYCBpcyB1c2VkIGZvciB0aGUgb2Zmc2V0LlxuICAgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyID0gJycpOiB2b2lkIHtcbiAgICAvLyBUaGUgZmxleC1kaXJlY3Rpb24gb2YgdGhpcyBlbGVtZW50J3MgZmxleCBjb250YWluZXIuIERlZmF1bHRzIHRvICdyb3cnLlxuICAgIGNvbnN0IGxheW91dCA9IHRoaXMuZ2V0RmxleEZsb3dEaXJlY3Rpb24odGhpcy5wYXJlbnRFbGVtZW50ISwgdHJ1ZSk7XG4gICAgY29uc3QgaXNSdGwgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlID09PSAncnRsJztcbiAgICBpZiAobGF5b3V0ID09PSAncm93JyAmJiBpc1J0bCkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gZmxleE9mZnNldENhY2hlUm93UnRsO1xuICAgIH0gZWxzZSBpZiAobGF5b3V0ID09PSAncm93JyAmJiAhaXNSdGwpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhPZmZzZXRDYWNoZVJvd0x0cjtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbicgJiYgaXNSdGwpIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhPZmZzZXRDYWNoZUNvbHVtblJ0bDtcbiAgICB9IGVsc2UgaWYgKGxheW91dCA9PT0gJ2NvbHVtbicgJiYgIWlzUnRsKSB7XG4gICAgICB0aGlzLnN0eWxlQ2FjaGUgPSBmbGV4T2Zmc2V0Q2FjaGVDb2x1bW5MdHI7XG4gICAgfVxuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlICsgJycsIHsgbGF5b3V0LCBpc1J0bCB9KTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3IsIGlucHV0cyB9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRGbGV4T2Zmc2V0RGlyZWN0aXZlIGV4dGVuZHMgRmxleE9mZnNldERpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbnB1dHMgPSBpbnB1dHM7XG59XG5cbmNvbnN0IGZsZXhPZmZzZXRDYWNoZVJvd1J0bDogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGZsZXhPZmZzZXRDYWNoZUNvbHVtblJ0bDogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGZsZXhPZmZzZXRDYWNoZVJvd0x0cjogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbmNvbnN0IGZsZXhPZmZzZXRDYWNoZUNvbHVtbkx0cjogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbiJdfQ==