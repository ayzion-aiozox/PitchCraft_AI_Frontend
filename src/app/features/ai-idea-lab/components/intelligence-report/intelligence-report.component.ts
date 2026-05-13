import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Intelligence report body for AI Idea Lab — shell for future wiring. */
@Component({
  selector: 'app-intelligence-report',
  standalone: true,
  templateUrl: './intelligence-report.component.html',
  styleUrls: ['./intelligence-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntelligenceReportComponent {}
