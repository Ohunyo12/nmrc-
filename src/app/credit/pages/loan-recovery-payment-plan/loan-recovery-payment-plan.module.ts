import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanRecoveryPaymentPlanRoutingModule } from './loan-recovery-payment-plan-routing.module';
import { LoanRecoveryPaymentPlanComponent } from 'app/credit/loan-management/loanrecovery-paymentplan/loanrecoverypaymentplan.component';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    LoanRecoveryPaymentPlanRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanRecoveryPaymentPlanComponent]
})
export class LoanRecoveryPaymentPlanModule { }
