import type { KanbanColumn } from '../models/kanban.model';

/** Default user avatar URL for campaign engine header */
export const CAMPAIGN_ENGINE_DEFAULT_AVATAR =
  'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAsian%2F1';

/** Default user name for campaign engine header */
export const CAMPAIGN_ENGINE_DEFAULT_USER_NAME = 'Sarah Jenning';

/** Breadcrumb active part shown in header (e.g. "Campaign Central") */
export const CAMPAIGN_ENGINE_BREADCRUMB_ACTIVE = 'Campaign Central';

/** Campaign list for selector */
export const CAMPAIGN_LIST = [
  { id: '1', name: 'Q1 Cloud Security Launch' },
  { id: '2', name: 'Q1 Fintech Outreach' },
  { id: '3', name: 'SaaS CTO Sequence' },
] as const;

/** Kanban column accent CSS variable names */
export const KANBAN_COLUMN_ACCENTS = {
  prospecting: 'var(--col-prospecting)',
  strategy: 'var(--col-strategy)',
  sent: 'var(--col-sent)',
  responded: 'var(--col-responded)',
  booked: 'var(--col-booked)',
  closed: 'var(--col-closed)',
} as const;

/** Default kanban columns and cards (demo data) */
export const DEFAULT_KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'prospecting',
    title: 'Prospecting',
    count: 12,
    accentColor: KANBAN_COLUMN_ACCENTS.prospecting,
    cards: [
      {
        id: '1',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FSouth%20Asian%2F3',
        name: 'Devon Lane',
        role: 'VP Eng @ Sural',
        metaTags: [
          { text: '2d ago', showClock: true },
          { text: 'Drafting', isStuck: false },
        ],
      },
      {
        id: '2',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F35-50%2FHispanic%2F2',
        name: 'Marta C.',
        role: 'Director @ TechFlow',
        metaTags: [{ text: '8d in stage', isStuck: true }],
      },
    ],
  },
  {
    id: 'strategy',
    title: 'Strategy Ready',
    count: 5,
    accentColor: KANBAN_COLUMN_ACCENTS.strategy,
    cards: [
      {
        id: '3',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F50-65%2FEuropean%2F1',
        name: 'Robert Fox',
        role: 'CTO @ Volare',
        statusChip: { text: 'High Intent', bg: '#eff6ff', color: 'var(--primary)' },
        metaTags: [{ text: 'Ready to send', isStuck: false }],
        strategyIcon: 'lucide:linkedin',
        sendButton: true,
      },
    ],
  },
  {
    id: 'sent',
    title: 'Outreach Sent',
    count: 45,
    accentColor: KANBAN_COLUMN_ACCENTS.sent,
    cards: [
      {
        id: '4',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FMiddle%20Eastern%2F4',
        name: 'Sarah J.',
        role: 'Head of AI @ Plura',
        strategyIcon: 'lucide:mail',
        metaTags: [{ text: 'Opened 2h ago', icon: 'lucide:eye', iconColor: 'var(--success)' }],
      },
      {
        id: '5',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FEast%20Asian%2F2',
        name: 'Kenji M.',
        role: 'VP Product @ Sol',
        strategyIcon: 'lucide:mail',
        metaTags: [
          { text: 'Step 2 of 4', isStuck: false },
          { text: 'Queued', isStuck: false },
        ],
      },
      {
        id: '6',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F35-50%2FNorth%20American%2F3',
        name: 'Eleanor P.',
        role: 'Founder @ Swift',
        strategyIcon: 'lucide:linkedin',
        metaTags: [{ text: 'No reply 14d', isStuck: true }],
      },
    ],
  },
  {
    id: 'responded',
    title: 'Responded',
    count: 8,
    accentColor: KANBAN_COLUMN_ACCENTS.responded,
    countBadgeStyles: { background: '#dcfce7', color: '#166534' },
    cards: [
      {
        id: '7',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FAfrican%2F3',
        name: 'David O.',
        role: 'CIO @ Bank Corp',
        metaTags: [],
        replyText: '"Sounds interesting, are you free this Friday?"',
        replyAction: 'Categorize Reply',
        leftBorderAccent: true,
      },
      {
        id: '8',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEuropean%2F5',
        name: 'Lisa Ray',
        role: 'Sr Engineer',
        metaTags: [],
        replyText: '"Not the right person, please contact..."',
        replyAction: 'Mark as: Referral',
      },
    ],
  },
  {
    id: 'booked',
    title: 'Meeting Booked',
    count: 3,
    accentColor: KANBAN_COLUMN_ACCENTS.booked,
    cards: [
      {
        id: '9',
        avatarUrl: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FHispanic%2F4',
        name: 'Javi Perez',
        role: 'Lead Dev @ Giga',
        strategyIcon: 'lucide:calendar',
        strategyIconBg: '#f3e8ff',
        strategyIconColor: '#9333ea',
        metaTags: [],
        metaRight: 'Tomorrow, 2 PM',
        metaRightColor: '#9333ea',
      },
    ],
  },
  {
    id: 'closed',
    title: 'Closed',
    accentColor: KANBAN_COLUMN_ACCENTS.closed,
    cards: [
      {
        id: '10',
        placeholderInitials: 'JD',
        name: 'John Doe',
        role: 'Acme Corp',
        metaTags: [{ text: 'Lost: No Budget', isStuck: false }],
        opacity: 0.7,
      },
    ],
  },
];

/** Team avatar URLs for control bar (e.g. campaign collaborators) */
export const DEFAULT_TEAM_AVATARS = [
  'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F2',
  'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAfrican%2F1',
];
