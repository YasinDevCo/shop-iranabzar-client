import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// Toast configuration options
interface ToastOptions {
  timeOut: number;
  progressBar: boolean;
  closeButton: boolean;
  tapToDismiss: boolean;
  positionClass: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly DEFAULT_OPTIONS: ToastOptions = {
    timeOut: 4000,
    progressBar: true,
    closeButton: true,
    tapToDismiss: false,
    positionClass: 'toast-top-left'
  };

  private readonly ERROR_OPTIONS: ToastOptions = {
    ...this.DEFAULT_OPTIONS,
    timeOut: 5000
  };

  private readonly INFO_OPTIONS: ToastOptions = {
    ...this.DEFAULT_OPTIONS,
    timeOut: 3000
  };

  constructor(private toastr: ToastrService) {}

  // ============ Public notification methods ============

  success(message: string, title: string = '✅ Success'): void {
    this.toastr.success(message, title, this.DEFAULT_OPTIONS);
  }

  error(message: string, title: string = '❌ Error'): void {
    this.toastr.error(message, title, this.ERROR_OPTIONS);
  }

  warning(message: string, title: string = '⚠️ Warning'): void {
    this.toastr.warning(message, title, this.DEFAULT_OPTIONS);
  }

  info(message: string, title: string = 'ℹ️ Info'): void {
    this.toastr.info(message, title, this.INFO_OPTIONS);
  }

  clear(): void {
    this.toastr.clear();
  }

  // ============ Error handling helpers ============

  // Handle 400 Bad Request errors
  handleBadRequest(error: any): string {
    let message = 'Operation failed';

    if (error?.status === 400) {
      message = this.extractValidationMessage(error);
      this.error(message, 'Validation Error');
    } else if (error?.status === 401) {
      message = 'Please login to continue';
      this.error(message, 'Unauthorized');
    } else if (error?.status === 403) {
      message = 'You do not have permission to perform this action';
      this.error(message, 'Access Denied');
    } else if (error?.status === 404) {
      message = 'Resource not found';
      this.error(message, 'Not Found');
    } else if (error?.status === 500) {
      message = 'Internal server error. Please try again later';
      this.error(message, 'Server Error');
    }

    return message;
  }

  // Show generic error for API calls
  showApiError(error: any, customMessage?: string): void {
    const message = customMessage || error?.error?.message || error?.message || 'An unexpected error occurred';
    this.error(message);
  }

  // ============ Private helpers ============

  private extractValidationMessage(error: any): string {
    // Duplicate email error
    if (error.error?.message?.includes('Email already registered')) {
      return 'This email is already registered';
    }

    // Validation errors from backend
    if (error.error?.errors) {
      return Object.values(error.error.errors).join(', ');
    }

    // Simple message from backend
    if (error.error?.message) {
      return error.error.message;
    }

    return 'Please check your input and try again';
  }
}
