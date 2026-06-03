import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDto, UserRequestDto, UsersPaginatedResponse } from '../../../dtos/user/user.dto';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
import { ApiResponseDto } from '../../../dtos/common/api-response.dto';
import {Pagination} from '../../../components/pagination/pagination';

@Component({
  selector: 'app-user-panel-users',
  imports: [CommonModule, FormsModule,Pagination],
  templateUrl: './user-panel-users.html',
  styleUrls: ['./user-panel-users.css']
})
export class UserPanelUsers implements OnInit, OnDestroy {
  // ==================== Data Properties ====================
  users: UserDto[] = [];
  loading = false;
  submitted = false;
  currentPage = 1;
  totalPages = 0;
  totalUsers = 0;
  pageSize = 10;
  searchQuery = '';
  selectedRole = '';

  // ==================== UI State ====================
  showAddModal = false;
  showEditModal = false;
  selectedUser: UserDto | null = null;
  isMobileView: boolean = false;

  // ==================== Form Models ====================
  userRequestModel: UserRequestDto = {
    name: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(
    private userService: UserService,
    private notification: NotificationService
  ) {}

  // ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.handleResize.bind(this));
    this.loadUsers();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  // ==================== Screen Size Handler ====================
  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  handleResize(): void {
    this.checkScreenSize();
  }

  // ==================== Data Loading ====================
  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers(this.currentPage, this.pageSize, this.searchQuery, this.selectedRole).subscribe({
      next: (response: ApiResponseDto<UsersPaginatedResponse>) => {
        if (response.success && response.data) {
          this.users = response.data.users;
          this.totalPages = response.data.pagination.totalPages;
          this.totalUsers = response.data.pagination.totalUsers;
        } else {
          this.notification.error(response.message || 'خطا در دریافت کاربران');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  // ==================== Search & Filters ====================
  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onRoleChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedRole = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  // ==================== Pagination ====================
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadUsers();
  }

  // getPageNumbers(): number[] {
  //   const pages: number[] = [];
  //   const maxVisible = 5;
  //   let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
  //   let end = Math.min(this.totalPages, start + maxVisible - 1);
  //
  //   if (end - start + 1 < maxVisible) {
  //     start = Math.max(1, end - maxVisible + 1);
  //   }
  //
  //   for (let i = start; i <= end; i++) {
  //     pages.push(i);
  //   }
  //   return pages;
  // }

  // ==================== Modal Controls ====================
  openAddModal(): void {
    this.userRequestModel = {
      name: '',
      lastName: '',
      mobile: '',
      email: '',
      password: '',
      role: 'user'
    };
    this.showAddModal = true;
    document.body.style.overflow = 'hidden';
  }

  openEditModal(user: UserDto): void {
    this.selectedUser = user;
    this.userRequestModel = {
      name: user.name,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
      role: user.role
    };
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedUser = null;
    this.submitted = false;
    document.body.style.overflow = '';
  }

  // ==================== CRUD Operations ====================
  createUser(): void {
    // Validation
    if (!this.userRequestModel.name?.trim()) {
      this.notification.error('لطفاً نام را وارد کنید');
      return;
    }
    if (!this.userRequestModel.lastName?.trim()) {
      this.notification.error('لطفاً نام خانوادگی را وارد کنید');
      return;
    }
    if (!this.userRequestModel.email?.trim()) {
      this.notification.error('لطفاً ایمیل را وارد کنید');
      return;
    }
    if (!this.userRequestModel.password || this.userRequestModel.password.length < 6) {
      this.notification.error('رمز عبور باید حداقل 6 کاراکتر باشد');
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.userService.addUser(this.userRequestModel).subscribe({
      next: (response: ApiResponseDto<{ user: UserDto }>) => {
        if (response.success) {
          this.notification.success(response.message || 'کاربر با موفقیت ایجاد شد');
          this.closeModals();
          this.loadUsers();
        } else {
          this.notification.error(response.message || 'خطا در ایجاد کاربر');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  updateUser(): void {
    if (!this.selectedUser) return;

    if (!this.userRequestModel.name?.trim()) {
      this.notification.error('لطفاً نام را وارد کنید');
      return;
    }
    if (!this.userRequestModel.lastName?.trim()) {
      this.notification.error('لطفاً نام خانوادگی را وارد کنید');
      return;
    }
    if (!this.userRequestModel.email?.trim()) {
      this.notification.error('لطفاً ایمیل را وارد کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.userService.updateUser(this.selectedUser._id, this.userRequestModel).subscribe({
      next: (response: ApiResponseDto<{ user: UserDto; token?: string }>) => {
        if (response.success) {
          this.notification.success(response.message || 'کاربر با موفقیت ویرایش شد');
          this.closeModals();
          this.loadUsers();

          // Update token if it's the current user
          if (response.data?.token) {
            localStorage.setItem('jwt_token', response.data.token);
          }
        } else {
          this.notification.error(response.message || 'خطا در ویرایش کاربر');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  deleteUser(id: string, name: string, lastName: string): void {
    if (confirm(`آیا از حذف کاربر "${name} ${lastName}" مطمئن هستید؟`)) {
      this.loading = true;
      this.userService.deleteUser(id).subscribe({
        next: (response: ApiResponseDto<null>) => {
          if (response.success) {
            this.notification.success(response.message || 'کاربر با موفقیت حذف شد');
            this.loadUsers();
          } else {
            this.notification.error(response.message || 'خطا در حذف کاربر');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
          this.loading = false;
        }
      });
    }
  }

  // ==================== Helper Methods ====================
  getRoleLabel(role: string): string {
    return role === 'admin' ? 'مدیر' : 'کاربر عادی';
  }

  getRoleClass(role: string): string {
    return role === 'admin' ? 'role-admin' : 'role-user';
  }

  getInitials(name: string, lastName: string): string {
    return (name?.charAt(0) || '') + (lastName?.charAt(0) || '');
  }

  trackById(index: number, user: UserDto): string {
    return user._id;
  }
}
