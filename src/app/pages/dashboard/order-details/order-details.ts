import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NotificationService } from '../../../services/notification.service';
import { OrderDto, OrderItemDto } from '../../../dtos/order/order.dto';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.css']
})
export class OrderDetails implements OnInit {
  order: OrderDto | null = null;
  loading = false;
  orderId = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['id'];
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.order = response.data;
        } else {
          this.notification.error(response.message || 'Failed to load order details');
        }
        this.loading = false;
      },
      error: () => {
        this.notification.error('Server connection error');
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending Payment',
      paid: 'Paid',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || 'Unknown';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  payOrder(): void {
    this.notification.info('Redirecting to payment gateway...');
  }

  cancelOrder(): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.notification.info('Order cancelled');
    }
  }
}
