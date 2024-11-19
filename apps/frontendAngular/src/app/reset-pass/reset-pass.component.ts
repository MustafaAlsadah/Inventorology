import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-reset-pass',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, InputOtpModule],
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css',
})
export class ResetPassComponent {
  email = '';
  otp = '';
  newPassword = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.email = params['email'];
    });
  }

  onSubmit() {
    if (!this.otp || !this.newPassword) {
      alert('Please enter OTP and new password');
      return;
    }

    this.http
      .patch(
        'https://backend-pu7ouxweoa-wx.a.run.app/api/auth/password-reset',
        {
          email: this.email,
          new_password: this.newPassword,
          entered_otp: this.otp,
        }
      )
      .subscribe({
        next: () => {
          alert('Password reset successful!');
          this.router.navigate(['/auth']);
        },
        error: (error) => {
          alert('Password reset failed: ' + error.error.message);
        },
      });
  }
}
