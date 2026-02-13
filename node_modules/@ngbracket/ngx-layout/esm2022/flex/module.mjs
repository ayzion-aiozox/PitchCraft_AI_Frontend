/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BidiModule } from '@angular/cdk/bidi';
import { NgModule } from '@angular/core';
import { CoreModule } from '@ngbracket/ngx-layout/core';
import { DefaultFlexAlignDirective } from './flex-align/flex-align';
import { FlexFillDirective } from './flex-fill/flex-fill';
import { DefaultFlexOffsetDirective } from './flex-offset/flex-offset';
import { DefaultFlexOrderDirective } from './flex-order/flex-order';
import { DefaultFlexDirective } from './flex/flex';
import { DefaultLayoutAlignDirective } from './layout-align/layout-align';
import { DefaultLayoutGapDirective } from './layout-gap/layout-gap';
import { DefaultLayoutDirective } from './layout/layout';
import * as i0 from "@angular/core";
const ALL_DIRECTIVES = [
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    DefaultLayoutAlignDirective,
    DefaultFlexOrderDirective,
    DefaultFlexOffsetDirective,
    FlexFillDirective,
    DefaultFlexAlignDirective,
    DefaultFlexDirective,
];
/**
 * *****************************************************************
 * Define module for the Flex API
 * *****************************************************************
 */
export class FlexModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.9", ngImport: i0, type: FlexModule, declarations: [DefaultLayoutDirective,
            DefaultLayoutGapDirective,
            DefaultLayoutAlignDirective,
            DefaultFlexOrderDirective,
            DefaultFlexOffsetDirective,
            FlexFillDirective,
            DefaultFlexAlignDirective,
            DefaultFlexDirective], imports: [CoreModule, BidiModule], exports: [DefaultLayoutDirective,
            DefaultLayoutGapDirective,
            DefaultLayoutAlignDirective,
            DefaultFlexOrderDirective,
            DefaultFlexOffsetDirective,
            FlexFillDirective,
            DefaultFlexAlignDirective,
            DefaultFlexDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexModule, imports: [CoreModule, BidiModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule, BidiModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9mbGV4L21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFeEQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdkUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ25ELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDOztBQUV6RCxNQUFNLGNBQWMsR0FBRztJQUNyQixzQkFBc0I7SUFDdEIseUJBQXlCO0lBQ3pCLDJCQUEyQjtJQUMzQix5QkFBeUI7SUFDekIsMEJBQTBCO0lBQzFCLGlCQUFpQjtJQUNqQix5QkFBeUI7SUFDekIsb0JBQW9CO0NBQ3JCLENBQUM7QUFFRjs7OztHQUlHO0FBT0gsTUFBTSxPQUFPLFVBQVU7OEdBQVYsVUFBVTsrR0FBVixVQUFVLGlCQXJCckIsc0JBQXNCO1lBQ3RCLHlCQUF5QjtZQUN6QiwyQkFBMkI7WUFDM0IseUJBQXlCO1lBQ3pCLDBCQUEwQjtZQUMxQixpQkFBaUI7WUFDakIseUJBQXlCO1lBQ3pCLG9CQUFvQixhQVVWLFVBQVUsRUFBRSxVQUFVLGFBakJoQyxzQkFBc0I7WUFDdEIseUJBQXlCO1lBQ3pCLDJCQUEyQjtZQUMzQix5QkFBeUI7WUFDekIsMEJBQTBCO1lBQzFCLGlCQUFpQjtZQUNqQix5QkFBeUI7WUFDekIsb0JBQW9COytHQWNULFVBQVUsWUFKWCxVQUFVLEVBQUUsVUFBVTs7MkZBSXJCLFVBQVU7a0JBTHRCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztvQkFDakMsWUFBWSxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUM7b0JBQ2pDLE9BQU8sRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDO2lCQUM3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgQmlkaU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb3JlTW9kdWxlIH0gZnJvbSAnQG5nYnJhY2tldC9uZ3gtbGF5b3V0L2NvcmUnO1xuXG5pbXBvcnQgeyBEZWZhdWx0RmxleEFsaWduRGlyZWN0aXZlIH0gZnJvbSAnLi9mbGV4LWFsaWduL2ZsZXgtYWxpZ24nO1xuaW1wb3J0IHsgRmxleEZpbGxEaXJlY3RpdmUgfSBmcm9tICcuL2ZsZXgtZmlsbC9mbGV4LWZpbGwnO1xuaW1wb3J0IHsgRGVmYXVsdEZsZXhPZmZzZXREaXJlY3RpdmUgfSBmcm9tICcuL2ZsZXgtb2Zmc2V0L2ZsZXgtb2Zmc2V0JztcbmltcG9ydCB7IERlZmF1bHRGbGV4T3JkZXJEaXJlY3RpdmUgfSBmcm9tICcuL2ZsZXgtb3JkZXIvZmxleC1vcmRlcic7XG5pbXBvcnQgeyBEZWZhdWx0RmxleERpcmVjdGl2ZSB9IGZyb20gJy4vZmxleC9mbGV4JztcbmltcG9ydCB7IERlZmF1bHRMYXlvdXRBbGlnbkRpcmVjdGl2ZSB9IGZyb20gJy4vbGF5b3V0LWFsaWduL2xheW91dC1hbGlnbic7XG5pbXBvcnQgeyBEZWZhdWx0TGF5b3V0R2FwRGlyZWN0aXZlIH0gZnJvbSAnLi9sYXlvdXQtZ2FwL2xheW91dC1nYXAnO1xuaW1wb3J0IHsgRGVmYXVsdExheW91dERpcmVjdGl2ZSB9IGZyb20gJy4vbGF5b3V0L2xheW91dCc7XG5cbmNvbnN0IEFMTF9ESVJFQ1RJVkVTID0gW1xuICBEZWZhdWx0TGF5b3V0RGlyZWN0aXZlLFxuICBEZWZhdWx0TGF5b3V0R2FwRGlyZWN0aXZlLFxuICBEZWZhdWx0TGF5b3V0QWxpZ25EaXJlY3RpdmUsXG4gIERlZmF1bHRGbGV4T3JkZXJEaXJlY3RpdmUsXG4gIERlZmF1bHRGbGV4T2Zmc2V0RGlyZWN0aXZlLFxuICBGbGV4RmlsbERpcmVjdGl2ZSxcbiAgRGVmYXVsdEZsZXhBbGlnbkRpcmVjdGl2ZSxcbiAgRGVmYXVsdEZsZXhEaXJlY3RpdmUsXG5dO1xuXG4vKipcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBEZWZpbmUgbW9kdWxlIGZvciB0aGUgRmxleCBBUElcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKi9cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvcmVNb2R1bGUsIEJpZGlNb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFsuLi5BTExfRElSRUNUSVZFU10sXG4gIGV4cG9ydHM6IFsuLi5BTExfRElSRUNUSVZFU10sXG59KVxuZXhwb3J0IGNsYXNzIEZsZXhNb2R1bGUge31cbiJdfQ==