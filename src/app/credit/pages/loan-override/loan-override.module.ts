import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanOverrideRoutingModule } from './loan-override-routing.module';
import { OverrideComponent } from 'app/credit/components';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    LoanOverrideRoutingModule,
    BankingSharedModule
  ],
  //declarations: [OverrideComponent]
})
export class LoanOverrideModule { }
