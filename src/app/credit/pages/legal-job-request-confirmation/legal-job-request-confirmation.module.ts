import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalJobRequestConfirmationRoutingModule } from './legal-job-request-confirmation-routing.module';
import { LegalJobRequestConfirmation } from 'app/credit/components';

@NgModule({
  imports: [
    CommonModule,
    LegalJobRequestConfirmationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LegalJobRequestConfirmation]
})
export class LegalJobRequestConfirmationModule { }
