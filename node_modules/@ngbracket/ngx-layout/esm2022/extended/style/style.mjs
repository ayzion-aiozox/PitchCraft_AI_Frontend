/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformServer, NgStyle } from '@angular/common';
import { Directive, Inject, Optional, PLATFORM_ID, SecurityContext, Self, } from '@angular/core';
import { BaseDirective2, SERVER_TOKEN, } from '@ngbracket/ngx-layout/core';
import { buildMapFromSet, buildRawList, getType, keyValuesToMap, stringToKeyValue, } from './style-transforms';
import * as i0 from "@angular/core";
import * as i1 from "@ngbracket/ngx-layout/core";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/common";
export class StyleDirective extends BaseDirective2 {
    constructor(elementRef, styler, marshal, sanitizer, differs, renderer2, ngStyleInstance, serverLoaded, platformId) {
        super(elementRef, null, styler, marshal);
        this.sanitizer = sanitizer;
        this.ngStyleInstance = ngStyleInstance;
        this.DIRECTIVE_KEY = 'ngStyle';
        if (!this.ngStyleInstance) {
            // Create an instance NgStyle Directive instance only if `ngStyle=""` has NOT been
            // defined on the same host element; since the responsive variations may be defined...
            this.ngStyleInstance = new NgStyle(elementRef, differs, renderer2);
        }
        this.init();
        const styles = this.nativeElement.getAttribute('style') ?? '';
        this.fallbackStyles = this.buildStyleMap(styles);
        this.isServer = serverLoaded && isPlatformServer(platformId);
    }
    /** Add generated styles */
    updateWithValue(value) {
        const styles = this.buildStyleMap(value);
        this.ngStyleInstance.ngStyle = { ...this.fallbackStyles, ...styles };
        if (this.isServer) {
            this.applyStyleToElement(styles);
        }
        this.ngStyleInstance.ngDoCheck();
    }
    /** Remove generated styles */
    clearStyles() {
        this.ngStyleInstance.ngStyle = this.fallbackStyles;
        this.ngStyleInstance.ngDoCheck();
    }
    /**
     * Convert raw strings to ngStyleMap; which is required by ngStyle
     * NOTE: Raw string key-value pairs MUST be delimited by `;`
     *       Comma-delimiters are not supported due to complexities of
     *       possible style values such as `rgba(x,x,x,x)` and others
     */
    buildStyleMap(styles) {
        // Always safe-guard (aka sanitize) style property values
        const sanitizer = (val) => this.sanitizer.sanitize(SecurityContext.STYLE, val) ?? '';
        if (styles) {
            switch (getType(styles)) {
                case 'string':
                    return buildMapFromList(buildRawList(styles), sanitizer);
                case 'array':
                    return buildMapFromList(styles, sanitizer);
                case 'set':
                    return buildMapFromSet(styles, sanitizer);
                default:
                    return buildMapFromSet(styles, sanitizer);
            }
        }
        return {};
    }
    // ******************************************************************
    // Lifecycle Hooks
    // ******************************************************************
    /** For ChangeDetectionStrategy.onPush and ngOnChanges() updates */
    ngDoCheck() {
        this.ngStyleInstance.ngDoCheck();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: StyleDirective, deps: [{ token: i0.ElementRef }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: i2.DomSanitizer }, { token: i0.KeyValueDiffers }, { token: i0.Renderer2 }, { token: i3.NgStyle, optional: true, self: true }, { token: SERVER_TOKEN }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: StyleDirective, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: StyleDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: i2.DomSanitizer }, { type: i0.KeyValueDiffers }, { type: i0.Renderer2 }, { type: i3.NgStyle, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });
const inputs = [
    'ngStyle',
    'ngStyle.xs',
    'ngStyle.sm',
    'ngStyle.md',
    'ngStyle.lg',
    'ngStyle.xl',
    'ngStyle.lt-sm',
    'ngStyle.lt-md',
    'ngStyle.lt-lg',
    'ngStyle.lt-xl',
    'ngStyle.gt-xs',
    'ngStyle.gt-sm',
    'ngStyle.gt-md',
    'ngStyle.gt-lg',
];
const selector = `
  [ngStyle],
  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],
  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],
  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]
`;
/**
 * Directive to add responsive support for ngStyle.
 *
 */
