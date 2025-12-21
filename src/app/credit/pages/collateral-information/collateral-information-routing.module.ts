import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralInformationComponent } from 'app/credit/collateral';

const routes: Routes = [
  {
    path: '',
    component: CollateralInformationComponent,
    data: { activities: ['collateral information'] }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollateralInformationRoutingModule { }
