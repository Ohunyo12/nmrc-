import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanRefinancingComponent } from 'app/credit/loans/loan-refinancing/loan-refinancing.component';


const routes: Routes = [{
  path: '',
  component: LoanRefinancingComponent,
  data: { activities: ['ATC Lodgement'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRefinancingRoutingModule { }



