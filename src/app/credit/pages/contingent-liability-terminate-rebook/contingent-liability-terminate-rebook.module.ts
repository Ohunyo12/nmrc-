import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContingentLiabilityTerminateRebookRoutingModule } from './contingent-liability-terminate-rebook-routing.module';
//import { ContingentLiabilityTreminateRebookComponent } from 'app/credit/loan-management/contingent-liability-terminate-rebook/contingent-liability-terminate-rebook.component';

@NgModule({
  imports: [
    CommonModule,
    ContingentLiabilityTerminateRebookRoutingModule,
    BankingSharedModule
  ],
  //declarations: [ContingentLiabilityTreminateRebookComponent]
})
export class ContingentLiabilityTerminateRebookModule { }
