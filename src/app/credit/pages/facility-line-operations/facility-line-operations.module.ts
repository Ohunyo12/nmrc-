import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilityLineOperationsRoutingModule } from './facility-line-operations-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FacilityLineOperationsRoutingModule,
    BankingSharedModule
  ],
  //declarations: [FacilityLineReviewOperationsComponent]
})
export class FacilityLineOperationsModule { }
