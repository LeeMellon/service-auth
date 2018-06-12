import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [RouterModule]
})
export class AppComponent implements OnInit {

  constructor(private authSvc: AuthService) {}
  loggedIn;
  isUser: boolean;

  ngOnInit() {
    console.log('1st  ' + this.isUser);
    this.authSvc.user.subscribe(data =>
    // this.loggedIn = data);
    console.log(data));
    this.userCheck();
    console.log('2nd  ' + this.isUser);

   }

   userCheck() {
  if (this.loggedIn !== null) {
    this.isUser = true;
  }
}
}
