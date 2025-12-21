import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmbRefinancedLoanApprovalRoutingModule } from './pmb-refinanced-loan-approval-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PmbRefinancedLoanApprovalRoutingModule,
    BankingSharedModule
  ]
})
export class PmbRefinancedLoanApprovalModule { }




