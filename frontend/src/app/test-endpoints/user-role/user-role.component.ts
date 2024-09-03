import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';

interface SwaggerUserDto {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  message: string;
}

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [],
  template: `
    @if (userData) {
      <div>
        <h2>User Information</h2>
        <p><strong>ID:</strong> {{ userData.id }}</p>
        <p><strong>Username:</strong> {{ userData.userName }}</p>
        <p><strong>Email:</strong> {{ userData.email }}</p>
        <p><strong>First Name:</strong> {{ userData.firstName }}</p>
        <p><strong>Last Name:</strong> {{ userData.lastName }}</p>
        <p><strong>Roles:</strong> {{ userData.roles.join(', ') }}</p>
        <p><strong>Message:</strong> {{ userData.message }}</p>
      </div>
    } @else if (error) {
      <p>Error: {{ error }}</p>
    } @else {
      <p>Loading user data...</p>
    }
  `
})
export class UserRoleComponent implements OnInit {
  userData: SwaggerUserDto | null = null;
  error: string | null = null;
  private apiService: ApiService = inject(ApiService);

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    this.apiService.get<SwaggerUserDto>('SwaggerUser').subscribe({
      next: (data:any) => {
        this.userData = data;
      },
      error: (err:any) => {
        this.error = 'Failed to fetch user data. Please ensure you have the "User" role.';
        console.error('Error fetching user data:', err);
      }
    });
  }
}
