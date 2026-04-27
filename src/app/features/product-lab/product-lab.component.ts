import { Component, inject, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, Subscription, timer, of, throwError, TimeoutError, forkJoin, from, type Observable } from 'rxjs';
import { debounceTime, switchMap, timeout, finalize, catchError } from 'rxjs/operators';
import { BreakpointService } from '../../core/services/breakpoint.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../shared/services/product.service';
import { LookupService } from '../../shared/services/lookup.service';
import { WizardStep } from './components/stepper/stepper.component';
import { BtnPrimaryComponent } from '../../shared/components/ui/btn-primary/btn-primary.component';
import { BtnSecondaryComponent } from '../../shared/components/ui/btn-secondary/btn-secondary.component';
import { PageHeaderComponent } from '../../shared/components/layout/page-header/page-header.component';
import { RichEditorComponent } from './components/rich-editor/rich-editor.component';
import { PlRadarChartComponent, type PlRadarSeries } from './components/pl-radar-chart/pl-radar-chart.component';
import type {
  ApiResponse,
  ProductListItem,
  Product,
  ProductExtractionJob,
  ProductValueRow,
  ProductTemplate,
  ProductDocument,
  AnalyzeKnowledgeResponse,
  AnalyzeStrategicResponse,
  MarketRadarResponse,
  GenerateValueMatrixResponse,
  ScoreResponse,
  AuditLiveResponse,
  AnalyzeFormDataBody,
  MarketRadarRequestBody,
  EmbedProductResponse,
  EmbedProductRequest,
  ProposedFieldsResponse,
  ProposedFieldSuggestion,
} from '../../shared/models/product.model';

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

/** Default live-audit field weights (FastAPI-style); API may override via `field_weights`. */
const DEFAULT_AUDIT_FIELD_WEIGHTS: Record<string, number> = {
  product_name: 1.0,
  core_usp: 1.2,
  description: 1.0,
  category: 0.8,
  target_industries: 0.8,
  features: 0.7,
  business_model: 0.6,
  target_sizes: 0.6,
  competitors: 0.5,
  integrations: 0.4,
  pricing_tier: 0.5,
  website_url: 0.6,
  competitor_website_urls: 0.5,
};

