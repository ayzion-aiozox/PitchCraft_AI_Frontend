import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { KPI } from './models/dashboard.model';
import { DashboardService } from '../../shared/services/dashboard.service';

interface CcMicroStat {
  label: string;
  value: number;
}

interface CcPipelineRow {
  label: string;
  pct: number;
  color: string;
  drop: string;
  highlighted?: boolean;
  criticalDrop?: boolean;
}

interface CcCampaign {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  open: string;
  replies: string;
  meetings: string;
  barPct: number;
  barColor: string;
}

interface CcLead {
  initials: string;
  avatarBg: string;
  name: string;
  role: string;
  score: number;
  scoreVariant: 'g' | 'c' | 'a';
}

interface CcTodo {
  icon: string;
  iconColor: string;
  iconBg: string;
  urgency: 'critical' | 'warning' | 'info';
  title: string;
  desc: string;
  btn: string;
  btnVariant: 'crit' | 'warn' | 'info';
}

interface CcActivity {
  dot: string;
  module: string;
  desc: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss', './command-center.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly dashboardService = inject(DashboardService);
  private readonly auth = inject(AuthService);

  kpis: KPI[] = [];
  vitalityScore = 68;

  readonly today = new Date();

  readonly kpiSparkBars: { h: number; bg: string }[][] = [
    [
      { h: 4, bg: 'rgba(30,58,138,0.15)' },
      { h: 7, bg: 'rgba(30,58,138,0.25)' },
      { h: 9, bg: 'rgba(30,58,138,0.35)' },
      { h: 12, bg: 'rgba(30,58,138,0.5)' },
      { h: 15, bg: 'rgba(30,58,138,0.65)' },
      { h: 17, bg: 'rgba(30,58,138,0.85)' },
      { h: 20, bg: '#2da86e' },
    ],
    [
      { h: 4, bg: 'rgba(6,182,212,0.15)' },
      { h: 6, bg: 'rgba(6,182,212,0.25)' },
      { h: 9, bg: 'rgba(6,182,212,0.35)' },
      { h: 12, bg: 'rgba(6,182,212,0.5)' },
      { h: 15, bg: 'rgba(6,182,212,0.65)' },
      { h: 17, bg: 'rgba(6,182,212,0.85)' },
      { h: 20, bg: '#0d9488' },
    ],
    [
      { h: 20, bg: 'rgba(139,92,246,0.85)' },
      { h: 18, bg: 'rgba(139,92,246,0.75)' },
      { h: 16, bg: 'rgba(139,92,246,0.65)' },
      { h: 12, bg: 'rgba(139,92,246,0.5)' },
      { h: 10, bg: 'rgba(139,92,246,0.4)' },
      { h: 7, bg: 'rgba(139,92,246,0.3)' },
      { h: 3, bg: 'rgba(139,92,246,0.15)' },
    ],
    [
      { h: 3, bg: 'rgba(34,197,94,0.15)' },
      { h: 5, bg: 'rgba(34,197,94,0.25)' },
      { h: 9, bg: 'rgba(34,197,94,0.4)' },
      { h: 11, bg: 'rgba(34,197,94,0.5)' },
      { h: 14, bg: 'rgba(34,197,94,0.65)' },
      { h: 17, bg: 'rgba(34,197,94,0.8)' },
      { h: 20, bg: '#22c55e' },
    ],
  ];

  readonly heroInsight =
    'Campaign response rate is dragging your score — fix messaging first.';
  readonly productName = 'Cyphary';

  /** Hero micro-KPIs — neutral type; bar fill styled in command-center.scss (primary token) */
  readonly microStats: CcMicroStat[] = [
    { label: 'Lead Quality', value: 84 },
    { label: 'Campaign Health', value: 52 },
    { label: 'Persona Coverage', value: 91 },
    { label: 'Market Alignment', value: 74 },
  ];

  readonly pipelineRows: CcPipelineRow[] = [
    { label: 'Product', pct: 100, color: '#2da86e', drop: '—' },
    { label: 'Leads', pct: 95, color: '#2da86e', drop: '↓5%' },
    { label: 'Profiles', pct: 82, color: '#2da86e', drop: '↓13%' },
    { label: 'Strategy', pct: 45, color: '#ef4444', drop: '↓45%', highlighted: true, criticalDrop: true },
    { label: 'Outreach', pct: 38, color: '#f59e0b', drop: '↓7%' },
    { label: 'Meetings', pct: 28, color: '#ef4444', drop: '↓10%' },
    { label: 'Customers', pct: 18, color: '#ef4444', drop: '↓10%' },
  ];

  readonly campaigns: CcCampaign[] = [
    { name: 'Q1 Cloud Security Launch', status: 'warning', open: '28%', replies: '14', meetings: '6', barPct: 28, barColor: '#f59e0b' },
    { name: 'Technical Scale-Up Outreach', status: 'critical', open: '8%', replies: '3', meetings: '1', barPct: 8, barColor: '#ef4444' },
    { name: 'Enterprise FinTech Sequence', status: 'healthy', open: '42%', replies: '28', meetings: '12', barPct: 42, barColor: '#22c55e' },
  ];

