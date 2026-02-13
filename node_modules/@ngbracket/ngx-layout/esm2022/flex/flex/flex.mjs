/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, Injectable, Input, } from '@angular/core';
import { BaseDirective2, LAYOUT_CONFIG, StyleBuilder, validateBasis, } from '@ngbracket/ngx-layout/core';
import { takeUntil } from 'rxjs/operators';
import { extendObject, isFlowHorizontal, } from '@ngbracket/ngx-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "@ngbracket/ngx-layout/core";
export class FlexStyleBuilder extends StyleBuilder {
    constructor(layoutConfig) {
        super();
        this.layoutConfig = layoutConfig;
    }
    buildStyles(input, parent) {
        let [grow, shrink, ...basisParts] = input.split(' ');
        let basis = basisParts.join(' ');
        // The flex-direction of this element's flex container. Defaults to 'row'.
        const direction = parent.direction.indexOf('column') > -1 ? 'column' : 'row';
        const max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
        const min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';
        const hasCalc = String(basis).indexOf('calc') > -1;
        const usingCalc = hasCalc || basis === 'auto';
        const isPercent = String(basis).indexOf('%') > -1 && !hasCalc;
        const hasUnits = String(basis).indexOf('px') > -1 ||
            String(basis).indexOf('rem') > -1 ||
            String(basis).indexOf('em') > -1 ||
            String(basis).indexOf('vw') > -1 ||
            String(basis).indexOf('vh') > -1;
        let isValue = hasCalc || hasUnits;
        grow = grow == '0' ? 0 : grow;
        shrink = shrink == '0' ? 0 : shrink;
        // make box inflexible when shrink and grow are both zero
        // should not set a min when the grow is zero
        // should not set a max when the shrink is zero
        const isFixed = !grow && !shrink;
        let css = {};
        // flex-basis allows you to specify the initial/starting main-axis size of the element,
        // before anything else is computed. It can either be a percentage or an absolute value.
        // It is, however, not the breaking point for flex-grow/shrink properties
        //
        // flex-grow can be seen as this:
        //   0: Do not stretch. Either size to element's content width, or obey 'flex-basis'.
        //   1: (Default value). Stretch; will be the same size to all other flex items on
        //       the same row since they have a default value of 1.
        //   ≥2 (integer n): Stretch. Will be n times the size of other elements
        //      with 'flex-grow: 1' on the same row.
        // Use `null` to clear existing styles.
        const clearStyles = {
            'max-width': null,
            'max-height': null,
            'min-width': null,
            'min-height': null,
        };
        switch (basis || '') {
            case '':
                const useColumnBasisZero = this.layoutConfig.useColumnBasisZero !== false;
                basis =
                    direction === 'row'
                        ? '0%'
                        : useColumnBasisZero
                            ? '0.000000001px'
                            : 'auto';
                break;
            case 'initial': // default
            case 'nogrow':
                grow = 0;
                basis = 'auto';
                break;
            case 'grow':
                basis = '100%';
                break;
            case 'noshrink':
                shrink = 0;
                basis = 'auto';
                break;
            case 'auto':
                break;
            case 'none':
                grow = 0;
                shrink = 0;
                basis = 'auto';
                break;
            default:
                // Defaults to percentage sizing unless `px` is explicitly set
                if (!isValue && !isPercent && !isNaN(basis)) {
                    basis = basis + '%';
                }
                // Fix for issue 280
                if (basis === '0%') {
                    isValue = true;
                }
                if (basis === '0px') {
                    basis = '0%';
                }
                // fix issue #5345
                if (hasCalc) {
                    css = extendObject(clearStyles, {
                        'flex-grow': grow,
                        'flex-shrink': shrink,
                        'flex-basis': isValue ? basis : '100%',
                    });
                }
                else {
                    css = extendObject(clearStyles, {
                        flex: `${grow} ${shrink} ${isValue ? basis : '100%'}`,
                    });
                }
                break;
        }
        if (!(css['flex'] || css['flex-grow'])) {
            if (hasCalc) {
                css = extendObject(clearStyles, {
                    'flex-grow': grow,
                    'flex-shrink': shrink,
                    'flex-basis': basis,
                });
            }
            else {
                css = extendObject(clearStyles, {
                    flex: `${grow} ${shrink} ${basis}`,
                });
            }
        }
        // Fix for issues 277, 534, and 728
        if (basis !== '0%' &&
            basis !== '0px' &&
            basis !== '0.000000001px' &&
            basis !== 'auto') {
            css[min] = isFixed || (isValue && grow) ? basis : null;
            css[max] = isFixed || (!usingCalc && shrink) ? basis : null;
        }
        // Fix for issue 528
        if (!css[min] && !css[max]) {
            if (hasCalc) {
                css = extendObject(clearStyles, {
                    'flex-grow': grow,
                    'flex-shrink': shrink,
                    'flex-basis': basis,
                });
            }
            else {
                css = extendObject(clearStyles, {
                    flex: `${grow} ${shrink} ${basis}`,
                });
            }
        }
        else {
            // Fix for issue 660
            if (parent.hasWrap) {
                css[hasCalc ? 'flex-basis' : 'flex'] = css[max]
                    ? hasCalc
                        ? css[max]
                        : `${grow} ${shrink} ${css[max]}`
                    : hasCalc
                        ? css[min]
                        : `${grow} ${shrink} ${css[min]}`;
            }
        }
        return extendObject(css, { 'box-sizing': 'border-box' });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexStyleBuilder, deps: [{ token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexStyleBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }] });
