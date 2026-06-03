// src/app/components/checkout/checkout.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import { AddressService } from '../../services/address.service';
import { NotificationCartService } from '../../services/notification-cart.service';
import { CreateOrderDto } from '../../dtos/order/order.dto';
import {Address, CreateAddressRequest} from '../../dtos/address/address.dto';

// Cart item interface
interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

// Shipping method interface
interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  time: string;
}


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
  // Inject services
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private addressService = inject(AddressService);
  private notification = inject(NotificationCartService);
  private router = inject(Router);

  // Cart data
  cartItems: CartItem[] = [];
  subtotal: number = 0;

  // Cost calculations
  shippingCost: number = 50000;
  private readonly TAX_RATE: number = 0.09;
  tax: number = 0;
  total: number = 0;

  // Shipping methods
  shippingMethods: ShippingMethod[] = [
    { id: 'post', name: 'Post', cost: 50000, time: '3-5 business days' },
    { id: 'tipax', name: 'Tipax', cost: 70000, time: '2-3 business days' },
    { id: 'pickup', name: 'Pickup', cost: 40000, time: '24 hours' }
  ];
  selectedShippingMethod: ShippingMethod = this.shippingMethods[0];

  // Address management
  addresses: Address[] = [];
  selectedAddressId: string = '';
  showAddressForm: boolean = false;

  // New address form
  newAddress: Address = {
    fullName: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    phone: '',
    isDefault: false,
    id:''
  };

  // UI state
  loading: boolean = false;
  submitting: boolean = false;

  // User info
  userName: string = '';

  ngOnInit(): void {
    this.loadCart();
    this.loadAddresses();
    this.loadUserInfo();
  }

  // ============ Cart Methods ============

  private loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotals();
  }

  private calculateTotals(): void {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.tax = this.subtotal * this.TAX_RATE;
    this.total = this.subtotal + this.shippingCost + this.tax;
  }

  onShippingMethodChange(): void {
    this.shippingCost = this.selectedShippingMethod.cost;
    this.calculateTotals();
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  // ============ Address Methods ============

  private loadAddresses(): void {
    this.loading = true;
    this.addressService.getMyAddresses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.addresses = response.data;
          this.selectDefaultAddress();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.loading = false;
      }
    });
  }

  private selectDefaultAddress(): void {
    const defaultAddress = this.addresses.find(a => a.isDefault);
    if (defaultAddress) {
      this.selectedAddressId = defaultAddress.id;
    }
  }

  private loadUserInfo(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userName = user.name || user.firstName || '';
        this.newAddress.fullName = `${user.name || ''} ${user.lastName || ''}`.trim();
        this.newAddress.phone = user.mobile || '';
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    }
  }

  getSelectedAddress(): Address | undefined {
    return this.addresses.find(a => a.id === this.selectedAddressId);
  }

  createNewAddress(): void {
    if (!this.isNewAddressValid()) {
      this.notification.error('Please fill all address fields');
      return;
    }

    this.loading = true;

    const addressData: CreateAddressRequest = {
      fullName: this.newAddress.fullName,
      phone: this.newAddress.phone,
      province: this.newAddress.province,
      city: this.newAddress.city,
      address: this.newAddress.address,
      postalCode: this.newAddress.postalCode
    };

    this.addressService.createAddress(addressData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.notification.success('Address added successfully');
          this.loadAddresses();
          this.showAddressForm = false;
          this.resetAddressForm();
        } else {
          this.notification.error(response.message || 'Failed to add address');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating address:', error);
        this.notification.error('Server error');
        this.loading = false;
      }
    });
  }

  private isNewAddressValid(): boolean {
    return !!(
      this.newAddress.fullName &&
      this.newAddress.province &&
      this.newAddress.city &&
      this.newAddress.address &&
      this.newAddress.postalCode &&
      this.newAddress.phone
    );
  }

  private resetAddressForm(): void {
    this.newAddress = {
      id:'',
      fullName: '',
      province: '',
      city: '',
      address: '',
      postalCode: '',
      phone: '',
      isDefault: false
    };
    this.loadUserInfo();
  }

  // ============ Order Methods ============

  submitOrder(): void {
    const selectedAddress = this.getSelectedAddress();

    if (!selectedAddress && !this.showAddressForm) {
      this.notification.error('Please select an address');
      return;
    }

    if (this.cartItems.length === 0) {
      this.notification.error('Your cart is empty');
      return;
    }

    this.submitting = true;

    const shippingAddress = selectedAddress || this.newAddress;

    const orderData: CreateOrderDto = {
      items: this.cartItems.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      subtotal: this.subtotal,
      shippingCost: this.shippingCost,
      tax: this.tax,
      discount: 0,
      total: this.total,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        province: shippingAddress.province,
        city: shippingAddress.city,
        address: shippingAddress.address,
        postalCode: shippingAddress.postalCode,
        phone: shippingAddress.phone
      }
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.createPayment(response.data);
        } else {
          this.notification.error(response.message || 'Order failed');
          this.submitting = false;
        }
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.notification.error(error.error?.message || 'Order failed');
        this.submitting = false;
      }
    });
  }

  private createPayment(order: any): void {
    this.paymentService.createPayment({ orderId: order._id }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.cartService.clearCart();
          this.notification.success('Order placed successfully');
          this.router.navigate(['/payment/verify', response.data.payment._id]);
        } else {
          this.notification.error(response.message || 'Payment creation failed');
          this.submitting = false;
        }
      },
      error: (error) => {
        console.error('Error creating payment:', error);
        this.notification.error(error.error?.message || 'Payment creation failed');
        this.submitting = false;
      }
    });
  }
}
