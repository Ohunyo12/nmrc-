import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlaMonitoringRoutingModule } from './sla-monitoring-routing.module';
import { SlaMonitoringComponent } from 'app/credit/sla/sla-monitoring.component';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SlaMonitoringRoutingModule,
    BankingSharedModule
  ],
  //declarations: [SlaMonitoringComponent]
})
export class SlaMonitoringModule { }
