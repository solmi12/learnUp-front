import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthServiceService } from 'src/app/services/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import type { AuthResponse } from 'src/app/models/AuthResponse';
import type { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(JwtHelperService) private jwtHelper: JwtHelperService,
    @Inject(Router) private route: Router,
    private loginService: AuthServiceService,
    @Inject(ToastrService) private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.loginService.login(email, password).subscribe(
        (response: AuthResponse) => {
          const token = response.token;
          const id = response.id;
          const decodedToken = this.jwtHelper.decodeToken(token);
          this.loginService.updateAuthState(true, decodedToken.role, decodedToken.sub);
          localStorage.setItem('token', token);
          localStorage.setItem('userId', id.toString());

          // Navigate based on the user's role
          if (decodedToken.role === 'APPRENANT') {
            this.route.navigate(["Dashbord-Apprenant"]);
          } else if (decodedToken.role === 'ADMIN') {
            this.route.navigate(["/dashboard"]);
          } else if (decodedToken.role === 'FORMATEUR') {
         
            this.route.navigate(["/Dashbord-Formateur"]);
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.toastr.error('Invalid credentials. Please check your email and password.');
          } else if (error.status === 409) {
            this.toastr.error('Account already exists.');
          } else {
            this.toastr.error('An unknown error occurred. Please try again later.');
          }
        }
      );
    }
  }
}
