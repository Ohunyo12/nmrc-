import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalInterestRateChangeRoutingModule } from './global-interest-rate-change-routing.module';
//import { GlobalInterestRateChangeComponent } from 'app/credit/loan-management/global-interest-rate-change/global-interest-rate-change.component';

@NgModule({
  imports: [
    CommonModule,
    GlobalInterestRateChangeRoutingModule,
    BankingSharedModule
  ],
  //declarations: [GlobalInterestRateChangeComponent]
})
export class GlobalInterestRateChangeModule { }
