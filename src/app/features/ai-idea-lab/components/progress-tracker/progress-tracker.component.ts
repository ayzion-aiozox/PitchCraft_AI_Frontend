import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Multi-agent progress for AI Idea Lab — shell for future wiring. */
@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressTrackerComponent {}
