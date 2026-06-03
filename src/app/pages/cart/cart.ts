import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NotificationService} from '../../services/notification.service';
import {RouterLink} from '@angular/router';
import {CartItem} from '../../dtos/cart/cart.dto';
import {CartService} from '../../services/cart.service';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  shippingCost = 50000;
  tax = 0.09;

  constructor(
    private cartService: CartService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item.productId, quantity);
      this.loadCart();
    }
  }

  removeItem(item: CartItem): void {
    if (confirm(`آیا از حذف "${item.title}" از سبد خرید مطمئن هستید؟`)) {
      this.cartService.removeItem(item.productId);
      this.loadCart();
      this.notification.success(`${item.title} از سبد خرید حذف شد`);
    }
  }

  clearCart(): void {
    if (confirm('آیا از پاک کردن کل سبد خرید مطمئن هستید؟')) {
      this.cartService.clearCart();
      this.loadCart();
      this.notification.success('سبد خرید خالی شد');
    }
  }

  getSubtotal(): number {
    return this.totalPrice;
  }

  getTaxAmount(): number {
    return this.totalPrice * this.tax;
  }

  getTotal(): number {
    return this.totalPrice + this.shippingCost + this.getTaxAmount();
  }
}
