import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="flex justify-center items-center py-12">
        <div class="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
            <h2 class="text-4xl font-extrabold text-indigo-800 mb-6 border-b-4 border-indigo-200 pb-2 text-center">
                Student Registration
            </h2>
            <p class="text-center text-gray-600 mb-8">
                Create your student account to save your details and track orders.
            </p>
            
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-6">
                
                <!-- Full Name Input -->
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" formControlName="name" id="name" required
                        class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Jane Doe"
                    >
                    <div *ngIf="registerForm.get('name')?.invalid && (registerForm.get('name')?.dirty || registerForm.get('name')?.touched)" class="text-red-500 text-xs mt-1">
                      Full Name is required.
                    </div>
                </div>
                
                <!-- Student ID / Username Input -->
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">Student ID (Username)</label>
                    <input type="text" formControlName="username" id="username" required
                        class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., S123456"
                    >
                    <div *ngIf="registerForm.get('username')?.invalid && (registerForm.get('username')?.dirty || registerForm.get('username')?.touched)" class="text-red-500 text-xs mt-1">
                      Student ID is required.
                    </div>
                </div>

                <!-- Password Input -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" formControlName="password" id="password" required
                        class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="••••••••"
                    >
                    <div *ngIf="registerForm.get('password')?.invalid && (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)" class="text-red-500 text-xs mt-1">
                      Password is required (min 6 characters).
                    </div>
                </div>

                <!-- Error Message -->
                <p *ngIf="registerError" class="text-red-500 text-center font-medium py-2 bg-red-50 rounded-lg border border-red-200">{{ registerError }}</p>
                <p *ngIf="registerSuccess" class="text-green-500 text-center font-medium py-2 bg-green-50 rounded-lg border border-green-200">{{ registerSuccess }}</p>


                <!-- Register Button -->
                <button type="submit" [disabled]="registerForm.invalid || isRegistering"
                    class="w-full py-3 px-4 rounded-lg shadow-xl text-lg font-bold text-white 
                           bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span *ngIf="!isRegistering">Register</span>
                    <span *ngIf="isRegistering" class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                    </span>
                </button>
                
            </form>
            
            <p class="text-center text-sm text-gray-500 mt-6">
                Already have an account? 
                <a routerLink="/login" class="text-indigo-600 hover:text-indigo-800 font-semibold">Login Here</a>
            </p>
        </div>
    </div>
  `,
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isRegistering: boolean = false;
  registerError: string | null = null;
  registerSuccess: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit(): void {
    // If user is already logged in, redirect them away
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
  
  // --- Registration Logic ---
  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.isRegistering = true;
    this.registerError = null;
    this.registerSuccess = null;

    this.apiService.register(this.registerForm.value).subscribe({
      next: (response) => {
        // Successful registration response should contain a token
        this.isRegistering = false;
        this.registerSuccess = 'Registration successful! Logging you in...';
        
        // Use the token received to immediately log the user in via the service
        this.authService.login({
            email: this.registerForm.value.username,
            password: this.registerForm.value.password
        }).then(() => {
            this.router.navigate(['/menu']); // Redirect to menu after successful login
        }).catch(() => {
            // Should not happen if API is correct, but handles fallback
            this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.isRegistering = false;
        console.error('Registration Error:', err);
        
        if (err.error?.message.includes('duplicate key error')) {
            this.registerError = 'Registration failed: That Student ID is already taken.';
        } else {
            this.registerError = err.error?.message || 'Registration failed. Please check your details.';
        }
      }
    });
  }
}
