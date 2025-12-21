import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanApplicationsListComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: LoanApplicationsListComponent,
  data: { activities: ['credit applications'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanApplicationListRoutingModule { }
