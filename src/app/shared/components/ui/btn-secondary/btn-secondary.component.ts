import { Component } from '@angular/core';

@Component({
    selector: 'app-btn-secondary',
    standalone: true,
    template: '<button class="btn-secondary"><ng-content></ng-content></button>'
})
export class BtnSecondaryComponent { }