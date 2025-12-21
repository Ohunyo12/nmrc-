import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class ScheduleModule { }
