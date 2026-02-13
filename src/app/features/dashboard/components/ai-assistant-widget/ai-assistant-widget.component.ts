import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../models/dashboard.model';

@Component({
  selector: 'app-ai-assistant-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ai-assistant-widget.component.html',
  styleUrls: ['./ai-assistant-widget.component.scss']
})
export class AiAssistantWidgetComponent {
  @Input() messages: ChatMessage[] = [];
  @Input() isTyping: boolean = false;
  @Input() quickActions: string[] = ['Generate Report', 'Draft Email', 'Analyze Trends'];
  
  @Output() sendMessage = new EventEmitter<string>();
  @Output() quickAction = new EventEmitter<string>();

  chatInput: string = '';

  onSendMessage(): void {
    if (!this.chatInput.trim()) return;
    
    this.sendMessage.emit(this.chatInput);
    this.chatInput = '';
  }

  onQuickAction(action: string): void {
    this.quickAction.emit(action);
  }
}