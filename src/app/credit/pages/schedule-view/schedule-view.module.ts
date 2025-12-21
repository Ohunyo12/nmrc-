import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleViewRoutingModule } from './schedule-view-routing.module';
import { ScheduleViewComponent } from 'app/credit/loans';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ScheduleViewRoutingModule,
    BankingSharedModule
  ],
  //declarations: [ScheduleViewComponent]
})
export class ScheduleViewModule { }
