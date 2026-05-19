import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { BillingComponent } from '../../Components/billing/billing.component';
import { ShippingComponent } from '../../Components/shipping/shipping.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AddressFormData } from '../../models/addressModels';
import { AddressS } from '../../models/addressModels'
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { Address } from '../../enums/address.enum';
import { CommonOrderSummaryComponent } from '../../Components/common-order-summary/common-order-summary.component';
import { CartItem } from '../../models/cartItemsModel';
import { OrderSummary } from '../../models/orderSummaryMode';
import { CartServiceService } from '../../cart-service.service';


@Component({
  selector: 'app-address',
  standalone: true,
  imports: [MatIcon, BillingComponent, ShippingComponent, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatIconModule, CommonOrderSummaryComponent],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
  providers: [NgModel]
})


export class AddressComponent implements OnInit {
  @Input() cartItems: CartItem[] = [];
  @Input() orderSummary: OrderSummary = {
    currency: 'USD',
    subtotalAmt: '0.00',
    discount: '0.00',
    deliveryCharge: '0.00',
    tax: '0.00',
    promoCodeDiscount: '0.00',
    total: '0.00'
  };
  @Output() orderSummaryChange = new EventEmitter<OrderSummary>();
  popupContext: 'billing' | 'shipping' = 'billing';
  isButtonEnabled: boolean = false;
  formData: AddressFormData = {
    billingAddress: {
      city: '',
      country: '',
      addressLine1: '',
      firstName: '',
      addressLine2: '',
      lastName: '',
      phone: '',
      zipCode: '',
      state: ''
    },
    shippingAddress: {
      city: '',
      country: '',
      addressLine1: '',
      firstName: '',
      addressLine2: '',
      lastName: '',
      phone: '',
      zipCode: '',
      state: ''
    },
    email: '',
    isShippingSameAsBilling: false
  };

  @Input() billingData!: AddressS;
  @Input() email: string = '';
  @Input() shippingData: {
    shippingAddress: AddressS;
    isShippingSameAsBilling: boolean;
  } = {
      shippingAddress: {
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        phone: ''
      },
      isShippingSameAsBilling: false
    };

  addressTItle: Address = Address.ShippingAndBillingTitle;
  billingForm: FormGroup;
  shippingForm: FormGroup;
  isOrderSummaryVisible: boolean = false;
  billingFormAddressBook = {};
  shippingFormAddressBook = {};

