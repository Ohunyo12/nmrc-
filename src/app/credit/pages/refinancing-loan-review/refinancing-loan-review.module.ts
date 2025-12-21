import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefinancingLoanReviewRoutingModule } from './refinancing-loan-review-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RefinancingLoanReviewRoutingModule,
    BankingSharedModule
  ]
})
export class RefinancingLoanReviewModule { }
