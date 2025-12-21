import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanApplicationListRoutingModule } from './loan-application-list-routing.module';
import { LoanApplicationsListComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    LoanApplicationListRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanApplicationsListComponent]
})
export class LoanApplicationListModule { }
