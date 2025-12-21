import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilityDetailsRoutingModule } from './facility-details-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FacilityDetailsRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class FacilityDetailsModule { }
