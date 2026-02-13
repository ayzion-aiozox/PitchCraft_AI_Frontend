import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointService } from '../../core/services/breakpoint.service';
import { WizardStep } from './components/stepper/stepper.component';
import { BtnPrimaryComponent } from '../../shared/components/ui/btn-primary/btn-primary.component';
import { BtnSecondaryComponent } from '../../shared/components/ui/btn-secondary/btn-secondary.component';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';

export interface Tab {
  id: string;
  label: string;
}

export interface PortfolioProduct {
  id: string;
  title: string;
  subtitle: string;
  iconGradient: string;
  iconName: string;
  badge: 'active' | 'processing' | 'draft';
  scorePercent: number;
  knowledgeLabel: string;
  knowledgeStatus: 'High' | 'Wait';
  knowledgePercent: number;
  editedAgo: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-product-lab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BtnPrimaryComponent,
    BtnSecondaryComponent,
    PageHeaderComponent,
  ],
  templateUrl: './product-lab.component.html',
  styleUrls: ['./product-lab.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductLabComponent {
  readonly breakpoint = inject(BreakpointService);

  activeTab: string = 'portfolio';
  searchQuery = '';

  tabs: Tab[] = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'wizard', label: 'Add New Product' },
    { id: 'templates', label: 'Templates' },
  ];

  readonly totalWizardSteps = 5;
  currentStep = 1;
  wizardSteps: WizardStep[] = [
    { id: 1, label: 'Basics', status: 'active' },
    { id: 2, label: 'AI Intelligence', status: 'pending' },
    { id: 3, label: 'Market', status: 'pending' },
    { id: 4, label: 'Value', status: 'pending' },
    { id: 5, label: 'Knowledge', status: 'pending' },
  ];

  get completionPercent(): number {
    return Math.round((this.currentStep / this.totalWizardSteps) * 100);
  }

  portfolioProducts: PortfolioProduct[] = [
    {
      id: '1',
      title: 'PitchCraft Analytics',
      subtitle: 'SaaS Intelligence Platform',
      iconGradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
      iconName: 'lucide:bar-chart-3',
      badge: 'active',
      scorePercent: 92,
      knowledgeLabel: 'Knowledge Depth',
      knowledgeStatus: 'High',
      knowledgePercent: 92,
      editedAgo: 'Edited 2h ago',
    },
    {
      id: '2',
      title: 'CloudSafe Security',
      subtitle: 'Enterprise Cybersecurity',
      iconGradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
      iconName: 'lucide:shield-check',
      badge: 'processing',
      scorePercent: 45,
      knowledgeLabel: 'Indexing...',
      knowledgeStatus: 'Wait',
      knowledgePercent: 45,
      editedAgo: 'Started 1d ago',
    },
  ];

  templates: TemplateItem[] = [
    { id: 'saas', name: 'SaaS Platform', desc: 'Recurring revenue models.', icon: 'lucide:layers' },
    { id: 'marketplace', name: 'Marketplace', desc: 'Two-sided network effects.', icon: 'lucide:shopping-bag' },
  ];

  wizardForm = {
    productName: '',
    category: 'B2B SaaS Platform',
    businessModel: 'Recurring (ARR)',
    targetSizes: ['Mid-Market (51-500)', 'Enterprise (500+)'] as string[],
    coreUsp: '',
    strategicDescription: '',
    targetIndustries: ['FinTech', 'Cybersecurity'] as string[],
    competitors: '',
  };

  categoryOptions = ['B2B SaaS Platform', 'Marketplace'];
  businessModelOptions = ['Recurring (ARR)', 'Usage Based'];
  targetSizeOptions = ['Startup (1-50)', 'Mid-Market (51-500)', 'Enterprise (500+)'];
  industryOptions = ['FinTech', 'Healthcare', 'Cybersecurity'];

  valueRows = [
    { feature: 'Auto-Ingestion', benefit: 'Save 20hrs/week', painPoint: 'Manual Data Entry', score: 'High' },
    { feature: 'Semantic Search', benefit: 'Better leads', painPoint: 'Low conversion', score: 'High' },
  ];

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    if (tabId === 'wizard') {
      this.currentStep = 1;
      this.updateWizardStepStatus(1);
    }
  }

  setStep(step: number): void {
    this.currentStep = step;
    this.updateWizardStepStatus(step);
  }

  nextStep(): void {
    if (this.currentStep < this.totalWizardSteps) {
      this.setStep(this.currentStep + 1);
    } else {
      this.setActiveTab('portfolio');
    }
  }

  private updateWizardStepStatus(activeId: number): void {
    this.wizardSteps = this.wizardSteps.map((step) => ({
      ...step,
      status:
        step.id < activeId ? 'completed' : step.id === activeId ? 'active' : 'pending',
    }));
  }

  toggleTargetSize(size: string): void {
    const idx = this.wizardForm.targetSizes.indexOf(size);
    if (idx === -1) {
      this.wizardForm.targetSizes = [...this.wizardForm.targetSizes, size];
    } else {
      this.wizardForm.targetSizes = this.wizardForm.targetSizes.filter((s) => s !== size);
    }
  }

  isTargetSizeSelected(size: string): boolean {
    return this.wizardForm.targetSizes.includes(size);
  }

  toggleIndustry(industry: string): void {
    const idx = this.wizardForm.targetIndustries.indexOf(industry);
    if (idx === -1) {
      this.wizardForm.targetIndustries = [...this.wizardForm.targetIndustries, industry];
    } else {
      this.wizardForm.targetIndustries = this.wizardForm.targetIndustries.filter((i) => i !== industry);
    }
  }

  isIndustrySelected(industry: string): boolean {
    return this.wizardForm.targetIndustries.includes(industry);
  }

  selectTemplate(_t: TemplateItem): void {
    this.setActiveTab('wizard');
  }

  saveDraft(): void {
    this.setActiveTab('portfolio');
  }
}
