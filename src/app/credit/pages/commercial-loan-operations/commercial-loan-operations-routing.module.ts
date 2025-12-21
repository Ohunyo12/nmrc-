import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { CommercialLoanReviewOperationsComponent } from 'app/credit/loan-management/commercial-loan-operations/commercial-loan-operations.component';

const routes: Routes = [{
  path: '',
 // component: CommercialLoanReviewOperationsComponent,
  data: { activities: ['commercial loan operations'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommercialLoanOperationsRoutingModule { }
