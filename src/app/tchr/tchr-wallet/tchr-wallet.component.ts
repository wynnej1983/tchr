import {Component, OnInit} from '@angular/core';
import {Web3Service} from '../../util/web3.service';
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import tchrcoin_artifacts from '../../../../build/contracts/TchrCoin.json';

export interface Transaction {
  id: string;
  market: string;
  type: string;
  account: string;
  amount: Number;
  timestamp: string;
}

@Component({
  selector: 'app-tchr-wallet',
  templateUrl: './tchr-wallet.component.html',
  styleUrls: ['./tchr-wallet.component.css']
})
export class TchrWalletComponent implements OnInit {
  TchrCoin: any;
  private txCollection: AngularFirestoreCollection<Transaction>;
  transactions: Observable<Transaction[]>;

  model = {
    amount: 0,
    balanceEth: 0,
    balanceTchr: 0,
    privateKey: '',
    account: ''
  };

  status = '';

  constructor(private web3Service: Web3Service, private db: AngularFirestore) {
    this.txCollection = db.collection<Transaction>('transactions');
    this.transactions = this.txCollection.valueChanges();
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    console.log(this);
    this.web3Service.artifactsToContract(tchrcoin_artifacts)
      .then((TchrCoinAbstraction) => {
        this.TchrCoin = TchrCoinAbstraction;
      });
  }

  setStatus(status) {
    this.status = status;
  }

  async importPrivateKey() {
    if (!this.TchrCoin) {
      this.setStatus('TchrCoin is not loaded, unable to import private key');
      return;
    }
    const account = this.web3Service.privateKeyToAccount(this.model.privateKey);
    console.log('Account data: ' + JSON.stringify(account));
    this.model.account = account.address;
    this.refreshBalance();
  }

  async buyCoins() {
    if (!this.TchrCoin) {
      this.setStatus('TchrCoin is not loaded, unable to send transaction');
      return;
    }

    const amount = this.model.amount;

    console.log('Buying coins ' + amount);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedTchrCoin = await this.TchrCoin.deployed();
      const transaction = await deployedTchrCoin.buy.sendTransaction(amount, {from: this.model.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        console.log('Transaction: ' + transaction);
        this.txCollection.add({id: transaction, market: 'TCHR/ETH', type: 'BUY', account: this.model.account, amount, timestamp: (new Date().toISOString())});
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error buying coins; see log.');
    }
    this.refreshBalance();
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
      const deployedTchrCoin = await this.TchrCoin.deployed();
      const ethCoinBalance = await deployedTchrCoin.balanceOfEth.call(this.model.account);
      const tchrCoinBalance = await deployedTchrCoin.balanceOf.call(this.model.account);
      console.log('Found ETH balance: ' + ethCoinBalance);
      console.log('Found TCHR balance: ' + tchrCoinBalance);
      this.model.balanceEth = ethCoinBalance;
      this.model.balanceTchr = tchrCoinBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setPrivateKey(e) {
    console.log('Setting private key: ' + e.target.value);
    this.model.privateKey = '0x' + e.target.value;
  }

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }
}
