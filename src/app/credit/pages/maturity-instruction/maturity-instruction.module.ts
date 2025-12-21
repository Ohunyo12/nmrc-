import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaturityInstructionRoutingModule } from './maturity-instruction-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    MaturityInstructionRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class MaturityInstructionModule { }
