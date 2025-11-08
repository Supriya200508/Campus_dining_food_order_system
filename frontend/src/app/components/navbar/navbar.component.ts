import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <a routerLink="/" class="text-xl font-bold text-blue-600">CampusEats</a>
          </div>
          
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a routerLink="/" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Home</a>
              <a routerLink="/menu" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Menu</a>
              <a routerLink="/cart" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Cart</a>
              <a routerLink="/track" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Track Order</a>
            </div>
          </div>
          
          <div class="flex items-center">
            <a routerLink="/login" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Login</a>
            <a routerLink="/register" class="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Register</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `],
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}