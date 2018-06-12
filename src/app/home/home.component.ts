import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private authSvc: AuthService) { }

  ngOnInit() {

  }

  signOut() {
    this.authSvc.signOut();
  }
}
