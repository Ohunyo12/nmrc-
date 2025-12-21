import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FxLoanPaymentRoutingModule } from './fx-loan-payment-routing.module';
import { FXRevolvingLoanPaymentComponent } from 'app/credit/loan-management/fx-loan-payment/fx-revolving-loan-payment.component';

@NgModule({
  imports: [
    CommonModule,
    FxLoanPaymentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [FXRevolvingLoanPaymentComponent]
})
export class FxLoanPaymentModule { }
