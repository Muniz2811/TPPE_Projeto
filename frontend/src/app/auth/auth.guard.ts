import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      // Check if route has data.roles and user has one of required roles
      if (route.data['roles'] && !this.checkRoles(route.data['roles'])) {
        // Role not authorized, redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      
      // Authorized
      return true;
    }
    
    // Not logged in, redirect to login page with return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  private checkRoles(roles: string[]): boolean {
    const user = this.authService.currentUserValue;
    if (!user) return false;
    
    return roles.includes(user.role);
  }
}
