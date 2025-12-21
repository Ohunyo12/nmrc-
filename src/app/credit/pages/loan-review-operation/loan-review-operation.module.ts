import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanReviewOperationRoutingModule } from './loan-review-operation-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    LoanReviewOperationRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class LoanReviewOperationModule { }
