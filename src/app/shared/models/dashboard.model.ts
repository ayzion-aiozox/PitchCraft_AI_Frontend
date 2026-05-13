export interface TrendData {
  value: number;
  isPositive: boolean;
}

export interface KPI {
  label: string;
  value: number;
  icon: string;
  trend: TrendData;
  footerText?: string;
  isPercentage?: boolean;
  progressValue?: number;
  /** Short badge text on the KPI card (e.g. "+2 products", "+16% week") */
  badgeCaption?: string;
}

export interface FunnelStage {
  label: string;
  value: string;
  width: string;
  color: string;
}

export interface ActionItem {
  title: string;
  meta: string;
  badgeType: 'warning' | 'info' | 'success';
  badgeText: string;
  expanded?: boolean;
}

export interface ChatMessage {
  text: string;
  isAi: boolean;
}

export interface DashboardState {
  kpis: KPI[];
  funnelStages: FunnelStage[];
  actions: ActionItem[];
  vitalityScore: number;
  messages: ChatMessage[];
  isTyping: boolean;
}
