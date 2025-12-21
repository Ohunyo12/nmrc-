import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [{
  path: '',
  //component: LoanReviewApplicationSearchComponent,
  data: { activities: ['credit application status'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefinancingLoanReviewRoutingModule { }
