import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConditionChecklistRoutingModule } from './condition-checklist-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ConditionChecklistRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class ConditionChecklistModule { }
