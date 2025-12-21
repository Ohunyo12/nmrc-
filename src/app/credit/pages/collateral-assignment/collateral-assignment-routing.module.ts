import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralAssignmentComponent } from 'app/credit/collateral';

const routes: Routes = [{ // duplicate url
  path: '',
  component: CollateralAssignmentComponent,
  data: { activities: ['collateral assignment'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollateralAssignmentRoutingModule { }
