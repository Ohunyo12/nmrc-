import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreliminaryEvaluationViewRoutingModule } from './preliminary-evaluation-view-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";
import { PreliminaryEvaluationViewComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    PreliminaryEvaluationViewRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class PreliminaryEvaluationViewModule { }