export class DefaultStyleDirective extends StyleDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultStyleDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultStyleDirective, selector: "\n  [ngStyle],\n  [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],\n  [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],\n  [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]\n", inputs: { ngStyle: "ngStyle", "ngStyle.xs": "ngStyle.xs", "ngStyle.sm": "ngStyle.sm", "ngStyle.md": "ngStyle.md", "ngStyle.lg": "ngStyle.lg", "ngStyle.xl": "ngStyle.xl", "ngStyle.lt-sm": "ngStyle.lt-sm", "ngStyle.lt-md": "ngStyle.lt-md", "ngStyle.lt-lg": "ngStyle.lt-lg", "ngStyle.lt-xl": "ngStyle.lt-xl", "ngStyle.gt-xs": "ngStyle.gt-xs", "ngStyle.gt-sm": "ngStyle.gt-sm", "ngStyle.gt-md": "ngStyle.gt-md", "ngStyle.gt-lg": "ngStyle.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultStyleDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
/** Build a styles map from a list of styles, while sanitizing bad values first */
function buildMapFromList(styles, sanitize) {
    const sanitizeValue = (it) => {
        if (sanitize) {
            it.value = sanitize(it.value);
        }
        return it;
    };
    return styles
        .map(stringToKeyValue)
        .filter((entry) => !!entry)
        .map(sanitizeValue)
        .reduce(keyValuesToMap, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2V4dGVuZGVkL3N0eWxlL3N0eWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsU0FBUyxFQUdULE1BQU0sRUFFTixRQUFRLEVBQ1IsV0FBVyxFQUVYLGVBQWUsRUFDZixJQUFJLEdBQ0wsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLGNBQWMsRUFFZCxZQUFZLEdBRWIsTUFBTSw0QkFBNEIsQ0FBQztBQUVwQyxPQUFPLEVBQ0wsZUFBZSxFQUNmLFlBQVksRUFDWixPQUFPLEVBQ1AsY0FBYyxFQU1kLGdCQUFnQixHQUNqQixNQUFNLG9CQUFvQixDQUFDOzs7OztBQUc1QixNQUFNLE9BQU8sY0FBZSxTQUFRLGNBQWM7SUFLaEQsWUFDRSxVQUFzQixFQUN0QixNQUFrQixFQUNsQixPQUF3QixFQUNkLFNBQXVCLEVBQ2pDLE9BQXdCLEVBQ3hCLFNBQW9CLEVBQ2lCLGVBQXdCLEVBQ3ZDLFlBQXFCLEVBQ3RCLFVBQWtCO1FBRXZDLEtBQUssQ0FBQyxVQUFVLEVBQUUsSUFBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQVBoQyxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBR0ksb0JBQWUsR0FBZixlQUFlLENBQVM7UUFYNUMsa0JBQWEsR0FBRyxTQUFTLENBQUM7UUFnQjNDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLGtGQUFrRjtZQUNsRixzRkFBc0Y7WUFDdEYsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3BFO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsMkJBQTJCO0lBQ1IsZUFBZSxDQUFDLEtBQVU7UUFDM0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLE1BQU0sRUFBRSxDQUFDO1FBQ3JFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbEM7UUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCw4QkFBOEI7SUFDWCxXQUFXO1FBQzVCLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDbkQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyxhQUFhLENBQUMsTUFBbUI7UUFDekMseURBQXlEO1FBQ3pELE1BQU0sU0FBUyxHQUFxQixDQUFDLEdBQVEsRUFBRSxFQUFFLENBQy9DLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVELElBQUksTUFBTSxFQUFFO1lBQ1YsUUFBUSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3ZCLEtBQUssUUFBUTtvQkFDWCxPQUFPLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDM0QsS0FBSyxPQUFPO29CQUNWLE9BQU8sZ0JBQWdCLENBQUMsTUFBd0IsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDL0QsS0FBSyxLQUFLO29CQUNSLE9BQU8sZUFBZSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUM7b0JBQ0UsT0FBTyxlQUFlLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzdDO1NBQ0Y7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxxRUFBcUU7SUFDckUsa0JBQWtCO0lBQ2xCLHFFQUFxRTtJQUVyRSxtRUFBbUU7SUFDbkUsU0FBUztRQUNQLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkMsQ0FBQzs4R0E3RVUsY0FBYyw0T0FhZixZQUFZLGFBQ1osV0FBVztrR0FkVixjQUFjOzsyRkFBZCxjQUFjO2tCQUQxQixTQUFTOzswQkFhTCxRQUFROzswQkFBSSxJQUFJOzswQkFDaEIsTUFBTTsyQkFBQyxZQUFZOzswQkFDbkIsTUFBTTsyQkFBQyxXQUFXOztBQWtFdkIsTUFBTSxNQUFNLEdBQUc7SUFDYixTQUFTO0lBQ1QsWUFBWTtJQUNaLFlBQVk7SUFDWixZQUFZO0lBQ1osWUFBWTtJQUNaLFlBQVk7SUFDWixlQUFlO0lBQ2YsZUFBZTtJQUNmLGVBQWU7SUFDZixlQUFlO0lBQ2YsZUFBZTtJQUNmLGVBQWU7SUFDZixlQUFlO0lBQ2YsZUFBZTtDQUNoQixDQUFDO0FBRUYsTUFBTSxRQUFRLEdBQUc7Ozs7O0NBS2hCLENBQUM7QUFFRjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8scUJBQXNCLFNBQVEsY0FBYztJQUR6RDs7UUFFcUIsV0FBTSxHQUFHLE1BQU0sQ0FBQztLQUNwQzs4R0FGWSxxQkFBcUI7a0dBQXJCLHFCQUFxQjs7MkZBQXJCLHFCQUFxQjtrQkFEakMsU0FBUzttQkFBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7O0FBSy9CLGtGQUFrRjtBQUNsRixTQUFTLGdCQUFnQixDQUN2QixNQUFzQixFQUN0QixRQUEyQjtJQUUzQixNQUFNLGFBQWEsR0FBRyxDQUFDLEVBQW1CLEVBQUUsRUFBRTtRQUM1QyxJQUFJLFFBQVEsRUFBRTtZQUNaLEVBQUUsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvQjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQyxDQUFDO0lBRUYsT0FBTyxNQUFNO1NBQ1YsR0FBRyxDQUFDLGdCQUFnQixDQUFDO1NBQ3JCLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUMxQixHQUFHLENBQUMsYUFBYSxDQUFDO1NBQ2xCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBZ0IsQ0FBQyxDQUFDO0FBQzlDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIsIE5nU3R5bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEtleVZhbHVlRGlmZmVycyxcbiAgT3B0aW9uYWwsXG4gIFBMQVRGT1JNX0lELFxuICBSZW5kZXJlcjIsXG4gIFNlY3VyaXR5Q29udGV4dCxcbiAgU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBNZWRpYU1hcnNoYWxsZXIsXG4gIFNFUlZFUl9UT0tFTixcbiAgU3R5bGVVdGlscyxcbn0gZnJvbSAnQG5nYnJhY2tldC9uZ3gtbGF5b3V0L2NvcmUnO1xuXG5pbXBvcnQge1xuICBidWlsZE1hcEZyb21TZXQsXG4gIGJ1aWxkUmF3TGlzdCxcbiAgZ2V0VHlwZSxcbiAga2V5VmFsdWVzVG9NYXAsXG4gIE5nU3R5bGVLZXlWYWx1ZSxcbiAgTmdTdHlsZU1hcCxcbiAgTmdTdHlsZVJhd0xpc3QsXG4gIE5nU3R5bGVTYW5pdGl6ZXIsXG4gIE5nU3R5bGVUeXBlLFxuICBzdHJpbmdUb0tleVZhbHVlLFxufSBmcm9tICcuL3N0eWxlLXRyYW5zZm9ybXMnO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBTdHlsZURpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIGltcGxlbWVudHMgRG9DaGVjayB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBESVJFQ1RJVkVfS0VZID0gJ25nU3R5bGUnO1xuICBwcm90ZWN0ZWQgZmFsbGJhY2tTdHlsZXM6IE5nU3R5bGVNYXA7XG4gIHByb3RlY3RlZCBpc1NlcnZlcjogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHN0eWxlcjogU3R5bGVVdGlscyxcbiAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIsXG4gICAgcHJvdGVjdGVkIHNhbml0aXplcjogRG9tU2FuaXRpemVyLFxuICAgIGRpZmZlcnM6IEtleVZhbHVlRGlmZmVycyxcbiAgICByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIHByaXZhdGUgcmVhZG9ubHkgbmdTdHlsZUluc3RhbmNlOiBOZ1N0eWxlLFxuICAgIEBJbmplY3QoU0VSVkVSX1RPS0VOKSBzZXJ2ZXJMb2FkZWQ6IGJvb2xlYW4sXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0XG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIG51bGwhLCBzdHlsZXIsIG1hcnNoYWwpO1xuICAgIGlmICghdGhpcy5uZ1N0eWxlSW5zdGFuY2UpIHtcbiAgICAgIC8vIENyZWF0ZSBhbiBpbnN0YW5jZSBOZ1N0eWxlIERpcmVjdGl2ZSBpbnN0YW5jZSBvbmx5IGlmIGBuZ1N0eWxlPVwiXCJgIGhhcyBOT1QgYmVlblxuICAgICAgLy8gZGVmaW5lZCBvbiB0aGUgc2FtZSBob3N0IGVsZW1lbnQ7IHNpbmNlIHRoZSByZXNwb25zaXZlIHZhcmlhdGlvbnMgbWF5IGJlIGRlZmluZWQuLi5cbiAgICAgIHRoaXMubmdTdHlsZUluc3RhbmNlID0gbmV3IE5nU3R5bGUoZWxlbWVudFJlZiwgZGlmZmVycywgcmVuZGVyZXIyKTtcbiAgICB9XG4gICAgdGhpcy5pbml0KCk7XG4gICAgY29uc3Qgc3R5bGVzID0gdGhpcy5uYXRpdmVFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3R5bGUnKSA/PyAnJztcbiAgICB0aGlzLmZhbGxiYWNrU3R5bGVzID0gdGhpcy5idWlsZFN0eWxlTWFwKHN0eWxlcyk7XG4gICAgdGhpcy5pc1NlcnZlciA9IHNlcnZlckxvYWRlZCAmJiBpc1BsYXRmb3JtU2VydmVyKHBsYXRmb3JtSWQpO1xuICB9XG5cbiAgLyoqIEFkZCBnZW5lcmF0ZWQgc3R5bGVzICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSB1cGRhdGVXaXRoVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMuYnVpbGRTdHlsZU1hcCh2YWx1ZSk7XG4gICAgdGhpcy5uZ1N0eWxlSW5zdGFuY2UubmdTdHlsZSA9IHsgLi4udGhpcy5mYWxsYmFja1N0eWxlcywgLi4uc3R5bGVzIH07XG4gICAgaWYgKHRoaXMuaXNTZXJ2ZXIpIHtcbiAgICAgIHRoaXMuYXBwbHlTdHlsZVRvRWxlbWVudChzdHlsZXMpO1xuICAgIH1cbiAgICB0aGlzLm5nU3R5bGVJbnN0YW5jZS5uZ0RvQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmUgZ2VuZXJhdGVkIHN0eWxlcyAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgY2xlYXJTdHlsZXMoKSB7XG4gICAgdGhpcy5uZ1N0eWxlSW5zdGFuY2UubmdTdHlsZSA9IHRoaXMuZmFsbGJhY2tTdHlsZXM7XG4gICAgdGhpcy5uZ1N0eWxlSW5zdGFuY2UubmdEb0NoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCByYXcgc3RyaW5ncyB0byBuZ1N0eWxlTWFwOyB3aGljaCBpcyByZXF1aXJlZCBieSBuZ1N0eWxlXG4gICAqIE5PVEU6IFJhdyBzdHJpbmcga2V5LXZhbHVlIHBhaXJzIE1VU1QgYmUgZGVsaW1pdGVkIGJ5IGA7YFxuICAgKiAgICAgICBDb21tYS1kZWxpbWl0ZXJzIGFyZSBub3Qgc3VwcG9ydGVkIGR1ZSB0byBjb21wbGV4aXRpZXMgb2ZcbiAgICogICAgICAgcG9zc2libGUgc3R5bGUgdmFsdWVzIHN1Y2ggYXMgYHJnYmEoeCx4LHgseClgIGFuZCBvdGhlcnNcbiAgICovXG4gIHByb3RlY3RlZCBidWlsZFN0eWxlTWFwKHN0eWxlczogTmdTdHlsZVR5cGUpOiBOZ1N0eWxlTWFwIHtcbiAgICAvLyBBbHdheXMgc2FmZS1ndWFyZCAoYWthIHNhbml0aXplKSBzdHlsZSBwcm9wZXJ0eSB2YWx1ZXNcbiAgICBjb25zdCBzYW5pdGl6ZXI6IE5nU3R5bGVTYW5pdGl6ZXIgPSAodmFsOiBhbnkpID0+XG4gICAgICB0aGlzLnNhbml0aXplci5zYW5pdGl6ZShTZWN1cml0eUNvbnRleHQuU1RZTEUsIHZhbCkgPz8gJyc7XG4gICAgaWYgKHN0eWxlcykge1xuICAgICAgc3dpdGNoIChnZXRUeXBlKHN0eWxlcykpIHtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICByZXR1cm4gYnVpbGRNYXBGcm9tTGlzdChidWlsZFJhd0xpc3Qoc3R5bGVzKSwgc2FuaXRpemVyKTtcbiAgICAgICAgY2FzZSAnYXJyYXknOlxuICAgICAgICAgIHJldHVybiBidWlsZE1hcEZyb21MaXN0KHN0eWxlcyBhcyBOZ1N0eWxlUmF3TGlzdCwgc2FuaXRpemVyKTtcbiAgICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgICByZXR1cm4gYnVpbGRNYXBGcm9tU2V0KHN0eWxlcywgc2FuaXRpemVyKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gYnVpbGRNYXBGcm9tU2V0KHN0eWxlcywgc2FuaXRpemVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gTGlmZWN5Y2xlIEhvb2tzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKiBGb3IgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kub25QdXNoIGFuZCBuZ09uQ2hhbmdlcygpIHVwZGF0ZXMgKi9cbiAgbmdEb0NoZWNrKCkge1xuICAgIHRoaXMubmdTdHlsZUluc3RhbmNlLm5nRG9DaGVjaygpO1xuICB9XG59XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ25nU3R5bGUnLFxuICAnbmdTdHlsZS54cycsXG4gICduZ1N0eWxlLnNtJyxcbiAgJ25nU3R5bGUubWQnLFxuICAnbmdTdHlsZS5sZycsXG4gICduZ1N0eWxlLnhsJyxcbiAgJ25nU3R5bGUubHQtc20nLFxuICAnbmdTdHlsZS5sdC1tZCcsXG4gICduZ1N0eWxlLmx0LWxnJyxcbiAgJ25nU3R5bGUubHQteGwnLFxuICAnbmdTdHlsZS5ndC14cycsXG4gICduZ1N0eWxlLmd0LXNtJyxcbiAgJ25nU3R5bGUuZ3QtbWQnLFxuICAnbmdTdHlsZS5ndC1sZycsXG5dO1xuXG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW25nU3R5bGVdLFxuICBbbmdTdHlsZS54c10sIFtuZ1N0eWxlLnNtXSwgW25nU3R5bGUubWRdLCBbbmdTdHlsZS5sZ10sIFtuZ1N0eWxlLnhsXSxcbiAgW25nU3R5bGUubHQtc21dLCBbbmdTdHlsZS5sdC1tZF0sIFtuZ1N0eWxlLmx0LWxnXSwgW25nU3R5bGUubHQteGxdLFxuICBbbmdTdHlsZS5ndC14c10sIFtuZ1N0eWxlLmd0LXNtXSwgW25nU3R5bGUuZ3QtbWRdLCBbbmdTdHlsZS5ndC1sZ11cbmA7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRvIGFkZCByZXNwb25zaXZlIHN1cHBvcnQgZm9yIG5nU3R5bGUuXG4gKlxuICovXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3IsIGlucHV0cyB9KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRTdHlsZURpcmVjdGl2ZSBleHRlbmRzIFN0eWxlRGlyZWN0aXZlIGltcGxlbWVudHMgRG9DaGVjayB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbnB1dHMgPSBpbnB1dHM7XG59XG5cbi8qKiBCdWlsZCBhIHN0eWxlcyBtYXAgZnJvbSBhIGxpc3Qgb2Ygc3R5bGVzLCB3aGlsZSBzYW5pdGl6aW5nIGJhZCB2YWx1ZXMgZmlyc3QgKi9cbmZ1bmN0aW9uIGJ1aWxkTWFwRnJvbUxpc3QoXG4gIHN0eWxlczogTmdTdHlsZVJhd0xpc3QsXG4gIHNhbml0aXplPzogTmdTdHlsZVNhbml0aXplclxuKTogTmdTdHlsZU1hcCB7XG4gIGNvbnN0IHNhbml0aXplVmFsdWUgPSAoaXQ6IE5nU3R5bGVLZXlWYWx1ZSkgPT4ge1xuICAgIGlmIChzYW5pdGl6ZSkge1xuICAgICAgaXQudmFsdWUgPSBzYW5pdGl6ZShpdC52YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBpdDtcbiAgfTtcblxuICByZXR1cm4gc3R5bGVzXG4gICAgLm1hcChzdHJpbmdUb0tleVZhbHVlKVxuICAgIC5maWx0ZXIoKGVudHJ5KSA9PiAhIWVudHJ5KVxuICAgIC5tYXAoc2FuaXRpemVWYWx1ZSlcbiAgICAucmVkdWNlKGtleVZhbHVlc1RvTWFwLCB7fSBhcyBOZ1N0eWxlTWFwKTtcbn1cbiJdfQ==