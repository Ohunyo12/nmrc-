import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitiateBookingRoutingModule } from './initiate-booking-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    InitiateBookingRoutingModule,
    BankingSharedModule
  ],
  //declarations: [InitiateLoanBookingComponent]
})
export class InitiateBookingModule { }
