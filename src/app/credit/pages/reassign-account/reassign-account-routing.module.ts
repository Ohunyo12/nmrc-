import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReassignAccountComponent } from 'app/credit/loan-management/reassignaccount/reassignaccount.component';

const routes: Routes = [{
  path: '',
  component: ReassignAccountComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReassignAccountRoutingModule { }
