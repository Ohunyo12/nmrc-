import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralInformationViewComponent } from 'app/credit/collateral';

const routes: Routes = [{
  path: '',
  component: CollateralInformationViewComponent,
  data: { activities: ['NOT_IMPLEMENTED'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollateralInformationViewRoutingModule { }
