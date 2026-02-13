import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { KPI } from '../../models/dashboard.model';

@Component({
  selector: 'app-kpi-grid',
  standalone: true,
  imports: [CommonModule, KpiCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './kpi-grid.component.html',
  styleUrls: ['./kpi-grid.component.scss']
})
export class KpiGridComponent {
  @Input() kpis: KPI[] = [];
}