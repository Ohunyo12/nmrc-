import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationSearchRoutingModule } from './application-search-routing.module';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ApplicationSearchRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanApplicationSearchComponent]
})
export class ApplicationSearchModule { }
