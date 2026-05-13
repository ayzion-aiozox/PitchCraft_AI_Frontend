import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Task / run log for AI Workspace — shell for future wiring. */
@Component({
  selector: 'app-task-log',
  standalone: true,
  templateUrl: './task-log.component.html',
  styleUrls: ['./task-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskLogComponent {}
