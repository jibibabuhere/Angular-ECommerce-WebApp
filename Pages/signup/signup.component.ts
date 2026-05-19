import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  successMessage: string = '';

  constructor(private router: Router, private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        this.emailExistsValidator.bind(this)
      ]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      username: ['', [Validators.required, Validators.minLength(3), this.usernameExistsValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      consent: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.length === 0) {
      const sampleUser = {
        id: 1,
        username: 'user',
        password: 'password',
        firstName: 'Sample',
        lastName: 'User',
        email: 'sampleuser@example.com',
        mobile: '1234567890'
      };
      users.push(sampleUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Sample user added to localStorage');
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
      const newUser = { ...this.signupForm.value, id: newUserId };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      console.log('User data saved:', newUser);
      this.successMessage = 'You have successfully signed up';
      this.signupForm.reset();
    } else {
      console.log('Form is not valid');
    }
  }


  emailExistsValidator(control: AbstractControl) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = users.some((user: any) => user.email === control.value);

    return emailExists ? { emailExists: true } : null;
  }

  usernameExistsValidator(control: AbstractControl) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const usernameExists = users.some((user: any) => user.username === control.value);

    return usernameExists ? { usernameExists: true } : null;
  }
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { mismatch: true }
      : null;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get mobile() { return this.signupForm.get('mobile'); }
  get username() { return this.signupForm.get('username'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

}

