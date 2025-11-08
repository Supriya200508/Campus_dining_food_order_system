import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Payment</h1>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600">Payment processing under development...</p>
          <button routerLink="/menu" class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentComponent {
  constructor() { }
}
