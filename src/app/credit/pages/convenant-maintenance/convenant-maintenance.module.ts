import { ConvenantMaintenanceComponent } from './../../loans/loan-maintenance/convenant-maintenance.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvenantMaintenanceRoutingModule } from './convenant-maintenance-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ConvenantMaintenanceRoutingModule,
    BankingSharedModule
  ],
  //declarations: [ConvenantMaintenanceComponent,]
})
export class ConvenantMaintenanceModule { }
