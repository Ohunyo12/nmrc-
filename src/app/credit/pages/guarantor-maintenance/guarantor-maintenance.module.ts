import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuarantorMaintenanceRoutingModule } from './guarantor-maintenance-routing.module';
import { GuarantorMaintenanceComponent } from 'app/credit/loans';
import { BankingSharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    GuarantorMaintenanceRoutingModule,
    BankingSharedModule
  ],
  //declarations: [GuarantorMaintenanceComponent]
})
export class GuarantorMaintenanceModule { }
