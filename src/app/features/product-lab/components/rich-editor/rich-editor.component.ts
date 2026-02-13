import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bold, Italic, Link, List } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rich-editor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './rich-editor.component.html',
  styleUrls: ['./rich-editor.component.scss']
})
export class RichEditorComponent {
  @Input() content = `PitchCraft Analytics is a predictive revenue intelligence platform designed for B2B SaaS startups. It uses historical deal data and market signals to forecast revenue with 94% accuracy.

Key features include:
- Automated pipeline health scoring
- Sales rep performance attribution
- Cohort-based churn prediction`;
  
  @Output() contentChange = new EventEmitter<string>();
  
  readonly tools = [
    { icon: Bold, name: 'bold' },
    { icon: Italic, name: 'italic' },
    { icon: Link, name: 'link' },
    { icon: List, name: 'list' }
  ];
  
  onContentChange(): void {
    this.contentChange.emit(this.content);
  }
  
  formatText(command: string): void {
    document.execCommand(command, false);
  }
}