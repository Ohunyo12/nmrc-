import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanPerformanceRoutingModule } from './loan-performance-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";
import { LoanPerformanceComponent } from 'app/credit/loan-management/loan-performance/loan-performance.component';

@NgModule({
  imports: [
    CommonModule,
    LoanPerformanceRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanPerformanceComponent]
})
export class LoanPerformanceModule { }
