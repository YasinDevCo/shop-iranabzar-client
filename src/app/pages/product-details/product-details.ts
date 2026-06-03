import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationCartService } from '../../services/notification-cart.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetailsComponent implements OnInit {
  // Product data
  product: any = null;
  loading = false;
  quantity = 1;
  selectedImage = '';
  activeTab: 'details' | 'specs' | 'reviews' = 'details';

  // Reviews data
  reviews: any[] = [];
  reviewsLoading = false;
  reviewStats = { average: 0, total: 0 };
  showReviewForm = false;
  reviewModel = {
    rating: 5,
    title: '',
    comment: ''
  };
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationCartService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadProduct(id);
    this.loadReviews(id);
  }

  // Load product details
  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getById(id).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.product = response.data;
          this.selectedImage = this.product.images?.[0] || '/assets/images/default.png';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  // Load product reviews
  loadReviews(productId: string): void {
    this.reviewsLoading = true;
    this.reviewService.getProductReviews(productId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.reviews = response.data.reviews || [];
          this.reviewStats = {
            average: response.data.average || 0,
            total: response.data.total || 0
          };
        }
        this.reviewsLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading reviews:', error);
        this.reviewsLoading = false;
      }
    });
  }

  // Add product to cart
  addToCart(): void {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addItem(this.product);
      }
      this.notification.success(`${this.quantity} عدد ${this.product.title} به سبد خرید اضافه شد`);
    }
  }

  // Change product quantity
  changeQuantity(delta: number): void {
    const newQuantity = this.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (this.product?.stock || 99)) {
      this.quantity = newQuantity;
    }
  }

  // Select product image
  selectImage(image: string): void {
    this.selectedImage = image;
  }

  // Get category name
  getCategoryName(): string {
    if (!this.product?.category) return 'متفرقه';
    if (typeof this.product.category === 'string') return 'متفرقه';
    return this.product.category.name || 'متفرقه';
  }

  // Generate rating stars
  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return '⭐'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  }

  // Submit new review
  submitReview(): void {
    if (!this.reviewModel.title.trim()) {
      this.notification.error('لطفاً عنوان نظر را وارد کنید');
      return;
    }
    if (!this.reviewModel.comment.trim()) {
      this.notification.error('لطفاً متن نظر را وارد کنید');
      return;
    }

    this.submitting = true;
    this.reviewService.createReview({
      productId: this.product._id,
      rating: this.reviewModel.rating,
      title: this.reviewModel.title,
      comment: this.reviewModel.comment
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notification.success('نظر شما با موفقیت ثبت شد');
          this.showReviewForm = false;
          this.reviewModel = { rating: 5, title: '', comment: '' };
          this.loadReviews(this.product._id);
        } else {
          this.notification.error(response.message || 'خطا در ثبت نظر');
        }
        this.submitting = false;
      },
      error: (error: any) => {
        console.error('Error submitting review:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.submitting = false;
      }
    });
  }
}
