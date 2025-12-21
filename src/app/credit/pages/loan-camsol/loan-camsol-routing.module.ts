import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanCamsolComponent } from 'app/credit/loan-management/loan-camsol/loan-camsol.component';

const routes: Routes = [{
  path: '',
  component: LoanCamsolComponent,
  data: { activities: ['risk assessment'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanCamsolRoutingModule { }
