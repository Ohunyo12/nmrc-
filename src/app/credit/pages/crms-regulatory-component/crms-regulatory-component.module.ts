import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrmsRegulatoryComponentRoutingModule } from './crms-regulatory-component-routing.module';
import { CrmsRegulatoryComponent } from 'app/credit/loans/crms-regulatory/crms-regulatory.component';

@NgModule({
  imports: [
    CommonModule,
    CrmsRegulatoryComponentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CrmsRegulatoryComponent]
})
export class CrmsRegulatoryComponentModule { }