  formDataAddressBook = {
    isShippingSameAsBilling: false,
    saveBillingAddress: false,
    saveShippingAddress: false
  };
  showPopup = false;
  popupTitle = '';
  addressBook: any[] = [];
  @Output() addressSelected = new EventEmitter<any>();
  @Output() popupClosed = new EventEmitter<void>();
  @Output() saveBillingAddressChange = new EventEmitter<boolean>();
  @Output() saveShippingAddressChange = new EventEmitter<boolean>();
  addressList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private cartService: CartServiceService,
    private cdRef: ChangeDetectorRef,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute

  ) {
    this.billingForm = this.fb.group({
      ...this.formData.billingAddress,
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^\\d{5}(-\\d{4})?$|^\\d{6}$')]],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]]
    });

    this.shippingForm = this.fb.group({
      ...this.formData.shippingAddress,
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^\\d{5}(-\\d{4})?$|^\\d{6}$')]],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
    });
  }

  get billingControls() {
    return this.billingForm.controls;
  }

  ngOnInit(): void {
    const storedOrderSummary = localStorage.getItem('orderSummary');
    const storedCartItems = localStorage.getItem('cartItems');

    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    }

    if (storedOrderSummary) {
      this.orderSummary = JSON.parse(storedOrderSummary);
    }


    this.isOrderSummaryVisible = this.cartItems.length > 0;


    this.cartService.cartUpdated.subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.updateOrderSummary();
      this.isOrderSummaryVisible = this.cartItems.length > 0;
      this.cdr.detectChanges();
    });

    this.cartService.loadCartItems();

    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      const formData: AddressFormData = JSON.parse(storedFormData);
      this.formData = formData;

      this.billingData = formData.billingAddress || {};
      this.email = formData.email || '';

      this.populateBillingForm(this.formData);

      this.shippingData = {
        shippingAddress: formData.shippingAddress || {},
        isShippingSameAsBilling: formData.isShippingSameAsBilling || false
      };

      this.populateShippingForm(formData);
      this.email = formData.email || '';
    }
    this.billingForm.valueChanges.subscribe(() => {
      this.emitBillingData();
      this.emitEmail();
      this.isButtonEnabledMethod();
      this.cdRef.detectChanges();
    });

    this.cdRef.detectChanges();

    this.shippingForm.valueChanges.subscribe(() => {
      this.emitShippingData();
      this.isButtonEnabledMethod();
      this.cdRef.detectChanges();
    });
    this.cdRef.detectChanges();
    this.cdRef.detectChanges();
    let addressBook = localStorage.getItem('AddressBook');

    this.cdRef.detectChanges();
    const addressBooks = JSON.parse(localStorage.getItem('AddressBook') || '{}');
    const selectedBillingAddresses = addressBooks.selectedBillingAddress || null;
    this.formData.billingAddress = selectedBillingAddresses || this.formData.billingAddress;
    const selectedShippingAddress = addressBooks.selectedShippingAddress || null;
    this.formData.shippingAddress = selectedShippingAddress || this.formData.shippingAddress;
    this.cdRef.detectChanges();


    this.cdRef.detectChanges();
    const selectedBillingAddress = localStorage.getItem('selectedBillingAddress');
    if (selectedBillingAddress) {
      this.selectedAddress = JSON.parse(selectedBillingAddress);

    }
  }

  populateBillingForm(savedData: AddressFormData): void {
    const billingAddress = savedData.billingAddress || {};
    this.billingForm.patchValue({
      email: savedData.email || '',
      firstName: billingAddress.firstName || '',
      lastName: billingAddress.lastName || '',
      addressLine1: billingAddress.addressLine1 || '',
      addressLine2: billingAddress.addressLine2 || '',
      country: billingAddress.country || '',
      zipCode: billingAddress.zipCode || '',
      city: billingAddress.city || '',
      state: billingAddress.state || '',
      phone: billingAddress.phone || '',
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['billingData'] || changes['email'] || changes['shippingData']) {
      this.isButtonEnabledMethod();
    }

    if (changes['billingData'] && changes['billingData'].currentValue) {
      this.formData.billingAddress = changes['billingData'].currentValue.billingAddress;

      this.updateFormData();
    }

    if (changes['shippingData'] && changes['shippingData'].currentValue) {
      this.formData.shippingAddress = changes['shippingData'].currentValue.shippingAddress;
      this.formData.isShippingSameAsBilling = changes['shippingData'].currentValue.isShippingSameAsBilling;
      this.updateFormData();
    }

  }

  checkButtonStatus(): void {
    this.isButtonEnabled = this.isButtonEnabledMethod();

  }

  private updateFormData(): void {
    this.formData.billingAddress = this.billingData || {};
    this.formData.email = this.email || '';
    this.formData.shippingAddress = this.shippingData?.shippingAddress || {};
    this.formData.isShippingSameAsBilling = this.shippingData?.isShippingSameAsBilling || false;
  }

  isButtonEnabledMethod(): boolean {
    const billingValid = this.billingForm.valid

    const emailValid = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(this.email);
    const isShippingSameAsBillingChecked = this.formData.isShippingSameAsBilling === true;

    const shippingFieldsValid = this.shippingData?.shippingAddress &&
      Object.entries(this.shippingData.shippingAddress).every(([key, value]) => {
        return !!value;
      });

    const condition1 = billingValid && emailValid && isShippingSameAsBillingChecked;
    const condition2 = billingValid && emailValid && (!isShippingSameAsBillingChecked && shippingFieldsValid);

    this.isButtonEnabled = condition1 || condition2;


    return this.isButtonEnabled;
  }

  saveData(): void {
    this.formData.billingAddress = this.billingData;
    this.formData.email = this.email;
    this.formData.shippingAddress = this.shippingData?.shippingAddress;
    this.formData.isShippingSameAsBilling = this.shippingData?.isShippingSameAsBilling;
    localStorage.setItem('formData', JSON.stringify(this.formData));
    this.router.navigate(['/review']);
  }

  submitBilling(): void {
    if (this.billingForm.valid) {
      this.onBillingDataReceived(this.billingForm.value);
      this.onEmailReceived(this.billingControls['email'].value);
    } else {
      this.billingForm.markAllAsTouched();
    }
  }

  copyBillingToShipping(isChecked: boolean): void {
    if (isChecked) {
      this.shippingForm.patchValue(this.billingForm.value);
      this.formData.isShippingSameAsBilling = true;
    } else {
      this.shippingForm.reset();
      this.formData.isShippingSameAsBilling = false;
    }
    this.emitShippingData();
  }

  populateShippingForm(savedData: AddressFormData): void {
    const shippingAddress = savedData.shippingAddress || {};
    this.shippingForm.patchValue(shippingAddress);
    this.formData.isShippingSameAsBilling = savedData.isShippingSameAsBilling || false;
  }

  emitShippingData(): void {
    this.shippingData = {
      shippingAddress: this.shippingForm.value,
      isShippingSameAsBilling: this.formData.isShippingSameAsBilling,
    };
  }

  emitBillingData(): void {
    if (this.billingForm.valid) {
      this.onBillingDataReceived(this.billingForm.value);
    }
  }

  emitEmail(): void {
    const email = this.billingForm.get('email')?.value;
    if (email) {
      this.onEmailReceived(email);
    }
  }

  goToCartPage(): void {
    this.router.navigate(['/cart']);
  }

  onBillingDataReceived(data: AddressS): void {
    this.billingData = data;
  }

  onEmailReceived(email: string): void {
    this.email = email;
  }

  isAddressValid(): boolean {
    return true;
  }


  continueToReview(): void {
    if (this.isButtonEnabled) {
      this.router.navigate(['/review']);
    }
  }

  updateOrderSummary(): void {
    const subtotal: number = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount: number = this.cartItems.reduce((sum, item) => sum + item.discount * item.quantity, 0);
    const totalTax: number = this.cartItems.reduce((sum, item) => sum + item.tax * item.quantity, 0);
    const deliveryCharge: number = this.cartItems.length > 0 ? this.cartItems[0].deliveryCharge : 0;
    const promoCode: number = parseFloat(localStorage.getItem('appliedCoupon') || '0');
    const newSubtotal = subtotal - (subtotal * promoCode) / 100;
    const promoCodeDiscount: number = (promoCode) / 100 * subtotal;
    const grandTotal: number = newSubtotal + deliveryCharge + totalTax;

    this.orderSummary = {
      currency: 'USD',
      subtotalAmt: newSubtotal.toFixed(2),
      discount: totalDiscount.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      tax: totalTax.toFixed(2),
      promoCodeDiscount: promoCodeDiscount.toFixed(2),
      total: grandTotal.toFixed(2),
    };

    localStorage.setItem('orderSummary', JSON.stringify(this.orderSummary));
    this.cdr.detectChanges();
  }
  saveBillingAddress(checked: boolean) {
    this.saveBillingAddressChange.emit(checked);
  }
  onSaveBillingAddressChange(isChecked: boolean) {
    this.formDataAddressBook.saveBillingAddress = isChecked;
  }

  saveShiipingingAddress(checked: boolean) {
    this.saveShippingAddressChange.emit(checked);
  }
  onSaveShippingAddressChange(isChecked: boolean) {
    this.formDataAddressBook.saveShippingAddress = isChecked;
  }
  onOrderSummaryButtonClick() {
    if (this.isButtonEnabled) {

      if (this.formDataAddressBook.saveBillingAddress) {
        const billingAddress = this.billingForm.value;
        const addressBook = JSON.parse(localStorage.getItem('AddressBook') || '{}');
        if (!addressBook.billingAddresses) {
          addressBook.billingAddresses = [];
        }
        addressBook.billingAddresses.push(billingAddress);
        localStorage.setItem('AddressBook', JSON.stringify(addressBook));
      }
      if (this.formDataAddressBook.saveShippingAddress) {
        const shippingAddress = this.shippingForm.value;
        const addressBook = JSON.parse(localStorage.getItem('AddressBook') || '{}');
        if (!addressBook.shippingAddresses) {
          addressBook.shippingAddresses = [];
        }
        addressBook.shippingAddresses.push(shippingAddress);
        localStorage.setItem('AddressBook', JSON.stringify(addressBook));
      }

      this.saveData();
      this.router.navigate(['/review']);
    }
  }
  loadAddresses(type: string) {
    this.popupTitle = type === 'billing' ? 'Billing Address Book' : 'Shipping Address Book';
    const key = type === 'billing' ? 'billingAddresses' : 'shippingAddresses'; // Use the array keys here
    this.addressList = JSON.parse(localStorage.getItem('AddressBook') || '{}')[key] || [];
  }
  selectedAddress: any;

  selectAddress(address: any): void {
    this.selectedAddress = address;

  }

  useSelectedAddress() {
    if (this.selectedAddress) {
      if (this.popupContext === 'billing') {
        this.formData.billingAddress = this.selectedAddress;
        this.billingForm.patchValue(this.selectedAddress);

      } else if (this.popupContext === 'shipping') {
        this.formData.shippingAddress = this.selectedAddress;
        this.shippingForm.patchValue(this.selectedAddress);

      }
      this.addressSelected.emit(this.selectedAddress);
      localStorage.setItem('formData', JSON.stringify(this.formData));
      this.closePopup();
    }
  }


  openPopup(type: string) {
    this.showPopup = true;
    this.popupContext = type as 'billing' | 'shipping';

    if (type === 'billing') {
      this.popupTitle = 'Billing Address';

      this.addressBook = JSON.parse(localStorage.getItem('AddressBook') || '{}').billingAddresses || [];
      this.selectedAddress = this.formData.billingAddress;

    } else if (type === 'shipping') {
      this.popupTitle = 'Shipping Address';

      this.addressBook = JSON.parse(localStorage.getItem('AddressBook') || '{}').shippingAddresses || [];
      this.selectedAddress = this.formData.shippingAddress;
      this.cdRef.detectChanges();

    }
  }
  compareAddresses(address1: any, address2: any): boolean {
    return JSON.stringify(address1) === JSON.stringify(address2);
  }
  closePopup() {
    this.showPopup = false;

  }
  hasAvailableAddresses(): boolean {
    const addressBook = JSON.parse(localStorage.getItem('AddressBook') || '{}');
    if (this.popupContext === 'billing') {
      const billingAddresses = addressBook.billingAddresses || [];
      return billingAddresses.length > 0;
    } else if (this.popupContext === 'shipping') {
      const shippingAddresses = addressBook.shippingAddresses || [];
      return shippingAddresses.length > 0;
    }
    return false;
  }

  showPopupWithAddresses(type: string): void {
    this.openPopup(type);
    this.addressBook = this.popupContext === 'billing'
      ? JSON.parse(localStorage.getItem('AddressBook') || '{}').billingAddresses || []
      : JSON.parse(localStorage.getItem('AddressBook') || '{}').shippingAddresses || [];
  }

  goToLogin(): void {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

    const clearedUser = {
      email: '',
      firstName: '',
      id: null,
      lastName: '',
      mobile: '',
      username: ''
    };

    localStorage.setItem('loggedInUser', JSON.stringify(clearedUser));
    this.router.navigate(['/login']);

  }

}
