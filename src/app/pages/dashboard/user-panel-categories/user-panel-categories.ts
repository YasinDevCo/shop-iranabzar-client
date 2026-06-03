import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { ApiResponseDto } from '../../../dtos/common/api-response.dto';
import { CategoryDto, CategoryRequestDto } from '../../../dtos/categories/category.dto';

@Component({
  selector: 'app-user-panel-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-panel-categories.html',
  styleUrls: ['./user-panel-categories.css'],
})
export class UserPanelCategories implements OnInit {
  categories: CategoryDto[] = [];
  loading = false;
  submitted = false;
  showAddModal = false;
  showEditModal = false;
  selectedCategory: CategoryDto | null = null;
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  categoryRequestModel: CategoryRequestDto = {
    name: ''
  };
  isMobileView: boolean = false;

  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 768;
  }
  constructor(
    private categoryService: CategoryService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    this.loadCategories();
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }
  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response: ApiResponseDto<CategoryDto[]>) => {
        if (response.success && response.data) {
          // فیلتر بر اساس جستجو
          let filtered = response.data;
          if (this.searchQuery) {
            filtered = filtered.filter((cat: { name: string; slug: string; }) =>
              cat.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              cat.slug.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
          }
          this.categories = filtered;
          this.totalPages = Math.ceil(this.categories.length / this.pageSize);
        } else {
          this.notification.error(response.message || 'خطا در دریافت دسته‌بندی‌ها');
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadCategories();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadCategories();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  getPaginatedCategories(): CategoryDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.categories.slice(start, end);
  }

  trackById(index: number, category: CategoryDto): string {
    return category._id;
  }

  openAddModal(): void {
    this.categoryRequestModel = { name: '' };
    this.showAddModal = true;
  }

  openEditModal(category: CategoryDto): void {
    this.selectedCategory = category;
    this.categoryRequestModel = {
      name: category.name
    };
    this.showEditModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedCategory = null;
    this.submitted = false;
  }

  createCategory(): void {
    if (!this.categoryRequestModel.name?.trim()) {
      this.notification.error('لطفاً نام دسته‌بندی را وارد کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    const slug = this.categoryRequestModel.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');

    const dataToSend = {
      name: this.categoryRequestModel.name,
      slug: slug
    };

    this.categoryService.createCategory(dataToSend).subscribe({
      next: (response: ApiResponseDto<CategoryDto>) => {
        if (response.success) {
          this.notification.success(response.message || 'دسته‌بندی با موفقیت ایجاد شد');
          this.closeModals();
          // حذف hasLoaded و لود مجدد
          this.loadCategories();
        } else {
          this.notification.error(response.message || 'خطا در ایجاد دسته‌بندی');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error: any) => {
        console.error('Error creating category:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  updateCategory(): void {
    if (!this.selectedCategory) return;

    if (!this.categoryRequestModel.name?.trim()) {
      this.notification.error('لطفاً نام دسته‌بندی را وارد کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    const slug = this.categoryRequestModel.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');

    const dataToSend = {
      name: this.categoryRequestModel.name,
      slug: slug
    };

    this.categoryService.updateCategory(this.selectedCategory._id, dataToSend).subscribe({
      next: (response: ApiResponseDto<CategoryDto>) => {
        if (response.success) {
          this.notification.success(response.message || 'دسته‌بندی با موفقیت ویرایش شد');
          this.closeModals();
          this.loadCategories();
        } else {
          this.notification.error(response.message || 'خطا در ویرایش دسته‌بندی');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error: any) => {
        console.error('Error updating category:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  deleteCategory(id: string, name: string): void {
    if (confirm(`آیا از حذف دسته‌بندی "${name}" مطمئن هستید؟`)) {
      this.loading = true;
      this.categoryService.deleteCategory(id).subscribe({
        next: (response: ApiResponseDto<null>) => {
          if (response.success) {
            this.notification.success(response.message || 'دسته‌بندی با موفقیت حذف شد');
            this.loadCategories();
          } else {
            this.notification.error(response.message || 'خطا در حذف دسته‌بندی');
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error deleting category:', error);
          this.notification.error('خطا در ارتباط با سرور');
          this.loading = false;
        }
      });
    }
  }
}
