import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  activeTab: 'login' | 'signup' = 'login';
  errorMessage = '';
  loading = false;
  /** Prevents browser autofill; cleared on first focus */
  loginEmailReadonly = true;
  loginPasswordReadonly = true;
  showLoginPassword = false;
  showSignupPassword = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberDevice: [false],
  });

  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    workspaceName: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    inviteCode: [''],
  });

  constructor() {
    if (this.router.url.includes('register')) this.activeTab = 'signup';
    this.route.queryParams.subscribe((params) => {
      const tab = params['tab'];
      if (tab === 'signup') this.activeTab = 'signup';
      else if (tab === 'login') this.activeTab = 'login';
    });
  }

  get loginTitle(): string {
    return this.activeTab === 'login' ? 'Welcome back' : 'Start your engine';
  }

  get loginSubtitle(): string {
    return this.activeTab === 'login'
      ? 'Access your Command Center'
      : 'Join 3,400+ founders automating growth';
  }

  setTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    if (tab === 'login') {
      this.loginEmailReadonly = true;
      this.loginPasswordReadonly = true;
    }
  }

  onLoginEmailFocus(): void {
    this.loginEmailReadonly = false;
  }

  onLoginPasswordFocus(): void {
    this.loginPasswordReadonly = false;
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleSignupPasswordVisibility(): void {
    this.showSignupPassword = !this.showSignupPassword;
  }

  onSubmitLogin(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.loading = true;
    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.ok) this.router.navigate(['/dashboard']);
        else this.errorMessage = res.message;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Something went wrong. Please try again.';
      },
    });
  }

  onSubmitSignup(): void {
    this.errorMessage = '';
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const raw = this.signupForm.getRawValue();
    const displayName = [raw.firstName, raw.lastName].filter(Boolean).join(' ') || raw.email;
    this.loading = true;
    this.auth
      .register({
        email: raw.email,
        password: raw.password,
        displayName,
      })
    .subscribe({
      next: (res) => {
        this.loading = false;
        if (res.ok) this.router.navigate(['/dashboard']);
        else this.errorMessage = res.message;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Something went wrong. Please try again.';
      },
    });
  }
}
