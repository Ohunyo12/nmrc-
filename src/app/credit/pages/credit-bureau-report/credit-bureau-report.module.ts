import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditBureauReportRoutingModule } from './credit-bureau-report-routing.module';
import { CreditBureauSearchComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    CreditBureauReportRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class CreditBureauReportModule { }
