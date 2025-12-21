import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollateralAssignmentRoutingModule } from './collateral-assignment-routing.module';
import { CollateralAssignmentComponent } from 'app/credit/collateral';

@NgModule({
  imports: [
    CommonModule,
    CollateralAssignmentRoutingModule,
    BankingSharedModule
  ],
  //declarations: [CollateralAssignmentComponent]
})
export class CollateralAssignmentModule { }
