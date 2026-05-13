import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Agent selection UI for AI Workspace — shell for future wiring. */
@Component({
  selector: 'app-agent-selector',
  standalone: true,
  templateUrl: './agent-selector.component.html',
  styleUrls: ['./agent-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentSelectorComponent {}
