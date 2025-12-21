import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacilityJobRequestRoutingModule } from './facility-job-request-routing.module';
import { FacilityJobRequestComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    FacilityJobRequestRoutingModule,
    BankingSharedModule
  ],
  //declarations: [FacilityJobRequestComponent]
})
export class FacilityJobRequestModule { }
