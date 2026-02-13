/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CoreModule } from '@ngbracket/ngx-layout/core';
import { DefaultGridAlignColumnsDirective } from './align-columns/align-columns';
import { DefaultGridAlignRowsDirective } from './align-rows/align-rows';
import { DefaultGridAreaDirective } from './area/area';
import { DefaultGridAreasDirective } from './areas/areas';
import { DefaultGridAutoDirective } from './auto/auto';
import { DefaultGridColumnDirective } from './column/column';
import { DefaultGridColumnsDirective } from './columns/columns';
import { DefaultGridGapDirective } from './gap/gap';
import { DefaultGridAlignDirective } from './grid-align/grid-align';
import { DefaultGridRowDirective } from './row/row';
import { DefaultGridRowsDirective } from './rows/rows';
import * as i0 from "@angular/core";
const ALL_DIRECTIVES = [
    DefaultGridAlignDirective,
    DefaultGridAlignColumnsDirective,
    DefaultGridAlignRowsDirective,
    DefaultGridAreaDirective,
    DefaultGridAreasDirective,
    DefaultGridAutoDirective,
    DefaultGridColumnDirective,
    DefaultGridColumnsDirective,
    DefaultGridGapDirective,
    DefaultGridRowDirective,
    DefaultGridRowsDirective,
];
/**
 * *****************************************************************
 * Define module for the CSS Grid API
 * *****************************************************************
 */
