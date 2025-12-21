import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { FacilityLineReviewOperationsComponent } from 'app/credit/loan-management/facility-line-operations/line-operation.component';

const routes: Routes = [ {
  path: '',
  //component: FacilityLineReviewOperationsComponent,
  data: { activities: ['facility-line-operations'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityLineOperationsRoutingModule { }
