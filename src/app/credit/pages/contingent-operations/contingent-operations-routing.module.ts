import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ContingentOpreationComponent } from 'app/credit/loan-management/contingent-operations/contingent-operations.component';

const routes: Routes = [{
  path: '',
  //component: ContingentOpreationComponent,
  data: { activities: ['recovery operations'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContingentOperationsRoutingModule { }
