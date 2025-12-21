import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanReviewApprovalAppraisalRoutingModule } from './loan-review-approval-appraisal-routing.module';
import { LoanReviewAppraisalComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    LoanReviewApprovalAppraisalRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanReviewAppraisalComponent]
})
export class LoanReviewApprovalAppraisalModule { }
