import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanPerformanceComponent } from 'app/credit/loan-management/loan-performance/loan-performance.component';

const routes: Routes = [{
  path: '',
  component: LoanPerformanceComponent,
  data: { activities: ['loan operations'] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanPerformanceRoutingModule { }
