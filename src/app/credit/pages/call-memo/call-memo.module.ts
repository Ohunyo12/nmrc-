import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallMemoRoutingModule } from './call-memo-routing.module';
//import { CallMemoComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    CallMemoRoutingModule,
    BankingSharedModule
  ],
  declarations: [
   // CallMemoComponent
  ]
})
export class CallMemoModule { }
