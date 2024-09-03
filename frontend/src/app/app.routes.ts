import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { adminGuard, loginPageGuard, userGuard } from './auth.guard';
import { AdminRoleComponent } from './test-endpoints/admin-role/admin-role.component';
import { UserRoleComponent } from './test-endpoints/user-role/user-role.component';
import { NotFoundComponent } from './not-found/not-found.component';


export const routes: Routes = [
  // Public Routes
  // { path: '', loadComponent: () => <your-landing-page-component> },
  { path: 'login', loadComponent: () => LoginComponent, canActivate: [loginPageGuard] },
  { path: 'register', loadComponent: () => RegisterComponent, canActivate: [loginPageGuard] },

  // User Routes (protected by userGuard)
  {
    path: 'user',
    canActivate: [userGuard],
    children: [
      { path: 'test', loadComponent: () => UserRoleComponent },
    ]
  },

  // Admin Routes (protected by adminGuard)
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'test', component: AdminRoleComponent },
    ]
  },

  // Wildcard route for 404 page
  { path: '**', component: NotFoundComponent }
];
