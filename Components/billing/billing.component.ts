
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AddressS } from '../../models/addressModels'
import { Address } from '../../enums/address.enum';
@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule, ReactiveFormsModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})

export class BillingComponent {
  @Input() billingForm!: FormGroup;
  @Output() billingDataEmitter = new EventEmitter<AddressS>();
  @Output() emailEmitter = new EventEmitter<string>();
  @Output() saveBillingAddressChange = new EventEmitter<boolean>();
  addressTitle = Address.Billing;
  @Input() saveBillingAddressCheckBox: boolean = false;

  @Output() openPopup = new EventEmitter<void>();
  constructor() { }
  get formControls() {
    return this.billingForm.controls;
  }


  emitBillingData(): void {
    this.billingDataEmitter.emit(this.billingForm.value as AddressS);
    if (this.billingForm.valid) {
      this.billingDataEmitter.emit(this.billingForm.value as AddressS);
    }

  }

  emitEmail(): void {
    const email: string | null = this.billingForm.get('email')?.value;
    if (email) {
      this.emailEmitter.emit(email);
    }
  }
  saveBillingAddress(checked: boolean) {
    this.saveBillingAddressChange.emit(checked);
  }

  onOpenPopup() {
    this.openPopup.emit();
  }

  onAddressSelected(address: any) {
    this.billingForm.patchValue(address);
  }
  submitBilling(): void {
    if (this.billingForm.valid) {
      console.log('Billing Form Submitted:', this.billingForm.value);
    } else {
      this.billingForm.markAllAsTouched();
    }
  }

}


