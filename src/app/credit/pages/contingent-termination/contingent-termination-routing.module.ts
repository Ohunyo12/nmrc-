import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ContingentTerminationComponent } from 'app/credit/loan-management/contingent-termination/contingent-termination.component';

const routes: Routes = [
  {
    path: '',
    //component: ContingentTerminationComponent,
    data: { activities: ['recovery operations'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContingentTerminationRoutingModule { }
