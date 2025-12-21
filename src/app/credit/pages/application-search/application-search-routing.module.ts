import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { LoanApplicationSearchComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  //component: LoanApplicationSearchComponent,
  data: { activities: ['credit application status'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationSearchRoutingModule { }
