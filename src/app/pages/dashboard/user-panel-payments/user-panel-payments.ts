// ==================== Imports ====================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { NotificationService } from '../../../services/notification.service';
import { ApiResponseDto } from '../../../dtos/common/api-response.dto';
import { PaymentDto, PaymentsPaginatedResponse } from '../../../dtos/payment/payment.dto';

@Component({
  selector: 'app-user-panel-payments',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-panel-payments.html',
  styleUrls: ['./user-panel-payments.css']
})
export class UserPanelPayments implements OnInit, OnDestroy {
  // ==================== Data Properties ====================
  payments: PaymentDto[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalItems = 0;
  totalAmount = 0;
  searchQuery = '';
  selectedStatus = '';

  // ==================== UI State ====================
  showDetailModal = false;
  selectedPayment: PaymentDto | null = null;
  isMobileView: boolean = false;

  // ==================== Constructor ====================
  constructor(
    private paymentService: PaymentService,
    private notification: NotificationService
  ) {}

  // ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.handleResize.bind(this));
    this.loadPayments();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  // ==================== Screen Size Handler ====================
  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  handleResize(): void {
    this.checkScreenSize();
  }

  // ==================== Data Loading ====================
  loadPayments(): void {
    this.loading = true;

    this.paymentService.getAllPayments(this.currentPage, this.pageSize, this.selectedStatus, this.searchQuery).subscribe({
      next: (response: ApiResponseDto<PaymentsPaginatedResponse>) => {
        if (response.success && response.data) {
          this.payments = response.data.payments;
          this.totalItems = response.data.total;
          this.totalPages = response.data.pages;

          // Calculate total amount of paid payments
          this.totalAmount = this.payments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
        } else {
          this.notification.error(response.message || 'خطا در دریافت پرداخت‌ها');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  // ==================== Search & Filters ====================
  onSearch(): void {
    this.currentPage = 1;
    this.loadPayments();
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadPayments();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadPayments();
  }

  // ==================== Pagination ====================
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPayments();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // ==================== Modal Controls ====================
  openDetailModal(payment: PaymentDto): void {
    this.selectedPayment = payment;
    this.showDetailModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPayment = null;
    document.body.style.overflow = '';
  }

  // ==================== Helper Methods ====================
  getUserName(payment: PaymentDto): string {
    if (!payment) return 'نامشخص';
    if (payment.userId) return payment.userId.name;
    if (payment.user) return payment.user.name;
    return 'نامشخص';
  }

  getUserEmail(payment: PaymentDto): string {
    if (!payment) return '-';
    if (payment.user) return payment.user.email;
    if (payment.userId) return payment.userId.email;
    return '-';
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'paid': return 'پرداخت شده';
      case 'pending': return 'در انتظار';
      case 'failed': return 'ناموفق';
      case 'refunded': return 'عودت داده شده';
      default: return 'نامشخص';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      default: return '';
    }
  }

  downloadInvoice(payment: PaymentDto): void {
    if (!payment) return;

    const invoiceHtml = `
      <html dir="rtl">
      <head>
        <style>
          body { font-family: Tahoma, sans-serif; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #ff5722; }
          .info { margin: 20px 0; }
          .info table { width: 100%; border-collapse: collapse; }
          .info td { padding: 8px; border-bottom: 1px solid #ddd; }
          .total { font-size: 18px; font-weight: bold; color: #28a745; margin-top: 20px; text-align: left; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">فاکتور پرداخت</div>
          <div>فروشگاه ایران ابزار</div>
        </div>
        <div class="info">
          <table>
            <tr><td><strong>شماره تراکنش:</strong></td><td>${payment.transactionCode}</td></tr>
            <tr><td><strong>مبلغ:</strong></td><td>${payment.amount.toLocaleString()} تومان</td></tr>
            <tr><td><strong>تاریخ:</strong></td><td>${payment.paidAt || payment.createdAt}</td></tr>
            <tr><td><strong>وضعیت:</strong></td><td>${this.getStatusLabel(payment.status)}</td></tr>
            <tr><td><strong>توضیحات:</strong></td><td>${payment.description || '-'}</td></tr>
          </table>
        </div>
        <div class="total">💰 مبلغ پرداختی: ${payment.amount.toLocaleString()} تومان</div>
        <div class="footer">این فاکتور به صورت الکترونیکی صادر شده و نیازی به امضا ندارد</div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${payment.transactionCode}.html`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.notification.success('فاکتور با موفقیت دانلود شد');
  }

  // ==================== Track By ====================
  trackByPaymentId(index: number, payment: PaymentDto): string {
    return payment._id;
  }
}
