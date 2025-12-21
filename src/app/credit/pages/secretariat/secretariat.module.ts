import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecretariatRoutingModule } from './secretariat-routing.module';
import { SecretariatComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    SecretariatRoutingModule,
    BankingSharedModule
  ],
  //declarations: [SecretariatComponent]
})
export class SecretariatModule { }
