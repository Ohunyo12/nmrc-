import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanOperationsComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: LoanOperationsComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanOperationsRoutingModule { }
