import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface CampaignOption {
  id: string;
  name: string;
}

export interface ViewTabOption {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-campaign-view-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './campaign-view-bar.component.html',
  styleUrls: ['./campaign-view-bar.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CampaignViewBarComponent {
  /** Campaign dropdown options */
  @Input() campaigns: CampaignOption[] = [];
  /** Selected campaign id (two-way via selectedCampaignIdChange) */
  @Input() selectedCampaignId: string = '';
  /** Whether to show the campaign selector */
  @Input() showCampaignSelector = true;
  /** Label for the campaign dropdown */
  @Input() campaignLabel = 'Campaign';

  /** View mode tabs: value is current mode */
  @Input() viewMode: string = 'board';
  /** Tab options. Default: Board, List, Calendar */
  @Input() viewTabOptions: ViewTabOption[] = [
    { value: 'board', label: 'Board', icon: 'lucide:kanban' },
    { value: 'list', label: 'List', icon: 'lucide:list' },
    { value: 'calendar', label: 'Calendar', icon: 'lucide:calendar' },
  ];

  /** Whether to show the Performance button */
  @Input() showPerformance = true;

  @Output() selectedCampaignIdChange = new EventEmitter<string>();
  @Output() viewModeChange = new EventEmitter<string>();
  @Output() performanceClick = new EventEmitter<void>();

  onCampaignChange(id: string): void {
    this.selectedCampaignIdChange.emit(id);
  }

  setViewMode(value: string): void {
    this.viewModeChange.emit(value);
  }

  onPerformanceClick(): void {
    this.performanceClick.emit();
  }
}
