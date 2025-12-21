import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanRecoveryRepaymentApprovalRoutingModule } from './loan-recovery-repayment-approval-routing.module';
//import { LoanRecoveryRepaymentApprovalComponent } from 'app/credit/loan-management/loan-recovery-repayment-approval/loan-recovery-repayment-approval.component';

@NgModule({
  imports: [
    CommonModule,
    LoanRecoveryRepaymentApprovalRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanRecoveryRepaymentApprovalComponent]
})
export class LoanRecoveryRepaymentApprovalModule { }
