import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralInformationReleaseRoutingModule } from './collateral-information-release-routing.module';
import { CollateralInformationReleaseComponent } from 'app/credit/collateral/information/collateral-information-release.component';

@NgModule({
  imports: [
    CommonModule,
    CollateralInformationReleaseRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CollateralInformationReleaseComponent]
})
export class CollateralInformationReleaseModule { }
