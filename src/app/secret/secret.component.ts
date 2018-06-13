import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.css']
})
export class SecretComponent implements OnInit {
secrets: any[];
  constructor(private authSvc: AuthService) { }

  ngOnInit() {
  }

  async getSecrets() {
   const secrets = await this.authSvc.getSecrets();
   secrets.get().then(doc => {
    this.secrets = doc.data();
    console.log(this.secrets);
   });
  }
}
