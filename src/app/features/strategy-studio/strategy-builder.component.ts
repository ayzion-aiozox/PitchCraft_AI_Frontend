import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-strategy-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strategy-builder.component.html',
  styleUrls: ['./strategy-builder.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StrategyBuilderComponent {
  campaignTitle = 'Technical Scale-Up Outreach (Draft)';
  savedAgo = '2m ago';
  prospectAvatar = 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F4';
  prospectName = 'Charles D.';
  prospectRole = 'CTO @ FinFlow';
  prospectLocation = 'London, UK • Series B';
  prospectRecentPost = 'Recent post: "AI Debt"';
  matchScore = 85;
  productName = 'ScaleDB Enterprise';
  productFeatures = ['Auto-sharding pipelines', 'Zero-downtime migration', 'Compliance audit logs'];
  strategyType = 'Cold Email Sequence';
  strategyTone = 'Technical & Direct';
  strategyLength = 'Concise';
  subjectLine = "Scaling FinFlow's data infrastructure without downtime";
  followUpSteps: { label: string; content?: string }[] = [
    { label: 'Day 3: The "Bump"', content: 'Any thoughts on my previous note, {{FirstName}}?' },
    { label: 'Day 7: Break-up Email', content: '' },
  ];
  activeIntelTab: 'insights' | 'assets' | 'history' = 'insights';
  rationaleTags = ['Validation', 'Relevance'];
  rationaleText = 'Acknowledging their public stance on "Tech Debt" validates their expertise before pivoting to your solution.';
  recommendedAssets = [
    { title: 'Fintech Case Study', meta: 'PDF • 2.4 MB', icon: 'lucide:file-text', relevance: 98 },
    { title: 'Migration ROI Calc', meta: 'Spreadsheet', icon: 'lucide:pie-chart', relevance: 85 },
  ];
  suggestionChips = ['Make it shorter', 'More urgent', 'Fix grammar'];
  aiPrompt = '';

  addTouchpoint(): void {
    this.followUpSteps = [...this.followUpSteps, { label: `Day ${this.followUpSteps.length * 3 + 3}: New touchpoint`, content: '' }];
  }
}
