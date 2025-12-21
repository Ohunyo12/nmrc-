import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRouteRoutingModule } from './operation-route-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    OperationRouteRoutingModule,
    BankingSharedModule
  ],
  //declarations: [OperationRouteComponent]
})
export class OperationRouteModule { }
