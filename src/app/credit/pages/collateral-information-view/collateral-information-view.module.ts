import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralInformationViewRoutingModule } from './collateral-information-view-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CollateralInformationViewRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class CollateralInformationViewModule { }
