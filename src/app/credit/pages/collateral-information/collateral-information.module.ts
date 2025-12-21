import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralInformationRoutingModule } from './collateral-information-routing.module';
import { CollateralInformationComponent } from 'app/credit/collateral';

@NgModule({
  imports: [
    CommonModule,
    CollateralInformationRoutingModule,
    BankingSharedModule
  ],
  declarations: []
})
export class CollateralInformationModule { }
