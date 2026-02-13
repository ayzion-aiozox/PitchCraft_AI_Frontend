/** Meta tag on a kanban card (e.g. "2d ago", "Drafting") */
export interface KanbanCardMeta {
  text: string;
  isStuck?: boolean;
  icon?: string;
  iconColor?: string;
  showClock?: boolean;
}

/** Single card in a kanban column */
export interface KanbanCard {
  id: string;
  avatarUrl?: string;
  placeholderInitials?: string;
  name: string;
  role: string;
  statusChip?: { text: string; bg: string; color: string };
  metaTags: KanbanCardMeta[];
  replyText?: string;
  replyAction?: string;
  leftBorderAccent?: boolean;
  opacity?: number;
  strategyIcon?: string;
  strategyIconBg?: string;
  strategyIconColor?: string;
  metaRight?: string;
  metaRightColor?: string;
  sendButton?: boolean;
}

/** Kanban pipeline column */
export interface KanbanColumn {
  id: string;
  title: string;
  count?: number;
  /** Optional inline styles for the count badge (e.g. { background: '#dcfce7', color: '#166534' }) */
  countBadgeStyles?: { [key: string]: string };
  accentColor: string;
  cards: KanbanCard[];
}
