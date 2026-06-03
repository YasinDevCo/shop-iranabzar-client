import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { DashboardService } from '../../../services/dashboard.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-user-panel-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-panel-home.html',
  styleUrls: ['./user-panel-home.css']
})
export class UserPanelHome implements OnInit {
  isAdmin = false;
  userName = 'کاربر';
  loading = false;

  // آمارهای عمومی (ادمین)
  adminStats: any = {
    sales: { total: 0, monthly: 0, growth: 0 },
    orders: { total: 0, paid: 0, pending: 0, cancelled: 0 },
    products: { total: 0, lowStock: 0, outOfStock: 0 },
    users: { total: 0, newThisMonth: 0, admins: 0, customers: 0 },
    payments: { total: 0, successful: 0, failed: 0, pending: 0 },
    messages: { total: 0, unread: 0, read: 0, replied: 0 },
    recentOrders: [],
    topProducts: []
  };

  // آمارهای کاربر عادی
  userStats: any = {
    orders: { total: 0, paid: 0, pending: 0, cancelled: 0 },
    totalSpent: 0,
    wishlistCount: 0,
    reviewsCount: 0,
    avgRating: 0,
    addressesCount: 0,
    successfulPayments: 0,
    recentOrders: []
  };

  // برای نمایش در قالب
  myOrdersCount = 0;
  myOrdersChange = 0;
  myPaymentsAmount = 0;
  myPaymentsChange = 0;
  wishlistCount = 0;
  myReviewsCount = 0;
  myRecentOrders: any[] = [];
  suggestedProducts: any[] = [];

  constructor(
    private accountService: AccountService,
    private dashboardService: DashboardService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.getUserName();
    this.loadDashboardData();
  }

  checkUserRole(): void {
    this.isAdmin = this.accountService.isAdmin()
  }

  getUserName(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userName = user.name || user.firstName || 'کاربر';
      } catch {
        this.userName = 'کاربر';
      }
    }
  }

  loadDashboardData(): void {
    this.loading = true;

    if (this.isAdmin) {
      this.loadAdminStats();
    } else {
      this.loadUserStats();
    }
  }

  loadAdminStats(): void {
    this.dashboardService.getAdminStats().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.adminStats = response.data;
          this.updateAdminDisplayData();
        } else {
          this.notification.error(response.message || 'خطا در دریافت آمار');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading admin stats:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  loadUserStats(): void {
    this.dashboardService.getUserStats().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.userStats = response.data;
          this.updateUserDisplayData();
        } else {
          this.notification.error(response.message || 'خطا در دریافت آمار');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  updateAdminDisplayData(): void {
    // داده‌ها برای نمایش در قالب آماده می‌شوند
    // ولی فعلاً از داده‌های واقعی استفاده می‌شود
  }

  updateUserDisplayData(): void {
    this.myOrdersCount = this.userStats.orders?.total || 0;
    this.myPaymentsAmount = this.userStats.totalSpent || 0;
    this.wishlistCount = this.userStats.wishlistCount || 0;
    this.myReviewsCount = this.userStats.reviewsCount || 0;

    // محاسبه تغییرات (برای سادگی، فعلاً 0)
    this.myOrdersChange = 0;
    this.myPaymentsChange = 0;

    // آخرین سفارشات
    this.myRecentOrders = this.userStats.recentOrders?.map((order: any) => ({
      orderNumber: order.orderNumber,
      date: this.formatDate(order.date),
      amount: order.amount,
      status: order.status,
      itemsCount: order.itemsCount
    })) || [];
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  getSalesGrowthClass(): string {
    return this.adminStats.sales?.growth >= 0 ? 'positive' : 'negative';
  }

  getSalesGrowthSign(): string {
    const growth = this.adminStats.sales?.growth || 0;
    return growth >= 0 ? '+' : '';
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
