import { Component } from '@angular/core';
import { AccountComponent } from "../account/account.component";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AccountComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  currentPage: string = 'Your Basket';
  constructor(private router: Router) { }
  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateCurrentPage(this.router.url);
      }
    });
    this.updateCurrentPage(this.router.url);
  }
  private updateCurrentPage(url: string): void {
    if (url.includes('cart')) {
      this.currentPage = 'Your Cart';
    } else if (url.includes('address')) {
      this.currentPage = 'Your Address';
    } else if (url.includes('review')) {
      this.currentPage = 'Your Review';
    } else if (url.includes('thankyou')) {
      this.currentPage = 'Your Thank you';
    } else {
      this.currentPage = 'Your Basket';
    }
  }
}
