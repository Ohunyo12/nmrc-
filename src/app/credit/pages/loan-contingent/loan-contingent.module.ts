import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanContingentRoutingModule } from './loan-contingent-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";
import { ContingentFacilityReleaseComponent } from 'app/credit/loans/booking/contingent-release.component';

@NgModule({
  imports: [
    CommonModule,
    LoanContingentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [ContingentFacilityReleaseComponent]
})
export class LoanContingentModule { }
