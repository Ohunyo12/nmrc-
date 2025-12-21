import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { ContingentLiabilityTreminateRebookComponent } from 'app/credit/loan-management/contingent-liability-terminate-rebook/contingent-liability-terminate-rebook.component';

const routes: Routes = [{
  path: '',
  //component: ContingentLiabilityTreminateRebookComponent,
  data: { activities: ['recovery operations'] }
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContingentLiabilityTerminateRebookRoutingModule { }
