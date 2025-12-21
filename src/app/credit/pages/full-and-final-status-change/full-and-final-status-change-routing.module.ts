import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { FullAndFinalStatusChangeComponent } from 'app/credit/loan-management/full-and-final-status-change/full-and-final-status-change.component';

const routes: Routes = [{
  path: '',
  //component: FullAndFinalStatusChangeComponent,
  data: { activities: ['full and final writeoff'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FullAndFinalStatusChangeRoutingModule { }
