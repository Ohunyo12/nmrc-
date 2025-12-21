import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanRefinancingRoutingModule } from './loan-refinancing-routing.module';
import { BankingSharedModule } from 'app/shared/shared.module';
import { LoanRefinancingComponent } from 'app/credit/loans/loan-refinancing/loan-refinancing.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoanRefinancingRoutingModule,
    BankingSharedModule
  ]
})
export class LoanRefinancingModule { }



