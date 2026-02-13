/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { isPlatformServer } from '@angular/common';
import { Directive, Inject, Injectable, PLATFORM_ID, } from '@angular/core';
import { BaseDirective2, LAYOUT_CONFIG, SERVER_TOKEN, StyleBuilder, } from '@ngbracket/ngx-layout/core';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@ngbracket/ngx-layout/core";
export class ShowHideStyleBuilder extends StyleBuilder {
    buildStyles(show, parent) {
        const shouldShow = show === 'true';
        return {
            display: shouldShow
                ? parent.display || (parent.isServer ? 'initial' : '')
                : 'none',
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ShowHideStyleBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ShowHideStyleBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ShowHideStyleBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
export class ShowHideDirective extends BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal, layoutConfig, platformId, serverModuleLoaded) {
        super(elementRef, styleBuilder, styler, marshal);
        this.layoutConfig = layoutConfig;
        this.platformId = platformId;
        this.serverModuleLoaded = serverModuleLoaded;
        this.DIRECTIVE_KEY = 'show-hide';
        /** Original DOM Element CSS display style */
        this.display = '';
        this.hasLayout = false;
        this.hasFlexChild = false;
    }
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    ngAfterViewInit() {
        this.trackExtraTriggers();
        const children = Array.from(this.nativeElement.children);
        for (let i = 0; i < children.length; i++) {
            if (this.marshal.hasValue(children[i], 'flex')) {
                this.hasFlexChild = true;
                break;
            }
        }
        if (DISPLAY_MAP.has(this.nativeElement)) {
            this.display = DISPLAY_MAP.get(this.nativeElement);
        }
        else {
            this.display = this.getDisplayStyle();
            DISPLAY_MAP.set(this.nativeElement, this.display);
        }
        this.init();
        // set the default to show unless explicitly overridden
        const defaultValue = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY, '');
        if (defaultValue === undefined || defaultValue === '') {
            this.setValue(true, '');
        }
        else {
            this.triggerUpdate();
        }
    }
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes) {
        Object.keys(changes).forEach((key) => {
            if (this.inputs.indexOf(key) !== -1) {
                const inputKey = key.split('.');
                const bp = inputKey.slice(1).join('.');
                const inputValue = changes[key].currentValue;
                let shouldShow = inputValue !== ''
                    ? inputValue !== 0
                        ? coerceBooleanProperty(inputValue)
                        : false
                    : true;
                if (inputKey[0] === 'fxHide') {
                    shouldShow = !shouldShow;
                }
                this.setValue(shouldShow, bp);
            }
        });
    }
    // *********************************************
    // Protected methods
    // *********************************************
    /**
     *  Watch for these extra triggers to update fxShow, fxHide stylings
     */
    trackExtraTriggers() {
        this.hasLayout = this.marshal.hasValue(this.nativeElement, 'layout');
        ['layout', 'layout-align'].forEach((key) => {
            this.marshal
                .trackValue(this.nativeElement, key)
                .pipe(takeUntil(this.destroySubject))
                .subscribe(this.triggerUpdate.bind(this));
        });
    }
    /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly specified inline or in a CSS stylesheet.
     */
    getDisplayStyle() {
        return this.hasLayout ||
            (this.hasFlexChild && this.layoutConfig.addFlexToParent)
            ? 'flex'
            : this.styler.lookupStyle(this.nativeElement, 'display', true);
    }
    /** Validate the visibility value and then update the host's inline display style */
    updateWithValue(value = true) {
        if (value === '') {
            return;
        }
        const isServer = isPlatformServer(this.platformId);
        this.addStyles(value ? 'true' : 'false', {
            display: this.display,
            isServer,
        });
        if (isServer && this.serverModuleLoaded) {
            this.nativeElement.style.setProperty('display', '');
        }
        this.marshal.triggerUpdate(this.parentElement, 'layout-gap');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ShowHideDirective, deps: [{ token: i0.ElementRef }, { token: ShowHideStyleBuilder }, { token: i1.StyleUtils }, { token: i1.MediaMarshaller }, { token: LAYOUT_CONFIG }, { token: PLATFORM_ID }, { token: SERVER_TOKEN }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: ShowHideDirective, usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: ShowHideDirective, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: ShowHideStyleBuilder }, { type: i1.StyleUtils }, { type: i1.MediaMarshaller }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }] });
