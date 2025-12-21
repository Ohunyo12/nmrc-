import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanTerminationRoutingModule } from './loan-termination-routing.module';
//import { LoanTerminationComponent } from 'app/credit/loan-management/loan-termination/loantermination.component';

@NgModule({
  imports: [
    CommonModule,
    LoanTerminationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanTerminationComponent]
})
export class LoanTerminationModule { }
