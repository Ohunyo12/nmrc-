import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanApplicationDetailsComponent } from 'app/credit/loans/application/loan-application-details.component';

const routes: Routes = [{
path: '',
component: LoanApplicationDetailsComponent,
data: { activities: ['start credit application'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanApplicationDetailsRoutingModule { }
