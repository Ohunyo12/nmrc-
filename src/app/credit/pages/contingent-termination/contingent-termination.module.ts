import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContingentTerminationRoutingModule } from './contingent-termination-routing.module';
//import { ContingentTerminationComponent } from 'app/credit/loan-management/contingent-termination/contingent-termination.component';

@NgModule({
  imports: [
    CommonModule,
    ContingentTerminationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [ContingentTerminationComponent]
})
export class ContingentTerminationModule { }
