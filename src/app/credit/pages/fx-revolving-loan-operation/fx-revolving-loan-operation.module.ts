import { BankingSharedModule } from "./../../../shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FxRevolvingLoanOperationRoutingModule } from './fx-revolving-loan-operation-routing.module';
import { FXRevolvingLoanReviewOperationsComponent } from 'app/credit/loan-management/fx-revolving-loan-operations/fx-revolving-loan-operation.component';

@NgModule({
  imports: [
    CommonModule,
    FxRevolvingLoanOperationRoutingModule,
    BankingSharedModule
  ],
  //declarations: [FXRevolvingLoanReviewOperationsComponent]
})
export class FxRevolvingLoanOperationModule { }
