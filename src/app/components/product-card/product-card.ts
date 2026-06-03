import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCardComponent {
  @Input() product!: any;
  @Input() cardVariant: 'default' | 'orange' = 'default';
  @Output() addToCart = new EventEmitter<any>();

  constructor(private router: Router) {}

  getImageUrl(): string {
    if (this.product?.images && this.product.images.length > 0) {
      return this.product.images[0];
    }
    return '/assets/images/default-product.png';
  }

  getShortTitle(): string {
    if (!this.product?.title) return 'محصول';
    if (this.product.title.length > 30) {
      return this.product.title.substring(0, 30) + '...';
    }
    return this.product.title;
  }

  getShortDescription(): string {
    if (!this.product?.description) return 'توضیحاتی برای این محصول موجود نیست';
    if (this.product.description.length > 100) {
      return this.product.description.substring(0, 100) + '...';
    }
    return this.product.description;
  }

  addToCartClick(): void {
    this.addToCart.emit(this.product);
  }

  goToDetail(productId: string): void {
    if (productId) {
      this.router.navigate(['/product', productId]);
    }
  }

  isInStock(): boolean {
    return this.product?.stock > 0;
  }

  getStockStatusText(): string {
    if (!this.product || this.product.stock === 0) return 'ناموجود';
    if (this.product.stock < 5) return `فقط ${this.product.stock} عدد`;
    return 'موجود';
  }

  getStockStatusClass(): string {
    if (!this.product || this.product.stock === 0) return 'out-stock';
    if (this.product.stock < 5) return 'low-stock';
    return 'in-stock';
  }
}
