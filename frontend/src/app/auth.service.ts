import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from "jwt-decode";
import { ApiService } from './api.service';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

interface DecodedToken {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private isBrowser: boolean;
  private router: Router = inject(Router);

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.token = localStorage.getItem('token');
    }
  }

  login(credentials: any): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>('Auth/login', credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  logout(): void {
    this.setToken(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.token;
  }

  private setToken(token: string | null): void {
    this.token = token;
    if (this.isBrowser) {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  register(user: any): Observable<any> {
    return this.apiService.post('Auth/register', user);
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return userRole === role;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
}
