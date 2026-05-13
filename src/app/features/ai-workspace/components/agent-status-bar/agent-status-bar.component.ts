import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Agent run / status strip for AI Workspace — shell for future wiring. */
@Component({
  selector: 'app-agent-status-bar',
  standalone: true,
  templateUrl: './agent-status-bar.component.html',
  styleUrls: ['./agent-status-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentStatusBarComponent {}
