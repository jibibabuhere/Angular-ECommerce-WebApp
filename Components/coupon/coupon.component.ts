
import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, } from '@angular/core';
import { NgIf } from '@angular/common';
import { CartItem } from '../../models/cartItemsModel';
@Component({
  selector: 'app-coupon',
  standalone: true,
  imports: [NgIf],
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})


export class CouponComponent {
  @Input() cartItems: CartItem[] = [];
  @Input() appliedCoupon: string | null = null;
  @Input() discountedTotal: string = '$0.00';
  @Input() couponMessage: string = '';
  @Input() couponMessageColor: string = 'green';

  @Output() applyCoupon: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeCoupon: EventEmitter<void> = new EventEmitter<void>();
  @Output() couponInputChange: EventEmitter<void> = new EventEmitter<void>();
  @Input() isCouponValid: boolean = true;
  onApplyCoupon(couponCode: string): void {
    this.applyCoupon.emit(couponCode);
  }

  onRemoveCoupon(): void {
    this.removeCoupon.emit();
  }

  onInputChange(): void {
    this.couponInputChange.emit();
  }
  clearCouponMessage() {
    if (!this.appliedCoupon?.trim()) {
      this.couponMessage = '';
      this.couponMessageColor = 'inherit';
    }
  }

}


