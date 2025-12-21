import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { LoanRecoveryRepaymentApprovalComponent } from 'app/credit/loan-management/loan-recovery-repayment-approval/loan-recovery-repayment-approval.component';

const routes: Routes = [{
  path: '',
  //component: LoanRecoveryRepaymentApprovalComponent,
  data: { activities: ['risk assessment'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRecoveryRepaymentApprovalRoutingModule { }
