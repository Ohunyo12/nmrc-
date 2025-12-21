import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContingentFacilityReleaseComponent } from 'app/credit/loans/booking/contingent-release.component';

const routes: Routes = [{
  path: '',
  component:  ContingentFacilityReleaseComponent,
  data: { activities: ['bonds and guarantee'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanContingentRoutingModule { }
