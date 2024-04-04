import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import type { AuthResponse } from '../models/AuthResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private userEmailSubject = new BehaviorSubject<string | null>(null);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  userRole$: Observable<string | null> = this.userRoleSubject.asObservable();
  userEmail$: Observable<string | null> = this.userEmailSubject.asObservable();
  
  private loginUrl = 'http://localhost:8080/auth/login'; 
  
  constructor(@Inject(JwtHelperService)private jwtHelper: JwtHelperService,private http: HttpClient,@Inject(Router)private router:Router) {}

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<AuthResponse>(this.loginUrl, body);
  }

  hasRole(requiredRole: string): boolean {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const role = this.jwtHelper.decodeToken(token).role;
      return role === requiredRole;
    }
    return false;
  }

  getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return this.jwtHelper.decodeToken(token).sub;
    }
    return null;
  }
  logout(): void {
    localStorage.clear();
    this.updateAuthState(false,null,null)  

    this.router.navigate(['/login']);
  }
  updateAuthState(loggedIn: boolean, role: string | null, email: string | null): void {
    this.isLoggedInSubject.next(loggedIn);
    this.userRoleSubject.next(role);
    this.userEmailSubject.next(email);
  }
  initAuthState(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const role = this.jwtHelper.decodeToken(token).role;
      this.isLoggedInSubject.next(true);
      this.userRoleSubject.next(role);
    }
    return Promise.resolve();
  }
  
}
