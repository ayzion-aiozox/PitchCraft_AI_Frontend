import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Single chat message bubble — shell for future wiring. */
@Component({
  selector: 'app-message-bubble',
  standalone: true,
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageBubbleComponent {}
