/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { applyCssPrefixes } from '@ngbracket/ngx-layout/_private-utils';
import { LAYOUT_CONFIG } from '../tokens/library-config';
import { SERVER_TOKEN } from '../tokens/server-token';
import * as i0 from "@angular/core";
import * as i1 from "../stylesheet-map/stylesheet-map";
export class StyleUtils {
    constructor(_serverStylesheet, _serverModuleLoaded, _platformId, layoutConfig) {
        this._serverStylesheet = _serverStylesheet;
        this._serverModuleLoaded = _serverModuleLoaded;
        this._platformId = _platformId;
        this.layoutConfig = layoutConfig;
    }
    /**
     * Applies styles given via string pair or object map to the directive element
     */
    applyStyleToElement(element, style, value = null) {
        let styles = {};
        if (typeof style === 'string') {
            styles[style] = value;
            style = styles;
        }
        styles = this.layoutConfig.disableVendorPrefixes
            ? style
            : applyCssPrefixes(style);
        this._applyMultiValueStyleToElement(styles, element);
    }
    /**
     * Applies styles given via string pair or object map to the directive's element
     */
    applyStyleToElements(style, elements = []) {
        const styles = this.layoutConfig.disableVendorPrefixes
            ? style
            : applyCssPrefixes(style);
        elements.forEach((el) => {
            this._applyMultiValueStyleToElement(styles, el);
        });
    }
    /**
     * Determine the DOM element's Flexbox flow (flex-direction)
     *
     * Check inline style first then check computed (stylesheet) style
     */
    getFlowDirection(target) {
        const query = 'flex-direction';
        let value = this.lookupStyle(target, query);
        const hasInlineValue = this.lookupInlineStyle(target, query) ||
            (isPlatformServer(this._platformId) && this._serverModuleLoaded)
            ? value
            : '';
        return [value || 'row', hasInlineValue];
    }
    hasWrap(target) {
        const query = 'flex-wrap';
        return this.lookupStyle(target, query) === 'wrap';
    }
    /**
     * Find the DOM element's raw attribute value (if any)
     */
    lookupAttributeValue(element, attribute) {
        return element.getAttribute(attribute) ?? '';
    }
    /**
     * Find the DOM element's inline style value (if any)
     */
    lookupInlineStyle(element, styleName) {
        return isPlatformBrowser(this._platformId)
            ? element.style.getPropertyValue(styleName)
            : getServerStyle(element, styleName);
    }
    /**
     * Determine the inline or inherited CSS style
     * NOTE: platform-server has no implementation for getComputedStyle
     */
    lookupStyle(element, styleName, inlineOnly = false) {
        let value = '';
        if (element) {
            let immediateValue = (value = this.lookupInlineStyle(element, styleName));
            if (!immediateValue) {
                if (isPlatformBrowser(this._platformId)) {
                    if (!inlineOnly) {
                        value = getComputedStyle(element).getPropertyValue(styleName);
                    }
                }
                else {
                    if (this._serverModuleLoaded) {
                        value = this._serverStylesheet.getStyleForElement(element, styleName);
                    }
                }
            }
        }
        // Note: 'inline' is the default of all elements, unless UA stylesheet overrides;
        //       in which case getComputedStyle() should determine a valid value.
        return value ? value.trim() : '';
    }
    /**
     * Applies the styles to the element. The styles object map may contain an array of values
     * Each value will be added as element style
     * Keys are sorted to add prefixed styles (like -webkit-x) first, before the standard ones
     */
    _applyMultiValueStyleToElement(styles, element) {
        Object.keys(styles)
            .sort()
            .forEach((key) => {
            const el = styles[key];
            const values = Array.isArray(el)
                ? el
                : [el];
            values.sort();
            for (let value of values) {
                value = value ? value + '' : '';
                if (isPlatformBrowser(this._platformId) ||
                    !this._serverModuleLoaded) {
                    isPlatformBrowser(this._platformId)
                        ? element.style.setProperty(key, value)
                        : setServerStyle(element, key, value);
                }
                else {
                    this._serverStylesheet.addStyleToElement(element, key, value);
                }
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: StyleUtils, deps: [{ token: i1.StylesheetMap }, { token: SERVER_TOKEN }, { token: PLATFORM_ID }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: StyleUtils, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.9", ngImport: i0, type: StyleUtils, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.StylesheetMap }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }] });
function getServerStyle(element, styleName) {
    const styleMap = readStyleAttribute(element);
    return styleMap[styleName] ?? '';
}
function setServerStyle(element, styleName, styleValue) {
    styleName = styleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const styleMap = readStyleAttribute(element);
    styleMap[styleName] = styleValue ?? '';
    writeStyleAttribute(element, styleMap);
}
function writeStyleAttribute(element, styleMap) {
    let styleAttrValue = '';
    for (const key in styleMap) {
        const newValue = styleMap[key];
        if (newValue) {
            styleAttrValue += `${key}:${styleMap[key]};`;
        }
    }
    element.setAttribute('style', styleAttrValue);
}
function readStyleAttribute(element) {
    const styleMap = {};
    const styleAttribute = element.getAttribute('style');
    if (styleAttribute) {
        const styleList = styleAttribute.split(/;+/g);
        for (let i = 0; i < styleList.length; i++) {
            const style = styleList[i].trim();
            if (style.length > 0) {
                const colonIndex = style.indexOf(':');
                if (colonIndex === -1) {
                    throw new Error(`Invalid CSS style: ${style}`);
                }
                const name = style.substr(0, colonIndex).trim();
                styleMap[name] = style.substr(colonIndex + 1).trim();
            }
        }
    }
    return styleMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvc3R5bGUtdXRpbHMvc3R5bGUtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDdEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWhFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRXhFLE9BQU8sRUFBdUIsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDOUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHdCQUF3QixDQUFDOzs7QUFHdEQsTUFBTSxPQUFPLFVBQVU7SUFDckIsWUFDVSxpQkFBZ0MsRUFDVixtQkFBNEIsRUFDN0IsV0FBbUIsRUFDakIsWUFBaUM7UUFIeEQsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFlO1FBQ1Ysd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFTO1FBQzdCLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ2pCLGlCQUFZLEdBQVosWUFBWSxDQUFxQjtJQUMvRCxDQUFDO0lBRUo7O09BRUc7SUFDSCxtQkFBbUIsQ0FDakIsT0FBb0IsRUFDcEIsS0FBK0IsRUFDL0IsUUFBZ0MsSUFBSTtRQUVwQyxJQUFJLE1BQU0sR0FBb0IsRUFBRSxDQUFDO1FBQ2pDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEIsS0FBSyxHQUFHLE1BQU0sQ0FBQztTQUNoQjtRQUNELE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQjtZQUM5QyxDQUFDLENBQUMsS0FB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QVMsa0JBQWtCLENBQUMsT0FBWTtJQUN0QyxNQUFNLFFBQVEsR0FBK0IsRUFBRSxDQUFDO0lBQ2hELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckQsSUFBSSxjQUFjLEVBQUU7UUFDbEIsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDcEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQ2hEO2dCQUNELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDdEQ7U0FDRjtLQUNGO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIsIGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBhcHBseUNzc1ByZWZpeGVzIH0gZnJvbSAnQG5nYnJhY2tldC9uZ3gtbGF5b3V0L19wcml2YXRlLXV0aWxzJztcbmltcG9ydCB7IFN0eWxlc2hlZXRNYXAgfSBmcm9tICcuLi9zdHlsZXNoZWV0LW1hcC9zdHlsZXNoZWV0LW1hcCc7XG5pbXBvcnQgeyBMYXlvdXRDb25maWdPcHRpb25zLCBMQVlPVVRfQ09ORklHIH0gZnJvbSAnLi4vdG9rZW5zL2xpYnJhcnktY29uZmlnJztcbmltcG9ydCB7IFNFUlZFUl9UT0tFTiB9IGZyb20gJy4uL3Rva2Vucy9zZXJ2ZXItdG9rZW4nO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFN0eWxlVXRpbHMge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9zZXJ2ZXJTdHlsZXNoZWV0OiBTdHlsZXNoZWV0TWFwLFxuICAgIEBJbmplY3QoU0VSVkVSX1RPS0VOKSBwcml2YXRlIF9zZXJ2ZXJNb2R1bGVMb2FkZWQ6IGJvb2xlYW4sXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgIEBJbmplY3QoTEFZT1VUX0NPTkZJRykgcHJpdmF0ZSBsYXlvdXRDb25maWc6IExheW91dENvbmZpZ09wdGlvbnNcbiAgKSB7fVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHN0eWxlcyBnaXZlbiB2aWEgc3RyaW5nIHBhaXIgb3Igb2JqZWN0IG1hcCB0byB0aGUgZGlyZWN0aXZlIGVsZW1lbnRcbiAgICovXG4gIGFwcGx5U3R5bGVUb0VsZW1lbnQoXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgc3R5bGU6IFN0eWxlRGVmaW5pdGlvbiB8IHN0cmluZyxcbiAgICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgKSB7XG4gICAgbGV0IHN0eWxlczogU3R5bGVEZWZpbml0aW9uID0ge307XG4gICAgaWYgKHR5cGVvZiBzdHlsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN0eWxlc1tzdHlsZV0gPSB2YWx1ZTtcbiAgICAgIHN0eWxlID0gc3R5bGVzO1xuICAgIH1cbiAgICBzdHlsZXMgPSB0aGlzLmxheW91dENvbmZpZy5kaXNhYmxlVmVuZG9yUHJlZml4ZXNcbiAgICAgID8gc3R5bGVcbiAgICAgIDogYXBwbHlDc3NQcmVmaXhlcyhzdHlsZSk7XG4gICAgdGhpcy5fYXBwbHlNdWx0aVZhbHVlU3R5bGVUb0VsZW1lbnQoc3R5bGVzLCBlbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHN0eWxlcyBnaXZlbiB2aWEgc3RyaW5nIHBhaXIgb3Igb2JqZWN0IG1hcCB0byB0aGUgZGlyZWN0aXZlJ3MgZWxlbWVudFxuICAgKi9cbiAgYXBwbHlTdHlsZVRvRWxlbWVudHMoc3R5bGU6IFN0eWxlRGVmaW5pdGlvbiwgZWxlbWVudHM6IEhUTUxFbGVtZW50W10gPSBbXSkge1xuICAgIGNvbnN0IHN0eWxlcyA9IHRoaXMubGF5b3V0Q29uZmlnLmRpc2FibGVWZW5kb3JQcmVmaXhlc1xuICAgICAgPyBzdHlsZVxuICAgICAgOiBhcHBseUNzc1ByZWZpeGVzKHN0eWxlKTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgdGhpcy5fYXBwbHlNdWx0aVZhbHVlU3R5bGVUb0VsZW1lbnQoc3R5bGVzLCBlbCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBET00gZWxlbWVudCdzIEZsZXhib3ggZmxvdyAoZmxleC1kaXJlY3Rpb24pXG4gICAqXG4gICAqIENoZWNrIGlubGluZSBzdHlsZSBmaXJzdCB0aGVuIGNoZWNrIGNvbXB1dGVkIChzdHlsZXNoZWV0KSBzdHlsZVxuICAgKi9cbiAgZ2V0Rmxvd0RpcmVjdGlvbih0YXJnZXQ6IEhUTUxFbGVtZW50KTogW3N0cmluZywgc3RyaW5nXSB7XG4gICAgY29uc3QgcXVlcnkgPSAnZmxleC1kaXJlY3Rpb24nO1xuICAgIGxldCB2YWx1ZSA9IHRoaXMubG9va3VwU3R5bGUodGFyZ2V0LCBxdWVyeSk7XG4gICAgY29uc3QgaGFzSW5saW5lVmFsdWUgPVxuICAgICAgdGhpcy5sb29rdXBJbmxpbmVTdHlsZSh0YXJnZXQsIHF1ZXJ5KSB8fFxuICAgICAgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5fcGxhdGZvcm1JZCkgJiYgdGhpcy5fc2VydmVyTW9kdWxlTG9hZGVkKVxuICAgICAgICA/IHZhbHVlXG4gICAgICAgIDogJyc7XG5cbiAgICByZXR1cm4gW3ZhbHVlIHx8ICdyb3cnLCBoYXNJbmxpbmVWYWx1ZV07XG4gIH1cblxuICBoYXNXcmFwKHRhcmdldDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBjb25zdCBxdWVyeSA9ICdmbGV4LXdyYXAnO1xuICAgIHJldHVybiB0aGlzLmxvb2t1cFN0eWxlKHRhcmdldCwgcXVlcnkpID09PSAnd3JhcCc7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgRE9NIGVsZW1lbnQncyByYXcgYXR0cmlidXRlIHZhbHVlIChpZiBhbnkpXG4gICAqL1xuICBsb29rdXBBdHRyaWJ1dGVWYWx1ZShlbGVtZW50OiBIVE1MRWxlbWVudCwgYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpID8/ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIERPTSBlbGVtZW50J3MgaW5saW5lIHN0eWxlIHZhbHVlIChpZiBhbnkpXG4gICAqL1xuICBsb29rdXBJbmxpbmVTdHlsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgc3R5bGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKVxuICAgICAgPyBlbGVtZW50LnN0eWxlLmdldFByb3BlcnR5VmFsdWUoc3R5bGVOYW1lKVxuICAgICAgOiBnZXRTZXJ2ZXJTdHlsZShlbGVtZW50LCBzdHlsZU5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB0aGUgaW5saW5lIG9yIGluaGVyaXRlZCBDU1Mgc3R5bGVcbiAgICogTk9URTogcGxhdGZvcm0tc2VydmVyIGhhcyBubyBpbXBsZW1lbnRhdGlvbiBmb3IgZ2V0Q29tcHV0ZWRTdHlsZVxuICAgKi9cbiAgbG9va3VwU3R5bGUoXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgc3R5bGVOYW1lOiBzdHJpbmcsXG4gICAgaW5saW5lT25seSA9IGZhbHNlXG4gICk6IHN0cmluZyB7XG4gICAgbGV0IHZhbHVlID0gJyc7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIGxldCBpbW1lZGlhdGVWYWx1ZSA9ICh2YWx1ZSA9IHRoaXMubG9va3VwSW5saW5lU3R5bGUoZWxlbWVudCwgc3R5bGVOYW1lKSk7XG4gICAgICBpZiAoIWltbWVkaWF0ZVZhbHVlKSB7XG4gICAgICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKSkge1xuICAgICAgICAgIGlmICghaW5saW5lT25seSkge1xuICAgICAgICAgICAgdmFsdWUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoc3R5bGVOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuX3NlcnZlck1vZHVsZUxvYWRlZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9zZXJ2ZXJTdHlsZXNoZWV0LmdldFN0eWxlRm9yRWxlbWVudChcbiAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgc3R5bGVOYW1lXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdGU6ICdpbmxpbmUnIGlzIHRoZSBkZWZhdWx0IG9mIGFsbCBlbGVtZW50cywgdW5sZXNzIFVBIHN0eWxlc2hlZXQgb3ZlcnJpZGVzO1xuICAgIC8vICAgICAgIGluIHdoaWNoIGNhc2UgZ2V0Q29tcHV0ZWRTdHlsZSgpIHNob3VsZCBkZXRlcm1pbmUgYSB2YWxpZCB2YWx1ZS5cbiAgICByZXR1cm4gdmFsdWUgPyB2YWx1ZS50cmltKCkgOiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzdHlsZXMgdG8gdGhlIGVsZW1lbnQuIFRoZSBzdHlsZXMgb2JqZWN0IG1hcCBtYXkgY29udGFpbiBhbiBhcnJheSBvZiB2YWx1ZXNcbiAgICogRWFjaCB2YWx1ZSB3aWxsIGJlIGFkZGVkIGFzIGVsZW1lbnQgc3R5bGVcbiAgICogS2V5cyBhcmUgc29ydGVkIHRvIGFkZCBwcmVmaXhlZCBzdHlsZXMgKGxpa2UgLXdlYmtpdC14KSBmaXJzdCwgYmVmb3JlIHRoZSBzdGFuZGFyZCBvbmVzXG4gICAqL1xuICBwcml2YXRlIF9hcHBseU11bHRpVmFsdWVTdHlsZVRvRWxlbWVudChcbiAgICBzdHlsZXM6IFN0eWxlRGVmaW5pdGlvbixcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudFxuICApIHtcbiAgICBPYmplY3Qua2V5cyhzdHlsZXMpXG4gICAgICAuc29ydCgpXG4gICAgICAuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGVsID0gc3R5bGVzW2tleV07XG4gICAgICAgIGNvbnN0IHZhbHVlczogKHN0cmluZyB8IG51bWJlciB8IG51bGwpW10gPSBBcnJheS5pc0FycmF5KGVsKVxuICAgICAgICAgID8gZWxcbiAgICAgICAgICA6IFtlbF07XG4gICAgICAgIHZhbHVlcy5zb3J0KCk7XG4gICAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUgPyB2YWx1ZSArICcnIDogJyc7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCkgfHxcbiAgICAgICAgICAgICF0aGlzLl9zZXJ2ZXJNb2R1bGVMb2FkZWRcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpXG4gICAgICAgICAgICAgID8gZWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICAgICAgICA6IHNldFNlcnZlclN0eWxlKGVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zZXJ2ZXJTdHlsZXNoZWV0LmFkZFN0eWxlVG9FbGVtZW50KGVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U2VydmVyU3R5bGUoZWxlbWVudDogYW55LCBzdHlsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHN0eWxlTWFwID0gcmVhZFN0eWxlQXR0cmlidXRlKGVsZW1lbnQpO1xuICByZXR1cm4gc3R5bGVNYXBbc3R5bGVOYW1lXSA/PyAnJztcbn1cblxuZnVuY3Rpb24gc2V0U2VydmVyU3R5bGUoXG4gIGVsZW1lbnQ6IGFueSxcbiAgc3R5bGVOYW1lOiBzdHJpbmcsXG4gIHN0eWxlVmFsdWU/OiBzdHJpbmcgfCBudWxsXG4pIHtcbiAgc3R5bGVOYW1lID0gc3R5bGVOYW1lLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IHN0eWxlTWFwID0gcmVhZFN0eWxlQXR0cmlidXRlKGVsZW1lbnQpO1xuICBzdHlsZU1hcFtzdHlsZU5hbWVdID0gc3R5bGVWYWx1ZSA/PyAnJztcbiAgd3JpdGVTdHlsZUF0dHJpYnV0ZShlbGVtZW50LCBzdHlsZU1hcCk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlU3R5bGVBdHRyaWJ1dGUoXG4gIGVsZW1lbnQ6IGFueSxcbiAgc3R5bGVNYXA6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9XG4pIHtcbiAgbGV0IHN0eWxlQXR0clZhbHVlID0gJyc7XG4gIGZvciAoY29uc3Qga2V5IGluIHN0eWxlTWFwKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBzdHlsZU1hcFtrZXldO1xuICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgc3R5bGVBdHRyVmFsdWUgKz0gYCR7a2V5fToke3N0eWxlTWFwW2tleV19O2A7XG4gICAgfVxuICB9XG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsIHN0eWxlQXR0clZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcmVhZFN0eWxlQXR0cmlidXRlKGVsZW1lbnQ6IGFueSk6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9IHtcbiAgY29uc3Qgc3R5bGVNYXA6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gIGNvbnN0IHN0eWxlQXR0cmlidXRlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gIGlmIChzdHlsZUF0dHJpYnV0ZSkge1xuICAgIGNvbnN0IHN0eWxlTGlzdCA9IHN0eWxlQXR0cmlidXRlLnNwbGl0KC87Ky9nKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0eWxlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc3R5bGUgPSBzdHlsZUxpc3RbaV0udHJpbSgpO1xuICAgICAgaWYgKHN0eWxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgY29sb25JbmRleCA9IHN0eWxlLmluZGV4T2YoJzonKTtcbiAgICAgICAgaWYgKGNvbG9uSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIENTUyBzdHlsZTogJHtzdHlsZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuYW1lID0gc3R5bGUuc3Vic3RyKDAsIGNvbG9uSW5kZXgpLnRyaW0oKTtcbiAgICAgICAgc3R5bGVNYXBbbmFtZV0gPSBzdHlsZS5zdWJzdHIoY29sb25JbmRleCArIDEpLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0eWxlTWFwO1xufVxuXG4vKipcbiAqIERlZmluaXRpb24gb2YgYSBjc3Mgc3R5bGUuIEVpdGhlciBhIHByb3BlcnR5IG5hbWUgKGUuZy4gXCJmbGV4LWJhc2lzXCIpIG9yIGFuIG9iamVjdFxuICogbWFwIG9mIHByb3BlcnR5IG5hbWUgYW5kIHZhbHVlIChlLmcuIHtkaXNwbGF5OiAnbm9uZScsIGZsZXgtb3JkZXI6IDV9KVxuICovXG5leHBvcnQgdHlwZSBTdHlsZURlZmluaXRpb24gPSB7IFtwcm9wZXJ0eTogc3RyaW5nXTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB9O1xuIl19