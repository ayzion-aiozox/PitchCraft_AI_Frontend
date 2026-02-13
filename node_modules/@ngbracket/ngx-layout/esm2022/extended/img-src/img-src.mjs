/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformServer } from '@angular/common';
import { Directive, Inject, Injectable, Input, PLATFORM_ID, } from '@angular/core';
import { BaseDirective2, SERVER_TOKEN, StyleBuilder, } from '@ngbracket/ngx-layout/core';
import * as i0 from "@angular/core";
import * as i1 from "@ngbracket/ngx-layout/core";
export class ImgSrcStyleBuilder extends StyleBuilder {
    buildStyles(url) {
        return { content: url ? `url(${url})` : '' };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ImgSrcStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ImgSrcStyleBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ImgSrcStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class ImgSrcDirective extends BaseDirective2 {
    set src(val) {
        this.defaultSrc = val;
        this.setValue(this.defaultSrc, '');
    }
    constructor(elementRef, styleBuilder, styler, marshal, platformId, serverModuleLoaded) {
        super(elementRef, styleBuilder, styler, marshal);
        this.platformId = platformId;
        this.serverModuleLoaded = serverModuleLoaded;
        this.DIRECTIVE_KEY = 'img-src';
        this.defaultSrc = '';
        this.styleCache = imgSrcCache;
        this.init();
        this.setValue(this.nativeElement.getAttribute('src') || '', '');
        if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.nativeElement.setAttribute('src', '');
        }
    }
    /**
     * Use the [responsively] activated input value to update
     * the host img src attribute or assign a default `img.src=''`
     * if the src has not been defined.
     *
     * Do nothing to standard `<img src="">` usages, only when responsive
     * keys are present do we actually call `setAttribute()`
     */
    updateWithValue(value) {
        const url = value || this.defaultSrc;
        if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
            this.addStyles(url);
        }
        else {
            this.nativeElement.setAttribute('src', url);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ImgSrcDirective, deps: [{ token: i0.ElementRef }, { token: ImgSrcStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: PLATFORM_ID }, { token: SERVER_TOKEN }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: ImgSrcDirective, inputs: { src: "src" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ImgSrcDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: ImgSrcStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }], propDecorators: { src: [{
                type: Input,
                args: ['src']
            }] } });
const imgSrcCache = new Map();
const inputs = [
    'src.xs',
    'src.sm',
    'src.md',
    'src.lg',
    'src.xl',
    'src.lt-sm',
    'src.lt-md',
    'src.lt-lg',
    'src.lt-xl',
    'src.gt-xs',
    'src.gt-sm',
    'src.gt-md',
    'src.gt-lg',
];
const selector = `
  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],
  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],
  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]
`;
/**
 * This directive provides a responsive API for the HTML <img> 'src' attribute
 * and will update the img.src property upon each responsive activation.
 *
 * e.g.
 *      <img src="defaultScene.jpg" src.xs="mobileScene.jpg"></img>
 *
 * @see https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-src/
 */
export class DefaultImgSrcDirective extends ImgSrcDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultImgSrcDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultImgSrcDirective, selector: "\n  img[src.xs],    img[src.sm],    img[src.md],    img[src.lg],   img[src.xl],\n  img[src.lt-sm], img[src.lt-md], img[src.lt-lg], img[src.lt-xl],\n  img[src.gt-xs], img[src.gt-sm], img[src.gt-md], img[src.gt-lg]\n", inputs: { "src.xs": "src.xs", "src.sm": "src.sm", "src.md": "src.md", "src.lg": "src.lg", "src.xl": "src.xl", "src.lt-sm": "src.lt-sm", "src.lt-md": "src.lt-md", "src.lt-lg": "src.lt-lg", "src.lt-xl": "src.lt-xl", "src.gt-xs": "src.gt-xs", "src.gt-sm": "src.gt-sm", "src.gt-md": "src.gt-md", "src.gt-lg": "src.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultImgSrcDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1nLXNyYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvZXh0ZW5kZWQvaW1nLXNyYy9pbWctc3JjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sRUFDTCxTQUFTLEVBRVQsTUFBTSxFQUNOLFVBQVUsRUFDVixLQUFLLEVBQ0wsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxjQUFjLEVBRWQsWUFBWSxFQUNaLFlBQVksR0FHYixNQUFNLDRCQUE0QixDQUFDOzs7QUFHcEMsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFlBQVk7SUFDbEQsV0FBVyxDQUFDLEdBQVc7UUFDckIsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQy9DLENBQUM7OEdBSFUsa0JBQWtCO2tIQUFsQixrQkFBa0IsY0FETCxNQUFNOzsyRkFDbkIsa0JBQWtCO2tCQUQ5QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7QUFRbEMsTUFBTSxPQUFPLGVBQWdCLFNBQVEsY0FBYztJQUlqRCxJQUNJLEdBQUcsQ0FBQyxHQUFXO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsWUFDRSxVQUFzQixFQUN0QixZQUFnQyxFQUNoQyxNQUFrQixFQUNsQixPQUF3QixFQUNPLFVBQWtCLEVBQ2pCLGtCQUEyQjtRQUUzRCxLQUFLLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFIbEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNqQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQVM7UUFmMUMsa0JBQWEsR0FBRyxTQUFTLENBQUM7UUFDbkMsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQXlDUCxlQUFVLEdBQUcsV0FBVyxDQUFDO1FBeEIxQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoRSxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDaEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDZ0IsZUFBZSxDQUFDLEtBQWM7UUFDL0MsTUFBTSxHQUFHLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ2hFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckI7YUFBTTtZQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7OEdBekNVLGVBQWUsb0lBZWhCLFdBQVcsYUFDWCxZQUFZO2tHQWhCWCxlQUFlOzsyRkFBZixlQUFlO2tCQUQzQixTQUFTOzswQkFnQkwsTUFBTTsyQkFBQyxXQUFXOzswQkFDbEIsTUFBTTsyQkFBQyxZQUFZO3lDQVhsQixHQUFHO3NCQUROLEtBQUs7dUJBQUMsS0FBSzs7QUEwQ2QsTUFBTSxXQUFXLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7QUFFNUQsTUFBTSxNQUFNLEdBQUc7SUFDYixRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLFdBQVc7SUFDWCxXQUFXO0lBQ1gsV0FBVztJQUNYLFdBQVc7SUFDWCxXQUFXO0lBQ1gsV0FBVztJQUNYLFdBQVc7SUFDWCxXQUFXO0NBQ1osQ0FBQztBQUVGLE1BQU0sUUFBUSxHQUFHOzs7O0NBSWhCLENBQUM7QUFFRjs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxlQUFlO0lBRDNEOztRQUVxQixXQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3BDOzhHQUZZLHNCQUFzQjtrR0FBdEIsc0JBQXNCOzsyRkFBdEIsc0JBQXNCO2tCQURsQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgSW5wdXQsXG4gIFBMQVRGT1JNX0lELFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIEJhc2VEaXJlY3RpdmUyLFxuICBNZWRpYU1hcnNoYWxsZXIsXG4gIFNFUlZFUl9UT0tFTixcbiAgU3R5bGVCdWlsZGVyLFxuICBTdHlsZURlZmluaXRpb24sXG4gIFN0eWxlVXRpbHMsXG59IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9jb3JlJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBJbWdTcmNTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBidWlsZFN0eWxlcyh1cmw6IHN0cmluZykge1xuICAgIHJldHVybiB7IGNvbnRlbnQ6IHVybCA/IGB1cmwoJHt1cmx9KWAgOiAnJyB9O1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEltZ1NyY0RpcmVjdGl2ZSBleHRlbmRzIEJhc2VEaXJlY3RpdmUyIHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIERJUkVDVElWRV9LRVkgPSAnaW1nLXNyYyc7XG4gIHByb3RlY3RlZCBkZWZhdWx0U3JjID0gJyc7XG5cbiAgQElucHV0KCdzcmMnKVxuICBzZXQgc3JjKHZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5kZWZhdWx0U3JjID0gdmFsO1xuICAgIHRoaXMuc2V0VmFsdWUodGhpcy5kZWZhdWx0U3JjLCAnJyk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHN0eWxlQnVpbGRlcjogSW1nU3JjU3R5bGVCdWlsZGVyLFxuICAgIHN0eWxlcjogU3R5bGVVdGlscyxcbiAgICBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJvdGVjdGVkIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICBASW5qZWN0KFNFUlZFUl9UT0tFTikgcHJvdGVjdGVkIHNlcnZlck1vZHVsZUxvYWRlZDogYm9vbGVhblxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gICAgdGhpcy5pbml0KCk7XG4gICAgdGhpcy5zZXRWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdzcmMnKSB8fCAnJywgJycpO1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkgJiYgdGhpcy5zZXJ2ZXJNb2R1bGVMb2FkZWQpIHtcbiAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsICcnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoZSBbcmVzcG9uc2l2ZWx5XSBhY3RpdmF0ZWQgaW5wdXQgdmFsdWUgdG8gdXBkYXRlXG4gICAqIHRoZSBob3N0IGltZyBzcmMgYXR0cmlidXRlIG9yIGFzc2lnbiBhIGRlZmF1bHQgYGltZy5zcmM9JydgXG4gICAqIGlmIHRoZSBzcmMgaGFzIG5vdCBiZWVuIGRlZmluZWQuXG4gICAqXG4gICAqIERvIG5vdGhpbmcgdG8gc3RhbmRhcmQgYDxpbWcgc3JjPVwiXCI+YCB1c2FnZXMsIG9ubHkgd2hlbiByZXNwb25zaXZlXG4gICAqIGtleXMgYXJlIHByZXNlbnQgZG8gd2UgYWN0dWFsbHkgY2FsbCBgc2V0QXR0cmlidXRlKClgXG4gICAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgdXBkYXRlV2l0aFZhbHVlKHZhbHVlPzogc3RyaW5nKSB7XG4gICAgY29uc3QgdXJsID0gdmFsdWUgfHwgdGhpcy5kZWZhdWx0U3JjO1xuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkgJiYgdGhpcy5zZXJ2ZXJNb2R1bGVMb2FkZWQpIHtcbiAgICAgIHRoaXMuYWRkU3R5bGVzKHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHN0eWxlQ2FjaGUgPSBpbWdTcmNDYWNoZTtcbn1cblxuY29uc3QgaW1nU3JjQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbmNvbnN0IGlucHV0cyA9IFtcbiAgJ3NyYy54cycsXG4gICdzcmMuc20nLFxuICAnc3JjLm1kJyxcbiAgJ3NyYy5sZycsXG4gICdzcmMueGwnLFxuICAnc3JjLmx0LXNtJyxcbiAgJ3NyYy5sdC1tZCcsXG4gICdzcmMubHQtbGcnLFxuICAnc3JjLmx0LXhsJyxcbiAgJ3NyYy5ndC14cycsXG4gICdzcmMuZ3Qtc20nLFxuICAnc3JjLmd0LW1kJyxcbiAgJ3NyYy5ndC1sZycsXG5dO1xuXG5jb25zdCBzZWxlY3RvciA9IGBcbiAgaW1nW3NyYy54c10sICAgIGltZ1tzcmMuc21dLCAgICBpbWdbc3JjLm1kXSwgICAgaW1nW3NyYy5sZ10sICAgaW1nW3NyYy54bF0sXG4gIGltZ1tzcmMubHQtc21dLCBpbWdbc3JjLmx0LW1kXSwgaW1nW3NyYy5sdC1sZ10sIGltZ1tzcmMubHQteGxdLFxuICBpbWdbc3JjLmd0LXhzXSwgaW1nW3NyYy5ndC1zbV0sIGltZ1tzcmMuZ3QtbWRdLCBpbWdbc3JjLmd0LWxnXVxuYDtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBwcm92aWRlcyBhIHJlc3BvbnNpdmUgQVBJIGZvciB0aGUgSFRNTCA8aW1nPiAnc3JjJyBhdHRyaWJ1dGVcbiAqIGFuZCB3aWxsIHVwZGF0ZSB0aGUgaW1nLnNyYyBwcm9wZXJ0eSB1cG9uIGVhY2ggcmVzcG9uc2l2ZSBhY3RpdmF0aW9uLlxuICpcbiAqIGUuZy5cbiAqICAgICAgPGltZyBzcmM9XCJkZWZhdWx0U2NlbmUuanBnXCIgc3JjLnhzPVwibW9iaWxlU2NlbmUuanBnXCI+PC9pbWc+XG4gKlxuICogQHNlZSBodHRwczovL2Nzcy10cmlja3MuY29tL3Jlc3BvbnNpdmUtaW1hZ2VzLXlvdXJlLWp1c3QtY2hhbmdpbmctcmVzb2x1dGlvbnMtdXNlLXNyYy9cbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yLCBpbnB1dHMgfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0SW1nU3JjRGlyZWN0aXZlIGV4dGVuZHMgSW1nU3JjRGlyZWN0aXZlIHtcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIGlucHV0cyA9IGlucHV0cztcbn1cbiJdfQ==