import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
        <h3>Advocates Diary</h3>
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email" 
            type="email" 
            formControlName="email"
            class="form-control">
        </div>
        <div class="form-group">
      <label for="password">Password</label>
      <div class="password-container">
        <input [type]="showPassword ? 'text' : 'password'"  id="password"
            formControlName="password"
            class="form-control">
            <i class="bi bi-eye-fill" (click)="togglePasswordVisibility()"></i>
      </div>
    </div>
        <button type="submit">Login</button>
        <button type="button" (click)="onSignUp()">Sign Up</button>
        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1rem;
    }
    .login-form {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-top: 0.25rem;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    button:disabled {
      background: #ccc;
    }
    .error-message {
      color: red;
      margin-top: 1rem;
      text-align: center;
    }
    .password-container {
  display: flex;
  align-items: center;
  }

  .password-container button {
    margin-left: 0.5rem;
    padding: 0.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  showPassword: boolean = false; // Property to track password visibility

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: () => this.router.navigate(['/home']),
        error: () => (this.error = 'Invalid credentials'),
      });
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignUp() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.signUp(email, password).subscribe({
        next: () => {
          this.error = 'Account created successfully. Please log in.';
          this.loginForm.reset();
        },
        error: (err) => {
          this.error = 'Sign up failed. ' + err.message;
        },
      });
    }
  }
}
