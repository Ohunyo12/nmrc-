import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpRolloverRoutingModule } from './cp-rollover-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CpRolloverRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class CpRolloverModule { }
