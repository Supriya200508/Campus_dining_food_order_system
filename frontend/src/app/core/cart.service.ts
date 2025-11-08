import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define the shape of a menu item for type safety
export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
}

// Define the shape of an item in the cart
export interface CartItem extends MenuItem {
  quantity: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // BehaviorSubject to hold the current state of the cart
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor() {
    // Optional: Load cart from localStorage on initialization (if desired for persistence)
    // this.loadCart(); 
  }

  private calculateCartTotals(items: CartItem[]): { total: number, count: number } {
    let total = 0;
    let count = 0;
    items.forEach(item => {
      total += item.subtotal;
      count += item.quantity;
    });
    return { total, count };
  }

  /**
   * Adds or updates an item in the cart.
   * @param item The MenuItem being added.
   */
  addToCart(item: MenuItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(i => i._id === item._id);
    let updatedItems: CartItem[] = [];

    if (existingItemIndex > -1) {
      // Item exists, increase quantity
      updatedItems = currentItems.map((cartItem, index) => {
        if (index === existingItemIndex) {
          const newQuantity = cartItem.quantity + 1;
          return {
            ...cartItem,
            quantity: newQuantity,
            subtotal: newQuantity * cartItem.price
          };
        }
        return cartItem;
      });
    } else {
      // Item is new, add it
      const newItem: CartItem = {
        ...item,
        quantity: 1,
        subtotal: item.price
      };
      updatedItems = [...currentItems, newItem];
    }

    this.cartItemsSubject.next(updatedItems);
    // this.saveCart(updatedItems); // Optional: save to localStorage
  }

  /**
   * Sets the quantity of a specific item.
   */
  updateQuantity(itemId: string, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    let updatedItems: CartItem[] = [];

    if (quantity > 0) {
      updatedItems = currentItems.map(item => {
        if (item._id === itemId) {
          return {
            ...item,
            quantity: quantity,
            subtotal: quantity * item.price
          };
        }
        return item;
      });
    } else {
      // Quantity is 0 or less, so remove the item
      updatedItems = currentItems.filter(item => item._id !== itemId);
    }
    
    this.cartItemsSubject.next(updatedItems);
    // this.saveCart(updatedItems);
  }

  /**
   * Removes an item completely from the cart.
   */
  removeItem(itemId: string): void {
    const updatedItems = this.cartItemsSubject.value.filter(item => item._id !== itemId);
    this.cartItemsSubject.next(updatedItems);
    // this.saveCart(updatedItems);
  }

  /**
   * Clears all items from the cart.
   */
  clearCart(): void {
    this.cartItemsSubject.next([]);
    // localStorage.removeItem('campusCart');
  }

  /**
   * Gets the current cart total amount.
   */
  getCartTotal(): number {
    return this.calculateCartTotals(this.cartItemsSubject.value).total;
  }

  /**
   * Gets the total count of items in the cart (sum of quantities).
   */
  getCartItemCount(): number {
    return this.calculateCartTotals(this.cartItemsSubject.value).count;
  }

  /**
   * Gets the raw list of items in the cart.
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }
}