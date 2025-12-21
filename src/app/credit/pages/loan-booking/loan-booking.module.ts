import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanBookingRoutingModule } from './loan-booking-routing.module';
//import { LoanBookingComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    LoanBookingRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanBookingComponent]
})
export class LoanBookingModule { }
