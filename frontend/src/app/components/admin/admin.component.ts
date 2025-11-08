import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600">Admin panel under development...</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminComponent {
  constructor() { }
}
