import { Component } from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {CartService} from '../../../services/cart.service';
import {NotificationCartService} from '../../../services/notification-cart.service';
import {NgForOf, NgIf} from '@angular/common';
import {ProductCardComponent} from '../../product-card/product-card';

@Component({
  selector: 'app-bestselling-products',
  imports: [
    NgForOf,
    NgIf,
    ProductCardComponent
  ],
  templateUrl: './bestselling-products.html',
  styleUrl: './bestselling-products.css',
})
export class BestsellingProducts {

  products: any[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationCartService
  ) {}


  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    const filters: any = {
      limit: 4
    };

    this.productService.getFilteredProducts(filters).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.products = response.data.products;
        } else {
          this.products = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.products = [];
      }
    });
  }

  addToCart(product: any): void {
    this.cartService.addItem(product);
    this.notification.success(`${product.title} به سبد خرید اضافه شد`);
  }
}
