import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// User interface for login
export interface User {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  userId: string;
  name: string;
  username: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api';
  private _userId = signal<string | null>(null);
  private _token: string | null = null;
  private _userRole = 'user';
  private _userName: string | null = null;

  public userId = this._userId.asReadonly();

  constructor(private http: HttpClient) {
    // Check if user is already logged in from localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    if (token && userId) {
      this._token = token;
      this._userId.set(userId);
      this._userRole = userRole || 'user';
      this._userName = userName;
    }
  }

  // ✅ True if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ True if user is authenticated
  isAuthenticated(): boolean {
    return this._userId() !== null;
  }

  // ✅ Get user role
  getUserRole(): string {
    return this._userRole;
  }

  // ✅ Get user name
  getUserName(): string | null {
    return this._userName;
  }

  // ✅ Check if admin
  isAdmin(): boolean {
    return this._userRole === 'admin';
  }

  // ✅ Get token
  getToken(): string | null {
    return this._token;
  }

  // ✅ Login with backend API
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
          username: credentials.email,
          password: credentials.password
        })
      );

      // Store token and user data
      this._token = response.token;
      this._userId.set(response.userId);
      this._userRole = response.role;
      this._userName = response.name;

      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userName', response.name);

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // ✅ Register new user
  async register(userData: { name: string; email: string; password: string }): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, {
          name: userData.name,
          username: userData.email,
          password: userData.password
        })
      );

      // Store token and user data
      this._token = response.token;
      this._userId.set(response.userId);
      this._userRole = response.role;
      this._userName = response.name;

      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('userRole', response.role);
      localStorage.setItem('userName', response.name);

      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // ✅ Logout
  async signOut(): Promise<void> {
    this._userId.set(null);
    this._token = null;
    this._userRole = 'user';
    this._userName = null;

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  }
}
