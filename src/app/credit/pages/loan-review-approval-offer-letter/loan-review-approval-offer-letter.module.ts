import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanReviewApprovalOfferLetterRoutingModule } from './loan-review-approval-offer-letter-routing.module';
import { LoanReviewOfferLetterComponent } from 'app/credit/components';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    LoanReviewApprovalOfferLetterRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanReviewOfferLetterComponent]
})
export class LoanReviewApprovalOfferLetterModule { }
