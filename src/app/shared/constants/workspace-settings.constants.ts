export const SETTINGS_BREADCRUMB_BASE = 'Settings';
export const SETTINGS_TABS = [
  { id: 'general', label: 'General' },
  { id: 'team', label: 'Team Members' },
  { id: 'billing', label: 'Billing & Credits' },
  { id: 'data', label: 'Data & Privacy' },
  { id: 'api', label: 'API Configuration' },
] as const;

export const GENERAL_DEFAULT = {
  workspaceName: 'PitchCraft HQ',
  workspaceUrl: 'pitchcraft.ai/w/hq-8392',
  timezoneOptions: [
    '(GMT-08:00) Pacific Time (US & Canada)',
    '(GMT-05:00) Eastern Time (US & Canada)',
    '(GMT+00:00) London',
  ],
  languageOptions: ['English (United States)', 'French', 'German'],
  primaryColor: '#1e3a8a',
  secondaryColor: '#06b6d4',
};

export const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Alex Morgan',
    email: 'alex@pitchcraft.ai',
    avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FNorth%20American%2F3',
    role: 'admin',
    roleLabel: 'Admin',
    status: 'active',
    lastActive: 'Just now',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@pitchcraft.ai',
    avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAsian%2F1',
    role: 'sales',
    roleLabel: 'Sales Rep',
    status: 'active',
    lastActive: '2h ago',
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@pitchcraft.ai',
    avatarUrl: '',
    initials: 'JD',
    role: 'viewer',
    roleLabel: 'Viewer',
    status: 'invited',
    lastActive: '-',
  },
];

export const SEAT_USAGE = { used: 3, total: 5 };
export const RECENT_ACTIVITY = [
  {
    id: '1',
    user: 'Alex Morgan',
    action: 'updated the',
    target: 'Q3 Strategy',
    targetType: 'campaign',
    suffix: 'settings.',
    time: '10m ago',
  },
  {
    id: '2',
    user: 'Sarah Chen',
    action: 'exported 50 leads from',
    target: 'Healthcare Vertical',
    targetType: 'campaign',
    suffix: '.',
    time: '2h ago',
  },
];

export const BILLING_PLAN = {
  name: 'Startup Plan',
  price: 49,
  period: '/mo',
  description: 'Perfect for small teams getting started with AI outreach.',
};
export const USAGE_STATS = [
  { label: 'AI Generations', used: 245, total: 500, percent: 49, color: 'secondary' },
  { label: 'Leads Discovered', used: '1.2k', total: 'Unlimited', percent: 25, color: 'success' },
  { label: 'API Calls', used: '8.5k', total: '10k', percent: 85, color: 'warning' },
];
export const INVOICES = [
  { date: 'Oct 1, 2023', description: 'Startup Plan - Monthly', amount: '$49.00' },
  { date: 'Sep 1, 2023', description: 'Startup Plan - Monthly', amount: '$49.00' },
];

export const DATA_RETENTION_OPTIONS = ['30 Days', '60 Days', '90 Days', 'Indefinite'];
export const API_KEYS = [
  { id: '1', name: 'Production App', keyPreview: 'pk_live_...9f3a', created: 'Oct 12, 2023', lastUsed: '5m ago' },
  { id: '2', name: 'Test Server', keyPreview: 'pk_test_...8d2x', created: 'Nov 01, 2023', lastUsed: '-' },
];
export const WEBHOOK_EVENTS = [
  { id: 'lead', label: 'New Lead Discovered', checked: true },
  { id: 'strategy', label: 'Strategy Completed', checked: false },
  { id: 'credit', label: 'Credit Limit Reached', checked: false },
];
