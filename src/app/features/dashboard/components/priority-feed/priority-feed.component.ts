import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-priority-feed',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './priority-feed.component.html',
  styleUrls: ['./priority-feed.component.scss']
})
export class PriorityFeedComponent {
  @Input() actions: ActionItem[] = [];
  @Output() dismiss = new EventEmitter<number>();

  onDismiss(index: number): void {
    this.dismiss.emit(index);
  }
}