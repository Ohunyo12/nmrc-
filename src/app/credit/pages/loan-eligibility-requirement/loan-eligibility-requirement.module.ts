import { BankingSharedModule } from "app/shared/shared.module";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanEligibilityRequirementRoutingModule } from './loan-eligibility-requirement-routing.module';
import { LoanEligibilityRequirementsComponent } from 'app/credit/loans';

@NgModule({
  imports: [
    CommonModule,
    LoanEligibilityRequirementRoutingModule,
    BankingSharedModule
  ],
  //declarations: [LoanEligibilityRequirementsComponent]
})
export class LoanEligibilityRequirementModule { }
