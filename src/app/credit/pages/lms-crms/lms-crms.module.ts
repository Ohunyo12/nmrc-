import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LmsCrmsRoutingModule } from './lms-crms-routing.module';
import { LMSCrmsRegulatoryComponent } from 'app/credit/loans/crms-regulatory/lms-crms-regulatory.component';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    LmsCrmsRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LMSCrmsRegulatoryComponent]
})
export class LmsCrmsModule { }
