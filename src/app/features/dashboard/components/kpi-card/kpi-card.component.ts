import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { KPI } from '../../models/dashboard.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, NgClass],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss']
})
export class KpiCardComponent {
  @Input() kpi: KPI = {
    label: '',
    value: 0,
    icon: '',
    trend: { value: 0, isPositive: false }
  };

  getIcon(iconName: string): string {
    // Extract just the icon name from lucide:icon-name format
    return iconName.replace('lucide:', '');
  }

  getTrendIcon(isPositive: boolean): string | null {
    if (isPositive) {
      return 'trending-up';
    } else if (isPositive === false) {
      return 'trending-down';
    }
    return null;
  }

  getTrendClass(isPositive: boolean): string {
    if (isPositive === true) {
      return 'success';
    } else if (isPositive === false) {
      return 'danger';
    }
    return 'neutral';
  }

  formatValue(value: number, isPercentage?: boolean): string {
    if (isPercentage) {
      return `${value}%`;
    }
    // Format large numbers with commas
    return value.toLocaleString();
  }
}