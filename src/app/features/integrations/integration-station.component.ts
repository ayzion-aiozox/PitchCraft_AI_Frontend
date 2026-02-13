import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';
import { IntegrationService } from '../../shared/services/integration.service';
import type { Integration, IntegrationTab } from '../../shared/models/integration.model';

@Component({
  selector: 'app-integration-station',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './integration-station.component.html',
  styleUrls: ['./integration-station.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IntegrationStationComponent {
  private readonly integrationService = inject(IntegrationService);

  trackByTabId = (_: number, tab: IntegrationTab) => tab.id;
  trackByIntegrationId = (_: number, i: Integration) => i.id;

  headerTitle = this.integrationService.getBreadcrumbBase();
  breadcrumbActive = this.integrationService.getBreadcrumbActive();
  pageTitle = this.integrationService.getPageTitle();
  pageSubtitle = this.integrationService.getPageSubtitle();
  searchPlaceholder = this.integrationService.getSearchPlaceholder();

  tabs: IntegrationTab[] = this.integrationService.getTabs();
  activeTabId = 'all';
  integrations: Integration[] = this.integrationService.getIntegrations();
  searchQuery = '';

  get filteredIntegrations(): Integration[] {
    let list = this.integrationService.getIntegrations(
      this.activeTabId === 'all' ? undefined : this.activeTabId
    );
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return list;
  }

  setActiveTab(id: string): void {
    this.activeTabId = id;
  }

  getBadgeClass(integration: Integration): string {
    if (integration.badgeStyle === 'error') return 'integration-badge integration-badge--error';
    if (integration.badgeStyle === 'active') return 'integration-badge integration-badge--active';
    if (integration.status === 'connected') return 'integration-badge integration-badge--connected';
    return 'integration-badge integration-badge--disconnected';
  }

  getBadgeLabel(integration: Integration): string {
    if (integration.status === 'error') return 'Auth Error';
    if (integration.badgeStyle === 'active') return 'Active';
    if (integration.status === 'connected') return 'Connected';
    return 'Not Connected';
  }

  getActionButtonClass(integration: Integration): string {
    if (integration.actionType === 'reconnect') return 'btn btn-sm integration-btn-reconnect';
    if (integration.actionType === 'connect') return 'btn btn-outline btn-sm';
    if (integration.actionType === 'configure') return 'btn btn-ghost btn-sm integration-btn-config';
    return 'btn btn-secondary btn-sm';
  }
}
