import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ContactInfoComponent } from '../../Components/contact-info/contact-info.component';
import { BillingInfoComponent } from '../../Components/billing-info/billing-info.component';
import { ShippingInfoComponent } from '../../Components/shipping-info/shipping-info.component';
import { PaymentComponent } from '../../Components/payment/payment.component';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Review } from '../../enums/address.enum';
import { CommonOrderSummaryComponent } from '../../Components/common-order-summary/common-order-summary.component';
import { CartItem } from '../../models/cartItemsModel';
import { OrderSummary } from '../../models/orderSummaryMode';
import { CartServiceService } from '../../cart-service.service';
import { AddressS } from '../../models/addressModels'
import { ChangeDetectorRef } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-review',
  standalone: true,
  imports: [ContactInfoComponent, BillingInfoComponent, ShippingInfoComponent, PaymentComponent, MatIcon, RouterModule, CommonOrderSummaryComponent, MatStepperModule, MatButtonModule, MatIconModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})

export class ReviewComponent implements OnInit {

  cartItems: CartItem[] = [];
  orderSummary: OrderSummary = {
    currency: 'USD',
    subtotalAmt: '0.00',
    discount: '0.00',
    deliveryCharge: '0.00',
    tax: '0.00',
    promoCodeDiscount: '0.00',
    total: '0.00'
  };
  isOrderSummaryVisible: boolean = false;
  isCheckoutEnabled: boolean = false;

  paymentForm!: FormGroup;
  selectedPaymentOption: string = 'visa';

  reviewTitle: string = Review.ReviewTitle;
  contactTitle: string = Review.ContactTitle;
  email: string | null = '';

  billingAddress: AddressS = {
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

  @Output() checkoutStatusChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() checkoutStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() checkoutStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  shippingTitle: string = Review.ShippingInfo
  constructor(private fb: FormBuilder, private cartService: CartServiceService, private router: Router, private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    });
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

    this.cartItems = this.cartService.getCartItems();
    this.calculateOrderSummary();
    this.loadContactInfo();
    this.loadBillingAddress();
    this.loadShippingAddress();
    this.paymentForm.statusChanges.subscribe(() => this.emitPaymentStatus());
  }

  calculateOrderSummary(): void {
    const subtotal: number = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryCharge: number = this.cartItems[0]?.deliveryCharge || 0;
    const discount: number = this.cartItems.reduce(
      (sum, item) => sum + item.discount * item.quantity,
      0
    );
    const tax: number = this.cartItems.reduce(
      (sum, item) => sum + item.tax * item.quantity,
      0
    );
    const promoCode: number = parseFloat(localStorage.getItem('appliedCoupon') || '0');
    const newSubtotal = subtotal - (subtotal * promoCode) / 100;
    const promoCodeDiscount: number = (promoCode) / 100 * subtotal;
    const total: number = newSubtotal + deliveryCharge + tax;

    this.orderSummary = {
      currency: 'USD',
      subtotalAmt: newSubtotal.toFixed(2),
      discount: discount.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      tax: tax.toFixed(2),
      promoCodeDiscount: promoCodeDiscount.toFixed(2),
      total: total.toFixed(2)
    };
  }
  loadContactInfo(): void {
    this.email = localStorage.getItem('formData')
      ? JSON.parse(localStorage.getItem('formData')!).email
      : 'Email';
  }
  loadBillingAddress(): void {
    const savedData: string | null = localStorage.getItem('formData');
    if (savedData) {
      const formData: { billingAddress: AddressS } = JSON.parse(savedData);
      this.billingAddress = formData.billingAddress;
    } else {
      this.billingAddress = {
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
        zipCode: '',
        city: '',
        state: '',
        phone: ''
      };
    }
  }

  loadShippingAddress(): void {
    const savedData: string | null = localStorage.getItem('formData');
    if (savedData) {
      const formData: { shippingAddress: AddressS } = JSON.parse(savedData);
      this.shippingAddress = formData.shippingAddress || {
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
        zipCode: '',
        city: '',
        state: '',
        phone: ''
      };
    }
  }

  goToAddress(): void {
    this.router.navigate(['/address']);
  }

  completeCheckout(): void {
    this.router.navigate(['/thankyou']);
  }

  selectPaymentOption(option: string): void {
    if (this.selectedPaymentOption !== option && option === 'visa') {
      this.paymentForm.reset();
    }
    this.selectedPaymentOption = option;
    this.emitPaymentStatus();
  }

  emitPaymentStatus(): void {
    this.isCheckoutEnabled = this.selectedPaymentOption !== 'visa' || this.paymentForm.valid;
    this.checkoutStatusChange.emit(this.isCheckoutEnabled);
    this.checkoutStatusChanged.emit(this.isCheckoutEnabled);
  }
  updateCheckoutState(): void {
    this.emitPaymentStatus();
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
