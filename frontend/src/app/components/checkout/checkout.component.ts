import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CartService } from '../../core/cart.service';
import { ApiService } from '../../core/api.service';

@Component({
  standalone: true,
  selector: 'app-checkout',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Checkout</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Order Summary</h2>
          
          <div *ngIf="cartItems.length === 0" class="text-center py-4">
            <p class="text-gray-600">Your cart is empty</p>
          </div>
          
          <div *ngFor="let item of cartItems" class="flex justify-between py-2 border-b">
            <div>
              <span class="font-medium">{{ item.name }}</span>
              <span class="text-gray-600 ml-2">x {{ item.quantity }}</span>
            </div>
            <div>₹{{ (item.price * item.quantity) | number:'1.2-2' }}</div>
          </div>
          
          <div class="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
            <span>Total:</span>
            <span>₹{{ totalAmount | number:'1.2-2' }}</span>
          </div>
        </div>
        
        <!-- Checkout Form -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">Delivery Information</h2>
          
          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                [ngClass]="{'border-red-500': checkoutForm.get('name')?.invalid && checkoutForm.get('name')?.touched}">
              <div *ngIf="checkoutForm.get('name')?.invalid && checkoutForm.get('name')?.touched" class="text-red-500 text-xs mt-1">
                Name is required
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                [ngClass]="{'border-red-500': checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched}">
              <div *ngIf="checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched" class="text-red-500 text-xs mt-1">
                <span *ngIf="checkoutForm.get('email')?.errors?.['required']">Email is required</span>
                <span *ngIf="checkoutForm.get('email')?.errors?.['email']">Invalid email format</span>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                formControlName="phone"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                [ngClass]="{'border-red-500': checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched}">
              <div *ngIf="checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched" class="text-red-500 text-xs mt-1">
                Valid phone number is required
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
                Delivery Address
              </label>
              <textarea
                id="address"
                formControlName="address"
                rows="3"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                [ngClass]="{'border-red-500': checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched}"></textarea>
              <div *ngIf="checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched" class="text-red-500 text-xs mt-1">
                Address is required
              </div>
            </div>
            
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="payment">
                Payment Method
              </label>
              <select
                id="payment"
                formControlName="paymentMethod"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            
            <div class="flex items-center justify-between">
              <button
                type="button"
                routerLink="/cart"
                class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Back to Cart
              </button>
              <button
                type="submit"
                [disabled]="checkoutForm.invalid || cartItems.length === 0"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                [ngClass]="{'opacity-50 cursor-not-allowed': checkoutForm.invalid || cartItems.length === 0}">
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DecimalPipe]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  totalAmount: number = 0;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      paymentMethod: ['cash', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const orderData = {
        customerName: this.checkoutForm.value.name,
        customerEmail: this.checkoutForm.value.email,
        items: this.cartItems.map(item => ({
          itemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: this.totalAmount
      };

      this.apiService.placeOrder(orderData).subscribe({
        next: (response) => {
          console.log('Order placed successfully:', response);
          // Clear the cart
          this.cartService.clearCart();
          // Show success message with order ID
          alert(`Order placed successfully!

Your Order ID: ${response.orderId}

Please save this ID to track your order.`);
          // Navigate to order tracking with the order ID
          this.router.navigate(['/track'], { queryParams: { orderId: response.orderId } });
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error placing order:', error);
          alert('Failed to place order. Please try again.');
          this.isSubmitting = false;
        }
      });
    }
  }
}