import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { NotificationService } from '../../services/notification.service';
import { AuthBase } from '../../components/shared/auth-base';
import {InputFieldComponent} from '../../components/shared/input-field/input-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputFieldComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login extends AuthBase {
  model = { email: '', password: '' };

  constructor(
    router: Router,
    private accountService: AccountService,
    notification: NotificationService
  ) {
    super(router, notification);
  }

  goToRegister(): void {
    this.goTo('/register');
  }

  handleLogin(): void {
    this.startLoading();

    if (!this.model.email || !this.model.password) {
      this.stopLoading();
      this.notification.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    if (!this.isValidEmail(this.model.email)) {
      this.stopLoading();
      this.notification.error('ایمیل معتبر وارد کنید');
      return;
    }

    if (this.model.password.length < 6) {
      this.stopLoading();
      this.notification.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    this.accountService.login(this.model).subscribe({
      next: (res) => {
        this.stopLoading();

        if (res?.success && res?.data?.token) {
          localStorage.setItem('jwt_token', res.data.token);
          if (res.data.user) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
          this.notification.success('ورود با موفقیت انجام شد', '🎉 خوش آمدید!');
          setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        } else {
          this.notification.error('پاسخ سرور نامعتبر است');
        }
      },
      error: (err) => {
        this.stopLoading();
        this.handleError(err);
      }
    });
  }
}
