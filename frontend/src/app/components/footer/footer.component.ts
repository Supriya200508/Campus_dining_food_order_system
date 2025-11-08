import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">CampusEats</h3>
            <p class="text-gray-300">Delicious meals delivered to your campus doorstep.</p>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-gray-300 hover:text-white">Home</a></li>
              <li><a routerLink="/menu" class="text-gray-300 hover:text-white">Menu</a></li>
              <li><a routerLink="/cart" class="text-gray-300 hover:text-white">Cart</a></li>
              <li><a routerLink="/track" class="text-gray-300 hover:text-white">Track Order</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Contact Us</h4>
            <address class="not-italic text-gray-300">
              <p>Campus Dining Services</p>
              <p>University Campus</p>
              <p>Email: info@campuseats.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 CampusEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `],
  imports: [CommonModule, RouterModule]
})
export class FooterComponent {
  constructor() { }
}