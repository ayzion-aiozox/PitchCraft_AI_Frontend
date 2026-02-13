export type IntegrationStatus = 'connected' | 'disconnected' | 'active' | 'error';

export type IntegrationActionType =
  | 'manage'
  | 'connect'
  | 'configure'
  | 'reconnect'
  | 'api';

export interface Integration {
  id: string;
  name: string;
  icon: string;
  /** Optional icon color (e.g. for simple-icons) */
  iconColor?: string;
  /** When icon is not an iconify set, show placeholder letter (e.g. Apollo "A") */
  iconPlaceholder?: string;
  category: 'crm' | 'communication' | 'data' | 'calendar' | 'storage';
  status: IntegrationStatus;
  description: string;
  actionType: IntegrationActionType;
  actionLabel: string;
  lastSync?: string;
  showToggle?: boolean;
  toggleChecked?: boolean;
  apiMasked?: boolean;
  badgeStyle?: 'default' | 'active' | 'error';
}

export interface IntegrationTab {
  id: string;
  label: string;
}
