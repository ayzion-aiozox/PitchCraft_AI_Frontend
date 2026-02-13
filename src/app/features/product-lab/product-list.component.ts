import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-list-container">
      <h2>Product List</h2>
      <p>This is the product list page.</p>
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 2rem;
    }
  `]
})
export class ProductListComponent {}