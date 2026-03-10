import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointService } from '../../core/services/breakpoint.service';
import { ProductService } from '../../shared/services/product.service';
import { WizardStep } from './components/stepper/stepper.component';
import { BtnPrimaryComponent } from '../../shared/components/ui/btn-primary/btn-primary.component';
import { BtnSecondaryComponent } from '../../shared/components/ui/btn-secondary/btn-secondary.component';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';
import type { ProductListItem, Product, ProductValueRow, ProductTemplate } from '../../shared/models/product.model';

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
  badge: 'active' | 'processing' | 'draft' | 'archived';
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

/** Format ISO date to relative "Xh ago" / "Xd ago" */
function formatEditedAgo(editedAt: string): string {
  if (!editedAt) return '';
  const date = new Date(editedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function listItemToPortfolio(item: ProductListItem): PortfolioProduct {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    iconGradient: item.iconGradient || 'linear-gradient(135deg, #6366f1, #818cf8)',
    iconName: item.iconName || 'lucide:box',
    badge: item.badge,
    scorePercent: item.scorePercent ?? 0,
    knowledgeLabel: item.knowledgeLabel || 'Knowledge Depth',
    knowledgeStatus: (item.badge === 'processing' ? 'Wait' : 'High') as 'High' | 'Wait',
    knowledgePercent: item.knowledgePercent ?? 0,
    editedAgo: formatEditedAgo(item.editedAt),
  };
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
export class ProductLabComponent implements OnInit {
  private readonly productService = inject(ProductService);
  readonly breakpoint = inject(BreakpointService);

  activeTab: string = 'portfolio';
  searchQuery = '';
  loading = false;
  errorMessage = '';
  portfolioProducts: PortfolioProduct[] = [];
  templates: TemplateItem[] = [];
  /** When set, wizard is in edit mode; otherwise create mode */
  editingProductId: string | null = null;
  /** When set, delete confirmation modal is open for this product */
  productToDelete: PortfolioProduct | null = null;
  /** Files selected for upload in the wizard */
  uploadedFiles: File[] = [];
  isDragOver = false;

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

  valueRows: ProductValueRow[] = [
    { feature: 'Auto-Ingestion', benefit: 'Save 20hrs/week', painPoint: 'Manual Data Entry', score: 'High' },
    { feature: 'Semantic Search', benefit: 'Better leads', painPoint: 'Low conversion', score: 'High' },
  ];

  categoryOptions = ['B2B SaaS Platform', 'Marketplace'];
  businessModelOptions = ['Recurring (ARR)', 'Usage Based'];
  targetSizeOptions = ['Startup (1-50)', 'Mid-Market (51-500)', 'Enterprise (500+)'];
  industryOptions = ['FinTech', 'Healthcare', 'Cybersecurity'];

  ngOnInit(): void {
    this.loadProducts();
    this.loadTemplates();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProducts(1, 50).subscribe((res) => {
      this.loading = false;
      if (res.success && res.data) {
        this.portfolioProducts = (res.data.items || []).map(listItemToPortfolio);
      } else if (!res.success && res.message) {
        this.errorMessage = res.message;
      }
    });
  }

  loadTemplates(): void {
    this.productService.getTemplates(1, 20).subscribe((res) => {
      if (res.success && res.data?.items) {
        this.templates = res.data.items.map((t: ProductTemplate) => ({
          id: t.id,
          name: t.name,
          desc: t.description || '',
          icon: 'lucide:file-text',
        }));
      }
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    this.errorMessage = '';
    if (tabId === 'wizard') {
      this.currentStep = 1;
      this.updateWizardStepStatus(1);
      if (!this.editingProductId) this.resetWizardForm();
    }
    if (tabId === 'portfolio') this.loadProducts();
    if (tabId === 'templates') this.loadTemplates();
  }

  setStep(step: number): void {
    this.currentStep = step;
    this.updateWizardStepStatus(step);
  }

  nextStep(): void {
    if (this.currentStep < this.totalWizardSteps) {
      this.setStep(this.currentStep + 1);
    } else {
      this.finishWizard();
    }
  }

  private updateWizardStepStatus(activeId: number): void {
    this.wizardSteps = this.wizardSteps.map((step) => ({
      ...step,
      status:
        step.id < activeId ? 'completed' : step.id === activeId ? 'active' : 'pending',
    }));
  }

  private resetWizardForm(): void {
    this.editingProductId = null;
    this.uploadedFiles = [];
    this.isDragOver = false;
    this.wizardForm = {
      productName: '',
      category: 'B2B SaaS Platform',
      businessModel: 'Recurring (ARR)',
      targetSizes: ['Mid-Market (51-500)', 'Enterprise (500+)'],
      coreUsp: '',
      strategicDescription: '',
      targetIndustries: ['FinTech', 'Cybersecurity'],
      competitors: '',
    };
    this.valueRows = [
      { feature: 'Auto-Ingestion', benefit: 'Save 20hrs/week', painPoint: 'Manual Data Entry', score: 'High' },
      { feature: 'Semantic Search', benefit: 'Better leads', painPoint: 'Low conversion', score: 'High' },
    ];
  }

  private patchWizardFromProduct(p: Product): void {
    this.wizardForm = {
      productName: p.title,
      category: p.category || this.wizardForm.category,
      businessModel: p.businessModel || this.wizardForm.businessModel,
      targetSizes: p.targetSizes?.length ? p.targetSizes : this.wizardForm.targetSizes,
      coreUsp: p.coreUsp || '',
      strategicDescription: p.strategicDescription || '',
      targetIndustries: p.targetIndustries?.length ? p.targetIndustries : this.wizardForm.targetIndustries,
      competitors: p.competitors || '',
    };
    this.valueRows = (p.valueRows && p.valueRows.length) ? p.valueRows.map((r) => ({ ...r })) : this.valueRows;
  }

  openNewProduct(): void {
    this.resetWizardForm();
    this.editingProductId = null;
    this.setActiveTab('wizard');
  }

  editProduct(product: PortfolioProduct): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProduct(product.id).subscribe((res) => {
      this.loading = false;
      if (res.success && res.data) {
        this.editingProductId = res.data.id;
        this.patchWizardFromProduct(res.data);
        this.currentStep = 1;
        this.updateWizardStepStatus(1);
        this.activeTab = 'wizard';
      } else {
        this.errorMessage = res.message || 'Failed to load product.';
      }
    });
  }

  duplicateProduct(product: PortfolioProduct): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.duplicateProduct(product.id).subscribe((res) => {
      this.loading = false;
      if (res.success && res.data) {
        this.loadProducts();
      } else {
        this.errorMessage = res.message || 'Failed to duplicate product.';
      }
    });
  }

  openDeleteConfirm(product: PortfolioProduct): void {
    this.productToDelete = product;
    this.errorMessage = '';
  }

  closeDeleteConfirm(): void {
    this.productToDelete = null;
  }

  confirmDelete(): void {
    if (!this.productToDelete) return;
    const product = this.productToDelete;
    this.loading = true;
    this.errorMessage = '';
    this.productService.deleteProduct(product.id).subscribe((res) => {
      this.loading = false;
      this.productToDelete = null;
      if (res.success) {
        this.loadProducts();
      } else {
        this.errorMessage = res.message || 'Failed to delete product.';
      }
    });
  }

  saveDraft(): void {
    this.submitProduct('draft');
  }

  finishWizard(): void {
    this.submitProduct('active');
  }

  private submitProduct(status: 'draft' | 'active'): void {
    this.loading = true;
    this.errorMessage = '';

    const valueRowsPayload = this.valueRows.map((r) => ({
      feature: r.feature,
      benefit: r.benefit,
      painPoint: r.painPoint,
      score: r.score,
    }));

    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, {
        productName: this.wizardForm.productName,
        subtitle: this.wizardForm.productName,
        category: this.wizardForm.category,
        businessModel: this.wizardForm.businessModel,
        targetSizes: this.wizardForm.targetSizes,
        coreUsp: this.wizardForm.coreUsp,
        strategicDescription: this.wizardForm.strategicDescription,
        targetIndustries: this.wizardForm.targetIndustries,
        competitors: this.wizardForm.competitors,
        valueRows: this.valueRows.map((r) => (r.id ? { ...r } : { feature: r.feature, benefit: r.benefit, painPoint: r.painPoint, score: r.score })),
        status,
      }).subscribe((res) => {
        this.loading = false;
        if (res.success) {
          this.editingProductId = null;
          this.setActiveTab('portfolio');
          this.loadProducts();
        } else {
          this.errorMessage = res.message || 'Failed to update product.';
        }
      });
    } else {
      this.productService.createProduct({
        productName: this.wizardForm.productName,
        category: this.wizardForm.category,
        businessModel: this.wizardForm.businessModel,
        targetSizes: this.wizardForm.targetSizes,
        coreUsp: this.wizardForm.coreUsp,
        strategicDescription: this.wizardForm.strategicDescription,
        targetIndustries: this.wizardForm.targetIndustries,
        competitors: this.wizardForm.competitors,
        valueRows: valueRowsPayload,
        status,
        templateId: null,
      }).subscribe((res) => {
        this.loading = false;
        if (res.success) {
          this.setActiveTab('portfolio');
          this.loadProducts();
        } else {
          this.errorMessage = res.message || 'Failed to create product.';
        }
      });
    }
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadedFiles = [...this.uploadedFiles, ...Array.from(input.files)];
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.uploadedFiles = [...this.uploadedFiles, ...Array.from(event.dataTransfer.files)];
    }
  }

  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter((f) => f !== file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
