import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreliminaryEvaluationViewComponent } from 'app/credit/loans';

const routes: Routes = [{
  path: '',
  component: PreliminaryEvaluationViewComponent,
  data: { activities: ['preliminary evaluation notes'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreliminaryEvaluationViewRoutingModule { }
