import { Component, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/cartItemsModel';
import { OrderSummary } from '../../models/orderSummaryMode';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AddressS } from '../../models/addressModels'

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.scss'
})


export class ThankyouComponent {
  @Input() orderSummary: OrderSummary = {
    subtotalAmt: '0.00',
    tax: '0.00',
    discount: '0.00',
    deliveryCharge: '0.00',
    total: '0.00',
    promoCodeDiscount: "0.00",
    currency: 'USD',
  };

  @Input() shippingAddress: AddressS = {
    firstName: '',
    lastName: '',
    addressLine1: '',
    country: '',
    zipCode: '',
    city: '',
    state: '',
    phone: ''
  };

  @Input() cartItems: CartItem[] = [];
  constructor(

    private router: Router,

  ) { }
  goToLogin(): void {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

    const clearedUser = {
      email: '',
      firstName: '',
      id: null,
      lastName: '',
      mobile: '',
      password: '',
      username: ''
    };


    localStorage.setItem('loggedInUser', JSON.stringify(clearedUser));
    this.router.navigate(['/login']);

  }

}
