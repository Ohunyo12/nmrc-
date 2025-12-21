import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanReviewAvailmentComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: LoanReviewAvailmentComponent,
  data: { activities: ['lms availment'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanReviewApprovalAvailmentRoutingModule { }
