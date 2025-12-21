import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpInterestRateReviewRoutingModule } from './cp-interest-rate-review-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CpInterestRateReviewRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class CpInterestRateReviewModule { }
