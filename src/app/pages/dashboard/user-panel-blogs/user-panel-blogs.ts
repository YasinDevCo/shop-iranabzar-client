import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../services/blog.service';
import { NotificationService } from '../../../services/notification.service';
import { BlogDto, BlogRequestDto, BlogsPaginatedResponse } from '../../../dtos/blog/blog.dto';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-user-panel-blogs',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-panel-blogs.html',
  styleUrls: ['./user-panel-blogs.css']
})
export class UserPanelBlogs implements OnInit, OnDestroy {
  // ==================== Data Properties ====================
  blogs: BlogDto[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalBlogs = 0;
  searchQuery = '';
  selectedStatus = '';
  uploadingImage = false;
  selectedFile: File | null = null;
  // ==================== UI State ====================
  showAddModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedBlog: BlogDto | null = null;
  isMobileView: boolean = false;

  // ==================== Form Models ====================
  blogRequestModel: any = {
    title: '',
    slug: '',
    content: '',
    summary: '',
    image: '',
    author: '',
    tags: '',
    status: 'draft'
  };

  imageUrl = '';
  submitted = false;

  constructor(
    private blogService: BlogService,
    private notification: NotificationService,
    private uploadService: UploadService
  ) {}

  // ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.handleResize.bind(this));
    this.loadBlogs();
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
  loadBlogs(): void {
    this.loading = true;
    this.blogService.getAllAdmin(this.currentPage, this.pageSize, this.selectedStatus, this.searchQuery).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.blogs = response.data.blogs;
          this.totalBlogs = response.data.total;
          this.totalPages = response.data.pages;
        } else {
          this.notification.error(response.message || 'خطا در دریافت بلاگ‌ها');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  // ==================== Search & Filters ====================
  onSearch(): void {
    this.currentPage = 1;
    this.loadBlogs();
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadBlogs();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadBlogs();
  }

  // ==================== Pagination ====================
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadBlogs();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
// ==================== File Upload Methods ====================
  triggerFileInput(): void {
    if (this.uploadingImage) return;
    const fileInput = document.getElementById('file-input-blog') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadSelectedImage();
    }
  }

  uploadSelectedImage(): void {
    if (!this.selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.notification.error('فرمت فایل پشتیبانی نمی‌شود. لطفاً از تصاویر JPG, PNG, WEBP استفاده کنید');
      this.selectedFile = null;
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (this.selectedFile.size > maxSize) {
      this.notification.error('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      this.selectedFile = null;
      return;
    }

    this.uploadingImage = true;

    this.uploadService.uploadImage(this.selectedFile).subscribe({
      next: (response: any) => {
        const imageUrl = response?.data?.url || response?.url;

        if (response.success && imageUrl) {
          this.blogRequestModel.image = imageUrl;
          this.imageUrl = imageUrl;
          this.notification.success('تصویر با موفقیت آپلود شد');
          console.log('📸 تصویر بلاگ آپلود شد:', imageUrl);
        } else {
          this.notification.error('خطا در دریافت آدرس تصویر');
          console.error('❌ پاسخ نامعتبر:', response);
        }
        this.uploadingImage = false;
        this.selectedFile = null;

        // Clear file input
        const fileInput = document.getElementById('file-input-blog') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
        this.uploadingImage = false;
        this.selectedFile = null;
      }
    });
  }
  // ==================== Modal Controls ====================
  openAddModal(): void {
    this.blogRequestModel = {
      title: '',
      slug: '',
      content: '',
      summary: '',
      image: '',
      author: '',
      tags: '',
      status: 'draft'
    };
    this.imageUrl = '';
    this.showAddModal = true;
    document.body.style.overflow = 'hidden';
  }

  openEditModal(blog: BlogDto): void {
    this.selectedBlog = blog;
    this.blogRequestModel = {
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      summary: blog.summary,
      image: blog.image,
      author: blog.author,
      tags: blog.tags ? blog.tags.join(', ') : '',
      status: blog.status
    };
    this.imageUrl = '';
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
  }

  openViewModal(blog: BlogDto): void {
    this.selectedBlog = blog;
    this.showViewModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedBlog = null;
    this.submitted = false;
    document.body.style.overflow = '';
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedBlog = null;
    this.submitted = false;
    document.body.style.overflow = '';
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedBlog = null;
    document.body.style.overflow = '';
  }

  // ==================== Image Management ====================
  addImage(): void {
    if (this.imageUrl && this.imageUrl.trim()) {
      this.blogRequestModel.image = this.imageUrl.trim();
      this.imageUrl = '';
      this.notification.success('تصویر اضافه شد');
    }
  }

  // ==================== CRUD Operations ====================
  createBlog(): void {
    if (!this.blogRequestModel.title?.trim()) {
      this.notification.error('لطفاً عنوان بلاگ را وارد کنید');
      return;
    }
    if (!this.blogRequestModel.summary?.trim()) {
      this.notification.error('لطفاً خلاصه مطلب را وارد کنید');
      return;
    }
    if (!this.blogRequestModel.content?.trim()) {
      this.notification.error('لطفاً متن بلاگ را وارد کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    if (!this.blogRequestModel.slug) {
      this.blogRequestModel.slug = this.blogRequestModel.title
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s]/g, '')
        .replace(/\s+/g, '-');
    }

    this.blogService.create(this.blogRequestModel).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notification.success(response.message || 'بلاگ با موفقیت ایجاد شد');
          this.closeAddModal();
          this.loadBlogs();
        } else {
          this.notification.error(response.message || 'خطا در ایجاد بلاگ');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error creating blog:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  updateBlog(): void {
    if (!this.selectedBlog) return;

    if (!this.blogRequestModel.title?.trim()) {
      this.notification.error('لطفاً عنوان بلاگ را وارد کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    if (!this.blogRequestModel.slug) {
      this.blogRequestModel.slug = this.blogRequestModel.title
        .trim()
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s]/g, '')
        .replace(/\s+/g, '-');
    }

    this.blogService.update(this.selectedBlog._id, this.blogRequestModel).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notification.success(response.message || 'بلاگ با موفقیت ویرایش شد');
          this.closeEditModal();
          this.loadBlogs();
        } else {
          this.notification.error(response.message || 'خطا در ویرایش بلاگ');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error updating blog:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  deleteBlog(id: string, title: string): void {
    if (confirm(`آیا از حذف بلاگ "${title}" مطمئن هستید؟`)) {
      this.loading = true;
      this.blogService.delete(id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notification.success(response.message || 'بلاگ با موفقیت حذف شد');
            this.loadBlogs();
          } else {
            this.notification.error(response.message || 'خطا در حذف بلاگ');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
          this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
          this.loading = false;
        }
      });
    }
  }

  // ==================== Helper Methods ====================
  getStatusLabel(status: string): string {
    switch(status) {
      case 'published': return 'منتشر شده';
      case 'draft': return 'پیش‌نویس';
      default: return 'نامشخص';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'published': return 'status-published';
      case 'draft': return 'status-draft';
      default: return '';
    }
  }

  trackById(index: number, item: BlogDto): string {
    return item._id;
  }
}
