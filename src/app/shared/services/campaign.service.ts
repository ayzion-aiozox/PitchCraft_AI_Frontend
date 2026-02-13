import { Injectable } from '@angular/core';
import type { KanbanColumn } from '../models/kanban.model';
import {
  CAMPAIGN_LIST,
  DEFAULT_KANBAN_COLUMNS,
  CAMPAIGN_ENGINE_DEFAULT_AVATAR,
  CAMPAIGN_ENGINE_DEFAULT_USER_NAME,
  CAMPAIGN_ENGINE_BREADCRUMB_ACTIVE,
  DEFAULT_TEAM_AVATARS,
} from '../constants/campaign-engine.constants';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  /** List of campaigns for the selector */
  getCampaigns(): { id: string; name: string }[] {
    return [...CAMPAIGN_LIST];
  }

  /** Kanban columns and cards (from API or constants) */
  getKanbanColumns(): KanbanColumn[] {
    return DEFAULT_KANBAN_COLUMNS;
  }

  /** Current user avatar URL for campaign engine header */
  getUserAvatarUrl(): string {
    return CAMPAIGN_ENGINE_DEFAULT_AVATAR;
  }

  /** Current user display name */
  getUserName(): string {
    return CAMPAIGN_ENGINE_DEFAULT_USER_NAME;
  }

  /** Breadcrumb active segment for Campaign Engine header */
  getBreadcrumbActive(): string {
    return CAMPAIGN_ENGINE_BREADCRUMB_ACTIVE;
  }

  /** Team/collaborator avatar URLs for control bar */
  getTeamAvatarUrls(): string[] {
    return [...DEFAULT_TEAM_AVATARS];
  }
}
