import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/ui/status-badge/status-badge.component';
import { CampaignService } from '../../shared/services/campaign.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import type { KanbanColumn } from '../../shared/models/kanban.model';

@Component({
  selector: 'app-campaign-kanban',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './campaign-kanban.component.html',
  styleUrls: ['./campaign-kanban.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CampaignKanbanComponent {
  private readonly campaignService = inject(CampaignService);

  viewMode: 'board' | 'list' | 'calendar' = 'board';
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
}
