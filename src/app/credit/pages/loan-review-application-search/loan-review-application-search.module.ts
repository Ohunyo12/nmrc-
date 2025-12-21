import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanReviewApplicationSearchRoutingModule } from './loan-review-application-search-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    LoanReviewApplicationSearchRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanReviewApplicationSearchComponent]
})
export class LoanReviewApplicationSearchModule { }