const inputs = [
    'fxFlex',
    'fxFlex.xs',
    'fxFlex.sm',
    'fxFlex.md',
    'fxFlex.lg',
    'fxFlex.xl',
    'fxFlex.lt-sm',
    'fxFlex.lt-md',
    'fxFlex.lt-lg',
    'fxFlex.lt-xl',
    'fxFlex.gt-xs',
    'fxFlex.gt-sm',
    'fxFlex.gt-md',
    'fxFlex.gt-lg',
];
const selector = `
  [fxFlex], [fxFlex.xs], [fxFlex.sm], [fxFlex.md],
  [fxFlex.lg], [fxFlex.xl], [fxFlex.lt-sm], [fxFlex.lt-md],
  [fxFlex.lt-lg], [fxFlex.lt-xl], [fxFlex.gt-xs], [fxFlex.gt-sm],
  [fxFlex.gt-md], [fxFlex.gt-lg]
`;
/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
export class FlexDirective extends BaseDirective2 {
    get shrink() {
        return this.flexShrink;
    }
    set shrink(value) {
        this.flexShrink = value || '1';
        this.triggerReflow();
    }
    get grow() {
        return this.flexGrow;
    }
    set grow(value) {
        this.flexGrow = value || '1';
        this.triggerReflow();
    }
    constructor(elRef, styleUtils, layoutConfig, styleBuilder, marshal) {
        super(elRef, styleBuilder, styleUtils, marshal);
        this.layoutConfig = layoutConfig;
        this.marshal = marshal;
        this.DIRECTIVE_KEY = 'flex';
        this.direction = undefined;
        this.wrap = undefined;
        this.flexGrow = '1';
        this.flexShrink = '1';
        this.init();
    }
    ngOnInit() {
        if (this.parentElement) {
            this.marshal
                .trackValue(this.parentElement, 'layout')
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.onLayoutChange.bind(this));
            this.marshal
                .trackValue(this.nativeElement, 'layout-align')
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerReflow.bind(this));
        }
    }
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     */
    onLayoutChange(matcher) {
        const layout = matcher.value;
        const layoutParts = layout.split(' ');
        this.direction = layoutParts[0];
        this.wrap = layoutParts[1] !== undefined && layoutParts[1] === 'wrap';
        this.triggerUpdate();
    }
    /** Input to this is exclusively the basis input value */
    updateWithValue(value) {
        const addFlexToParent = this.layoutConfig.addFlexToParent !== false;
        if (this.direction === undefined) {
            this.direction = this.getFlexFlowDirection(this.parentElement, addFlexToParent);
        }
        if (this.wrap === undefined) {
            this.wrap = this.hasWrap(this.parentElement);
        }
        const direction = this.direction;
        const isHorizontal = direction.startsWith('row');
        const hasWrap = this.wrap;
        if (isHorizontal && hasWrap) {
            this.styleCache = flexRowWrapCache;
        }
        else if (isHorizontal && !hasWrap) {
            this.styleCache = flexRowCache;
        }
        else if (!isHorizontal && hasWrap) {
            this.styleCache = flexColumnWrapCache;
        }
        else if (!isHorizontal && !hasWrap) {
            this.styleCache = flexColumnCache;
        }
        const basis = String(value).replace(';', '');
        const parts = validateBasis(basis, this.flexGrow, this.flexShrink);
        this.addStyles(parts.join(' '), { direction, hasWrap });
    }
    /** Trigger a style reflow, usually based on a shrink/grow input event */
    triggerReflow() {
        const activatedValue = this.activatedValue;
        if (activatedValue !== undefined) {
            const parts = validateBasis(activatedValue + '', this.flexGrow, this.flexShrink);
            this.marshal.updateElement(this.nativeElement, this.DIRECTIVE_KEY, parts.join(' '));
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: LAYOUT_CONFIG }, { token: FlexStyleBuilder }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: FlexDirective, inputs: { shrink: ["fxShrink", "shrink"], grow: ["fxGrow", "grow"] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }, { type: FlexStyleBuilder }, { type: i1.MediaMarshaller }], propDecorators: { shrink: [{
                type: Input,
                args: ['fxShrink']
            }], grow: [{
                type: Input,
                args: ['fxGrow']
            }] } });
