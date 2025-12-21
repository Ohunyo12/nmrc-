import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkRateReviewRoutingModule } from './bulk-rate-review-routing.module';
//import { BulkRateReviewComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    BulkRateReviewRoutingModule,
    BankingSharedModule
  ],
  declarations: [
    //BulkRateReviewComponent
  ]
})
export class BulkRateReviewModule { }
