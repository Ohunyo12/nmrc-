import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FXRevolvingLoanPaymentComponent } from 'app/credit/loan-management/fx-loan-payment/fx-revolving-loan-payment.component';

const routes: Routes = [{
  path: '',
  data: { activities: ['fx loan payment'] },
  component: FXRevolvingLoanPaymentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxLoanPaymentRoutingModule { }
