import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThankyouComponent } from '../../Components/thankyou/thankyou.component';
import { OrderSummary } from '../../models/orderSummaryMode';
import { CartItem } from '../../models/cartItemsModel';
import { AddressS } from '../../models/addressModels'
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [ThankyouComponent],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss'
})


export class ThankYouComponent implements OnInit, OnDestroy {
  orderSummary: OrderSummary = {
    subtotalAmt: '0.00',
    tax: '0.00',
    discount: '0.00',
    deliveryCharge: '0.00',
    total: '0.00',
    promoCodeDiscount: "0.00",
    currency: 'USD',
  };
  shippingAddress: AddressS = {
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    country: '',
    zipCode: '',
    city: '',
    state: '',
    phone: '',
  };
  cartItems: CartItem[] = [];
  constructor(private router: Router) { }

  ngOnInit() {
    const savedOrderSummary = JSON.parse(localStorage.getItem('orderSummary') || 'null');
    const savedFormData = JSON.parse(localStorage.getItem('formData') || 'null');
    const savedCartItems = JSON.parse(localStorage.getItem('cartItems') || 'null');

    this.orderSummary = savedOrderSummary || this.orderSummary;
    this.shippingAddress = savedFormData?.shippingAddress || this.shippingAddress;
    this.cartItems = savedCartItems || [];
    if (sessionStorage.getItem('visited')) {
      this.clearLocalStorageData();
    } else {
      sessionStorage.setItem('visited', 'true');
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('visited');
  }

  private clearLocalStorageData() {
    localStorage.removeItem('cartItems');
    localStorage.removeItem('formData');
    localStorage.removeItem('orderSummary');
    localStorage.removeItem('AddressBook');
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }


}



