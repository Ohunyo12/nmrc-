import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditAppraisalComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: CreditAppraisalComponent,
  data: { activities: ['credit appraisal'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditAppraisalRoutingModule { }
