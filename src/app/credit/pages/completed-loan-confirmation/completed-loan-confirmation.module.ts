import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompletedLoanConfirmationRoutingModule } from './completed-loan-confirmation-routing.module';
import { CompletedLoanConfirmationComponent } from 'app/credit/loans/completed-loan-confirmation/completed-loan-confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    CompletedLoanConfirmationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CompletedLoanConfirmationComponent]
})
export class CompletedLoanConfirmationModule { }
