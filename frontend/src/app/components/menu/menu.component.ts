import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { CartService } from '../../core/cart.service';

@Component({
  selector: 'app-menu-browse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-6 border-b-2 border-indigo-600 pb-2">
          Browse Menu
        </h1>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <input
            type="text"
            class="p-2 border rounded"
            placeholder="Search by name or description..."
            [(ngModel)]="searchText"
            (ngModelChange)="updateFilters()"
          />
          <select class="p-2 border rounded" [(ngModel)]="selectedCategory" (ngModelChange)="updateFilters()">
            <option value="">All categories</option>
            <option *ngFor="let c of categories()" [value]="c">{{ c }}</option>
          </select>
          <select class="p-2 border rounded" [(ngModel)]="sortBy" (ngModelChange)="updateFilters()">
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="category">Sort: Category</option>
          </select>
        </div>

        <div *ngIf="isLoading()" class="py-10 text-center">
          <div class="text-indigo-600 font-semibold">Loading menu items...</div>
        </div>
        <div *ngIf="error()" class="p-4 bg-red-100 text-red-700 rounded">Error: {{ error() }}</div>
        <div *ngIf="!isLoading() && !error() && filtered().length === 0"
             class="p-4 bg-yellow-50 text-yellow-800 rounded">
          No items found.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="filtered().length > 0">
          <div *ngFor="let item of filtered()" class="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-4">
            <img [src]="imageUrl(item.imagePath)"
                 alt="{{ item.name }}"
                 class="w-full h-48 object-cover rounded-lg mb-3"
                 (error)="onImgError($event)" />
            <div class="flex-1">
              <h3 class="text-xl font-bold text-gray-800">{{ item.name }}</h3>
              <p class="text-sm text-indigo-600 font-semibold">{{ item.category }}</p>
              <p class="text-sm text-gray-600 mt-2 line-clamp-2">{{ item.description }}</p>
              <div class="mt-3 flex items-center justify-between">
                <span class="text-2xl font-bold text-green-600">₹{{ item.price | number:'1.0-0' }}</span>
                <button 
                  (click)="addToCart(item)"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div *ngIf="cartItemCount() > 0" class="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-lg shadow-2xl">
          <div class="text-sm font-semibold mb-2">Cart: {{ cartItemCount() }} items</div>
          <button 
            (click)="goToCart()"
            class="bg-white text-indigo-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition w-full">
            View Cart
          </button>
        </div>
      </div>
    </div>
  `,
})
export class MenuComponent implements OnInit {
  constructor(
    private api: ApiService,
    private cartService: CartService,
    private router: Router
  ) {}

  // state
  items = signal<any[]>([]);
  filteredItems = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // UI controls
  searchText = '';
  selectedCategory = '';
  sortBy: 'name' | 'price' | 'category' = 'name';

  // Cart count
  cartItemCount = computed(() => this.cartService.getCartItemCount());

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.error.set(null);
    this.api.getMenu().subscribe({
      next: (data) => {
        this.items.set(data ?? []);
        this.updateFilters();
        this.isLoading.set(false);
      },
      error: (e) => {
        this.error.set('Could not load menu.');
        this.isLoading.set(false);
        console.error(e);
      },
    });
  }

  updateFilters() {
    let list = [...(this.items() ?? [])];

    // Search filter
    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      list = list.filter(i =>
        (i.name || '').toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (this.selectedCategory) {
      list = list.filter(i => i.category === this.selectedCategory);
    }

    // Sort
    switch (this.sortBy) {
      case 'price':
        list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'category':
        list.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
        break;
      default:
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    this.filteredItems.set(list);
  }

  categories = computed(() => {
    const set = new Set((this.items() ?? []).map(i => i.category).filter(Boolean));
    return Array.from(set).sort();
  });

  filtered = computed(() => this.filteredItems());

  addToCart(item: any) {
    this.cartService.addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      description: item.description || ''
    });
    // Show success notification (optional)
    alert(`${item.name} added to cart!`);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  imageUrl(path?: string) {
    if (path) {
      // If it's a full URL, use it directly
      if (path.startsWith('http')) return path;
      // Otherwise, use backend URL
      return `http://localhost:3001/${path}`;
    }
    return 'https://placehold.co/400x300/4F46E5/FFFFFF?text=No+Image';
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src =
      'https://placehold.co/400x300/4F46E5/FFFFFF?text=No+Image';
  }
}