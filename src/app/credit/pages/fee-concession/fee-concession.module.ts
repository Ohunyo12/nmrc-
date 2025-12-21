import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeConcessionRoutingModule } from './fee-concession-routing.module';
import { LoanFeeConcessionComponent } from 'app/credit/loans/loan-fee-concession/loan-fee-concession.component';

@NgModule({
  imports: [
    CommonModule,
    FeeConcessionRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanFeeConcessionComponent]
})
export class FeeConcessionModule { }
