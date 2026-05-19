import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { AddressS } from '../../models/addressModels'
@Component({
  selector: 'app-shipping-info',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './shipping-info.component.html',
  styleUrl: './shipping-info.component.scss',

})
export class ShippingInfoComponent {
  @Input() shippingTitle: string = '';

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

}
