import { Injectable } from '@angular/core';
import {
  SETTINGS_BREADCRUMB_BASE,
  SETTINGS_TABS,
  GENERAL_DEFAULT,
  TEAM_MEMBERS,
  SEAT_USAGE,
  RECENT_ACTIVITY,
  BILLING_PLAN,
  USAGE_STATS,
  INVOICES,
  DATA_RETENTION_OPTIONS,
  API_KEYS,
  WEBHOOK_EVENTS,
} from '../constants/workspace-settings.constants';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceSettingsService {
  getBreadcrumbBase(): string {
    return SETTINGS_BREADCRUMB_BASE;
  }

  getTabs(): { id: string; label: string }[] {
    return [...SETTINGS_TABS];
  }

  getGeneralDefaults(): typeof GENERAL_DEFAULT {
    return { ...GENERAL_DEFAULT };
  }

  getTeamMembers(): typeof TEAM_MEMBERS {
    return [...TEAM_MEMBERS];
  }

  getSeatUsage(): { used: number; total: number } {
    return { ...SEAT_USAGE };
  }

  getRecentActivity(): typeof RECENT_ACTIVITY {
    return [...RECENT_ACTIVITY];
  }

  getBillingPlan(): typeof BILLING_PLAN {
    return { ...BILLING_PLAN };
  }

  getUsageStats(): typeof USAGE_STATS {
    return [...USAGE_STATS];
  }

  getInvoices(): typeof INVOICES {
    return [...INVOICES];
  }

  getDataRetentionOptions(): string[] {
    return [...DATA_RETENTION_OPTIONS];
  }

  getApiKeys(): typeof API_KEYS {
    return [...API_KEYS];
  }

  getWebhookEvents(): typeof WEBHOOK_EVENTS {
    return [...WEBHOOK_EVENTS];
  }
}
