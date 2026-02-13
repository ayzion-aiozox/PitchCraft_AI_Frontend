import { Component } from '@angular/core';

@Component({
    selector: 'app-error-boundary',
    standalone: true,
    template: '<ng-content></ng-content>'
})
export class ErrorBoundaryComponent { }