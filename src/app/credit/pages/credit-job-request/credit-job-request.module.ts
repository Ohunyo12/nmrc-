import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditJobRequestRoutingModule } from './credit-job-request-routing.module';
import { CreditJobRequestComponent } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    CreditJobRequestRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CreditJobRequestComponent]
})
export class CreditJobRequestModule { }
