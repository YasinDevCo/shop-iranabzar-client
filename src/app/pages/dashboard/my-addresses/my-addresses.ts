import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../../services/address.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-my-addresses',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-addresses.html',
  styleUrls: ['./my-addresses.css']
})
export class MyAddresses implements OnInit {
  addresses: any[] = [];
  loading = false;
  showAddModal = false;
  showEditModal = false;
  selectedAddress: any = null;
  submitted = false;

  addressModel: any = {
    fullName: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    phone: '',
    isDefault: false
  };

  constructor(
    private addressService: AddressService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.loading = true;
    this.addressService.getMyAddresses().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.addresses = response.data;
        } else {
          this.notification.error(response.message || 'خطا در دریافت آدرس‌ها');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.addressModel = {
      fullName: '',
      province: '',
      city: '',
      address: '',
      postalCode: '',
      phone: '',
      isDefault: false
    };
    this.showAddModal = true;
  }

  openEditModal(address: any): void {
    this.selectedAddress = address;
    this.addressModel = {
      fullName: address.fullName,
      province: address.province,
      city: address.city,
      address: address.address,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault
    };
    this.showEditModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedAddress = null;
    this.submitted = false;
  }

  createAddress(): void {
    if (!this.isFormValid()) {
      this.notification.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.addressService.createAddress(this.addressModel).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notification.success(response.message || 'آدرس با موفقیت افزوده شد');
          this.closeModals();
          this.loadAddresses();
        } else {
          this.notification.error(response.message || 'خطا در افزودن آدرس');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error creating address:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  updateAddress(): void {
    if (!this.isFormValid() || !this.selectedAddress) {
      this.notification.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.addressService.updateAddress(this.selectedAddress._id, this.addressModel).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notification.success(response.message || 'آدرس با موفقیت ویرایش شد');
          this.closeModals();
          this.loadAddresses();
        } else {
          this.notification.error(response.message || 'خطا در ویرایش آدرس');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error updating address:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  deleteAddress(id: string): void {
    if (confirm('آیا از حذف این آدرس مطمئن هستید؟')) {
      this.loading = true;
      this.addressService.deleteAddress(id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notification.success(response.message || 'آدرس با موفقیت حذف شد');
            this.loadAddresses();
          } else {
            this.notification.error(response.message || 'خطا در حذف آدرس');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting address:', error);
          this.notification.error('خطا در ارتباط با سرور');
          this.loading = false;
        }
      });
    }
  }

  setDefaultAddress(id: string): void {
    this.loading = true;
    this.addressService.setDefaultAddress(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notification.success(response.message || 'آدرس پیش‌فرض با موفقیت تنظیم شد');
          this.loadAddresses();
        } else {
          this.notification.error(response.message || 'خطا در تنظیم آدرس پیش‌فرض');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error setting default address:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  private isFormValid(): boolean {
    return !!(
      this.addressModel.fullName &&
      this.addressModel.province &&
      this.addressModel.city &&
      this.addressModel.address &&
      this.addressModel.postalCode &&
      this.addressModel.phone
    );
  }

  trackById(index: number, item: any): string {
    return item._id;
  }
}
