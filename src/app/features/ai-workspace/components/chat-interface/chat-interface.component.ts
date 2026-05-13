import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Main chat surface for AI Workspace — shell for future wiring. */
@Component({
  selector: 'app-chat-interface',
  standalone: true,
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatInterfaceComponent {}
