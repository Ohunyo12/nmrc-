import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnderwritingObligorRoutingModule } from './underwriting-obligor-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UnderwritingObligorRoutingModule,
    BankingSharedModule
  ]
})
export class UnderwritingObligorModule { }


