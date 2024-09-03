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
  selector: 'app-admin-role',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (adminData) {
      <div>
        <h2>Admin Information</h2>
        <p><strong>ID:</strong> {{ adminData.id }}</p>
        <p><strong>Username:</strong> {{ adminData.userName }}</p>
        <p><strong>Email:</strong> {{ adminData.email }}</p>
        <p><strong>First Name:</strong> {{ adminData.firstName }}</p>
        <p><strong>Last Name:</strong> {{ adminData.lastName }}</p>
        <p><strong>Roles:</strong> {{ adminData.roles.join(', ') }}</p>
        <p><strong>Message:</strong> {{ adminData.message }}</p>
      </div>
    } @else if (error) {
      <p>Error: {{ error }}</p>
    } @else {
      <p>Loading admin data...</p>
    }
  `
})
export class AdminRoleComponent implements OnInit {
  adminData: SwaggerUserDto | null = null;
  error: string | null = null;
  private apiService: ApiService = inject(ApiService);

  ngOnInit() {
    this.fetchAdminData();
  }

  fetchAdminData() {
    this.apiService.get<SwaggerUserDto>('SwaggerAdmin').subscribe({
      next: (data) => {
        this.adminData = data;
      },
      error: (err) => {
        this.error = 'Failed to fetch admin data. Please ensure you have the "Admin" role.';
        console.error('Error fetching admin data:', err);
      }
    });
  }
}
