import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanRecoveryPaymentComponent } from 'app/credit/loan-management/loan-recovery-payment/loan-recovery-payment.component';

const routes: Routes = [{
  path: '',
  component: LoanRecoveryPaymentComponent,
  data: { activities: ['aps request'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppLoanRecoveryPaymentRoutingModule { }
