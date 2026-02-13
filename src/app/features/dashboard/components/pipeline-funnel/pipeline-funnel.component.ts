import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelStage } from '../../models/dashboard.model';

@Component({
  selector: 'app-pipeline-funnel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pipeline-funnel.component.html',
  styleUrls: ['./pipeline-funnel.component.scss']
})
export class PipelineFunnelComponent {
  @Input() funnelStages: FunnelStage[] = [];

  getWidth(width: string): number {
    return parseFloat(width.replace('%', ''));
  }

  getOpacity(index: number): number {
    // Decreasing opacity from 0.9 to 0.5 for first 4 stages, 1 for last stage
    if (index < 4) {
      return 0.9 - (index * 0.1);
    } else {
      return 1; // Final stage (closed) has full opacity
    }
  }

  isClosedStage(index: number): boolean {
    // Last stage is the closed/won stage with solid green color
    return index === this.funnelStages.length - 1;
  }
}