import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TchrWalletComponent} from './tchr-wallet/tchr-wallet.component';
import {UtilModule} from '../util/util.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UtilModule
  ],
  declarations: [TchrWalletComponent],
  exports: [TchrWalletComponent]
})
export class TchrModule {
}
