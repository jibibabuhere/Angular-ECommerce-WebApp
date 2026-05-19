import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm: FormGroup;
  isPasswordVisible = false;
  errorMessage = '';

  constructor(private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      emailOrUsername: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?:[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|[a-zA-Z0-9]{4,})$/
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();

    const { emailOrUsername, password } = this.loginForm.value;
    if (!emailOrUsername || !password) {
      this.errorMessage = 'Please fill the form fields';
      return;
    }
    if (this.loginForm.get('emailOrUsername')?.invalid || this.loginForm.get('password')?.invalid) {
      this.errorMessage = 'Invalid login credentials';
      return;
    }
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const matchingUser = users.find(
      (user: any) =>
        (user.email === emailOrUsername || user.username === emailOrUsername) &&
        user.password === password
    );

    if (matchingUser) {
      const loggedInUser = {
        ...matchingUser,
        confirmPassword: undefined,
        userLoginStatus: true,
        password: undefined
      };

      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      console.log('Login successful', loggedInUser);
      this.errorMessage = '';
      this.router.navigate(['/cart']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}


