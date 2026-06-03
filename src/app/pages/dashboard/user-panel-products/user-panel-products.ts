import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductDto, ProductRequestDto, ProductsPaginatedResponse } from '../../../dtos/product/product.dto';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { NotificationService } from '../../../services/notification.service';
import { ApiResponseDto } from '../../../dtos/common/api-response.dto';
import { CategoryDto } from '../../../dtos/categories/category.dto';
import { Pagination } from '../../../components/pagination/pagination';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'app-user-panel-products',
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './user-panel-products.html',
  styleUrls: ['./user-panel-products.css']
})
export class UserPanelProducts implements OnInit, OnDestroy {
  // ==================== Data Properties ====================
  products: ProductDto[] = [];
  categories: CategoryDto[] = [];
  loading = false;
  submitted = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalItems = 0;
  searchQuery = '';

  // ==================== UI State ====================
  showAddModal = false;
  showEditModal = false;
  selectedProduct: ProductDto | null = null;
  isMobileView: boolean = false;

  // ==================== Form Models ====================
  productRequestModel: ProductRequestDto = {
    title: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    images: []
  };

  imageUrl: string = '';
  totalProducts: number = 0;

  // ==================== Upload Properties ====================
  uploadingImage = false;
  selectedFile: File | null = null;

  // ==================== Constructor ====================
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private notification: NotificationService,
    private uploadService: UploadService
  ) {}

  // ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.handleResize.bind(this));
    this.loadCategories();
    this.loadProducts();
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
  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: ApiResponseDto<CategoryDto[]>) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response: ApiResponseDto<ProductsPaginatedResponse>) => {
        if (response.success && response.data) {
          this.products = response.data.products;
          this.totalPages = response.data.pages;
          this.totalItems = response.data.total;
          this.totalProducts = response.data.total;
        } else {
          this.notification.error(response.message || 'خطا در دریافت محصولات');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  // ==================== Search & Pagination ====================
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.currentPage = 1;
    this.loadProducts();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  // ==================== Modal Controls ====================
  openAddModal(): void {
    this.productRequestModel = {
      title: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      images: []
    };
    this.imageUrl = '';
    this.showAddModal = true;
    document.body.style.overflow = 'hidden';
  }

  openEditModal(product: ProductDto): void {
    this.selectedProduct = product;
    this.productRequestModel = {
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: typeof product.category === 'string' ? product.category : product.category._id,
      images: product.images || []
    };
    this.imageUrl = '';
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedProduct = null;
    this.submitted = false;
    this.imageUrl = '';
    document.body.style.overflow = '';
  }

  // ==================== Image Management ====================
  addImage(): void {
    if (this.imageUrl && this.imageUrl.trim()) {
      if (!this.productRequestModel.images) {
        this.productRequestModel.images = [];
      }
      this.productRequestModel.images.push(this.imageUrl.trim());
      this.imageUrl = '';
    }
  }

  removeImage(index: number): void {
    if (this.productRequestModel.images) {
      this.productRequestModel.images.splice(index, 1);
    }
  }

  // ==================== File Upload Methods ====================
  triggerFileInput(): void {
    if (this.uploadingImage) return;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
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
        // ✅ این بخش رو تغییر بده - هر دو حالت رو چک کن
        const imageUrl = response?.data?.url || response?.url;

        if (response.success && imageUrl) {
          if (!this.productRequestModel.images) {
            this.productRequestModel.images = [];
          }
          this.productRequestModel.images.push(imageUrl);
          this.notification.success('تصویر با موفقیت آپلود شد');
          console.log('📸 تصویر به آرایه اضافه شد:', imageUrl);
          console.log('📸 آرایه تصاویر:', this.productRequestModel.images);
        } else {
          this.notification.error('خطا در دریافت آدرس تصویر');
          console.error('❌ پاسخ نامعتبر:', response);
        }
        this.uploadingImage = false;
        this.selectedFile = null;

        // Clear file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
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
  // ==================== CRUD Operations ====================
  createProduct(): void {
    // Validation
    if (!this.productRequestModel.title?.trim()) {
      this.notification.error('لطفاً نام محصول را وارد کنید');
      return;
    }
    if (!this.productRequestModel.category) {
      this.notification.error('لطفاً دسته‌بندی محصول را انتخاب کنید');
      return;
    }
    if (!this.productRequestModel.price || this.productRequestModel.price <= 0) {
      this.notification.error('لطفاً قیمت معتبر وارد کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.productService.create(this.productRequestModel).subscribe({
      next: (response: ApiResponseDto<ProductDto>) => {
        if (response.success) {
          this.notification.success(response.message || 'محصول با موفقیت ایجاد شد');
          this.closeModals();
          this.loadProducts();
        } else {
          this.notification.error(response.message || 'خطا در ایجاد محصول');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  updateProduct(): void {
    if (!this.selectedProduct) return;

    if (!this.productRequestModel.title?.trim()) {
      this.notification.error('لطفاً نام محصول را وارد کنید');
      return;
    }

    this.submitted = true;
    this.loading = true;

    this.productService.update(this.selectedProduct._id, this.productRequestModel).subscribe({
      next: (response: ApiResponseDto<ProductDto>) => {
        if (response.success) {
          this.notification.success(response.message || 'محصول با موفقیت ویرایش شد');
          this.closeModals();
          this.loadProducts();
        } else {
          this.notification.error(response.message || 'خطا در ویرایش محصول');
        }
        this.loading = false;
        this.submitted = false;
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.notification.error(error.error?.message || 'خطا در ارتباط با سرور');
        this.loading = false;
        this.submitted = false;
      }
    });
  }

  deleteProduct(id: string, title: string): void {
    if (confirm(`آیا از حذف محصول "${title}" مطمئن هستید؟`)) {
      this.loading = true;
      this.productService.delete(id).subscribe({
        next: (response: ApiResponseDto<null>) => {
          if (response.success) {
            this.notification.success(response.message || 'محصول با موفقیت حذف شد');
            this.loadProducts();
          } else {
            this.notification.error(response.message || 'خطا در حذف محصول');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.notification.error('خطا در ارتباط با سرور');
          this.loading = false;
        }
      });
    }
  }

  // ==================== Helper Methods ====================
  getCategoryName(category: any): string {
    if (!category) return 'دسته‌بندی نشده';
    if (typeof category === 'string') {
      const found = this.categories.find(c => c._id === category);
      return found?.name || 'دسته‌بندی نشده';
    }
    return category?.name || 'دسته‌بندی نشده';
  }

  getStockStatusClass(stock: number): string {
    if (stock === 0) return 'out-stock';
    if (stock < 5) return 'low-stock';
    return 'in-stock';
  }

  getStockStatusText(stock: number): string {
    if (stock === 0) return 'ناموجود';
    if (stock < 5) return `فقط ${stock} عدد`;
    return 'موجود';
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

  trackByProductId(index: number, product: ProductDto): string {
    return product._id;
  }
}
