import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanCrmsUpdateRoutingModule } from './loan-crms-update-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";
import { LoanCrmsUpdateComponent } from 'app/credit/loans/booking/loan-crms-update.component';

@NgModule({
  imports: [
    CommonModule,
    LoanCrmsUpdateRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanCrmsUpdateComponent]
})
export class LoanCrmsUpdateModule { }
