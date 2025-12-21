import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommercialLoanOperationsRoutingModule } from './commercial-loan-operations-routing.module';
//import { CommercialLoanReviewOperationsComponent } from 'app/credit/loan-management/commercial-loan-operations/commercial-loan-operations.component';

@NgModule({
  imports: [
    CommonModule,
    CommercialLoanOperationsRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CommercialLoanReviewOperationsComponent]
})
export class CommercialLoanOperationsModule { }
