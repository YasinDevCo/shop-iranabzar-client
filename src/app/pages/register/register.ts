import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { NotificationService } from '../../services/notification.service';
import { AuthBase } from '../../components/shared/auth-base';
import {InputFieldComponent} from '../../components/shared/input-field/input-field';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, InputFieldComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register extends AuthBase {
  model = {
    email: '',
    name: '',
    lastName: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    router: Router,
    private accountService: AccountService,
    notification: NotificationService
  ) {
    super(router, notification);
  }

  goToLogin(): void {
    this.goTo('/login');
  }

  handleRegister(): void {
    this.startLoading();

    // Validate all fields
    if (!this.isFormValid()) {
      this.stopLoading();
      return;
    }

    this.accountService.register(this.model).subscribe({
      next: (res) => {
        this.stopLoading();
        if (res.success) {
          this.notification.success('ثبت‌نام با موفقیت انجام شد', '🎉 تبریک!');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        }
      },
      error: (err) => {
        this.stopLoading();
        this.handleError(err);
      }
    });
  }

  private isFormValid(): boolean {
    // Check name
    if (!this.model.name) {
      this.notification.error('نام الزامی است');
      return false;
    }

    // Check last name
    if (!this.model.lastName) {
      this.notification.error('نام خانوادگی الزامی است');
      return false;
    }

    // Check mobile
    if (!this.isValidMobile(this.model.mobile)) {
      this.notification.error('شماره موبایل معتبر وارد کنید');
      return false;
    }

    // Check email
    if (!this.isValidEmail(this.model.email)) {
      this.notification.error('ایمیل معتبر وارد کنید');
      return false;
    }

    // Check password length
    if (this.model.password.length < 6) {
      this.notification.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return false;
    }

    // Check password match
    if (this.model.password !== this.model.confirmPassword) {
      this.notification.error('رمز عبور و تکرار آن مطابقت ندارند');
      return false;
    }

    return true;
  }
}
