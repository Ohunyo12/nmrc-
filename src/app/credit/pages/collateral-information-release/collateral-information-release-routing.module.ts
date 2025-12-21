import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralInformationReleaseComponent } from 'app/credit/collateral/information/collateral-information-release.component';

const routes: Routes = [{
  path: '',
  component: CollateralInformationReleaseComponent,
  data: { activities: ['collateral information'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollateralInformationReleaseRoutingModule { }
