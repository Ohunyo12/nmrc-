import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { TakeFeeComponent } from 'app/credit/loan-management/take-fee/take-fee.component';

const routes: Routes = [{
  path: '',
  //component: TakeFeeComponent,
  data: { activities: ['manual fee'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TakeFeeRoutingModule { }
