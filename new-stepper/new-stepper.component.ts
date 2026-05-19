
import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

import { MatStepper } from '@angular/material/stepper';
/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-new-stepper',
  standalone: true,
  templateUrl: './new-stepper.component.html',
  styleUrl: './new-stepper.component.scss',

  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepper
  ],
})
export class StepperOverviewExample {
  @ViewChild('stepper') stepper!: MatStepper;
  isLinear = true;

  ngOnInit() {
    setTimeout(() => {
      this.navigateToStepBasedOnPage();
    });
  }


  navigateToStepBasedOnPage() {
    const currentPage = this.getCurrentPage();
    switch (currentPage) {
      case 'address':
        this.stepper.selectedIndex = 0;
        break;
      case 'review':
        this.stepper.selectedIndex = 1;
        break;
      case 'thankyou':
        this.stepper.selectedIndex = 2;
        break;
      default:
        this.stepper.selectedIndex = 0;
    }
  }


  getCurrentPage(): string {
    return 'address';
  }
}

