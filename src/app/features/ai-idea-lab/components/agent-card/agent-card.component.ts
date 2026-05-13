import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Agent card in AI Idea Lab — shell for future wiring. */
@Component({
  selector: 'app-agent-card',
  standalone: true,
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCardComponent {}
