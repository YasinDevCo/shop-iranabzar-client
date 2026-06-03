import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// Cart-specific notification messages
const CART_MESSAGES = {
  ADD_SUCCESS: 'Product added to cart successfully',
  ADD_FAILED: 'Failed to add product to cart',
  REMOVE_SUCCESS: 'Product removed from cart',
  REMOVE_FAILED: 'Failed to remove product',
  UPDATE_SUCCESS: 'Quantity updated',
  UPDATE_FAILED: 'Failed to update quantity',
  CLEAR_SUCCESS: 'Cart cleared successfully',
  CLEAR_FAILED: 'Failed to clear cart',
  OUT_OF_STOCK: 'Product is out of stock',
  MAX_QUANTITY_REACHED: 'Maximum quantity reached'
};

@Injectable({ providedIn: 'root' })
export class NotificationCartService {
  constructor(private toastr: ToastrService) {}

  // ============ Generic methods ============

  success(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title);
  }

  // ============ Cart-specific methods ============

  addSuccess(productName?: string): void {
    const message = productName
      ? `${productName} ${CART_MESSAGES.ADD_SUCCESS}`
      : CART_MESSAGES.ADD_SUCCESS;
    this.success(message, '🛒 Cart');
  }

  addFailed(productName?: string): void {
    const message = productName
      ? `${productName} ${CART_MESSAGES.ADD_FAILED}`
      : CART_MESSAGES.ADD_FAILED;
    this.error(message, '🛒 Cart');
  }

  removeSuccess(): void {
    this.success(CART_MESSAGES.REMOVE_SUCCESS, '🛒 Cart');
  }

  updateSuccess(): void {
    this.success(CART_MESSAGES.UPDATE_SUCCESS, '🛒 Cart');
  }

  clearSuccess(): void {
    this.success(CART_MESSAGES.CLEAR_SUCCESS, '🛒 Cart');
  }

  outOfStock(): void {
    this.warning(CART_MESSAGES.OUT_OF_STOCK, '⚠️ Unavailable');
  }

  maxQuantityReached(): void {
    this.warning(CART_MESSAGES.MAX_QUANTITY_REACHED, '⚠️ Limit Reached');
  }
}
