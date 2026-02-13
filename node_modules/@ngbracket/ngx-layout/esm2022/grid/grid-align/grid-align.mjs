/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Injectable } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@ngbracket/ngx-layout/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngbracket/ngx-layout/core";
const ROW_DEFAULT = 'stretch';
const COL_DEFAULT = 'stretch';
export class GridAlignStyleBuilder extends StyleBuilder {
    buildStyles(input) {
        return buildCss(input || ROW_DEFAULT);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignStyleBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridAlignDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-align';
        this.styleCache = alignCache;
        this.init();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignDirective, deps: [{ token: i0.ElementRef }, { token: GridAlignStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: GridAlignDirective, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: GridAlignStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }] });
const alignCache = new Map();
const inputs = [
    'gdGridAlign',
    'gdGridAlign.xs',
    'gdGridAlign.sm',
    'gdGridAlign.md',
    'gdGridAlign.lg',
    'gdGridAlign.xl',
    'gdGridAlign.lt-sm',
    'gdGridAlign.lt-md',
    'gdGridAlign.lt-lg',
    'gdGridAlign.lt-xl',
    'gdGridAlign.gt-xs',
    'gdGridAlign.gt-sm',
    'gdGridAlign.gt-md',
    'gdGridAlign.gt-lg',
];
const selector = `
  [gdGridAlign],
  [gdGridAlign.xs], [gdGridAlign.sm], [gdGridAlign.md], [gdGridAlign.lg],[gdGridAlign.xl],
  [gdGridAlign.lt-sm], [gdGridAlign.lt-md], [gdGridAlign.lt-lg], [gdGridAlign.lt-xl],
  [gdGridAlign.gt-xs], [gdGridAlign.gt-sm], [gdGridAlign.gt-md], [gdGridAlign.gt-lg]
`;
/**
 * 'align' CSS Grid styling directive for grid children
 *  Defines positioning of child elements along row and column axis in a grid container
 *  Optional values: {row-axis} values or {row-axis column-axis} value pairs
 *
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-justify-self
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-align-self
 */
