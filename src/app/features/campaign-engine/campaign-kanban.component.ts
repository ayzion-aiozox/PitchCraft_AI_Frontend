import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';
import { CampaignViewBarComponent } from '../../shared/components/layout/campaign-view-bar/campaign-view-bar.component';
import { StatusBadgeComponent } from '../../shared/components/ui/status-badge/status-badge.component';
import { CampaignService } from '../../shared/services/campaign.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import type { KanbanColumn, KanbanCard } from '../../shared/models/kanban.model';

@Component({
  selector: 'app-campaign-kanban',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    CampaignViewBarComponent,
    StatusBadgeComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './campaign-kanban.component.html',
  styleUrls: ['./campaign-kanban.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CampaignKanbanComponent {
  private readonly campaignService = inject(CampaignService);

  viewMode: 'board' | 'list' | 'calendar' = 'board';
  /** When true, main content shows Performance view instead of board/list/calendar */
  showPerformanceView = false;
  selectedCampaignId = this.campaignService.getCampaigns()[0]?.id ?? '';

  campaigns = this.campaignService.getCampaigns();
  columns: KanbanColumn[] = this.campaignService.getKanbanColumns();
  userAvatarUrl = this.campaignService.getUserAvatarUrl();
  userName = this.campaignService.getUserName();
  breadcrumbActive = this.campaignService.getBreadcrumbActive();
  teamAvatars = this.campaignService.getTeamAvatarUrls();

  get selectedCampaignName(): string {
    return this.campaigns.find((c) => c.id === this.selectedCampaignId)?.name ?? '';
  }

  /** All cards across columns for List view */
  get listRows(): { columnTitle: string; card: KanbanCard }[] {
    const rows: { columnTitle: string; card: KanbanCard }[] = [];
    this.columns.forEach((col) => {
      col.cards.forEach((card) => rows.push({ columnTitle: col.title, card }));
    });
    return rows;
  }

  /** Selected date on the calendar (Angular Material mat-calendar) */
  calendarSelectedDate: Date | null = null;
  /** Initial month shown by mat-calendar */
  calendarStartAt = new Date();

  setViewMode(mode: string): void {
    if (mode === 'board' || mode === 'list' || mode === 'calendar') {
      this.showPerformanceView = false;
      this.viewMode = mode;
    }
  }

  onPerformanceClick(): void {
    this.showPerformanceView = true;
  }

  /** Performance KPIs for the selected campaign (placeholder data) */
  performanceKpis = [
    { label: 'Sent', value: 124, trend: 12, icon: 'lucide:send' },
    { label: 'Opened', value: 89, trend: 8, icon: 'lucide:mail-open' },
    { label: 'Replied', value: 34, trend: -2, icon: 'lucide:message-circle' },
    { label: 'Meetings', value: 12, trend: 5, icon: 'lucide:calendar-check' },
  ];

  /** Activity breakdown for chart placeholder */
  performanceBreakdown = [
    { label: 'Outreach', value: 45 },
    { label: 'Follow-up', value: 30 },
    { label: 'Meeting', value: 15 },
    { label: 'Other', value: 10 },
  ];
}
