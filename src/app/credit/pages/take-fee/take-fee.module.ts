import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TakeFeeRoutingModule } from './take-fee-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    TakeFeeRoutingModule,
    BankingSharedModule
  ],
  //declarations: [TakeFeeComponent]
})
export class TakeFeeModule { }
