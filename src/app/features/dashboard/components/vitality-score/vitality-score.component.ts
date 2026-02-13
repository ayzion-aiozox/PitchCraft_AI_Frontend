import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vitality-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vitality-score.component.html',
  styleUrls: ['./vitality-score.component.scss']
})
export class VitalityScoreComponent {
  @Input() score: number = 0;

  getTransform(): string {
    // Calculate rotation based on score (0-100) mapped to -120 to +120 degrees
    // 0 score = -120 deg (far left), 100 score = +120 deg (far right), 50 score = 0 deg (center)
    const rotation = (this.score / 100) * 240 - 120;
    return `translateX(-50%) rotate(${rotation}deg)`;
  }

  getStatus(): string {
    if (this.score >= 80) return 'Excellent Growth';
    if (this.score >= 60) return 'Healthy Growth';
    if (this.score >= 40) return 'Moderate Growth';
    return 'Needs Attention';
  }
}
