import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { LoanReviewApplicationSearchComponent } from 'app/credit/loan-management/loan-review-application-search/loan-review-application-search.component';

const routes: Routes = [{
  path: '',
  //component: LoanReviewApplicationSearchComponent,
  data: { activities: ['credit application status'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanReviewApplicationSearchRoutingModule { }
