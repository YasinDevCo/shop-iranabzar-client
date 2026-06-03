import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { NotificationCartService } from '../../services/notification-cart.service';

@Component({
  selector: 'app-payment-verify',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-verify.html',
  styleUrls: ['./payment-verify.css']
})
export class PaymentVerify implements OnInit {
  loading = true;
  success = false;
  error = false;
  message = '';
  paymentData: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private notification: NotificationCartService
  ) {}

  ngOnInit(): void {
    const paymentId = this.route.snapshot.params['id'];
    this.verifyPayment(paymentId);
  }

  verifyPayment(paymentId: string): void {
    this.loading = true;
    this.paymentService.verifyPayment(paymentId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.success = true;
          this.paymentData = response.data;
          this.message = response.message || 'پرداخت شما با موفقیت انجام شد';
          this.notification.success('پرداخت با موفقیت انجام شد');
        } else {
          this.error = true;
          this.message = response.message || 'پرداخت ناموفق بود';
          this.notification.error(this.message);
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Payment verification error:', error);
        this.error = true;
        this.message = error.error?.message || 'خطا در ارتباط با سرور';
        this.notification.error(this.message);
        this.loading = false;
      }
    });
  }

  goToOrders(): void {
    this.router.navigate(['/dashboard/my-orders']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
