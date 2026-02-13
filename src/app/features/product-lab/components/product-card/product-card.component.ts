import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MoreHorizontal, Loader2 } from 'lucide-angular';

export type ProductStatus = 'active' | 'processing' | 'draft';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="product-card">
      <div class="card-header">
        <div class="product-icon-wrapper">
          <div class="product-logo" [style.background-color]="logoColor">{{ logoLetters }}</div>
          <div class="product-meta">
            <div class="product-title">{{ title }}</div>
            <div class="product-updated">{{ updated }}</div>
          </div>
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-outline card-action-btn" (click)="menuClick.emit()" aria-label="More options">
            <lucide-icon [img]="MoreHorizontal" [size]="16"></lucide-icon>
          </button>
        </div>
      </div>

      <div>
        @switch (status) {
          @case ('active') {
            <span class="status-badge status-active">Active</span>
          }
          @case ('processing') {
            <span class="status-badge status-processing">
              <lucide-icon [img]="Loader2" [size]="10" class="status-spinner"></lucide-icon>
              Processing
            </span>
          }
          @case ('draft') {
            <span class="status-badge status-draft">Draft</span>
          }
        }
      </div>

      @if (progressLabel !== undefined) {
        <div class="progress-section">
          <div class="progress-label">
            <span>{{ progressLabel }}</span>
            <span>{{ progressPercent }}%</span>
          </div>
          <div class="progress-bg">
            <div
              class="progress-fill"
              [style.width.%]="progressPercent"
              [style.background-color]="progressPercent === 100 ? 'var(--success)' : 'var(--secondary)'"
            ></div>
          </div>
        </div>
      }

      <div class="card-footer">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .card-action-btn { height: 28px; padding: 0 8px; }
    .status-spinner { margin-right: 4px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ProductCardComponent {
  @Input() title = '';
  @Input() updated = '';
  @Input() status: ProductStatus = 'draft';
  @Input() logoLetters = '';
  @Input() logoColor = 'var(--primary)';
  @Input() progressLabel: string | undefined;
  @Input() progressPercent = 0;
  @Output() menuClick = new EventEmitter<void>();

  readonly MoreHorizontal = MoreHorizontal;
  readonly Loader2 = Loader2;
}