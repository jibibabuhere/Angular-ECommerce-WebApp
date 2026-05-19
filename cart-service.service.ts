import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './models/cartItemsModel';
import { OrderSummary } from './models/orderSummaryMode';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  private cartItems: CartItem[] = [];
  cartUpdated = new BehaviorSubject<CartItem[]>([]);
  constructor() {
    this.loadCartItems();
  }
  loadCartItems() {
    const storedItems = localStorage.getItem('cartItems');
    this.cartItems = storedItems ? JSON.parse(storedItems) : this.initializeDefaultItems();
    this.cartUpdated.next(this.cartItems);
  }
  initializeDefaultItems(): CartItem[] {
    return [
      {
        product_id: "p1",
        name: "Jungle Book",
        desc: "An adventure story about a man-cub named Mowgli",
        price: 10,
        currency: "USD",
        imageUrl: "https://wallpapers.com/images/hd/the-jungle-book-the-movie-ejvi9m5tpzyeynbi.jpg",
        quantity: 1,
        tax: 2,
        discount: 1,
        deliveryCharge: 5,
        total: 10,
      },
      {
        product_id: "p2",
        name: "Tippy Kangaroo",
        desc: "A storybook about Kangaroo Kids and species",
        price: 20,
        currency: "USD",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-gPjUYEhhaXxyA7GMU2FTmlsrT2YaedfmNw&s",
        quantity: 1,
        tax: 3,
        discount: 2,
        deliveryCharge: 5,
        total: 20,
      },
    ];
  }

  updateCartItemQuantity(item: CartItem): void {
    const updatedItem = { ...item, total: item.price * item.quantity };
    this.cartItems = this.cartItems.map((cartItem) =>
      cartItem.product_id === item.product_id ? updatedItem : cartItem
    );
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartUpdated.next(this.cartItems);
  }

  getOrderSummary(): OrderSummary {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount = this.cartItems.reduce((sum, item) => sum + item.discount * item.quantity, 0);
    const totalTax = this.cartItems.reduce((sum, item) => sum + item.tax * item.quantity, 0);
    const deliveryCharge = this.cartItems.length > 0 ? this.cartItems[0].deliveryCharge : 0;
    const promoCode: number = parseFloat(localStorage.getItem('appliedCoupon') || '0');
    const newSubtotal = subtotal - (subtotal * promoCode) / 100;
    const promoCodeDiscount: number = (promoCode) / 100 * subtotal;
    const grandTotal: number = newSubtotal + deliveryCharge + totalTax;
    const orderSummary = {
      currency: "USD",
      subtotalAmt: newSubtotal.toFixed(2),
      discount: totalDiscount.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      tax: totalTax.toFixed(2),
      promoCodeDiscount: promoCodeDiscount.toFixed(2),
      total: grandTotal.toFixed(2),
    };

    localStorage.setItem("orderSummary", JSON.stringify(orderSummary));

    return orderSummary;
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem("cartItems");
    this.cartUpdated.next(this.cartItems);
  }


  getCartItems(): CartItem[] {
    return this.cartItems;
  }
}
