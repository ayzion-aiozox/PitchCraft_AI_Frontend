import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-ai-loading',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './ai-loading.component.html',
  styleUrls: ['./ai-loading.component.scss']
})
export class AiLoadingComponent {
  @Input() title = 'AI is analyzing your input...';
  @Input() subtitle = 'Extracting competitive differentiators and pricing signals.';
  readonly Sparkles = Sparkles;
}