export class DefaultFlexDirective extends FlexDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultFlexDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultFlexDirective, selector: "\n  [fxFlex], [fxFlex.xs], [fxFlex.sm], [fxFlex.md],\n  [fxFlex.lg], [fxFlex.xl], [fxFlex.lt-sm], [fxFlex.lt-md],\n  [fxFlex.lt-lg], [fxFlex.lt-xl], [fxFlex.gt-xs], [fxFlex.gt-sm],\n  [fxFlex.gt-md], [fxFlex.gt-lg]\n", inputs: { fxFlex: "fxFlex", "fxFlex.xs": "fxFlex.xs", "fxFlex.sm": "fxFlex.sm", "fxFlex.md": "fxFlex.md", "fxFlex.lg": "fxFlex.lg", "fxFlex.xl": "fxFlex.xl", "fxFlex.lt-sm": "fxFlex.lt-sm", "fxFlex.lt-md": "fxFlex.lt-md", "fxFlex.lt-lg": "fxFlex.lt-lg", "fxFlex.lt-xl": "fxFlex.lt-xl", "fxFlex.gt-xs": "fxFlex.gt-xs", "fxFlex.gt-sm": "fxFlex.gt-sm", "fxFlex.gt-md": "fxFlex.gt-md", "fxFlex.gt-lg": "fxFlex.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultFlexDirective, decorators: [{
            type: Directive,
            args: [{ inputs, selector }]
        }] });
