import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

export abstract class AuthBase {
  submitted = false;
  loading = false;

  constructor(
    protected router: Router,
    protected notification: NotificationService
  ) {}

  // Navigate to another page
  protected goTo(path: string): void {
    this.router.navigate([path]);
  }

  // Validate email format
  protected isValidEmail(email: string): boolean {
    return !!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  // Validate mobile number (Iranian)
  protected isValidMobile(mobile: string): boolean {
    return !!mobile?.match(/^09[0-9]{9}$/);
  }

  // Handle API errors
  protected handleError(err: any, defaultMsg: string = 'خطایی رخ داد، دوباره تلاش کنید'): void {
    const errorMessage = err.error?.message || defaultMsg;

    switch (err.status) {
      case 400:
        if (errorMessage.includes('Email already registered')) {
          this.notification.error('این ایمیل قبلاً ثبت نام کرده است', '📧 ایمیل تکراری');
        } else {
          this.notification.error(errorMessage, '❌ خطا');
        }
        break;
      case 0:
        this.notification.error('اتصال به اینترنت را بررسی کنید', '🌐 شبکه');
        break;
      case 401:
      case 403:
        this.notification.error('شما دسترسی ندارید', '🔒 خطای احراز هویت');
        break;
      default:
        this.notification.error(errorMessage);
    }
  }

  // Start loading
  protected startLoading(): void {
    this.loading = true;
    this.submitted = true;
  }

  // Stop loading
  protected stopLoading(): void {
    this.loading = false;
  }
}
