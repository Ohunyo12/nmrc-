import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanCamsolRoutingModule } from './loan-camsol-routing.module';
import { LoanCamsolComponent } from 'app/credit/loan-management/loan-camsol/loan-camsol.component';

@NgModule({
  imports: [
    CommonModule,
    LoanCamsolRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanCamsolComponent]
})
export class LoanCamsolModule { }
