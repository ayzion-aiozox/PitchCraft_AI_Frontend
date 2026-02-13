import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Check } from 'lucide-angular';

export interface WizardStep {
  id: number;
  label: string;
  status: 'completed' | 'active' | 'pending';
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {
  @Input() steps: WizardStep[] = [];
  @Output() stepClick = new EventEmitter<number>();
  
  readonly Check = Check;
  
  onStepClick(stepId: number): void {
    this.stepClick.emit(stepId);
  }
  
  isStepClickable(step: WizardStep): boolean {
    return step.status === 'completed' || step.status === 'active';
  }
}