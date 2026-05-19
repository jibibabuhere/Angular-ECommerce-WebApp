import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../models/cartItemsModel';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart-component.component.html',
  styleUrl: './cart-component.component.scss'
})

export class CartComponentComponent {

  @Input() cartItems: CartItem[] = [];
  @Output() cartUpdated: EventEmitter<CartItem[]> = new EventEmitter<CartItem[]>();
  @Output() navigateToCart: EventEmitter<void> = new EventEmitter<void>();
  @Output() removeItem: EventEmitter<number> = new EventEmitter<number>();
  @Output() incrementQuantity: EventEmitter<CartItem> = new EventEmitter<CartItem>();
  @Output() decrementQuantity: EventEmitter<CartItem> = new EventEmitter<CartItem>();
  @Output() onInputChange: EventEmitter<{ item: CartItem; event: Event }> = new EventEmitter<{ item: CartItem; event: Event }>();
  @Output() onBlurInput: EventEmitter<{ item: CartItem; event: FocusEvent }> = new EventEmitter<{ item: CartItem; event: FocusEvent }>();

  @Output() openDeleteDialog: EventEmitter<number> = new EventEmitter<number>();
  isDeleteDialogVisible: boolean = false;
  itemToDeleteIndex: number | null = null;

  updateCartItemQuantity(item: CartItem): void {
    this.cartUpdated.emit(this.cartItems);

  }

  handleRemoveItem(index: number): void {
    this.removeItem.emit(index);
  }

  incrementItemQuantity(item: CartItem): void {
    this.incrementQuantity.emit(item);
  }

  decrementItemQuantity(item: CartItem): void {
    this.decrementQuantity.emit(item);
  }

  handleInputChange(item: CartItem, event: Event): void {
    this.onInputChange.emit({ item, event });
  }

  handleBlurInput(item: CartItem, event: FocusEvent): void {
    this.onBlurInput.emit({ item, event });
  }

  emitNavigateToCart(): void {
    this.navigateToCart.emit();
  }


  handleOpenDeleteDialog(index: number): void {
    this.openDeleteDialog.emit(index);
  }


}
