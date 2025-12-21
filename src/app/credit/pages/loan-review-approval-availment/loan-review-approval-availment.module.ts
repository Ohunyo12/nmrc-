import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanReviewApprovalAvailmentRoutingModule } from './loan-review-approval-availment-routing.module';
import { LoanReviewAvailmentComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    LoanReviewApprovalAvailmentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanReviewAvailmentComponent]
})
export class LoanReviewApprovalAvailmentModule { }
