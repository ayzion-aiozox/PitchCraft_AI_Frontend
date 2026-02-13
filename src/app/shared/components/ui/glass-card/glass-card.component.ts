import { Component } from '@angular/core';

@Component({
    selector: 'app-glass-card',
    standalone: true,
    template: '<div class="glass-card"><ng-content></ng-content></div>'
})
export class GlassCardComponent { }