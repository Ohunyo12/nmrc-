import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanRestructuringRoutingModule } from './loan-restructuring-routing.module';
import { LoanRestructuringComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    LoanRestructuringRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanRestructuringComponent]
})
export class LoanRestructuringModule { }
