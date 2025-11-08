import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) { }

  /**
   * Helper function to include the Authorization header with the JWT token
   * for protected routes.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // ===================================
  //           AUTHENTICATION
  // ===================================

  /**
   * Handles user login request.
   * @param credentials - Object containing username and password.
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  /**
   * Handles user registration request.
   * @param userData - Object containing name, username (Student ID), and password.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // ===================================
  //            ORDER MANAGEMENT
  // ===================================

  /**
   * Gets order details by order ID
   * @param orderId - The ID of the order to retrieve (e.g., ORD-1730185234567)
   */
  getOrderById(orderId: string): Promise<any> {
    return this.http.get(`${this.apiUrl}/order/track/${orderId}`).toPromise();
  }

  // ===================================
  //            MENU ITEM MANAGEMENT
  // ===================================

  /**
   * Admin function to upload a new menu item, including the image file.
   * This MUST send FormData, which Angular handles automatically.
   * @param formData - The FormData object containing text fields and the 'imageFile' blob.
   */
  uploadMenuItem(formData: FormData): Observable<any> {
    // Note: We DO NOT set the 'Content-Type' header here; Angular sets it correctly
    // to 'multipart/form-data' when sending a FormData object.
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/order/menu`, formData, { headers });
  }

  /**
   * Public function to get all available menu items.
   */
  getMenu(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/menu`);
  }

  // ===================================
  //            ORDERING
  // ===================================

  /**
   * Public function to place a new order.
   * @param orderData - Details about the customer and the items in the cart.
   */
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, orderData);
  }

  /**
   * Public function to track the status of a specific order.
   * @param orderId - The ID of the order to track.
   */
  trackOrder(orderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/track/${orderId}`);
  }

  // ===================================
  //           ADMIN DASHBOARD
  // ===================================

  /**
   * Admin function to get all current pending orders. (Protected)
   */
  getAdminOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/order/admin`, { headers });
  }

  /**
   * Admin function to update the status of a specific order. (Protected)
   * @param orderId - The ID of the order.
   * @param newStatus - The new status string (e.g., 'Preparing', 'Ready').
   */
  updateOrderStatus(orderId: string, newStatus: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/order/${orderId}/status`, { status: newStatus }, { headers });
  }

  /**
  * Admin function to get ALL menu items (including those marked unavailable). (Protected)
  */
  getAdminMenuItems(): Observable<any> {
    const headers = this.getAuthHeaders();
  // Note: This calls the new admin-specific GET route
    return this.http.get(`${this.apiUrl}/order/menu/admin`, { headers });
  }

/**
 * Admin function to edit an existing menu item. (Protected)
 * @param id - The ID of the item to update.
 * @param formData - FormData object with updated text fields and optional new image file.
 */
  editMenuItem(id: string, formData: FormData): Observable<any> {
     const headers = this.getAuthHeaders();
     return this.http.put(`${this.apiUrl}/order/menu/${id}`, formData, { headers });
  }

/**
 * Admin function to delete a menu item. (Protected)
 * @param id - The ID of the item to delete.
 */
  deleteMenuItem(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/order/menu/${id}`, { headers });
  }
}
