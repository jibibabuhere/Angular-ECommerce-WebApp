import { Component, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { StepperComponent } from "./stepper/stepper.component";
import { Router, NavigationEnd, ActivatedRoute, NavigationStart } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from "./Components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, StepperComponent, MatStepperModule, NgIf, MatIconModule, MatButtonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ecommerceApp';
  showStepper: boolean = true;

  @ViewChild(StepperComponent) stepper!: StepperComponent;
  constructor(public router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      const currentRoute = this.activatedRoute.snapshot.firstChild?.url[0]?.path;
      this.showStepper = !['cart', 'error', 'login', 'signup'].includes(currentRoute || '');
      if (event instanceof NavigationStart) {
        const currentPath = event.url.split('/')[1];
        const restrictedPages = ['thankyou', 'address', 'review'];
        if (restrictedPages.includes(currentPath) && this.isDirectNavigation()) {
          // this.router.navigate(['/error']);
        }

        const noStepperRoutes = ['cart', 'error', 'login', 'signup'];
        this.showStepper = !noStepperRoutes.includes(currentPath);
      }

    });
  }

  private isDirectNavigation(): boolean {
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return navEntries.length === 0 || navEntries.every((nav) => nav.type !== 'navigate');
  }


  updateCheckoutStatus(status: boolean): void {
    if (this.stepper) {
      this.stepper.updateCheckoutStatus(status);
    }
  }


}

