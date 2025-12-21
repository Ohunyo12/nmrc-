import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { GlobalInterestRateChangeComponent } from 'app/credit//global-interest-rate-change.component';

const routes: Routes = [{
  path: '',
  //component: GlobalInterestRateChangeComponent,
  data: { activities: ['global interest rate change'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalInterestRateChangeRoutingModule { }
