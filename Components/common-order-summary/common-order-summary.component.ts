import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CartItem } from '../../models/cartItemsModel';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { OrderSummary } from '../../models/orderSummaryMode';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartServiceService } from '../../cart-service.service';

@Component({
  selector: 'app-common-order-summary',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './common-order-summary.component.html',
  styleUrl: './common-order-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CommonOrderSummaryComponent {
  @Input() cartItems: CartItem[] = [];
  @Input() orderSummary!: OrderSummary;
  @Input() buttonText: string = "Continue";
  @Input() isButtonEnabled: boolean = false;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();
  @Input() isOrderSummaryVisible: boolean = false;
  private cartSubscription!: Subscription;
  constructor(private cartService: CartServiceService, private cdRef: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderSummary']) {
      this.cdRef.detectChanges();
    }
  }

  onButtonClick(): void {
    this.buttonClick.emit();
  }

}
