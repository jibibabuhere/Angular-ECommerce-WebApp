
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const navigationState = window.history.state?.navigationId;
    const currentPath = state.url;

    const restrictedPages = ['/thankyou', '/address', '/review'];
    if (restrictedPages.includes(currentPath) && !navigationState) {
      this.router.navigate(['/error']);
      return false;
    }

    if (currentPath === '/cart' && !navigationState) {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
      if (!loggedInUser.userLoginStatus) {
        this.router.navigate(['/error']);
        return false;
      }
    }

    return true;
  }
}

