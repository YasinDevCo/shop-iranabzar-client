import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NotificationService } from '../../../services/notification.service';
import {Pagination} from '../../../components/pagination/pagination';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule, FormsModule, RouterLink, Pagination],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrders implements OnInit {
  orders: any[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalOrders = 0;
  selectedStatus = '';

  constructor(
    private orderService: OrderService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getMyOrders(this.currentPage, this.pageSize, this.selectedStatus).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.orders = response.data.orders;
          this.totalOrders = response.data.total;
          this.totalPages = response.data.pages;
        } else {
          this.notification.error(response.message || 'خطا در دریافت سفارشات');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadOrders();
  }

  trackOrder(order: any): void {
    this.notification.info(`شماره پیگیری سفارش: ${order.orderNumber}`);
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'pending': return 'در انتظار پرداخت';
      case 'paid': return 'پرداخت شده';
      case 'processing': return 'در حال پردازش';
      case 'shipped': return 'ارسال شده';
      case 'delivered': return 'تحویل داده شده';
      case 'cancelled': return 'لغو شده';
      default: return 'نامشخص';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'paid': return 'status-paid';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  trackById(index: number, item: any): string {
    return item._id;
  }
}
