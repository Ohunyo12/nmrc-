import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralReleaseAwaitingJobRequestComponent } from 'app/credit/collateral/information/collateral-release-awaiting-job-request.component';

const routes: Routes = [{
  path: '',
  component: CollateralReleaseAwaitingJobRequestComponent,
  data: { activities: ['collateral information'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollateralReleaseAwaitingJobRequestRoutingModule { }