const DISPLAY_MAP = new WeakMap();
const inputs = [
    'fxShow',
    'fxShow.print',
    'fxShow.xs',
    'fxShow.sm',
    'fxShow.md',
    'fxShow.lg',
    'fxShow.xl',
    'fxShow.lt-sm',
    'fxShow.lt-md',
    'fxShow.lt-lg',
    'fxShow.lt-xl',
    'fxShow.gt-xs',
    'fxShow.gt-sm',
    'fxShow.gt-md',
    'fxShow.gt-lg',
    'fxHide',
    'fxHide.print',
    'fxHide.xs',
    'fxHide.sm',
    'fxHide.md',
    'fxHide.lg',
    'fxHide.xl',
    'fxHide.lt-sm',
    'fxHide.lt-md',
    'fxHide.lt-lg',
    'fxHide.lt-xl',
    'fxHide.gt-xs',
    'fxHide.gt-sm',
    'fxHide.gt-md',
    'fxHide.gt-lg',
];
const selector = `
  [fxShow], [fxShow.print],
  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],
  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],
  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],
  [fxHide], [fxHide.print],
  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],
  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],
  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]
`;
/**
 * 'show' Layout API directive
 */
export class DefaultShowHideDirective extends ShowHideDirective {
    constructor() {
        super(...arguments);
        this.inputs = inputs;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultShowHideDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.9", type: DefaultShowHideDirective, selector: "\n  [fxShow], [fxShow.print],\n  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],\n  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],\n  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],\n  [fxHide], [fxHide.print],\n  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],\n  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],\n  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]\n", inputs: { fxShow: "fxShow", "fxShow.print": "fxShow.print", "fxShow.xs": "fxShow.xs", "fxShow.sm": "fxShow.sm", "fxShow.md": "fxShow.md", "fxShow.lg": "fxShow.lg", "fxShow.xl": "fxShow.xl", "fxShow.lt-sm": "fxShow.lt-sm", "fxShow.lt-md": "fxShow.lt-md", "fxShow.lt-lg": "fxShow.lt-lg", "fxShow.lt-xl": "fxShow.lt-xl", "fxShow.gt-xs": "fxShow.gt-xs", "fxShow.gt-sm": "fxShow.gt-sm", "fxShow.gt-md": "fxShow.gt-md", "fxShow.gt-lg": "fxShow.gt-lg", fxHide: "fxHide", "fxHide.print": "fxHide.print", "fxHide.xs": "fxHide.xs", "fxHide.sm": "fxHide.sm", "fxHide.md": "fxHide.md", "fxHide.lg": "fxHide.lg", "fxHide.xl": "fxHide.xl", "fxHide.lt-sm": "fxHide.lt-sm", "fxHide.lt-md": "fxHide.lt-md", "fxHide.lt-lg": "fxHide.lt-lg", "fxHide.lt-xl": "fxHide.lt-xl", "fxHide.gt-xs": "fxHide.gt-xs", "fxHide.gt-sm": "fxHide.gt-sm", "fxHide.gt-md": "fxHide.gt-md", "fxHide.gt-lg": "fxHide.gt-lg" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: DefaultShowHideDirective, decorators: [{
            type: Directive,
            args: [{ selector, inputs }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvdy1oaWRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9leHRlbmRlZC9zaG93LWhpZGUvc2hvdy1oaWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzlELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ25ELE9BQU8sRUFFTCxTQUFTLEVBRVQsTUFBTSxFQUNOLFVBQVUsRUFFVixXQUFXLEdBRVosTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLGNBQWMsRUFFZCxhQUFhLEVBRWIsWUFBWSxFQUNaLFlBQVksR0FFYixNQUFNLDRCQUE0QixDQUFDO0FBQ3BDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBUTNDLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxZQUFZO0lBQ3BELFdBQVcsQ0FBQyxJQUFZLEVBQUUsTUFBc0I7UUFDOUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLE1BQU0sQ0FBQztRQUNuQyxPQUFPO1lBQ0wsT0FBTyxFQUFFLFVBQVU7Z0JBQ2pCLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ3RELENBQUMsQ0FBQyxNQUFNO1NBQ1gsQ0FBQztJQUNKLENBQUM7OEdBUlUsb0JBQW9CO2tIQUFwQixvQkFBb0IsY0FEUCxNQUFNOzsyRkFDbkIsb0JBQW9CO2tCQURoQyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7QUFhbEMsTUFBTSxPQUFPLGlCQUNYLFNBQVEsY0FBYztJQVV0QixZQUNFLFVBQXNCLEVBQ3RCLFlBQWtDLEVBQ2xDLE1BQWtCLEVBQ2xCLE9BQXdCLEVBQ1MsWUFBaUMsRUFDbkMsVUFBa0IsRUFDakIsa0JBQTJCO1FBRTNELEtBQUssQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUpoQixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFDbkMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNqQix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQVM7UUFkMUMsa0JBQWEsR0FBRyxXQUFXLENBQUM7UUFFL0MsNkNBQTZDO1FBQ25DLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixpQkFBWSxHQUFHLEtBQUssQ0FBQztJQVkvQixDQUFDO0lBRUQsZ0RBQWdEO0lBQ2hELG9CQUFvQjtJQUNwQixnREFBZ0Q7SUFFaEQsZUFBZTtRQUNiLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRTFCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQWdCLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQzdELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixNQUFNO2FBQ1A7U0FDRjtRQUVELElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUUsQ0FBQztTQUNyRDthQUFNO1lBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdEMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuRDtRQUVELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNaLHVEQUF1RDtRQUN2RCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FDeEMsSUFBSSxDQUFDLGFBQWEsRUFDbEIsSUFBSSxDQUFDLGFBQWEsRUFDbEIsRUFBRSxDQUNILENBQUM7UUFDRixJQUFJLFlBQVksS0FBSyxTQUFTLElBQUksWUFBWSxLQUFLLEVBQUUsRUFBRTtZQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN6QjthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDTSxXQUFXLENBQUMsT0FBc0I7UUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNuQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNuQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQztnQkFDN0MsSUFBSSxVQUFVLEdBQ1osVUFBVSxLQUFLLEVBQUU7b0JBQ2YsQ0FBQyxDQUFDLFVBQVUsS0FBSyxDQUFDO3dCQUNoQixDQUFDLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDO3dCQUNuQyxDQUFDLENBQUMsS0FBSztvQkFDVCxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNYLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQkFDNUIsVUFBVSxHQUFHLENBQUMsVUFBVSxDQUFDO2lCQUMxQjtnQkFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUMvQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdEQUFnRDtJQUNoRCxvQkFBb0I7SUFDcEIsZ0RBQWdEO0lBRWhEOztPQUVHO0lBQ08sa0JBQWtCO1FBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVyRSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN6QyxJQUFJLENBQUMsT0FBTztpQkFDVCxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUM7aUJBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUNwQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sZUFBZTtRQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTO1lBQ25CLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQztZQUN4RCxDQUFDLENBQUMsTUFBTTtZQUNSLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsb0ZBQW9GO0lBQ2pFLGVBQWUsQ0FBQyxRQUEwQixJQUFJO1FBQy9ELElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUNoQixPQUFPO1NBQ1I7UUFDRCxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO1lBQ3ZDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixRQUFRO1NBQ1QsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDckQ7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2hFLENBQUM7OEdBaElVLGlCQUFpQixzSUFnQmxCLGFBQWEsYUFDYixXQUFXLGFBQ1gsWUFBWTtrR0FsQlgsaUJBQWlCOzsyRkFBakIsaUJBQWlCO2tCQUQ3QixTQUFTOzswQkFpQkwsTUFBTTsyQkFBQyxhQUFhOzswQkFDcEIsTUFBTTsyQkFBQyxXQUFXOzswQkFDbEIsTUFBTTsyQkFBQyxZQUFZOztBQWlIeEIsTUFBTSxXQUFXLEdBQWlDLElBQUksT0FBTyxFQUFFLENBQUM7QUFFaEUsTUFBTSxNQUFNLEdBQUc7SUFDYixRQUFRO0lBQ1IsY0FBYztJQUNkLFdBQVc7SUFDWCxXQUFXO0lBQ1gsV0FBVztJQUNYLFdBQVc7SUFDWCxXQUFXO0lBQ1gsY0FBYztJQUNkLGNBQWM7SUFDZCxjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7SUFDZCxjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7SUFDZCxRQUFRO0lBQ1IsY0FBYztJQUNkLFdBQVc7SUFDWCxXQUFXO0lBQ1gsV0FBVztJQUNYLFdBQVc7SUFDWCxXQUFXO0lBQ1gsY0FBYztJQUNkLGNBQWM7SUFDZCxjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7SUFDZCxjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7Q0FDZixDQUFDO0FBRUYsTUFBTSxRQUFRLEdBQUc7Ozs7Ozs7OztDQVNoQixDQUFDO0FBRUY7O0dBRUc7QUFFSCxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsaUJBQWlCO0lBRC9EOztRQUVxQixXQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3BDOzhHQUZZLHdCQUF3QjtrR0FBeEIsd0JBQXdCOzsyRkFBeEIsd0JBQXdCO2tCQURwQyxTQUFTO21CQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgY29lcmNlQm9vbGVhblByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIE9uQ2hhbmdlcyxcbiAgUExBVEZPUk1fSUQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQmFzZURpcmVjdGl2ZTIsXG4gIExheW91dENvbmZpZ09wdGlvbnMsXG4gIExBWU9VVF9DT05GSUcsXG4gIE1lZGlhTWFyc2hhbGxlcixcbiAgU0VSVkVSX1RPS0VOLFxuICBTdHlsZUJ1aWxkZXIsXG4gIFN0eWxlVXRpbHMsXG59IGZyb20gJ0BuZ2JyYWNrZXQvbmd4LWxheW91dC9jb3JlJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGludGVyZmFjZSBTaG93SGlkZVBhcmVudCB7XG4gIGRpc3BsYXk6IHN0cmluZztcbiAgaXNTZXJ2ZXI6IGJvb2xlYW47XG59XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU2hvd0hpZGVTdHlsZUJ1aWxkZXIgZXh0ZW5kcyBTdHlsZUJ1aWxkZXIge1xuICBidWlsZFN0eWxlcyhzaG93OiBzdHJpbmcsIHBhcmVudDogU2hvd0hpZGVQYXJlbnQpIHtcbiAgICBjb25zdCBzaG91bGRTaG93ID0gc2hvdyA9PT0gJ3RydWUnO1xuICAgIHJldHVybiB7XG4gICAgICBkaXNwbGF5OiBzaG91bGRTaG93XG4gICAgICAgID8gcGFyZW50LmRpc3BsYXkgfHwgKHBhcmVudC5pc1NlcnZlciA/ICdpbml0aWFsJyA6ICcnKVxuICAgICAgICA6ICdub25lJyxcbiAgICB9O1xuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIFNob3dIaWRlRGlyZWN0aXZlXG4gIGV4dGVuZHMgQmFzZURpcmVjdGl2ZTJcbiAgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXNcbntcbiAgcHJvdGVjdGVkIG92ZXJyaWRlIERJUkVDVElWRV9LRVkgPSAnc2hvdy1oaWRlJztcblxuICAvKiogT3JpZ2luYWwgRE9NIEVsZW1lbnQgQ1NTIGRpc3BsYXkgc3R5bGUgKi9cbiAgcHJvdGVjdGVkIGRpc3BsYXk6IHN0cmluZyA9ICcnO1xuICBwcm90ZWN0ZWQgaGFzTGF5b3V0ID0gZmFsc2U7XG4gIHByb3RlY3RlZCBoYXNGbGV4Q2hpbGQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHN0eWxlQnVpbGRlcjogU2hvd0hpZGVTdHlsZUJ1aWxkZXIsXG4gICAgc3R5bGVyOiBTdHlsZVV0aWxzLFxuICAgIG1hcnNoYWw6IE1lZGlhTWFyc2hhbGxlcixcbiAgICBASW5qZWN0KExBWU9VVF9DT05GSUcpIHByb3RlY3RlZCBsYXlvdXRDb25maWc6IExheW91dENvbmZpZ09wdGlvbnMsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJvdGVjdGVkIHBsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICBASW5qZWN0KFNFUlZFUl9UT0tFTikgcHJvdGVjdGVkIHNlcnZlck1vZHVsZUxvYWRlZDogYm9vbGVhblxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBzdHlsZUJ1aWxkZXIsIHN0eWxlciwgbWFyc2hhbCk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gTGlmZWN5Y2xlIE1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMudHJhY2tFeHRyYVRyaWdnZXJzKCk7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IEFycmF5LmZyb20odGhpcy5uYXRpdmVFbGVtZW50LmNoaWxkcmVuKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5tYXJzaGFsLmhhc1ZhbHVlKGNoaWxkcmVuW2ldIGFzIEhUTUxFbGVtZW50LCAnZmxleCcpKSB7XG4gICAgICAgIHRoaXMuaGFzRmxleENoaWxkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKERJU1BMQVlfTUFQLmhhcyh0aGlzLm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICB0aGlzLmRpc3BsYXkgPSBESVNQTEFZX01BUC5nZXQodGhpcy5uYXRpdmVFbGVtZW50KSE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlzcGxheSA9IHRoaXMuZ2V0RGlzcGxheVN0eWxlKCk7XG4gICAgICBESVNQTEFZX01BUC5zZXQodGhpcy5uYXRpdmVFbGVtZW50LCB0aGlzLmRpc3BsYXkpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdCgpO1xuICAgIC8vIHNldCB0aGUgZGVmYXVsdCB0byBzaG93IHVubGVzcyBleHBsaWNpdGx5IG92ZXJyaWRkZW5cbiAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSB0aGlzLm1hcnNoYWwuZ2V0VmFsdWUoXG4gICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQsXG4gICAgICB0aGlzLkRJUkVDVElWRV9LRVksXG4gICAgICAnJ1xuICAgICk7XG4gICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGRlZmF1bHRWYWx1ZSA9PT0gJycpIHtcbiAgICAgIHRoaXMuc2V0VmFsdWUodHJ1ZSwgJycpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyaWdnZXJVcGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT24gY2hhbmdlcyB0byBhbnkgQElucHV0IHByb3BlcnRpZXMuLi5cbiAgICogRGVmYXVsdCB0byB1c2UgdGhlIG5vbi1yZXNwb25zaXZlIElucHV0IHZhbHVlICgnZnhTaG93JylcbiAgICogVGhlbiBjb25kaXRpb25hbGx5IG92ZXJyaWRlIHdpdGggdGhlIG1xLWFjdGl2YXRlZCBJbnB1dCdzIGN1cnJlbnQgdmFsdWVcbiAgICovXG4gIG92ZXJyaWRlIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBPYmplY3Qua2V5cyhjaGFuZ2VzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzLmlucHV0cy5pbmRleE9mKGtleSkgIT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGlucHV0S2V5ID0ga2V5LnNwbGl0KCcuJyk7XG4gICAgICAgIGNvbnN0IGJwID0gaW5wdXRLZXkuc2xpY2UoMSkuam9pbignLicpO1xuICAgICAgICBjb25zdCBpbnB1dFZhbHVlID0gY2hhbmdlc1trZXldLmN1cnJlbnRWYWx1ZTtcbiAgICAgICAgbGV0IHNob3VsZFNob3cgPVxuICAgICAgICAgIGlucHV0VmFsdWUgIT09ICcnXG4gICAgICAgICAgICA/IGlucHV0VmFsdWUgIT09IDBcbiAgICAgICAgICAgICAgPyBjb2VyY2VCb29sZWFuUHJvcGVydHkoaW5wdXRWYWx1ZSlcbiAgICAgICAgICAgICAgOiBmYWxzZVxuICAgICAgICAgICAgOiB0cnVlO1xuICAgICAgICBpZiAoaW5wdXRLZXlbMF0gPT09ICdmeEhpZGUnKSB7XG4gICAgICAgICAgc2hvdWxkU2hvdyA9ICFzaG91bGRTaG93O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoc2hvdWxkU2hvdywgYnApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gIC8vIFByb3RlY3RlZCBtZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiAgV2F0Y2ggZm9yIHRoZXNlIGV4dHJhIHRyaWdnZXJzIHRvIHVwZGF0ZSBmeFNob3csIGZ4SGlkZSBzdHlsaW5nc1xuICAgKi9cbiAgcHJvdGVjdGVkIHRyYWNrRXh0cmFUcmlnZ2VycygpIHtcbiAgICB0aGlzLmhhc0xheW91dCA9IHRoaXMubWFyc2hhbC5oYXNWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsICdsYXlvdXQnKTtcblxuICAgIFsnbGF5b3V0JywgJ2xheW91dC1hbGlnbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgdGhpcy5tYXJzaGFsXG4gICAgICAgIC50cmFja1ZhbHVlKHRoaXMubmF0aXZlRWxlbWVudCwga2V5KVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95U3ViamVjdCkpXG4gICAgICAgIC5zdWJzY3JpYmUodGhpcy50cmlnZ2VyVXBkYXRlLmJpbmQodGhpcykpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGFjY2Vzc29yIHRvIHRoZSBjdXJyZW50IEhUTUxFbGVtZW50J3MgYGRpc3BsYXlgIHN0eWxlXG4gICAqIE5vdGU6IFNob3cvSGlkZSB3aWxsIG5vdCBjaGFuZ2UgdGhlIGRpc3BsYXkgdG8gJ2ZsZXgnIGJ1dCB3aWxsIHNldCBpdCB0byAnYmxvY2snXG4gICAqIHVubGVzcyBpdCB3YXMgYWxyZWFkeSBleHBsaWNpdGx5IHNwZWNpZmllZCBpbmxpbmUgb3IgaW4gYSBDU1Mgc3R5bGVzaGVldC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXREaXNwbGF5U3R5bGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5oYXNMYXlvdXQgfHxcbiAgICAgICh0aGlzLmhhc0ZsZXhDaGlsZCAmJiB0aGlzLmxheW91dENvbmZpZy5hZGRGbGV4VG9QYXJlbnQpXG4gICAgICA/ICdmbGV4J1xuICAgICAgOiB0aGlzLnN0eWxlci5sb29rdXBTdHlsZSh0aGlzLm5hdGl2ZUVsZW1lbnQsICdkaXNwbGF5JywgdHJ1ZSk7XG4gIH1cblxuICAvKiogVmFsaWRhdGUgdGhlIHZpc2liaWxpdHkgdmFsdWUgYW5kIHRoZW4gdXBkYXRlIHRoZSBob3N0J3MgaW5saW5lIGRpc3BsYXkgc3R5bGUgKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHVwZGF0ZVdpdGhWYWx1ZSh2YWx1ZTogYm9vbGVhbiB8IHN0cmluZyA9IHRydWUpIHtcbiAgICBpZiAodmFsdWUgPT09ICcnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGlzU2VydmVyID0gaXNQbGF0Zm9ybVNlcnZlcih0aGlzLnBsYXRmb3JtSWQpO1xuICAgIHRoaXMuYWRkU3R5bGVzKHZhbHVlID8gJ3RydWUnIDogJ2ZhbHNlJywge1xuICAgICAgZGlzcGxheTogdGhpcy5kaXNwbGF5LFxuICAgICAgaXNTZXJ2ZXIsXG4gICAgfSk7XG4gICAgaWYgKGlzU2VydmVyICYmIHRoaXMuc2VydmVyTW9kdWxlTG9hZGVkKSB7XG4gICAgICB0aGlzLm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnJyk7XG4gICAgfVxuICAgIHRoaXMubWFyc2hhbC50cmlnZ2VyVXBkYXRlKHRoaXMucGFyZW50RWxlbWVudCEsICdsYXlvdXQtZ2FwJyk7XG4gIH1cbn1cblxuY29uc3QgRElTUExBWV9NQVA6IFdlYWtNYXA8SFRNTEVsZW1lbnQsIHN0cmluZz4gPSBuZXcgV2Vha01hcCgpO1xuXG5jb25zdCBpbnB1dHMgPSBbXG4gICdmeFNob3cnLFxuICAnZnhTaG93LnByaW50JyxcbiAgJ2Z4U2hvdy54cycsXG4gICdmeFNob3cuc20nLFxuICAnZnhTaG93Lm1kJyxcbiAgJ2Z4U2hvdy5sZycsXG4gICdmeFNob3cueGwnLFxuICAnZnhTaG93Lmx0LXNtJyxcbiAgJ2Z4U2hvdy5sdC1tZCcsXG4gICdmeFNob3cubHQtbGcnLFxuICAnZnhTaG93Lmx0LXhsJyxcbiAgJ2Z4U2hvdy5ndC14cycsXG4gICdmeFNob3cuZ3Qtc20nLFxuICAnZnhTaG93Lmd0LW1kJyxcbiAgJ2Z4U2hvdy5ndC1sZycsXG4gICdmeEhpZGUnLFxuICAnZnhIaWRlLnByaW50JyxcbiAgJ2Z4SGlkZS54cycsXG4gICdmeEhpZGUuc20nLFxuICAnZnhIaWRlLm1kJyxcbiAgJ2Z4SGlkZS5sZycsXG4gICdmeEhpZGUueGwnLFxuICAnZnhIaWRlLmx0LXNtJyxcbiAgJ2Z4SGlkZS5sdC1tZCcsXG4gICdmeEhpZGUubHQtbGcnLFxuICAnZnhIaWRlLmx0LXhsJyxcbiAgJ2Z4SGlkZS5ndC14cycsXG4gICdmeEhpZGUuZ3Qtc20nLFxuICAnZnhIaWRlLmd0LW1kJyxcbiAgJ2Z4SGlkZS5ndC1sZycsXG5dO1xuXG5jb25zdCBzZWxlY3RvciA9IGBcbiAgW2Z4U2hvd10sIFtmeFNob3cucHJpbnRdLFxuICBbZnhTaG93LnhzXSwgW2Z4U2hvdy5zbV0sIFtmeFNob3cubWRdLCBbZnhTaG93LmxnXSwgW2Z4U2hvdy54bF0sXG4gIFtmeFNob3cubHQtc21dLCBbZnhTaG93Lmx0LW1kXSwgW2Z4U2hvdy5sdC1sZ10sIFtmeFNob3cubHQteGxdLFxuICBbZnhTaG93Lmd0LXhzXSwgW2Z4U2hvdy5ndC1zbV0sIFtmeFNob3cuZ3QtbWRdLCBbZnhTaG93Lmd0LWxnXSxcbiAgW2Z4SGlkZV0sIFtmeEhpZGUucHJpbnRdLFxuICBbZnhIaWRlLnhzXSwgW2Z4SGlkZS5zbV0sIFtmeEhpZGUubWRdLCBbZnhIaWRlLmxnXSwgW2Z4SGlkZS54bF0sXG4gIFtmeEhpZGUubHQtc21dLCBbZnhIaWRlLmx0LW1kXSwgW2Z4SGlkZS5sdC1sZ10sIFtmeEhpZGUubHQteGxdLFxuICBbZnhIaWRlLmd0LXhzXSwgW2Z4SGlkZS5ndC1zbV0sIFtmeEhpZGUuZ3QtbWRdLCBbZnhIaWRlLmd0LWxnXVxuYDtcblxuLyoqXG4gKiAnc2hvdycgTGF5b3V0IEFQSSBkaXJlY3RpdmVcbiAqL1xuQERpcmVjdGl2ZSh7IHNlbGVjdG9yLCBpbnB1dHMgfSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0U2hvd0hpZGVEaXJlY3RpdmUgZXh0ZW5kcyBTaG93SGlkZURpcmVjdGl2ZSB7XG4gIHByb3RlY3RlZCBvdmVycmlkZSBpbnB1dHMgPSBpbnB1dHM7XG59XG4iXX0=