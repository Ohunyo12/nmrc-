import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BondsAndGuaranteeRoutingModule } from './bonds-and-guarantee-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    BondsAndGuaranteeRoutingModule,
    BankingSharedModule
  ],
  declarations: [
    //BondsAndGuaranteeComponent
  ]
})
export class BondsAndGuaranteeModule { }
