import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralReleaseAwaitingJobRequestRoutingModule } from './collateral-release-awaiting-job-request-routing.module';
import { CollateralReleaseAwaitingJobRequestComponent } from 'app/credit/collateral/information/collateral-release-awaiting-job-request.component';

@NgModule({
  imports: [
    CommonModule,
    CollateralReleaseAwaitingJobRequestRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CollateralReleaseAwaitingJobRequestComponent]
})
export class CollateralReleaseAwaitingJobRequestModule { }
