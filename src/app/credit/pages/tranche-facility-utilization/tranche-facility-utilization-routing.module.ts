import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrancheFacilityUtilizationComponent } from 'app/credit/loans/facility-details/tranche-facility-utilization.component';

const routes: Routes = [{
  path: '',
  component: TrancheFacilityUtilizationComponent,
  data: { activities: ['booking request'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrancheFacilityUtilizationRoutingModule { }
