import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';


// login/auth
import { LoginComponent } from './core/login/login.component';
import { RegisterComponent } from './core/register/register.component';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.guard';
import { NotifyService } from './core/notify.service';
import { UserProfileComponent } from './user-profile/user-profile.component';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SecretComponent } from './secret/secret.component';
import { NotFoundComponent } from '../app/core/not-found/not-found.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    SecretComponent,
    NotFoundComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),

  ],
  providers: [AuthService, AuthGuard, NotifyService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
