import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../../services/wishlist.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.css']
})
export class Wishlist implements OnInit {
  wishlistItems: any[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  totalItems = 0;

  constructor(
    private wishlistService: WishlistService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading = true;
    this.wishlistService.getWishlist(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.wishlistItems = response.data.items;
          this.totalItems = response.data.total;
          this.totalPages = response.data.pages;
        } else {
          this.notification.error(response.message || 'خطا در دریافت علاقه‌مندی‌ها');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadWishlist();
  }

  removeFromWishlist(productId: string, productTitle: string): void {
    if (confirm(`آیا از حذف "${productTitle}" از علاقه‌مندی‌ها مطمئن هستید؟`)) {
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notification.success(response.message || 'محصول از علاقه‌مندی‌ها حذف شد');
            this.loadWishlist();
          } else {
            this.notification.error(response.message || 'خطا در حذف از علاقه‌مندی‌ها');
          }
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          this.notification.error('خطا در ارتباط با سرور');
        }
      });
    }
  }

  clearAllWishlist(): void {
    if (confirm('آیا از حذف همه محصولات از علاقه‌مندی‌ها مطمئن هستید؟')) {
      this.wishlistService.clearWishlist().subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notification.success(response.message || 'همه محصولات از علاقه‌مندی‌ها حذف شد');
            this.loadWishlist();
          } else {
            this.notification.error(response.message || 'خطا در پاک کردن علاقه‌مندی‌ها');
          }
        },
        error: (error) => {
          console.error('Error clearing wishlist:', error);
          this.notification.error('خطا در ارتباط با سرور');
        }
      });
    }
  }

  addToCart(product: any): void {
    // منطق افزودن به سبد خرید
    this.notification.success(`${product.title} به سبد خرید اضافه شد`);
  }

  trackById(index: number, item: any): string {
    return item._id;
  }
}
