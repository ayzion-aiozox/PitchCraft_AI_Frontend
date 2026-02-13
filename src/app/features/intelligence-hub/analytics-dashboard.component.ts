import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FunnelStep {
  label: string;
  count: number;
  pct: number;
  width: number;
  gradient: string;
  dropoff: string;
}

interface TopPersona {
  name: string;
  segment: string;
  avatar: string;
  responseRate: number;
  valueClass: string;
}

interface TrendTag {
  label: string;
  level: 'hot' | 'warm' | 'normal';
}

interface ShareOfVoiceItem {
  label: string;
  pct: number;
  color: string;
}

interface ReportOpportunity {
  title: string;
  text: string;
  icon: string;
  type: string;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnalyticsDashboardComponent {
  dateRangeLabel = 'Last 30 Days';
  userAvatar = 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FAsian%2F1';

  funnelSteps: FunnelStep[] = [
    { label: 'Product Loaded', count: 1250, pct: 100, width: 100, gradient: 'linear-gradient(to right, var(--primary), var(--tertiary))', dropoff: '5% drop-off' },
    { label: 'Persona Generated', count: 1187, pct: 95, width: 90, gradient: 'linear-gradient(to right, #1d4ed8, #60a5fa)', dropoff: '12% drop-off' },
    { label: 'Lead Identified', count: 1045, pct: 83, width: 78, gradient: 'linear-gradient(to right, #2563eb, var(--secondary))', dropoff: '28% drop-off' },
    { label: 'Strategy Created', count: 752, pct: 60, width: 50, gradient: 'linear-gradient(to right, #0ea5e9, var(--secondary))', dropoff: '45% drop-off' },
    { label: 'Meeting Booked', count: 413, pct: 33, width: 25, gradient: 'linear-gradient(to right, var(--secondary), var(--success))', dropoff: '8% conversion' },
    { label: 'Customer', count: 33, pct: 2.6, width: 15, gradient: 'linear-gradient(to right, var(--success), #34d399)', dropoff: '' },
  ];

  topPersonas: TopPersona[] = [
    { name: 'CTO Charles', segment: 'Tech / SaaS', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F2', responseRate: 94, valueClass: 'success' },
    { name: 'VP Sarah', segment: 'Marketing', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FSouth%20Asian%2F1', responseRate: 82, valueClass: 'primary' },
    { name: 'Director Dave', segment: 'Sales', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F50-65%2FNorth%20American%2F3', responseRate: 65, valueClass: 'warning' },
  ];

  trendingTags: TrendTag[] = [
    { label: 'Cloud Migration', level: 'hot' },
    { label: 'Cost Optimization', level: 'warm' },
    { label: 'Compliance', level: 'normal' },
    { label: 'AI Ethics', level: 'warm' },
    { label: 'Zero Trust', level: 'hot' },
    { label: 'Kubernetes', level: 'normal' },
    { label: 'Remote Work', level: 'normal' },
    { label: 'Cybersecurity', level: 'warm' },
  ];
  trendingHighlightCount = 12;
  trendingHighlightTopic = 'Zero Trust';

  shareOfVoice: ShareOfVoiceItem[] = [
    { label: 'PitchCraft AI', pct: 65, color: 'var(--primary)' },
    { label: 'OutreachX', pct: 25, color: 'var(--muted-foreground)' },
    { label: 'SalesBot', pct: 10, color: 'var(--border)' },
  ];
  competitiveAlertText = '3 leads comparing you to OutreachX in emails. Strategy adjustment recommended.';

  leadQualityTrend = 12;
  leadQualityData = [30, 45, 40, 60, 55, 75, 85];
  chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  timeSavedHours = '40.5';
  reportGeneratedDate = 'Oct 24, 2024';
  reportSummary = 'This week, PitchCraft AI analyzed 1,250 data points across your target market. We detected a significant shift in interest towards "Cost Optimization" among Fintech CTOs. Your current campaigns emphasizing "Compliance" are performing well, but pivoting to "Cost Efficiency" could increase conversion by ~15%.';

  reportOpportunities: ReportOpportunity[] = [
    { title: 'Strike Zone', text: '45 Mid-Market CTOs entered "Evaluation" phase.', icon: 'lucide:target', type: 'success' },
    { title: 'Conversation Starter', text: 'New "Cloud Security" regulation passed yesterday.', icon: 'lucide:message-circle', type: 'info' },
  ];
  reportActions = [
    'Launch "Cost Optimization" email sequence to Fintech segment.',
    'Review 12 high-intent leads who visited pricing page.',
    'Update "CTO Persona" with new pain point data.',
  ];
}