const SCORE_DIMENSION_LABELS: Record<string, string> = {
  completeness: 'Completeness',
  clarity: 'Clarity',
  differentiation: 'Differentiation',
  value_clarity: 'Value clarity',
  strategic_depth: 'Strategic depth',
};

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
    MatSnackBarModule,
    BtnPrimaryComponent,
    BtnSecondaryComponent,
    PageHeaderComponent,
    RichEditorComponent,
    PlRadarChartComponent,
  ],
  templateUrl: './product-lab.component.html',
  styleUrls: ['./product-lab.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductLabComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  private readonly lookupService = inject(LookupService);
  private readonly snackBar = inject(MatSnackBar);
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
  /** Instant AI Extraction: URL modal and scraping state */
  showExtractUrlModal = false;
  extractUrl = '';
  extractUrlLoading = false;
  extractUrlError = '';
  extractionId: string | null = null;
  extractionStatus: ProductExtractionJob['status'] | null = null;
  extractionProgress = 0;
  extractionJob: ProductExtractionJob | null = null;
  extractionPollingActive = false;
  private extractionPollSub: Subscription | null = null;
  private extractionStartedAt = 0;
  /** Keep extracted markdown to embed after product create */
  extractionMarkdownToEmbed: string | null = null;
  /** Download loading state: 'md' | 'pdf' | null */
  downloadLoading: 'md' | 'pdf' | null = null;
  /** Store extracted doc as a pseudo-file for the upload area */
  extractedDocFile: { name: string; size: number; type: 'extracted' } | null = null;
  /** Skip duplicate analysis runs when context unchanged; see `lastAnalysesMarketFingerprint` */
  private lastRunAnalysesProductId: string | null = null;
  /** When market URLs / competitor text change, we re-run analyses (radar needs Step 3 data). */
  private lastAnalysesMarketFingerprint = '';

  /** Analysis results + loading states */
  analysisLoading = {
    embed: false,
    knowledge: false,
    strategic: false,
    radar: false,
    valueMatrix: false,
    score: false,
  };
  analysisError = {
    embed: '',
    knowledge: '',
    strategic: '',
    radar: '',
    valueMatrix: '',
    score: '',
  };

  get analysisAnyLoading(): boolean {
    return Object.values(this.analysisLoading).some(Boolean);
  }

  get analysisAnyError(): boolean {
    return Object.values(this.analysisError).some((v) => !!v);
  }
  knowledgeResult: AnalyzeKnowledgeResponse | null = null;
  strategicResult: AnalyzeStrategicResponse | null = null;
  radarResult: MarketRadarResponse | null = null;
  valueMatrixResult: GenerateValueMatrixResponse | null = null;
  scoreResult: ScoreResponse | null = null;

  /** Live audit (real-time) */
  auditLoading = false;
  auditError = '';
  auditResult: AuditLiveResponse | null = null;
  private auditSub: Subscription | null = null;
  private auditTrigger$ = new Subject<void>();
  /** Debounced knowledge refresh while editing (reduces API load vs per-keystroke batch analyze). */
  private knowledgeRefresh$ = new Subject<void>();
  private knowledgeRefreshSub: Subscription | null = null;

  private clampPct(v: unknown): number {
    const n = this.scoreFromUnknown(v);
    if (n === undefined) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  /** Read a numeric score from API values (number, string, or { score / value / percent }). */
  private scoreFromUnknown(v: unknown): number | undefined {
    if (v == null) return undefined;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
      const n = Number(v.trim());
      return Number.isFinite(n) ? n : undefined;
    }
    if (typeof v === 'object' && !Array.isArray(v)) {
      const o = v as Record<string, unknown>;
      return (
        this.scoreFromUnknown(o['score']) ??
        this.scoreFromUnknown(o['value']) ??
        this.scoreFromUnknown(o['percent']) ??
        this.scoreFromUnknown(o['Score']) ??
        this.scoreFromUnknown(o['Value']) ??
        this.scoreFromUnknown(o['Percent'])
      );
    }
    return undefined;
  }

  private auditFieldScore(...keys: string[]): number | undefined {
    const fs = this.auditResult?.field_scores;
    if (!fs) return undefined;
    for (const k of keys) {
      if (!Object.prototype.hasOwnProperty.call(fs, k)) continue;
      const n = this.scoreFromUnknown(fs[k]);
      if (n !== undefined) return this.clampPct(n);
    }
    return undefined;
  }

  get positioningClarityPct(): number {
    const direct = this.auditFieldScore(
      'positioning_clarity',
      'positioningClarity',
      'PositioningClarity',
      'positioning',
      'Positioning'
    );
    if (direct !== undefined) return direct;
    const c = this.auditResult?.completeness_percent;
    if (c != null) return this.clampPct(c);
    return 0;
  }

  get differentiationPct(): number {
    const direct = this.auditFieldScore(
      'differentiation',
      'Differentiation',
      'differentiation_score',
      'DifferentiationScore'
    );
    if (direct !== undefined) return direct;
    const o = this.auditResult?.overall_score;
    if (o != null) return this.clampPct(o);
    return 0;
  }

  /**
   * Scraped / API values are often nested objects. Never use String(obj) — it becomes "[object Object]".
   */
  private unknownToDisplayString(value: unknown, maxLen = 20000): string {
    if (value == null) return '';
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) {
      return value
        .map((x) => this.unknownToDisplayString(x, maxLen))
        .filter(Boolean)
        .join(', ');
    }
    if (typeof value === 'object') {
      const o = value as Record<string, unknown>;
      const nested =
        o['value'] ??
        o['text'] ??
        o['label'] ??
        o['name'] ??
        o['title'] ??
        o['description'] ??
        o['content'] ??
        o['summary'] ??
        o['Value'] ??
        o['Text'] ??
        o['Name'] ??
        o['Title'];
      if (nested !== undefined && nested !== value) {
        return this.unknownToDisplayString(nested, maxLen);
      }
      try {
        const s = JSON.stringify(value);
        if (s === '{}' || s === '[]') return '';
        return s.length > maxLen ? s.slice(0, maxLen) + '…' : s;
      } catch {
        return '';
      }
    }
    return String(value);
  }

  private unknownToStringList(value: unknown): string[] {
    if (value == null) return [];
    if (Array.isArray(value)) {
      return value
        .map((x) => this.unknownToDisplayString(x))
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
    const s = this.unknownToDisplayString(value);
    return s ? [s] : [];
  }

  /** Map .NET / mixed API shapes into what the UI reads (snake_case + numeric field_scores). */
  private normalizeAuditLivePayload(raw: unknown): AuditLiveResponse | null {
    if (raw == null) return null;
    let o: Record<string, unknown> =
      typeof raw === 'object' && !Array.isArray(raw) ? { ...(raw as Record<string, unknown>) } : {};

    if (o['data'] && typeof o['data'] === 'object' && !Array.isArray(o['data'])) {
      o = { ...(o['data'] as Record<string, unknown>) };
    }
    if (o['result'] && typeof o['result'] === 'object' && !Array.isArray(o['result'])) {
      o = { ...(o['result'] as Record<string, unknown>) };
    }

    const num = (v: unknown): number | undefined => this.scoreFromUnknown(v);

    const overall_score =
      num(o['overall_score']) ?? num(o['OverallScore']) ?? num(o['overallScore']);
    const completeness_percent =
      num(o['completeness_percent']) ?? num(o['CompletenessPercent']) ?? num(o['completenessPercent']);

    const fsRaw = o['field_scores'] ?? o['FieldScores'] ?? o['fieldScores'];
    const field_scores: Record<string, unknown> = {};
    if (fsRaw && typeof fsRaw === 'object' && !Array.isArray(fsRaw)) {
      for (const [k, v] of Object.entries(fsRaw as Record<string, unknown>)) {
        const n = this.scoreFromUnknown(v);
        if (n !== undefined) {
          field_scores[k] = n;
        }
      }
    }

    const suggestions = o['suggestions'] ?? o['Suggestions'];

    const stringRecord = (v: unknown): Record<string, string> | undefined => {
      const r = v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
      if (!r) return undefined;
      const out: Record<string, string> = {};
      for (const [k, val] of Object.entries(r)) {
        const s = this.unknownToDisplayString(val, 500);
        if (s) out[k] = s;
      }
      return Object.keys(out).length ? out : undefined;
    };

    const numRecord = (v: unknown): Record<string, number> | undefined => {
      const r = v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
      if (!r) return undefined;
      const out: Record<string, number> = {};
      for (const [k, val] of Object.entries(r)) {
        const n = this.scoreFromUnknown(val);
        if (n !== undefined) out[k] = n;
      }
      return Object.keys(out).length ? out : undefined;
    };

    const field_messages = stringRecord(o['field_messages'] ?? o['fieldMessages'] ?? o['FieldMessages']);
    const field_tips = stringRecord(o['field_tips'] ?? o['fieldTips'] ?? o['FieldTips']);
    const field_weights = numRecord(o['field_weights'] ?? o['fieldWeights'] ?? o['FieldWeights']);

    const out: AuditLiveResponse = {
      overall_score,
      completeness_percent,
      field_scores: Object.keys(field_scores).length ? field_scores : undefined,
      field_messages,
      field_tips,
      field_weights,
      suggestions: Array.isArray(suggestions)
        ? (suggestions as string[])
        : typeof suggestions === 'string'
          ? [suggestions]
          : undefined,
    };
    return out;
  }
  /** Files selected for upload in the wizard */
  uploadedFiles: File[] = [];
  isDragOver = false;
  uploadEmbedLoading = false;
  uploadEmbedError = '';
  uploadEmbedDone = false;
  /** Existing server-side documents already uploaded for this product (Qdrant-backed). */
  existingDocumentsCount: number | null = null;
  existingDocumentsLoading = false;
  existingDocuments: ProductDocument[] = [];
  deletingDocumentIds = new Set<string>();
  documentToDelete: ProductDocument | null = null;

  tabs: Tab[] = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'wizard', label: 'Add New Product' },
    { id: 'insights', label: 'Mission Control' },
    { id: 'templates', label: 'Templates' },
  ];

  /** Step 4: manual wizard rows vs AI-generated matrix */
  valueMatrixViewTab: 'manual' | 'ai' = 'manual';
  strategicMessagingTabIndex = 0;

  /** Document-backed field suggestions (`GET …/proposed-fields`). Empty until BFF implements endpoint. */
  proposedFields: ProposedFieldsResponse | null = null;
  private ghostDismissed = new Set<string>();

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
    targetSizes: [] as string[],
    coreUsp: '',
    strategicDescription: '',
    targetIndustries: ['FinTech', 'Cybersecurity'] as string[],
    competitors: '',
    websiteUrl: '',
    competitorWebsiteUrls: '',
  };

  valueRows: ProductValueRow[] = [
    { feature: 'Auto-Ingestion', benefit: 'Save 20hrs/week', painPoint: 'Manual Data Entry', score: 'High' },
    { feature: 'Semantic Search', benefit: 'Better leads', painPoint: 'Low conversion', score: 'High' },
  ];

  // Defaults used if lookup API is unavailable or returns empty.
  categoryOptions = ['B2B SaaS Platform', 'Marketplace'];
  businessModelOptions = ['Recurring (ARR)', 'Usage Based'];
  targetSizeOptions = ['Startup (1-50)', 'Mid-Market (51-500)', 'Enterprise (500+)'];
  industryOptions = ['FinTech', 'Healthcare', 'Cybersecurity'];
  categoryDropdownOpen = false;
  businessModelDropdownOpen = false;

  @HostListener('document:click')
  onDocumentClick(): void {
    this.categoryDropdownOpen = false;
    this.businessModelDropdownOpen = false;
  }

  toggleCategoryDropdown(ev: MouseEvent): void {
    ev.stopPropagation();
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
    if (this.categoryDropdownOpen) this.businessModelDropdownOpen = false;
  }

  toggleBusinessModelDropdown(ev: MouseEvent): void {
    ev.stopPropagation();
    this.businessModelDropdownOpen = !this.businessModelDropdownOpen;
    if (this.businessModelDropdownOpen) this.categoryDropdownOpen = false;
  }

  pickCategory(opt: string, ev?: Event): void {
    ev?.stopPropagation();
    this.wizardForm.category = opt;
    this.categoryDropdownOpen = false;
    this.onFormIntelChange();
  }

  pickBusinessModel(opt: string, ev?: Event): void {
    ev?.stopPropagation();
    this.wizardForm.businessModel = opt;
    this.businessModelDropdownOpen = false;
    this.onFormIntelChange();
  }

  closeDropdowns(ev?: Event): void {
    ev?.stopPropagation();
    this.categoryDropdownOpen = false;
    this.businessModelDropdownOpen = false;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadTemplates();
    this.loadDropdownOptionsFromBackend();

    // Debounced live audit (~500ms “instrument cluster”)
    this.auditSub = this.auditTrigger$
      .pipe(
        debounceTime(500),
        switchMap(() => {
          this.auditLoading = true;
          this.auditError = '';
          return this.productService
            .auditLive({
              form_data: this.buildSnakeCaseFormDataForAi(),
            })
            .pipe(
              catchError((e: unknown) =>
                of({
                  success: false,
                  message: e instanceof Error ? e.message : 'Live audit request failed.',
                } as ApiResponse<AuditLiveResponse>)
              )
            );
        })
      )
      .subscribe((res) => {
        this.auditLoading = false;
        if (res.success) {
          this.auditResult = this.normalizeAuditLivePayload(res.data);
        } else {
          this.auditResult = null;
          this.auditError = res.message || 'Live audit failed.';
        }
      });

    this.knowledgeRefreshSub = this.knowledgeRefresh$
      .pipe(
        debounceTime(2800),
        switchMap(() => {
          const id = this.editingProductId;
          if (!id) return of(null);
          return this.productService.analyzeKnowledge(id, this.buildAnalyzeFormDataBody()).pipe(
            catchError(() => of(null))
          );
        })
      )
      .subscribe((res) => {
        if (res && res.success && res.data) {
          this.knowledgeResult = this.normalizeKnowledgeResult(res.data);
        }
      });

    // run once on load
    this.requestLiveAudit();
  }

  private loadDropdownOptionsFromBackend(): void {
    // Adjust these lookup type keys to match your backend data.
    const CATEGORY_LOOKUP_TYPE = 'Product_Category';
    const BUSINESS_MODEL_LOOKUP_TYPE = 'Business_Model';

    this.lookupService.getVisibleValues$(CATEGORY_LOOKUP_TYPE).subscribe((vals) => {
      if (vals.length) this.categoryOptions = vals;
    });
    this.lookupService.getVisibleValues$(BUSINESS_MODEL_LOOKUP_TYPE).subscribe((vals) => {
      if (vals.length) this.businessModelOptions = vals;
    });
  }

  ngOnDestroy(): void {
    this.cancelExtractionPolling();
    if (this.auditSub) this.auditSub.unsubscribe();
    if (this.knowledgeRefreshSub) this.knowledgeRefreshSub.unsubscribe();
  }

  requestLiveAudit(): void {
    this.auditTrigger$.next();
  }

  /** Form change: live audit + optional background knowledge when product exists */
  onFormIntelChange(): void {
    this.requestLiveAudit();
    this.scheduleKnowledgeRefresh();
  }

  private scheduleKnowledgeRefresh(): void {
    this.knowledgeRefresh$.next();
  }

  /** Strategic description is HTML from `app-rich-editor` (contenteditable). */
  onStrategicDescriptionChange(html: string): void {
    this.wizardForm.strategicDescription = html;
    this.onFormIntelChange();
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
    // Do not reset the wizard when switching tabs — that cleared scraped-doc UI and lost in-progress work.
    // A fresh form is only started via "New Product" (openNewProduct).
    if (tabId === 'portfolio') this.loadProducts();
    if (tabId === 'templates') this.loadTemplates();
    if (tabId === 'insights' && this.editingProductId && !this.analysesUpToDateForProduct(this.editingProductId)) {
      this.runAnalyses(this.editingProductId);
    }
  }

  setStep(step: number): void {
    this.currentStep = step;
    this.updateWizardStepStatus(step);
    if (step === 2) {
      this.syncExtractedDocCard();
      this.ensureAnalysesForStep2();
      this.loadProposedFields();
    }
    if (step === 4) {
      this.ensureAnalysesForStep4();
    }
  }

  /** Restore scraped markdown row if markdown exists but the card was cleared (e.g. tab switch). */
  private syncExtractedDocCard(): void {
    const md = this.extractionMarkdownToEmbed?.trim();
    if (!md) {
      this.extractedDocFile = null;
      return;
    }
    if (this.extractedDocFile) return;
    const title = this.wizardForm.productName?.trim() || 'Extracted Data';
    this.extractedDocFile = {
      name: `${title.replace(/[^\w\- ]+/g, '_')}_scraped.md`,
      size: new Blob([md]).size,
      type: 'extracted',
    };
  }

  /** Fingerprint of Step 3 fields that affect market radar (and full batch freshness). */
  private marketFingerprint(): string {
    const f = this.wizardForm;
    return [f.websiteUrl?.trim() ?? '', f.competitorWebsiteUrls?.trim() ?? '', f.competitors?.trim() ?? ''].join(
      '\u001e'
    );
  }

  private analysesUpToDateForProduct(id: string): boolean {
    return this.lastRunAnalysesProductId === id && this.lastAnalysesMarketFingerprint === this.marketFingerprint();
  }

  /** Run embedding + analysis APIs once a product exists and user is on step 2. */
  private ensureAnalysesForStep2(): void {
    const id = this.editingProductId;
    if (!id || this.currentStep !== 2) return;
    if (this.analysesUpToDateForProduct(id)) return;
    this.runAnalyses(id);
  }

  /** Re-run when user reaches Value step so Step 3 (market / competitors) is usually filled first. */
  private ensureAnalysesForStep4(): void {
    const id = this.editingProductId;
    if (!id || this.currentStep !== 4) return;
    if (this.analysesUpToDateForProduct(id)) return;
    this.runAnalyses(id);
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
    this.extractedDocFile = null;
    this.uploadEmbedDone = false;
    this.uploadEmbedError = '';
    this.existingDocumentsCount = null;
    this.existingDocumentsLoading = false;
    this.existingDocuments = [];
    this.wizardForm = {
      productName: '',
      category: 'B2B SaaS Platform',
      businessModel: 'Recurring (ARR)',
      targetSizes: [],
      coreUsp: '',
      strategicDescription: '',
      targetIndustries: ['FinTech', 'Cybersecurity'],
      competitors: '',
      websiteUrl: '',
      competitorWebsiteUrls: '',
    };
    this.valueRows = [
      { feature: 'Auto-Ingestion', benefit: 'Save 20hrs/week', painPoint: 'Manual Data Entry', score: 'High' },
      { feature: 'Semantic Search', benefit: 'Better leads', painPoint: 'Low conversion', score: 'High' },
    ];
  }

  removeExtractedDoc(): void {
    this.extractedDocFile = null;
    this.extractionMarkdownToEmbed = null;
  }

  private patchWizardFromProduct(p: Product): void {
    // Backend payloads can differ in casing (camelCase/snake_case/PascalCase). Pick robustly.
    const o = (p as unknown) as Record<string, unknown>;
    const pickStr = (...keys: string[]): string => {
      for (const k of keys) {
        if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
        const s = this.unknownToDisplayString(o[k], 200000);
        if (s) return s;
      }
      return '';
    };
    const pickArr = (...keys: string[]): string[] => {
      for (const k of keys) {
        if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
        const list = this.unknownToStringList(o[k]);
        if (list.length) return list;
      }
      return [];
    };
    const pickValueRows = (): ProductValueRow[] => {
      const raw = o['valueRows'] ?? o['value_rows'] ?? o['ValueRows'] ?? (p as any).valueRows;
      if (!Array.isArray(raw)) return [];
      return (raw as unknown[]).map((x) => {
        if (!x || typeof x !== 'object') {
          return { feature: '', benefit: '', painPoint: '', score: '' };
        }
        const r = x as Record<string, unknown>;
        return {
          id: (r['id'] ?? r['Id']) as string | undefined,
          feature: this.unknownToDisplayString(r['feature'] ?? r['Feature']),
          benefit: this.unknownToDisplayString(r['benefit'] ?? r['Benefit']),
          painPoint: this.unknownToDisplayString(r['painPoint'] ?? r['pain_point'] ?? r['PainPoint']),
          score: this.unknownToDisplayString(r['score'] ?? r['Score']),
        };
      });
    };

    this.wizardForm = {
      productName:
        pickStr('title', 'productName', 'product_name', 'ProductName', 'Title') || p.title || '',
      category:
        pickStr('category', 'Category') || p.category || this.wizardForm.category,
      businessModel:
        pickStr('businessModel', 'business_model', 'BusinessModel') || p.businessModel || this.wizardForm.businessModel,
      targetSizes: pickArr('targetSizes', 'target_sizes', 'TargetSizes') || (p.targetSizes?.length ? p.targetSizes : []),
      coreUsp:
        pickStr('coreUsp', 'core_usp', 'CoreUsp', 'CoreUSP') || p.coreUsp || '',
      strategicDescription:
        pickStr('strategicDescription', 'strategic_description', 'StrategicDescription', 'description', 'Description') ||
        p.strategicDescription ||
        '',
      targetIndustries:
        pickArr('targetIndustries', 'target_industries', 'TargetIndustries').length
          ? pickArr('targetIndustries', 'target_industries', 'TargetIndustries')
          : (p.targetIndustries?.length ? p.targetIndustries : this.wizardForm.targetIndustries),
      competitors:
        pickStr('competitors', 'Competitors') || p.competitors || '',
      websiteUrl:
        pickStr('websiteUrl', 'website_url', 'WebsiteUrl') || (p.websiteUrl ?? ''),
      competitorWebsiteUrls:
        pickStr('competitorWebsiteUrls', 'competitor_website_urls', 'CompetitorWebsiteUrls') || (p.competitorWebsiteUrls ?? ''),
    };
    const rows = pickValueRows();
    this.valueRows = rows.length ? rows.map((r) => ({ ...r })) : this.valueRows;
  }

  openNewProduct(): void {
    this.errorMessage = '';
    this.lastRunAnalysesProductId = null;
    this.lastAnalysesMarketFingerprint = '';
    this.extractionMarkdownToEmbed = null;
    this.extractedDocFile = null;
    this.extractionId = null;
    this.extractionJob = null;
    this.proposedFields = null;
    this.ghostDismissed.clear();
    this.resetWizardForm();
    this.editingProductId = null;
    this.activeTab = 'wizard';
    this.currentStep = 1;
    this.updateWizardStepStatus(1);
  }

  openExtractUrlModal(): void {
    this.showExtractUrlModal = true;
    this.extractUrl = '';
    this.extractUrlError = '';
    this.extractionId = null;
    this.extractionStatus = null;
    this.extractionProgress = 0;
    this.extractionJob = null;
    this.extractionPollingActive = false;
    this.extractionMarkdownToEmbed = null;
  }

  closeExtractUrlModal(): void {
    if (this.extractUrlLoading) return;
    this.showExtractUrlModal = false;
    this.extractUrl = '';
    this.extractUrlError = '';
    this.cancelExtractionPolling();
  }

  /**
   * Accepts full URLs or bare domains (e.g. techrefi.com). Prepends https:// when no scheme.
   */
  private normalizeScrapeUrl(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    let candidate = trimmed.replace(/^\/+/, '');
    if (!/^https?:\/\//i.test(candidate)) {
      candidate = `https://${candidate}`;
    }
    try {
      const u = new URL(candidate);
      const host = u.hostname;
      if (!host || !host.includes('.')) {
        return null;
      }
      return u.toString();
    } catch {
      return null;
    }
  }

  startExtractUrl(): void {
    const url = this.normalizeScrapeUrl(this.extractUrl);
    if (!url) {
      this.extractUrlError = 'Please enter a valid website (e.g. techrefi.com or https://example.com).';
      return;
    }
    this.extractUrlError = '';
    this.extractUrlLoading = true;
    this.productService.startExtraction({ url }).subscribe((res) => {
      this.extractUrlLoading = false;
      if (res.success && res.data?.extraction_id) {
        this.extractionId = res.data.extraction_id;
        this.extractionStatus = res.data.status;
        this.extractionProgress = res.data.progress_percent ?? 0;
        this.beginExtractionPolling();
      } else {
        this.extractUrlError = res.message ?? 'Extraction failed. Please try again.';
      }
    });
  }

  cancelExtractionPolling(): void {
    this.extractionPollingActive = false;
    this.extractionStartedAt = 0;
    if (this.extractionPollSub) {
      this.extractionPollSub.unsubscribe();
      this.extractionPollSub = null;
    }
  }

  private beginExtractionPolling(): void {
    if (!this.extractionId) return;
    this.cancelExtractionPolling();
    this.extractionPollingActive = true;
    this.extractionStartedAt = Date.now();

    // Poll interval: 2s initially, then 5s after ~30s.
    let lastFetchAt = 0;
    this.extractionPollSub = timer(0, 1000)
      .pipe(
        switchMap(() => {
          if (!this.extractionPollingActive || !this.extractionId) return of(null);
          const elapsed = Date.now() - this.extractionStartedAt;
          const interval = elapsed > 30000 ? 5000 : 2000;
          const now = Date.now();
          if (now - lastFetchAt < interval) return of(null);
          lastFetchAt = now;
          return this.productService.getExtraction(this.extractionId);
        })
      )
      .subscribe((res) => {
        if (!res || !res.success || !res.data) return;
        this.extractionJob = res.data;
        this.extractionStatus = res.data.status;
        this.extractionProgress = res.data.progress_percent ?? this.extractionProgress;

        if (res.data.status === 'failed') {
          this.extractUrlError = res.data.error_message || 'Scraping failed.';
          this.cancelExtractionPolling();
        }
        if (res.data.status === 'complete') {
          const doc = res.data.document;
          const md = doc?.full_markdown ?? doc?.markdown ?? '';
          this.extractionMarkdownToEmbed = String(md || '') || null;
          this.cancelExtractionPolling();
        }
      });
  }

  /** Use extracted fields to prefill wizard and move user into Product creation */
  useExtractionToCreateProduct(): void {
    if (!this.extractionJob) return;

    const fields = (this.extractionJob.extracted_fields || {}) as Record<string, unknown>;
    const doc = this.extractionJob.document || {};

    const pick = (...keys: string[]) => {
      for (const k of keys) {
        if (fields[k] == null) continue;
        const s = this.unknownToDisplayString(fields[k], 4000);
        if (s) return s;
      }
      return '';
    };

    const pickLong = (...keys: string[]) => {
      for (const k of keys) {
        if (fields[k] == null) continue;
        const s = this.unknownToDisplayString(fields[k], 100000);
        if (s) return s;
      }
      return '';
    };

    const pickArr = (...keys: string[]) => {
      for (const k of keys) {
        if (fields[k] == null) continue;
        const list = this.unknownToStringList(fields[k]);
        if (list.length) return list;
      }
      return [];
    };

    const productName =
      pick('productName', 'product_name', 'name', 'title', 'company_name', 'companyName', 'ProductName', 'Title') ||
      this.unknownToDisplayString(doc['title'] ?? doc['Title'], 500) ||
      '';

    this.resetWizardForm();
    this.editingProductId = null;
    this.wizardForm.productName = productName;
    this.wizardForm.category = pick('category', 'product_category', 'Category') || this.wizardForm.category;
    this.wizardForm.businessModel =
      pick('businessModel', 'business_model', 'pricing_model', 'BusinessModel') || this.wizardForm.businessModel;
    this.wizardForm.coreUsp =
      pick('coreUsp', 'core_usp', 'usp', 'value_proposition', 'tagline', 'CoreUsp', 'ValueProposition') || '';
    this.wizardForm.strategicDescription =
      pickLong('strategicDescription', 'strategic_description', 'description', 'about', 'summary', 'StrategicDescription') ||
      (this.extractionMarkdownToEmbed ?? '');

    const sizes = pickArr('targetSizes', 'target_sizes', 'company_sizes', 'TargetSizes');
    this.wizardForm.targetSizes = sizes.length ? sizes : [];

    const industries = pickArr('targetIndustries', 'target_industries', 'industries', 'TargetIndustries');
    this.wizardForm.targetIndustries = industries.length ? industries : ['FinTech', 'Cybersecurity'];

    this.wizardForm.competitors = pick('competitors', 'competition', 'Competitors') || '';
    this.wizardForm.websiteUrl =
      pick('websiteUrl', 'website_url', 'url', 'product_url', 'WebsiteUrl') || this.extractUrl?.trim() || '';
    this.wizardForm.competitorWebsiteUrls =
      pick('competitorWebsiteUrls', 'competitor_website_urls', 'competitor_urls') || '';

    // Add the extracted document as a pseudo-file in the upload area
    if (this.extractionMarkdownToEmbed && this.extractionMarkdownToEmbed.trim()) {
      const docTitle = productName || 'Extracted Data';
      this.extractedDocFile = {
        name: `${docTitle.replace(/[^\w\- ]+/g, '_')}_scraped.md`,
        size: new Blob([this.extractionMarkdownToEmbed]).size,
        type: 'extracted',
      };
    }

    // Close modal and move to wizard (step 1)
    this.showExtractUrlModal = false;
    this.activeTab = 'wizard';
    this.currentStep = 1;
    this.updateWizardStepStatus(1);

    this.onFormIntelChange();

    // Auto-create a Draft product so Step 2 can embed + run analyses immediately.
    // Without a saved product id, Qdrant embedding and AI analyses cannot run.
    this.loading = true;
    this.errorMessage = '';
    const valueRowsPayload = this.valueRows.map((r) => ({
      feature: r.feature,
      benefit: r.benefit,
      painPoint: r.painPoint,
      score: r.score,
    }));
    this.productService.createProduct({
      productName: this.wizardForm.productName,
      category: this.wizardForm.category,
      businessModel: this.wizardForm.businessModel,
      targetSizes: this.wizardForm.targetSizes,
      coreUsp: this.wizardForm.coreUsp,
      strategicDescription: this.wizardForm.strategicDescription,
      targetIndustries: this.wizardForm.targetIndustries,
      competitors: this.wizardForm.competitors,
      websiteUrl: this.wizardForm.websiteUrl?.trim() || undefined,
      competitorWebsiteUrls: this.wizardForm.competitorWebsiteUrls?.trim() || undefined,
      valueRows: valueRowsPayload,
      status: 'draft',
      templateId: null,
    }).subscribe((res) => {
      this.loading = false;
      if (res.success && res.data?.id) {
        this.editingProductId = res.data.id;
        this.lastRunAnalysesProductId = null;
        this.lastAnalysesMarketFingerprint = '';
        this.setStep(2);
        this.activeTab = 'wizard';
        this.loadProducts();
        this.loadProposedFields();
        this.refreshExistingDocumentsCount();
      } else {
        this.errorMessage = res.message || 'Failed to create product from scraped data. You can still save manually.';
      }
    });
  }

  /**
   * FastAPI live-audit / analyze expects snake_case keys (product_name, description, …).
   * CamelCase-only payloads only match `category`, which skews scores.
   */
  private buildSnakeCaseFormDataForAi(): Record<string, unknown> {
    const f = this.wizardForm;
    const rows = this.valueRows;
    const featuresText = rows
      .map((r) => [r.feature, r.benefit, r.painPoint].filter((x) => (x || '').trim()).join(' — '))
      .filter((line) => line.trim())
      .join('\n');
    return {
      product_name: f.productName ?? '',
      category: f.category ?? '',
      business_model: f.businessModel ?? '',
      target_sizes: f.targetSizes ?? [],
      core_usp: f.coreUsp ?? '',
      description: f.strategicDescription ?? '',
      target_industries: f.targetIndustries ?? [],
      competitors: f.competitors ?? '',
      website_url: f.websiteUrl ?? '',
      competitor_website_urls: f.competitorWebsiteUrls ?? '',
      features: featuresText,
      integrations: '',
      pricing_tier: f.businessModel ?? '',
      value_rows: rows,
    };
  }

  /** Same shape as audit-live: snake_case form_data for analyze-* endpoints */
  private buildAnalyzeFormDataBody(): AnalyzeFormDataBody {
    return {
      form_data: this.buildSnakeCaseFormDataForAi(),
    };
  }

  private buildMarketRadarRequestBody(): MarketRadarRequestBody | undefined {
    const product_url = this.wizardForm.websiteUrl?.trim();
    const competitors =
      this.wizardForm.competitorWebsiteUrls?.trim() || this.wizardForm.competitors?.trim() || '';
    if (!product_url && !competitors) return undefined;
    const body: MarketRadarRequestBody = {};
    if (product_url) body.product_url = product_url;
    if (competitors) body.competitors = competitors;
    return body;
  }

  /**
   * Validates PDF blob from extraction download (reject JSON error bodies and non-PDF).
   */
  private async validatePdfBlobForEmbed(blob: Blob): Promise<{ ok: true; blob: Blob } | { ok: false }> {
    if (!blob || blob.size === 0) {
      return { ok: false };
    }
    const ct = (blob.type || '').toLowerCase();
    if (ct.includes('json') || ct === 'application/problem+json') {
      return { ok: false };
    }
    if (blob.size < 4096) {
      const peek = await blob.slice(0, 512).text();
      const trimmed = peek.trimStart();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const full = await blob.text();
          const j = JSON.parse(full) as { message?: string; error?: string };
          if (j.message || j.error) {
            return { ok: false };
          }
        } catch {
          /* not JSON */
        }
      }
    }
    const head = new Uint8Array(await blob.slice(0, Math.min(5, blob.size)).arrayBuffer());
    const sig = String.fromCharCode(...head);
    if (!sig.startsWith('%PDF')) {
      return { ok: false };
    }
    return { ok: true, blob };
  }

  /** Qdrant `collection_id` from login (`LocalStorageConstant.QdrantCollectionId`). */
  private embedCollectionContext(): Pick<EmbedProductRequest, 'collection_id'> {
    const cid = this.authService.getQdrantCollectionId()?.trim();
    return cid ? { collection_id: cid } : {};
  }

  /** Map filename to BFF embed `type` (pdf | docx | pptx | text). */
  private inferEmbedDocType(fileName: string): string {
    const ext = (fileName.split('.').pop() || '').toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'docx') return 'docx';
    if (ext === 'pptx') return 'pptx';
    return 'text';
  }

  /**
   * Qdrant embed: prefer extraction PDF (upload → storage_path), else inline markdown (content + type text).
   */
  private buildEmbedExtractionObservable(productId: string): Observable<ApiResponse<EmbedProductResponse>> {
    const mdFallback = (): Observable<ApiResponse<EmbedProductResponse>> => {
      if (!this.extractionMarkdownToEmbed?.trim()) {
        return of({ success: true } as ApiResponse<EmbedProductResponse>);
      }
      return this.productService.embedProduct(productId, {
        ...this.embedCollectionContext(),
        documents: [
          {
            id: 'extraction_md',
            name: 'extraction.md',
            type: 'text',
            content: this.extractionMarkdownToEmbed,
          },
        ],
      });
    };

    if (this.extractionId) {
      return this.productService.downloadExtractionPdf(this.extractionId).pipe(
        timeout(120000),
        switchMap((blob) => from(this.validatePdfBlobForEmbed(blob))),
        switchMap((check) => {
          if (!check.ok) {
            return mdFallback();
          }
          const file = new File([check.blob], `extraction-${this.extractionId}.pdf`, { type: 'application/pdf' });
          return this.productService.uploadDocument(productId, file).pipe(
            switchMap((uploadRes) => {
              const sp = this.productService.pickUploadStoragePath(uploadRes.data);
              if (!uploadRes.success || !sp) {
                return mdFallback();
              }
              return this.productService.embedProduct(productId, {
                ...this.embedCollectionContext(),
                documents: [
                  {
                    id: String(
                      this.productService.pickUploadDocumentId(uploadRes.data, 'extraction_pdf')
                    ),
                    name: this.productService.pickUploadFileName(uploadRes.data, file.name),
                    type: 'pdf',
                    storage_path: sp,
                  },
                ],
              });
            }),
          );
        }),
        catchError(() => mdFallback()),
      );
    }
    return mdFallback();
  }

  private runAnalyses(productId: string): void {
    // Reset displayed results
    this.knowledgeResult = null;
    this.strategicResult = null;
    this.radarResult = null;
    this.valueMatrixResult = null;
    this.scoreResult = null;
    this.analysisError = { embed: '', knowledge: '', strategic: '', radar: '', valueMatrix: '', score: '' };

    const formBody = this.buildAnalyzeFormDataBody();
    const marketBody = this.buildMarketRadarRequestBody();

    const needsEmbed = !!(this.extractionId || this.extractionMarkdownToEmbed?.trim());
    let embed$: Observable<ApiResponse<EmbedProductResponse>>;
    if (needsEmbed) {
      this.analysisLoading.embed = true;
      embed$ = this.buildEmbedExtractionObservable(productId).pipe(
        finalize(() => {
          this.analysisLoading.embed = false;
        }),
      );
    } else {
      embed$ = of({ success: true } as ApiResponse<EmbedProductResponse>);
    }

    this.analysisLoading.knowledge = true;
    this.analysisLoading.strategic = true;
    this.analysisLoading.radar = true;
    this.analysisLoading.valueMatrix = true;
    this.analysisLoading.score = true;

    forkJoin({
      embed: embed$,
      knowledge: this.productService.analyzeKnowledge(productId, formBody),
      strategic: this.productService.analyzeStrategic(productId, formBody),
      radar: this.productService.marketRadar(productId, marketBody),
      valueMatrix: this.productService.generateValueMatrix(productId, formBody),
      score: this.productService.scoreProduct(productId),
    })
      .pipe(
        finalize(() => {
          this.analysisLoading.knowledge = false;
          this.analysisLoading.strategic = false;
          this.analysisLoading.radar = false;
          this.analysisLoading.valueMatrix = false;
          this.analysisLoading.score = false;
          this.loadProducts();
        })
      )
      .subscribe({
        next: ({ embed, knowledge, strategic, radar, valueMatrix, score }) => {
          if (embed && !embed.success) {
            this.analysisError.embed = embed.message || 'Embedding failed.';
          }
          if (knowledge.success) {
            this.knowledgeResult = this.normalizeKnowledgeResult(knowledge.data);
          } else {
            this.analysisError.knowledge = knowledge.message || 'Knowledge analysis failed.';
          }
          if (strategic.success) {
            this.strategicResult = strategic.data ?? null;
          } else {
            this.analysisError.strategic = strategic.message || 'Strategic analysis failed.';
          }
          if (radar.success) {
            this.radarResult = radar.data ?? null;
          } else {
            this.analysisError.radar = radar.message || 'Market radar failed.';
          }
          if (valueMatrix.success) {
            this.valueMatrixResult = valueMatrix.data ?? null;
          } else {
            this.analysisError.valueMatrix = valueMatrix.message || 'Value matrix generation failed.';
          }
          if (score.success) {
            this.scoreResult = score.data ?? null;
          } else {
            this.analysisError.score = score.message || 'Scoring failed.';
          }
          this.lastRunAnalysesProductId = productId;
          this.lastAnalysesMarketFingerprint = this.marketFingerprint();
          this.loadProposedFields();

          const failed =
            !embed?.success ||
            !knowledge.success ||
            !strategic.success ||
            !radar.success ||
            !valueMatrix.success ||
            !score.success;
          const ref = this.snackBar.open(
            failed ? 'Some intelligence tasks failed — check status in the wizard.' : 'Intelligence batch complete.',
            'Mission Control',
            { duration: 8000, panelClass: ['pl-snackbar'] }
          );
          ref.onAction().subscribe(() => this.setActiveTab('insights'));
        },
      });
  }

  /** Normalize API casing for template bindings */
  private normalizeKnowledgeResult(data: AnalyzeKnowledgeResponse | null | undefined): AnalyzeKnowledgeResponse | null {
    if (data == null || typeof data !== 'object') return null;
    const o = data as Record<string, unknown>;
    const pct =
      this.scoreFromUnknown(o['knowledge_percent']) ??
      this.scoreFromUnknown(o['knowledgePercent']) ??
      this.scoreFromUnknown(o['KnowledgePercent']);
    if (pct === undefined) return data;
    return { ...data, knowledge_percent: pct };
  }

  get knowledgePercentDisplay(): number | null {
    const k = this.knowledgeResult as Record<string, unknown> | null | undefined;
    if (!k) return null;
    const v = k['knowledge_percent'] ?? k['knowledgePercent'] ?? k['KnowledgePercent'];
    const n = this.scoreFromUnknown(v);
    return n !== undefined ? Math.round(n) : null;
  }

  /** Re-run embed: PDF upload → Qdrant first; fallback to scraped markdown if PDF unavailable */
  embedScrapedMarkdownToProduct(): void {
    if (!this.editingProductId || (!this.extractionId && !this.extractionMarkdownToEmbed?.trim())) {
      this.uploadEmbedError =
        'Save the product first (Finish). Complete an extraction so the PDF or scraped text is available.';
      return;
    }
    this.uploadEmbedError = '';
    this.analysisError.embed = '';
    this.analysisLoading.embed = true;
    this.buildEmbedExtractionObservable(this.editingProductId)
      .pipe(finalize(() => { this.analysisLoading.embed = false; }))
      .subscribe((res) => {
        if (!res.success) this.analysisError.embed = res.message || 'Embedding failed.';
      });
  }

  cancelExtraction(): void {
    // Client-side cancel only (backend continues unless you add a cancel endpoint).
    this.cancelExtractionPolling();
  }

  downloadExtraction(format: 'md' | 'pdf'): void {
    if (!this.extractionId || this.downloadLoading) return;
    this.downloadLoading = format;
    this.extractUrlError = '';

    const blob$ =
      format === 'pdf'
        ? this.productService.downloadExtractionPdf(this.extractionId)
        : this.productService.downloadExtractionMarkdown(this.extractionId);

    // PDF generation can be slow; cap wait so the button cannot spin forever (unsubscribe aborts the HTTP call).
    const timeoutMs = format === 'pdf' ? 120_000 : 60_000;

    blob$
      .pipe(
        timeout(timeoutMs),
        catchError((err: unknown) => {
          const isTimeout =
            err instanceof TimeoutError ||
            (typeof err === 'object' && err !== null && (err as { name?: string }).name === 'TimeoutError');
          if (isTimeout) {
            return throwError(
              () =>
                new Error(
                  'Download timed out. The server may still be generating the PDF — wait a moment and try again.'
                )
            );
          }
          return throwError(() => err);
        }),
        finalize(() => {
          this.downloadLoading = null;
        })
      )
      .subscribe({
        next: (blob) => {
          void this.processExtractionDownloadBlob(blob, format);
        },
        error: (err: unknown) => {
          void this.setDownloadErrorFromHttp(err);
        },
      });
  }

  private async setDownloadErrorFromHttp(err: unknown): Promise<void> {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      if (body instanceof Blob) {
        try {
          const text = await body.text();
          const trimmed = text.trim();
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            const j = JSON.parse(text) as { message?: string; error?: string; title?: string };
            this.extractUrlError = `Download failed: ${j.message || j.error || j.title || err.message}`;
            return;
          }
        } catch {
          /* fall through */
        }
      }
      if (typeof body === 'object' && body !== null && 'message' in body) {
        this.extractUrlError = `Download failed: ${String((body as { message: unknown }).message)}`;
        return;
      }
      this.extractUrlError = `Download failed: ${err.message || err.statusText || 'Request failed'}`;
      return;
    }
    const msg =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Unknown error';
    this.extractUrlError = `Download failed: ${msg}`;
  }

  /** Handle blob: detect JSON error bodies, trigger file save for real files */
  private async processExtractionDownloadBlob(blob: Blob, format: 'md' | 'pdf'): Promise<void> {
    if (!blob || blob.size === 0) {
      this.extractUrlError = `Download failed: empty response for ${format.toUpperCase()}.`;
      return;
    }

    const ct = (blob.type || '').toLowerCase();
    if (ct.includes('json') || ct === 'application/problem+json') {
      try {
        const text = await blob.text();
        const j = JSON.parse(text) as { message?: string; error?: string; title?: string };
        this.extractUrlError = j.message || j.error || j.title || 'Server returned JSON instead of a file.';
      } catch {
        this.extractUrlError = 'Download failed: server sent an invalid response.';
      }
      return;
    }

    // Some APIs return errors as JSON with wrong/missing Content-Type (octet-stream)
    if (blob.size < 4096 && (format === 'pdf' || format === 'md')) {
      const peek = await blob.slice(0, 512).text();
      const trimmed = peek.trimStart();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const full = await blob.text();
          const j = JSON.parse(full) as { message?: string; error?: string };
          if (j.message || j.error) {
            this.extractUrlError = j.message || j.error || 'Download failed.';
            return;
          }
        } catch {
          // not JSON — treat as binary/text file
        }
      }
    }

    const ext = format === 'pdf' ? 'pdf' : 'md';
    const title = (this.extractionJob?.document?.title || 'extraction').toString().trim();
    const safe = title.replace(/[^\w\- ]+/g, '').replace(/\s+/g, '-');
    const filename = `${safe || 'extraction'}.${ext}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  editProduct(product: PortfolioProduct): void {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProduct(product.id).subscribe((res) => {
      this.loading = false;
      if (res.success && res.data) {
        this.lastRunAnalysesProductId = null;
        this.lastAnalysesMarketFingerprint = '';
        this.editingProductId = res.data.id;
        this.patchWizardFromProduct(res.data);
        this.currentStep = 1;
        this.updateWizardStepStatus(1);
        this.activeTab = 'wizard';
        this.loadProposedFields();
        this.refreshExistingDocumentsCount();
      } else {
        this.errorMessage = res.message || 'Failed to load product.';
      }
    });
  }

  private refreshExistingDocumentsCount(): void {
    const id = this.editingProductId?.trim();
    if (!id) {
      this.existingDocumentsCount = null;
      this.existingDocuments = [];
      return;
    }
    this.existingDocumentsLoading = true;
    this.productService.getDocuments(id).subscribe((res) => {
      this.existingDocumentsLoading = false;
      if (res.success && Array.isArray(res.data)) {
        this.existingDocuments = res.data;
        this.existingDocumentsCount = res.data.length;
      } else {
        // Don't block the UI; just hide the count on failures.
        this.existingDocumentsCount = null;
        this.existingDocuments = [];
      }
    });
  }

  openDeleteDocumentConfirm(doc: ProductDocument): void {
    if (!doc?.id) return;
    if (this.deletingDocumentIds.has(doc.id)) return;
    this.documentToDelete = doc;
  }

  closeDeleteDocumentConfirm(): void {
    this.documentToDelete = null;
  }

  confirmDeleteDocument(): void {
    const doc = this.documentToDelete;
    if (!doc?.id) return;
    if (this.deletingDocumentIds.has(doc.id)) return;

    this.deletingDocumentIds.add(doc.id);
    this.productService.deleteDocument(doc.id).subscribe((res) => {
      this.deletingDocumentIds.delete(doc.id);
      if (res.success) {
        // Optimistic update + refresh for source of truth.
        this.existingDocuments = this.existingDocuments.filter((d) => d.id !== doc.id);
        this.existingDocumentsCount = this.existingDocuments.length;
        this.loadProposedFields();
        this.refreshExistingDocumentsCount();
        this.documentToDelete = null;
      } else {
        this.snackBar.open(res.message || 'Failed to delete document.', 'Dismiss', {
          duration: 6000,
          panelClass: ['pl-snackbar'],
        });
      }
    });
  }

  /** Refresh when BFF exposes ContextBuilder proposals (404 → no-op). */
  private loadProposedFields(): void {
    const id = this.editingProductId?.trim();
    if (!id) {
      this.proposedFields = null;
      return;
    }
    this.productService.getProposedFields(id).subscribe((res) => {
      this.proposedFields = res.success && res.data ? res.data : null;
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
        websiteUrl: this.wizardForm.websiteUrl?.trim() || undefined,
        competitorWebsiteUrls: this.wizardForm.competitorWebsiteUrls?.trim() || undefined,
        valueRows: this.valueRows.map((r) => (r.id ? { ...r } : { feature: r.feature, benefit: r.benefit, painPoint: r.painPoint, score: r.score })),
        status,
      }).subscribe((res) => {
        this.loading = false;
        if (res.success) {
          this.lastRunAnalysesProductId = null;
          this.setStep(2);
          this.activeTab = 'wizard';
          this.loadProducts(); // refresh portfolio list in background
          this.loadProposedFields();
          this.refreshExistingDocumentsCount();
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
        websiteUrl: this.wizardForm.websiteUrl?.trim() || undefined,
        competitorWebsiteUrls: this.wizardForm.competitorWebsiteUrls?.trim() || undefined,
        valueRows: valueRowsPayload,
        status,
        templateId: null,
      }).subscribe((res) => {
        this.loading = false;
        if (res.success && res.data?.id) {
          this.editingProductId = res.data.id;
          this.lastRunAnalysesProductId = null;
          this.setStep(2);
          this.activeTab = 'wizard';
          this.loadProducts(); // refresh portfolio list in background
          this.loadProposedFields();
          this.refreshExistingDocumentsCount();
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
      const incoming = Array.from(input.files);
      const allowed = ['pdf', 'docx', 'pptx'];
      const valid = incoming.filter((f) => allowed.includes((f.name.split('.').pop() || '').toLowerCase()));
      this.uploadedFiles = [...this.uploadedFiles, ...valid];
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

  async uploadAndEmbedSelectedDocs(): Promise<void> {
    if (!this.editingProductId) {
      this.uploadEmbedError = 'Create the product first (Finish) before embedding documents.';
      return;
    }
    if (!this.uploadedFiles.length) {
      this.uploadEmbedError = 'Please select at least one document.';
      return;
    }
    this.uploadEmbedError = '';
    this.uploadEmbedDone = false;
    this.uploadEmbedLoading = true;

    // Upload → read storage path from BFF response → embed with storage_path (metadata-only embeds fail validation)
    // Upload sequentially for simplicity (clear UX, fewer concurrency edge-cases)
    const docs: Array<{ documentId: string; storagePath: string; fileName: string }> = [];
    for (const f of this.uploadedFiles) {
      const res = await new Promise<import('../../shared/models/product.model').ApiResponse<import('../../shared/models/product.model').UploadDocumentResponse>>((resolve) => {
        this.productService.uploadDocument(this.editingProductId as string, f).subscribe(resolve);
      });
      const storagePath = this.productService.pickUploadStoragePath(res.data);
      if (!res.success || !storagePath) {
        this.uploadEmbedLoading = false;
        this.uploadEmbedError = res.message || `Upload failed for ${f.name}.`;
        return;
      }
      docs.push({
        documentId: this.productService.pickUploadDocumentId(res.data, f.name),
        storagePath,
        fileName: this.productService.pickUploadFileName(res.data, f.name),
      });
    }

    // Embed
    this.productService
      .embedProduct(this.editingProductId as string, {
        ...this.embedCollectionContext(),
        documents: docs.map((d) => ({
          id: d.documentId,
          name: d.fileName,
          type: this.inferEmbedDocType(d.fileName),
          storage_path: d.storagePath,
        })),
      })
      .subscribe((res) => {
        this.uploadEmbedLoading = false;
        if (res.success) {
          this.uploadEmbedDone = true;
          this.uploadedFiles = [];
          this.loadProposedFields();
          this.refreshExistingDocumentsCount();
        } else {
          this.uploadEmbedError = res.message || 'Embed failed.';
        }
      });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /** Step 5: show wizard lists as readable comma-separated text */
  formatReviewList(items: string[] | undefined): string {
    if (!items?.length) return '—';
    return items.join(', ');
  }

  /** Rich strategic description → plain text for review (avoids raw HTML in the summary) */
  strategicDescriptionReviewPreview(maxLen = 480): string {
    const raw = this.wizardForm.strategicDescription?.trim() ?? '';
    if (!raw) return '—';
    const plain = this.stripHtmlToPlainText(raw);
    if (!plain) return '—';
    return plain.length > maxLen ? plain.slice(0, maxLen) + '…' : plain;
  }

  private stripHtmlToPlainText(html: string): string {
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = html;
      return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
    }
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /** Live audit snapshot for review step (optional) */
  get auditReviewOverall(): number | null {
    const o = this.auditResult?.overall_score;
    if (o == null || typeof o !== 'number' || !Number.isFinite(o)) return null;
    return Math.max(0, Math.min(100, Math.round(o)));
  }

  get auditReviewCompleteness(): number | null {
    const c = this.auditResult?.completeness_percent;
    if (c == null || typeof c !== 'number' || !Number.isFinite(c)) return null;
    return Math.max(0, Math.min(100, Math.round(c)));
  }

  /** Resolve dimensions array from BFF camelCase or nested `ourProduct` / snake_case. */
  private pickRadarDimensionsRaw(r: MarketRadarResponse): unknown {
    const o = r as Record<string, unknown>;
    if (Array.isArray(r.dimensions)) return r.dimensions;
    const nested = (o['ourProduct'] ?? o['our_product']) as Record<string, unknown> | undefined;
    if (nested && Array.isArray(nested['dimensions'])) return nested['dimensions'];
    if (Array.isArray(o['radar_dimensions'])) return o['radar_dimensions'];
    return undefined;
  }

  private pickRadarScoresRaw(r: MarketRadarResponse): unknown {
    const o = r as Record<string, unknown>;
    if (Array.isArray(o['scores'])) return o['scores'];
    const nested = (o['ourProduct'] ?? o['our_product']) as Record<string, unknown> | undefined;
    if (nested && Array.isArray(nested['scores'])) return nested['scores'];
    return (
      o['values'] ?? o['our_scores'] ?? o['data_points'] ?? (r as { scores?: unknown[] }).scores
    );
  }

  /** Step 3 — show API radar dimensions when `radarResult` is populated */
  get radarDimensionsPreview(): Array<{ label: string; value: string }> {
    const r = this.radarResult;
    if (!r) return [];

    const raw = this.pickRadarDimensionsRaw(r);
    const scoresRaw = this.pickRadarScoresRaw(r);

    /** String array = dimension names; optional parallel numeric array */
    if (Array.isArray(raw)) {
      const scores = Array.isArray(scoresRaw) ? scoresRaw : null;
      return raw.map((d, i) => this.normalizeRadarDimensionEntry(d, i, scores?.[i]));
    }

    /** Object map: { "Price/Value": 72, ... } */
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      return Object.entries(raw as Record<string, unknown>).map(([k, v]) => ({
        label: k,
        value: v != null && typeof v !== 'object' ? String(v) : this.unknownToDisplayString(v, 48),
      }));
    }

    return [];
  }

  private normalizeRadarDimensionEntry(d: unknown, index: number, pairedScore: unknown): { label: string; value: string } {
    if (typeof d === 'string') {
      const label = d.trim() || `Dimension ${index + 1}`;
      if (pairedScore != null && pairedScore !== '') {
        return { label, value: String(pairedScore) };
      }
      return { label, value: '—' };
    }
    if (typeof d === 'number' || typeof d === 'boolean') {
      return { label: `Dimension ${index + 1}`, value: String(d) };
    }
    if (d && typeof d === 'object' && !Array.isArray(d)) {
      const o = d as Record<string, unknown>;
      const valStr = o['value'];
      const valueLooksLikeLabel =
        typeof valStr === 'string' && valStr.trim() !== '' && Number.isNaN(Number(valStr));
      const labelFromValue =
        valueLooksLikeLabel && !o['name'] && !o['label'] && !o['dimension'] ? valStr : null;

      const label = String(
        o['name'] ??
          o['label'] ??
          o['dimension'] ??
          o['title'] ??
          o['axis'] ??
          o['metric'] ??
          o['key'] ??
          labelFromValue ??
          `Dimension ${index + 1}`
      );
      const v =
        o['score'] ??
        o['percent'] ??
        o['Score'] ??
        o['our_score'] ??
        o['rating'] ??
        (typeof valStr === 'number' ? valStr : undefined) ??
        (pairedScore !== undefined ? pairedScore : undefined);
      return { label, value: v != null && v !== '' ? String(v) : '—' };
    }
    return { label: `Dimension ${index + 1}`, value: String(d) };
  }

  get radarCompetitorsSummary(): string {
    const r = this.radarResult?.competitors;
    if (r == null) return '';
    if (Array.isArray(r)) {
      return r
        .map((x) => (typeof x === 'string' ? x : this.unknownToDisplayString(x, 160)))
        .filter(Boolean)
        .join(' · ');
    }
    return this.unknownToDisplayString(r, 800);
  }

  get marketRadarHasInputs(): boolean {
    return !!(this.wizardForm.websiteUrl?.trim() || this.wizardForm.competitorWebsiteUrls?.trim() || this.wizardForm.competitors?.trim());
  }

  // --- Live audit micro-feedback (field_scores + optional field_messages) ---

  private auditWeightForKey(key: string): number {
    const w = this.auditResult?.field_weights?.[key];
    if (w != null && typeof w === 'number' && Number.isFinite(w)) return w;
    return DEFAULT_AUDIT_FIELD_WEIGHTS[key] ?? 1;
  }

  private auditMessageForKeys(keys: string[]): string {
    const fm = this.auditResult?.field_messages;
    const ft = this.auditResult?.field_tips;
    for (const k of keys) {
      const m = fm?.[k] ?? ft?.[k];
      if (m) return m;
    }
    return '';
  }

  private defaultAuditTip(score: number, key: string): string {
    if (score >= 80) return 'Strong — add concrete metrics or proof points if you can.';
    if (score >= 50) {
      if (key.includes('usp') || key === 'core_usp') return 'Tie the USP to a measurable outcome (time saved, revenue, risk).';
      if (key.includes('description')) return 'Add specifics: who it’s for, what it does, and why now.';
      if (key.includes('competitor')) return 'Name 2–3 alternatives and one sharp contrast.';
      return 'Add more concrete detail so positioning reads less generic.';
    }
    if (key.includes('usp') || key === 'core_usp') return 'Critical: define one sharp USP — problem, who feels it, your unique fix.';
    if (key === 'product_name') return 'Product name should signal category + differentiation.';
    return 'Critical gap — expand this field with specifics buyers can verify.';
  }

  auditFieldUi(keys: string[]): { badgeClass: string; title: string; tip: string } {
    if (this.auditLoading) {
      return { badgeClass: 'pl-audit-badge pl-audit-badge--pulse', title: 'Auditing…', tip: '' };
    }
    const score = this.auditFieldScore(...keys);
    if (score === undefined) {
      return {
        badgeClass: 'pl-audit-badge pl-audit-badge--muted',
        title: 'No score yet (save product or wait for live audit)',
        tip: '',
      };
    }
    const primaryKey = keys[0] ?? 'field';
    const w = this.auditWeightForKey(primaryKey);
    const weighted = ((w * score) / 100).toFixed(2);
    const title = `Score ${Math.round(score)}% · weight ${w} · weighted ${weighted}`;
    const tip = this.auditMessageForKeys(keys) || this.defaultAuditTip(score, primaryKey);
    if (score >= 80) return { badgeClass: 'pl-audit-badge pl-audit-badge--ok', title, tip };
    if (score >= 50) return { badgeClass: 'pl-audit-badge pl-audit-badge--warn', title, tip };
    return { badgeClass: 'pl-audit-badge pl-audit-badge--bad', title, tip };
  }

  scrollToField(anchor: string): void {
    const el = document.getElementById(anchor);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (el && 'focus' in el && typeof (el as HTMLElement).focus === 'function') {
      (el as HTMLElement).focus();
    }
  }

  // --- Context bar (client-side until BFF exposes ContextBuilder summary) ---

  countFilledFormFields(): number {
    const f = this.wizardForm;
    let n = 0;
    if (f.productName?.trim()) n++;
    if (f.category?.trim()) n++;
    if (f.businessModel?.trim()) n++;
    if (f.targetSizes?.length) n++;
    if (f.coreUsp?.trim()) n++;
    if (f.strategicDescription?.replace(/<[^>]*>/g, '').trim()) n++;
    if (f.targetIndustries?.length) n++;
    if (f.competitors?.trim()) n++;
    if (f.websiteUrl?.trim()) n++;
    if (f.competitorWebsiteUrls?.trim()) n++;
    return n;
  }

  competitorUrlCount(): number {
    const raw = this.wizardForm.competitorWebsiteUrls?.trim() || '';
    if (!raw) return 0;
    return raw
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean).length;
  }

  get contextSummary() {
    const docBits: string[] = [];
    for (const f of this.uploadedFiles) docBits.push(f.name);
    if (this.extractedDocFile) docBits.push(`${this.extractedDocFile.name} (parsed)`);
    const selectedCount = docBits.length;
    const existingCount = this.existingDocumentsCount ?? 0;
    const selectedLabel =
      selectedCount === 0
        ? ''
        : selectedCount <= 2
          ? docBits.join(', ')
          : `${docBits.slice(0, 2).join(', ')} +${selectedCount - 2}`;
    let docs = 'No uploads';
    if (selectedCount > 0 && existingCount > 0) docs = `${selectedLabel} · ${existingCount} uploaded`;
    else if (selectedCount > 0) docs = selectedLabel;
    else if (existingCount > 0) docs = `${existingCount} uploaded`;

    return {
      docs,
      fields: `${this.countFilledFormFields()} fields`,
      market: `${this.competitorUrlCount()} URLs`,
    };
  }

  // --- Knowledge HUD ---

  get knowledgeGapsList(): string[] {
    const k = this.knowledgeResult as Record<string, unknown> | null | undefined;
    return this.unknownToStringList(k?.['gaps']);
  }

  get knowledgeActionsList(): string[] {
    const k = this.knowledgeResult as Record<string, unknown> | null | undefined;
    return this.unknownToStringList(k?.['recommended_actions'] ?? k?.['recommendedActions']);
  }

  get knowledgeEstimatedQuality(): string {
    const k = this.knowledgeResult as Record<string, unknown> | null | undefined;
    const q = k?.['estimated_quality'] ?? k?.['estimatedQuality'];
    return typeof q === 'string' ? q : '';
  }

  private humanizeCoverageKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  get knowledgeCoverageRows(): Array<{ area: string; pct: number | null; detail: string }> {
    const k = this.knowledgeResult as Record<string, unknown> | null | undefined;
    const cov = k?.['coverage'];
    if (!cov || typeof cov !== 'object' || Array.isArray(cov)) return [];
    return Object.entries(cov as Record<string, unknown>).map(([area, val]) => {
      let pct: number | null = null;
      let detail = '';
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        const o = val as Record<string, unknown>;
        pct =
          this.scoreFromUnknown(o['percent'] ?? o['score'] ?? o['coverage_percent'] ?? o['CoveragePercent']) ?? null;
        detail = this.unknownToDisplayString(o['notes'] ?? o['gap'] ?? o['summary'] ?? o['detail'], 160);
      } else if (typeof val === 'number') {
        pct = val;
      }
      return {
        area: this.humanizeCoverageKey(area),
        pct: pct != null ? Math.round(Math.max(0, Math.min(100, pct))) : null,
        detail,
      };
    });
  }

  // --- Strategic cockpit ---

  get strategicStrengths(): string[] {
    return this.unknownToStringList(this.strategicResult?.strengths);
  }
  get strategicWeaknesses(): string[] {
    return this.unknownToStringList(this.strategicResult?.weaknesses);
  }
  get strategicOpportunities(): string[] {
    return this.unknownToStringList(this.strategicResult?.opportunities);
  }
  get strategicThreats(): string[] {
    return this.unknownToStringList(this.strategicResult?.threats);
  }

  get strategicPositioningSummary(): string {
    const p = this.strategicResult?.positioning as Record<string, unknown> | undefined;
    if (!p) return '';
    return this.unknownToDisplayString(p['summary'] ?? p['Summary'] ?? p['text'], 2000);
  }

  get strategicPositioningConfidencePct(): number | null {
    const p = this.strategicResult?.positioning as Record<string, unknown> | undefined;
    if (!p) return null;
    const c = this.scoreFromUnknown(p['confidence'] ?? p['Confidence']);
    if (c === undefined) return null;
    return Math.round(Math.max(0, Math.min(100, c <= 1 ? c * 100 : c)));
  }

  get strategicMessagingPersonas(): Array<{ persona: string; body: string; attribution?: string }> {
    const raw = this.strategicResult?.messaging_recommendations ?? (this.strategicResult as Record<string, unknown> | undefined)?.['messagingRecommendations'];
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => {
      if (!item || typeof item !== 'object') return { persona: 'Persona', body: '', attribution: '' };
      const o = item as Record<string, unknown>;
      const persona = String(o['persona'] ?? o['Persona'] ?? o['role'] ?? 'Persona');
      const kp = o['key_points'] ?? o['keyPoints'] ?? o['points'];
      let body = '';
      if (Array.isArray(kp)) {
        body = kp.map((x) => this.unknownToDisplayString(x)).filter(Boolean).join(' · ');
      }
      if (!body) body = this.unknownToDisplayString(o['angle'] ?? o['Angle'], 600);
      if (!body) body = this.unknownToDisplayString(o, 1200);
      const attr = this.formatInsightAttribution(o['explanation'] ?? o['attribution'] ?? o['source']);
      return { persona, body, attribution: attr };
    });
  }

  formatInsightAttribution(raw: unknown): string {
    if (!raw || typeof raw !== 'object') return '';
    const o = raw as Record<string, unknown>;
    const st = o['source_type'] ?? o['sourceType'];
    const sn = o['source_name'] ?? o['sourceName'];
    const conf = this.scoreFromUnknown(o['confidence'] ?? o['Confidence']);
    const parts: string[] = [];
    if (sn) parts.push(String(sn));
    if (st) parts.push(String(st));
    if (conf != null) parts.push(`${conf <= 1 ? Math.round(conf * 100) : Math.round(conf)}% confidence`);
    return parts.join(' · ');
  }

  // --- Value matrix (AI rows) ---

  get aiValueMatrixRows(): Array<Record<string, unknown>> {
    const vm = this.valueMatrixResult as Record<string, unknown> | null | undefined;
    const rows = vm?.['rows'];
    return Array.isArray(rows) ? (rows as Array<Record<string, unknown>>) : [];
  }

  valueMatrixScoreChip(score: unknown): { label: string; cls: string } {
    const n = this.scoreFromUnknown(score);
    if (n === undefined) return { label: '—', cls: 'pl-vm-chip pl-vm-chip--muted' };
    const v = n > 10 ? n : n * 100;
    const x = Math.round(Math.max(0, Math.min(100, v)));
    if (x >= 70) return { label: 'High', cls: 'pl-vm-chip pl-vm-chip--high' };
    if (x >= 40) return { label: 'Medium', cls: 'pl-vm-chip pl-vm-chip--mid' };
    return { label: 'Low', cls: 'pl-vm-chip pl-vm-chip--low' };
  }

  applyAiMatrixRow(row: Record<string, unknown>): void {
    const feature = String(row['feature'] ?? '').trim();
    const benefit = String(row['benefit'] ?? '').trim();
    const pain = String(row['pain_point'] ?? row['painPoint'] ?? '').trim();
    const sc = row['score'];
    const chip = this.valueMatrixScoreChip(sc);
    this.valueRows = [
      ...this.valueRows,
      {
        feature: feature || 'Feature',
        benefit,
        painPoint: pain,
        score: chip.label,
      },
    ];
  }

  // --- Radar chart ---

  parsePercentLike(v: unknown): number {
    if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.min(100, v));
    const s = String(v ?? '')
      .replace(/%/g, '')
      .trim();
    const n = Number(s);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  }

  get radarChartLabels(): string[] {
    return this.radarDimensionsPreview.map((p) => p.label);
  }

  get radarChartSeries(): PlRadarSeries[] {
    const preview = this.radarDimensionsPreview;
    if (preview.length < 3) return [];
    const ours = preview.map((p) => this.parsePercentLike(p.value));
    const series: PlRadarSeries[] = [
      { name: 'Our product', values: ours, dashed: false, color: '#06b6d4' },
    ];
    const rr = this.radarResult as Record<string, unknown> | null;
    if (!rr) return series;

    const alt = rr['competitor_series'] ?? rr['competitorSeries'] ?? rr['competitorScores'];
    if (Array.isArray(alt)) {
      const colors = ['#94a3b8', '#a78bfa', '#f97316'];
      alt.forEach((c, idx) => {
        if (!c || typeof c !== 'object') return;
        const o = c as Record<string, unknown>;
        const name = String(o['name'] ?? o['label'] ?? o['competitor'] ?? `Competitor ${idx + 1}`);
        let vals = o['scores'] ?? o['values'] ?? o['data_points'] ?? o['dataPoints'];
        if (Array.isArray(vals)) {
          const nums = (vals as unknown[]).map((v) => this.parsePercentLike(v));
          series.push({ name, values: nums, dashed: true, color: colors[idx % colors.length] });
          return;
        }
        const byDim = o['by_dimension'] ?? o['byDimension'] ?? o['dimensions'];
        if (byDim && typeof byDim === 'object' && !Array.isArray(byDim)) {
          const m = byDim as Record<string, unknown>;
          const nums = preview.map((pr) => this.parsePercentLike(m[pr.label]));
          series.push({ name, values: nums, dashed: true, color: colors[idx % colors.length] });
        }
      });
    }
    return series;
  }

  get radarDifferentiators(): string[] {
    const rr = this.radarResult as Record<string, unknown> | null;
    const raw = rr?.['key_differentiators'] ?? rr?.['keyDifferentiators'] ?? rr?.['insights'];
    return this.unknownToStringList(raw);
  }

  get extractionPipelineStage(): string {
    if (!this.extractionPollingActive && this.extractionStatus !== 'processing') return '';
    const p = this.extractionProgress;
    if (p < 25) return 'Scraping pages…';
    if (p < 55) return 'Chunking content…';
    if (p < 85) return 'Extracting fields (LLM)…';
    return 'Finalizing document…';
  }

  // --- Scoring card ---

  get scoreReadinessLabel(): string {
    const r = this.scoreResult?.readiness ?? (this.scoreResult as Record<string, unknown> | undefined)?.['Readiness'];
    return typeof r === 'string' ? r : '';
  }

  get scoreBreakdownBars(): Array<{ key: string; label: string; pct: number }> {
    const raw = this.scoreResult?.breakdown;
    if (!Array.isArray(raw)) {
      return Object.keys(SCORE_DIMENSION_LABELS).map((key) => ({
        key,
        label: SCORE_DIMENSION_LABELS[key] ?? key,
        pct: 0,
      }));
    }
    return raw.map((item, i) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const o = item as Record<string, unknown>;
        const key = String(o['key'] ?? o['dimension'] ?? o['name'] ?? `d${i}`);
        const pct =
          this.scoreFromUnknown(o['score'] ?? o['percent'] ?? o['value'] ?? o['weight']) ?? 0;
        const n = pct > 10 ? pct : pct * 100;
        return {
          key,
          label: SCORE_DIMENSION_LABELS[key] ?? this.humanizeCoverageKey(key),
          pct: Math.round(Math.max(0, Math.min(100, n))),
        };
      }
      const n = this.scoreFromUnknown(item) ?? 0;
      return {
        key: `d${i}`,
        label: `Dimension ${i + 1}`,
        pct: Math.round(Math.max(0, Math.min(100, n > 10 ? n : n * 100))),
      };
    });
  }

  // --- Ghost suggestions: `GET …/proposed-fields` first, then website extraction ---

  private pickExtracted(...keys: string[]): string {
    const fields = (this.extractionJob?.extracted_fields || {}) as Record<string, unknown>;
    for (const k of keys) {
      if (fields[k] == null) continue;
      const s = this.unknownToDisplayString(fields[k], 4000);
      if (s.trim()) return s.trim();
    }
    return '';
  }

  private proposedSuggestionText(s: ProposedFieldSuggestion | undefined): string {
    if (!s || typeof s !== 'object') return '';
    const pv = s.proposed_value ?? s.proposedValue ?? s.value;
    return typeof pv === 'string' && pv.trim() ? pv.trim() : '';
  }

  private proposedAttribution(s: ProposedFieldSuggestion | undefined): string {
    if (!s || typeof s !== 'object') return '';
    const parts: string[] = [];
    const src = s.source ?? s.source_name ?? s.sourceName;
    if (typeof src === 'string' && src.trim()) parts.push(`From: ${src.trim()}`);
    const c = s.confidence;
    if (typeof c === 'number' && !Number.isNaN(c)) {
      const pct = c <= 1 ? Math.round(c * 100) : Math.round(Math.min(100, c));
      parts.push(`${pct}% match`);
    }
    if (typeof s.reason === 'string' && s.reason.trim()) parts.push(s.reason.trim());
    return parts.join(' • ');
  }

  private pickProposed(keys: string[]): ProposedFieldSuggestion | undefined {
    const m = this.proposedFields;
    if (!m || typeof m !== 'object') return undefined;
    for (const k of keys) {
      const raw = m[k];
      if (raw && typeof raw === 'object' && this.proposedSuggestionText(raw as ProposedFieldSuggestion)) {
        return raw as ProposedFieldSuggestion;
      }
    }
    return undefined;
  }

  /** Shown under empty fields when focused; document proposals beat extraction. */
  get productNameGhostUi(): { text: string; attribution: string; source: 'documents' | 'extraction' } | null {
    if (this.ghostDismissed.has('productName')) return null;
    if (this.wizardForm.productName.trim()) return null;
    const prop = this.pickProposed(['product_name', 'productName']);
    const doc = prop ? this.proposedSuggestionText(prop) : '';
    if (doc) {
      return { text: doc, attribution: this.proposedAttribution(prop), source: 'documents' };
    }
    const ex = this.pickExtracted('product_name', 'productName', 'name', 'title');
    return ex ? { text: ex, attribution: 'From website extraction', source: 'extraction' } : null;
  }

  get coreUspGhostUi(): { text: string; attribution: string; source: 'documents' | 'extraction' } | null {
    if (this.ghostDismissed.has('coreUsp')) return null;
    if (this.wizardForm.coreUsp.trim()) return null;
    const prop = this.pickProposed(['core_usp', 'coreUsp']);
    const doc = prop ? this.proposedSuggestionText(prop) : '';
    if (doc) {
      return { text: doc, attribution: this.proposedAttribution(prop), source: 'documents' };
    }
    const ex = this.pickExtracted('core_usp', 'coreUsp', 'usp', 'value_proposition', 'tagline');
    return ex ? { text: ex, attribution: 'From website extraction', source: 'extraction' } : null;
  }

  acceptProductNameGhost(): void {
    const g = this.productNameGhostUi;
    if (g) this.wizardForm.productName = g.text;
    this.onFormIntelChange();
  }

  ignoreProductNameGhost(): void {
    this.ghostDismissed.add('productName');
  }

  acceptCoreUspGhost(): void {
    const g = this.coreUspGhostUi;
    if (g) this.wizardForm.coreUsp = g.text;
    this.onFormIntelChange();
  }

  ignoreCoreUspGhost(): void {
    this.ghostDismissed.add('coreUsp');
  }

  // --- Step quality ring (0–100) ---

  /**
   * Per-step “quality” ring: only for active/completed steps so future steps don’t show fake %.
   * Values mix live audit / knowledge / simple form signals — not a server “step score” until the BFF exposes one.
   */
  stepQualityPercent(stepId: number): number {
    const audit = this.auditReviewOverall ?? this.positioningClarityPct;
    const know = this.knowledgePercentDisplay ?? 0;
    switch (stepId) {
      case 1:
        return Math.round(Math.max(0, Math.min(100, audit)));
      case 2:
        return Math.round(Math.max(0, Math.min(100, know || audit * 0.6)));
      case 3: {
        if (!this.marketRadarHasInputs) return 0;
        if (this.radarChartLabels.length) {
          return Math.round(Math.max(0, Math.min(100, know ? know * 0.85 : audit * 0.7)));
        }
        return Math.round(Math.max(0, Math.min(100, audit * 0.5 + 15)));
      }
      case 4: {
        const n = Math.max(1, this.valueRows.length);
        const filled = this.valueRows.filter((r) => (r.feature || '').trim()).length;
        const rowPct = Math.round((filled / n) * 100);
        return Math.round(Math.min(100, rowPct * 0.65 + audit * 0.35));
      }
      case 5:
        return Math.round(Math.max(0, Math.min(100, (audit + know) / 2)));
      default:
        return 0;
    }
  }

  /** `null` = step not started yet — don’t show a misleading quality %. */
  stepQualityDisplay(step: WizardStep): number | null {
    if (step.status === 'pending') return null;
    return this.stepQualityPercent(step.id);
  }

  get auditSuggestionsList(): string[] {
    return this.auditResult?.suggestions ?? [];
  }
}
