import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanPrepaymentRoutingModule } from './loan-prepayment-routing.module';
//import { LoanPrepaymentComponent } from 'app/credit/loan-management/loan-prepayment/loanprepayment.component';

@NgModule({
  imports: [
    CommonModule,
    LoanPrepaymentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanPrepaymentComponent]
})
export class LoanPrepaymentModule { }
