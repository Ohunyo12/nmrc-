import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RiskAssessmentComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: RiskAssessmentComponent,
  data: { activities: ['risk assessment'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskAssessmentRoutingModule { }
