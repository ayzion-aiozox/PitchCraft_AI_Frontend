import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Right-rail assistant for AI Idea Lab — shell for future wiring. */
@Component({
  selector: 'app-ai-lab-assistant',
  standalone: true,
  templateUrl: './ai-lab-assistant.component.html',
  styleUrls: ['./ai-lab-assistant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiLabAssistantComponent {}
