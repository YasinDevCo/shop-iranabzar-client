import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { NotificationService } from '../../../services/notification.service';
import { ProfileDto, ProfileRequestDto } from '../../../dtos/profile/profile.dto';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-user-panel-profile',
  imports: [FormsModule, NgIf],
  templateUrl: './user-panel-profile.html',
  styleUrls: ['./user-panel-profile.css'],
})
export class UserPanelProfile implements OnInit {
  profileModel: ProfileDto = {
    id: '',
    name: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    role: '',
    createdAt: '',
    updatedAt: '',
  };

  profileRequestModel: ProfileRequestDto = {
    name: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
  };

  private currentUserId: string | null = null;
  loading = false;

  constructor(
    private notification: NotificationService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    const userString = localStorage.getItem('user');
    if (!userString) {
      this.notification.error('اطلاعات کاربر یافت نشد. لطفاً دوباره وارد شوید.');
      return;
    }

    try {
      const userObject = JSON.parse(userString);
      this.currentUserId = userObject.id;
      if (!this.currentUserId) {
        this.notification.error('شناسه کاربری در اطلاعات ذخیره شده یافت نشد.');
        return;
      }
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      this.notification.error('خطا در بارگذاری اطلاعات کاربر.');
      return;
    }

    this.loading = true;
    this.profileService.getUserById(this.currentUserId).subscribe({
      next: (response: any) => {
        if (response.success && response.data && response.data.user) {
          this.profileModel = response.data.user;
          this.profileRequestModel = {
            name: this.profileModel.name,
            lastName: this.profileModel.lastName,
            mobile: this.profileModel.mobile,
            email: this.profileModel.email,
            password: '',
          };
        } else {
          this.notification.error(response.message || 'خطا در دریافت اطلاعات پروفایل.');
        }
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.notification.error('خطا در ارتباط با سرور.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  updateProfile(): void {
    if (!this.currentUserId) {
      this.notification.error('خطا: شناسه کاربر در دسترس نیست.');
      return;
    }

    this.loading = true;

    const modelToSend: ProfileRequestDto = {
      name: this.profileRequestModel.name,
      lastName: this.profileRequestModel.lastName,
      mobile: this.profileRequestModel.mobile,
      email: this.profileRequestModel.email,
      password: this.profileRequestModel.password || undefined,
    };

    if (!modelToSend.password) {
      delete modelToSend.password;
    }

    this.profileService.updateProfile(this.currentUserId, modelToSend).subscribe({
      next: (response: any) => {
        if (response.success && response.data && response.data.user) {
          this.profileModel = response.data.user;
          this.profileRequestModel.password = '';
          localStorage.setItem("user", JSON.stringify(response.data.user));
          this.notification.success(response.message || 'پروفایل شما با موفقیت به‌روز شد.');
        } else {
          this.notification.error(response.message || 'خطا در به‌روزرسانی پروفایل.');
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
