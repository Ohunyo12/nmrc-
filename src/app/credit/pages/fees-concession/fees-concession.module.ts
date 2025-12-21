import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeesConcessionRoutingModule } from './fees-concession-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FeesConcessionRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class FeesConcessionModule { }
