import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span class="block">Welcome to</span>
                <span class="block text-yellow-300">Campus Food Ordering</span>
              </h1>
              <p class="mt-3 text-base text-indigo-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Delicious meals delivered right to your campus doorstep. Order from your favorite cafeteria, track your order in real-time, and enjoy hassle-free dining!
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a routerLink="/menu" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10 transition">
                    Browse Menu 🍔
                  </a>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <a *ngIf="!isLoggedIn" routerLink="/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10 transition">
                    Get Started
                  </a>
                  <a *ngIf="isLoggedIn" routerLink="/track" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10 transition">
                    Track Order
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div class="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-indigo-500 flex items-center justify-center">
          <svg class="w-64 h-64 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for campus dining
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            We've made ordering food on campus easier than ever before
          </p>
        </div>

        <div class="mt-10">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Feature 1 -->
            <div class="relative">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div class="mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Quick Ordering</h3>
                <p class="mt-2 text-base text-gray-500">
                  Browse menu, add items to cart, and checkout in seconds. No more waiting in long cafeteria lines!
                </p>
              </div>
            </div>

            <!-- Feature 2 -->
            <div class="relative">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Real-time Tracking</h3>
                <p class="mt-2 text-base text-gray-500">
                  Track your order status in real-time from preparation to delivery. Know exactly when your food is ready!
                </p>
              </div>
            </div>

            <!-- Feature 3 -->
            <div class="relative">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Multiple Payment Options</h3>
                <p class="mt-2 text-base text-gray-500">
                  Pay with cash on delivery, credit/debit card, or UPI. Choose what's convenient for you!
                </p>
              </div>
            </div>

            <!-- Feature 4 -->
            <div class="relative">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <div class="mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Smart Filters</h3>
                <p class="mt-2 text-base text-gray-500">
                  Filter menu by category, price, dietary preferences. Find exactly what you're craving!
                </p>
              </div>
            </div>

            <!-- Feature 5 -->
            <div class="relative">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Order History</h3>
                <p class="mt-2 text-base text-gray-500">
                  View your past orders, reorder favorites, and manage your account easily from one place.
                </p>
              </div>
            </div>

            <!-- Feature 6 -->
            <div class="relative">
              <div class="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <div class="mt-5">
                <h3 class="text-lg leading-6 font-medium text-gray-900">24/7 Support</h3>
                <p class="mt-2 text-base text-gray-500">
                  Get help anytime you need it. Our support team is always ready to assist you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-indigo-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
            Trusted by students across campus
          </h2>
          <p class="mt-3 text-xl text-indigo-200 sm:mt-4">
            Join thousands of students who enjoy convenient campus dining
          </p>
        </div>
        <dl class="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
          <div class="flex flex-col">
            <dt class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">Active Users</dt>
            <dd class="order-1 text-5xl font-extrabold text-white">5,000+</dd>
          </div>
          <div class="flex flex-col mt-10 sm:mt-0">
            <dt class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">Orders Delivered</dt>
            <dd class="order-1 text-5xl font-extrabold text-white">50,000+</dd>
          </div>
          <div class="flex flex-col mt-10 sm:mt-0">
            <dt class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">Menu Items</dt>
            <dd class="order-1 text-5xl font-extrabold text-white">200+</dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gray-50">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span class="block">Ready to get started?</span>
          <span class="block text-indigo-600">Order your first meal today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <a routerLink="/register" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">
              Sign Up Now
            </a>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <a routerLink="/menu" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition">
              View Menu
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
}
