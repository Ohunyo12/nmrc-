import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanFeeConcessionComponent } from 'app/credit/loans/loan-fee-concession/loan-fee-concession.component';

const routes: Routes = [{
  path: '',
  component: LoanFeeConcessionComponent,
  data: { activities: ['loan fee concessions'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeConcessionRoutingModule { }
