import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { LoanPrepaymentComponent } from 'app/credit/loan-management/loan-prepayment/loanprepayment.component';

const routes: Routes = [{
  path: '',
  //component: LoanPrepaymentComponent,
  data: { activities: ['prepayment']}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanPrepaymentRoutingModule { }
