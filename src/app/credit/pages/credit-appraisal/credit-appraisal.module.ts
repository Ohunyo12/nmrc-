import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditAppraisalRoutingModule } from './credit-appraisal-routing.module';
import { CreditAppraisalComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    CreditAppraisalRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CreditAppraisalComponent]
})
export class CreditAppraisalModule { }
