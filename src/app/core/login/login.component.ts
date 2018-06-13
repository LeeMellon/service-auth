import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private authservice: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogIn(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authservice.emailLogin(email, password);
    this.router.navigate(['']);
    // this.authservice.setUserToken();
  }
}
