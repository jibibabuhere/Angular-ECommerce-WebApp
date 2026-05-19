import { Component, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CartComponentComponent } from '../../Components/cart-component/cart-component.component';
import { CartItem } from '../../models/cartItemsModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CartServiceService } from '../../cart-service.service';
import { OrderSummary } from '../../models/orderSummaryMode';
import { CommonOrderSummaryComponent } from '../../Components/common-order-summary/common-order-summary.component';
import * as XLSX from 'xlsx';
import { CouponComponent } from "../../Components/coupon/coupon.component";
import { HeaderComponent } from "../../Components/header/header.component";
import { AuthService } from '../../services/auth.service'
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartComponentComponent, CommonModule, FormsModule, RouterModule, CommonOrderSummaryComponent, CouponComponent, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})


export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  orderSummary!: OrderSummary;
  @Output() cartUpdated: EventEmitter<CartItem[]> = new EventEmitter<CartItem[]>();
  isCouponValid: boolean = true;
  isOrderSummaryVisible: boolean = false;
  isDeleteDialogVisible: boolean = false;
  itemToDeleteIndex: number | null = null;
  deleteDialogMessage: string = '';
  deleteAction: 'deleteSingle' | 'clearAll' = 'deleteSingle';
  loggedInUser: any = {};
  showTooltip: boolean = false;
  isUserLoggedIn: boolean = false;
  appliedCoupon: string | null = null;
  couponMessage: string = '';
  couponMessageColor: string = 'green';
  discountedTotal: string = '$0.00';
  coupons = [
    { couponValue: 10, couponName: '10off', couponType: 'percentage' },
    { couponValue: 20, couponName: '20off', couponType: 'percentage' },
    { couponValue: 30, couponName: '30off', couponType: 'percentage' }
  ];
  @Output() couponInputChange: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private cartService: CartServiceService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/thankyou') {
        this.clearCouponOnThankYou();
      }
    });
  }

  ngOnInit(): void {

    const user = localStorage.getItem('loggedInUser');
    this.loggedInUser = user
      ? JSON.parse(user)
      : { firstName: 'Guest', lastName: '' };

    if (!this.loggedInUser || !this.loggedInUser.email) {
      this.clearCoupon();
    }

    const storedOrderSummary = localStorage.getItem('orderSummary');
    const storedCartItems = localStorage.getItem('cartItems');

    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
    }


    else {

      const defaultCartItems = this.initializeDefaultItems();
      this.cartItems = defaultCartItems;
      localStorage.setItem('cartItems', JSON.stringify(defaultCartItems));
    }

    this.updateOrderSummary();


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
    this.cdr.detectChanges();
    if (!localStorage.getItem('coupons')) {
      localStorage.setItem('coupons', JSON.stringify(this.coupons));
    }
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      this.applyCoupon(savedCoupon, true);
    }
    this.authService.userLoggedOut$.subscribe((loggedOut) => {
      if (loggedOut) {
        this.clearCoupon();
      }
    });

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderSummary']) {
      this.cdRef.detectChanges();
    }
  }
  initializeDefaultItems(): CartItem[] {
    return [
      {
        product_id: 'p1',
        name: 'Jungle Book',
        desc: 'An adventure story about a man-cub named Mowgli',
        price: 10,
        currency: 'USD',
        imageUrl:
          'https://wallpapers.com/images/hd/the-jungle-book-the-movie-ejvi9m5tpzyeynbi.jpg',
        quantity: 1,
        tax: 2,
        discount: 1,
        deliveryCharge: 5,
        total: 10,
      },
      {
        product_id: 'p2',
        name: 'Tippy Kangaroo',
        desc: 'A storybook about Kangaroo Kids and species',
        price: 20,
        currency: 'USD',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-gPjUYEhhaXxyA7GMU2FTmlsrT2YaedfmNw&s',
        quantity: 1,
        tax: 3,
        discount: 2,
        deliveryCharge: 5,
        total: 20,
      },
    ];
  }

  updateCartItemQuantity(item: CartItem): void {
    item.total = item.price * item.quantity;
    this.cartItems = this.cartItems.map((cartItem) =>
      cartItem.product_id === item.product_id ? item : cartItem
    );
    this.cartUpdated.emit(this.cartItems);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.updateOrderSummary();
    this.cdr.detectChanges();
  }
  incrementQuantity(item: CartItem): void {
    if (item.quantity < 50) {
      item.quantity++;
      this.updateCartItemQuantity(item);
    }
  }

  decrementQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItemQuantity(item);
    }
  }
  onInputChange(item: CartItem, event: Event): void {
    const inputValue: number = Number((event.target as HTMLInputElement).value);
    if (isNaN(inputValue) || inputValue < 1) {
      item.quantity = 1;
    } else if (inputValue > 50) {
      item.quantity = 50;
    } else {
      item.quantity = inputValue;
    }
    this.updateCartItemQuantity(item);
  }
  onBlurInput(item: CartItem, event: Event): void {
    const inputValue: number = Number((event.target as HTMLInputElement).value);
    if (isNaN(inputValue) || inputValue < 1) {
      item.quantity = 1;
      (event.target as HTMLInputElement).value = '1';
    }
    this.updateCartItemQuantity(item);
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));

    if (this.cartItems.length === 0) {
      localStorage.removeItem('orderSummary');
      this.orderSummary = {
        currency: "USD",
        subtotalAmt: "0.00",
        discount: "0.00",
        deliveryCharge: "0.00",
        tax: "0.00",
        promoCodeDiscount: "0.00",
        total: "0.00",
      };
    } else {
      this.updateOrderSummary();
    }

    this.cartUpdated.emit([...this.cartItems]);
    this.cdr.detectChanges();
  }

  openDeleteConfirmation(index: number): void {
    this.itemToDeleteIndex = index;
    this.deleteDialogMessage = 'Are you sure you want to delete this product?';
    this.deleteAction = 'deleteSingle';
    this.isDeleteDialogVisible = true;
  }


  openClearAllDialog(): void {
    this.deleteDialogMessage = 'Are you sure you want to clear all items?';
    this.deleteAction = 'clearAll';
    this.isDeleteDialogVisible = true;
  }

  confirmDelete(): void {
    if (this.deleteAction === 'deleteSingle' && this.itemToDeleteIndex !== null) {
      this.cartItems.splice(this.itemToDeleteIndex, 1);
      this.itemToDeleteIndex = null;

      this.updateOrderSummary();

    } else if (this.deleteAction === 'clearAll') {
      this.cartItems = [];
      this.updateOrderSummary();

    }

    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.closeDeleteDialog();
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogVisible = false;
    this.cdr.detectChanges();
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
    this.orderSummary = { ...this.orderSummary };
    this.cdRef.detectChanges();
    this.cdr.detectChanges();
  }
  showEmptyCartMessage(): void {
    const container: HTMLElement | null = document.querySelector('.container');
    const emptyCartMessage: HTMLElement = document.createElement('div');
    emptyCartMessage.className = 'empty-cart-message';
    emptyCartMessage.innerHTML = `
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-yrKy00koNPRSg-MAE5rkMmy2HiIAE4U_HQ&s" alt="Empty Cart">
  <p>No items in the cart</p>
  <button class="add-items-button" (click)="goToCart()">Add Items to the cart</button>
`;
    container?.appendChild(emptyCartMessage);
  }


  goToCart(): void {
    const defaultCartItems: CartItem[] = this.initializeDefaultItems();
    localStorage.setItem('cartItems', JSON.stringify(defaultCartItems));
    this.cartItems = [...defaultCartItems];
    this.cartService.cartUpdated.next(this.cartItems);
    this.cdr.detectChanges()
    this.updateOrderSummary();
    this.cdr.detectChanges();
    this.router.navigate(['/cart']);
  }
  onCartUpdated(updatedCartItems: CartItem[]): void {
    this.cartItems = updatedCartItems;
    this.cartService.cartUpdated.next(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.updateOrderSummary();
    this.cdr.detectChanges();
  }
  onCouponValidation(isValid: boolean): void {
    this.isCouponValid = isValid;
    this.cdr.detectChanges();
  }

  isProceedEnabled(): boolean {
    return this.isCouponValid;
  }
  proceedToAddress(): void {
    this.router.navigate(['/address']);
  }

  downloadAllCards(): void {
    const data = this.cartItems.map((item) => ({
      Name: item.name,
      Description: item.desc,
      Price: item.price,
      ImageURL: item.imageUrl,
      Quantity: item.quantity,
      Tax: item.tax,
      Discount: item.discount,
      DeliveryCharge: item.deliveryCharge,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cart Details');
    XLSX.writeFile(workbook, 'Cart_Details.xlsx');
  }

  goToError(): void {
    this.router.navigate(['/error']);
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
    this.clearCoupon();
    this.router.navigate(['/login']);

  }
  toggleTooltip(): void {
    this.showTooltip = !this.showTooltip;
    this.cdr.detectChanges();
  }

  applyCoupon(couponCode: string, fromStorage: boolean = false): void {
    const storedCoupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary') || '{}');
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (!user || !user.email) {
      this.clearCoupon();
      this.couponMessage = 'You must be logged in to use a coupon!';
      this.couponMessageColor = 'red';
      return;
    }

    if (!couponCode.trim()) {
      this.clearCoupon();
      return;
    }

    const matchingCoupon = storedCoupons.find(
      (coupon: any) => coupon.couponName === couponCode
    );

    if (matchingCoupon) {
      const discountPercentage = matchingCoupon.couponValue;
      const currentSubtotal = parseFloat(orderSummary.subtotalAmt) || 0;
      const discount = (currentSubtotal * discountPercentage) / 100;
      const newSubtotal = currentSubtotal - discount;

      this.appliedCoupon = couponCode;
      this.couponMessage = `Coupon "${couponCode}" applied successfully!`;
      this.couponMessageColor = 'green';
      this.discountedTotal = `$${newSubtotal.toFixed(2)}`;
      const updatedOrderSummary = { ...orderSummary, subtotalAmt: newSubtotal.toFixed(2) };
      localStorage.setItem('orderSummary', JSON.stringify(updatedOrderSummary));

      if (!fromStorage) {
        localStorage.setItem('appliedCoupon', couponCode);
      }
      this.isCouponValid = true;

      this.updateOrderSummary();
    } else {
      this.couponMessage = 'Invalid coupon code!';
      this.couponMessageColor = 'red';
      this.discountedTotal = `$${parseFloat(orderSummary.subtotalAmt || '0').toFixed(2)}`;
      this.isCouponValid = false;
    }
  }

  clearCoupon(): void {
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary') || '{}');

    this.appliedCoupon = null;
    this.couponMessage = '';
    this.couponMessageColor = 'green';
    this.discountedTotal = `$${parseFloat(orderSummary.subtotalAmt || '0').toFixed(2)}`;

    localStorage.removeItem('appliedCoupon');
    this.isCouponValid = true;
    this.updateOrderSummary();
  }

  removeCoupon(): void {
    this.clearCoupon();
  }

  onCouponInputChange(): void {
    this.couponMessage = '';
    this.couponMessageColor = 'inherit';
  }

  clearCouponOnThankYou(): void {
    setTimeout(() => {
      this.clearCoupon();
    }, 5000);
  }

}
