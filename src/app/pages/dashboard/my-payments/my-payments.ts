import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { NotificationService } from '../../../services/notification.service';
import {Pagination} from '../../../components/pagination/pagination';

@Component({
  selector: 'app-my-payments',
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './my-payments.html',
  styleUrls: ['./my-payments.css']
})
export class MyPayments implements OnInit {
  payments: any[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalPayments = 0;
  selectedStatus = '';

  constructor(
    private paymentService: PaymentService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getMyPayments(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.payments = response.data.payments;
          this.totalPayments = response.data.total;
          this.totalPages = response.data.pages;
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

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPayments();
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

  downloadInvoice(payment: any): void {
    const invoiceHtml = this.generateInvoiceHtml(payment);
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${payment.transactionCode}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.notification.success('فاکتور با موفقیت دانلود شد');
  }

  private generateInvoiceHtml(payment: any): string {
    return `
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
            <tr><td><strong>تاریخ:</strong></td><td>${new Date(payment.createdAt).toLocaleDateString('fa-IR')}</td></tr>
            <tr><td><strong>وضعیت:</strong></td><td>${this.getStatusLabel(payment.status)}</td></tr>
            <tr><td><strong>توضیحات:</strong></td><td>${payment.description || '-'}</td></tr>
          </table>
        </div>
        <div class="total">💰 مبلغ پرداختی: ${payment.amount.toLocaleString()} تومان</div>
        <div class="footer">این فاکتور به صورت الکترونیکی صادر شده و نیازی به امضا ندارد</div>
      </body>
      </html>
    `;
  }

  trackById(index: number, item: any): string {
    return item._id;
  }
}
