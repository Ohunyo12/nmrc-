import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContingentUsageListRoutingModule } from './contingent-usage-list-routing.module';
import { ContingentUsageListComponent } from 'app/credit/loans/contingent-usage/contingent-usage-list.component';

@NgModule({
  imports: [
    CommonModule,
    ContingentUsageListRoutingModule,
    BankingSharedModule
  ],
  //declarations: [ContingentUsageListComponent]
})
export class ContingentUsageListModule { }
