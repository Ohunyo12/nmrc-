import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullAndFinalStatusChangeRoutingModule } from './full-and-final-status-change-routing.module';
//import { FullAndFinalStatusChangeComponent } from 'app/credit/loan-management/full-and-final-status-change/full-and-final-status-change.component';

@NgModule({
  imports: [
    CommonModule,
    FullAndFinalStatusChangeRoutingModule,
    BankingSharedModule
  ],
  //declarations: [FullAndFinalStatusChangeComponent]
})
export class FullAndFinalStatusChangeModule { }
