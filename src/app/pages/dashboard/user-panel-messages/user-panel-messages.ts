// ==================== Imports ====================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { NotificationService } from '../../../services/notification.service';
import { ApiResponseDto } from '../../../dtos/common/api-response.dto';
import { MessageDto, MessagesPaginatedResponse } from '../../../dtos/contact-us/contact-us.dto';

@Component({
  selector: 'app-user-panel-messages',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-panel-messages.html',
  styleUrls: ['./user-panel-messages.css']
})
export class UserPanelMessages implements OnInit, OnDestroy {
  // ==================== Data Properties ====================
  messages: MessageDto[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalItems = 0;
  searchQuery = '';
  selectedStatus = '';
  unreadCount = 0;

  // ==================== UI State ====================
  showViewModal = false;
  showReplyModal = false;
  selectedMessage: MessageDto | null = null;
  replyText = '';
  sendingReply = false;
  isMobileView: boolean = false;

  // ==================== Constructor ====================
  constructor(
    private messageService: MessageService,
    private notification: NotificationService
  ) {}

  // ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.handleResize.bind(this));
    this.loadMessages();
    this.loadStats();
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
  loadMessages(): void {
    this.loading = true;

    this.messageService.getMessages(this.currentPage, this.pageSize, this.selectedStatus).subscribe({
      next: (response: ApiResponseDto<MessagesPaginatedResponse>) => {
        if (response.success && response.data) {
          this.messages = response.data.contacts;
          this.totalItems = response.data.pagination.total;
          this.totalPages = response.data.pagination.pages;
        } else {
          this.notification.error(response.message || 'خطا در دریافت پیام‌ها');
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading messages:', error);
        this.notification.error('خطا در ارتباط با سرور');
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.messageService.getMessageStats().subscribe({
      next: (response: ApiResponseDto<any>) => {
        if (response.success && response.data) {
          this.unreadCount = response.data.stats.pending;
        }
      },
      error: (error: any) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  // ==================== Search & Filters ====================
  onSearch(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadMessages();
  }

  // ==================== Pagination ====================
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadMessages();
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

  // ==================== Modal Controls ====================
  openViewModal(message: MessageDto): void {
    this.selectedMessage = message;
    this.showViewModal = true;
    document.body.style.overflow = 'hidden';

    // Update status to read if pending
    if (message.status === 'pending') {
      this.messageService.updateMessageStatus(message._id, { status: 'read' }).subscribe({
        next: () => {
          if (this.selectedMessage) {
            this.selectedMessage.status = 'read';
          }
          this.loadStats();
          this.loadMessages();
        },
        error: (error: any) => console.error('Error updating status:', error)
      });
    }
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedMessage = null;
    document.body.style.overflow = '';
  }

  openReplyModal(message: MessageDto): void {
    this.selectedMessage = message;
    this.replyText = '';
    this.showReplyModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeReplyModal(): void {
    this.showReplyModal = false;
    this.selectedMessage = null;
    this.replyText = '';
    this.sendingReply = false;
    document.body.style.overflow = '';
  }

  // ==================== Reply & Actions ====================
  sendReply(): void {
    if (!this.replyText.trim() || !this.selectedMessage) {
      this.notification.error('لطفاً متن پاسخ را وارد کنید');
      return;
    }

    this.sendingReply = true;

    const mailtoLink = `mailto:${this.selectedMessage.email}?subject=پاسخ به پیام: ${this.selectedMessage.title}&body=${encodeURIComponent(
      `سلام ${this.selectedMessage.firstName} ${this.selectedMessage.lastName}\n\n${this.replyText}\n\nبا احترام\nپشتیبانی فروشگاه`
    )}`;

    window.location.href = mailtoLink;

    this.messageService.updateMessageStatus(this.selectedMessage._id, { status: 'replied' }).subscribe({
      next: () => {
        if (this.selectedMessage) {
          this.selectedMessage.status = 'replied';
        }
        this.notification.success('پاسخ با موفقیت ارسال شد');
        this.loadStats();
        this.loadMessages();
        this.closeReplyModal();
      },
      error: (error: any) => {
        console.error('Error updating status:', error);
        this.notification.error('خطا در به‌روزرسانی وضعیت');
      },
      complete: () => {
        this.sendingReply = false;
      }
    });
  }

  deleteMessage(id: string, name: string): void {
    if (confirm(`آیا از حذف پیام "${name}" مطمئن هستید؟`)) {
      this.loading = true;
      this.messageService.deleteMessage(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notification.success(response.message || 'پیام با موفقیت حذف شد');
            this.loadMessages();
            this.loadStats();
          } else {
            this.notification.error(response.message || 'خطا در حذف پیام');
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error deleting message:', error);
          this.notification.error('خطا در ارتباط با سرور');
          this.loading = false;
        }
      });
    }
  }

  // ==================== Helper Methods ====================
  getFullName(message: MessageDto): string {
    return `${message.firstName} ${message.lastName}`;
  }

  getStatusLabel(status: string): string {
    switch(status) {
      case 'pending': return 'خوانده نشده';
      case 'read': return 'خوانده شده';
      case 'replied': return 'پاسخ داده شده';
      default: return 'نامشخص';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'read': return 'status-read';
      case 'replied': return 'status-replied';
      default: return '';
    }
  }

  getShortDescription(description: string, length: number = 60): string {
    if (!description) return '';
    return description.length > length ? description.substring(0, length) + '...' : description;
  }

  // ==================== Track By ====================
  trackByMessageId(index: number, message: MessageDto): string {
    return message._id;
  }
}
