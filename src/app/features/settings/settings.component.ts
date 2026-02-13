import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';
import { WorkspaceSettingsService } from '../../shared/services/workspace-settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SettingsComponent {
  private readonly settingsService = inject(WorkspaceSettingsService);

  headerTitle = this.settingsService.getBreadcrumbBase();
  tabs = this.settingsService.getTabs();
  activeTabId = 'general';
  breadcrumbActive = this.tabs.find((t) => t.id === this.activeTabId)?.label ?? 'General';

  general = this.settingsService.getGeneralDefaults();
  teamMembers = this.settingsService.getTeamMembers();
  seatUsage = this.settingsService.getSeatUsage();
  recentActivity = this.settingsService.getRecentActivity();
  billingPlan = this.settingsService.getBillingPlan();
  usageStats = this.settingsService.getUsageStats();
  invoices = this.settingsService.getInvoices();
  dataRetentionOptions = this.settingsService.getDataRetentionOptions();
  apiKeys = this.settingsService.getApiKeys();
  webhookEvents = this.settingsService.getWebhookEvents();

  setActiveTab(id: string): void {
    this.activeTabId = id;
    this.breadcrumbActive = this.tabs.find((t) => t.id === id)?.label ?? id;
  }

  trackByTabId = (_i: number, t: { id: string; label: string }) => t.id;

  getRoleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      admin: 'settings-badge settings-badge--admin',
      manager: 'settings-badge settings-badge--manager',
      sales: 'settings-badge settings-badge--sales',
      viewer: 'settings-badge settings-badge--viewer',
    };
    return map[role] ?? 'settings-badge settings-badge--viewer';
  }
}
