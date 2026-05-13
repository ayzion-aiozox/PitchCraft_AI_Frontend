/**
 * AI Idea Lab — state used by `ai-idea-lab.component.html` (signals + lists + handlers).
 * If `ng serve` reports missing members here, restart the dev server (stale incremental compile).
 */
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentCardComponent } from './components/agent-card/agent-card.component';
import { AiLabAssistantComponent } from './components/ai-lab-assistant/ai-lab-assistant.component';
import { FeasibilityScoreComponent } from './components/feasibility-score/feasibility-score.component';
import { IntelligenceReportComponent } from './components/intelligence-report/intelligence-report.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';

type ResearchDepthId = 'quick' | 'deep' | 'full';
type RightTabId = 'assistant' | 'history' | 'saved';

@Component({
  selector: 'app-ai-idea-lab',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AgentCardComponent,
    AiLabAssistantComponent,
    FeasibilityScoreComponent,
    IntelligenceReportComponent,
    ProgressTrackerComponent,
  ],
  templateUrl: './ai-idea-lab.component.html',
  styleUrls: ['./ai-idea-lab.component.scss', './ai-idea-lab.theme.scss'],
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AiIdeaLabComponent {
  readonly productName = 'Cyphary';

  readonly researchDepths: {
    id: ResearchDepthId;
    icon: string;
    title: string;
    description: string;
  }[] = [
    { id: 'quick', icon: 'lucide:zap', title: 'Quick Scan', description: '5 mins • Surface insights' },
    { id: 'deep', icon: 'lucide:search', title: 'Deep Analysis', description: '15 mins • Comprehensive' },
    { id: 'full', icon: 'lucide:book-open', title: 'Full Report', description: '30 mins • Max depth' },
  ];
  readonly selectedDepth = signal<ResearchDepthId>('deep');

  readonly agentToggles: { id: string; label: string; icon: string }[] = [
    { id: 'feasibility', label: 'Feasibility Agent', icon: 'lucide:check-square' },
    { id: 'market', label: 'Market Agent', icon: 'lucide:pie-chart' },
    { id: 'competitor', label: 'Competitor Agent', icon: 'lucide:crosshair' },
    { id: 'timing', label: 'Timing Agent', icon: 'lucide:clock' },
    { id: 'sharpening', label: 'Sharpening Agent', icon: 'lucide:sparkles' },
    { id: 'risk', label: 'Risk Agent', icon: 'lucide:alert-triangle' },
    { id: 'opportunity', label: 'Opportunity Agent', icon: 'lucide:lightbulb' },
  ];
  private readonly agentOn = signal<Record<string, boolean>>({
    feasibility: true,
    market: true,
    competitor: true,
    timing: true,
    sharpening: true,
    risk: false,
    opportunity: true,
  });

  readonly completedAgents = [
    {
      title: 'Market Agent',
      subtitle: 'Completed TAM & SAM analysis',
      insight: 'Market size estimated at $4.2B with 23% YoY growth.',
      icon: 'lucide:pie-chart',
    },
    {
      title: 'Feasibility Agent',
      subtitle: 'Technical & Financial validation',
      insight: 'High technical feasibility; strong margin potential.',
      icon: 'lucide:check-square',
    },
  ];

  readonly runningAgents = [
    {
      title: 'Competitor Agent',
      subtitle: 'Mapping feature matrices of top 10 rivals',
      icon: 'lucide:crosshair',
      progress: 45,
    },
    {
      title: 'Timing Agent',
      subtitle: 'Analyzing macro market readiness',
      icon: 'lucide:clock',
      progress: 80,
    },
  ];

  readonly queuedAgents = [
    {
      title: 'Sharpening Agent',
      subtitle: 'Waiting for prior analyses to finish',
      icon: 'lucide:sparkles',
    },
    {
      title: 'Opportunity Agent',
      subtitle: 'Waiting for competitor data',
      icon: 'lucide:lightbulb',
    },
  ];

  readonly suggestedPrompts = [
    'What is my biggest competitive risk?',
    'Which market segment should I target first?',
    'Show me early compliance features',
  ];

  readonly rightTabs: { id: RightTabId; label: string }[] = [
    { id: 'assistant', label: 'Assistant' },
    { id: 'history', label: 'History' },
    { id: 'saved', label: 'Saved' },
  ];
  readonly activeTab = signal<RightTabId>('assistant');

  isAgentOn(id: string): boolean {
    return this.agentOn()[id] ?? false;
  }

  toggleAgent(id: string): void {
    this.agentOn.update((m) => ({ ...m, [id]: !m[id] }));
  }

  selectDepth(id: ResearchDepthId): void {
    this.selectedDepth.set(id);
  }

  selectTab(id: RightTabId): void {
    this.activeTab.set(id);
  }
}
