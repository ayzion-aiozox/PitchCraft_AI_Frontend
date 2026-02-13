import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from '../../core/services/breakpoint.service';

// Child Components
import { KpiGridComponent } from './components/kpi-grid/kpi-grid.component';
import { AiAssistantWidgetComponent } from './components/ai-assistant-widget/ai-assistant-widget.component';
import { PriorityFeedComponent } from './components/priority-feed/priority-feed.component';
import { PipelineFunnelComponent } from './components/pipeline-funnel/pipeline-funnel.component';
import { VitalityScoreComponent } from './components/vitality-score/vitality-score.component';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';

// Models & Services
import { KPI, FunnelStage, ActionItem, ChatMessage } from './models/dashboard.model';
import { DashboardService } from '../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    KpiGridComponent,
    AiAssistantWidgetComponent,
    PriorityFeedComponent,
    PipelineFunnelComponent,
    VitalityScoreComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly breakpoint = inject(BreakpointService);
  private destroy$ = new Subject<void>();

  // State from Service
  kpis: KPI[] = [];
  funnelStages: FunnelStage[] = [];
  actions: ActionItem[] = [];
  vitalityScore: number = 0;
  messages: ChatMessage[] = [];
  isTyping: boolean = false;
  
  // Quick Actions for AI Assistant
  quickActions = ['Generate Report', 'Draft Email', 'Analyze Trends'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.subscribeToState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToState(): void {
    this.dashboardService.dashboardState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.kpis = state.kpis;
        this.funnelStages = state.funnelStages;
        this.actions = state.actions;
        this.vitalityScore = state.vitalityScore;
        this.messages = state.messages;
        this.isTyping = state.isTyping;
      });
  }

  // Event Handlers
  onSendMessage(message: string): void {
    this.dashboardService.sendMessage(message);
  }

  onQuickAction(action: string): void {
    this.dashboardService.sendMessage(action);
  }

  onDismissAction(index: number): void {
    this.dashboardService.dismissAction(index);
  }

  onRefresh(): void {
    this.dashboardService.refreshDashboard();
  }
}