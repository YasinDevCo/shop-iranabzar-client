import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../services/review.service';
import { NotificationService } from '../../../services/notification.service';
import {Pagination} from '../../../components/pagination/pagination';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-my-reviews',
  imports: [CommonModule, FormsModule, Pagination, RouterLink],
  templateUrl: './my-reviews.html',
  styleUrls: ['./my-reviews.css']
})
export class MyReviews implements OnInit {
  reviews: any[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalReviews = 0;
  stats = { total: 0, average: 0 };

  showEditModal = false;
  selectedReview: any = null;
  editModel = {
    rating: 5,
    title: '',
    comment: ''
  };
  submitted = false;

  constructor(
    private reviewService: ReviewService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
    this.loadStats();
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getMyReviews(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.reviews = response.data.reviews;
          this.totalReviews = response.data.total;
          this.totalPages = response.data.pages;
        } else {
          this.notification.error(response.message || 'خطا در دریافت نظرات');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.reviewService.getReviewStats().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.stats = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadReviews();
  }

  openEditModal(review: any): void {
    this.selectedReview = review;
    this.editModel = {
      rating: review.rating,
      title: review.title,
      comment: review.comment
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedReview = null;
    this.editModel = { rating: 5, title: '', comment: '' };
    this.submitted = false;
  }

  updateReview(): void {
    if (!this.editModel.title?.trim()) {
      this.notification.error('لطفاً عنوان نظر را وارد کنید');
      return;
    }
    if (!this.editModel.comment?.trim()) {
      this.notification.error('لطفاً متن نظر را وارد کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.reviewService.updateReview(this.selectedReview._id, this.editModel).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notification.success(response.message || 'نظر با موفقیت ویرایش شد');
          this.closeEditModal();
          this.loadReviews();
          this.loadStats();
        } else {
          this.notification.error(response.message || 'خطا در ویرایش نظر');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error updating review:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  deleteReview(id: string, productTitle: string): void {
    if (confirm(`آیا از حذف نظر خود برای محصول "${productTitle}" مطمئن هستید؟`)) {
      this.loading = true;
      this.reviewService.deleteReview(id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notification.success(response.message || 'نظر با موفقیت حذف شد');
            this.loadReviews();
            this.loadStats();
          } else {
            this.notification.error(response.message || 'خطا در حذف نظر');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting review:', error);
          this.notification.error('خطا در ارتباط با سرور');
          this.loading = false;
        }
      });
    }
  }

  getRatingStars(rating: number): string {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  trackById(index: number, item: any): string {
    return item._id;
  }
}
