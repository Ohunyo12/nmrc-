import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanAvailmentRoutingModule } from './loan-availment-routing.module';
//import { LoanAvailmentComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    LoanAvailmentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanAvailmentComponent]
})
export class LoanAvailmentModule { }
