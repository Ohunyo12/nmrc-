import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanApplicationDetailsRoutingModule } from './loan-application-details-routing.module';
import { LoanApplicationDetailsComponent } from 'app/credit/loans/application/loan-application-details.component';

@NgModule({
  imports: [
    CommonModule,
    LoanApplicationDetailsRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanApplicationDetailsComponent]
})
export class LoanApplicationDetailsModule { }
