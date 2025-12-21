import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChecklistSimulationRoutingModule } from './checklist-simulation-routing.module';
//import { ChecklistItemSimulationComponent } from 'app/credit/loans/checklist-item-simulation/checklist-item-simulation.component';

@NgModule({
  imports: [
    CommonModule,
    ChecklistSimulationRoutingModule,
    BankingSharedModule
  ],
  declarations: [
    // ChecklistItemSimulationComponent
  ]
})
export class ChecklistSimulationModule { }
