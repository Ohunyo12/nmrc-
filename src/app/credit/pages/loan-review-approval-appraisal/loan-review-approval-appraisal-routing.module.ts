import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanReviewAppraisalComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: LoanReviewAppraisalComponent,
  data: { activities: ['lms appraisal'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanReviewApprovalAppraisalRoutingModule { }
