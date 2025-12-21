import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanRestructuringComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: LoanRestructuringComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRestructuringRoutingModule { }
