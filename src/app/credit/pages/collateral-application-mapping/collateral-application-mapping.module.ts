import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralApplicationMappingRoutingModule } from './collateral-application-mapping-routing.module';
import { CollateralMappingComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    CollateralApplicationMappingRoutingModule,
    BankingSharedModule
  ],
  declarations: [
    //CollateralMappingComponent
  ]
})
export class CollateralApplicationMappingModule { }
