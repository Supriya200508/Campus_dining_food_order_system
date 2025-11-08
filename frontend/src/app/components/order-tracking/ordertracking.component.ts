import { Component, signal, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, NgIf, NgFor, CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl">
      <h1 class="text-4xl font-extrabold text-indigo-700 mb-8 border-b pb-4">Track Your Order</h1>

      <!-- Tracking Form -->
      <form [formGroup]="trackingForm" (ngSubmit)="trackOrder()" class="flex space-x-4 mb-8">
        <input formControlName="orderId" 
               type="text" 
               placeholder="Enter Your Order ID" 
               class="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
               maxlength="20">
        <button type="submit" 
                [disabled]="trackingForm.invalid || isLoading()"
                class="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50 flex items-center">
          <lucide-icon name="search" class="w-5 h-5 mr-2"></lucide-icon>
          Track
        </button>
      </form>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="text-center py-10">
        <lucide-icon name="loader-circle" class="w-10 h-10 text-indigo-500 animate-spin mx-auto"></lucide-icon>
        <p class="text-gray-500 mt-3">Fetching order status...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error()" class="p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
        <p class="font-semibold">Tracking Failed:</p>
        <p>{{ error() }}</p>
      </div>

      <!-- Order Details Display -->
      <div *ngIf="order()" class="mt-8">
        <div class="p-6 bg-gray-50 rounded-lg shadow-inner">
          <div class="flex justify-between items-center border-b pb-3 mb-3">
            <h2 class="text-2xl font-bold text-gray-800">Order #<span class="text-indigo-600">{{ order()!.id }}</span></h2>
            <p [class]="getStatusClass(order()!.status)" class="px-4 py-1 text-lg font-bold rounded-full shadow-md">
              {{ order()!.status }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <p><strong>Customer:</strong> {{ order()!.customer.name }}</p>
            <p><strong>Phone:</strong> {{ order()!.customer.phone }}</p>
            <p><strong>Total:</strong> <span class="font-bold text-green-600">{{ order()!.total | currency }}</span></p>
            <p><strong>Placed On:</strong> {{ order()!.placedAt | date:'medium' }}</p>
          </div>

          <h3 class="text-xl font-semibold text-gray-700 mb-3">Items Ordered</h3>
          <ul class="space-y-2 mb-6">
            <li *ngFor="let item of order()!.items" class="flex justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span class="font-medium text-gray-800">{{ item.name }}</span>
              <span class="text-sm text-gray-500">{{ item.quantity }} x {{ item.price | currency }}</span>
            </li>
          </ul>

          <!-- Visual Timeline -->
          <h3 class="text-xl font-semibold text-gray-700 mb-3 border-t pt-4">Timeline</h3>
          <div class="flex justify-between items-center relative py-4">
            <div *ngFor="let status of orderStatuses; let i = index" 
                 class="flex-1 text-center relative z-10"
                 [ngClass]="{'text-indigo-600': isActiveStatus(status), 'text-gray-400': !isActiveStatus(status)}">
              
              <div class="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-500"
                   [ngClass]="isActiveStatus(status) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-500'">
                   <lucide-icon [name]="getIconForStatus(status)" class="w-4 h-4"></lucide-icon>
              </div>
              <p class="text-xs font-medium mt-1">{{ status }}</p>
            </div>
            
            <!-- Progress Line -->
            <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 mx-10 z-0 transform -translate-y-1/2">
                <div [style.width]="progressWidth()" class="h-full bg-indigo-500 transition-all duration-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OrderTrackingComponent implements OnInit {
  trackingForm: FormGroup;
  order = signal<any | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Define the main statuses for the visual timeline
  orderStatuses: string[] = ['Pending', 'Preparing', 'Ready', 'Completed'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
    this.trackingForm = this.fb.group({
      orderId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if order ID is provided in query params
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.trackingForm.patchValue({ orderId: params['orderId'] });
        this.trackOrder();
      }
    });
  }

  async trackOrder(): Promise<void> {
    if (this.trackingForm.invalid) {
      this.error.set('Please enter a valid Order ID.');
      return;
    }

    this.isLoading.set(true);
    this.order.set(null);
    this.error.set(null);
    
    const orderId = this.trackingForm.value.orderId;

    try {
      const result = await this.apiService.getOrderById(orderId);
      if (result) {
        this.order.set(result);
      } else {
        this.error.set(`Order with ID "${orderId}" not found.`);
      }
    } catch (err: any) {
      console.error('Error tracking order:', err);
      this.error.set(err.message || 'An unexpected error occurred while searching for the order.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Checks if a status is the current status or a preceding one */
  isActiveStatus(status: string): boolean {
    if (!this.order()) return false;
    const currentStatusIndex = this.orderStatuses.indexOf(this.order()!.status);
    const checkStatusIndex = this.orderStatuses.indexOf(status);
    
    // Also include the current status itself
    return checkStatusIndex !== -1 && checkStatusIndex <= currentStatusIndex;
  }

  /** Calculates the width of the progress bar based on current status */
  progressWidth(): string {
    if (!this.order()) return '0%';
    const currentStatusIndex = this.orderStatuses.indexOf(this.order()!.status);
    if (currentStatusIndex < 0) return '0%'; // Handle 'Cancelled' or unmapped status
    
    const segmentWidth = 100 / (this.orderStatuses.length - 1);
    
    // The width is the sum of all preceding segments
    return `${currentStatusIndex * segmentWidth}%`;
  }
  
  /** Gets the appropriate Lucide icon name for the status */
  getIconForStatus(status: string): string {
    switch (status) {
      case 'Pending': return 'clock';
      case 'Processing': return 'utensils';
      case 'Ready': return 'truck';
      case 'Delivered': return 'check-circle';
      default: return 'help-circle';
    }
  }

  /** Gets the Tailwind class for the main status badge */
  getStatusClass(status: string): string {
    const base = 'px-4 py-1 text-sm font-semibold rounded-full ';
    switch (status) {
      case 'Pending': return base + 'bg-yellow-100 text-yellow-800';
      case 'Processing': return base + 'bg-blue-100 text-blue-800';
      case 'Ready': return base + 'bg-green-100 text-green-800';
      case 'Delivered': return base + 'bg-indigo-100 text-indigo-800';
      case 'Cancelled': return base + 'bg-red-100 text-red-800';
      default: return base + 'bg-gray-200 text-gray-800';
    }
  }
}