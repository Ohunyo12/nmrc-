import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConditionChecklistComponent } from 'app/credit/loans/loan-checklist/condition-checklist.component';

const routes: Routes = [{
  path: '',
  component : ConditionChecklistComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConditionChecklistRoutingModule { }
