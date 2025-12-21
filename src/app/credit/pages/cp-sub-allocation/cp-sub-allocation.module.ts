import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CpSubAllocationRoutingModule } from './cp-sub-allocation-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    CpSubAllocationRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class CpSubAllocationModule { }
