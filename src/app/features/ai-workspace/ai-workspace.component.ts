import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProductListItem } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { AgentSelectorComponent } from './components/agent-selector/agent-selector.component';
import { AgentStatusBarComponent } from './components/agent-status-bar/agent-status-bar.component';
import { ChatInterfaceComponent } from './components/chat-interface/chat-interface.component';
import { MessageBubbleComponent } from './components/message-bubble/message-bubble.component';
import { ProductContextPanelComponent } from './components/product-context-panel/product-context-panel.component';
import { TaskLogComponent } from './components/task-log/task-log.component';

type AgentId = 'orchestrator' | 'leads' | 'campaigns' | 'personas' | 'product' | 'images';

interface AiWorkspaceMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

@Component({
  selector: 'app-ai-workspace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AgentSelectorComponent,
    AgentStatusBarComponent,
    ChatInterfaceComponent,
    MessageBubbleComponent,
    ProductContextPanelComponent,
    TaskLogComponent,
  ],
  templateUrl: './ai-workspace.component.html',
  styleUrls: ['./ai-workspace.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AiWorkspaceComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly productService = inject(ProductService);

  @ViewChild('fileInput') private readonly fileInput?: ElementRef<HTMLInputElement>;

  // Product context
  products: ProductListItem[] = [];
  productsLoading = false;
  productPickerOpen = false;
  productSearch = '';
  activeProduct: ProductListItem | null = null;

  // Agent selection (auto by default)
  agentMode: 'auto' | 'manual' = 'auto';
  agentOverride: AgentId = 'orchestrator';
  showSettings = false;
  rightTab: 'runs' | 'agents' = 'runs';
  agentPickerOpen = false;
  toolsMenuOpen = false;

  // ChatGPT-like tool toggles (UI-only stubs for now)
  toolFiles = true;
  toolCreateImage = false;
  toolThinking = false;
  toolDeepResearch = false;
  toolWebSearch = false;
  toolCanvas = false;

  readonly availableAgents: Array<{ id: AgentId; label: string; icon: string }> = [
    { id: 'orchestrator', label: 'Orchestrator', icon: 'lucide:bot' },
    { id: 'leads', label: 'Lead Agent', icon: 'lucide:users' },
    { id: 'campaigns', label: 'Campaign Agent', icon: 'lucide:megaphone' },
    { id: 'personas', label: 'Persona Agent', icon: 'lucide:user-round' },
    { id: 'product', label: 'Product Agent', icon: 'lucide:package' },
    { id: 'images', label: 'Image Agent', icon: 'lucide:image' },
  ];

  selectedAgentIds = new Set<AgentId>(['orchestrator', 'leads', 'campaigns']);

  tiles: Array<{ id: string; title: string; desc: string; icon: string }> = [
    {
      id: 't1',
      title: 'Find 100 B2B leads',
      desc: 'Discover and enrich prospects matching your ICP in a specific region.',
      icon: 'lucide:search',
    },
    {
      id: 't2',
      title: 'Draft an email sequence',
      desc: 'Generate personalized multi-step campaigns for your active product.',
      icon: 'lucide:mail',
    },
    {
      id: 't3',
      title: 'Create a campaign plan',
      desc: 'Strategy workflow focusing on positioning and competitive advantage.',
      icon: 'lucide:layout',
    },
    {
      id: 't4',
      title: 'Generate poster images',
      desc: 'Direct the Image Agent to create branded assets and creatives.',
      icon: 'lucide:image',
    },
  ];

  get selectedAgentsLabel(): string {
    const n = this.selectedAgentIds.size;
    return `${n} Agent${n === 1 ? '' : 's'}`;
  }

  get greetingName(): string {
    return 'Majid';
  }

  get greetingPrefix(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  // Chat
  chatInput = '';
  messages: AiWorkspaceMessage[] = [
    {
      id: 'm1',
      role: 'assistant',
      text:
        'Welcome to Cyphary. Select a product and tell me what outcome you want — I will coordinate the right agents to execute.',
      ts: Date.now(),
    },
  ];

  get filteredProducts(): ProductListItem[] {
    const q = this.productSearch.trim().toLowerCase();
    const list = this.products;
    if (!q) return list.slice(0, 10);
    return list
      .filter((p) => (p.title || '').toLowerCase().includes(q))
      .slice(0, 10);
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.productPickerOpen = false;
    this.showSettings = false;
    this.agentPickerOpen = false;
    this.toolsMenuOpen = false;
  }

  toggleProductPicker(e: MouseEvent): void {
    e.stopPropagation();
    this.productPickerOpen = !this.productPickerOpen;
    if (this.productPickerOpen) {
      this.showSettings = false;
      this.agentPickerOpen = false;
    }
  }

  toggleSettings(e: MouseEvent): void {
    e.stopPropagation();
    this.showSettings = !this.showSettings;
    if (this.showSettings) {
      this.productPickerOpen = false;
      this.agentPickerOpen = false;
      this.toolsMenuOpen = false;
    }
  }

  toggleAgentPicker(e: MouseEvent): void {
    e.stopPropagation();
    this.agentPickerOpen = !this.agentPickerOpen;
    if (this.agentPickerOpen) {
      this.productPickerOpen = false;
      this.showSettings = false;
      this.toolsMenuOpen = false;
    }
  }

  toggleToolsMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.toolsMenuOpen = !this.toolsMenuOpen;
    if (this.toolsMenuOpen) {
      this.productPickerOpen = false;
      this.showSettings = false;
      this.agentPickerOpen = false;
    }
  }

  closeToolsMenu(): void {
    this.toolsMenuOpen = false;
  }

  pickProduct(p: ProductListItem, e?: MouseEvent): void {
    e?.stopPropagation();
    this.activeProduct = p;
    this.productPickerOpen = false;
  }

  clearProduct(e?: MouseEvent): void {
    e?.stopPropagation();
    this.activeProduct = null;
    this.productSearch = '';
  }

  pickComposerAgent(id: AgentId, e?: MouseEvent): void {
    e?.stopPropagation();
    this.agentMode = 'manual';
    this.agentOverride = id;
  }

  toggleAgentSelection(id: AgentId, e?: MouseEvent): void {
    e?.stopPropagation();

    if (id === 'orchestrator') {
      // Always keep orchestrator selected (core router).
      this.selectedAgentIds.add('orchestrator');
      return;
    }

    if (this.selectedAgentIds.has(id)) this.selectedAgentIds.delete(id);
    else this.selectedAgentIds.add(id);

    // Never allow empty selection.
    if (this.selectedAgentIds.size === 0) this.selectedAgentIds.add('orchestrator');
  }

  openFilePicker(e?: MouseEvent): void {
    e?.stopPropagation();
    this.fileInput?.nativeElement?.click();
  }

  onFilesSelected(e: Event): void {
    const input = e.target as HTMLInputElement | null;
    const files = input?.files ? Array.from(input.files) : [];
    if (!files.length) return;

    // UI-only stub: show a small acknowledgement in chat.
    const names = files.map((f) => f.name).slice(0, 3).join(', ');
    const suffix = files.length > 3 ? ` (+${files.length - 3} more)` : '';
    this.messages = [
      ...this.messages,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: `Got it. I’ll use these files as context once upload is connected: ${names}${suffix}`,
        ts: Date.now(),
      },
    ];

    // reset so selecting same file again fires change
    if (input) input.value = '';
  }

  startVoice(e?: MouseEvent): void {
    e?.stopPropagation();
    this.messages = [
      ...this.messages,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: 'Voice input is coming soon. For now, type your request and I’ll coordinate the agents.',
        ts: Date.now(),
      },
    ];
  }

  send(): void {
    const text = this.chatInput.trim();
    if (!text) return;

    this.messages = [
      ...this.messages,
      { id: `u-${Date.now()}`, role: 'user', text, ts: Date.now() },
      {
        id: `a-${Date.now() + 1}`,
        role: 'assistant',
        text: this.composeAssistantStub(text),
        ts: Date.now() + 1,
      },
    ];
    this.chatInput = '';
  }

  runTile(tileId: string): void {
    const t = this.tiles.find((x) => x.id === tileId);
    if (!t) return;
    this.chatInput = t.title;
    this.send();
  }

  runCardAction(cardId: string, actionId: string): void {
    // UI-only stub: keep actions “alive” without backend coupling yet.
    if (actionId === 'view-capabilities') {
      this.messages = [
        ...this.messages,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text:
            'Capabilities: lead discovery + enrichment, campaign generation + launch plans, ICP/persona synthesis, competitive positioning, and content assets (email sequences, landing copy, posters).',
          ts: Date.now(),
        },
      ];
    }
  }

  private composeAssistantStub(userText: string): string {
    const product = this.activeProduct?.title?.trim();
    const mode =
      this.agentMode === 'auto'
        ? 'Auto‑routing enabled — I will select the right agents.'
        : `Manual override: ${this.agentOverride}.`;
    if (!product) {
      return `${mode}\n\nFirst, select a product so I can use its USP, category, business model, and embedded documents as context. Then re-send: “${userText}”`;
    }
    return `${mode}\n\nContext locked to: “${product}”.\nTell me your outcome (e.g., “find 100 leads”, “build a campaign”, “create a persona”, “generate poster images”) and I’ll execute.`;
  }

  private loadProducts(): void {
    this.productsLoading = true;
    this.productService
      .getProducts(1, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        const items = res.success ? res.data?.items ?? [] : [];
        if (items.length) {
          this.productsLoading = false;
          this.products = items;
          return;
        }

        // Fallback: if a stale/incorrect WorkspaceId is present in localStorage,
        // the API may return an empty list. Retry without workspace filtering.
        this.productService
          .getProducts(1, 100, '')
          .pipe(takeUntil(this.destroy$))
          .subscribe((res2) => {
            this.productsLoading = false;
            this.products = res2.success ? res2.data?.items ?? [] : [];
          });
      });
  }
}

