import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-persona-detail',
  standalone: true,
  imports: [RouterLink, NgClass, PageHeaderComponent],
  templateUrl: './persona-detail.component.html',
  styleUrls: ['./persona-detail.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PersonaDetailComponent {
  personaName = 'Charles';
  personaRole = 'Chief Technology Officer';
  personaRoleAbbr = 'CTO';
  personaAvatarUrl = 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F4';
  userName = 'Sarah Jenning';
  userAvatarUrl = 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEuropean%2F3';
  deptBadge = 'C-Suite';
  generatedFor = 'PitchCraft Analytics';

  personaChips = ['Scale-up (50-200)', 'FinTech'];
  decisionPower = 78;

  get radialGradient(): string {
    const p = this.decisionPower;
    return `conic-gradient(from 270deg, var(--dept-eng) 0%, var(--dept-eng) ${p}%, transparent ${p}%)`;
  }

  stats = {
    budgetAuthority: 90,
    techInfluence: 95,
    riskTolerance: 40,
  };

  detailTabs = [
    { id: 'psychographics', label: 'Psychographics' },
    { id: 'behavioral', label: 'Behavioral' },
    { id: 'quotes', label: 'Quotes' },
    { id: 'settings', label: 'Settings' },
  ];
  activeDetailTab = 'psychographics';

  quote =
    "I don't need another dashboard. I need something that tells my engineers what to fix before the customer churns.";

  painPoints = [
    { label: 'Legacy technical debt slowing velocity', severity: 'Critical (9/10)', color: '#ef4444', percent: 90, barClass: 'pain-high' },
    { label: 'Lack of visibility into API latency', severity: 'High (7/10)', color: '#f97316', percent: 65, barClass: 'pain-med' },
    { label: 'Hiring senior backend talent', severity: 'Medium (4/10)', color: '#06b6d4', percent: 40, barClass: 'pain-low' },
  ];

  motivations = [
    { title: 'Operational Efficiency', desc: 'Reducing mean-time-to-resolution', icon: 'lucide:zap' },
    { title: 'Security & Compliance', desc: 'Avoiding data breaches', icon: 'lucide:shield-check' },
  ];

  kpis = ['System Uptime %', 'API Response Time', 'Cloud Cost (AWS)', 'Deploy Frequency'];

  techStack = [
    { name: 'AWS', icon: 'lucide:cloud' },
    { name: 'Slack', icon: 'lucide:message-square' },
    { name: 'Jira', icon: 'lucide:check-square' },
    { name: 'GitHub', icon: 'lucide:git-branch' },
  ];
}
