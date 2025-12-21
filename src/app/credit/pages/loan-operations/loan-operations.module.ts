import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanOperationsRoutingModule } from './loan-operations-routing.module';
import { LoanOperationsComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    LoanOperationsRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanOperationsComponent]
})
export class LoanOperationsModule { }