  readonly leads: CcLead[] = [
    { initials: 'SJ', avatarBg: '#2da86e', name: 'Sarah Jenkins', role: 'CTO @ FinFlow', score: 94, scoreVariant: 'g' },
    { initials: 'RP', avatarBg: '#7c3aed', name: 'Raj Patel', role: 'VP Eng @ PayStream', score: 88, scoreVariant: 'c' },
    { initials: 'EW', avatarBg: '#0891b2', name: 'Elena Wu', role: 'Head of Product @ Nexus', score: 82, scoreVariant: 'c' },
    { initials: 'JC', avatarBg: '#15803d', name: 'James Carter', role: 'Director Eng @ Bolt', score: 76, scoreVariant: 'a' },
    { initials: 'MC', avatarBg: '#92400e', name: 'Marta Chen', role: 'CTO @ TechFlow', score: 71, scoreVariant: 'a' },
  ];

  readonly topics: { text: string; kind: 'hot' | 'med' | 'cool' }[] = [
    { text: 'AI Outbound', kind: 'hot' },
    { text: 'Signal-Based Selling', kind: 'hot' },
    { text: 'PLG Motion', kind: 'med' },
    { text: 'Intent Data', kind: 'med' },
    { text: 'Multi-threading', kind: 'med' },
    { text: 'RevOps', kind: 'cool' },
    { text: 'Buyer Committees', kind: 'cool' },
    { text: 'Deliverability', kind: 'cool' },
  ];

  readonly competitiveAlert =
    'Competitive alert: A competitor launched a feature matching your Outreach module. 3 mutual prospects evaluating — review positioning.';

  readonly todos: CcTodo[] = [
    { icon: 'lucide:alert-triangle', iconColor: '#ef4444', iconBg: '#fef2f2', urgency: 'critical', title: 'Campaign messaging broken', desc: 'Response rate dropped 32% overnight', btn: 'Fix Now', btnVariant: 'crit' },
    { icon: 'lucide:user-x', iconColor: '#ef4444', iconBg: '#fef2f2', urgency: 'critical', title: 'ICP mismatch detected', desc: '312 leads outside target segment', btn: 'Fix Now', btnVariant: 'crit' },
    { icon: 'lucide:sparkles', iconColor: '#f59e0b', iconBg: '#fffbeb', urgency: 'warning', title: '8 leads need strategy', desc: 'High-score prospects waiting 5+ days', btn: 'Create Strategies', btnVariant: 'warn' },
    { icon: 'lucide:calendar', iconColor: '#f59e0b', iconBg: '#fffbeb', urgency: 'warning', title: '3 meetings need prep', desc: 'Calls at 2pm, 3:30pm, 5pm today', btn: 'View Meetings', btnVariant: 'warn' },
    { icon: 'lucide:line-chart', iconColor: '#475569', iconBg: '#ecfdf5', urgency: 'info', title: 'Weekly market report ready', desc: 'Competitor moves detected this week', btn: 'Read Report', btnVariant: 'info' },
  ];

  readonly activities: CcActivity[] = [
    { dot: '#0d9488', module: 'Lead Engine', desc: '84 new leads matched your Cyphary ICP criteria', time: '3 min ago' },
    { dot: '#8b5cf6', module: 'Campaign', desc: 'Sequence A paused — open rate fell below 18% threshold', time: '12 min ago' },
    { dot: '#22c55e', module: 'Meetings', desc: 'Demo booked: Ravi Patel, CTO @ LayerStack · Series B', time: '28 min ago' },
    { dot: '#2da86e', module: 'Strategy', desc: 'AI generated updated GTM playbook for enterprise segment', time: '1 hr ago' },
    { dot: '#f59e0b', module: 'Market Intel', desc: '3 competitor pricing changes detected in your segment', time: '2 hr ago' },
    { dot: '#ef4444', module: 'Alerts', desc: 'Deliverability warning: SPF record mismatch on domain', time: '4 hr ago' },
    { dot: '#0d9488', module: 'Lead Engine', desc: 'Persona coverage expanded — 2 new job titles added to ICP', time: '5 hr ago' },
  ];

  ngOnInit(): void {
    this.dashboardService.dashboardState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.kpis = state.kpis;
      this.vitalityScore = state.vitalityScore;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get userFirstName(): string {
    const u = this.auth.getUser();
    if (!u?.displayName?.trim()) return 'Sarah';
    return u.displayName.trim().split(/\s+/)[0] ?? 'Sarah';
  }

  get userInitials(): string {
    const u = this.auth.getUser();
    const n = u?.displayName?.trim();
    if (!n) return 'SJ';
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }

  kpiValueFmt(k: KPI): string {
    if (k.label === 'Leads Found' || k.label === 'Leads This Week') {
      return new Intl.NumberFormat().format(k.value);
    }
    if (k.isPercentage) return `${k.value}%`;
    return String(k.value);
  }

  trackMarkerLeft(): string {
    const v = Math.min(100, Math.max(0, this.vitalityScore));
    return `calc(${v}% - 7px)`;
  }

  sparkBars(index: number): { h: number; bg: string }[] {
    return this.kpiSparkBars[index] ?? this.kpiSparkBars[0];
  }

  kpiAccentBg(index: number): string {
    return ['#ecfdf5', '#ccfbf1', '#f5f3ff', '#f8fafc'][index] ?? '#ecfdf5';
  }

  kpiAccentFg(index: number): string {
    return ['#2da86e', '#0d9488', '#8b5cf6', '#22c55e'][index] ?? '#64748b';
  }

  kpiAccentBar(index: number): string {
    return ['#2da86e', '#0d9488', '#8b5cf6', '#22c55e'][index] ?? '#0d9488';
  }
}
