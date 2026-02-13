import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-detail-container">
      <h2>Product Detail</h2>
      <p>This is the product detail page.</p>
    </div>
  `,
  styles: [`
    .product-detail-container {
      padding: 2rem;
    }
  `]
})
export class ProductDetailComponent {}