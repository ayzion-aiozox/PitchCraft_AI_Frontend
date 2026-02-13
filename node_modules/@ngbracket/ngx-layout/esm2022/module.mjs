/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformServer } from '@angular/common';
import { Inject, NgModule, PLATFORM_ID, } from '@angular/core';
import { BREAKPOINT, DEFAULT_CONFIG, LAYOUT_CONFIG, SERVER_TOKEN, } from '@ngbracket/ngx-layout/core';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { GridModule } from '@ngbracket/ngx-layout/grid';
import * as i0 from "@angular/core";
/**
 * FlexLayoutModule -- the main import for all utilities in the Angular Layout library
 * * Will automatically provide Flex, Grid, and Extended modules for use in the application
 * * Can be configured using the static withConfig method, options viewable on the Wiki's
 *   Configuration page
 */
export class FlexLayoutModule {
    /**
     * Initialize the FlexLayoutModule with a set of config options,
     * which sets the corresponding tokens accordingly
     */
    static withConfig(configOptions, 
    // tslint:disable-next-line:max-line-length
    breakpoints = []) {
        return {
            ngModule: FlexLayoutModule,
            providers: configOptions.serverLoaded
                ? [
                    {
                        provide: LAYOUT_CONFIG,
                        useValue: { ...DEFAULT_CONFIG, ...configOptions },
                    },
                    { provide: BREAKPOINT, useValue: breakpoints, multi: true },
                    { provide: SERVER_TOKEN, useValue: true },
                ]
                : [
                    {
                        provide: LAYOUT_CONFIG,
                        useValue: { ...DEFAULT_CONFIG, ...configOptions },
                    },
                    { provide: BREAKPOINT, useValue: breakpoints, multi: true },
                ],
        };
    }
    constructor(serverModuleLoaded, platformId) {
        if (isPlatformServer(platformId) && !serverModuleLoaded) {
            console.warn('Warning: Flex Layout loaded on the server without FlexLayoutServerModule');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexLayoutModule, deps: [{ token: SERVER_TOKEN }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.0.9", ngImport: i0, type: FlexLayoutModule, imports: [FlexModule, ExtendedModule, GridModule], exports: [FlexModule, ExtendedModule, GridModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexLayoutModule, imports: [FlexModule, ExtendedModule, GridModule, FlexModule, ExtendedModule, GridModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: FlexLayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [FlexModule, ExtendedModule, GridModule],
                    exports: [FlexModule, ExtendedModule, GridModule],
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDbkQsT0FBTyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsV0FBVyxHQUNaLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTCxVQUFVLEVBQ1YsY0FBYyxFQUVkLGFBQWEsRUFDYixZQUFZLEdBQ2IsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDaEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7QUFFeEQ7Ozs7O0dBS0c7QUFLSCxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQ2YsYUFBa0M7SUFDbEMsMkNBQTJDO0lBQzNDLGNBQXlDLEVBQUU7UUFFM0MsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxZQUFZO2dCQUNuQyxDQUFDLENBQUM7b0JBQ0U7d0JBQ0UsT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLFFBQVEsRUFBRSxFQUFFLEdBQUcsY0FBYyxFQUFFLEdBQUcsYUFBYSxFQUFFO3FCQUNsRDtvQkFDRCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO29CQUMzRCxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtpQkFDMUM7Z0JBQ0gsQ0FBQyxDQUFDO29CQUNFO3dCQUNFLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixRQUFRLEVBQUUsRUFBRSxHQUFHLGNBQWMsRUFBRSxHQUFHLGFBQWEsRUFBRTtxQkFDbEQ7b0JBQ0QsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtpQkFDNUQ7U0FDTixDQUFDO0lBQ0osQ0FBQztJQUVELFlBQ3dCLGtCQUEyQixFQUM1QixVQUFrQjtRQUV2QyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDdkQsT0FBTyxDQUFDLElBQUksQ0FDViwwRUFBMEUsQ0FDM0UsQ0FBQztTQUNIO0lBQ0gsQ0FBQzs4R0F4Q1UsZ0JBQWdCLGtCQWdDakIsWUFBWSxhQUNaLFdBQVc7K0dBakNWLGdCQUFnQixZQUhqQixVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVUsYUFDdEMsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVOytHQUVyQyxnQkFBZ0IsWUFIakIsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQ3RDLFVBQVUsRUFBRSxjQUFjLEVBQUUsVUFBVTs7MkZBRXJDLGdCQUFnQjtrQkFKNUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLFVBQVUsQ0FBQztvQkFDakQsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxVQUFVLENBQUM7aUJBQ2xEOzswQkFpQ0ksTUFBTTsyQkFBQyxZQUFZOzswQkFDbkIsTUFBTTsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEluamVjdCxcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbiAgTmdNb2R1bGUsXG4gIFBMQVRGT1JNX0lELFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQnJlYWtQb2ludCxcbiAgQlJFQUtQT0lOVCxcbiAgREVGQVVMVF9DT05GSUcsXG4gIExheW91dENvbmZpZ09wdGlvbnMsXG4gIExBWU9VVF9DT05GSUcsXG4gIFNFUlZFUl9UT0tFTixcbn0gZnJvbSAnQG5nYnJhY2tldC9uZ3gtbGF5b3V0L2NvcmUnO1xuaW1wb3J0IHsgRXh0ZW5kZWRNb2R1bGUgfSBmcm9tICdAbmdicmFja2V0L25neC1sYXlvdXQvZXh0ZW5kZWQnO1xuaW1wb3J0IHsgRmxleE1vZHVsZSB9IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9mbGV4JztcbmltcG9ydCB7IEdyaWRNb2R1bGUgfSBmcm9tICdAbmdicmFja2V0L25neC1sYXlvdXQvZ3JpZCc7XG5cbi8qKlxuICogRmxleExheW91dE1vZHVsZSAtLSB0aGUgbWFpbiBpbXBvcnQgZm9yIGFsbCB1dGlsaXRpZXMgaW4gdGhlIEFuZ3VsYXIgTGF5b3V0IGxpYnJhcnlcbiAqICogV2lsbCBhdXRvbWF0aWNhbGx5IHByb3ZpZGUgRmxleCwgR3JpZCwgYW5kIEV4dGVuZGVkIG1vZHVsZXMgZm9yIHVzZSBpbiB0aGUgYXBwbGljYXRpb25cbiAqICogQ2FuIGJlIGNvbmZpZ3VyZWQgdXNpbmcgdGhlIHN0YXRpYyB3aXRoQ29uZmlnIG1ldGhvZCwgb3B0aW9ucyB2aWV3YWJsZSBvbiB0aGUgV2lraSdzXG4gKiAgIENvbmZpZ3VyYXRpb24gcGFnZVxuICovXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbRmxleE1vZHVsZSwgRXh0ZW5kZWRNb2R1bGUsIEdyaWRNb2R1bGVdLFxuICBleHBvcnRzOiBbRmxleE1vZHVsZSwgRXh0ZW5kZWRNb2R1bGUsIEdyaWRNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBGbGV4TGF5b3V0TW9kdWxlIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIEZsZXhMYXlvdXRNb2R1bGUgd2l0aCBhIHNldCBvZiBjb25maWcgb3B0aW9ucyxcbiAgICogd2hpY2ggc2V0cyB0aGUgY29ycmVzcG9uZGluZyB0b2tlbnMgYWNjb3JkaW5nbHlcbiAgICovXG4gIHN0YXRpYyB3aXRoQ29uZmlnKFxuICAgIGNvbmZpZ09wdGlvbnM6IExheW91dENvbmZpZ09wdGlvbnMsXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgIGJyZWFrcG9pbnRzOiBCcmVha1BvaW50IHwgQnJlYWtQb2ludFtdID0gW11cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxGbGV4TGF5b3V0TW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBGbGV4TGF5b3V0TW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBjb25maWdPcHRpb25zLnNlcnZlckxvYWRlZFxuICAgICAgICA/IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcHJvdmlkZTogTEFZT1VUX0NPTkZJRyxcbiAgICAgICAgICAgICAgdXNlVmFsdWU6IHsgLi4uREVGQVVMVF9DT05GSUcsIC4uLmNvbmZpZ09wdGlvbnMgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IHByb3ZpZGU6IEJSRUFLUE9JTlQsIHVzZVZhbHVlOiBicmVha3BvaW50cywgbXVsdGk6IHRydWUgfSxcbiAgICAgICAgICAgIHsgcHJvdmlkZTogU0VSVkVSX1RPS0VOLCB1c2VWYWx1ZTogdHJ1ZSB9LFxuICAgICAgICAgIF1cbiAgICAgICAgOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHByb3ZpZGU6IExBWU9VVF9DT05GSUcsXG4gICAgICAgICAgICAgIHVzZVZhbHVlOiB7IC4uLkRFRkFVTFRfQ09ORklHLCAuLi5jb25maWdPcHRpb25zIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyBwcm92aWRlOiBCUkVBS1BPSU5ULCB1c2VWYWx1ZTogYnJlYWtwb2ludHMsIG11bHRpOiB0cnVlIH0sXG4gICAgICAgICAgXSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChTRVJWRVJfVE9LRU4pIHNlcnZlck1vZHVsZUxvYWRlZDogYm9vbGVhbixcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBPYmplY3RcbiAgKSB7XG4gICAgaWYgKGlzUGxhdGZvcm1TZXJ2ZXIocGxhdGZvcm1JZCkgJiYgIXNlcnZlck1vZHVsZUxvYWRlZCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnV2FybmluZzogRmxleCBMYXlvdXQgbG9hZGVkIG9uIHRoZSBzZXJ2ZXIgd2l0aG91dCBGbGV4TGF5b3V0U2VydmVyTW9kdWxlJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==