import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanCollateralInfomationRoutingModule } from './loan-collateral-infomation-routing.module';
import { LoanApplicationCollateralInformationComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    LoanCollateralInfomationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanApplicationCollateralInformationComponent]
})
export class LoanCollateralInfomationModule { }
