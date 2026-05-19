import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Review } from '../../enums/address.enum';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  @Input() paymentForm!: FormGroup;
  @Input() selectedPaymentOption!: string;
  paymentTitle: string = Review.PaymentTitle;
  @Output() selectPaymentOption: EventEmitter<string> = new EventEmitter<string>();

  get paymentFormControls() {
    return this.paymentForm.controls;
  }
  onSelectPaymentOption(option: string): void {
    this.selectPaymentOption.emit(option);
  }

}
