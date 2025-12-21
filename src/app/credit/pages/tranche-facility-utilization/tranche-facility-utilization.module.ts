import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrancheFacilityUtilizationRoutingModule } from './tranche-facility-utilization-routing.module';
import { TrancheFacilityUtilizationComponent } from 'app/credit/loans/facility-details/tranche-facility-utilization.component';

@NgModule({
  imports: [
    CommonModule,
    TrancheFacilityUtilizationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [TrancheFacilityUtilizationComponent]
})
export class TrancheFacilityUtilizationModule { }