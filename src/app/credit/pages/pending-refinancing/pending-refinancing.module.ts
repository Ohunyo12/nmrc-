import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingRefinancingRoutingModule } from './pending-refinancing-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PendingRefinancingRoutingModule,
    BankingSharedModule
  ]
})
export class PendingRefinancingModule { }
