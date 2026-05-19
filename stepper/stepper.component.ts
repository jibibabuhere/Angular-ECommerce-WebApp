import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule, MatStepperModule, MatButtonModule, MatIconModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})

export class StepperComponent {
  activeStep: number = 0;
  isCheckoutEnabled: boolean = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          case '/address':
            this.activeStep = 0;
            break;
          case '/review':
            this.activeStep = 1;
            break;
          case '/thankyou':
            this.activeStep = 2;
            break;
          default:
            break;
        }
      }
    });
  }

  onStepChange(event: any): void {
    const selectedIndex = event.selectedIndex;

    if (selectedIndex === 2 && !this.isCheckoutEnabled) {

      event.preventDefault();
      return;
    }

    this.activeStep = selectedIndex;
  }

  updateCheckoutStatus(status: boolean): void {
    this.isCheckoutEnabled = status;
  }
  navigateTo(page: string): void {
    this.router.navigate([page]);
  }
}