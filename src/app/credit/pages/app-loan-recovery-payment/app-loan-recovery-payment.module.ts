import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppLoanRecoveryPaymentRoutingModule } from './app-loan-recovery-payment-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    AppLoanRecoveryPaymentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanRecoveryPaymentComponent]
})
export class AppLoanRecoveryPaymentModule { }
