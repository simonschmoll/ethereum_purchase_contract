import { Component } from '@angular/core';
import { EthcontractService } from './ethcontract.service';

@Component({
  selector: 'app-root',
  template: `Balance: <span>{{balance}}</span>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public balance: string;

  constructor(es: EthcontractService) {
    es.getUserBalance().then(balance => this.balance = balance);
    console.log(this.balance);
    
  }
}
