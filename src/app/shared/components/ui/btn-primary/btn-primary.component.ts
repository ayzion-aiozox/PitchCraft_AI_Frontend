import { Component } from '@angular/core';

@Component({
    selector: 'app-btn-primary',
    standalone: true,
    template: '<button class="btn-primary"><ng-content></ng-content></button>'
})
export class BtnPrimaryComponent { }