import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BondsAndGuaranteeComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: ``,
  component: BondsAndGuaranteeComponent,
  data: { activities: ['bonds and guarantee'] },

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BondsAndGuaranteeRoutingModule { }