export class DefaultGridAlignDirective extends GridAlignDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultGridAlignDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultGridAlignDirective, selector: "\n  [gdGridAlign],\n  [gdGridAlign.xs], [gdGridAlign.sm], [gdGridAlign.md], [gdGridAlign.lg],[gdGridAlign.xl],\n  [gdGridAlign.lt-sm], [gdGridAlign.lt-md], [gdGridAlign.lt-lg], [gdGridAlign.lt-xl],\n  [gdGridAlign.gt-xs], [gdGridAlign.gt-sm], [gdGridAlign.gt-md], [gdGridAlign.gt-lg]\n", inputs: { gdGridAlign: "gdGridAlign", "gdGridAlign.xs": "gdGridAlign.xs", "gdGridAlign.sm": "gdGridAlign.sm", "gdGridAlign.md": "gdGridAlign.md", "gdGridAlign.lg": "gdGridAlign.lg", "gdGridAlign.xl": "gdGridAlign.xl", "gdGridAlign.lt-sm": "gdGridAlign.lt-sm", "gdGridAlign.lt-md": "gdGridAlign.lt-md", "gdGridAlign.lt-lg": "gdGridAlign.lt-lg", "gdGridAlign.lt-xl": "gdGridAlign.lt-xl", "gdGridAlign.gt-xs": "gdGridAlign.gt-xs", "gdGridAlign.gt-sm": "gdGridAlign.gt-sm", "gdGridAlign.gt-md": "gdGridAlign.gt-md", "gdGridAlign.gt-lg": "gdGridAlign.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultGridAlignDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
function buildCss(align = '') {
    const css = {}, [rowAxis, columnAxis] = align.split(' ');
    // Row axis
    switch (rowAxis) {
        case 'end':
            css['justify-self'] = 'end';
            break;
        case 'center':
            css['justify-self'] = 'center';
            break;
        case 'stretch':
            css['justify-self'] = 'stretch';
            break;
        case 'start':
            css['justify-self'] = 'start';
            break;
        default: // default row axis
            css['justify-self'] = ROW_DEFAULT;
            break;
    }
    // Column axis
    switch (columnAxis) {
        case 'end':
            css['align-self'] = 'end';
            break;
        case 'center':
            css['align-self'] = 'center';
            break;
        case 'stretch':
            css['align-self'] = 'stretch';
            break;
        case 'start':
            css['align-self'] = 'start';
            break;
        default: // default column axis
            css['align-self'] = COL_DEFAULT;
            break;
    }
    return css;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1hbGlnbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZ3JpZC9ncmlkLWFsaWduL2dyaWQtYWxpZ24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFFLFNBQVMsRUFBYyxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEUsT0FBTyxFQUNMLGNBQWMsRUFFZCxZQUFZLEdBR2IsTUFBTSw0QkFBNEIsQ0FBQzs7O0FBRXBDLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM5QixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFHOUIsTUFBTSxPQUFPLHFCQUFzQixTQUFRLFlBQVk7SUFDckQsV0FBVyxDQUFDLEtBQWE7UUFDdkIsT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7OEdBSFUscUJBQXFCO2tIQUFyQixxQkFBcUIsY0FEUixNQUFNOzsyRkFDbkIscUJBQXFCO2tCQURqQyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7QUFRbEMsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGNBQWM7SUFHcEQsWUFDRSxVQUFzQixFQUN0QixZQUFtQyxFQUNuQyxNQUFrQixFQUNsQixPQUF3QjtRQUV4QixLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFSaEMsa0JBQWEsR0FBRyxZQUFZLENBQUM7UUFZN0IsZUFBVSxHQUFHLFVBQVUsQ0FBQztRQUh6QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDZCxDQUFDOzhHQVhVLGtCQUFrQjtrR0FBbEIsa0JBQWtCOzsyRkFBbEIsa0JBQWtCO2tCQUQ5QixTQUFTOztBQWlCVixNQUFNLFVBQVUsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUUzRCxNQUFNLE1BQU0sR0FBRztJQUNiLGFBQWE7SUFDYixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQixtQkFBbUI7Q0FDcEIsQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHOzs7OztDQUtoQixDQUFDO0FBRUY7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxrQkFBa0I7SUFEakU7O1FBRXFCLFdBQU0sR0FBRyxNQUFNLENBQUM7S0FDcEM7OEdBRlkseUJBQXlCO2tHQUF6Qix5QkFBeUI7OzJGQUF6Qix5QkFBeUI7a0JBRHJDLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFOztBQUsvQixTQUFTLFFBQVEsQ0FBQyxRQUFnQixFQUFFO0lBQ2xDLE1BQU0sR0FBRyxHQUE4QixFQUFFLEVBQ3ZDLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFM0MsV0FBVztJQUNYLFFBQVEsT0FBTyxFQUFFO1FBQ2YsS0FBSyxLQUFLO1lBQ1IsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUM1QixNQUFNO1FBQ1IsS0FBSyxRQUFRO1lBQ1gsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUMvQixNQUFNO1FBQ1IsS0FBSyxTQUFTO1lBQ1osR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUNoQyxNQUFNO1FBQ1IsS0FBSyxPQUFPO1lBQ1YsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUM5QixNQUFNO1FBQ1IsU0FBUyxtQkFBbUI7WUFDMUIsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUNsQyxNQUFNO0tBQ1Q7SUFFRCxjQUFjO0lBQ2QsUUFBUSxVQUFVLEVBQUU7UUFDbEIsS0FBSyxLQUFLO1lBQ1IsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMxQixNQUFNO1FBQ1IsS0FBSyxRQUFRO1lBQ1gsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLFFBQVEsQ0FBQztZQUM3QixNQUFNO1FBQ1IsS0FBSyxTQUFTO1lBQ1osR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUM5QixNQUFNO1FBQ1IsS0FBSyxPQUFPO1lBQ1YsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUM1QixNQUFNO1FBQ1IsU0FBUyxzQkFBc0I7WUFDN0IsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUNoQyxNQUFNO0tBQ1Q7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG4gIFN0eWxlVXRpbHMsXG59IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9jb3JlJztcblxuY29uc3QgUk9XX0RFRkFVTFQgPSAnc3RyZXRjaCc7XG5jb25zdCBDT0xfREVGQVVMVCA9ICdzdHJldGNoJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBHcmlkQWxpZ25TdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBidWlsZFN0eWxlcyhpbnB1dDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGJ1aWxkQ3NzKGlucHV0IHx8IFJPV19ERUZBVUxUKTtcbiAgfVxufVxuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBHcmlkQWxpZ25EaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBESVJFQ1RJVkVfS0VZID0gJ2dyaWQtYWxpZ24nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgc3R5bGVCdWlsZGVyOiBHcmlkQWxpZ25TdHlsZUJ1aWxkZXIsXG4gICAgc3R5bGVyOiBTdHlsZVV0aWxzLFxuICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlclxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgc3R5bGVDYWNoZSA9IGFsaWduQ2FjaGU7XG59XG5cbmNvbnN0IGFsaWduQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ2dkR3JpZEFsaWduJyxcbiAgJ2dkR3JpZEFsaWduLnhzJyxcbiAgJ2dkR3JpZEFsaWduLnNtJyxcbiAgJ2dkR3JpZEFsaWduLm1kJyxcbiAgJ2dkR3JpZEFsaWduLmxnJyxcbiAgJ2dkR3JpZEFsaWduLnhsJyxcbiAgJ2dkR3JpZEFsaWduLmx0LXNtJyxcbiAgJ2dkR3JpZEFsaWduLmx0LW1kJyxcbiAgJ2dkR3JpZEFsaWduLmx0LWxnJyxcbiAgJ2dkR3JpZEFsaWduLmx0LXhsJyxcbiAgJ2dkR3JpZEFsaWduLmd0LXhzJyxcbiAgJ2dkR3JpZEFsaWduLmd0LXNtJyxcbiAgJ2dkR3JpZEFsaWduLmd0LW1kJyxcbiAgJ2dkR3JpZEFsaWduLmd0LWxnJyxcbl07XG5cbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZ2RHcmlkQWxpZ25dLFxuICBbZ2RHcmlkQWxpZ24ueHNdLCBbZ2RHcmlkQWxpZ24uc21dLCBbZ2RHcmlkQWxpZ24ubWRdLCBbZ2RHcmlkQWxpZ24ubGddLFtnZEdyaWRBbGlnbi54bF0sXG4gIFtnZEdyaWRBbGlnbi5sdC1zbV0sIFtnZEdyaWRBbGlnbi5sdC1tZF0sIFtnZEdyaWRBbGlnbi5sdC1sZ10sIFtnZEdyaWRBbGlnbi5sdC14bF0sXG4gIFtnZEdyaWRBbGlnbi5ndC14c10sIFtnZEdyaWRBbGlnbi5ndC1zbV0sIFtnZEdyaWRBbGlnbi5ndC1tZF0sIFtnZEdyaWRBbGlnbi5ndC1sZ11cbmA7XG5cbi8qKlxuICogJ2FsaWduJyBDU1MgR3JpZCBzdHlsaW5nIGRpcmVjdGl2ZSBmb3IgZ3JpZCBjaGlsZHJlblxuICogIERlZmluZXMgcG9zaXRpb25pbmcgb2YgY2hpbGQgZWxlbWVudHMgYWxvbmcgcm93IGFuZCBjb2x1bW4gYXhpcyBpbiBhIGdyaWQgY29udGFpbmVyXG4gKiAgT3B0aW9uYWwgdmFsdWVzOiB7cm93LWF4aXN9IHZhbHVlcyBvciB7cm93LWF4aXMgY29sdW1uLWF4aXN9IHZhbHVlIHBhaXJzXG4gKlxuICogIEBzZWUgaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9jc3MvY29tcGxldGUtZ3VpZGUtZ3JpZC8jcHJvcC1qdXN0aWZ5LXNlbGZcbiAqICBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvY3NzL2NvbXBsZXRlLWd1aWRlLWdyaWQvI3Byb3AtYWxpZ24tc2VsZlxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3IsIGlucHV0cyB9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRHcmlkQWxpZ25EaXJlY3RpdmUgZXh0ZW5kcyBHcmlkQWxpZ25EaXJlY3RpdmUge1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgaW5wdXRzID0gaW5wdXRzO1xufVxuXG5mdW5jdGlvbiBidWlsZENzcyhhbGlnbjogc3RyaW5nID0gJycpIHtcbiAgY29uc3QgY3NzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge30sXG4gICAgW3Jvd0F4aXMsIGNvbHVtbkF4aXNdID0gYWxpZ24uc3BsaXQoJyAnKTtcblxuICAvLyBSb3cgYXhpc1xuICBzd2l0Y2ggKHJvd0F4aXMpIHtcbiAgICBjYXNlICdlbmQnOlxuICAgICAgY3NzWydqdXN0aWZ5LXNlbGYnXSA9ICdlbmQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIGNzc1snanVzdGlmeS1zZWxmJ10gPSAnY2VudGVyJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0cmV0Y2gnOlxuICAgICAgY3NzWydqdXN0aWZ5LXNlbGYnXSA9ICdzdHJldGNoJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgIGNzc1snanVzdGlmeS1zZWxmJ10gPSAnc3RhcnQnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDogLy8gZGVmYXVsdCByb3cgYXhpc1xuICAgICAgY3NzWydqdXN0aWZ5LXNlbGYnXSA9IFJPV19ERUZBVUxUO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICAvLyBDb2x1bW4gYXhpc1xuICBzd2l0Y2ggKGNvbHVtbkF4aXMpIHtcbiAgICBjYXNlICdlbmQnOlxuICAgICAgY3NzWydhbGlnbi1zZWxmJ10gPSAnZW5kJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICBjc3NbJ2FsaWduLXNlbGYnXSA9ICdjZW50ZXInO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RyZXRjaCc6XG4gICAgICBjc3NbJ2FsaWduLXNlbGYnXSA9ICdzdHJldGNoJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgIGNzc1snYWxpZ24tc2VsZiddID0gJ3N0YXJ0JztcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6IC8vIGRlZmF1bHQgY29sdW1uIGF4aXNcbiAgICAgIGNzc1snYWxpZ24tc2VsZiddID0gQ09MX0RFRkFVTFQ7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiBjc3M7XG59XG4iXX0=