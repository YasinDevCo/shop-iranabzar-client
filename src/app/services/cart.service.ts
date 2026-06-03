import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, CartItemDto } from '../dtos/cart/cart.dto';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly CART_STORAGE_KEY = 'cart';
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    this.loadCart();
  }

  // ============ Private helpers ============

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next(this.cartItems);
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        this.cartItems = [];
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  private findItemIndex(productId: string): number {
    return this.cartItems.findIndex(item => item.productId === productId);
  }

  // ============ Public methods ============

  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  addItem(product: CartItemDto): void {
    const existingIndex = this.findItemIndex(product._id);

    if (existingIndex !== -1) {
      this.cartItems[existingIndex].quantity++;
    } else {
      this.cartItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.images?.[0] || '',
        stock: product.stock
      });
    }

    this.saveCart();
  }

  removeItem(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find(item => item.productId === productId);

    if (!item) return;

    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  isInCart(productId: string): boolean {
    return this.findItemIndex(productId) !== -1;
  }

  getItemQuantity(productId: string): number {
    const item = this.cartItems.find(item => item.productId === productId);
    return item?.quantity ?? 0;
  }
}