const flexRowCache = new Map();
const flexColumnCache = new Map();
const flexRowWrapCache = new Map();
const flexColumnWrapCache = new Map();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZmxleC9mbGV4L2ZsZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUNMLFNBQVMsRUFFVCxNQUFNLEVBQ04sVUFBVSxFQUNWLEtBQUssR0FFTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsY0FBYyxFQUdkLGFBQWEsRUFFYixZQUFZLEVBR1osYUFBYSxHQUNkLE1BQU0sNEJBQTRCLENBQUM7QUFDcEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFDTCxZQUFZLEVBQ1osZ0JBQWdCLEdBQ2pCLE1BQU0sc0NBQXNDLENBQUM7OztBQVE5QyxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsWUFBWTtJQUNoRCxZQUNtQyxZQUFpQztRQUVsRSxLQUFLLEVBQUUsQ0FBQztRQUZ5QixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7SUFHcEUsQ0FBQztJQUNELFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBeUI7UUFDbEQsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsR0FBd0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxRSxJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpDLDBFQUEwRTtRQUMxRSxNQUFNLFNBQVMsR0FDYixNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFFN0QsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFD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SyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FDaEIsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs4R0ExR1UsYUFBYSxzRUE2QmQsYUFBYTtrR0E3QlosYUFBYTs7MkZBQWIsYUFBYTtrQkFEekIsU0FBUzs7MEJBOEJMLE1BQU07MkJBQUMsYUFBYTttR0F2Qm5CLE1BQU07c0JBRFQsS0FBSzt1QkFBQyxVQUFVO2dCQVViLElBQUk7c0JBRFAsS0FBSzt1QkFBQyxRQUFROztBQWdHakIsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGFBQWE7SUFEdkQ7O1FBRXFCLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDcEM7OEdBRlksb0JBQW9CO2tHQUFwQixvQkFBb0I7OzJGQUFwQixvQkFBb0I7a0JBRGhDLFNBQVM7bUJBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFOztBQUsvQixNQUFNLFlBQVksR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM3RCxNQUFNLGVBQWUsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoRSxNQUFNLGdCQUFnQixHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2pFLE1BQU0sbUJBQW1CLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbnB1dCxcbiAgT25Jbml0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBFbGVtZW50TWF0Y2hlcixcbiAgTGF5b3V0Q29uZmlnT3B0aW9ucyxcbiAgTEFZT1VUX0NPTkZJRyxcbiAgTWVkaWFNYXJzaGFsbGVyLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlRGVmaW5pdGlvbixcbiAgU3R5bGVVdGlscyxcbiAgdmFsaWRhdGVCYXNpcyxcbn0gZnJvbSAnQG5nYnJhY2tldC9uZ3gtbGF5b3V0L2NvcmUnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1xuICBleHRlbmRPYmplY3QsXG4gIGlzRmxvd0hvcml6b250YWwsXG59IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9fcHJpdmF0ZS11dGlscyc7XG5cbmludGVyZmFjZSBGbGV4QnVpbGRlclBhcmVudCB7XG4gIGRpcmVjdGlvbjogc3RyaW5nO1xuICBoYXNXcmFwOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEZsZXhTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KExBWU9VVF9DT05GSUcpIHByb3RlY3RlZCBsYXlvdXRDb25maWc6IExheW91dENvbmZpZ09wdGlvbnNcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICBidWlsZFN0eWxlcyhpbnB1dDogc3RyaW5nLCBwYXJlbnQ6IEZsZXhCdWlsZGVyUGFyZW50KSB7XG4gICAgbGV0IFtncm93LCBzaHJpbmssIC4uLmJhc2lzUGFydHNdOiAoc3RyaW5nIHwgbnVtYmVyKVtdID0gaW5wdXQuc3BsaXQoJyAnKTtcbiAgICBsZXQgYmFzaXMgPSBiYXNpc1BhcnRzLmpvaW4oJyAnKTtcblxuICAgIC8vIFRoZSBmbGV4LWRpcmVjdGlvbiBvZiB0aGlzIGVsZW1lbnQncyBmbGV4IGNvbnRhaW5lci4gRGVmYXVsdHMgdG8gJ3JvdycuXG4gICAgY29uc3QgZGlyZWN0aW9uID1cbiAgICAgIHBhcmVudC5kaXJlY3Rpb24uaW5kZXhPZignY29sdW1uJykgPiAtMSA/ICdjb2x1bW4nIDogJ3Jvdyc7XG5cbiAgICBjb25zdCBtYXggPSBpc0Zsb3dIb3Jpem9udGFsKGRpcmVjdGlvbikgPyAnbWF4LXdpZHRoJyA6ICdtYXgtaGVpZ2h0JztcbiAgICBjb25zdCBtaW4gPSBpc0Zsb3dIb3Jpem9udGFsKGRpcmVjdGlvbikgPyAnbWluLXdpZHRoJyA6ICdtaW4taGVpZ2h0JztcblxuICAgIGNvbnN0IGhhc0NhbGMgPSBTdHJpbmcoYmFzaXMpLmluZGV4T2YoJ2NhbGMnKSA+IC0xO1xuICAgIGNvbnN0IHVzaW5nQ2FsYyA9IGhhc0NhbGMgfHwgYmFzaXMgPT09ICdhdXRvJztcbiAgICBjb25zdCBpc1BlcmNlbnQgPSBTdHJpbmcoYmFzaXMpLmluZGV4T2YoJyUnKSA+IC0xICYmICFoYXNDYWxjO1xuICAgIGNvbnN0IGhhc1VuaXRzID1cbiAgICAgIFN0cmluZyhiYXNpcykuaW5kZXhPZigncHgnKSA+IC0xIHx8XG4gICAgICBTdHJpbmcoYmFzaXMpLmluZGV4T2YoJ3JlbScpID4gLTEgfHxcbiAgICAgIFN0cmluZyhiYXNpcykuaW5kZXhPZignZW0nKSA+IC0xIHx8XG4gICAgICBTdHJpbmcoYmFzaXMpLmluZGV4T2YoJ3Z3JykgPiAtMSB8fFxuICAgICAgU3RyaW5nKGJhc2lzKS5pbmRleE9mKCd2aCcpID4gLTE7XG5cbiAgICBsZXQgaXNWYWx1ZSA9IGhhc0NhbGMgfHwgaGFzVW5pdHM7XG5cbiAgICBncm93ID0gZ3JvdyA9PSAnMCcgPyAwIDogZ3JvdztcbiAgICBzaHJpbmsgPSBzaHJpbmsgPT0gJzAnID8gMCA6IHNocmluaztcblxuICAgIC8vIG1ha2UgYm94IGluZmxleGlibGUgd2hlbiBzaHJpbmsgYW5kIGdyb3cgYXJlIGJvdGggemVyb1xuICAgIC8vIHNob3VsZCBub3Qgc2V0IGEgbWluIHdoZW4gdGhlIGdyb3cgaXMgemVyb1xuICAgIC8vIHNob3VsZCBub3Qgc2V0IGEgbWF4IHdoZW4gdGhlIHNocmluayBpcyB6ZXJvXG4gICAgY29uc3QgaXNGaXhlZCA9ICFncm93ICYmICFzaHJpbms7XG5cbiAgICBsZXQgY3NzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IG51bGwgfSA9IHt9O1xuXG4gICAgLy8gZmxleC1iYXNpcyBhbGxvd3MgeW91IHRvIHNwZWNpZnkgdGhlIGluaXRpYWwvc3RhcnRpbmcgbWFpbi1heGlzIHNpemUgb2YgdGhlIGVsZW1lbnQsXG4gICAgLy8gYmVmb3JlIGFueXRoaW5nIGVsc2UgaXMgY29tcHV0ZWQuIEl0IGNhbiBlaXRoZXIgYmUgYSBwZXJjZW50YWdlIG9yIGFuIGFic29sdXRlIHZhbHVlLlxuICAgIC8vIEl0IGlzLCBob3dldmVyLCBub3QgdGhlIGJyZWFraW5nIHBvaW50IGZvciBmbGV4LWdyb3cvc2hyaW5rIHByb3BlcnRpZXNcbiAgICAvL1xuICAgIC8vIGZsZXgtZ3JvdyBjYW4gYmUgc2VlbiBhcyB0aGlzOlxuICAgIC8vICAgMDogRG8gbm90IHN0cmV0Y2guIEVpdGhlciBzaXplIHRvIGVsZW1lbnQncyBjb250ZW50IHdpZHRoLCBvciBvYmV5ICdmbGV4LWJhc2lzJy5cbiAgICAvLyAgIDE6IChEZWZhdWx0IHZhbHVlKS4gU3RyZXRjaDsgd2lsbCBiZSB0aGUgc2FtZSBzaXplIHRvIGFsbCBvdGhlciBmbGV4IGl0ZW1zIG9uXG4gICAgLy8gICAgICAgdGhlIHNhbWUgcm93IHNpbmNlIHRoZXkgaGF2ZSBhIGRlZmF1bHQgdmFsdWUgb2YgMS5cbiAgICAvLyAgIOKJpTIgKGludGVnZXIgbik6IFN0cmV0Y2guIFdpbGwgYmUgbiB0aW1lcyB0aGUgc2l6ZSBvZiBvdGhlciBlbGVtZW50c1xuICAgIC8vICAgICAgd2l0aCAnZmxleC1ncm93OiAxJyBvbiB0aGUgc2FtZSByb3cuXG5cbiAgICAvLyBVc2UgYG51bGxgIHRvIGNsZWFyIGV4aXN0aW5nIHN0eWxlcy5cbiAgICBjb25zdCBjbGVhclN0eWxlcyA9IHtcbiAgICAgICdtYXgtd2lkdGgnOiBudWxsLFxuICAgICAgJ21heC1oZWlnaHQnOiBudWxsLFxuICAgICAgJ21pbi13aWR0aCc6IG51bGwsXG4gICAgICAnbWluLWhlaWdodCc6IG51bGwsXG4gICAgfTtcbiAgICBzd2l0Y2ggKGJhc2lzIHx8ICcnKSB7XG4gICAgICBjYXNlICcnOlxuICAgICAgICBjb25zdCB1c2VDb2x1bW5CYXNpc1plcm8gPVxuICAgICAgICAgIHRoaXMubGF5b3V0Q29uZmlnLnVzZUNvbHVtbkJhc2lzWmVybyAhPT0gZmFsc2U7XG4gICAgICAgIGJhc2lzID1cbiAgICAgICAgICBkaXJlY3Rpb24gPT09ICdyb3cnXG4gICAgICAgICAgICA/ICcwJSdcbiAgICAgICAgICAgIDogdXNlQ29sdW1uQmFzaXNaZXJvXG4gICAgICAgICAgICA/ICcwLjAwMDAwMDAwMXB4J1xuICAgICAgICAgICAgOiAnYXV0byc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaW5pdGlhbCc6IC8vIGRlZmF1bHRcbiAgICAgIGNhc2UgJ25vZ3Jvdyc6XG4gICAgICAgIGdyb3cgPSAwO1xuICAgICAgICBiYXNpcyA9ICdhdXRvJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdncm93JzpcbiAgICAgICAgYmFzaXMgPSAnMTAwJSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbm9zaHJpbmsnOlxuICAgICAgICBzaHJpbmsgPSAwO1xuICAgICAgICBiYXNpcyA9ICdhdXRvJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdhdXRvJzpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdub25lJzpcbiAgICAgICAgZ3JvdyA9IDA7XG4gICAgICAgIHNocmluayA9IDA7XG4gICAgICAgIGJhc2lzID0gJ2F1dG8nO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIERlZmF1bHRzIHRvIHBlcmNlbnRhZ2Ugc2l6aW5nIHVubGVzcyBgcHhgIGlzIGV4cGxpY2l0bHkgc2V0XG4gICAgICAgIGlmICghaXNWYWx1ZSAmJiAhaXNQZXJjZW50ICYmICFpc05hTihiYXNpcyBhcyBhbnkpKSB7XG4gICAgICAgICAgYmFzaXMgPSBiYXNpcyArICclJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpeCBmb3IgaXNzdWUgMjgwXG4gICAgICAgIGlmIChiYXNpcyA9PT0gJzAlJykge1xuICAgICAgICAgIGlzVmFsdWUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJhc2lzID09PSAnMHB4Jykge1xuICAgICAgICAgIGJhc2lzID0gJzAlJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZpeCBpc3N1ZSAjNTM0NVxuICAgICAgICBpZiAoaGFzQ2FsYykge1xuICAgICAgICAgIGNzcyA9IGV4dGVuZE9iamVjdChjbGVhclN0eWxlcywge1xuICAgICAgICAgICAgJ2ZsZXgtZ3Jvdyc6IGdyb3csXG4gICAgICAgICAgICAnZmxleC1zaHJpbmsnOiBzaHJpbmssXG4gICAgICAgICAgICAnZmxleC1iYXNpcyc6IGlzVmFsdWUgPyBiYXNpcyA6ICcxMDAlJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjc3MgPSBleHRlbmRPYmplY3QoY2xlYXJTdHlsZXMsIHtcbiAgICAgICAgICAgIGZsZXg6IGAke2dyb3d9ICR7c2hyaW5rfSAke2lzVmFsdWUgPyBiYXNpcyA6ICcxMDAlJ31gLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKCEoY3NzWydmbGV4J10gfHwgY3NzWydmbGV4LWdyb3cnXSkpIHtcbiAgICAgIGlmIChoYXNDYWxjKSB7XG4gICAgICAgIGNzcyA9IGV4dGVuZE9iamVjdChjbGVhclN0eWxlcywge1xuICAgICAgICAgICdmbGV4LWdyb3cnOiBncm93LFxuICAgICAgICAgICdmbGV4LXNocmluayc6IHNocmluayxcbiAgICAgICAgICAnZmxleC1iYXNpcyc6IGJhc2lzLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNzcyA9IGV4dGVuZE9iamVjdChjbGVhclN0eWxlcywge1xuICAgICAgICAgIGZsZXg6IGAke2dyb3d9ICR7c2hyaW5rfSAke2Jhc2lzfWAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZpeCBmb3IgaXNzdWVzIDI3NywgNTM0LCBhbmQgNzI4XG4gICAgaWYgKFxuICAgICAgYmFzaXMgIT09ICcwJScgJiZcbiAgICAgIGJhc2lzICE9PSAnMHB4JyAmJlxuICAgICAgYmFzaXMgIT09ICcwLjAwMDAwMDAwMXB4JyAmJlxuICAgICAgYmFzaXMgIT09ICdhdXRvJ1xuICAgICkge1xuICAgICAgY3NzW21pbl0gPSBpc0ZpeGVkIHx8IChpc1ZhbHVlICYmIGdyb3cpID8gYmFzaXMgOiBudWxsO1xuICAgICAgY3NzW21heF0gPSBpc0ZpeGVkIHx8ICghdXNpbmdDYWxjICYmIHNocmluaykgPyBiYXNpcyA6IG51bGw7XG4gICAgfVxuXG4gICAgLy8gRml4IGZvciBpc3N1ZSA1MjhcbiAgICBpZiAoIWNzc1ttaW5dICYmICFjc3NbbWF4XSkge1xuICAgICAgaWYgKGhhc0NhbGMpIHtcbiAgICAgICAgY3NzID0gZXh0ZW5kT2JqZWN0KGNsZWFyU3R5bGVzLCB7XG4gICAgICAgICAgJ2ZsZXgtZ3Jvdyc6IGdyb3csXG4gICAgICAgICAgJ2ZsZXgtc2hyaW5rJzogc2hyaW5rLFxuICAgICAgICAgICdmbGV4LWJhc2lzJzogYmFzaXMsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3NzID0gZXh0ZW5kT2JqZWN0KGNsZWFyU3R5bGVzLCB7XG4gICAgICAgICAgZmxleDogYCR7Z3Jvd30gJHtzaHJpbmt9ICR7YmFzaXN9YCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZpeCBmb3IgaXNzdWUgNjYwXG4gICAgICBpZiAocGFyZW50Lmhhc1dyYXApIHtcbiAgICAgICAgY3NzW2hhc0NhbGMgPyAnZmxleC1iYXNpcycgOiAnZmxleCddID0gY3NzW21heF1cbiAgICAgICAgICA/IGhhc0NhbGNcbiAgICAgICAgICAgID8gY3NzW21heF1cbiAgICAgICAgICAgIDogYCR7Z3Jvd30gJHtzaHJpbmt9ICR7Y3NzW21heF19YFxuICAgICAgICAgIDogaGFzQ2FsY1xuICAgICAgICAgID8gY3NzW21pbl1cbiAgICAgICAgICA6IGAke2dyb3d9ICR7c2hyaW5rfSAke2Nzc1ttaW5dfWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGV4dGVuZE9iamVjdChjc3MsIHsgJ2JveC1zaXppbmcnOiAnYm9yZGVyLWJveCcgfSkgYXMgU3R5bGVEZWZpbml0aW9uO1xuICB9XG59XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2Z4RmxleCcsXG4gICdmeEZsZXgueHMnLFxuICAnZnhGbGV4LnNtJyxcbiAgJ2Z4RmxleC5tZCcsXG4gICdmeEZsZXgubGcnLFxuICAnZnhGbGV4LnhsJyxcbiAgJ2Z4RmxleC5sdC1zbScsXG4gICdmeEZsZXgubHQtbWQnLFxuICAnZnhGbGV4Lmx0LWxnJyxcbiAgJ2Z4RmxleC5sdC14bCcsXG4gICdmeEZsZXguZ3QteHMnLFxuICAnZnhGbGV4Lmd0LXNtJyxcbiAgJ2Z4RmxleC5ndC1tZCcsXG4gICdmeEZsZXguZ3QtbGcnLFxuXTtcbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZnhGbGV4XSwgW2Z4RmxleC54c10sIFtmeEZsZXguc21dLCBbZnhGbGV4Lm1kXSxcbiAgW2Z4RmxleC5sZ10sIFtmeEZsZXgueGxdLCBbZnhGbGV4Lmx0LXNtXSwgW2Z4RmxleC5sdC1tZF0sXG4gIFtmeEZsZXgubHQtbGddLCBbZnhGbGV4Lmx0LXhsXSwgW2Z4RmxleC5ndC14c10sIFtmeEZsZXguZ3Qtc21dLFxuICBbZnhGbGV4Lmd0LW1kXSwgW2Z4RmxleC5ndC1sZ11cbmA7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRvIGNvbnRyb2wgdGhlIHNpemUgb2YgYSBmbGV4IGl0ZW0gdXNpbmcgZmxleC1iYXNpcywgZmxleC1ncm93LCBhbmQgZmxleC1zaHJpbmsuXG4gKiBDb3JyZXNwb25kcyB0byB0aGUgY3NzIGBmbGV4YCBzaG9ydGhhbmQgcHJvcGVydHkuXG4gKlxuICogQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2Nzcy9hLWd1aWRlLXRvLWZsZXhib3gvXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEZsZXhEaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBESVJFQ1RJVkVfS0VZID0gJ2ZsZXgnO1xuICBwcm90ZWN0ZWQgZGlyZWN0aW9uPzogc3RyaW5nID0gdW5kZWZpbmVkO1xuICBwcm90ZWN0ZWQgd3JhcD86IGJvb2xlYW4gPSB1bmRlZmluZWQ7XG5cbiAgQElucHV0KCdmeFNocmluaycpXG4gIGdldCBzaHJpbmsoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mbGV4U2hyaW5rO1xuICB9XG4gIHNldCBzaHJpbmsodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuZmxleFNocmluayA9IHZhbHVlIHx8ICcxJztcbiAgICB0aGlzLnRyaWdnZXJSZWZsb3coKTtcbiAgfVxuXG4gIEBJbnB1dCgnZnhHcm93JylcbiAgZ2V0IGdyb3coKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mbGV4R3JvdztcbiAgfVxuICBzZXQgZ3Jvdyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5mbGV4R3JvdyA9IHZhbHVlIHx8ICcxJztcbiAgICB0aGlzLnRyaWdnZXJSZWZsb3coKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBmbGV4R3JvdyA9ICcxJztcbiAgcHJvdGVjdGVkIGZsZXhTaHJpbmsgPSAnMSc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxSZWY6IEVsZW1lbnRSZWYsXG4gICAgc3R5bGVVdGlsczogU3R5bGVVdGlscyxcbiAgICBASW5qZWN0KExBWU9VVF9DT05GSUcpIHByb3RlY3RlZCBsYXlvdXRDb25maWc6IExheW91dENvbmZpZ09wdGlvbnMsXG4gICAgc3R5bGVCdWlsZGVyOiBGbGV4U3R5bGVCdWlsZGVyLFxuICAgIHByb3RlY3RlZCBvdmVycmlkZSBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXJcbiAgKSB7XG4gICAgc3VwZXIoZWxSZWYsIHN0eWxlQnVpbGRlciwgc3R5bGVVdGlscywgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLm1hcnNoYWxcbiAgICAgICAgLnRyYWNrVmFsdWUodGhpcy5wYXJlbnRFbGVtZW50LCAnbGF5b3V0JylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveVN1YmplY3QpKVxuICAgICAgICAuc3Vic2NyaWJlKHRoaXMub25MYXlvdXRDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLm1hcnNoYWxcbiAgICAgICAgLnRyYWNrVmFsdWUodGhpcy5uYXRpdmVFbGVtZW50LCAnbGF5b3V0LWFsaWduJylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveVN1YmplY3QpKVxuICAgICAgICAuc3Vic2NyaWJlKHRoaXMudHJpZ2dlclJlZmxvdy5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FjaGVzIHRoZSBwYXJlbnQgY29udGFpbmVyJ3MgJ2ZsZXgtZGlyZWN0aW9uJyBhbmQgdXBkYXRlcyB0aGUgZWxlbWVudCdzIHN0eWxlLlxuICAgKiBVc2VkIGFzIGEgaGFuZGxlciBmb3IgbGF5b3V0IGNoYW5nZSBldmVudHMgZnJvbSB0aGUgcGFyZW50IGZsZXggY29udGFpbmVyLlxuICAgKi9cbiAgcHJvdGVjdGVkIG9uTGF5b3V0Q2hhbmdlKG1hdGNoZXI6IEVsZW1lbnRNYXRjaGVyKSB7XG4gICAgY29uc3QgbGF5b3V0OiBzdHJpbmcgPSBtYXRjaGVyLnZhbHVlO1xuICAgIGNvbnN0IGxheW91dFBhcnRzID0gbGF5b3V0LnNwbGl0KCcgJyk7XG4gICAgdGhpcy5kaXJlY3Rpb24gPSBsYXlvdXRQYXJ0c1swXTtcbiAgICB0aGlzLndyYXAgPSBsYXlvdXRQYXJ0c1sxXSAhPT0gdW5kZWZpbmVkICYmIGxheW91dFBhcnRzWzFdID09PSAnd3JhcCc7XG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cblxuICAvKiogSW5wdXQgdG8gdGhpcyBpcyBleGNsdXNpdmVseSB0aGUgYmFzaXMgaW5wdXQgdmFsdWUgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgY29uc3QgYWRkRmxleFRvUGFyZW50ID0gdGhpcy5sYXlvdXRDb25maWcuYWRkRmxleFRvUGFyZW50ICE9PSBmYWxzZTtcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLmdldEZsZXhGbG93RGlyZWN0aW9uKFxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQhLFxuICAgICAgICBhZGRGbGV4VG9QYXJlbnRcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLndyYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy53cmFwID0gdGhpcy5oYXNXcmFwKHRoaXMucGFyZW50RWxlbWVudCEpO1xuICAgIH1cbiAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjtcbiAgICBjb25zdCBpc0hvcml6b250YWwgPSBkaXJlY3Rpb24uc3RhcnRzV2l0aCgncm93Jyk7XG4gICAgY29uc3QgaGFzV3JhcCA9IHRoaXMud3JhcDtcbiAgICBpZiAoaXNIb3Jpem9udGFsICYmIGhhc1dyYXApIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhSb3dXcmFwQ2FjaGU7XG4gICAgfSBlbHNlIGlmIChpc0hvcml6b250YWwgJiYgIWhhc1dyYXApIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhSb3dDYWNoZTtcbiAgICB9IGVsc2UgaWYgKCFpc0hvcml6b250YWwgJiYgaGFzV3JhcCkge1xuICAgICAgdGhpcy5zdHlsZUNhY2hlID0gZmxleENvbHVtbldyYXBDYWNoZTtcbiAgICB9IGVsc2UgaWYgKCFpc0hvcml6b250YWwgJiYgIWhhc1dyYXApIHtcbiAgICAgIHRoaXMuc3R5bGVDYWNoZSA9IGZsZXhDb2x1bW5DYWNoZTtcbiAgICB9XG4gICAgY29uc3QgYmFzaXMgPSBTdHJpbmcodmFsdWUpLnJlcGxhY2UoJzsnLCAnJyk7XG4gICAgY29uc3QgcGFydHMgPSB2YWxpZGF0ZUJhc2lzKGJhc2lzLCB0aGlzLmZsZXhHcm93LCB0aGlzLmZsZXhTaHJpbmspO1xuICAgIHRoaXMuYWRkU3R5bGVzKHBhcnRzLmpvaW4oJyAnKSwgeyBkaXJlY3Rpb24sIGhhc1dyYXAgfSk7XG4gIH1cblxuICAvKiogVHJpZ2dlciBhIHN0eWxlIHJlZmxvdywgdXN1YWxseSBiYXNlZCBvbiBhIHNocmluay9ncm93IGlucHV0IGV2ZW50ICovXG4gIHByb3RlY3RlZCB0cmlnZ2VyUmVmbG93KCkge1xuICAgIGNvbnN0IGFjdGl2YXRlZFZhbHVlID0gdGhpcy5hY3RpdmF0ZWRWYWx1ZTtcbiAgICBpZiAoYWN0aXZhdGVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgcGFydHMgPSB2YWxpZGF0ZUJhc2lzKFxuICAgICAgICBhY3RpdmF0ZWRWYWx1ZSArICcnLFxuICAgICAgICB0aGlzLmZsZXhHcm93LFxuICAgICAgICB0aGlzLmZsZXhTaHJpbmtcbiAgICAgICk7XG4gICAgICB0aGlzLm1hcnNoYWwudXBkYXRlRWxlbWVudChcbiAgICAgICAgdGhpcy5uYXRpdmVFbGVtZW50LFxuICAgICAgICB0aGlzLkRJUkVDVElWRV9LRVksXG4gICAgICAgIHBhcnRzLmpvaW4oJyAnKVxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7IGlucHV0cywgc2VsZWN0b3IgfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0RmxleERpcmVjdGl2ZSBleHRlbmRzIEZsZXhEaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5wdXRzID0gaW5wdXRzO1xufVxuXG5jb25zdCBmbGV4Um93Q2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBmbGV4Q29sdW1uQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBmbGV4Um93V3JhcENhY2hlOiBNYXA8c3RyaW5nLCBTdHlsZURlZmluaXRpb24+ID0gbmV3IE1hcCgpO1xuY29uc3QgZmxleENvbHVtbldyYXBDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcbiJdfQ==