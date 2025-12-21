import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralReleaseListComponent } from 'app/credit/collateral/information/collateral-release-list.component';

const routes: Routes = [{
  path: '',
  component: CollateralReleaseListComponent,
  data: { activities: ['collateral information'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollateralReleaseListRoutingModule { }
