import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanRecoveryPaymentPlanComponent } from 'app/credit/loan-management/loanrecovery-paymentplan/loanrecoverypaymentplan.component';

const routes: Routes = [
  {
    path: '',
    component: LoanRecoveryPaymentPlanComponent,
    data: { activities: ['recovery payment plan'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRecoveryPaymentPlanRoutingModule { }
