import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContingentOperationsRoutingModule } from './contingent-operations-routing.module';
//import { ContingentOpreationComponent } from 'app/credit/loan-management/contingent-operations/contingent-operations.component';

@NgModule({
  imports: [
    CommonModule,
    ContingentOperationsRoutingModule,
    BankingSharedModule
  ],
  //declarations: [ContingentOpreationComponent]
})
export class ContingentOperationsModule { }
