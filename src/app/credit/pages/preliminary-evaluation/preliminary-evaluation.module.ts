import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreliminaryEvaluationRoutingModule } from './preliminary-evaluation-routing.module';
import { PreliminaryEvaluationComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    PreliminaryEvaluationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [PreliminaryEvaluationComponent]
})
export class PreliminaryEvaluationModule { }
