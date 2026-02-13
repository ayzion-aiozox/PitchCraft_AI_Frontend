import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { MATERIAL } from '../../shared/modules/shared-imports';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';

interface Lead {
  id: string;
  name: string;
  role: string;
  avatar: string;
  matchScore: number;
  company: string;
  companyColor: string;
  stage: string;
  location: string;
  aiReason: string;
  tags: string[];
  probabilityPercent: number;
  probabilityLabel: string;
  probabilityColor: string;
  starred: boolean;
}

interface Persona {
  id: string;
  name: string;
  avatar: string;
}

interface Source {
  id: string;
  label: string;
  icon: string;
  color: string;
  active: boolean;
}

interface SeniorityLevel {
  id: string;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-discovery-console',
  standalone: true,
  imports: [FormsModule, NgClass, MATERIAL, PageHeaderComponent],
  templateUrl: './discovery-console.component.html',
  styleUrls: ['./discovery-console.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DiscoveryConsoleComponent {
  searchQuery = 'CTOs in London Fintech discussing AI';
  userName = 'Sarah Jenning';
  userAvatarUrl = 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEuropean%2F3';

  selectedPersona: Persona = {
    id: 'charles',
    name: 'Charles (CTO)',
    avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F4',
  };

  personaOptions: Persona[] = [
    { id: 'charles', name: 'Charles (CTO)', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FEuropean%2F4' },
    { id: 'sarah', name: 'Sarah (VP Marketing)', avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEuropean%2F2' },
  ];

  matchThreshold = 80;
  get matchThresholdLabel(): string {
    if (this.matchThreshold >= 80) return 'Strict';
    if (this.matchThreshold >= 60) return 'Moderate';
    return 'Relaxed';
  }

  sources: Source[] = [
    { id: 'linkedin', label: 'LinkedIn', icon: 'lucide:linkedin', color: '#0077b5', active: true },
    { id: 'twitter', label: 'Twitter / X', icon: 'lucide:twitter', color: '#000000', active: false },
    { id: 'github', label: 'GitHub', icon: 'lucide:github', color: '#333', active: true },
  ];

  seniorityLevels: SeniorityLevel[] = [
    { id: 'c-level', label: 'C-Level Executive', checked: true },
    { id: 'vp', label: 'VP / Head of', checked: true },
    { id: 'director', label: 'Director', checked: false },
  ];

  resultsCount = 1247;
  sortBy = 'relevance';
  sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'match', label: 'Match Score' },
    { value: 'name', label: 'Name' },
    { value: 'company', label: 'Company' },
    { value: 'probability', label: 'Engagement Probability' },
  ];

  get sortByLabel(): string {
    return this.sortOptions.find((o) => o.value === this.sortBy)?.label ?? 'Relevance';
  }

  viewMode: 'grid' | 'list' = 'grid';
  selectedLeads = new Set<string>(['lead-1']);

  leads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Sarah Jenkins',
      role: 'CTO @ FinFlow',
      avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEuropean%2F2',
      matchScore: 94,
      company: 'FinFlow',
      companyColor: '#0f172a',
      stage: 'Series B',
      location: 'London',
      aiReason: 'Matches ideal persona pain points on technical debt and hiring scaling.',
      tags: ['Fintech', 'Microservices', 'AI/ML', 'Compliance'],
      probabilityPercent: 85,
      probabilityLabel: 'High',
      probabilityColor: 'var(--success)',
      starred: true,
    },
    {
      id: 'lead-2',
      name: 'Raj Patel',
      role: 'VP Eng @ PayStream',
      avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FSouth%20Asian%2F5',
      matchScore: 88,
      company: 'PayStream',
      companyColor: '#3b82f6',
      stage: 'Series A',
      location: 'Remote',
      aiReason: 'Recently posted about legacy backend migration challenges.',
      tags: ['Payments', 'Node.js', 'Serverless'],
      probabilityPercent: 60,
      probabilityLabel: 'Medium',
      probabilityColor: '#f59e0b',
      starred: false,
    },
    {
      id: 'lead-3',
      name: 'Elena Wu',
      role: 'Head of AI @ Nexus',
      avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F25-35%2FEast%20Asian%2F1',
      matchScore: 82,
      company: 'Nexus',
      companyColor: '#10b981',
      stage: 'Seed',
      location: 'Berlin',
      aiReason: 'Active in open source communities relevant to your stack.',
      tags: ['LLMs', 'Python', 'Vector DB'],
      probabilityPercent: 55,
      probabilityLabel: 'Medium',
      probabilityColor: '#f59e0b',
      starred: false,
    },
    {
      id: 'lead-4',
      name: 'James Carter',
      role: 'Director Eng @ Bolt',
      avatar: 'https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F35-50%2FNorth%20American%2F3',
      matchScore: 76,
      company: 'Bolt',
      companyColor: '#f59e0b',
      stage: 'IPO',
      location: 'New York',
      aiReason: 'Hiring aggressively for platform engineering roles.',
      tags: ['Management', 'Kubernetes', 'DevOps'],
      probabilityPercent: 30,
      probabilityLabel: 'Low',
      probabilityColor: 'var(--muted-foreground)',
      starred: false,
    },
  ];

  onVoiceSearch(): void {
    // TODO: Implement voice search
    console.log('Voice search clicked');
  }

  onPersonaChange(event: MatSelectChange): void {
    const persona = this.personaOptions.find((p) => p.id === event.value);
    if (persona) {
      this.selectedPersona = persona;
    }
  }

  toggleSource(sourceId: string): void {
    const source = this.sources.find((s) => s.id === sourceId);
    if (source) {
      source.active = !source.active;
    }
  }

  resetSources(): void {
    this.sources.forEach((s) => (s.active = false));
  }

  toggleSeniority(levelId: string): void {
    const level = this.seniorityLevels.find((l) => l.id === levelId);
    if (level) {
      level.checked = !level.checked;
    }
  }

  saveSearchCriteria(): void {
    // TODO: Save search criteria
    console.log('Save search criteria');
  }

  onSortChange(event: MatSelectChange): void {
    this.sortBy = event.value;
    // TODO: Apply sort to leads
    console.log('Sort by', this.sortBy);
  }

  toggleLead(leadId: string): void {
    if (this.selectedLeads.has(leadId)) {
      this.selectedLeads.delete(leadId);
    } else {
      this.selectedLeads.add(leadId);
    }
  }

  toggleStar(leadId: string): void {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      lead.starred = !lead.starred;
    }
  }

  viewProfile(leadId: string): void {
    // TODO: Navigate to lead profile
    console.log('View profile', leadId);
  }

  generateStrategies(): void {
    // TODO: Generate strategies for selected leads
    console.log('Generate strategies for', Array.from(this.selectedLeads));
  }

  addToCampaign(): void {
    // TODO: Add selected leads to campaign
    console.log('Add to campaign', Array.from(this.selectedLeads));
  }

  exportCSV(): void {
    // TODO: Export selected leads to CSV
    console.log('Export CSV', Array.from(this.selectedLeads));
  }
}
