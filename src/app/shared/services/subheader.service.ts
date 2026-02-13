// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class SubheaderService {
//   // BehaviorSubjects for title, Add Button, and Advanced Search
//   private titleSubject = new BehaviorSubject<string>('Title');
//   private showAddButtonSubject = new BehaviorSubject<boolean>(false);
//   private showAdvancedSearchSubject = new BehaviorSubject<boolean>(false);

//   // Observables for components to subscribe to
//   title = this.titleSubject.asObservable();
//   showAddButton = this.showAddButtonSubject.asObservable();
//   showAdvancedSearch = this.showAdvancedSearchSubject.asObservable();

//   // Methods to update values
//   setTitle(title: string): void {
//     this.titleSubject.next(title);
//   }

//   setAddButtonVisibility(show: boolean): void {
//     this.showAddButtonSubject.next(show);
//   }

//   setAdvanceSearchVisibility(show: boolean): void {
//     this.showAdvancedSearchSubject.next(show);
//   }
// }
