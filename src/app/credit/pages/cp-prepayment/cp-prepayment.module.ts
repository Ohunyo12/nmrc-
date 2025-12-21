import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpPrepaymentRoutingModule } from './cp-prepayment-routing.module';
import { CPPrepaymentComponent } from 'app/credit/components';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    CpPrepaymentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CPPrepaymentComponent]
})
export class CpPrepaymentModule { }
