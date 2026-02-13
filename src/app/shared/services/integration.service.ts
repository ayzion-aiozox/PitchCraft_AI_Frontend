import { Injectable } from '@angular/core';
import type { Integration, IntegrationTab } from '../models/integration.model';
import {
  INTEGRATION_STATION_BREADCRUMB_BASE,
  INTEGRATION_STATION_BREADCRUMB_ACTIVE,
  INTEGRATION_PAGE_TITLE,
  INTEGRATION_PAGE_SUBTITLE,
  INTEGRATION_SEARCH_PLACEHOLDER,
  INTEGRATION_TABS,
  INTEGRATIONS_LIST,
} from '../constants/integrations.constants';

@Injectable({
  providedIn: 'root',
})
export class IntegrationService {
  getBreadcrumbBase(): string {
    return INTEGRATION_STATION_BREADCRUMB_BASE;
  }

  getBreadcrumbActive(): string {
    return INTEGRATION_STATION_BREADCRUMB_ACTIVE;
  }

  getPageTitle(): string {
    return INTEGRATION_PAGE_TITLE;
  }

  getPageSubtitle(): string {
    return INTEGRATION_PAGE_SUBTITLE;
  }

  getSearchPlaceholder(): string {
    return INTEGRATION_SEARCH_PLACEHOLDER;
  }

  getTabs(): IntegrationTab[] {
    return [...INTEGRATION_TABS];
  }

  getIntegrations(categoryFilter?: string): Integration[] {
    if (!categoryFilter || categoryFilter === 'all') {
      return [...INTEGRATIONS_LIST];
    }
    return INTEGRATIONS_LIST.filter((i) => i.category === categoryFilter);
  }
}
