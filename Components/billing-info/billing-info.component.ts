import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Review } from '../../enums/address.enum';
import { AddressS } from '../../models/addressModels'

@Component({
  selector: 'app-billing-info',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './billing-info.component.html',
  styleUrl: './billing-info.component.scss'
})

export class BillingInfoComponent {

  @Input() billingAddress!: AddressS;


  billingTitle: string = Review.BillingInfo;

  constructor(private router: Router) { }

  goToAddress(): void {
    this.router.navigate(['/address']);
  }
}