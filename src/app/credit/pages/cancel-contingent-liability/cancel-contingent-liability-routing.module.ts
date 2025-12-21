import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { CancelContingentLiabilityComponent } from 'app/credit/loan-management/cancel-contingent-liability/cancel-contingent-liability.component';

const routes: Routes = [{
  path: '',
  //component: CancelContingentLiabilityComponent,
  data: { activities: ['recovery operations'] },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancelContingentLiabilityRoutingModule { }
