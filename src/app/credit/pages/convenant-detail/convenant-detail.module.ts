import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConvenantDetailRoutingModule } from './convenant-detail-routing.module';
import { CovenantDetailComponent } from 'app/credit/components';
//import { UISharedModule } from 'app/shared/ui-shared-module';

@NgModule({
  imports: [
    CommonModule,
    ConvenantDetailRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CovenantDetailComponent]
})
export class ConvenantDetailModule { }
