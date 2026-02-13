import { Component } from '@angular/core';

@Component({
    selector: 'app-error-fallback',
    standalone: true,
    template: '<p>Something went wrong</p>',
    styleUrls: ['./error-fallback.component.scss']
})
export class ErrorFallbackComponent { }