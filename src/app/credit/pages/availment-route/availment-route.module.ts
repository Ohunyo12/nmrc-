import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvailmentRouteRoutingModule } from './availment-route-routing.module';
//import { AvailmentRouteComponent } from 'app/credit/routes/availment-route.component';

@NgModule({
  imports: [
    CommonModule,
    AvailmentRouteRoutingModule,
    BankingSharedModule
  ],
  declarations: [
    //AvailmentRouteComponent
  ]
})
export class AvailmentRouteModule { }
