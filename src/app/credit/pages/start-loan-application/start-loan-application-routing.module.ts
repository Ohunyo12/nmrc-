import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartLoanApplicationComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: StartLoanApplicationComponent,
  data: { activities: ['start credit application'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartLoanApplicationRoutingModule { }
