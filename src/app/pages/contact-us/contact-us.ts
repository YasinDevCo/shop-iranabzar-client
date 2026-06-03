import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { NotificationService } from '../../services/notification.service';
import {MessageRequestDto} from '../../dtos/contact-us/contact-us.dto';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.css']
})
export class ContactUs {
  model: MessageRequestDto = {
    title: '',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    description: ''
  };

  submitted = false;
  loading = false;

  constructor(
    private messageService: MessageService,
    private notification: NotificationService
  ) {}

  getErrorMessage(field: string): string {
    switch(field) {
      case 'firstName':
        return !this.model.firstName ? 'نام خود را وارد کنید' : '';
      case 'lastName':
        return !this.model.lastName ? 'نام خانوادگی خود را وارد کنید' : '';
      case 'email':
        if (!this.model.email) return 'ایمیل خود را وارد کنید';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.model.email)) return 'ایمیل معتبر وارد کنید';
        return '';
      case 'mobile':
        if (!this.model.mobile) return 'شماره موبایل خود را وارد کنید';
        if (!/^09[0-9]{9}$/.test(this.model.mobile)) return 'شماره موبایل باید با 09 شروع و 11 رقم باشد';
        return '';
      case 'title':
        return !this.model.title ? 'موضوع پیام را وارد کنید' : '';
      case 'description':
        return !this.model.description ? 'متن پیام را وارد کنید' : '';
      default:
        return '';
    }
  }

  isFormValid(): boolean {
    return !!(
      this.model.firstName &&
      this.model.lastName &&
      this.model.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.model.email) &&
      this.model.mobile &&
      /^09[0-9]{9}$/.test(this.model.mobile) &&
      this.model.title &&
      this.model.description
    );
  }

  handleContactUs(): void {
    this.submitted = true;

    if (!this.isFormValid()) {
      this.notification.error('لطفاً تمام فیلدها را به درستی پر کنید');
      return;
    }

    this.loading = true;

    this.messageService.createMessage(this.model).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success(response.message || 'پیام شما با موفقیت ارسال شد');
          // reset form
          this.model = {
            title: '',
            firstName: '',
            lastName: '',
            mobile: '',
            email: '',
            description: ''
          };
          this.submitted = false;
        } else {
          this.notification.error(response.message || 'خطا در ارسال پیام');
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error sending message:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }
}
