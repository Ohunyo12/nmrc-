import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FXRevolvingLoanReviewOperationsComponent } from 'app/credit/loan-management/fx-revolving-loan-operations/fx-revolving-loan-operation.component';

const routes: Routes = [ {
  path: '',
  component: FXRevolvingLoanReviewOperationsComponent,
  data: { activities: ['fx revolving loan operations'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxRevolvingLoanOperationRoutingModule { }
