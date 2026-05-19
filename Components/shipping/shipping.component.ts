import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Address } from '../../enums/address.enum';
import { AddressFormData } from '../../models/addressModels';
@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.scss'
})

export class ShippingComponent {
  addressTitle: string = Address.Shipping;
  sameAsBillingTitle: string = Address.SameAsBilling;
  @Input() billingForm!: FormGroup;
  @Input() shippingForm!: FormGroup;
  @Input() formData!: AddressFormData;
  @Input() isShippingSameAsBilling!: boolean;
  @Output() sameAsBillingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() shippingDataChange: EventEmitter<{ shippingAddress: AddressFormData; isShippingSameAsBilling: boolean }> = new EventEmitter<{ shippingAddress: AddressFormData; isShippingSameAsBilling: boolean }>();
  @Output() saveShippingAddressChange = new EventEmitter<boolean>();
  @Input() saveShippingAddressCheckBox: boolean = false;
  @Output() openPopup = new EventEmitter<void>();
  constructor(private fb: FormBuilder, private router: Router) { }

  get formControls() {
    return this.shippingForm.controls;
  }

  emitShippingData(): void {
    if (this.shippingForm.valid) {
      this.shippingDataChange.emit({
        shippingAddress: this.shippingForm.value,
        isShippingSameAsBilling: this.formData.isShippingSameAsBilling,
      });
    }

  }
  submitShipping(): void {
    if (this.shippingForm.valid) {
      console.log('Shipping Form Submitted:', this.shippingForm.value);
    } else {
      this.shippingForm.markAllAsTouched();
    }
  }

  onSameAsBillingChange(event: Event): void {
    const isChecked: boolean = (event.target as HTMLInputElement).checked;
    this.sameAsBillingChange.emit(isChecked);
  }



  saveShippingAddress(checked: boolean) {
    this.saveShippingAddressChange.emit(checked);
  }

  onOpenPopup() {
    this.openPopup.emit();
  }

  onAddressSelected(address: any) {
    this.shippingForm.patchValue(address);
  }

}