export class GridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.9", ngImport: i0, type: GridModule, declarations: [DefaultGridAlignDirective,
            DefaultGridAlignColumnsDirective,
            DefaultGridAlignRowsDirective,
            DefaultGridAreaDirective,
            DefaultGridAreasDirective,
            DefaultGridAutoDirective,
            DefaultGridColumnDirective,
            DefaultGridColumnsDirective,
            DefaultGridGapDirective,
            DefaultGridRowDirective,
            DefaultGridRowsDirective], imports: [CoreModule], exports: [DefaultGridAlignDirective,
            DefaultGridAlignColumnsDirective,
            DefaultGridAlignRowsDirective,
            DefaultGridAreaDirective,
            DefaultGridAreasDirective,
            DefaultGridAutoDirective,
            DefaultGridColumnDirective,
            DefaultGridColumnsDirective,
            DefaultGridGapDirective,
            DefaultGridRowDirective,
            DefaultGridRowsDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridModule, imports: [CoreModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: GridModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CoreModule],
                    declarations: [...ALL_DIRECTIVES],
                    exports: [...ALL_DIRECTIVES],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9ncmlkL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNqRixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDdkQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN2RCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDcEQsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3BELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7QUFFdkQsTUFBTSxjQUFjLEdBQUc7SUFDckIseUJBQXlCO0lBQ3pCLGdDQUFnQztJQUNoQyw2QkFBNkI7SUFDN0Isd0JBQXdCO0lBQ3hCLHlCQUF5QjtJQUN6Qix3QkFBd0I7SUFDeEIsMEJBQTBCO0lBQzFCLDJCQUEyQjtJQUMzQix1QkFBdUI7SUFDdkIsdUJBQXVCO0lBQ3ZCLHdCQUF3QjtDQUN6QixDQUFDO0FBRUY7Ozs7R0FJRztBQU9ILE1BQU0sT0FBTyxVQUFVOzhHQUFWLFVBQVU7K0dBQVYsVUFBVSxpQkF4QnJCLHlCQUF5QjtZQUN6QixnQ0FBZ0M7WUFDaEMsNkJBQTZCO1lBQzdCLHdCQUF3QjtZQUN4Qix5QkFBeUI7WUFDekIsd0JBQXdCO1lBQ3hCLDBCQUEwQjtZQUMxQiwyQkFBMkI7WUFDM0IsdUJBQXVCO1lBQ3ZCLHVCQUF1QjtZQUN2Qix3QkFBd0IsYUFVZCxVQUFVLGFBcEJwQix5QkFBeUI7WUFDekIsZ0NBQWdDO1lBQ2hDLDZCQUE2QjtZQUM3Qix3QkFBd0I7WUFDeEIseUJBQXlCO1lBQ3pCLHdCQUF3QjtZQUN4QiwwQkFBMEI7WUFDMUIsMkJBQTJCO1lBQzNCLHVCQUF1QjtZQUN2Qix1QkFBdUI7WUFDdkIsd0JBQXdCOytHQWNiLFVBQVUsWUFKWCxVQUFVOzsyRkFJVCxVQUFVO2tCQUx0QixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztvQkFDckIsWUFBWSxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUM7b0JBQ2pDLE9BQU8sRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDO2lCQUM3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvcmVNb2R1bGUgfSBmcm9tICdAbmdicmFja2V0L25neC1sYXlvdXQvY29yZSc7XG5cbmltcG9ydCB7IERlZmF1bHRHcmlkQWxpZ25Db2x1bW5zRGlyZWN0aXZlIH0gZnJvbSAnLi9hbGlnbi1jb2x1bW5zL2FsaWduLWNvbHVtbnMnO1xuaW1wb3J0IHsgRGVmYXVsdEdyaWRBbGlnblJvd3NEaXJlY3RpdmUgfSBmcm9tICcuL2FsaWduLXJvd3MvYWxpZ24tcm93cyc7XG5pbXBvcnQgeyBEZWZhdWx0R3JpZEFyZWFEaXJlY3RpdmUgfSBmcm9tICcuL2FyZWEvYXJlYSc7XG5pbXBvcnQgeyBEZWZhdWx0R3JpZEFyZWFzRGlyZWN0aXZlIH0gZnJvbSAnLi9hcmVhcy9hcmVhcyc7XG5pbXBvcnQgeyBEZWZhdWx0R3JpZEF1dG9EaXJlY3RpdmUgfSBmcm9tICcuL2F1dG8vYXV0byc7XG5pbXBvcnQgeyBEZWZhdWx0R3JpZENvbHVtbkRpcmVjdGl2ZSB9IGZyb20gJy4vY29sdW1uL2NvbHVtbic7XG5pbXBvcnQgeyBEZWZhdWx0R3JpZENvbHVtbnNEaXJlY3RpdmUgfSBmcm9tICcuL2NvbHVtbnMvY29sdW1ucyc7XG5pbXBvcnQgeyBEZWZhdWx0R3JpZEdhcERpcmVjdGl2ZSB9IGZyb20gJy4vZ2FwL2dhcCc7XG5pbXBvcnQgeyBEZWZhdWx0R3JpZEFsaWduRGlyZWN0aXZlIH0gZnJvbSAnLi9ncmlkLWFsaWduL2dyaWQtYWxpZ24nO1xuaW1wb3J0IHsgRGVmYXVsdEdyaWRSb3dEaXJlY3RpdmUgfSBmcm9tICcuL3Jvdy9yb3cnO1xuaW1wb3J0IHsgRGVmYXVsdEdyaWRSb3dzRGlyZWN0aXZlIH0gZnJvbSAnLi9yb3dzL3Jvd3MnO1xuXG5jb25zdCBBTExfRElSRUNUSVZFUyA9IFtcbiAgRGVmYXVsdEdyaWRBbGlnbkRpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRBbGlnbkNvbHVtbnNEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQWxpZ25Sb3dzRGlyZWN0aXZlLFxuICBEZWZhdWx0R3JpZEFyZWFEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQXJlYXNEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQXV0b0RpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRDb2x1bW5EaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkQ29sdW1uc0RpcmVjdGl2ZSxcbiAgRGVmYXVsdEdyaWRHYXBEaXJlY3RpdmUsXG4gIERlZmF1bHRHcmlkUm93RGlyZWN0aXZlLFxuICBEZWZhdWx0R3JpZFJvd3NEaXJlY3RpdmUsXG5dO1xuXG4vKipcbiAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBEZWZpbmUgbW9kdWxlIGZvciB0aGUgQ1NTIEdyaWQgQVBJXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICovXG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb3JlTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbLi4uQUxMX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbLi4uQUxMX0RJUkVDVElWRVNdLFxufSlcbmV4cG9ydCBjbGFzcyBHcmlkTW9kdWxlIHt9XG4iXX0=