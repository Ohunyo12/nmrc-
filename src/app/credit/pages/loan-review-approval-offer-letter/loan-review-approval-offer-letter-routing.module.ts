import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanReviewOfferLetterComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: LoanReviewOfferLetterComponent,
  data: { activities: ['lms generate offer letter'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanReviewApprovalOfferLetterRoutingModule { }
