import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanReviewOperationsComponent } from 'app/credit/loan-management/loan-operations/loan-review-operation.component';

const routes: Routes = [ {
  path: '',
  component: LoanReviewOperationsComponent,
  data: { activities: ['loan operations'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanReviewOperationRoutingModule { }
