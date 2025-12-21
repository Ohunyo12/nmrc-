import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanReviewApprovalApplicationRoutingModule } from './loan-review-approval-application-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";
import { LoanReviewApplicationComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    LoanReviewApprovalApplicationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanReviewApplicationComponent]
})
export class LoanReviewApprovalApplicationModule { }
