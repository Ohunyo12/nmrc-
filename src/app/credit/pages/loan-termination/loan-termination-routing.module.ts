import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { LoanTerminationComponent } from 'app/credit/loan-management/loan-termination/loantermination.component';

const routes: Routes = [{
  path: '',
  data: { activities: ['termination'] },
  //component: LoanTerminationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanTerminationRoutingModule { }
