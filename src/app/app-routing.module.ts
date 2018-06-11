import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../app/core/login/login.component';
import { RegisterComponent } from '../app/core/register/register.component';
import { AppComponent } from './app.component';
import { SecretComponent } from './secret/secret.component';
import { NotFoundComponent } from '../app/core/not-found/not-found.component';
import { AuthGuard } from './core/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'secret/:id', canActivate: [AuthGuard], component: SecretComponent},
  {path: 'profile', canActivate: [AuthGuard], component: UserProfileComponent },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
