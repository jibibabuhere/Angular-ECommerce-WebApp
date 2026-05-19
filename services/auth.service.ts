import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userLoggedOut = new BehaviorSubject<boolean>(false);
  userLoggedOut$ = this.userLoggedOut.asObservable();

  logout(): void {
    this.userLoggedOut.next(true);
    localStorage.removeItem('AddressBook');
    localStorage.removeItem('formData');
    localStorage.removeItem('orderSummary');
    localStorage.removeItem('appliedCoupon');



  }
}

