import { signal, inject, OnInit, OnDestroy, Directive } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';

@Directive()
export abstract class ListBase<T = any> implements OnInit, OnDestroy {
  protected notification = inject(NotificationService);

  // State signals
  items = signal<T[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  pageSize = signal(10);

  // Config
  protected dataKey: string = 'items';

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {}

  protected abstract loadData(): void;

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadData();
  }

  trackById(index: number, item: any): string {
    return item._id || item.id || index.toString();
  }

  protected handleResponse(response: any, customKey?: string): void {
    const key = customKey || this.dataKey;

    if (response.success && response.data) {
      this.items.set(response.data[key] || response.data);
      this.totalItems.set(response.data.total || response.data.length || 0);
      this.totalPages.set(response.data.pages || response.data.totalPages || 1);
    } else {
      this.notification.error(response.message || 'Failed to load data');
    }

    this.loading.set(false);
  }

  protected handleError(error: any): void {
    console.error('API Error:', error);
    this.notification.error(error.error?.message || 'Server connection error');
    this.loading.set(false);
  }

  refresh(): void {
    this.currentPage.set(1);
    this.loadData();
  }
}
