import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralReleaseListRoutingModule } from './collateral-release-list-routing.module';
import { CollateralReleaseListComponent } from 'app/credit/collateral/information/collateral-release-list.component';

@NgModule({
  imports: [
    CommonModule,
    CollateralReleaseListRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CollateralReleaseListComponent]
})
export class CollateralReleaseListModule { }
