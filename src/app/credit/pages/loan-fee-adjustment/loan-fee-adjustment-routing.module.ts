import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanFeeAdjustmentComponent } from 'app/credit/loan-management/loan-fee-adjustment/loan-fee-adjustment.component';

const routes: Routes = [ {
  path: '',
  component: LoanFeeAdjustmentComponent,
  data: { activities: ['loan operations'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanFeeAdjustmentRoutingModule { }
