import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LenderRiskAssessmentRoutingModule } from './lender-risk-assessment-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LenderRiskAssessmentRoutingModule,
    BankingSharedModule
  ]
})
export class LenderRiskAssessmentModule { }
