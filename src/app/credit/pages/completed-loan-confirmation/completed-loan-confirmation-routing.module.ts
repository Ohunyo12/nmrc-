import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompletedLoanConfirmationComponent } from 'app/credit/loans/completed-loan-confirmation/completed-loan-confirmation.component';

const routes: Routes = [{
  path: '',
  component: CompletedLoanConfirmationComponent,
  data: { activities: ['schedule simulation'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompletedLoanConfirmationRoutingModule { }
