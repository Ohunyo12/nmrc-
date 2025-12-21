import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralReleaseRoutingModule } from './collateral-release-routing.module';
import { CollateralReleaseComponent } from 'app/credit/collateral';

@NgModule({
  imports: [
    CommonModule,
    CollateralReleaseRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CollateralReleaseComponent]
})
export class CollateralReleaseModule { }
