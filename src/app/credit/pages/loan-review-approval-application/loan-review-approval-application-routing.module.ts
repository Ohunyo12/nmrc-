//mport { LoanReviewApplicationComponent } from './../../loan-management/loan-review-approval/application/loan-review-application.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  //component: LoanReviewApplicationComponent,
  data: { activities: ['lms application'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanReviewApprovalApplicationRoutingModule { }
