import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReassignAccountRoutingModule } from './reassign-account-routing.module';
import { ReassignAccountComponent } from 'app/credit/loan-management/reassignaccount/reassignaccount.component';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    ReassignAccountRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class ReassignAccountModule { }
