/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, Injectable, Input } from '@angular/core';
import { BaseDirective2, StyleBuilder, } from '@ngbracket/ngx-layout/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngbracket/ngx-layout/core";
const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';
export class GridAlignColumnsStyleBuilder extends StyleBuilder {
    buildStyles(input, parent) {
        return buildCss(input || `${DEFAULT_MAIN} ${DEFAULT_CROSS}`, parent.inline);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignColumnsStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignColumnsStyleBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignColumnsStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class GridAlignColumnsDirective extends BaseDirective2 {
    get inline() {
        return this._inline;
    }
    set inline(val) {
        this._inline = coerceBooleanProperty(val);
    }
    constructor(elementRef, styleBuilder, styler, marshal) {
        super(elementRef, styleBuilder, styler, marshal);
        this.DIRECTIVE_KEY = 'grid-align-columns';
        this._inline = false;
        this.init();
    }
    // *********************************************
    // Protected methods
    // *********************************************
    updateWithValue(value) {
        this.styleCache = this.inline ? alignColumnsInlineCache : alignColumnsCache;
        this.addStyles(value, { inline: this.inline });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignColumnsDirective, deps: [{ token: i0.ElementRef }, { token: GridAlignColumnsStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: GridAlignColumnsDirective, inputs: { inline: ["gdInline", "inline"] }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridAlignColumnsDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: GridAlignColumnsStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }], propDecorators: { inline: [{
                type: Input,
                args: ['gdInline']
            }] } });
const alignColumnsCache = new Map();
const alignColumnsInlineCache = new Map();
const inputs = [
    'gdAlignColumns',
    'gdAlignColumns.xs',
    'gdAlignColumns.sm',
    'gdAlignColumns.md',
    'gdAlignColumns.lg',
    'gdAlignColumns.xl',
    'gdAlignColumns.lt-sm',
    'gdAlignColumns.lt-md',
    'gdAlignColumns.lt-lg',
    'gdAlignColumns.lt-xl',
    'gdAlignColumns.gt-xs',
    'gdAlignColumns.gt-sm',
    'gdAlignColumns.gt-md',
    'gdAlignColumns.gt-lg',
];
const selector = `
  [gdAlignColumns],
  [gdAlignColumns.xs], [gdAlignColumns.sm], [gdAlignColumns.md],
  [gdAlignColumns.lg], [gdAlignColumns.xl], [gdAlignColumns.lt-sm],
  [gdAlignColumns.lt-md], [gdAlignColumns.lt-lg], [gdAlignColumns.lt-xl],
  [gdAlignColumns.gt-xs], [gdAlignColumns.gt-sm], [gdAlignColumns.gt-md],
  [gdAlignColumns.gt-lg]
`;
/**
 * 'column alignment' CSS Grid styling directive
 * Configures the alignment in the column direction
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-19
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-21
 */
export class DefaultGridAlignColumnsDirective extends GridAlignColumnsDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultGridAlignColumnsDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultGridAlignColumnsDirective, selector: "\n  [gdAlignColumns],\n  [gdAlignColumns.xs], [gdAlignColumns.sm], [gdAlignColumns.md],\n  [gdAlignColumns.lg], [gdAlignColumns.xl], [gdAlignColumns.lt-sm],\n  [gdAlignColumns.lt-md], [gdAlignColumns.lt-lg], [gdAlignColumns.lt-xl],\n  [gdAlignColumns.gt-xs], [gdAlignColumns.gt-sm], [gdAlignColumns.gt-md],\n  [gdAlignColumns.gt-lg]\n", inputs: { gdAlignColumns: "gdAlignColumns", "gdAlignColumns.xs": "gdAlignColumns.xs", "gdAlignColumns.sm": "gdAlignColumns.sm", "gdAlignColumns.md": "gdAlignColumns.md", "gdAlignColumns.lg": "gdAlignColumns.lg", "gdAlignColumns.xl": "gdAlignColumns.xl", "gdAlignColumns.lt-sm": "gdAlignColumns.lt-sm", "gdAlignColumns.lt-md": "gdAlignColumns.lt-md", "gdAlignColumns.lt-lg": "gdAlignColumns.lt-lg", "gdAlignColumns.lt-xl": "gdAlignColumns.lt-xl", "gdAlignColumns.gt-xs": "gdAlignColumns.gt-xs", "gdAlignColumns.gt-sm": "gdAlignColumns.gt-sm", "gdAlignColumns.gt-md": "gdAlignColumns.gt-md", "gdAlignColumns.gt-lg": "gdAlignColumns.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultGridAlignColumnsDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
function buildCss(align, inline) {
    const css = {}, [mainAxis, crossAxis] = align.split(' ');
    // Main axis
    switch (mainAxis) {
        case 'center':
            css['align-content'] = 'center';
            break;
        case 'space-around':
            css['align-content'] = 'space-around';
            break;
        case 'space-between':
            css['align-content'] = 'space-between';
            break;
        case 'space-evenly':
            css['align-content'] = 'space-evenly';
            break;
        case 'end':
            css['align-content'] = 'end';
            break;
        case 'start':
            css['align-content'] = 'start';
            break;
        case 'stretch':
            css['align-content'] = 'stretch';
            break;
        default: // default main axis
            css['align-content'] = DEFAULT_MAIN;
            break;
    }
    // Cross-axis
    switch (crossAxis) {
        case 'start':
            css['align-items'] = 'start';
            break;
        case 'center':
            css['align-items'] = 'center';
            break;
        case 'end':
            css['align-items'] = 'end';
            break;
        case 'stretch':
            css['align-items'] = 'stretch';
            break;
        default: // 'stretch'
            // default cross axis
            css['align-items'] = DEFAULT_CROSS;
            break;
    }
    css['display'] = inline ? 'inline-grid' : 'grid';
    return css;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpZ24tY29sdW1ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZ3JpZC9hbGlnbi1jb2x1bW5zL2FsaWduLWNvbHVtbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFNBQVMsRUFBYyxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pFLE9BQU8sRUFDTCxjQUFjLEVBRWQsWUFBWSxHQUdiLE1BQU0sNEJBQTRCLENBQUM7OztBQUVwQyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUM7QUFDN0IsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBT2hDLE1BQU0sT0FBTyw0QkFBNkIsU0FBUSxZQUFZO0lBQzVELFdBQVcsQ0FBQyxLQUFhLEVBQUUsTUFBOEI7UUFDdkQsT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLEdBQUcsWUFBWSxJQUFJLGFBQWEsRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RSxDQUFDOzhHQUhVLDRCQUE0QjtrSEFBNUIsNEJBQTRCLGNBRGYsTUFBTTs7MkZBQ25CLDRCQUE0QjtrQkFEeEMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7O0FBUWxDLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxjQUFjO0lBRzNELElBQ0ksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBQ0QsSUFBSSxNQUFNLENBQUMsR0FBWTtRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFHRCxZQUNFLFVBQXNCLEVBQ3RCLFlBQTBDLEVBQzFDLE1BQWtCLEVBQ2xCLE9BQXdCO1FB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UUFDUixLQUFLLFFBQVE7WUFDWCxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsUUFBUSxDQUFDO1lBQzlCLE1BQU07UUFDUixLQUFLLEtBQUs7WUFDUixHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQzNCLE1BQU07UUFDUixLQUFLLFNBQVM7WUFDWixHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsU0FBUyxDQUFDO1lBQy9CLE1BQU07UUFDUixTQUFTLFlBQVk7WUFDbkIscUJBQXFCO1lBQ3JCLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxhQUFhLENBQUM7WUFDbkMsTUFBTTtLQUNUO0lBRUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFakQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBjb2VyY2VCb29sZWFuUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3RhYmxlLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG4gIFN0eWxlVXRpbHMsXG59IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9jb3JlJztcblxuY29uc3QgREVGQVVMVF9NQUlOID0gJ3N0YXJ0JztcbmNvbnN0IERFRkFVTFRfQ1JPU1MgPSAnc3RyZXRjaCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR3JpZEFsaWduQ29sdW1uc1BhcmVudCB7XG4gIGlubGluZTogYm9vbGVhbjtcbn1cblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBHcmlkQWxpZ25Db2x1bW5zU3R5bGVCdWlsZGVyIGV4dGVuZHMgU3R5bGVCdWlsZGVyIHtcbiAgYnVpbGRTdHlsZXMoaW5wdXQ6IHN0cmluZywgcGFyZW50OiBHcmlkQWxpZ25Db2x1bW5zUGFyZW50KSB7XG4gICAgcmV0dXJuIGJ1aWxkQ3NzKGlucHV0IHx8IGAke0RFRkFVTFRfTUFJTn0gJHtERUZBVUxUX0NST1NTfWAsIHBhcmVudC5pbmxpbmUpO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEdyaWRBbGlnbkNvbHVtbnNEaXJlY3RpdmUgZXh0ZW5kcyBCYXNlRGlyZWN0aXZlMiB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBESVJFQ1RJVkVfS0VZID0gJ2dyaWQtYWxpZ24tY29sdW1ucyc7XG5cbiAgQElucHV0KCdnZElubGluZScpXG4gIGdldCBpbmxpbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lubGluZTtcbiAgfVxuICBzZXQgaW5saW5lKHZhbDogYm9vbGVhbikge1xuICAgIHRoaXMuX2lubGluZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICB9XG4gIHByb3RlY3RlZCBfaW5saW5lID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBzdHlsZUJ1aWxkZXI6IEdyaWRBbGlnbkNvbHVtbnNTdHlsZUJ1aWxkZXIsXG4gICAgc3R5bGVyOiBTdHlsZVV0aWxzLFxuICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlclxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHJvdGVjdGVkIG1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdHlsZUNhY2hlID0gdGhpcy5pbmxpbmUgPyBhbGlnbkNvbHVtbnNJbmxpbmVDYWNoZSA6IGFsaWduQ29sdW1uc0NhY2hlO1xuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlLCB7IGlubGluZTogdGhpcy5pbmxpbmUgfSk7XG4gIH1cbn1cblxuY29uc3QgYWxpZ25Db2x1bW5zQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5jb25zdCBhbGlnbkNvbHVtbnNJbmxpbmVDYWNoZTogTWFwPHN0cmluZywgU3R5bGVEZWZpbml0aW9uPiA9IG5ldyBNYXAoKTtcblxuY29uc3QgaW5wdXRzID0gW1xuICAnZ2RBbGlnbkNvbHVtbnMnLFxuICAnZ2RBbGlnbkNvbHVtbnMueHMnLFxuICAnZ2RBbGlnbkNvbHVtbnMuc20nLFxuICAnZ2RBbGlnbkNvbHVtbnMubWQnLFxuICAnZ2RBbGlnbkNvbHVtbnMubGcnLFxuICAnZ2RBbGlnbkNvbHVtbnMueGwnLFxuICAnZ2RBbGlnbkNvbHVtbnMubHQtc20nLFxuICAnZ2RBbGlnbkNvbHVtbnMubHQtbWQnLFxuICAnZ2RBbGlnbkNvbHVtbnMubHQtbGcnLFxuICAnZ2RBbGlnbkNvbHVtbnMubHQteGwnLFxuICAnZ2RBbGlnbkNvbHVtbnMuZ3QteHMnLFxuICAnZ2RBbGlnbkNvbHVtbnMuZ3Qtc20nLFxuICAnZ2RBbGlnbkNvbHVtbnMuZ3QtbWQnLFxuICAnZ2RBbGlnbkNvbHVtbnMuZ3QtbGcnLFxuXTtcbmNvbnN0IHNlbGVjdG9yID0gYFxuICBbZ2RBbGlnbkNvbHVtbnNdLFxuICBbZ2RBbGlnbkNvbHVtbnMueHNdLCBbZ2RBbGlnbkNvbHVtbnMuc21dLCBbZ2RBbGlnbkNvbHVtbnMubWRdLFxuICBbZ2RBbGlnbkNvbHVtbnMubGddLCBbZ2RBbGlnbkNvbHVtbnMueGxdLCBbZ2RBbGlnbkNvbHVtbnMubHQtc21dLFxuICBbZ2RBbGlnbkNvbHVtbnMubHQtbWRdLCBbZ2RBbGlnbkNvbHVtbnMubHQtbGddLCBbZ2RBbGlnbkNvbHVtbnMubHQteGxdLFxuICBbZ2RBbGlnbkNvbHVtbnMuZ3QteHNdLCBbZ2RBbGlnbkNvbHVtbnMuZ3Qtc21dLCBbZ2RBbGlnbkNvbHVtbnMuZ3QtbWRdLFxuICBbZ2RBbGlnbkNvbHVtbnMuZ3QtbGddXG5gO1xuXG4vKipcbiAqICdjb2x1bW4gYWxpZ25tZW50JyBDU1MgR3JpZCBzdHlsaW5nIGRpcmVjdGl2ZVxuICogQ29uZmlndXJlcyB0aGUgYWxpZ25tZW50IGluIHRoZSBjb2x1bW4gZGlyZWN0aW9uXG4gKiBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvY3NzL2NvbXBsZXRlLWd1aWRlLWdyaWQvI2FydGljbGUtaGVhZGVyLWlkLTE5XG4gKiBAc2VlIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvY3NzL2NvbXBsZXRlLWd1aWRlLWdyaWQvI2FydGljbGUtaGVhZGVyLWlkLTIxXG4gKi9cbkBEaXJlY3RpdmUoeyBzZWxlY3RvciwgaW5wdXRzIH0pXG5leHBvcnQgY2xhc3MgRGVmYXVsdEdyaWRBbGlnbkNvbHVtbnNEaXJlY3RpdmUgZXh0ZW5kcyBHcmlkQWxpZ25Db2x1bW5zRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGlucHV0cyA9IGlucHV0cztcbn1cblxuZnVuY3Rpb24gYnVpbGRDc3MoYWxpZ246IHN0cmluZywgaW5saW5lOiBib29sZWFuKTogU3R5bGVEZWZpbml0aW9uIHtcbiAgY29uc3QgY3NzOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge30sXG4gICAgW21haW5BeGlzLCBjcm9zc0F4aXNdID0gYWxpZ24uc3BsaXQoJyAnKTtcblxuICAvLyBNYWluIGF4aXNcbiAgc3dpdGNoIChtYWluQXhpcykge1xuICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICBjc3NbJ2FsaWduLWNvbnRlbnQnXSA9ICdjZW50ZXInO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3BhY2UtYXJvdW5kJzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3NwYWNlLWFyb3VuZCc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdzcGFjZS1iZXR3ZWVuJzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3NwYWNlLWJldHdlZW4nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3BhY2UtZXZlbmx5JzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3NwYWNlLWV2ZW5seSc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdlbmQnOlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnZW5kJztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgIGNzc1snYWxpZ24tY29udGVudCddID0gJ3N0YXJ0JztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3N0cmV0Y2gnOlxuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSAnc3RyZXRjaCc7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OiAvLyBkZWZhdWx0IG1haW4gYXhpc1xuICAgICAgY3NzWydhbGlnbi1jb250ZW50J10gPSBERUZBVUxUX01BSU47XG4gICAgICBicmVhaztcbiAgfVxuXG4gIC8vIENyb3NzLWF4aXNcbiAgc3dpdGNoIChjcm9zc0F4aXMpIHtcbiAgICBjYXNlICdzdGFydCc6XG4gICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnc3RhcnQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY2VudGVyJzpcbiAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9ICdjZW50ZXInO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZW5kJzpcbiAgICAgIGNzc1snYWxpZ24taXRlbXMnXSA9ICdlbmQnO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc3RyZXRjaCc6XG4gICAgICBjc3NbJ2FsaWduLWl0ZW1zJ10gPSAnc3RyZXRjaCc7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OiAvLyAnc3RyZXRjaCdcbiAgICAgIC8vIGRlZmF1bHQgY3Jvc3MgYXhpc1xuICAgICAgY3NzWydhbGlnbi1pdGVtcyddID0gREVGQVVMVF9DUk9TUztcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgY3NzWydkaXNwbGF5J10gPSBpbmxpbmUgPyAnaW5saW5lLWdyaWQnIDogJ2dyaWQnO1xuXG4gIHJldHVybiBjc3M7XG59XG4iXX0=