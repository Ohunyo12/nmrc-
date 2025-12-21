import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacilityDetailSummaryComponent } from 'app/credit/loans/facility-detail-summary/facility-detail-summary.component';

const routes: Routes = [{
  path: '',
  component: FacilityDetailSummaryComponent,
  data: { activities: ['facility detail summary'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacilityDetailSummaryRoutingModule { }
