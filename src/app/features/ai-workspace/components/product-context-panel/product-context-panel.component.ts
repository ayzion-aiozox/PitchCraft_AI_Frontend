import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Active product + document context for AI Workspace — shell for future wiring. */
@Component({
  selector: 'app-product-context-panel',
  standalone: true,
  templateUrl: './product-context-panel.component.html',
  styleUrls: ['./product-context-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContextPanelComponent {}
