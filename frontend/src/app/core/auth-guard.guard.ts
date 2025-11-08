import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // 1. Check if the user is logged in at all
    if (!this.authService.isLoggedIn()) {
      console.warn('Access denied: User not logged in.');
      return this.router.createUrlTree(['/login']);
    }

    // 2. Check if the logged-in user has the 'admin' role
    if (this.authService.isAdmin()) {
      return true; // Access granted
    } else {
      console.warn('Access denied: User is not an admin.');
      // Redirect non-admin users to the menu page
      return this.router.createUrlTree(['/menu']); 
    }
  }
}
