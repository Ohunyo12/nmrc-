import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanFeeAdjustmentRoutingModule } from './loan-fee-adjustment-routing.module';
import { LoanFeeAdjustmentComponent } from 'app/credit/loan-management/loan-fee-adjustment/loan-fee-adjustment.component';

@NgModule({
  imports: [
    CommonModule,
    LoanFeeAdjustmentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanFeeAdjustmentComponent]
})
export class LoanFeeAdjustmentModule { }
