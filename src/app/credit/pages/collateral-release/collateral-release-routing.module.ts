import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralReleaseComponent } from 'app/credit/collateral';

const routes: Routes = [{
  path: '',
  component: CollateralReleaseComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollateralReleaseRoutingModule { }
