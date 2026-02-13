import { Injectable } from '@angular/core';
import { Lookup } from '../models/lookup.model';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private lookupValuesAsMap = new Map<string, Map<number, Lookup>>();
  private lookupValuesAsArray = new Map<string, Lookup[]>();

  constructor(private apiService: ApiService) {}

  getLookupsAsMap(lookupType: string): Map<number, Lookup> | any {
    //If lookup already exists in lookups Map then return it
    const lookupMap = this.lookupValuesAsMap.get(lookupType);
    if (lookupMap) {
      return lookupMap;
    }

    //If lookup doesnt exist in lookup Map then fetch from database
    this.apiService.get(ApiEndpoints.lookup.byType, { lookupType }).subscribe({
      next: (response: any): Map<number, Lookup> | any => {
        if (response && response.data) {
          const lookup = response.data as Lookup;
          this.loadLookupIntoLookupMapAndLookupArray(lookup);
          return this.lookupValuesAsMap.get(lookupType);
        }
        return null;
      },
      error: (err) => {
        alert(`Unable to fetch lookup with lookup Type = ${lookupType}`);
        return null;
      },
    });
  }

  getLookupsAsArrayByType(
    lookupType: string,
    hiddenValue: string = ''
  ): Lookup[] | any {
    const lookupArray = this.lookupValuesAsArray.get(lookupType);
    //If lookup already exists in lookups Array Map then return it
    if (lookupArray) {
      return lookupArray;
    }

    //If lookup doesnt exist in lookups Array Map then fetch from database
    this.apiService.get(ApiEndpoints.lookup.byType, { lookupType }).subscribe({
      next: (response: any): Map<number, Lookup> | any => {
        if (response && response.data) {
          const lookup = response.data as Lookup;
          this.loadLookupIntoLookupMapAndLookupArray(lookup);
          const lkpsByType = this.lookupValuesAsArray.get(lookup.LookupType);
          if (hiddenValue) {
            return lkpsByType?.find(
              (lkpByType) => lkpByType.HiddenValue === hiddenValue
            );
          } else {
            return lkpsByType;
          }
        }
        return null;
      },
      error: (err) => {
        alert(`Unable to fetch lookup with lookup Type = ${lookupType}`);
        return null;
      },
    });
  }

  loadLookupIntoLookupMapAndLookupArray(lookup: Lookup) {
    let lookupMap = this.lookupValuesAsMap.get(lookup.LookupType);
    let lookupArray = this.lookupValuesAsArray.get(lookup.LookupType);
    if (!lookupMap) {
      this.lookupValuesAsMap.set(lookup.LookupType, new Map<number, Lookup>());
      this.lookupValuesAsArray.set(lookup.LookupType, []);
    }
    lookupMap?.set(lookup.LookupId, lookup);
    lookupArray?.push(lookup);
  }
}
