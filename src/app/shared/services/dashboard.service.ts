import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { KPI, FunnelStage, ActionItem, ChatMessage, DashboardState } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private dashboardState = new BehaviorSubject<DashboardState>({
    kpis: [],
    funnelStages: [],
    actions: [],
    vitalityScore: 68,
    messages: [{
      text: "Hello! I've analyzed your latest campaign data. Would you like to review the top performing segments?",
      isAi: true
    }],
    isTyping: false
  });

  public dashboardState$ = this.dashboardState.asObservable();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const initialState: DashboardState = {
      kpis: this.getMockKPIs(),
      funnelStages: this.getMockFunnelStages(),
      actions: this.getMockActions(),
      vitalityScore: 68,
      messages: [{
        text: "Hello! I've analyzed your latest campaign data. Would you like to review the top performing segments?",
        isAi: true
      }],
      isTyping: false
    };

    this.dashboardState.next(initialState);
  }

  private getMockKPIs(): KPI[] {
    return [
      {
        label: 'Active Products',
        value: 3,
        icon: 'lucide:package',
        trend: { value: 2, isPositive: true },
        footerText: 'vs 1 last month',
        badgeCaption: '+2 products',
      },
      {
        label: 'Leads Found',
        value: 1284,
        icon: 'lucide:users',
        trend: { value: 16, isPositive: true },
        footerText: '+178 from last week',
        badgeCaption: '+16% week',
      },
      {
        label: 'Campaigns Running',
        value: 12,
        icon: 'lucide:rocket',
        trend: { value: 5, isPositive: false },
        footerText: '2 need attention',
        badgeCaption: '−5% week',
      },
      {
        label: 'Meetings Booked',
        value: 47,
        icon: 'lucide:calendar-check',
        trend: { value: 23, isPositive: true },
        footerText: '3 scheduled today',
        badgeCaption: '+23% week',
      },
    ];
  }

  private getMockFunnelStages(): FunnelStage[] {
    return [
      { label: 'Product', value: '100%', width: '100%', color: 'var(--primary)' },
      { label: 'Persona', value: '85%', width: '85%', color: 'var(--primary)' },
      { label: 'Lead', value: '60%', width: '60%', color: 'var(--primary)' },
      { label: 'Strategy', value: '40%', width: '40%', color: 'var(--primary)' },
      { label: 'Closed', value: '15%', width: '15%', color: 'var(--success)' }
    ];
  }

  private getMockActions(): ActionItem[] {
    return [
      {
        title: 'Complete AI Analytics Profile',
        meta: 'Missing pricing tiers',
        badgeType: 'warning',
        badgeText: 'Priority'
      },
      {
        title: '12 New High-Match Leads',
        meta: 'Detected via Prospect Hunter',
        badgeType: 'info',
        badgeText: 'New'
      },
      {
        title: 'Strategy for Sarah Johnson',
        meta: 'CTO @ TechFlow Inc.',
        badgeType: 'success',
        badgeText: 'Ready'
      }
    ];
  }

  // Public methods for components to interact with state
  getKPIs(): Observable<KPI[]> {
    return new Observable(observer => {
      this.dashboardState$.subscribe(state => observer.next(state.kpis));
    });
  }

  getFunnelStages(): Observable<FunnelStage[]> {
    return new Observable(observer => {
      this.dashboardState$.subscribe(state => observer.next(state.funnelStages));
    });
  }

  getActions(): Observable<ActionItem[]> {
    return new Observable(observer => {
      this.dashboardState$.subscribe(state => observer.next(state.actions));
    });
  }

  getMessages(): Observable<ChatMessage[]> {
    return new Observable(observer => {
      this.dashboardState$.subscribe(state => observer.next(state.messages));
    });
  }

  getVitalityScore(): Observable<number> {
    return new Observable(observer => {
      this.dashboardState$.subscribe(state => observer.next(state.vitalityScore));
    });
  }

  isTyping(): Observable<boolean> {
    return new Observable(observer => {
      this.dashboardState$.subscribe(state => observer.next(state.isTyping));
    });
  }

  sendMessage(message: string): void {
    const currentState = this.dashboardState.value;
    
    // Add user message
    const updatedMessages = [
      ...currentState.messages,
      { text: message, isAi: false }
    ];
    
    this.dashboardState.next({
      ...currentState,
      messages: updatedMessages,
      isTyping: true
    });

    // Simulate AI response
    setTimeout(() => {
      const responseText = this.generateAIResponse(message);
      const finalMessages = [
        ...this.dashboardState.value.messages,
        { text: responseText, isAi: true }
      ];

      this.dashboardState.next({
        ...this.dashboardState.value,
        messages: finalMessages,
        isTyping: false
      });
    }, 1500);
  }

  dismissAction(index: number): void {
    const currentState = this.dashboardState.value;
    const updatedActions = currentState.actions.filter((_, i) => i !== index);
    
    this.dashboardState.next({
      ...currentState,
      actions: updatedActions
    });
  }

  private generateAIResponse(query: string): string {
    if (query.toLowerCase().includes('report')) {
      return "Generating report for Q3 performance...";
    }
    return "Here's the data. The SaaS vertical is showing a <strong>24% higher</strong> engagement rate than average. I recommend increasing budget here.";
  }

  // Method to refresh dashboard data (for future API integration)
  refreshDashboard(): void {
    this.loadInitialData();
  }
}
