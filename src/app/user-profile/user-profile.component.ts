import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { ProfileUser } from '../core/profileuser.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) { }
  user: ProfileUser;
  ngOnInit() {
    this.auth.user.subscribe(data => {
      this.user = data;
      });
  }
  logOut() {
    this.auth.signOut();
  }
  toSecret() {
  this.router.navigate(['/secret', this.user.uid]);
  // this.auth.WRITE_METHOD_TO_LOG_ACCESS
  }

  submit() {
  const updateUser: ProfileUser = {
    uid: this.user.uid,
    email: this.user.email,
    imgURL: this.user.imgURL,
    userName: this.user.userName,
    securityLvl: this.user.securityLvl
  };
  this.auth.update(updateUser);
  }

}
