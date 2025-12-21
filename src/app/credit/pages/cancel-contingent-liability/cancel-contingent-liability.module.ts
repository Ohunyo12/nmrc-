import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CancelContingentLiabilityRoutingModule } from './cancel-contingent-liability-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    CancelContingentLiabilityRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CancelContingentLiabilityComponent]
})
export class CancelContingentLiabilityModule { }
