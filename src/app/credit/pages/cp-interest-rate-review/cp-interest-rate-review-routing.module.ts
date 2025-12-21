import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CPInterestRateReviewComponent } from 'app/credit/components';

const routes: Routes = [{
  path: '',
  component: CPInterestRateReviewComponent,
  data: { activities: ['commercial loan rate review'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CpInterestRateReviewRoutingModule { }
