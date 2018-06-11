import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RouterModule]
})
export class AppComponent {

  constructor(private authSvc: AuthService) {}


  signOut() {
    this.authSvc.signOut();
  }
}
