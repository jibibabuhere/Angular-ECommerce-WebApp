import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})

export class AccountComponent implements OnInit {
  loggedInUser: any = {};
  showTooltip: boolean = false;
  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService
  ) { }
  ngOnInit(): void {

    const user = localStorage.getItem('loggedInUser');
    this.loggedInUser = user
      ? JSON.parse(user)
      : { firstName: 'Guest', lastName: '' };

  }
  isUserLoggedIn(): boolean {
    return (
      this.loggedInUser &&
      this.loggedInUser.email &&
      this.loggedInUser.id !== null &&
      this.loggedInUser.firstName
    );
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
      username: '',
      userLoginStatus: false,
    };

    localStorage.setItem('loggedInUser', JSON.stringify(clearedUser));
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTooltip(): void {
    if (this.isUserLoggedIn()) {
      this.showTooltip = !this.showTooltip;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
