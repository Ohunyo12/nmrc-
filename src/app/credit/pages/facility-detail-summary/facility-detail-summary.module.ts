import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilityDetailSummaryRoutingModule } from './facility-detail-summary-routing.module';
import { FacilityDetailSummaryComponent } from 'app/credit/loans/facility-detail-summary/facility-detail-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FacilityDetailSummaryRoutingModule,
    BankingSharedModule
  ],
  //declarations: [FacilityDetailSummaryComponent]
})
export class FacilityDetailSummaryModule { }
