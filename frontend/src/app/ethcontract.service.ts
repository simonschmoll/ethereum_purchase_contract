import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';

declare let require: any;
declare let window: any;
let tokenAbi = require('../../../build/contracts/SalesContract.json');
@Injectable({
  providedIn: 'root'
})
export class EthcontractService {

  private _account: string = null;
  private _web3: any;

  private _tokenContract: any;
  private _tokenContractAddress: string = "0xbc84f3bf7dd607a37f9e5848a6333e6c188d926c";

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this._web3 = new Web3(window.web3.currentProvider);
      console.log("normal zweig");
      
    } else {
      this._web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      console.log("else zweig");
      
    }
    
   
    console.log(this._web3.eth.accounts)

    window.web3 = new Web3(this._web3);
    //this._tokenContract = TruffleContract(tokenAbi)
    // this._tokenContract = new this._web3.eth.Contract(tokenAbi, this._tokenContractAddress);
  }

  private async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        })
      }) as string;

      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async getUserBalance(): Promise<string> {

    let account = await this.getAccount();
    return await new Promise( async (resolve, reject)=> {
      let test =  await this._web3.eth.getBalance(account, function (error, result) {
        if(!error) {
          console.log(account, result.toNumber());
          return result.toString();
        }
      })
      console.log("This is test", test);
      
      resolve(test)
    }) as Promise<string>;
  }
}
