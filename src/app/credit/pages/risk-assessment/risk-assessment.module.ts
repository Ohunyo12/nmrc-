import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskAssessmentRoutingModule } from './risk-assessment-routing.module';
import { RiskAssessmentComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    RiskAssessmentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [RiskAssessmentComponent]
})
export class RiskAssessmentModule { }
