import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationCartService } from '../../services/notification-cart.service';
import { CategoryService } from '../../services/category.service';
import {Pagination} from '../../components/pagination/pagination';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, Pagination],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css']
})
export class ProductsListComponent implements OnInit {
  // Product data
  products: any[] = [];
  categories: any[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  totalProducts = 0;

  // Filters
  searchQuery = '';
  selectedCategories: string[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  inStockOnly = false;
  discountOnly = false;
  sortBy = 'newest';

  // UI state
  isFilterOpen = false;
  openGroups: { [key: string]: boolean } = {
    category: true,
    price: false,
    stock: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private notification: NotificationCartService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.currentPage = 1;
      this.loadProducts();
    });
  }

  // Load categories
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  // Load products with filters
  loadProducts(): void {
    this.loading = true;

    const filters: any = {
      page: this.currentPage,
      limit: this.pageSize,
      sort: this.sortBy
    };

    if (this.searchQuery) filters.search = this.searchQuery;
    if (this.selectedCategories.length > 0) filters.categories = this.selectedCategories.join(',');
    if (this.minPrice) filters.minPrice = this.minPrice;
    if (this.maxPrice) filters.maxPrice = this.maxPrice;
    if (this.inStockOnly) filters.inStock = true;

    this.productService.getFilteredProducts(filters).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.products = response.data.products;
          this.totalProducts = response.data.total;
          this.totalPages = response.data.pages;
        } else {
          this.products = [];
          this.totalProducts = 0;
          this.totalPages = 1;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.loading = false;
        this.products = [];
      }
    });
  }

  // Filter methods
  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
    this.updateUrlParams();
  }

  onCategoryFilterChange(event: any): void {
    const categoryId = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.currentPage = 1;
    this.loadProducts();
  }

  onPriceChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onStockFilterChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  // Filter modal methods
  openFilterModal(): void {
    this.isFilterOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeFilterModal(): void {
    this.isFilterOpen = false;
    document.body.style.overflow = '';
  }

  toggleFilterGroup(group: string): void {
    this.openGroups[group] = !this.openGroups[group];
  }

  // Helper methods
  isSelectedCategory(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  hasActiveFilters(): boolean {
    return this.selectedCategories.length > 0 ||
      this.minPrice !== null ||
      this.maxPrice !== null ||
      this.inStockOnly ||
      this.searchQuery !== '';
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.selectedCategories.length > 0) count++;
    if (this.minPrice || this.maxPrice) count++;
    if (this.inStockOnly) count++;
    return count;
  }

  getActiveFiltersList(): any[] {
    const filters: any[] = [];
    if (this.searchQuery) {
      filters.push({ label: `جستجو: ${this.searchQuery}`, type: 'search', value: null });
    }
    if (this.selectedCategories.length > 0) {
      const categoryNames = this.categories
        .filter(c => this.selectedCategories.includes(c._id))
        .map(c => c.name);
      filters.push({ label: `دسته: ${categoryNames.join(', ')}`, type: 'categories', value: null });
    }
    if (this.minPrice || this.maxPrice) {
      const minText = this.minPrice ? this.minPrice.toLocaleString() : '۰';
      const maxText = this.maxPrice ? this.maxPrice.toLocaleString() : '∞';
      filters.push({ label: `قیمت: ${minText} - ${maxText} تومان`, type: 'price', value: null });
    }
    if (this.inStockOnly) {
      filters.push({ label: `فقط محصولات موجود`, type: 'stock', value: null });
    }
    return filters;
  }

  removeFilter(type: string, value: any): void {
    switch(type) {
      case 'search':
        this.searchQuery = '';
        break;
      case 'categories':
        this.selectedCategories = [];
        break;
      case 'price':
        this.minPrice = null;
        this.maxPrice = null;
        break;
      case 'stock':
        this.inStockOnly = false;
        break;
    }
    this.currentPage = 1;
    this.loadProducts();
    this.updateUrlParams();
  }

  clearAllFilters(): void {
    this.selectedCategories = [];
    this.minPrice = null;
    this.maxPrice = null;
    this.inStockOnly = false;
    this.searchQuery = '';
    this.sortBy = 'newest';
    this.currentPage = 1;
    this.loadProducts();
    this.updateUrlParams();
    this.closeFilterModal();
    this.notification.info('همه فیلترها پاک شد');
  }

  // Pagination methods
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  // Cart methods
  addToCart(product: any): void {
    this.cartService.addItem(product);
    this.notification.success(`${product.title} به سبد خرید اضافه شد`);
  }

  // URL helpers
  updateUrlParams(): void {
    const params: any = {};
    if (this.searchQuery) params.search = this.searchQuery;
    this.router.navigate(['/products'], { queryParams: params });
  }
}
