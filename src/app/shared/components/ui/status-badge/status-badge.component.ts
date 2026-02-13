import { Component } from '@angular/core';

@Component({
    selector: 'app-status-badge',
    standalone: true,
    template: '<span class="badge"><ng-content></ng-content></span>'
})
export class StatusBadgeComponent { }