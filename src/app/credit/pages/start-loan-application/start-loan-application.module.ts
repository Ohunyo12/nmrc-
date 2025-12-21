import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartLoanApplicationRoutingModule } from './start-loan-application-routing.module';
import { StartLoanApplicationComponent } from 'app/credit/loans';
import { LoanService } from 'app/setup/services/loan.service';


@NgModule({
  imports: [
    CommonModule,
    StartLoanApplicationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [StartLoanApplicationComponent],
  providers: [LoanService]
})
export class StartLoanApplicationModule { }
