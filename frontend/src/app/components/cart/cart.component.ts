import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/cart.service';

@Component({
  standalone: true,
  selector: 'app-cart',
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div *ngIf="cartItems.length === 0" class="text-center py-12">
        <p class="text-xl text-gray-600">Your cart is empty</p>
        <a routerLink="/menu" class="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Browse Menu
        </a>
      </div>
      
      <div *ngIf="cartItems.length > 0">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b">
            <div class="font-semibold">Item</div>
            <div class="font-semibold text-center">Price</div>
            <div class="font-semibold text-center">Quantity</div>
            <div class="font-semibold text-right">Total</div>
          </div>
          
          <div *ngFor="let item of cartItems" class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-b items-center">
            <div>
              <h3 class="font-medium">{{ item.name }}</h3>
            </div>
            <div class="text-center">₹{{ item.price | number:'1.2-2' }}</div>
            <div class="flex items-center justify-center">
              <button (click)="decreaseQuantity(item)" class="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">-</button>
              <span class="mx-2">{{ item.quantity }}</span>
              <button (click)="increaseQuantity(item)" class="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">+</button>
            </div>
            <div class="text-right">₹{{ (item.price * item.quantity) | number:'1.2-2' }}</div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between items-center">
          <div class="text-xl font-bold">Total: ₹{{ totalAmount | number:'1.2-2' }}</div>
          <button 
            routerLink="/checkout" 
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
            [disabled]="cartItems.length === 0">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `],
  imports: [CommonModule, RouterModule, DecimalPipe]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
  }

  increaseQuantity(item: any): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1);
    this.loadCartItems();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.id, item.quantity - 1);
      this.loadCartItems();
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item.id);
    this.loadCartItems();
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}