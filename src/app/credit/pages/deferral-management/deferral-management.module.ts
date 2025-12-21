import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeferralManagementRoutingModule } from './deferral-management-routing.module';
import { DefferalManagementComponent } from 'app/credit/loans/defferal-management/defferal-management.component';

@NgModule({
  imports: [
    CommonModule,
    DeferralManagementRoutingModule,
    BankingSharedModule
  ],
  //declarations: [DefferalManagementComponent]
})
export class DeferralManagementModule { }
